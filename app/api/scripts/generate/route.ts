import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'
import ndivhuwoStories from '@/lib/knowledge/ndivhuwo-stories.json'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea, platform, duration, recentStories = [], salesMode = false, product, salesFormat } = body

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

    // Build system prompt with framework knowledge
    const systemPrompt = buildSystemPrompt('scripts')

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
    const systemPromptWithStories = `${systemPrompt}

## R×A×C×U^B HOOK SCIENCE FORMULA

The foundation of every scroll-stopping hook:
- **R = Relevant**: Who does this attack? (specific target audience)
- **A = Awareness**: What level? (symptom/problem/solution/product aware)
- **C = Clarity of Outcome**: What will they get? (clear promise)
- **U = Unique**: How does this break the pattern? (pattern interrupt)
- **B = Broadened**: Accessible to wider audience (not too niche)

Apply this formula to LINE 1: CONTEXT hook creation.

## 4E CONTENT EVOLUTION FRAMEWORK

Content mix for maximum engagement and monetization:
- **40% EDUCATE**: Teach frameworks, strategies, systems
- **30% ENTERTAIN**: Stories, humor, relatable struggles
- **20% ENCOURAGE**: Motivation, inspiration, possibility
- **10% EARN**: Monetization, offers, CTAs

Use this to balance content across your script.

## PAIDS MONETIZATION FRAMEWORK

Revenue streams for creators:
- **P = Products**: Physical/digital products you sell
- **A = Ads/Affiliates**: Sponsored content, affiliate commissions
- **I = Information**: Courses, coaching, consulting
- **D = Deals**: Brand partnerships, speaking gigs
- **S = Services**: Done-for-you services, freelancing

Reference when teaching monetization topics.

## SHADOW FEAR PSYCHOLOGY (10 Categories)

What your audience is REALLY afraid of (but won't say):

1. **Fear of Invisibility**: "What if nobody ever notices me?"
2. **Fear of Wasted Potential**: "What if I'm capable of more but never reach it?"
3. **Fear of Being Left Behind**: "What if everyone else figures it out except me?"
4. **Fear of Exposure**: "What if they find out I'm not as good as I seem?"
5. **Fear of Permanent Mediocrity**: "What if this is as good as it gets?"
6. **Fear of Missed Timing**: "What if I'm too late/too early?"
7. **Fear of Being Forgotten**: "What if my work doesn't matter long-term?"
8. **Fear of Financial Dependency**: "What if I never control my own income?"
9. **Fear of Creative Exhaustion**: "What if I run out of ideas/relevance?"
10. **Fear of Systemic Exclusion**: "What if the game is rigged against people like me?"

Target ONE Shadow Fear per script in your hook/collision.

## 4 VIRAL SCRIPTING PRINCIPLES (Apply to EVERY line)

### PRINCIPLE 1: NEGATIVITY ALWAYS WINS

- Negativity invokes MORE attention and emotion than positivity
- **CRITICAL RULE: Use INDIRECT negativity only**
- ❌ DON'T attack the viewer ("YOUR mistake...")
- ✅ DO attack the problem/system ("This mistake is costing you...")
- Attack the PROBLEM, never the PERSON
- Use power words: "suck," "wasting," "bullshit," "terrible," "broken," "failing"
- Example: "Platform dependency is keeping you broke" (NOT "You're broke because you're lazy")

### PRINCIPLE 2: YOU FORMAT

- Always use "YOU" instead of "they," "people," "someone," "one"
- Direct address creates personal connection
- Replace ALL instances:
  - "They" → "You"
  - "People" → "You"
  - "Someone" → "You"
  - "One" → "You"
  - "Folks" → "You"
  - "Everyone" → "You"
- Example: "You're probably making this mistake" (NOT "People often make this mistake")

### PRINCIPLE 3: SHORT & SIMPLE AS POSSIBLE

- Keep sentences concise and punchy
- Avoid unnecessary complexity
- One idea per sentence when possible
- Cut filler words ruthlessly
- Use active voice, not passive
- Simple words beat complex words
- Example: "Do this" (NOT "You should consider implementing this strategy")

### PRINCIPLE 4: AUDIBLE FLOW CHECK

- Read script OUT LOUD before finalizing
- If you stumble, rewrite
- Natural conversational rhythm
- Breath points for camera delivery
- Emphasis words clearly marked
- Sounds like TALKING, not reading
- Example: Script should flow like you're explaining to a friend at a braai

**ALL 4 PRINCIPLES MUST BE APPLIED TO EVERY LINE OF THE SCRIPT.**

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

      // Call Claude API for sales mode
      const salesMessage = await anthropic.messages.create({
        model: MODELS.SONNET,
        max_tokens: 4096,
        system: buildSystemPrompt('scripts'),
        messages: [
          {
            role: 'user',
            content: salesUserPrompt,
          },
        ],
      })

      const salesContent = salesMessage.content[0]
      if (salesContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude')
      }

      let salesScript: any
      try {
        const jsonMatch = salesContent.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          salesScript = JSON.parse(jsonMatch[0])
        } else {
          salesScript = JSON.parse(salesContent.text)
        }
      } catch (parseError) {
        console.error('Failed to parse Claude sales response:', salesContent.text)
        throw new Error('Failed to parse sales script from Claude response')
      }

      return NextResponse.json({
        success: true,
        script: salesScript,
        metadata: {
          mode: 'sales',
          product: product.name,
          price: product.price,
          format: salesFormat,
          audienceLevel: product.audienceLevel,
          generatedAt: new Date().toISOString(),
          approach: '10-Step Sales Storytelling Framework',
        },
      })
    }

    // Build user context - CONTENT MODE (Now using 10-Step Framework)
    const userPrompt = `## USER'S CONTENT IDEA

"${idea}"

${platform ? `Platform: ${platform}` : 'Platform: Auto-detect best fit'}
Duration: ${targetDuration}

${isYouTubeLongForm ? `
🎬 YOUTUBE LONG-FORM REQUIREMENTS:
- Target script length: 5-15 minutes (300-900 seconds)
- Expand each step of the 10-Step Framework proportionally
- Add MORE teaching depth and examples
- Include 2-3 stories for proof
- Add more examples, analogies, and tactical steps
- Maintain all Hook Science, Ubuntu principles, and scripting principles
- Keep conversational pacing with natural pauses and transitions
` : ''}

## GENERATION TASK

Create a COMPLETE production-ready script following the **10-STEP STORYTELLING FRAMEWORK**:

---

## 🎯 10-STEP STORYTELLING FRAMEWORK

### STEP 1: CALL OUT THE AUDIENCE
→ Who is this specifically for?
- Target specific audience segment clearly
- Call out their pain point directly
- Use pattern interrupt
- Example: "If you're a [AUDIENCE] struggling with [PAIN], this is for you..."

### STEP 2: DEMAND ATTENTION
→ Bold statement/question that stops the scroll
- Create immediate curiosity
- Challenge existing beliefs
- Use power words and indirect negativity
- Target ONE Shadow Fear explicitly
- Example: "What if everything you know about [TOPIC] is keeping you stuck?"

### STEP 3: BACK UP THE BIG PROBLEM
→ Validate why this problem exists and why it matters
- Explain the root cause
- Show it's not their fault (system/structure villain)
- Build emotional stakes
- Use But/Therefore dance
- Example: "The algorithm rewards X, BUT that's destroying Y, THEREFORE..."

### STEP 4: CREATE IRRESISTIBLE INTRIGUE
→ Tease the transformation/what's possible
- Hint at the solution without revealing yet
- Show the "after" state
- Create curiosity gap
- Example: "What if you could [BENEFIT] without [OBJECTION]?"

### STEP 5: FLOODLIGHT ON THE PROBLEM
→ Paint the vivid picture of pain (current state)
- Amplify the emotional cost
- Show what they're losing by staying stuck
- Use specific examples and numbers
- Make them FEEL the problem
- Example: "Right now, you're [PAIN]. Every day costs you [COST]..."

### STEP 6: PROVIDE THE SOLUTION
→ Introduce your framework/method as THE answer
- Present your unique system
- Explain how it works
- Teach the framework (this is 60-70% of the script)
- Reference frameworks from knowledge base (PAIDS, 4E, Shadow Fears)
- Example: "Here's the [FRAMEWORK] that changes everything..."

### STEP 7: SHOW CREDENTIALS
→ Why should they trust YOU specifically?
- Use Ndivhuwo's stories as proof (20% of script)
- Show authority and expertise
- Demonstrate understanding of their journey
- Include specific numbers and results
- Example: "I learned this the hard way. Started at R750..."

### STEP 8: DETAIL THE BENEFITS
→ What exactly do they get? (Features → Benefits)
- List tangible outcomes
- Use "You'll be able to..." format
- Show transformation clearly
- Stack the value
- Example: "Once you apply this, you'll [BENEFIT 1], [BENEFIT 2], [BENEFIT 3]..."

### STEP 9: SOCIAL PROOF
→ Testimonials, case studies, results
- Show real results from others
- Include specific metrics
- Third-party validation
- Community wins (Ubuntu principle)
- Example: "Others using this have [RESULTS]..."

### STEP 10: GODFATHER OFFER
→ The offer they can't refuse + guarantee/bonus
- Clear call to action
- Emphasize collective action (Ubuntu CTA)
- "Join us," "Let's build together"
- Make it easy (link in bio, comment, DM)
- Example: "Join us. Click the link. Let's build this together..."

### UBUNTU STORY ARC PRINCIPLES (Apply Throughout):

1. **WE Over I**: Start with collective experience, use personal proof later
2. **System Villains**: Blame systems/structures, not people
3. **Collective Results**: Frame success as community win
4. **But/Therefore Dance**: "We believe X, BUT reality is Y, THEREFORE we need Z"

### CONTENT SPLIT (CRITICAL):
- **70% TEACHING**: Framework/strategy (Steps 6-8)
- **20% STORY PROOF**: Ndivhuwo story (Step 7)
- **10% CTA**: Call to action (Step 10)

### OUTPUT FORMAT:

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Compelling script title",
  "tenStepScript": {
    "step1_callout": {
      "timestamp": "0-5s",
      "script": "Call out specific audience (YOU format, pattern interrupt)",
      "visual": "What viewer sees",
      "audience": "Who this is for specifically"
    },
    "step2_attention": {
      "timestamp": "5-10s",
      "script": "Bold statement/question that stops scroll (indirect negativity, power words)",
      "visual": "What viewer sees",
      "shadowFear": "Which Shadow Fear targeted",
      "powerWords": ["list", "of", "power", "words"]
    },
    "step3_problem_backup": {
      "timestamp": "10-15s",
      "script": "Validate why problem exists (system villain, But/Therefore dance)",
      "visual": "What viewer sees",
      "systemVillain": "What system is the problem"
    },
    "step4_intrigue": {
      "timestamp": "15-20s",
      "script": "Tease transformation without revealing (curiosity gap)",
      "visual": "What viewer sees"
    },
    "step5_floodlight": {
      "timestamp": "20-25s",
      "script": "Paint vivid picture of current pain (emotional amplification)",
      "visual": "What viewer sees"
    },
    "step6_solution": {
      "timestamp": "25-40s",
      "script": "Introduce framework/method - MAIN TEACHING (conversational, actionable)",
      "visual": "What viewer sees",
      "framework": "Framework name (PAIDS/4E/Shadow Fears/custom)"
    },
    "step7_credentials": {
      "timestamp": "40-48s",
      "script": "Ndivhuwo story as proof with numbers (Before → Numbers → Lesson)",
      "visual": "What viewer sees",
      "storyUsed": "Which story from story bank",
      "numbers": "Specific metrics (R750 → R100K, etc.)"
    },
    "step8_benefits": {
      "timestamp": "48-53s",
      "script": "Detail what they get (You'll be able to... format)",
      "visual": "What viewer sees"
    },
    "step9_social_proof": {
      "timestamp": "53-57s",
      "script": "Show community results (Ubuntu collective wins)",
      "visual": "What viewer sees"
    },
    "step10_godfather_offer": {
      "timestamp": "57-60s",
      "script": "Ubuntu CTA - Join us, let's build together (collective action)",
      "visual": "What viewer sees",
      "collectiveAction": "What WE will do together"
    }
  },
  "fullScript": "Complete formatted script with CLEAR STEP DIVISIONS for teleprompter. Format as follows:

═══════════════════════════════════════
STEP 1: CALL OUT THE AUDIENCE
→ Who is this specifically for?
═══════════════════════════════════════

[Script content for step 1 - what should be spoken]

═══════════════════════════════════════
STEP 2: DEMAND ATTENTION
→ Bold statement/question that stops the scroll
═══════════════════════════════════════

[Script content for step 2 - what should be spoken]

═══════════════════════════════════════
STEP 3: BACK UP THE BIG PROBLEM
→ Validate why this problem exists and why it matters
═══════════════════════════════════════

[Script content for step 3 - what should be spoken]

═══════════════════════════════════════
STEP 4: CREATE IRRESISTIBLE INTRIGUE
→ Tease the transformation/what's possible
═══════════════════════════════════════

[Script content for step 4 - what should be spoken]

═══════════════════════════════════════
STEP 5: FLOODLIGHT ON THE PROBLEM
→ Paint the vivid picture of pain (current state)
═══════════════════════════════════════

[Script content for step 5 - what should be spoken]

═══════════════════════════════════════
STEP 6: PROVIDE THE SOLUTION
→ Introduce your framework/method as THE answer
═══════════════════════════════════════

[Script content for step 6 - what should be spoken - THIS IS 60-70% OF SCRIPT]

═══════════════════════════════════════
STEP 7: SHOW CREDENTIALS
→ Why should they trust YOU specifically?
═══════════════════════════════════════

[Script content for step 7 - what should be spoken - Include Ndivhuwo story with numbers - 20% OF SCRIPT]

═══════════════════════════════════════
STEP 8: DETAIL THE BENEFITS
→ What exactly do they get? (Features → Benefits)
═══════════════════════════════════════

[Script content for step 8 - what should be spoken]

═══════════════════════════════════════
STEP 9: SOCIAL PROOF
→ Testimonials, case studies, results
═══════════════════════════════════════

[Script content for step 9 - what should be spoken]

═══════════════════════════════════════
STEP 10: GODFATHER OFFER
→ The offer they can't refuse + guarantee/bonus
═══════════════════════════════════════

[Script content for step 10 - what should be spoken - Ubuntu CTA: Join us, let's build together]

IMPORTANT: Each section must include ONLY the spoken narration (what you say on camera). The step headers help you see the framework structure but are NOT spoken.",
  "bRoll": [
    "B-roll suggestion 1",
    "B-roll suggestion 2",
    "B-roll suggestion 3"
  ],
  "textOverlays": [
    "Key text overlay 1",
    "Key text overlay 2",
    "Key text overlay 3"
  ],
  "ubuntu_check": {
    "we_over_i": "✅ WE framing throughout, I only in credentials",
    "system_villain": "✅ System blamed, NOT people",
    "collective_result": "✅ Community transformation in social proof & CTA"
  },
  "scripting_principles_check": {
    "negativity": "✅ Indirect negativity applied (attacks problems, not viewer)",
    "you_format": "✅ YOU format used throughout (no they/people/someone)",
    "short_simple": "✅ Concise sentences, simple words, active voice",
    "audible_flow": "✅ Passes read-aloud test, natural conversational rhythm"
  }
}

### CRITICAL REQUIREMENTS:

**10-Step Framework Application:**
1. **STEP 1**: Call out specific audience clearly (pattern interrupt)
2. **STEP 2**: Demand attention with bold statement (target ONE Shadow Fear, use power words)
3. **STEP 3**: Back up problem with system villain (NOT people), use But/Therefore dance
4. **STEP 4**: Create intrigue without revealing solution (curiosity gap)
5. **STEP 5**: Amplify pain with specific examples and emotional cost
6. **STEP 6**: Provide solution - MAIN TEACHING (70% of script, use frameworks from knowledge base)
7. **STEP 7**: Show credentials with Ndivhuwo story (20% of script, include numbers)
8. **STEP 8**: Detail benefits in "You'll be able to..." format
9. **STEP 9**: Include social proof and community results (Ubuntu wins)
10. **STEP 10**: Godfather CTA with collective framing ("Join us", "Let's build")

**4 Viral Scripting Principles (EVERY STEP):**
11. **NEGATIVITY**: Use indirect negativity (attack systems/problems, NOT viewer)
12. **YOU FORMAT**: Use "YOU" exclusively (never "they/people/someone")
13. **SHORT & SIMPLE**: Concise sentences, simple words, cut filler ruthlessly
14. **AUDIBLE FLOW**: Script must sound natural when read aloud (conversational rhythm)

**Content Quality:**
15. **Include specific numbers** when using stories (R750 → R100K format)
16. **Platform-optimize timing** (60s short-form or 5-15min long-form)
17. **Reference frameworks** (PAIDS, 4E, Shadow Fears) in Step 6 teaching
18. **Include fullScript field** with complete camera-ready narration for teleprompter

### CRITICAL DON'TS (Automatic Failure):

❌ Attack the viewer directly (indirect negativity only)
❌ Use "they/people/someone" instead of "YOU"
❌ Use complex words when simple ones work
❌ Write scripts that don't pass the audible flow check (read aloud test)
❌ Make story the main content (it's proof in Step 7, not main teaching)
❌ Blame people as villains (blame SYSTEMS only in Step 3)
❌ Create individual-focused CTAs (collective action in Step 10)
❌ Skip the fullScript field (required for teleprompter integration)

### BUT/THEREFORE DANCE TECHNIQUE:

Use throughout transitions:
- Step 2 → Step 3: "You're seeing X, BUT the system is doing Y"
- Step 3 → Step 4: "The problem is real, THEREFORE imagine if..."
- Step 5 → Step 6: "The pain is costing you, THEREFORE here's the framework"
- Step 6 → Step 7: "The method works, BUT don't just take my word for it"
- Step 7 → Step 8: "I did it, THEREFORE you'll be able to..."
- Step 9 → Step 10: "Others succeeded, THEREFORE let's build this together"

REMEMBER:
- WE over I (Ubuntu Story Arc) throughout
- Systems are villains, not people (Step 3)
- 70% teaching (Step 6), 20% story proof (Step 7), 10% CTA (Step 10)
- Collective CTA, not individual win (Step 10)
- MUST include fullScript field for teleprompter
`

    // Call Claude API with extended token limit for scripts
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 4096,
      system: systemPromptWithStories,
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

    // Parse the JSON response
    let script: any
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        script = JSON.parse(jsonMatch[0])
      } else {
        script = JSON.parse(content.text)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse script from Claude response')
    }

    return NextResponse.json({
      success: true,
      script,
      metadata: {
        idea,
        platform: platform || 'auto-detected',
        duration: duration || 'auto-optimized',
        generatedAt: new Date().toISOString(),
        approach: '10-Step Storytelling Framework',
      },
    })
  } catch (error: any) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    )
  }
}
