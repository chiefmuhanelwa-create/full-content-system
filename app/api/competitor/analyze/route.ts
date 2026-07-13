import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { competitorName, content } = await request.json()

    const systemPrompt = `You are the NOCHILL Competitive Intelligence System for Ndivhuwo Muhanelwa (@nochill_god).

NOCHILL FRAMEWORK CONTEXT:
ICP 1 — Called Expert (32-50, professional with unexploited expertise). Language: "your knowledge is worth more than your salary"
ICP 2 — Content Creator Inspirer (18-35, posting daily but not earning). Language: "you're posting every day and still broke"

10 SHADOW FEARS (never name directly in content — activate implicitly):
SF1 Wasted Life | SF2 Time Anxiety | SF3 Imposter Syndrome | SF4 Generational Poverty Trap | SF5 Relationship Loss | SF6 Wrong Path Terror | SF7 Invisible Labour | SF8 Spiritual Crisis | SF9 Platform Dependency | SF10 Legacy Void

RACUB HOOK FORMULA: Relevant x Awareness level x Clarity of outcome x Unique angle ^ Broadened reach

NOCHILL EDGE: SA context, ZAR pricing, verified proof numbers (R750 to R100K, R23K affiliate day, 780K followers lost + rebuilt), raw unfiltered voice that most creators won't use.

Analyse competitor content through this lens to find gaps Ndivhuwo can own. Return ONLY valid JSON (no markdown fences):
{
  "topHookPatterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4", "pattern 5"],
  "contentGaps": ["gap 1", "gap 2", "gap 3", "gap 4", "gap 5"],
  "strengthsWeaknesses": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"]
  },
  "opportunities": ["NOCHILL opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4", "opportunity 5"],
  "shadowFearGaps": ["fears they are missing that Ndivhuwo owns"]
}`

    const prompt = `Analyze this competitor's content through the NOCHILL lens:

COMPETITOR: ${competitorName || 'Unknown'}
CONTENT SAMPLES:
${content}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ analysis })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 })
  }
}
