import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

function closeHooksJSON(raw: string): string {
  const stack: string[] = []
  let inString = false
  let escaped = false
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i]
    if (escaped) { escaped = false; continue }
    if (c === '\\' && inString) { escaped = true; continue }
    if (c === '"') { inString = !inString; continue }
    if (!inString) {
      if (c === '{') stack.push('}')
      else if (c === '[') stack.push(']')
      else if (c === '}' || c === ']') stack.pop()
    }
  }
  let out = raw
  if (inString) out += '"'
  out += stack.reverse().join('')
  return out
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const {
      topic,
      platform,
      duration,
      hookType,
      icp,
      shadowFear,
      awarenessLevel,
      targetAudience,
      interestPeak,
      count = 5
    } = body

    // Validate required fields
    if (!topic || !platform) {
      return NextResponse.json(
        { error: 'Topic and platform are required' },
        { status: 400 }
      )
    }

    // Build system prompt with framework knowledge — ICP filter at system level
    const systemPrompt = buildSystemPrompt('hooks', icp as 'icp1' | 'icp2' | undefined)

    // Build user context prompt
    const additionalContextParts = []
    if (hookType) additionalContextParts.push(`Hook Type (C component): ${hookType}`)
    if (awarenessLevel) additionalContextParts.push(`Awareness Level (A component): ${awarenessLevel}`)
    if (icp === 'icp1') additionalContextParts.push(`TARGET ICP: ICP 1 — Called Expert (32–50, professional, unexploited expertise). Shadow fears: Imposter Syndrome, Generational Poverty Trap, Wrong Path Terror, Spiritual Crisis. Language: "your knowledge is worth more than your salary"`)
    if (icp === 'icp2') additionalContextParts.push(`TARGET ICP: ICP 2 — Content Creator Inspirer (18–35, aspiring, Instagram/TikTok/FB-first). Shadow fears: Invisible Labor, Time Anxiety, Relationship Loss, Platform Dependency. Language: "you're posting every day and still broke"`)
    if (shadowFear) additionalContextParts.push(`SHADOW FEAR TO ACTIVATE: ${shadowFear} — embed this fear implicitly in the hook. Never name it directly.`)
    if (interestPeak) additionalContextParts.push(`INTEREST PEAK TYPE: ${interestPeak} — every hook in this set must use this Interest Peak mechanism as its emotional engine.`)

    const userContext = buildUserContextPrompt({
      topic,
      platform,
      duration,
      targetAudience,
      additionalContext: additionalContextParts.length > 0 ? additionalContextParts.join('\n') : undefined,
    })

    // Construct generation instruction
    const userPrompt = `${userContext}

## GENERATION TASK

Generate ${count} CUSTOM viral hooks for this specific user and context using the complete R×A×C×U^B formula.

## FOUNDATIONAL PRINCIPLES (MANDATORY)
Before generating ANY hook, apply these 4 principles:

1. **Negativity Always Wins** - Attack the PROBLEM, not the person (indirect negativity only)
   - Use power words: suck, wasting, bullshit, terrible, failing, broke, ignored, ghosting
   - Example: "Your content strategy is keeping you broke" NOT "You're bad at content"

2. **You Format** - Always use "you" instead of "they/people/someone"
   - Replace ALL instances: they → you, people → you, someone → you
   - Example: "You're probably making this mistake" NOT "People often make this mistake"

3. **Short & Simple** - Ruthless brevity, active voice, cut everything unnecessary
   - 8-15 words maximum for hooks
   - One idea per hook
   - No filler words

4. **Audible Flow** - Must sound natural when read aloud
   - Would you say this in conversation?
   - No tongue twisters or awkward phrasing

## R×A×C×U^B FORMULA (MANDATORY)

Every hook MUST have all 5 components:

**R = RELEVANT** - Who is this for?
- Target the ideal customer avatar for this topic
- Make them see themselves in the hook
- Consider African creator context when relevant

**A = AWARENESS** - What do they already know?
- Symptom Aware: They feel pain but don't know cause → "Your content gets views but no sales..."
- Problem Aware: They know the problem → "Platform dependency is killing your growth..."
- Solution Aware: They know solutions exist → "You've heard about email lists. Here's how to actually build one..."
- Product Aware: They know your offer → "Here's proof this framework works..."

**C = CLARITY OF OUTCOME** - What will they get?
Choose ONE of these 4 hook types:
- Information Gap: "Here's what brands actually look for..."
- Desired Result: "Get 10K followers in 30 days..."
- Undesired Result: "Stop wasting money on ads that don't convert..."
- A-to-B Transformation: "From R750 brand deals to R8,333/month retainers..."

**U = UNIQUE** - How does this break the pattern?
Method 1 - Unique Power Words (African context):
- Ruthlessly, Bulletproof, Generational, Weaponize, Savage, Surgical, Obscene
- Bathroom floors, Children's children, Covenant, Apartheid, Disgustingly, Impregnate
Method 2 - Unique Angles:
- The Truth They Hide, If I Died Tomorrow, What Losing [X] Taught Me
- Reverse Psychology, Size Matters, The [Authority] Conversation

**B = BROADENED** - Can MORE people relate?
- Remove overly specific demographics (age, gender, exact location)
- Focus on universal pain points
- Keep context-specific details that matter ("load shedding", "data costs")
- Example: NOT "28-year-old female fitness coach in Joburg" → YES "Creator tired of content being ignored"

## GENERATION PROCESS

For EACH hook:
1. Identify core pain/desire for this topic
2. Determine audience awareness level (Symptom/Problem/Solution/Product)
3. Choose clarity type (Information Gap/Desired Result/Undesired Result/A-to-B)
4. Select unique power word OR unique angle
5. Broaden to maximum audience without losing specificity
6. Apply 4 Foundational Principles (Negativity, You Format, Short & Simple, Audible Flow)
7. Verify all 5 R×A×C×U^B components are present
8. Tag the format (1 of the 15 Hook Formats — see system prompt) and run the 4 Horsemen debug check (Delay/Confusion/Irrelevance/Disinterest)
9. Confirm 3-part alignment: verbal + visual + onScreenText all say the same thing in the first 2 seconds

## PLATFORM OPTIMIZATION
${platform === 'instagram' ? '- Instagram: Visual + punchy, use trending audio cues in copy' : ''}
${platform === 'tiktok' ? '- TikTok: Pattern interrupt, bold claims, trending sound-friendly' : ''}
${platform === 'youtube' ? '- YouTube: Question-based, curiosity gaps, searchable' : ''}
${platform === 'twitter' ? '- Twitter: Controversial takes, strong opinions, thread-worthy' : ''}

## CRITICAL RULES
- Generate FRESH hooks specific to this topic/audience/platform
- Do NOT copy example patterns verbatim
- Each hook should sound authentic and conversational
- No generic templates
- Every hook must pass the R×A×C×U^B checklist

OUTPUT FORMAT: Return ONLY a valid JSON object. Each hook is an object with: "verbal" (spoken line — under 25 words), "visual" (camera frame at second 0–2, specific and achievable with a phone), "onScreenText" (exact text overlay — must restate the key claim, not decorate), plus the 4 Kallaway scoring fields below. All three of verbal+visual+onScreenText must say the same thing in the first 2 seconds (3-part alignment gate).
{
  "hooks": [
    {
      "verbal": "Hook text — under 25 words",
      "visual": "Exact camera frame at second 0–2 — specific, achievable, confirms the verbal claim",
      "onScreenText": "Exact text overlay — restates key claim, does not duplicate verbal word-for-word",
      "shockScore": "1-5 — how far this claim sits from the audience's default expectation (1=expected, 5=genuinely unexpected)",
      "horsemenCheck": {
        "delay": "✅/❌ — hook fires in second 0–2, no preamble",
        "confusion": "✅/❌ — zero jargon, one idea only",
        "irrelevance": "✅/❌ — directly addresses this ICP's specific pain, not generic",
        "disinterest": "✅/❌ — stakes are high enough that scrolling past has a real cost"
      },
      "threePartAlignment": {
        "verbal": "The exact spoken hook line",
        "visual": "What the camera shows in second 0–2",
        "onScreenText": "The text overlay in second 0–2",
        "aligned": "✅/❌ — all three confirm the same claim"
      },
      "viralFormatTag": "One of the 15 formats — e.g. 'Secret Reveal' | 'Physical/Visual Reveal' | 'Authority FOMO' | 'Silent Split Screen' | 'Scale Reframe' | 'Universal Pain Opener' | 'Process Reveal' | etc."
    }
  ],
  "compliance": {
    "icp": "ICP 1 — The Called Expert | ICP 2 — The Content Creator Inspirer",
    "interestPeak": "risk_reversal | authority | controversial | personal_story | negative_assumption | hype_up | call_out",
    "shadowFear": "Name + number e.g. Imposter Syndrome (#3)",
    "hookType": "information_gap | desired_result | undesired_result | a_to_b_transformation",
    "hookFormat": "one of the 15 formats",
    "awarenessLevel": "symptom_aware | problem_aware | solution_aware | product_aware",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "villain": "The named system/situation villain",
    "atomicShareLine": "The most shareable single hook",
    "section13": {
      "hookQuality": "✅ passes R×A×C×U^B — [brief note on what made it pass]",
      "wStackOrder": "✅ WHAT+WHY leads",
      "intensity": "✅ 70%+ intensity from word one",
      "rehooking": "N/A — hooks only",
      "villainContrast": "✅ [named villain]",
      "wordEconomy": "✅ all under 25 words",
      "youFormat": "✅ all YOU format",
      "audibleFlow": "✅ passes read-aloud test",
      "emotionalPeak": "✅ Shadow Fear activated",
      "atomicSharability": "✅ — [the atomic hook]",
      "visualDirection": "✅ — [each hook has specific visual opening frame]",
      "threePartAlignment": "✅/❌ — all hooks pass 3-part alignment gate",
      "ctaClarity": "N/A — hooks only",
      "retentionLoop": "N/A — hooks only",
      "businessOutcome": "✅ — [which outcome]",
      "africaContext": "✅ SA context, ZAR"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}`

    // Call Claude API — SONNET: schema now too large for HAIKU output ceiling
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 6000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Extract the text content
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse the JSON response — expects { hooks: [{verbal, visual, onScreenText}], compliance }
    let hooks: Array<{ verbal: string; visual: string; onScreenText?: string } | string>
    let compliance: Record<string, any> | undefined
    try {
      const raw = content.text
        .replace(/^```json\s*/m, '').replace(/^```\s*/m, '').replace(/\s*```$/m, '').trim()
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : raw
      let parsed: any
      try {
        parsed = JSON.parse(jsonStr)
      } catch {
        // Truncation recovery: close any open strings/arrays/objects
        const closed = closeHooksJSON(jsonStr)
        parsed = JSON.parse(closed)
      }
      if (parsed.hooks) {
        hooks = parsed.hooks
        compliance = parsed.compliance
      } else {
        const arrMatch = raw.match(/\[[\s\S]*\]/)
        hooks = arrMatch ? JSON.parse(arrMatch[0]) : parsed
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text.slice(0, 500))
      throw new Error('Failed to parse hooks from Claude response')
    }

    // Normalise: ensure every hook is {verbal, visual, onScreenText}
    const normalisedHooks: Array<{ verbal: string; visual: string; onScreenText: string; shockScore?: string; horsemenCheck?: Record<string, string>; threePartAlignment?: Record<string, string>; viralFormatTag?: string }> = hooks.map(h =>
      typeof h === 'string' ? { verbal: h, visual: '', onScreenText: '' } : { ...h, onScreenText: h.onScreenText || '' }
    )

    const SHADOW_FEAR_NAMES = ['Wasted Life', 'Generational Poverty', 'Imposter Syndrome', 'Wrong Path', 'Invisible Labor', 'Platform Dependency', 'Time Anxiety', 'Relationship Loss', 'Spiritual Crisis', 'Legacy Void', 'SF1', 'SF2', 'SF3', 'SF4', 'SF5', 'SF6', 'SF7', 'SF8', 'SF9', 'SF10']
    const warnings: string[] = []
    normalisedHooks.forEach((h, i) => {
      const words = h.verbal.trim().split(/\s+/).filter(Boolean)
      if (words.length > 25) warnings.push(`Hook ${i + 1}: ${words.length} words — exceeds 25-word limit`)
      if (!/\byou\b|\byour\b/i.test(h.verbal)) warnings.push(`Hook ${i + 1}: missing "you/your" — must use YOU format`)
      const namedFear = SHADOW_FEAR_NAMES.find(f => h.verbal.toLowerCase().includes(f.toLowerCase()))
      if (namedFear) warnings.push(`Hook ${i + 1}: names shadow fear directly ("${namedFear}") — activate it, don't name it`)
      if (!h.onScreenText) warnings.push(`Hook ${i + 1}: missing onScreenText — 3-part alignment incomplete`)
      if (h.threePartAlignment?.aligned === '❌') warnings.push(`Hook ${i + 1}: 3-part alignment FAIL — verbal, visual, and onScreenText are not saying the same thing`)
      if (h.horsemenCheck) {
        const failures = Object.entries(h.horsemenCheck).filter(([, v]) => v.startsWith('❌')).map(([k]) => k)
        if (failures.length > 0) warnings.push(`Hook ${i + 1}: 4 Horsemen — fails: ${failures.join(', ')}`)
      }
    })

    return NextResponse.json({
      success: true,
      hooks: normalisedHooks,
      warnings,
      compliance,
      metadata: {
        topic,
        platform,
        duration,
        hookType,
        icp,
        shadowFear,
        awarenessLevel,
        interestPeak,
        count: normalisedHooks.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Hook generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate hooks' },
      { status: 500 }
    )
  }
}
