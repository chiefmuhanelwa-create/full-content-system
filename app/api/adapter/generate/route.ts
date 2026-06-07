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
    const { originalContent, platforms } = body

    if (!originalContent || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: originalContent and platforms are required' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt('scripts')

    const userPrompt = `Adapt this NOCHILL content for the following platforms: ${platforms.join(', ')}

ORIGINAL CONTENT:
${originalContent}

## NON-NEGOTIABLE NOCHILL RULES FOR ALL ADAPTATIONS
Every platform adaptation must maintain:
1. NOCHILL voice — tough-love mentor, direct, conversational, no fluff
2. You Format — "you" not "they/people/someone/folks"
3. Negativity (indirect) — attack the problem/system, never the viewer
4. SA African context — ZAR pricing, SARS references, WhatsApp delivery where applicable
5. The villain from the original — system/situation, never a person
6. One CTA per adaptation — drives to owned channel (email, WhatsApp, community, link in bio)
7. Atomic sharability — at least one line that can be shared verbatim
8. BANNED words: journey, unlock, game-changer, empower, synergy, leverage, guru, hustle, grind, crush it, seamless, robust
9. W-Stack: Lead with WHAT+WHY — not backstory, not context first

## PLATFORM-SPECIFIC NOCHILL RULES

### LinkedIn
- Open with pattern interrupt or bold statement (NOT "Hey guys" or "I wanted to share")
- Short paragraphs, line breaks — scannable at a glance
- Professional but raw — no corporate language
- SA/African professional context
- End with single discussion question or CTA
- 300–500 words optimal

### X/Twitter (Thread)
- Tweet 1: Hook that stops scrolling — You Format, WHAT+WHY first, max 280 chars
- Each tweet: one punchy idea, standalone value
- Number tweets: 1/X, 2/X
- End with CTA driving to owned channel
- 1-2 hashtags max in tweet 1 only
- 5–10 tweets

### Facebook
- Storytelling open — emotion first, not information first
- Casual but purposeful — no filler
- Community-focused (Ubuntu angle where authentic)
- Use line breaks for readability
- End with question or CTA to owned channel
- 2-3 hashtags

### Newsletter/Email
- Subject line: create genuine curiosity (not clickbait)
- Open like a letter to a friend
- Clear sections, subheadings for scannability
- Deliver real value — teach or transform
- Single CTA at the end
- 500–1500 words

Return ONLY a JSON object:
{
  "adaptedContent": [
    {
      "platform": "linkedin | twitter | facebook | newsletter",
      "content": "Full adapted content ready to post — maintain NOCHILL voice",
      "characterCount": 1234,
      "hashtags": ["#Tag1", "#Tag2"],
      "bestTimeToPost": "Platform-specific best time in SA timezone",
      "engagementTips": [
        "NOCHILL-specific tip for this platform",
        "Second tip",
        "Third tip"
      ]
    }
  ],
  "compliance": {
    "nochill_voice": "✅ Tough-love mentor maintained across all formats",
    "youFormat": "✅ all YOU format — no they/people/someone",
    "negativityIndirect": "✅ attacks problem/system, not viewer",
    "africaContext": "✅ ZAR pricing, SA context preserved",
    "villain": "Named system/situation villain carried across formats",
    "atomicShareLine": "The most shareable single line across all adaptations",
    "ctaClarity": "✅ single CTA per format to owned channel",
    "bannedWords": "✅ none used"
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

    let adapterOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      adapterOutput = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json({ error: 'Failed to parse adapter output. Please try again.' }, { status: 500 })
    }

    if (!adapterOutput.adaptedContent || !Array.isArray(adapterOutput.adaptedContent)) {
      return NextResponse.json({ error: 'Invalid adapter output structure. Please try again.' }, { status: 500 })
    }

    return NextResponse.json(adapterOutput)
  } catch (error: any) {
    console.error('Adapter generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to adapt content' }, { status: 500 })
  }
}
