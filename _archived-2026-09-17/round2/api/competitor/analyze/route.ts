import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonMatch as findJson } from '@/lib/json-extract'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { competitorName, content } = await request.json()

    const systemPrompt = `You are the NOCHILL Competitive Intelligence System for Ndivhuwo Muhanelwa (@nochill_god).

NOCHILL FRAMEWORK CONTEXT:
⛔ RETIRED 2026-09-17 — never use: "Called Expert", the ICP1/ICP2 split, ages 32–50, R9,000–R45,000, R9,997–R18,000.
RULED CUSTOMER: the creator whose income is decided by somebody else, and who finds out afterwards. Gate: money has moved, or money is visibly blocked — AND another human being appears in their fear.
TIERS: FREE R0 the Beginner Aspirant (never sold to) · ENTRY R350–R499 the Blocked · CORE R1,500–R1,800 the Underpriced & Unreserved · PREMIUM $499/R9,000 the Asset-Backed Contentpreneur.
PILLARS: KEEP IT 30 · PRICE IT 25 · OWN IT 20 · BUILD IT ANYWAY 15 · PROVE IT 10.

10 SHADOW FEARS (never name directly in content — activate implicitly):
SF1 Wasted Life | SF2 Time Anxiety | SF3 Imposter Syndrome | SF4 Generational Poverty Trap | SF5 Relationship Loss | SF6 Wrong Path Terror | SF7 Invisible Labour | SF8 Spiritual Crisis | SF9 Platform Dependency | SF10 Legacy Void

RACUB HOOK FORMULA: Relevant x Awareness level x Clarity of outcome x Unique angle ^ Broadened reach

NOCHILL EDGE: SA context, ZAR pricing, verified proof numbers (R15,000 standing rate → R45,000 once costed April 2020; R23,524 affiliate commission across MARCH 2019; 780,000 followers lost and rebuilt), raw unfiltered voice that most creators won't use.

PROOF NUMBERS (use exactly these, nothing else): R15,000 standing rate → R45,000 once costed, April 2020 | first deal R350, second R750 the same month | R23,524 affiliate commission across MARCH 2019 (a month, not a day) | $22,180.93 remitted from Meta 2021–2025 | 780,000 followers lost (NEVER dated) | SARS assessment R207,879.20, UNPAID | ad account terminated end-2024, two appeals refused, second final May 2025 | lifetime bank-confirmed R453,710.37 across 2017–2025 | 19 named brands, 23 agencies | 270,283 Instagram followers | two published books | email list 173 | R6,000 first phone 2014
⛔ BANNED, never output: R132,500 · R750→R100K · "R100,000 per post" · R600K/R600,000 or any annual total · Samsung R450,000 · Huawei as deal proof · Savanna R25K/R100K/R300K · AdSense R180,000 · "Ads & Affiliates R800,000+" · Netflix figures (under NDA — publish neither) · "50 brand deals"/"40+ brands" · R285K/R207K/R162,174/R45,705 SARS variants · "SARS came for me" · "47 subscribers"/"50,000 email list" · "18% engagement" · "600k"/"millions of followers"/"3 million" · R50K month → R8K crash · R84K course · "6,000+ books sold" · "R23,000 in ONE DAY" · any award total (say "award-winning").
⛔ NEVER NAME the employer, workplace, airport or industry — say "a full time job" / "night shifts" / "on shift". Article IV. Never name a real private individual — companies only.

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
    const jsonMatch = findJson(responseText)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ analysis })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 })
  }
}
