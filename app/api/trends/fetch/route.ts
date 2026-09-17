import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { niche, platform } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are the NOCHILL Trend Intelligence System for Ndivhuwo Muhanelwa (@nochill_god).

Identify trends through the NOCHILL ICP lens:
⛔ RETIRED 2026-09-17 — never use: "Called Expert", the ICP1/ICP2 split, ages 32–50, R9,000–R45,000, R9,997–R18,000.
RULED CUSTOMER: the creator whose income is decided by somebody else, and who finds out afterwards. Gate: money has moved, or money is visibly blocked — AND another human being appears in their fear.
TIERS: FREE R0 the Beginner Aspirant (never sold to) · ENTRY R350–R499 the Blocked · CORE R1,500–R1,800 the Underpriced & Unreserved · PREMIUM $499/R9,000 the Asset-Backed Contentpreneur.
PILLARS: KEEP IT 30 · PRICE IT 25 · OWN IT 20 · BUILD IT ANYWAY 15 · PROVE IT 10.
- SA/African market trends first — local viral conversations over global ones
- Shadow fears (activate implicitly): SF1 Wasted Life | SF2 Time Anxiety | SF3 Imposter Syndrome | SF4 Generational Poverty | SF9 Platform Dependency | SF10 Legacy Void
- PAIDS streams: Products / Ads+Affiliates / Information / Deals / Services
- Hook angles use YOU format, max 25 words, RACUB formula

Return a JSON ARRAY (not an object) with 8-10 trends. 2026 trends only. SA-context first.
[
  {
    "topic": "Short topic name (3-6 words)",
    "volume": "High | Medium | Rising",
    "platform": "${platform}",
    "relevance": 0-100,
    "icp": "ICP 1 | ICP 2 | Both",
    "shadowFear": "which NOCHILL shadow fear this trend activates",
    "hookAngle": "a NOCHILL hook for this trend in 25 words or less"
  }
]`

    const prompt = `Identify top trending topics for ${niche} on ${platform} right now (2026). Frame them through the NOCHILL ICP and shadow fear lens.`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ trends })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
