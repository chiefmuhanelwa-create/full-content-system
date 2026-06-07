import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit } from '@/lib/rate-limit'
import { buildSystemPrompt } from '@/lib/knowledge-base'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { framework, storyType, rawStory, coreMessage, targetEmotion, duration, voiceProfile } = body

    if (!framework || !rawStory || !coreMessage) {
      return NextResponse.json(
        { error: 'Missing required fields: framework, rawStory, and coreMessage are required' },
        { status: 400 }
      )
    }

    let voiceInstructions = ''
    if (voiceProfile?.name) {
      voiceInstructions = `

## VOICE PROFILE
Creator: ${voiceProfile.name}
Cadence: ${voiceProfile.cadence}
Vocabulary: ${voiceProfile.vocabulary}
Perspective: ${voiceProfile.perspective}
Vulnerability Level: ${voiceProfile.vulnerabilityLevel}
Energy: ${voiceProfile.energy}
${voiceProfile.signaturePhrases?.length ? `\nSIGNATURE PHRASES (use naturally):\n${voiceProfile.signaturePhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
${voiceProfile.avoidPhrases?.length ? `\nAVOID:\n${voiceProfile.avoidPhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
${voiceProfile.exampleContent ? `\nVOICE EXAMPLE:\n${voiceProfile.exampleContent.substring(0, 500)}...` : ''}
CRITICAL: Write in THEIR voice, not a generic voice.`
    }

    const systemPrompt = buildSystemPrompt('stories') + voiceInstructions

    const userPrompt = `Transform this raw story using the ${framework} framework.

RAW STORY:
${rawStory}

CORE MESSAGE/LESSON:
${coreMessage}

${storyType ? `STORY TYPE: ${storyType}` : ''}
${targetEmotion ? `TARGET EMOTION: ${targetEmotion}` : ''}
TARGET DURATION: ${duration} seconds

## OUTPUT FORMAT
Return ONLY a JSON object:
{
  "title": "Compelling 6-8 word title",
  "framework": "${framework}",
  "fullStory": "Complete story ready to be performed. Natural paragraph breaks. First person if input is first person. Flows like a real conversation — not an essay. Every line follows the 4 Foundational Principles.",
  "breakdown": [
    { "stage": "Stage name from ${framework}", "content": "What happens here (2-3 sentences)", "duration": "X seconds" }
  ],
  "emotionalBeats": [
    "First beat",
    "Second beat",
    "Third beat",
    "Fourth beat",
    "Fifth beat"
  ],
  "hooks": [
    "Hook variation 1 — curiosity gap style, You Format",
    "Hook variation 2 — transformation style, WHAT+WHY first",
    "Hook variation 3 — shock/harsh truth style"
  ],
  "applicationTips": [
    "Best platform/format for this story",
    "How to adapt for different durations",
    "What Shadow Fear this activates and how to amplify",
    "Which PAIDS category this serves"
  ],
  "compliance": {
    "icp": "ICP 1 — Called Expert | ICP 2 — Content Creator Inspirer",
    "shadowFear": "Name (#number)",
    "villain": "The system/situation villain in this story",
    "atomicShareLine": "The one line viewers can share verbatim",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "section13": {
      "hookQuality": "✅/❌",
      "wStackOrder": "✅/❌",
      "intensity": "✅/❌ — starts at 70%+ intensity",
      "villainContrast": "✅/❌ — [villain named]",
      "wordEconomy": "✅/❌",
      "youFormat": "✅/❌",
      "audibleFlow": "✅/❌",
      "emotionalPeak": "✅/❌ — [the peak moment]",
      "atomicSharability": "✅/❌ — [the line]",
      "africaContext": "✅/❌"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3500,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let storyOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      storyOutput = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json({ error: 'Failed to parse story output. Please try again.' }, { status: 500 })
    }

    if (!storyOutput.fullStory || !storyOutput.breakdown || !storyOutput.hooks) {
      return NextResponse.json({ error: 'Invalid story output structure. Please try again.' }, { status: 500 })
    }

    return NextResponse.json(storyOutput)
  } catch (error: any) {
    console.error('Storytelling generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate story' }, { status: 500 })
  }
}
