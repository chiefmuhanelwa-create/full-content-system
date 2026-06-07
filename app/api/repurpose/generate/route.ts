import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { script, formats } = await request.json()

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt('scripts')

    let prompt = `## REPURPOSE THIS NOCHILL SCRIPT

ORIGINAL SCRIPT:
${script}

## REPURPOSING RULES (NON-NEGOTIABLE)
Every repurposed format must maintain:
1. NOCHILL voice — tough-love mentor, direct, no fluff, conversational
2. You Format — "you" not "they/people/someone"
3. Negativity (indirect) — attack the problem, never the viewer
4. SA African context — ZAR pricing, SARS where relevant, WhatsApp-native where applicable
5. The villain from the original — system/situation, never a person
6. The core ICP — same audience, adapted format
7. One CTA per format — drives to owned channel (email, WhatsApp, community)
8. Atomic sharability — include at least one line that can be shared verbatim
9. Short & Simple — ruthless word economy

Generate the following formats:
`

    if (formats.shortClips) {
      prompt += `
1. THREE SHORT CLIPS (15-30s each):
   - Each must have its own hook (pattern interrupt, You Format, 70% intensity from word one)
   - Each opens and closes a curiosity loop
   - Keep villain contrast from original
   - Format: Clip 1: [script], Clip 2: [script], Clip 3: [script]
`
    }

    if (formats.carouselPosts) {
      prompt += `
2. CAROUSEL POST (7-10 slides, Instagram/LinkedIn):
   - Slide 1: Hook — pattern interrupt, You Format, max 10 words
   - Slides 2–8: Break down the core teaching (one point per slide, short punchy lines)
   - Last slide: Single CTA to owned channel
   - Each slide max 2 sentences. Screenshot-worthy. SA context maintained.
`
    }

    if (formats.thread) {
      prompt += `
3. TWITTER/X THREAD (8-12 tweets):
   - Tweet 1: Hook that stops scrolling — You Format, WHAT+WHY first
   - Tweets 2–10: Core content broken into punchy units
   - Last tweet: Single CTA
   - Each tweet max 280 characters. ZAR pricing. No generic advice.
`
    }

    if (formats.linkedinPost) {
      prompt += `
4. LINKEDIN POST:
   - Lead with hook (bold statement or story opener, not "Hey guys")
   - Short paragraphs, line breaks for readability
   - SA/African professional context
   - End with single discussion question or CTA
   - 300–500 words
`
    }

    if (formats.emailSequence) {
      prompt += `
5. 5-PART EMAIL SEQUENCE:
   - Email 1: Problem awareness — mirror their pain back (use verbatim language style)
   - Email 2: Agitate the problem — deepen the villain, the system keeping them stuck
   - Email 3: Introduce the solution — NOCHILL framework, specific and named
   - Email 4: Proof — real story from S001–S015 with exact numbers
   - Email 5: CTA — single clear offer or next step
   - Each email 150–250 words. Subject line included. SA context.
`
    }

    prompt += `
Return a JSON object:
{
  "shortClips": ["clip1 script", "clip2 script", "clip3 script"],
  "carouselPosts": ["slide1", "slide2", ...],
  "thread": "1. Tweet...\\n\\n2. Tweet...",
  "linkedinPost": "full post text",
  "emailSequence": ["email1 with subject", "email2", "email3", "email4", "email5"],
  "compliance": {
    "voiceApplied": "✅ NOCHILL tough-love mentor maintained",
    "youFormat": "✅ all YOU format — no they/people/someone",
    "negativityIndirect": "✅ attacks problem, not viewer",
    "africaContext": "✅ ZAR pricing, SA context, WhatsApp-native where applicable",
    "villain": "The system/situation villain carried across all formats",
    "atomicShareLine": "The most shareable single line across all formats",
    "ctaClarity": "✅ single CTA per format to owned channel"
  }
}
Only include keys for formats that were requested.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error repurposing content:', error)
    return NextResponse.json({ error: 'Failed to repurpose content' }, { status: 500 })
  }
}
