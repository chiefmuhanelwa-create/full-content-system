import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'
import ndivhuwoStories from '@/lib/knowledge/ndivhuwo-stories.json'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea, platform, duration } = body

    // Validate required fields
    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      )
    }

    // Build system prompt with framework knowledge
    const systemPrompt = buildSystemPrompt('scripts')

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

${JSON.stringify(ndivhuwoStories, null, 2)}

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

    // Build user context
    const userPrompt = `## USER'S CONTENT IDEA

"${idea}"

${platform ? `Platform: ${platform}` : 'Platform: Auto-detect best fit'}
${duration ? `Duration: ${duration}` : 'Duration: Auto-optimize (default 60s)'}

## GENERATION TASK

Create a COMPLETE production-ready script using the NOCHILL 5-Line Method:

### STRUCTURE (NOCHILL 5-Line Method):

**LINE 1: CONTEXT (0-8 seconds) - "WE" Not "I"**
- Use UBUNTU Story Arc: Start with collective truth (WE experienced this)
- Pattern interrupt with shared problem
- Apply R×A×C×U^B formula for hook
- CRITICAL: Use "WE" language, not "I" (unless transition at 5-6s)
- Example: "We've all been told..." → "Here's what nobody tells you..."

**LINE 2: COLLISION (8-18 seconds) - The Crisis**
- Name the SYSTEM villain (not people): algorithm changes, industry gatekeeping, outdated advice
- Build tension around the collective problem
- Use But/Therefore dance: "We think X, BUT reality is Y, THEREFORE we need Z"
- Show the gap between promise and reality

**LINE 3: CONVERSION (18-35 seconds) - The Framework**
- 80% FRESH TEACHING: Introduce your framework/method
- Use frameworks from knowledge base (PAIDS, 4E, Shadow Fears, etc.)
- Teach the system/strategy (not just tips)
- Keep language conversational and actionable
- This is the MEAT of the content

**LINE 4: CALIBRATION (35-48 seconds) - The Proof**
- 20% NDIVHUWO STORY: Select 1 relevant story from story bank
- Use as PROOF POINT (not main content)
- Include specific numbers and emotional arc
- Show Before → Numbers → Lesson
- Maximum 12-15 seconds for story

**LINE 5: COMMUNITY (48-60 seconds) - Ubuntu CTA**
- Call to action emphasizing COLLECTIVE action
- "Join us," "Let's build together," "We're creating..."
- Focus on WE outcomes, not just individual gain
- Platform-optimized engagement ask
- Ubuntu principle: "I am because we are"

### UBUNTU STORY ARC PRINCIPLES (CRITICAL):

1. **WE Over I**: Start with collective experience, transition to personal proof
2. **System Villains**: Blame systems/structures, not people
3. **Collective Results**: Frame success as community win, not solo achievement
4. **But/Therefore Dance**: "We believe X, BUT reality is Y, THEREFORE we need Z"

### CONTENT SPLIT (CRITICAL):
- **80% FRESH TEACHING**: Framework/strategy in Conversion phase
- **20% NDIVHUWO STORY**: Proof point in Calibration phase

### OUTPUT FORMAT:

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Compelling script title",
  "fiveLine": {
    "context": {
      "timestamp": "0-8s",
      "script": "WE-focused opening with pattern interrupt (YOU format, indirect negativity, short & punchy, audible flow)",
      "visual": "What viewer sees",
      "ubuntuPrinciple": "Which Ubuntu principle applies",
      "shadowFear": "Which Shadow Fear targeted"
    },
    "collision": {
      "timestamp": "8-18s",
      "script": "Name the system villain and build tension (YOU format, indirect negativity, short & punchy, audible flow)",
      "visual": "What viewer sees",
      "systemVillain": "What system/structure is the problem (NOT people)"
    },
    "conversion": {
      "timestamp": "18-35s",
      "script": "Teach the framework/strategy - 80% teaching (YOU format, indirect negativity, short & punchy, audible flow)",
      "visual": "What viewer sees",
      "framework": "Which framework from knowledge base (PAIDS/4E/Shadow Fears/etc.)"
    },
    "calibration": {
      "timestamp": "35-48s",
      "script": "Ndivhuwo story as proof - 20% story (YOU format when addressing viewer, short & punchy, audible flow)",
      "visual": "What viewer sees",
      "storyUsed": "Which story from story bank (title)",
      "numbers": "Specific metrics from story (R750 → R100K, etc.)"
    },
    "community": {
      "timestamp": "48-60s",
      "script": "Ubuntu CTA with collective framing (YOU format, WE outcomes, short & punchy, audible flow)",
      "visual": "What viewer sees",
      "collectiveAction": "What WE will do together"
    }
  },
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
  "racub_analysis": {
    "relevant": "Who this targets (specific audience)",
    "awareness": "Awareness level (symptom/problem/solution/product)",
    "clarity": "Clear outcome promised",
    "unique": "Pattern break/unique angle",
    "broadened": "How it's accessible to wider audience"
  },
  "ubuntu_check": {
    "we_over_i": "✅ WE framing in Context, I only in Calibration",
    "system_villain": "✅ System blamed (e.g., 'platform dependency'), NOT people",
    "collective_result": "✅ Community transformation shown in Community CTA"
  },
  "scripting_principles_check": {
    "negativity": "✅ Indirect negativity applied (attacks problems, not viewer)",
    "you_format": "✅ YOU format used throughout (no they/people/someone)",
    "short_simple": "✅ Concise sentences, simple words, active voice",
    "audible_flow": "✅ Passes read-aloud test, natural conversational rhythm"
  }
}

### CRITICAL REQUIREMENTS:

**NOCHILL 5-Line Method:**
1. **Use WE language** in Context (0-8s), transition to I only when sharing personal proof
2. **Name SYSTEM villains** (not people) in Collision phase
3. **Apply But/Therefore dance** throughout script transitions
4. **Generate FRESH teaching content** in Conversion (80% of value)
5. **Select ONE relevant Ndivhuwo story** for Calibration (20% proof)
6. **Frame CTA as collective action** (Ubuntu principle)
7. **Stick to 5-Line timing**: 0-8s, 8-18s, 18-35s, 35-48s, 48-60s

**Hook Science:**
8. **Apply R×A×C×U^B formula** to hook creation (Relevant, Awareness, Clarity, Unique, Broadened)
9. **Target ONE Shadow Fear** explicitly in hook/collision

**4 Viral Scripting Principles (EVERY LINE):**
10. **NEGATIVITY**: Use indirect negativity (attack systems/problems, NOT viewer)
11. **YOU FORMAT**: Use "YOU" exclusively (never "they/people/someone")
12. **SHORT & SIMPLE**: Concise sentences, simple words, cut filler ruthlessly
13. **AUDIBLE FLOW**: Script must sound natural when read aloud (conversational rhythm)

**Content Quality:**
14. **Include specific numbers** when using stories
15. **Platform-optimize timing** and visuals
16. **Reference frameworks** (PAIDS, 4E, Shadow Fears) when relevant

### CRITICAL DON'TS (Automatic Failure):

❌ Attack the viewer directly (indirect negativity only)
❌ Use "they/people/someone" instead of "YOU"
❌ Use complex words when simple ones work
❌ Write scripts that don't pass the audible flow check (read aloud test)
❌ Make story the main content (it's proof, not teaching)
❌ Use "I" in Context section (WE-focused until Calibration)
❌ Blame people as villains (blame SYSTEMS only)
❌ Create individual-focused CTAs (collective action only)

### BUT/THEREFORE DANCE TECHNIQUE:

Use throughout transitions:
- Context → Collision: "We think X, BUT the system does Y"
- Collision → Conversion: "The problem is real, THEREFORE here's the framework"
- Conversion → Calibration: "The method works, BUT don't just take my word for it"
- Calibration → Community: "I did it, THEREFORE we can all do it together"

REMEMBER:
- WE over I (Ubuntu Story Arc)
- Systems are villains, not people
- 80% teaching, 20% story proof
- Collective CTA, not individual win
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
        approach: '80% Fresh Teaching + 20% Ndivhuwo Stories',
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
