import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'
import ndivhuwoStories from '@/lib/knowledge/ndivhuwo-stories.json'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    // Log request for debugging
    console.log('Script generation API called')

    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === '' || apiKey === 'build-time-placeholder') {
      console.error('ANTHROPIC_API_KEY not configured properly')
      return NextResponse.json(
        {
          error: 'API configuration error',
          details: 'ANTHROPIC_API_KEY environment variable is not set. Please configure it in Netlify dashboard under Site Settings > Environment Variables.'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { idea, platform, duration, recentStories = [], salesMode = false, product, salesFormat, icp, shadowFear, villain, contentType, paidsStream, scriptTemplate } = body

    console.log('Request body:', { idea: idea?.substring(0, 50), platform, duration, salesMode })

    // Validate required fields
    if (!salesMode && (!idea || !idea.trim())) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      )
    }

    // Validate sales mode requirements
    if (salesMode && !product) {
      return NextResponse.json(
        { error: 'Product is required for sales scripts' },
        { status: 400 }
      )
    }

    // Build system prompt with framework knowledge — ICP filter at system level
    const systemPrompt = buildSystemPrompt('scripts', icp as 'icp1' | 'icp2' | undefined)

    // Filter out recently used stories to ensure variety
    const availableStories = JSON.parse(JSON.stringify(ndivhuwoStories))
    if (recentStories.length > 0 && availableStories.stories) {
      // Remove recently used stories from the available pool
      recentStories.forEach((storyKey: string) => {
        if (availableStories.stories && (availableStories.stories as any)[storyKey]) {
          delete (availableStories.stories as any)[storyKey]
        }
      })
    }

    // Add Ndivhuwo's story bank to system knowledge
    // NOTE: R×A×C×U^B, 4E, PAIDS, and the 4 Viral Scripting Principles are already fully
    // specified in buildSystemPrompt('scripts', icp) above — do not restate them here.
    // Only the dynamic story-rotation logic (which can't come from the static prompt) lives below.
    const systemPromptWithStories = `${systemPrompt}

## NDIVHUWO'S VERIFIED STORIES (Use 20% of script time)

${JSON.stringify(availableStories, null, 2)}

${recentStories.length > 0 ? `
⚠️ STORY ROTATION ENFORCEMENT:
The following stories were recently used and MUST NOT be used in this script:
${recentStories.map((key: string) => `- ${key}`).join('\n')}

Choose a DIFFERENT story from the available pool above to ensure variety and freshness.
` : ''}

## STORY SELECTION LAW — MANDATORY: commit to a story BEFORE writing Step 1

Read the topic idea. Find the story whose BEFORE STATE mirrors the viewer's CURRENT tension. Not the biggest story — the most RELEVANT story to what the viewer is feeling right now.

TOPIC → STORY MAPPING (use this to pick, then commit):
- Topic about "quitting job / building while employed / night shifts / time pressure / salary vs income" → bathroom_floors or huawei_r6000_investment
- Topic about "platform risk / algorithm / suspension / rented vs owned / email list / dependency" → instagram_780k_loss
- Topic about "tax / SARS / compliance / declarations / financial systems / professional fees" → sars_debt
- Topic about "first deal / starting with nothing / zero audience / getting started" → r750_to_r100k (R350 first deal, 2017)
- Topic about "pricing / retainers / brand deals / charging more / value positioning" → r750_to_r100k (R750→R100K arc)
- Topic about "equipment / phone / investment / starting with little / ROI on tools" → huawei_r6000_investment
- Topic about "income streams / monetisation / passive / affiliates / AdMarula / multiple revenue" → use the affiliate/AdMarula angle from the story bank
- Topic about "failure / crash / losing income / recovery / algorithm drop" → bathroom_floors (NMMU dropout, no money)
- Topic about "family / sacrifice / origin / mother / village / poverty / legacy" → bathroom_floors (Florah, farm worker, R400/month)
- Topic about "courses / digital products / knowledge monetisation / teaching expertise" → r750_to_r100k (expertise-based progression)

SELECTION RULE:
1. Identify the CORE TENSION: what is the viewer afraid of / struggling with right now?
2. Pick the story where Ndivhuwo's BEFORE STATE = the viewer's CURRENT STATE.
3. If best-match story is in the recently-used list → pick the SECOND-BEST match.
4. Commit to that story before writing a single word. Declare it in stepStructure.step4_story.storyCode.

STORY INTEGRATION — PRINCIPLES (not rules):
- Story proof = 20% of script, teaching = 80%
- Weave Bullseye Proof INTO the story itself — not as a standalone credibility sentence
- The story lives at Step 4. It confirms Step 2's pain is real and solvable.
- Emotional arc: Before (mirrors viewer pain) → Numbers (verified) → Lesson (the system)
- DO NOT make the story the main content. It is the proof that supports the teaching.
`

    // Detect YouTube long-form requirement
    const isYouTubeLongForm = platform?.toLowerCase() === 'youtube' || platform?.toLowerCase() === 'youtube-long'
    const targetDuration = isYouTubeLongForm ? '5-15 minutes' : duration || '60s'

    // Build user context - SALES MODE
    if (salesMode) {
      const salesUserPrompt = `## SALES SCRIPT GENERATION

**MODE: Product Sales Script (10-Step Storytelling Framework)**

### PRODUCT INFORMATION:
- **Product Name**: ${product.name}
- **Price**: R${product.price}
- **Audience Level**: ${product.audienceLevel} (Beginner/Established/Contentpreneur)
- **Product Type**: ${product.productType}
- **Status**: ${product.status}

### CORE PRODUCT DATA:
**Pain Points This Product Solves:**
${product.painPoints}

**Core Benefits & Outcomes:**
${product.coreBenefits}

**Product Description:**
${product.description}

**Bonuses Included:**
${product.bonuses}

**Price Anchor (What They'd Pay Elsewhere):**
${product.priceAnchor}

**Guarantee (Risk Reversal):**
${product.guarantee}

**Social Proof & Testimonials:**
${product.testimonials}

${idea ? `### ADDITIONAL CONTEXT/ANGLE:\n${idea}\n` : ''}

### SALES FORMAT:
${salesFormat === 'reel' ? '📱 Short-Form Video (60-90s Reel/TikTok)' :
  salesFormat === 'email' ? '📧 Email Sales Sequence' :
  salesFormat === 'thread' ? '🧵 Twitter/X Thread' :
  '📄 Sales Page Copy'}

---

## 10-STEP SALES STORYTELLING FRAMEWORK

Create a sales script using this proven 10-step framework:

### STEP 1: HOOK (Call Out Specific Audience)
- Target specific audience segment: ${product.audienceLevel} creators
- Call out their pain point directly
- Use pattern interrupt
- Example: "If you're a ${product.audienceLevel.toLowerCase()} creator struggling with [PAIN], this is for you..."

### STEP 2: PROBLEM AMPLIFICATION (Emotional Stakes)
- Amplify the pain from the product's painPoints
- Show emotional cost of staying stuck
- Use fear-based motivation (Shadow Fears)
- Make them FEEL the problem

### STEP 3: INTRIGUE (Hint at Transformation)
- Tease the solution without revealing yet
- Show the "after" state (coreBenefits)
- Create curiosity gap
- Example: "What if you could [BENEFIT]?"

### STEP 4: SOLUTION INTRODUCTION (Present Product)
- Introduce ${product.name}
- Position as THE solution to their problem
- Clear value proposition
- "This is ${product.name}, and here's what it does..."

### STEP 5: CREDENTIALS (Why You Can Help)
- Use Ndivhuwo's stories as proof
- Show authority and expertise
- Demonstrate understanding of their journey
- "I've been where you are..."

### STEP 6: BENEFITS STACK (What They Get)
- List tangible outcomes from coreBenefits
- Transform features into benefits
- Use "You'll be able to..." format
- Itemize what changes for them

### STEP 7: SOCIAL PROOF (Testimonials & Results)
- Include testimonials from product data
- Show real results
- Third-party validation
- "Here's what others achieved..."

### STEP 8: OFFER (Godfather Value Stack)
- Present R${product.price} price with priceAnchor comparison
- Stack bonuses: ${product.bonuses}
- Show total value vs. price
- Make it irresistible

### STEP 9: RISK REVERSAL (Guarantee)
- Emphasize guarantee: ${product.guarantee}
- Remove all purchase anxiety
- "You can't lose" positioning
- Make it safe to say yes

### STEP 10: CTA (Clear Call to Action)
- Direct instruction to purchase
- Create urgency (limited spots/time)
- Make it easy (link in bio, DM, etc.)
- Final push: "Click the link now..."

---

## OUTPUT FORMAT:

${salesFormat === 'reel' ? `
Return a JSON object for SHORT-FORM VIDEO (60-90s):
{
  "title": "Compelling sales hook title",
  "hook": {
    "text": "Opening hook that calls out audience",
    "shadowFear": "Which Shadow Fear this targets",
    "painPoint": "Specific pain addressed"
  },
  "script": "Full 60-90 second sales script following all 10 steps, formatted for camera delivery. Use YOU format, short punchy sentences, conversational tone.",
  "visualSuggestions": ["Visual 1", "Visual 2", "Visual 3"],
  "textOverlays": ["Key overlay 1", "Key overlay 2"],
  "cta": "Clear call to action"
}
` : salesFormat === 'email' ? `
Return a JSON object for EMAIL SALES SEQUENCE:
{
  "subject": "Compelling email subject line",
  "preview": "Preview text that shows in inbox",
  "body": "Full email copy following 10-step framework with proper formatting and line breaks",
  "ps": "P.S. section for final CTA reinforcement",
  "cta": "Primary call to action button text"
}
` : salesFormat === 'thread' ? `
Return a JSON object for TWITTER/X THREAD:
{
  "tweets": [
    "Tweet 1 (Hook - call out audience)",
    "Tweet 2 (Problem amplification)",
    "Tweet 3 (Intrigue)",
    "Tweet 4 (Solution intro)",
    "Tweet 5 (Credentials)",
    "Tweet 6 (Benefits stack)",
    "Tweet 7 (Social proof)",
    "Tweet 8 (Offer with price)",
    "Tweet 9 (Risk reversal)",
    "Tweet 10 (CTA)"
  ],
  "hookTweet": "The opening tweet optimized for virality"
}
` : `
Return a JSON object for SALES PAGE COPY:
{
  "headline": "Main headline",
  "subheadline": "Supporting subheadline",
  "sections": {
    "hook": "Opening section copy",
    "problem": "Problem amplification section",
    "solution": "Solution introduction section",
    "benefits": "Benefits list section",
    "proof": "Social proof section",
    "offer": "Offer stack section with pricing",
    "guarantee": "Guarantee section",
    "cta": "Final CTA section"
  },
  "bullets": ["Benefit bullet 1", "Benefit bullet 2", "..."]
}
`}

### CRITICAL REQUIREMENTS:

1. **Use product data extensively** - Don't make up features/benefits
2. **Target ${product.audienceLevel} audience** specifically
3. **Apply 4 Viral Scripting Principles**: Negativity (indirect), YOU format, Short & Simple, Audible Flow
4. **Price positioning**: R${product.price} vs ${product.priceAnchor}
5. **Include all bonuses** from product data
6. **Emphasize guarantee** for risk reversal
7. **Use real testimonials** from product data
8. **Conversational tone** - sounds like talking to a friend
9. **Focus on TRANSFORMATION** not just features
10. **Make CTA crystal clear** and urgent

Generate the sales script now following the 10-step framework for ${salesFormat} format.`

      // Call Claude API for sales mode — streaming to avoid 504
      const salesStream = anthropic.messages.stream({
        model: MODELS.SONNET,
        max_tokens: 4096,
        system: buildSystemPrompt('scripts'),
        messages: [{ role: 'user', content: salesUserPrompt }],
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of salesStream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                controller.enqueue(encoder.encode(chunk.delta.text))
              }
            }
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    // Build user context - CONTENT MODE (9-Step NOCHILL Signature Shell)
    const userPrompt = `## PRE-GENERATION GATE — Both questions must pass before writing a single word.

Q1: Will this script move the ICP closer to their goal?
  - ICP 1 (Called Expert): monetise existing expertise without quitting their job
  - ICP 2 (Content Creator): earn consistently from content they're already posting
Q2: Does this script serve one of the three business outcomes: Lead Generation | Direct Sale | Authority Building?

Topic: "${idea}"
ICP: ${icp === 'icp1' ? 'ICP 1 — The Called Expert' : icp === 'icp2' ? 'ICP 2 — The Content Creator Inspirer' : 'Default — lean ICP 1'}

Evaluate Q1 and Q2 for this topic. If EITHER fails → return only:
{ "error": "Gate failed", "reason": "Q1: [explain why it doesn't move ICP toward their goal] / Q2: [explain which business outcome is missing]" }
Only proceed to generation if BOTH pass.

---

## USER'S CONTENT IDEA

"${idea}"

${platform ? `Platform: ${platform}` : 'Platform: Auto-detect best fit'}
Duration: ${targetDuration}
${icp === 'icp1' ? 'TARGET ICP: ICP 1 — The Called Expert (32–50, professional, unexploited expertise). Language: "your knowledge is worth more than your salary", "you don\'t need another certification"' : icp === 'icp2' ? 'TARGET ICP: ICP 2 — The Content Creator Inspirer (18–35, aspiring creator, Instagram/TikTok/FB-first). Language: "you\'re posting every day and still broke", "your content is working — your strategy isn\'t"' : ''}
${shadowFear ? `SHADOW FEAR TO ACTIVATE: ${shadowFear} — activate this fear implicitly. Never name it directly. Make the viewer feel seen.` : ''}
${villain ? `NAMED VILLAIN: "${villain}" — this is the system/situation to attack. Never attack a person.` : ''}
${contentType ? `4E TYPE: ${contentType}` : ''}
${paidsStream ? `PAIDS STREAM: ${paidsStream}` : ''}
UNIVERSAL STRUCTURE: Apply the 8-STEP NOCHILL SIGNATURE SHELL to this script. Label every section in fullScript with [STEP 1: HOOK] through [STEP 8: CTA]. Steps 2 and 6 use the style approach below. Platform: ${platform || 'instagram'} — enforce word count limits (Reels: 80–130w | YouTube long-form: 900–1,800w).
${scriptTemplate === 'never_ever' ? 'STYLE APPROACH: "NEVER EVER EVER" — Step 3: open with the forbidden action, give 2-3 proof-backed reasons WHY it fails. Step 7: destroy wrong approach, install the correct named system. Risk Reversal interest peak.' : ''}
${scriptTemplate === 'important_vs' ? 'STYLE APPROACH: "IMPORTANT V/S NOT IMPORTANT" — Step 3: name the thing people obsess over, acknowledge it sounds logical, then disrupt it. Step 7: contrast table of not-important vs actually-important, then the named framework that settles the hierarchy. Controversial interest peak.' : ''}
${scriptTemplate === 'dont_do_this' ? 'STYLE APPROACH: "DON\'T DO THIS" — Step 3: start mid-consequence, name the mistake bluntly, show how common it is. Step 7: the step-by-step rescue — specific, immediate, actionable. Negative Assumption interest peak.' : ''}
${scriptTemplate === 'pure_story' ? 'STYLE APPROACH: "PURE STORY" — Step 3: scene-set the painful before with a specific date/place/moment. Step 7: the turning-point moment that changed everything — arrive through the story, not a summary. Emotional Anchor interest peak.' : ''}
${scriptTemplate === 'revelation' ? 'STYLE APPROACH: "REVELATION / MINDSHIFT" — Step 3: name the false belief the audience holds as fact, acknowledge it sounds logical first. Step 7: the counterintuitive truth that changes their behaviour — specific, counter to mainstream advice. Curiosity + Controversial interest peak.' : ''}
${scriptTemplate === 'how_to' ? 'STYLE APPROACH: "HOW-TO WALKTHROUGH" — Step 3: the specific pain of NOT knowing this skill (use a number). Step 7: exactly 3-5 numbered steps, each specific enough to action today. Named system if possible. Educational Value interest peak.' : ''}
${scriptTemplate === 'social_proof' ? 'STYLE APPROACH: "SOCIAL PROOF CASCADE" — Step 3: what happens without proof (invisible to brands, unable to charge). Step 7: stack 3-4 verified receipts in ascending order ending with the big number. All numbers must be from the verified story bank (S001-S020). Proof Point interest peak.' : ''}
${!scriptTemplate || scriptTemplate === 'auto' ? 'STYLE APPROACH: AUTO — Read the topic and select the best style from the knowledge base (never_ever / important_vs / dont_do_this / pure_story / revelation / how_to / social_proof). Declare your choice and reason in compliance.styleChosen.' : ''}

${isYouTubeLongForm ? `
🎬 YOUTUBE LONG-FORM REQUIREMENTS:
- Target script length: 5-15 minutes (300-900 seconds)
- Deploy ALL retention devices throughout (see Rehooking cadence in system prompt)
- Re-hook every 90-120 seconds with sub-hooks
- Add MORE teaching depth and examples
- Include 2-3 stories for proof integrated into Steps 5-7
- Add more examples, analogies, and tactical steps
- Maintain all Hook Science, Ubuntu principles, and scripting principles
- Keep conversational pacing with natural pauses and transitions
` : ''}

## GENERATION TASK

Apply the UNIVERSAL 8-STEP NOCHILL SIGNATURE SHELL (full spec in system prompt) to this script. The 6-section PURPOSE MAP below governs what Claude writes at each step — the 8-step labels stay in fullScript for teleprompter parsing.

### UBUNTU PRINCIPLES (Apply Throughout):
1. **WE Over I**: Collective experience first, personal proof later
2. **System Villains**: Blame systems/structures, not people
3. **Collective Results**: Frame success as community win
4. **But/Therefore Dance**: every beat-to-beat transition is BUT (reversal) or THEREFORE (consequence). Never "and then." See THE DANCE in system prompt.

---

### 6-SECTION PURPOSE MAP

**SECTION 1 — HOOK (Step 1)**
The only job: stop the scroll. One shot. No second chance.
- R×A×C×U^B all 5 components — build from the formula, don't check after
- 3-part alignment: verbal + visual + onScreenText say the same thing in second 0–2
- 4 Horsemen debug: Delay / Confusion / Irrelevance / Disinterest — all pass
- Max 25 words. Weight not hype. Start at 70%+ emotional intensity. Zero preamble.

**SECTION 2 — KALLAWAY STORYTELLING (Steps 2–4)**
The job: build trust by proving you've lived the problem. Every beat is BUT or THEREFORE. Zero "and then."
- Step 2 (Problem): YOU format. Name their exact pain with surgical precision. Awareness level matched. Villain = system/situation, never person. Style approach governs this step — choose your angle freely (forbidden action / comparison / consequence / scene-set / false belief / how-to). Make them feel SEEN.
- Step 3 (Rehook): Opens a NEW loop. ICP 1 = credibility/compliance reveal. Never "stay with me." Always BUT or THEREFORE as the opening word/phrase.
- Step 4 (Story): Egypt → But → Therefore → Promised Land. Weave Bullseye Proof INTO the story itself (amount+date+context woven naturally — NOT a standalone credibility sentence). ONE [LONG] sentence (20+ words) at emotional peak. Story MUST mirror Step 2's pain — the story is the proof. If topic is "boring expertise": apply Illusion of Novelty (Outcome Reveal → Contrast → Bullseye Proof → gossip-whisperer delivery).

**SECTION 3 — REHOOKS (embedded at Steps 3 + 5, woven through every transition)**
Not a separate section — a law governing every beat transition.
- Every step change: BUT (reversal) or THEREFORE (consequence). Never "and then."
- Step 5 Rehook: Teases the framework WITHOUT delivering it. "Here's exactly how I built the system that survived it" — not "it gets better."
- [SHORT]/[LONG] rhythm: one sentence per line. At least one [LONG] at Step 4 peak.

**SECTION 4 — EDUCATION / VALUE DELIVERY (Step 6)**
The job: teach the WHAT and WHY. Never the HOW (HOW is the paid product — if HOW slips in, the CTA loses all pull).
Framework selection — pick ONE that fits the topic:
- PAIDS: income streams, monetisation, revenue diversification
- DARES: building a digital asset, passive income, leverage
- 4E: content strategy, what to post, content mix
- SEEDS: sales funnel, lead gen, converting followers to buyers
- POSSESS: Called Expert transformation journey (ICP 1 ONLY)
- MS×TS×SS: mindset + skills gap, personal development through content
- HOOKS/AFRICA: hook writing, content quality, platform growth
- Custom: if none fit — create a named system (acronym preferred) specific to the topic
Teaching format — choose what makes this idea clearest: step-by-step numbered list | before/after comparison (like a comparison post — old way vs new way) | list of items revealed one by one | worked example with one verified proof number.
Rules: Simple English. Zero jargon. If a 16-year-old can't follow it — simplify. Every teaching point actionable within 24 hours.
End Step 6 with the WOW MOMENT LINE: the one line the viewer should feel is worth R1,000. Not a quote — a specific counterintuitive insight backed by a number or real consequence.

**SECTION 5 — CONSEQUENCES (Step 7)**
The job: make the cost of inaction FELT, not lectured.
- State the consequence of NOT doing what Step 6 just taught.
- Activate ONE shadow fear IMPLICITLY — never name it.
- One short, specific sentence. "Every month you don't do this, [specific consequence]."
- Not a guilt trip. A wake-up call from someone who actually cares.

**SECTION 6 — CTA (Step 8)**
The job: move ONE fish from the river to the tank.
- ONE action only. Never two.
- Pick the most relevant product from the CTA PRODUCT LIBRARY in system prompt. The product delivers the HOW. The script taught the WHAT and WHY. The transition must feel natural.
- Loop-close: the closing line/image MUST bookend Step 1. Verified pairs: rented→owned (780K suspended → CHKPLT/email) | R200→R18K (offer content only) | bathroom floor→built house.
- ManyChat keyword if social: DM me "[KEYWORD]" and I'll send the link.

---

### KALLAWAY LAYER — Applied per step before writing any line:

**Step 1 (Hook):** R×A×C×U^B + 3-part alignment gate.
**Step 2→3 (Dance):** Step 2 ends on pain. Step 3 opens with BUT or THEREFORE. Never "and then I realised..."
**Step 3 (Rehook):** New loop only. ICP 1: credibility/compliance reveal. Tag 'rehookType'.
**Step 4 (Story):** Bullseye Proof WOVEN INTO story opening (not standalone). ONE [LONG] sentence at emotional peak. Illusion of Novelty if topic is "boring expertise." Tag 'rhythmPeak', 'illusionOfNoveltyApplied', 'bullseyeProofLevel'.
**Step 4→5 (Dance):** Step 4 ends at turning point. Step 5 opens with THEREFORE.
**Step 5 (Rehook):** Framework tease without delivery. Tag 'rehookType'.
**Step 6 (Education):** WHAT + WHY only. HOW is the product. Tag 'frameworkSelected', 'wowMomentLine', 'whatAndWhyOnly'.
**Step 8 (CTA):** Closing line bookends Step 1. Tag 'loopCloseBookend'. Include ctaProductUsed in compliance.

**fullScript formatting rule:** one sentence per line throughout. At least one [LONG] sentence at Step 5. Every line tagged [SHORT] or [LONG].

### RETENTION & RHYTHM (mandatory):
- Rehooking cadence: apply the system-prompt cadence table (15s/30s/60s/90s) at Steps 4 and 6.
- [SHORT]/[LONG] tags: tag every fullScript line.
- Dance check: every step transition uses BUT/THEREFORE. Zero "and then" connectors.

### OUTPUT FORMAT:

CRITICAL JSON RULES — FAILURE TO FOLLOW = BROKEN RESPONSE:
1. Return ONLY a raw JSON object — NO markdown fences (no \`\`\`json), NO extra text before or after
2. ALL newlines inside string values MUST be escaped as \\n — NEVER literal newlines inside strings
3. ALL double quotes inside string values MUST be escaped as \\"
4. The fullScript field is one single string — use \\n for line breaks, NOT actual line breaks

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Compelling script title",
  "stepStructure": {
    "step1_hook": {
      "script": "[DIRECTION] your choice. [YOU]: write the actual R×A×C×U^B scored line — let the topic dictate tone.",
      "visual": "What viewer sees",
      "retentionDevice": "OPEN LOOP — the specific teased promise",
      "racubScore": "R✅ A✅ C✅ U✅ B✅"
    },
    "step2_problem": {
      "script": "[DIRECTION] your choice. [YOU]: write the actual pain line in YOU format — style approach governs this step.",
      "visual": "What viewer sees",
      "awarenessLevel": "SYMPTOM | PROBLEM | SOLUTION | PRODUCT aware",
      "shadowFearActivated": "SF number and name"
    },
    "step3_rehook": {
      "script": "[DIRECTION] your choice. [YOU]: opens a NEW loop — BUT or THEREFORE opens this line. NEVER 'stay with me'.",
      "visual": "What viewer sees",
      "retentionDevice": "SUB-HOOK — the specific new loop opened",
      "rehookType": "ICP1: credibility/compliance reveal tease | ICP2: emotional tension tease — state which and why"
    },
    "step4_story": {
      "script": "[DIRECTION] vulnerable energy, slower pace. [YOU]: Before → After → Number. Bullseye Proof woven in naturally (not announced). Mirrors Step 2 pain. One sentence per line, include ONE [LONG] sentence (20+ words) at emotional peak.",
      "visual": "What viewer sees",
      "storyCode": "the story key chosen from STORY SELECTION LAW e.g. bathroom_floors | instagram_780k_loss | sars_debt | r750_to_r100k | huawei_r6000_investment",
      "numbers": "Exact verified Before → After numbers used in the story",
      "rhythmPeak": "The exact [LONG] sentence used at the emotional peak of Step 4",
      "bullseyeProofLevel": "amount | amount+date | amount+date+ref | amount+date+ref+name — the exact proof string woven into the story",
      "illusionOfNoveltyApplied": "yes — [which IoN steps applied: Outcome Reveal / Contrast / Bullseye Proof / Gossip-whisperer delivery] | no — topic already dramatic"
    },
    "step5_rehook": {
      "script": "[DIRECTION] energy builds. [YOU]: teases the framework/solution without delivering it. THEREFORE opens. NEVER 'stay with me'.",
      "visual": "What viewer sees",
      "retentionDevice": "EDUCATIONAL VALUE or PROOF tease — the specific promise",
      "rehookType": "ICP1: system reveal tease | ICP2: result tease — state which and why"
    },
    "step6_education": {
      "script": "[DIRECTION] teaching energy. [YOU]: Framework breakdown — WHAT and WHY only. Never the HOW (HOW is the product).",
      "visual": "What viewer sees (text overlays, comparison slide, list reveal)",
      "frameworkSelected": "PAIDS | DARES | 4E | SEEDS | POSSESS | MS×TS×SS | HOOKS | AFRICA | Custom:[NAME]",
      "frameworkReason": "One sentence: why this framework fits this specific topic",
      "teachingFormat": "step-by-step | before/after comparison | list reveal | worked example",
      "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
      "24hrAction": "The exact one thing they can do in the next 24 hours to start seeing results",
      "wowMomentLine": "The exact line the viewer should feel is worth R1,000 — a specific counterintuitive insight backed by a number or consequence",
      "whatAndWhyOnly": "✅/❌ — confirms HOW was not given away (HOW is the product)"
    },
    "step7_cost": {
      "script": "[DIRECTION] your choice. [YOU]: consequence of not acting — implicit. Shadow fear felt not named.",
      "visual": "What viewer sees",
      "implicitFear": "How the cost statement activates the shadow fear without naming it"
    },
    "step8_cta": {
      "script": "[DIRECTION] highest energy. [YOU]: single action. ManyChat keyword if applicable. Closing line MUST bookend Step 1.",
      "visual": "What viewer sees",
      "ctaType": "Lead | Sale | Engagement | Sign-up",
      "manychatKeyword": "PAIDS | SYSTEM | GUIDE | START | FREE | MEDIA | none",
      "loopCloseBookend": "Step 1 opened with: [X] | Step 8 closes with: [Y] | pair used: rented→owned | R200→R18K | bathroom floor→built house | custom — [explain]"
    }
  },
  "fullScript": "[STEP 1: HOOK]\\n[DIRECTION] your direction choice.\\n\\n[YOU]: Your actual hook line here — R×A×C×U^B scored.\\n\\n[STEP 2: PROBLEM]\\n[DIRECTION] your direction choice.\\n\\n[YOU]: Pain named in YOU format. Style approach governs this step.\\n\\n[STEP 3: REHOOK]\\n[DIRECTION] your direction choice.\\n\\n[YOU]: Specific tension sentence that opens a new loop. NEVER 'stay with me'.\\n\\n[STEP 4: PERSONAL STORY]\\n[DIRECTION] Vulnerable energy, slower pace.\\n\\n[YOU]: Before → After → Number. Bullseye proof woven naturally. Continue all 8 steps in this exact format using \\\\n for all line breaks.",
  "cleanScript": "STEP 1 — HOOK\\nYour exact opening line here.\\n\\nSTEP 2 — PROBLEM\\nPain named in YOU format.\\n\\nSTEP 3 — REHOOK\\nSpecific tension sentence.\\n\\nSTEP 4 — PERSONAL STORY\\nBefore → After → Number.\\n\\nSTEP 5 — REHOOK\\nSecond retention spike.\\n\\nSTEP 6 — EDUCATION\\nThe framework or teaching point.\\n\\nSTEP 7 — COST OF NOT ACTING\\nConsequence sentence.\\n\\nSTEP 8 — CTA\\nSingle action only. RULE: cleanScript contains ONLY spoken words. Remove ALL [DIRECTION] lines. Remove ALL [YOU]: prefixes. Convert [STEP N: NAME] to STEP N — NAME. Result is performance-ready — the exact words the creator speaks, nothing else.",
  "bRoll": [
    "B-roll suggestion 1 (specific to content)",
    "B-roll suggestion 2 (specific to content)",
    "B-roll suggestion 3 (specific to content)"
  ],
  "retentionDevicesUsed": {
    "step1": "OPEN LOOP",
    "step3": "SUB-HOOK — specific tease",
    "step5": "PROOF POINT or EDUCATIONAL VALUE tease",
    "step8": "CRESCENDO + CALLBACK"
  },
  "compliance": {
    "gatePassed": {
      "q1_icpGoal": "✅ — [one line: how this script moves the ICP closer to their goal]",
      "q2_businessOutcome": "✅ Lead Generation | Direct Sale | Authority Building"
    },
    "ctaProductUsed": {
      "name": "Product name from CTA PRODUCT LIBRARY",
      "link": "The exact live buy link used (Paystack or AnyCheckout — never fabricate)",
      "reason": "Why this product is the logical HOW after the WHAT/WHY this script taught"
    },
    "wowMomentLine": "The exact line from step7_education that delivers the R1,000-worth feeling",
    "icp": "ICP 1 — The Called Expert | ICP 2 — The Content Creator Inspirer",
    "shadowFear": "Fear name (SF#) from the 10 NOCHILL shadow fears",
    "villain": "Named system/situation villain — never a person",
    "atomicShareLine": "The one line viewers can share verbatim",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "retentionLoop": "The exact retention loop tease line at the end",
    "styleChosen": "auto-selected: [style name] — [one sentence reason why this style fits the topic]",
    "platformWordCount": "✅/❌ — [actual word count] vs [target range for platform]",
    "section13": {
      "hookQuality": "✅/❌ — R×A×C×U^B check",
      "wStackOrder": "✅/❌ — WHAT+WHY leads, no backstory first",
      "intensity": "✅/❌ — 70%+ intensity from word one",
      "rehooking": "✅/❌ — rehooks at Step 4 and Step 6",
      "villainContrast": "✅/❌ — [villain named]",
      "wordEconomy": "✅/❌ — avg sentence under 10 words",
      "youFormat": "✅/❌ — zero they/people/someone",
      "audibleFlow": "✅/❌ — passes read-aloud test",
      "emotionalPeak": "✅/❌ — [the peak moment named]",
      "atomicSharability": "✅/❌ — [the shareable line]",
      "visualDirection": "✅/❌ — visual change every 8s minimum",
      "ctaClarity": "✅/❌ — single CTA to owned channel",
      "retentionLoop": "✅/❌ — [the tease line]",
      "businessOutcome": "✅/❌ — [which outcome]",
      "africaContext": "✅/❌ — ZAR pricing, SA references"
    },
    "ubuntuCheck": {
      "weOverI": "✅/❌ — WE framing in Steps 1-2 and 7-9, I only in Steps 3-6",
      "systemVillain": "✅/❌ — system/situation blamed, never a person",
      "collectiveResult": "✅/❌ — CTA frames collective action, not individual glory"
    },
    "kallawayCheck": {
      "butThereforeScore": "✅/❌ — [zero 'and then' beats confirmed | or: found at Step X, rewritten to BUT/THEREFORE]",
      "rhythmCheck": "✅/❌ — [SHORT/LONG pattern marked per line | longest sentence at Step 5 emotional peak]",
      "loopClose": "✅/❌ — [Step 1 opening image: X | Step 9 closing image: Y | bookend pair used: rented→owned | R200→R18K | bathroom floor→built house | or custom]",
      "illusionOfNovelty": "applied/not-needed — [if applied: steps used (1=Outcome Reveal, 2=Contrast, 3=Urgency, 4=Bullseye Proof, 5=Gossip-whisperer) | if not: topic already dramatic, IoN skipped]",
      "bullseyeProof": "level: amount | amount+date | amount+date+ref | amount+date+ref+name — [the exact proof string woven into Step 4 story or Step 6 education]"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}

### CRITICAL REQUIREMENTS:

**8-Step Signature Shell (non-negotiable sequence):**
1. **STEP 1 — HOOK**: R×A×C×U^B scored. Scroll-stopper. Label as [STEP 1: HOOK] in fullScript.
2. **STEP 2 — PROBLEM**: Pain named in YOU format. Awareness level matched. Style approach governs this step. Label as [STEP 2: PROBLEM].
3. **STEP 3 — REHOOK**: Opens a NEW loop — BUT or THEREFORE. NEVER "stay with me". Label as [STEP 3: REHOOK].
4. **STEP 4 — PERSONAL STORY**: Before → After → Number. Bullseye Proof woven naturally into the story. Mirrors Step 2 pain. Story chosen from STORY SELECTION LAW above. Label as [STEP 4: PERSONAL STORY].
5. **STEP 5 — REHOOK**: Teases the solution/framework without delivering it. THEREFORE opens. Label as [STEP 5: REHOOK].
6. **STEP 6 — EDUCATION**: Teach WHAT and WHY only — HOW is the paid product. Framework or step-by-step teaching — actionable in 24 hours. WOW MOMENT LINE at the end of this step. Style approach governs this step. Label as [STEP 6: EDUCATION].
7. **STEP 7 — COST OF NOT ACTING**: Consequence of inaction — implicit, shadow fear felt not named. Label as [STEP 7: COST OF NOT ACTING].
8. **STEP 8 — CTA**: Single action only. ManyChat keyword if applicable. Closing line bookends Step 1. Label as [STEP 8: CTA].

**4 Viral Scripting Principles (every step):**
9. **NEGATIVITY**: Indirect negativity (attack systems/problems, NOT the viewer) — especially Steps 2 and 7
10. **YOU FORMAT**: Use "you" exclusively in ALL steps (never they/people/someone)
11. **SHORT & SIMPLE**: Concise sentences, simple words, cut filler ruthlessly throughout
12. **AUDIBLE FLOW**: Script must sound natural when read aloud (conversational rhythm)

**Retention Devices (mandatory):**
13. **Open loop at Step 1** — promise something that requires the viewer to stay
14. **Sub-hooks at Steps 3 and 5** — must open a NEW curiosity loop. ICP 1 rule: promise a credibility/compliance reveal, not manufactured drama. Never "stay with me." / "keep watching."
15. **Long-form (5+ min)**: Re-hook every 90–120 seconds with additional sub-hooks

**Kallaway Layer (mandatory):**
16. **Bullseye Proof woven into Step 4 story** — escalate specificity as far as the story bank allows: amount → amount+date → amount+date+ref# → amount+date+ref#+name. Never a standalone credibility sentence — embed in the story itself.
17. **Loop-close at Step 8** — final line/image must bookend Step 1. Default pairs: rented (780K suspended)→owned (CHKPLT/email); R200→R18K (offer content only); bathroom floor→built house.
18. **[SHORT]/[LONG] rhythm** — one sentence per line. Tag every fullScript line. At least one [LONG] sentence (20+ words) at Step 4 emotional peak. Uniform paragraph blocks = rhythm failure.
19. **Illusion of Novelty** — if the topic is "boring expertise" (tax, compliance, HR, governance, academic): apply the 5-step IoN sequence (Outcome Reveal → Contrast → Bullseye Proof → Gossip-whisperer delivery). Deliver with lowered register and calm specificity, not hype.

**Content Quality:**
20. **Specific verified numbers** in Step 4 story — from story bank only, never approximated
21. **Platform word count enforced** — Reels: 80–130w | Instagram feed: 150–220w | YouTube medium: 450–800w | YouTube long-form: 900–1,800w
22. **Label every section** in fullScript with [STEP N: NAME] markers — required for teleprompter parsing
23. **Direction notes included** in fullScript — [DIRECTION], [YOU]:, [PAUSE], [TEXT OVERLAY: ]

### CRITICAL DON'TS (Automatic Failure):

❌ Attack the viewer directly (indirect negativity only)
❌ Use "they/people/someone" instead of "YOU"
❌ Use complex words when simple ones work
❌ Write scripts that don't pass the audible flow check (read aloud test)
❌ Go more than 30 seconds without a retention device
❌ Blame people as villains (blame SYSTEMS only — Step 2/Problem and Step 7/Cost)
❌ Create individual-focused CTAs (collective action at Step 8)
❌ Skip the fullScript field (required for teleprompter integration)
❌ Forget DIRECTION notes in fullScript (they guide production)
❌ Connect beats with "and then" — every transition is BUT or THEREFORE (see THE DANCE)
❌ Leave fullScript lines untagged — every line needs [SHORT] or [LONG]
❌ Default to the same story regardless of topic — STORY SELECTION LAW is mandatory

REMEMBER:
- WE over I (Ubuntu) in Steps 1-2 and 6-8; personal story (I) only in Steps 3-5 for credibility
- Systems are villains (Steps 2 and 7), not people
- Collective CTA (Step 8), not individual win
- MUST include fullScript field, labeled [STEP N: NAME], tagged [SHORT]/[LONG] per line
- DIRECTION notes are critical for production
- Platform duration determines Step compression, not Act compression — the Shell stays 8 steps at every length
`

    // Call Claude API — streaming to avoid 504 on long generations
    console.log('Calling Claude API (streaming)...')

    const stream = anthropic.messages.stream({
      model: MODELS.SONNET,
      max_tokens: 16000,
      system: systemPromptWithStories,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: any) {
    console.error('Script generation error:', error)

    // Provide more detailed error information
    const errorMessage = error.message || 'Failed to generate script'
    const errorDetails = {
      message: errorMessage,
      type: error.type || 'unknown',
      status: error.status || 500,
    }

    console.error('Full error details:', errorDetails)

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: error.status || 500 }
    )
  }
}
