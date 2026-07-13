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

CRITICAL RULES FOR STORIES:
1. Stories are PROOF POINTS, not main content (max 20% of script)
2. Use 1-2 story snippets maximum per script
3. Place stories AFTER teaching content as credibility markers
4. Keep story segments under 15 seconds total
5. Focus on TEACHING (80%) + STORY CREDIBILITY (20%)
6. Select stories based on topic relevance from story_selection_matrix
7. Always include emotional arc: Before → Numbers → Lesson

STORY INTEGRATION EXAMPLE:
- Teaching section (35 seconds): Fresh content about pricing strategies
- Story proof (12 seconds): "I learned this the hard way. Started at R750..."
- CTA (8 seconds): Clear next action

DO NOT make the story the main content. Use it to SUPPORT the teaching.
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
    const userPrompt = `## USER'S CONTENT IDEA

"${idea}"

${platform ? `Platform: ${platform}` : 'Platform: Auto-detect best fit'}
Duration: ${targetDuration}
${icp === 'icp1' ? 'TARGET ICP: ICP 1 — The Called Expert (32–50, professional, unexploited expertise). Language: "your knowledge is worth more than your salary", "you don\'t need another certification"' : icp === 'icp2' ? 'TARGET ICP: ICP 2 — The Content Creator Inspirer (18–35, aspiring creator, Instagram/TikTok/FB-first). Language: "you\'re posting every day and still broke", "your content is working — your strategy isn\'t"' : ''}
${shadowFear ? `SHADOW FEAR TO ACTIVATE: ${shadowFear} — activate this fear implicitly. Never name it directly. Make the viewer feel seen.` : ''}
${villain ? `NAMED VILLAIN: "${villain}" — this is the system/situation to attack. Never attack a person.` : ''}
${contentType ? `4E TYPE: ${contentType}` : ''}
${paidsStream ? `PAIDS STREAM: ${paidsStream}` : ''}
UNIVERSAL STRUCTURE: Apply the 9-STEP NOCHILL SIGNATURE SHELL to this script. Label every section in fullScript with [STEP 1: HOOK] through [STEP 9: CTA]. Steps 3 and 7 use the style approach below. Platform: ${platform || 'instagram'} — enforce word count limits (Reels: 80–130w | YouTube long-form: 900–1,800w).
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

Apply the UNIVERSAL 9-STEP NOCHILL SIGNATURE SHELL (full spec in system prompt) to this script.

### UBUNTU PRINCIPLES (Apply Throughout):
1. **WE Over I**: Collective experience first, personal proof later
2. **System Villains**: Blame systems/structures, not people
3. **Collective Results**: Frame success as community win
4. **But/Therefore Dance**: see THE DANCE — BEAT CONNECTION LAW in system prompt. Never "and then."

### RETENTION & RHYTHM (mandatory):
- Rehooking cadence: apply the system-prompt cadence table (15s/30s/60s/90s) at Steps 4 and 6.
- [SHORT]/[LONG] tags: tag every fullScript line per Pattern 10 (Sentence Architecture in system prompt).
- Dance check: every beat transition uses BUT/THEREFORE (or a valid equivalent), never "and then."

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
      "script": "[DIRECTION] Camera tight. [YOU]: The exact R×A×C×U^B scored opening line.",
      "visual": "What viewer sees",
      "retentionDevice": "OPEN LOOP — the specific teased promise",
      "racubScore": "R✅ A✅ C✅ U✅ B✅"
    },
    "step2_introduce": {
      "script": "[DIRECTION] Slight pull back. [YOU]: One credibility sentence + one proof number.",
      "visual": "What viewer sees",
      "proofNumber": "The exact verified number used (from S001–S020)"
    },
    "step3_problem": {
      "script": "[DIRECTION] Direct to camera. [YOU]: Pain named in YOU format. Style approach active here.",
      "visual": "What viewer sees",
      "awarenessLevel": "SYMPTOM | PROBLEM | SOLUTION | PRODUCT aware",
      "shadowFearActivated": "SF number and name"
    },
    "step4_rehook": {
      "script": "[DIRECTION] Slight lean. [YOU]: Specific tension sentence — NEVER 'stay with me'.",
      "visual": "What viewer sees",
      "retentionDevice": "SUB-HOOK — the specific tease"
    },
    "step5_story": {
      "script": "[DIRECTION] Vulnerable energy. [YOU]: Before → After → Number. Must mirror Step 3 pain.",
      "visual": "What viewer sees",
      "storyCode": "S0XX",
      "numbers": "Exact verified Before → After numbers"
    },
    "step6_rehook": {
      "script": "[DIRECTION] Energy builds. [YOU]: Teases the solution. Builds anticipation.",
      "visual": "What viewer sees",
      "retentionDevice": "PROOF POINT or EDUCATIONAL VALUE tease"
    },
    "step7_solution": {
      "script": "[DIRECTION] Teaching energy. [YOU]: Framework or steps — actionable today. Style approach active here.",
      "visual": "What viewer sees",
      "frameworkUsed": "PAIDS | 4E | R×A×C×U^B | SEEDS | named system",
      "textOverlays": ["Key point 1", "Key point 2", "Key point 3"]
    },
    "step8_cost": {
      "script": "[DIRECTION] Pull back slightly. [YOU]: Consequence of not acting — implicit. Shadow fear felt not named.",
      "visual": "What viewer sees",
      "implicitFear": "How the cost statement activates the shadow fear without naming it"
    },
    "step9_cta": {
      "script": "[DIRECTION] Highest energy. Point at camera. [YOU]: Single action. ManyChat keyword if applicable.",
      "visual": "What viewer sees",
      "ctaType": "Lead | Sale | Engagement | Sign-up",
      "manychatKeyword": "PAIDS | SYSTEM | GUIDE | START | FREE | MEDIA | none"
    }
  },
  "fullScript": "[STEP 1: HOOK]\\n[DIRECTION] Camera tight on face. Direct eye contact.\\n\\n[YOU]: Your exact hook line here — R×A×C×U^B scored.\\n\\n[STEP 2: INTRODUCE MYSELF]\\n[DIRECTION] Same shot or slight pull back.\\n\\n[YOU]: One credibility sentence + one proof number.\\n\\n[STEP 3: PROBLEM]\\n[DIRECTION] Direct to camera.\\n\\n[YOU]: Pain named in YOU format. Style approach governs this step.\\n\\n[STEP 4: REHOOK]\\n[DIRECTION] Slight lean forward.\\n\\n[YOU]: Specific tension sentence. NEVER 'stay with me'.\\n\\n[STEP 5: PERSONAL STORY]\\n[DIRECTION] Vulnerable energy, slower pace.\\n\\n[YOU]: Before → After → Number. Continue all 9 steps in this exact format using \\\\n for all line breaks.",
  "cleanScript": "STEP 1 — HOOK\\nYour exact opening line here.\\n\\nSTEP 2 — INTRODUCE MYSELF\\nOne credibility sentence + one proof number.\\n\\nSTEP 3 — PROBLEM\\nPain named in YOU format.\\n\\nSTEP 4 — REHOOK\\nSpecific tension sentence.\\n\\nSTEP 5 — PERSONAL STORY\\nBefore → After → Number.\\n\\nSTEP 6 — REHOOK\\nSecond retention spike.\\n\\nSTEP 7 — SOLUTION\\nThe framework or teaching point.\\n\\nSTEP 8 — COST OF NOT ACTING\\nConsequence sentence.\\n\\nSTEP 9 — CTA\\nSingle action only. RULE: cleanScript contains ONLY spoken words. Remove ALL [DIRECTION] lines. Remove ALL [YOU]: prefixes. Convert [STEP N: NAME] to STEP N — NAME. Result is performance-ready — the exact words the creator speaks, nothing else.",
  "bRoll": [
    "B-roll suggestion 1 (specific to content)",
    "B-roll suggestion 2 (specific to content)",
    "B-roll suggestion 3 (specific to content)"
  ],
  "retentionDevicesUsed": {
    "step1": "OPEN LOOP",
    "step4": "SUB-HOOK — specific tease",
    "step6": "PROOF POINT or EDUCATIONAL VALUE tease",
    "step9": "CRESCENDO + CALLBACK"
  },
  "compliance": {
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
      "bullseyeProof": "level: amount | amount+date | amount+date+ref | amount+date+ref+name — [the exact proof string used in Step 2 or Step 7]"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}

### CRITICAL REQUIREMENTS:

**9-Step Signature Shell (non-negotiable sequence):**
1. **STEP 1 — HOOK**: R×A×C×U^B scored. Scroll-stopper. Label as [STEP 1: HOOK] in fullScript.
2. **STEP 2 — INTRODUCE MYSELF**: One credibility sentence + one proof number from S001–S020. Label as [STEP 2: INTRODUCE MYSELF].
3. **STEP 3 — PROBLEM**: Pain named in YOU format. Awareness level matched. Style approach governs this step. Label as [STEP 3: PROBLEM].
4. **STEP 4 — REHOOK**: Specific tension sentence — NEVER "stay with me". Label as [STEP 4: REHOOK].
5. **STEP 5 — PERSONAL STORY**: Before → After → Number. Exact verified numbers. Mirrors Step 3 pain. Label as [STEP 5: PERSONAL STORY].
6. **STEP 6 — REHOOK**: Teases the solution. Builds anticipation. Label as [STEP 6: REHOOK].
7. **STEP 7 — SOLUTION**: Framework or teaching — actionable today without buying anything. Style approach governs this step. Label as [STEP 7: SOLUTION].
8. **STEP 8 — COST OF NOT ACTING**: Consequence of inaction — implicit, shadow fear felt not named. Label as [STEP 8: COST OF NOT ACTING].
9. **STEP 9 — CTA**: Single action only. ManyChat keyword if applicable. Label as [STEP 9: CTA].

**4 Viral Scripting Principles (every step):**
10. **NEGATIVITY**: Indirect negativity (attack systems/problems, NOT the viewer) — especially Steps 3 and 8
11. **YOU FORMAT**: Use "you" exclusively in ALL steps (never they/people/someone)
12. **SHORT & SIMPLE**: Concise sentences, simple words, cut filler ruthlessly throughout
13. **AUDIBLE FLOW**: Script must sound natural when read aloud (conversational rhythm)

**Retention Devices (mandatory):**
14. **Open loop at Step 1** — promise something that requires the viewer to stay
15. **Sub-hooks at Steps 4 and 6** — must open a NEW curiosity loop. ICP 1 rule: promise a credibility/compliance reveal ("here's what SARS actually said"), not manufactured drama. Never "stay with me." / "keep watching."
16. **Long-form (5+ min)**: Re-hook every 90–120 seconds with additional sub-hooks

**Kallaway Layer (mandatory):**
17. **Bullseye Proof at Step 2 + Step 7** — escalate specificity as far as the story bank allows: amount → amount+date → amount+date+ref# → amount+date+ref#+name. Vague proof fails ICP 1.
18. **Loop-close at Step 9** — final line/image must bookend Step 1. Default pairs: rented (780K suspended)→owned (CHKPLT/email); R200→R18K (offer content only); bathroom floor→built house.
19. **[SHORT]/[LONG] rhythm** — one sentence per line. Tag every fullScript line. At least one [LONG] sentence (20+ words) at Step 5 emotional peak. Uniform paragraph blocks = rhythm failure.
20. **Illusion of Novelty** — if the topic is "boring expertise" (tax, compliance, HR, governance, academic): apply the 5-step IoN sequence (Outcome Reveal → Contrast → Bullseye Proof → Gossip-whisperer delivery). Deliver with lowered register and calm specificity, not hype.

**Content Quality:**
21. **Specific verified numbers** in Steps 2 and 5 — from S001–S020 table only, never approximated
22. **Platform word count enforced** — Reels: 80–130w | Instagram feed: 150–220w | YouTube medium: 450–800w | YouTube long-form: 900–1,800w
23. **Label every section** in fullScript with [STEP N: NAME] markers — required for teleprompter parsing
24. **Direction notes included** in fullScript — [DIRECTION], [YOU]:, [PAUSE], [TEXT OVERLAY: ]

### CRITICAL DON'TS (Automatic Failure):

❌ Attack the viewer directly (indirect negativity only)
❌ Use "they/people/someone" instead of "YOU"
❌ Use complex words when simple ones work
❌ Write scripts that don't pass the audible flow check (read aloud test)
❌ Go more than 30 seconds without a retention device
❌ Blame people as villains (blame SYSTEMS only — Step 3/Problem and Step 8/Cost)
❌ Create individual-focused CTAs (collective action at Step 9)
❌ Skip the fullScript field (required for teleprompter integration)
❌ Forget DIRECTION notes in fullScript (they guide production)
❌ Connect beats with "and then" — every transition is BUT or THEREFORE (see THE DANCE)
❌ Leave fullScript lines untagged — every line needs [SHORT] or [LONG] (see Pattern 10)

REMEMBER:
- WE over I (Ubuntu) in Steps 1-2 and 7-9; personal story (I) only in Steps 3-6 for credibility
- Systems are villains (Step 3, Step 8), not people
- Collective CTA (Step 9), not individual win
- MUST include fullScript field, labeled [STEP N: NAME], tagged [SHORT]/[LONG] per line
- DIRECTION notes are critical for production
- Platform duration determines Step compression, not Act compression — the Shell stays 9 steps at every length
`

    // Call Claude API — streaming to avoid 504 on long generations
    console.log('Calling Claude API (streaming)...')

    const stream = anthropic.messages.stream({
      model: MODELS.SONNET,
      max_tokens: 8000,
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
