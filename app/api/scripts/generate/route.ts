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
    const { idea, platform, duration, recentStories = [], salesMode = false, product, salesFormat } = body

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

## SHADOW FEAR PSYCHOLOGY — 10 NOCHILL SHADOW FEARS

What the audience is REALLY afraid of (never name it directly — activate it):

1. **Wasted Life (#1)** — ICP 1+2 — "I'm spending my best years building someone else's dream"
2. **Generational Poverty Trap (#2)** — ICP 1 — "I'll repeat my parents' financial story no matter what I do"
3. **Imposter Syndrome (#3)** — ICP 1+2 — "I'm not qualified enough to charge / teach / lead"
4. **Wrong Path Terror (#4)** — ICP 1 — "I chose the wrong career and it's too late to switch"
5. **Invisible Labor (#5)** — ICP 2 — "I'm working harder than anyone can see and have nothing to show"
6. **Platform Dependency (#6)** — ICP 1+2 — "One algorithm change and everything I built disappears"
7. **Time Anxiety (#7)** — ICP 2 — "I'm already behind. Everyone else figured this out younger"
8. **Relationship Loss (#8)** — ICP 2 — "Pursuing this dream will cost me the people I love"
9. **Spiritual Crisis (#9)** — ICP 1 — "Was I called to this, or am I just chasing money?"
10. **Legacy Void (#10)** — ICP 1+2 — "I'll die without leaving something that outlasts me"

Target ONE Shadow Fear per script. Activate it — never name it directly.

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

    // Build user context - CONTENT MODE (Now using Retention Formula - ACT Structure)
    const userPrompt = `## USER'S CONTENT IDEA

"${idea}"

${platform ? `Platform: ${platform}` : 'Platform: Auto-detect best fit'}
Duration: ${targetDuration}

${isYouTubeLongForm ? `
🎬 YOUTUBE LONG-FORM REQUIREMENTS:
- Target script length: 5-15 minutes (300-900 seconds)
- Use full 7-Act retention structure with maximum depth
- Deploy ALL retention devices throughout
- Re-hook every 90-120 seconds with sub-hooks
- Add MORE teaching depth and examples
- Include 2-3 stories for proof integrated into ACT 3-5
- Add more examples, analogies, and tactical steps
- Maintain all Hook Science, Ubuntu principles, and scripting principles
- Keep conversational pacing with natural pauses and transitions
` : ''}

## GENERATION TASK

Create a COMPLETE production-ready script following the **RETENTION FORMULA - 7-ACT STRUCTURE**:

---

## 🎯 RETENTION FORMULA - 7-ACT STRUCTURE

### ACT 1: THE NEGATIVE HOOK (0:00-0:15)
**Purpose**: Stop the scroll. Create immediate emotional response. Open primary curiosity loop.
**Energy**: Low, intense, almost whisper. No music yet. Just you and lens.
**Elements**:
- Camera tight on face
- Statement of shocking/negative reality
- PAUSE - let it land (2 full seconds of silence)
- Stare into camera for emphasis
- Introduce yourself with authority
**Retention Device**: OPEN LOOP - "96% of African creators will never make a living from content"
**Script Example**: "[DIRECTION] Camera tight on face. Low, intense energy. [YOU]: 96% of content creators will never make a living from their content. [PAUSE 2 seconds] Not because they're not talented. But because they're building like employees on platforms they'll never own."

### ACT 2: THE UNCOMFORTABLE TRUTH (0:15-1:00)
**Purpose**: Pattern interrupt. Contradict what they believe. Create cognitive dissonance.
**Energy**: Shift to conversational. More inviting but still intense.
**Elements**:
- Cut to slightly wider shot
- Music begins - low, cinematic, building
- Challenge common beliefs
- Name the lie they've been told
- Introduce new concept/framework
**Retention Device**: SUB-HOOK - "Content creation is NOT a career the way you're doing it"
**Script Example**: "[YOU]: You've been lied to. They told you if you get followers, money comes. [Shake head] It's not. Not the way you're doing it. But there's another way. A word you need to learn: Contentpreneur."

### ACT 3: THE ORIGIN STORY (1:00-2:30)
**Purpose**: Build credibility through vulnerability. Create emotional anchor. Show you understand their struggle.
**Energy**: Shift to vulnerable. Slower pace. Raw emotion.
**Elements**:
- Share specific struggle/origin
- Include quantified details (R400/month, 780K followers lost, etc.)
- Create visual imagery with words
- Reference recurring motif (mother's words, bathroom floors, etc.)
- Show the pain before transformation
**Retention Device**: EMOTIONAL ANCHOR - "Mother's last words: 'Get educated'" or "Sleeping on bathroom floors"
**Script Example**: "[YOU]: I was born in Tshikwarani village. My mother earned R400/month for family of 4. That's R13/day. [TEXT OVERLAY: R13/day] At school, no girl could talk to me. But my mother kept saying: 'Get educated. That's your way out.'"

### ACT 4: THE BREAKING POINT (2:30-4:00)
**Purpose**: Nuclear story. The moment that proves you earned authority through suffering.
**Energy**: Lowest point. Quiet. Almost confessional.
**Elements**:
- The crisis/rock bottom moment
- Stack the problems (make it worse)
- Create dread through pacing
- Specific sensory details that create scene
- Moment of near-giving-up
**Retention Device**: EMOTIONAL WHIPLASH - "From university acceptance → failed one module → lost everything"
**Script Example**: "[YOU]: University accepted me. Full bursary. First year? I excelled. [PAUSE] Then second year came. [PAUSE] I failed ONE module. They dropped me instantly. No accommodation. No meal plan. Everything gone. But I refused to go home. [Lean close] So for two months... I slept in the university bathrooms."

### ACT 5: THE TRANSFORMATION JOURNEY (4:00-5:30)
**Purpose**: Show how you went from breaking point to breakthrough. Rapid montage of wins.
**Energy**: Shift from darkness to light. Pace picks up. Music builds.
**Elements**:
- The decision/turning point
- Quick cuts between milestones
- Text overlays with dates/numbers
- Build momentum through pacing
- Show the climb from bottom to peak
**Retention Device**: PROOF POINT - "R6,000 phone → R600,000+ revenue (10,000% ROI)"
**Script Example**: "[YOU]: August 2013. Hired. R6,000/month. I did something crazy. [MONTAGE] Spent ENTIRE salary on smartphone. That phone has generated R600,000+. 10,000% ROI. [Quick cuts] 2014: 100K followers. 2017: R300K offer - said no. 2019: 5.5M views. 2021: 780K followers deleted. Revenue didn't drop. It INCREASED."

### ACT 6: THE FRAMEWORK / EDUCATIONAL VALUE (5:30-6:30)
**Purpose**: Deliver the lesson. Make it shareable. Give tactical takeaway.
**Energy**: Shift to TEACHING mode. Confident. Authoritative.
**Elements**:
- Direct to camera
- Clear framework/principle
- Side-by-side text comparisons
- Acronym or memorable system
- Make it screenshot-worthy
- Reference frameworks (PAIDS, 4E, R×A×C×U^B, Shadow Fears)
**Retention Device**: EDUCATIONAL VALUE - "Content Creator vs Contentpreneur (side by side)"
**Script Example**: "[YOU]: Content creator versus contentpreneur. [TEXT OVERLAY side by side] Content creator has audience. Contentpreneur has BUSINESS. Content creator depends on platforms. Contentpreneur OWNS assets. Here's the framework: PAIDS. [Text: P.A.I.D.S] Products. Ads & Affiliates. Information. Deals. Services. Five streams. When I had one, I was vulnerable. Five streams? Unbreakable."

### ACT 7: THE MISSION + CALL TO ACTION (6:30-7:30)
**Purpose**: Rally cry. Convert emotion into action. Clear next step.
**Energy**: HIGHEST energy. Stand up if sitting. Preacher moment.
**Elements**:
- State the mission clearly
- Build with repetition ('I'm here because...')
- Direct eye contact
- Point at camera
- Multiple clear CTAs
- Close with conviction and authority
**Retention Device**: CRESCENDO - "I'm here to... [builds 3-5 times]"
**Script Example**: "[YOU]: This is my mission. I'm here to turn African creators into contentpreneurs. I'm here because my mother earned R400/month and I refuse to let another family live on that. I'm here because I slept on bathroom floors. [Point at camera] If you're tired of being broke and famous... follow NOW. If you want to build a BUSINESS from content... hit follow. God didn't give you this gift so you could be famous and broke. He gave you this to be FRUITFUL."

### PLATFORM DURATION ADAPTATIONS:

**60-SECOND SHORT-FORM**:
- 0-5s: ACT 1 (compressed)
- 5-15s: ACT 2 + ACT 3 snippet (1-2 lines)
- 15-35s: ACT 4 (nuclear moment) + ACT 5 (quick transformation)
- 35-50s: ACT 6 (framework teaching)
- 50-60s: ACT 7 (CTA)

**90-SECOND REEL**:
- 0-10s: ACT 1 (full negative hook)
- 10-25s: ACT 2 + ACT 3 (condensed origin)
- 25-50s: ACT 4 (breaking point) + ACT 5 (transformation)
- 50-75s: ACT 6 (framework)
- 75-90s: ACT 7 (mission + CTA)

**3-5 MINUTE YOUTUBE**:
- 0-30s: ACT 1 (full hook with pauses)
- 30-90s: ACT 2 (uncomfortable truth)
- 90-150s: ACT 3 (origin story with detail)
- 150-240s: ACT 4 (full breaking point)
- 240-300s: ACT 5 (transformation montage)
- 300-360s: ACT 6 (framework teaching)
- 360-420s: ACT 7 (mission + CTA)

**7-10 MINUTE LONGFORM**:
- Use ALL 7 acts with maximum depth
- Deploy ALL retention devices
- Re-hook every 90-120 seconds

### RETENTION DEVICES GLOSSARY:
- **OPEN LOOP**: Unanswered question viewer must stay to resolve
- **SUB-HOOK**: Secondary hook that re-captures attention
- **EMOTIONAL ANCHOR**: Recurring phrase/image viewer tracks
- **PATTERN INTERRUPT**: Unexpected statement contradicting belief
- **VISUAL STORYTELLING**: Specific sensory details creating mental scene
- **EMOTIONAL WHIPLASH**: Rapid shift positive to negative or vice versa
- **PROOF POINT**: Specific quantified result building credibility
- **CRESCENDO**: Building emotional momentum through repetition
- **CALL-BACK**: Reference to earlier moment (creates cohesion)
- **EDUCATIONAL VALUE**: Screenshot-worthy framework

### CRITICAL RULES:
- NEVER go 30+ seconds without a retention device
- ALWAYS include at least 3 retention devices in short-form (under 90s)
- PAUSE strategically - silence creates emphasis
- TEXT OVERLAYS reinforce key numbers/statements
- MUSIC matches energy shifts between acts
- DIRECTION notes guide production
- Consider platform duration for proper ACT compression

### UBUNTU PRINCIPLES (Apply Throughout):
1. **WE Over I**: Collective experience first, personal proof later
2. **System Villains**: Blame systems/structures, not people
3. **Collective Results**: Frame success as community win
4. **But/Therefore Dance**: "We believe X, BUT reality is Y, THEREFORE Z"

### OUTPUT FORMAT:

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Compelling script title",
  "actStructure": {
    "act1_negative_hook": {
      "timing": "0:00-0:15",
      "energy": "Low, intense, whisper",
      "script": "[DIRECTION] Camera tight. Low energy. [YOU]: Script content here with pauses.",
      "visual": "What viewer sees",
      "retentionDevice": "OPEN LOOP - specific example",
      "shadowFear": "Which Shadow Fear targeted"
    },
    "act2_uncomfortable_truth": {
      "timing": "0:15-1:00",
      "energy": "Conversational, inviting but intense",
      "script": "[DIRECTION] Wider shot. Music begins. [YOU]: Script content challenging beliefs.",
      "visual": "What viewer sees",
      "retentionDevice": "SUB-HOOK - pattern interrupt",
      "newConcept": "Framework/term introduced"
    },
    "act3_origin_story": {
      "timing": "1:00-2:30",
      "energy": "Vulnerable, slower pace, raw emotion",
      "script": "[DIRECTION] Emotional. Slower. [YOU]: Origin story with quantified details.",
      "visual": "What viewer sees",
      "retentionDevice": "EMOTIONAL ANCHOR - recurring motif",
      "emotionalAnchor": "Mother's words / bathroom floors / etc.",
      "numbers": "R400/month, R13/day"
    },
    "act4_breaking_point": {
      "timing": "2:30-4:00",
      "energy": "Lowest point, quiet, confessional",
      "script": "[DIRECTION] Lowest energy. Confessional. [YOU]: Nuclear story, crisis moment.",
      "visual": "What viewer sees",
      "retentionDevice": "EMOTIONAL WHIPLASH - triumph to devastation",
      "crisisPoint": "The rock bottom moment"
    },
    "act5_transformation_journey": {
      "timing": "4:00-5:30",
      "energy": "Building, pace picks up, music swells",
      "script": "[DIRECTION] Montage. Quick cuts. [YOU]: Milestone → Milestone → Milestone.",
      "visual": "What viewer sees",
      "retentionDevice": "PROOF POINT - specific ROI numbers",
      "numbers": "R6,000 → R600,000 (10,000% ROI)",
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"]
    },
    "act6_framework": {
      "timing": "5:30-6:30",
      "energy": "Teaching mode, confident, authoritative",
      "script": "[DIRECTION] Direct to camera. Teaching energy. [YOU]: Framework breakdown.",
      "visual": "What viewer sees",
      "retentionDevice": "EDUCATIONAL VALUE - screenshot-worthy",
      "framework": "PAIDS / 4E / R×A×C×U^B / Shadow Fears / custom",
      "textOverlays": ["Key point 1", "Key point 2", "Key point 3"]
    },
    "act7_mission_cta": {
      "timing": "6:30-7:30",
      "energy": "HIGHEST energy, preacher moment",
      "script": "[DIRECTION] Stand up. Point at camera. [YOU]: Mission statement building with repetition. CTA.",
      "visual": "What viewer sees",
      "retentionDevice": "CRESCENDO - repetitive building",
      "cta": "Specific call to action",
      "collectiveAction": "What WE will do together"
    }
  },
  "fullScript": "Complete formatted script with CLEAR ACT DIVISIONS. Use this exact format for EACH of the 7 acts:

⏱ [TIMING] ACT X: [ACT NAME]
[DIRECTION] Direction notes for energy/camera/music

[YOU]: Actual script content to be spoken on camera, including [PAUSE] markers, [TEXT OVERLAY: content] markers, and all delivery notes.

Example for Act 1:
⏱ 0:00 - 0:15 ACT 1: THE NEGATIVE HOOK
[DIRECTION] Camera tight on face. Low, intense energy. Almost a whisper. No music yet.

[YOU]: 96% of content creators in Africa will never make a living from their content.

[DIRECTION] PAUSE. 2 full seconds of silence. Stare into camera.

[YOU]: Not because they're not talented. Not because the algorithm hates them. But because they're building like employees... on platforms they will never own.

Repeat this format for all 7 acts. Direction notes and timing are for production - only [YOU] lines are spoken on camera.",
  "bRoll": [
    "B-roll suggestion 1 (specific to content)",
    "B-roll suggestion 2 (specific to content)",
    "B-roll suggestion 3 (specific to content)"
  ],
  "retentionDevicesUsed": {
    "act1": "OPEN LOOP",
    "act2": "SUB-HOOK",
    "act3": "EMOTIONAL ANCHOR",
    "act4": "EMOTIONAL WHIPLASH",
    "act5": "PROOF POINT",
    "act6": "EDUCATIONAL VALUE",
    "act7": "CRESCENDO + CALL-BACK"
  },
  "compliance": {
    "icp": "ICP 1 — The Called Expert | ICP 2 — The Content Creator Inspirer",
    "shadowFear": "Fear name (#number) from the 10 NOCHILL shadow fears",
    "villain": "Named system/situation villain — never a person",
    "atomicShareLine": "The one line viewers can share verbatim",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "retentionLoop": "The exact retention loop tease line at the end",
    "section13": {
      "hookQuality": "✅/❌ — R×A×C×U^B check",
      "wStackOrder": "✅/❌ — WHAT+WHY leads, no backstory first",
      "intensity": "✅/❌ — 70%+ intensity from word one",
      "rehooking": "✅/❌ — sub-hook cadence used",
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
      "weOverI": "✅/❌ — WE framing in Acts 1-2 and 6-7, I only in Acts 3-5",
      "systemVillain": "✅/❌ — system/situation blamed, never a person",
      "collectiveResult": "✅/❌ — CTA frames collective action, not individual glory"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}

### CRITICAL REQUIREMENTS:

**7-Act Retention Formula Application:**
1. **ACT 1 (0:00-0:15)**: Negative hook - stop scroll, create open loop, introduce yourself with authority
2. **ACT 2 (0:15-1:00)**: Uncomfortable truth - pattern interrupt, challenge beliefs, introduce new concept
3. **ACT 3 (1:00-2:30)**: Origin story - build credibility through vulnerability, emotional anchor, quantified details
4. **ACT 4 (2:30-4:00)**: Breaking point - nuclear story, crisis/rock bottom, emotional whiplash
5. **ACT 5 (4:00-5:30)**: Transformation journey - decision/turning point, rapid wins, proof points
6. **ACT 6 (5:30-6:30)**: Framework teaching - deliver lesson, make it shareable, screenshot-worthy
7. **ACT 7 (6:30-7:30)**: Mission + CTA - rally cry, crescendo building, collective action

**4 Viral Scripting Principles (EVERY ACT):**
8. **NEGATIVITY**: Use indirect negativity (attack systems/problems, NOT viewer) - especially ACT 1-2
9. **YOU FORMAT**: Use "YOU" exclusively in ALL acts (never "they/people/someone")
10. **SHORT & SIMPLE**: Concise sentences, simple words, cut filler ruthlessly throughout
11. **AUDIBLE FLOW**: Script must sound natural when read aloud (conversational rhythm)

**Retention Devices (MANDATORY):**
12. **Deploy retention device in EVERY act** - never go 30+ seconds without one
13. **Short-form (under 90s)**: Minimum 3 retention devices total
14. **Long-form (5+ min)**: Re-hook every 90-120 seconds with sub-hooks

**Content Quality:**
15. **Include specific numbers** in ACT 3-5 (R750 → R100K format, R6K phone → R600K revenue)
16. **Platform-optimize timing** - adapt ACT structure to platform duration
17. **Reference frameworks** (PAIDS, 4E, R×A×C×U^B, Shadow Fears) in ACT 6 teaching
18. **Include fullScript field** with complete camera-ready narration formatted by ACT
19. **Direction notes included** in fullScript - [DIRECTION], [YOU]:, [PAUSE], [TEXT OVERLAY: ]

### CRITICAL DON'TS (Automatic Failure):

❌ Attack the viewer directly (indirect negativity only)
❌ Use "they/people/someone" instead of "YOU"
❌ Use complex words when simple ones work
❌ Write scripts that don't pass the audible flow check (read aloud test)
❌ Go more than 30 seconds without a retention device
❌ Blame people as villains (blame SYSTEMS only in ACT 2)
❌ Create individual-focused CTAs (collective action in ACT 7)
❌ Skip the fullScript field (required for teleprompter integration)
❌ Forget DIRECTION notes in fullScript (they guide production)

### RETENTION DEVICE DEPLOYMENT STRATEGY:

**Short-form (60-90s):**
- ACT 1: OPEN LOOP (unanswered question)
- ACT 2 + compressed ACT 3: SUB-HOOK (pattern interrupt)
- ACT 4-5: EMOTIONAL WHIPLASH + PROOF POINT
- ACT 6: EDUCATIONAL VALUE (screenshot-worthy)
- ACT 7: CRESCENDO (building repetition)

**Long-form (5-15min):**
- ALL 7 acts with full retention devices deployed
- Re-hook every 90-120 seconds with sub-hooks
- Multiple emotional anchors throughout
- Call-backs to earlier moments for cohesion

REMEMBER:
- WE over I (Ubuntu) in ACT 1-2, 6-7
- Personal story (I) only in ACT 3-5 for credibility
- Systems are villains (ACT 2), not people
- Collective CTA (ACT 7), not individual win
- MUST include fullScript field formatted by ACT
- DIRECTION notes are critical for production
- Platform duration determines ACT compression
`

    // Call Claude API — streaming to avoid 504 on long generations
    console.log('Calling Claude API (streaming)...')

    const stream = anthropic.messages.stream({
      model: MODELS.SONNET,
      max_tokens: 6000,
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
