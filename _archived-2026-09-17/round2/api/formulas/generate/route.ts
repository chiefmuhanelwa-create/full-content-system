import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'
// content-formulas.json removed — 9-step NOCHILL shell supersedes timing-based formulas
const contentFormulas: Record<string, unknown> = {}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { contentType, formula, platform, topic, keyPoints, personalStory, voiceProfile } = body

    if (!contentType || !formula || !platform || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType, formula, platform, and topic are required' },
        { status: 400 }
      )
    }

    let voiceInstructions = ''
    if (voiceProfile?.name) {
      voiceInstructions = `

## VOICE PROFILE
Creator: ${voiceProfile.name}
Cadence: ${voiceProfile.cadence} | Vocabulary: ${voiceProfile.vocabulary}
Perspective: ${voiceProfile.perspective} | Energy: ${voiceProfile.energy}
${voiceProfile.signaturePhrases?.length ? `\nSIGNATURE PHRASES:\n${voiceProfile.signaturePhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
${voiceProfile.avoidPhrases?.length ? `\nAVOID:\n${voiceProfile.avoidPhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
CRITICAL: Write in THEIR voice, not a generic voice.`
    }

    const formulaType = contentType === 'talking-head' ? 'talkingHeadFormulas' : 'youtubeFormulas'
    const formulaData = (contentFormulas as any)[formulaType] || {}

    const systemPrompt = `You are the NOCHILL Content Intelligence System for Ndivhuwo Muhanelwa (@nochill_god), South African content creator and business founder.

BRAND VOICE: Direct. Raw. Tough-love mentor. No filler. Short punchy sentences. YOU format (never they/people/someone). SA/African context — ZAR not dollars, Mzansi not Africa.
BANNED WORDS: journey, unlock, game-changer, empower, synergy, leverage, guru, hustle, grind, crush it, seamless, delve, certainly.

⛔ RETIRED 2026-09-17 — never use: "Called Expert", the ICP1/ICP2 split, ages 32–50, R9,000–R45,000, R9,997–R18,000.
RULED CUSTOMER: the creator whose income is decided by somebody else, and who finds out afterwards. Gate: money has moved, or money is visibly blocked — AND another human being appears in their fear.
TIERS: FREE R0 the Beginner Aspirant (never sold to) · ENTRY R350–R499 the Blocked · CORE R1,500–R1,800 the Underpriced & Unreserved · PREMIUM $499/R9,000 the Asset-Backed Contentpreneur.
PILLARS: KEEP IT 30 · PRICE IT 25 · OWN IT 20 · BUILD IT ANYWAY 15 · PROVE IT 10.

10 SHADOW FEARS (never name directly — activate implicitly):
SF1 Wasted Life | SF2 Time Anxiety | SF3 Imposter Syndrome | SF4 Generational Poverty Trap | SF5 Relationship Loss | SF6 Wrong Path Terror | SF7 Invisible Labour | SF8 Spiritual Crisis | SF9 Platform Dependency | SF10 Legacy Void

RACUB HOOK FORMULA: Relevant x Awareness x Clarity of outcome x Unique angle, Broadened reach. Max 25 words. 70% intensity from word one.
PAIDS: Products / Ads+Affiliates / Information / Deals / Services
4E: Educate / Entertain / Encourage / Earn (Earn <= 10%)
PROOF NUMBERS (use exactly these, nothing else): R15,000 standing rate → R45,000 once costed, April 2020 | first deal R350, second R750 the same month | R23,524 affiliate commission across MARCH 2019 (a month, not a day) | $22,180.93 remitted from Meta 2021–2025 | 780,000 followers lost (NEVER dated) | SARS assessment R207,879.20, UNPAID | ad account terminated end-2024, two appeals refused, second final May 2025 | lifetime bank-confirmed R453,710.37 across 2017–2025 | 19 named brands, 23 agencies | 270,283 Instagram followers | two published books | email list 173 | R6,000 first phone 2014
⛔ BANNED, never output: R132,500 · R750→R100K · "R100,000 per post" · R600K/R600,000 or any annual total · Samsung R450,000 · Huawei as deal proof · Savanna R25K/R100K/R300K · AdSense R180,000 · "Ads & Affiliates R800,000+" · Netflix figures (under NDA — publish neither) · "50 brand deals"/"40+ brands" · R285K/R207K/R162,174/R45,705 SARS variants · "SARS came for me" · "47 subscribers"/"50,000 email list" · "18% engagement" · "600k"/"millions of followers"/"3 million" · R50K month → R8K crash · R84K course · "6,000+ books sold" · "R23,000 in ONE DAY" · any award total (say "award-winning").
⛔ NEVER NAME the employer, workplace, airport or industry — say "a full time job" / "night shifts" / "on shift". Article IV. Never name a real private individual — companies only.

Generate production-ready video scripts using content creation formulas.` + voiceInstructions

    const userPrompt = `Create a production-ready ${contentType} script using the ${formula} formula for ${platform}.

TOPIC/TITLE: ${topic}

KEY POINTS TO COVER:
${keyPoints}

${personalStory ? `PERSONAL STORY TO INCLUDE:\n${personalStory}` : ''}

## YOUR TASK
Apply the ${formula} formula structure while enforcing ALL NOCHILL Master Framework rules:
- ICP: Identify how this topic serves the ruled customer — the creator whose income is decided by somebody else, and who finds out afterwards
- Hook: R×A×C×U^B — WHAT+WHY first, 70% intensity from word one, max 25 words
- Villain: Name the system/situation villain — never a person
- Atomic share line: One line so tight the viewer can share it verbatim
- Retention loop: End with a tease for the next piece of content
- You Format: "you" throughout — no they/people/someone
- AFRICA Method: ZAR pricing, SA context, WhatsApp-friendly where relevant

Return ONLY a JSON object:
{
  "title": "Compelling video title optimized for ${platform}",
  "formula": "${formula}",
  "platform": "${platform}",
  "fullScript": "Complete script ready to be read on camera. Natural paragraph breaks. Write exactly how it should be spoken — conversational, short punchy sentences. Include [PAUSE] markers, [DIRECTION] notes, [TEXT OVERLAY: content] markers.",
  "structure": [
    {
      "section": "Section name from ${formula} formula",
      "duration": "X seconds",
      "content": "What happens in this section",
      "deliveryNotes": "Tone, energy, camera direction"
    }
  ],
  "visualSuggestions": [
    "Specific visual suggestion 1 (b-roll, text overlay, cut, timestamp)",
    "Specific visual suggestion 2",
    "Specific visual suggestion 3"
  ],
  ${platform === 'youtube' ? '"thumbnailIdeas": ["Thumbnail idea 1", "Thumbnail idea 2", "Thumbnail idea 3"],' : ''}
  "retentionTips": [
    "Specific retention tip 1 — where viewers might drop and how to re-hook",
    "Specific retention tip 2",
    "Specific retention tip 3"
  ],
  "compliance": {
    "icp": "legacy routing key only — icp1 | icp2. ⛔ 'Called Expert' and the 32–50 persona are RETIRED 2026-09-17; never write them into output copy",
    "shadowFear": "Name (#number)",
    "villain": "Named system/situation villain",
    "atomicShareLine": "The one line viewers can share verbatim",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "retentionLoop": "The exact retention loop tease line at the end",
    "section13": {
      "hookQuality": "✅/❌ — R×A×C×U^B check",
      "wStackOrder": "✅/❌ — WHAT+WHY leads",
      "intensity": "✅/❌ — 70%+ from word one",
      "rehooking": "✅/❌ — [cadence used]",
      "villainContrast": "✅/❌ — [villain named]",
      "wordEconomy": "✅/❌",
      "youFormat": "✅/❌",
      "audibleFlow": "✅/❌",
      "emotionalPeak": "✅/❌ — [the peak moment]",
      "atomicSharability": "✅/❌ — [the line]",
      "visualDirection": "✅/❌ — changes every 8s minimum",
      "ctaClarity": "✅/❌ — single CTA to owned channel",
      "retentionLoop": "✅/❌ — [the tease]",
      "businessOutcome": "✅/❌",
      "africaContext": "✅/❌"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let formulaOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      formulaOutput = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json({ error: 'Failed to parse formula output. Please try again.' }, { status: 500 })
    }

    if (!formulaOutput.fullScript || !formulaOutput.structure || !formulaOutput.visualSuggestions) {
      return NextResponse.json({ error: 'Invalid formula output structure. Please try again.' }, { status: 500 })
    }

    if (platform !== 'youtube' && formulaOutput.thumbnailIdeas) {
      delete formulaOutput.thumbnailIdeas
    }

    return NextResponse.json(formulaOutput)
  } catch (error: any) {
    console.error('Formula generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate formula' }, { status: 500 })
  }
}
