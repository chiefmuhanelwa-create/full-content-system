import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl

  try {
    const body = await request.json()
    const { script, platform = 'instagram', icp = 'auto', tone = 'auto' } = body

    if (!script || !script.trim()) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 })
    }

    const systemPrompt = `You are the NOCHILL Content Intelligence System for Ndivhuwo Muhanelwa (@nochill_god), South African content creator and business founder.

BRAND VOICE: Direct. Raw. Tough-love mentor. No filler, no AI slop. SA/African context first — ZAR not dollars, Mzansi not Africa. Short punchy sentences. YOU format (never they/people/someone).
BANNED WORDS: journey, unlock, game-changer, empower, synergy, leverage, guru, hustle, grind, crush it, seamless, robust, delve, certainly.
⛔ RETIRED 2026-09-17 — never use: "Called Expert", the ICP1/ICP2 split, ages 32–50, R9,000–R45,000, R9,997–R18,000.
RULED CUSTOMER: the creator whose income is decided by somebody else, and who finds out afterwards. Gate: money has moved, or money is visibly blocked — AND another human being appears in their fear.
TIERS: FREE R0 the Beginner Aspirant (never sold to) · ENTRY R350–R499 the Blocked · CORE R1,500–R1,800 the Underpriced & Unreserved · PREMIUM $499/R9,000 the Asset-Backed Contentpreneur.
PILLARS: KEEP IT 30 · PRICE IT 25 · OWN IT 20 · BUILD IT ANYWAY 15 · PROVE IT 10.
PROOF NUMBERS (use exactly these, nothing else): R15,000 standing rate → R45,000 once costed, April 2020 | first deal R350, second R750 the same month | R23,524 affiliate commission across MARCH 2019 (a month, not a day) | $22,180.93 remitted from Meta 2021–2025 | 780,000 followers lost (NEVER dated) | SARS assessment R207,879.20, UNPAID | ad account terminated end-2024, two appeals refused, second final May 2025 | lifetime bank-confirmed R453,710.37 across 2017–2025 | 19 named brands, 23 agencies | 270,283 Instagram followers | two published books | email list 173 | R6,000 first phone 2014
⛔ BANNED, never output: R132,500 · R750→R100K · "R100,000 per post" · R600K/R600,000 or any annual total · Samsung R450,000 · Huawei as deal proof · Savanna R25K/R100K/R300K · AdSense R180,000 · "Ads & Affiliates R800,000+" · Netflix figures (under NDA — publish neither) · "50 brand deals"/"40+ brands" · R285K/R207K/R162,174/R45,705 SARS variants · "SARS came for me" · "47 subscribers"/"50,000 email list" · "18% engagement" · "600k"/"millions of followers"/"3 million" · R50K month → R8K crash · R84K course · "6,000+ books sold" · "R23,000 in ONE DAY" · any award total (say "award-winning").
⛔ NEVER NAME the employer, workplace, airport or industry — say "a full time job" / "night shifts" / "on shift". Article IV. Never name a real private individual — companies only.`

    const platformRules: Record<string, string> = {
      instagram: '2200 chars max, 30 hashtags max. Mix niche + broad tags. First line must be hook.',
      tiktok: '2200 chars max, 3–5 hashtags only. Caption = hook, hashtags below.',
      youtube: '500 chars max, no hashtags needed — put them in tags field instead.',
      linkedin: '3000 chars max, 3–5 hashtags. Professional SA tone. End with CTA question.',
      facebook: '63,206 chars max but keep under 500 for engagement. 1–3 hashtags.',
      twitter: '280 chars max. No hashtags in tweet — put 1–2 at very end if needed.',
    }

    const userPrompt = `Generate a caption + hashtag set for this NOCHILL content.

PLATFORM: ${platform}
PLATFORM RULES: ${platformRules[platform] || platformRules.instagram}
ICP: ${icp === 'auto' ? 'Auto-detect from script content' : icp}
TONE: ${tone === 'auto' ? 'Match Ndivhuwo voice — direct, raw, SA energy' : tone}

SCRIPT CONTENT:
${script.slice(0, 2000)}

OUTPUT FORMAT (strict JSON):
{
  "caption": "The full caption text — first line is the hook that stops the scroll, then the body. SA context. ZAR pricing where relevant. Ndivhuwo voice — short sentences, no fluff. End with a CTA that drives a comment or save.",
  "hashtags": ["array", "of", "hashtags", "no", "hash", "symbol"],
  "altCaption": "A shorter alternative caption version (50% shorter than main, hook-focused only)",
  "captionWithHashtags": "The full caption with hashtags appended at the end, ready to copy-paste",
  "strategy": "1-sentence explanation of the hook choice and hashtag strategy"
}

CAPTION RULES:
- First line = stop-scroll hook (use R×A×C×U^B formula)
- Short punchy sentences — no walls of text
- SA/African context: ZAR not dollars, Mzansi not Africa
- NEVER use: journey, unlock, game-changer, empower, synergy, leverage, guru, grind
- End with action CTA: "comment your answer" / "save this" / "share with someone who..."
- Hashtags: mix niche (3-5 specific) + broad (5-10 reach) + community (5-10 SA/creator)

Return ONLY valid JSON. No markdown fences.`

    const response = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
    console.error('Caption generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate caption' },
      { status: 500 }
    )
  }
}
