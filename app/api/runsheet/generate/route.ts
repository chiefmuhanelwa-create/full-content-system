import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl

  try {
    const body = await request.json()
    const {
      shootDate,
      contentPieces,
      location = 'home studio',
      equipment = [],
      totalDuration = '4 hours',
    } = body

    if (!contentPieces || !Array.isArray(contentPieces) || contentPieces.length === 0) {
      return NextResponse.json({ error: 'Content pieces array is required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt('hooks')

    const piecesText = contentPieces
      .map(
        (p: any, i: number) =>
          `${i + 1}. [${p.platform || 'instagram'}] ${p.topic} — Hook: ${p.hookIdea || 'TBD'} — Type: ${p.contentType || 'Educational'}`
      )
      .join('\n')

    const userPrompt = `Generate a professional shoot day runsheet for batch content creation.

SHOOT DATE: ${shootDate || 'This Sunday'}
LOCATION: ${location}
EQUIPMENT: ${equipment.length > 0 ? equipment.join(', ') : 'Smartphone + ring light + basic mic'}
TOTAL SESSION: ${totalDuration}
NUMBER OF PIECES: ${contentPieces.length}

CONTENT TO SHOOT:
${piecesText}

OUTPUT FORMAT (strict JSON):
{
  "runsheetTitle": "Shoot Day — [Date] — [X] Content Pieces",
  "preShootChecklist": [
    "Checklist item as a short action verb phrase"
  ],
  "schedule": [
    {
      "timeSlot": "9:00 AM – 9:30 AM",
      "activity": "Setup + warm-up",
      "type": "setup",
      "duration": "30 min",
      "notes": "What to do, check, or prepare"
    }
  ],
  "contentBlocks": [
    {
      "order": 1,
      "timeSlot": "9:30 AM – 9:50 AM",
      "contentTitle": "Topic name",
      "platform": "instagram",
      "hook": "Opening line — first words on camera",
      "keyPoints": ["Point 1", "Point 2", "Point 3"],
      "estimatedTakes": 2,
      "bRoll": ["B-roll shot 1", "B-roll shot 2"],
      "wardrobeNote": "Same outfit as piece 2 (batch these together)",
      "energyLevel": "high"
    }
  ],
  "batchingStrategy": "2-3 sentences on how to batch similar outfits/setups together to save time",
  "postShootActions": [
    "Transfer footage to phone/laptop",
    "Label clips by content piece number"
  ],
  "proTips": [
    "Tip for a more productive shoot day"
  ]
}

RUNSHEET RULES:
- Group pieces by outfit/location similarity to avoid unnecessary changes
- Schedule energy-intensive content (hooks, raw stories) when creator energy is highest (first 2 hours)
- Include buffer time between pieces (5-10 min for review)
- B-roll last — shoot all talking-head first
- Pre-shoot checklist = 8-12 items covering equipment, lighting, storage, mental prep
- postShootActions = file management + next steps for editing/scheduling
- Return ONLY valid JSON. No markdown fences.`

    const response = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'text', text: userPrompt },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = raw
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/\s*```$/m, '')
      .trim()

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)

    return NextResponse.json({ success: true, ...parsed })
  } catch (error: any) {
    console.error('Runsheet generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate runsheet' },
      { status: 500 }
    )
  }
}
