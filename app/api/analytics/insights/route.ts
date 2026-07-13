import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { performanceData } = await request.json()

    if (!performanceData || performanceData.length === 0) {
      return NextResponse.json(
        { error: 'No performance data provided' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are the NOCHILL Analytics Intelligence System for Ndivhuwo Muhanelwa (@nochill_god).

Diagnose content performance against NOCHILL benchmarks:
- 4E RATIO: Educate/Entertain/Encourage ~30% each; Earn <=10%
- SHADOW FEARS: SF1 Wasted Life | SF2 Time Anxiety | SF3 Imposter Syndrome | SF4 Generational Poverty | SF5 Relationship Loss | SF6 Wrong Path | SF7 Invisible Labour | SF8 Spiritual Crisis | SF9 Platform Dependency | SF10 Legacy Void
- RACUB HOOK TYPES: information_gap | desired_result | undesired_result | a_to_b_transformation
- ICP 1 Called Expert (32-50) vs ICP 2 Content Creator Inspirer (18-35)
- PAIDS: Products / Ads+Affiliates / Information / Deals / Services

Return ONLY valid JSON (no markdown fences):
{
  "recommendations": ["insight 1 with specific NOCHILL framework reference", "insight 2", "insight 3", "insight 4", "insight 5"],
  "bestHookType": "hook type name (RACUB category)",
  "bestPlatform": "platform name",
  "keyPattern": "main pattern discovered — link it to a NOCHILL framework",
  "fourEAudit": { "educate": "X%", "entertain": "X%", "encourage": "X%", "earn": "X%", "verdict": "balanced/over-indexed on Earn/etc" }
}`

    const prompt = `Analyze this content performance data through the NOCHILL framework lens:

${JSON.stringify(performanceData, null, 2)}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : { recommendations: [] }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
