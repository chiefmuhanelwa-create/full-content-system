import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { contentContext, goal } = await request.json()

    const systemPrompt = buildSystemPrompt('scripts') + `

## CTA OPTIMIZER — SPECIFIC RULES
Generate CTAs that follow the NOCHILL system:
- Each CTA must map to ONE of the PAIDS revenue streams (Products/Ads & Affiliates/Information/Deals/Services)
- CTAs must use shadow fear psychology — the CTA is the resolution to the fear activated in the content
- SA-first language: "DM me", "comment GUIDE below", "link in bio", "drop your question" — not generic "click here"
- ManyChat keywords where relevant: GUIDE, START, PAIDS, FREE, SYSTEM, MEDIA
- Single imperative verb. No compound CTAs ("like, share, AND comment").
- Collective framing: "We" and "Let's" where natural (Ubuntu principle)
- Urgency WITHOUT false scarcity. Real deadlines only.

Return ONLY JSON (no markdown):
{
  "customCTAs": ["CTA 1 (PAIDS stream: X)", "CTA 2", "CTA 3", "CTA 4", "CTA 5"],
  "platformSpecific": {
    "instagram": "DM-first or comment-keyword CTA",
    "tiktok": "comment or stitch CTA",
    "youtube": "description link + comment CTA",
    "linkedin": "connection or DM CTA"
  },
  "testingAdvice": "A/B test guidance in NOCHILL voice"
}`

    const prompt = `Generate NOCHILL-system CTAs for this content:

CONTENT: ${contentContext}
GOAL: ${goal}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ suggestions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}
