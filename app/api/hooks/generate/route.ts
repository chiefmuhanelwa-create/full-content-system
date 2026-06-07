import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

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
      count = 5
    } = body

    // Validate required fields
    if (!topic || !platform) {
      return NextResponse.json(
        { error: 'Topic and platform are required' },
        { status: 400 }
      )
    }

    // Build system prompt with framework knowledge
    const systemPrompt = buildSystemPrompt('hooks')

    // Build user context prompt
    const additionalContextParts = []
    if (hookType) additionalContextParts.push(`Hook Type (C component): ${hookType}`)
    if (awarenessLevel) additionalContextParts.push(`Awareness Level (A component): ${awarenessLevel}`)
    if (icp === 'icp1') additionalContextParts.push(`TARGET ICP: ICP 1 — Called Expert (28–42, professional, unexploited expertise). Shadow fears: Imposter Syndrome, Generational Poverty Trap, Wrong Path Terror, Spiritual Crisis. Language: "your knowledge is worth more than your salary"`)
    if (icp === 'icp2') additionalContextParts.push(`TARGET ICP: ICP 2 — Content Creator Inspirer (23–28, aspiring, Instagram-first). Shadow fears: Invisible Labor, Time Anxiety, Relationship Loss, Platform Dependency. Language: "you're posting every day and still broke"`)
    if (shadowFear) additionalContextParts.push(`SHADOW FEAR TO ACTIVATE: ${shadowFear} — embed this fear implicitly in the hook. Never name it directly.`)

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

OUTPUT FORMAT: Return ONLY a JSON object — not a plain array:
{
  "hooks": ["Hook 1", "Hook 2", ...${count} hooks total],
  "compliance": {
    "icp": "ICP 1 — The Called Expert | ICP 2 — The Content Creator Inspirer",
    "shadowFear": "Name + number e.g. Imposter Syndrome (#3)",
    "hookType": "information_gap | desired_result | undesired_result | a_to_b_transformation",
    "awarenessLevel": "symptom_aware | problem_aware | solution_aware | product_aware",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "villain": "The named system/situation villain",
    "atomicShareLine": "The most shareable single hook",
    "section13": {
      "hookQuality": "✅ passes R×A×C×U^B — [brief note]",
      "wStackOrder": "✅ WHAT+WHY leads",
      "intensity": "✅ 70%+ intensity from word one",
      "rehooking": "N/A — hooks only",
      "villainContrast": "✅ [named villain]",
      "wordEconomy": "✅ all under 25 words",
      "youFormat": "✅ all YOU format",
      "audibleFlow": "✅ passes read-aloud test",
      "emotionalPeak": "✅ Shadow Fear activated",
      "atomicSharability": "✅ — [the atomic hook]",
      "visualDirection": "N/A — hooks only",
      "ctaClarity": "N/A — hooks only",
      "retentionLoop": "N/A — hooks only",
      "businessOutcome": "✅ — [which outcome]",
      "africaContext": "✅ SA context, ZAR"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 2048,
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

    // Parse the JSON response — now expects { hooks, compliance }
    let hooks: string[]
    let compliance: Record<string, any> | undefined
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        hooks = parsed.hooks || []
        compliance = parsed.compliance
      } else {
        // Fallback: plain array
        const arrMatch = content.text.match(/\[[\s\S]*\]/)
        hooks = arrMatch ? JSON.parse(arrMatch[0]) : JSON.parse(content.text)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse hooks from Claude response')
    }

    return NextResponse.json({
      success: true,
      hooks,
      compliance,
      metadata: {
        topic,
        platform,
        duration,
        hookType,
        icp,
        shadowFear,
        awarenessLevel,
        count: hooks.length,
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
