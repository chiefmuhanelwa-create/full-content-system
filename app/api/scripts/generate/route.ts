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
      "script": "WE-focused opening with pattern interrupt",
      "visual": "What viewer sees",
      "ubuntuPrinciple": "Which Ubuntu principle applies"
    },
    "collision": {
      "timestamp": "8-18s",
      "script": "Name the system villain and build tension",
      "visual": "What viewer sees",
      "systemVillain": "What system/structure is the problem"
    },
    "conversion": {
      "timestamp": "18-35s",
      "script": "Teach the framework/strategy (80% teaching)",
      "visual": "What viewer sees",
      "framework": "Which framework from knowledge base"
    },
    "calibration": {
      "timestamp": "35-48s",
      "script": "Ndivhuwo story as proof (20% story)",
      "visual": "What viewer sees",
      "storyUsed": "Which story from story bank",
      "numbers": "Specific metrics from story"
    },
    "community": {
      "timestamp": "48-60s",
      "script": "Ubuntu CTA with collective framing",
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
  ]
}

### CRITICAL REQUIREMENTS:

1. **Use WE language** in Context (0-8s), transition to I only when sharing personal proof
2. **Name SYSTEM villains** (not people) in Collision phase
3. **Apply But/Therefore dance** throughout script transitions
4. **Generate FRESH teaching content** in Conversion (80% of value)
5. **Select ONE relevant Ndivhuwo story** for Calibration (20% proof)
6. **Frame CTA as collective action** (Ubuntu principle)
7. **Include specific numbers** when using stories
8. **Platform-optimize timing** and visuals
9. **Natural, conversational language** (sounds good spoken out loud)
10. **Stick to 5-Line timing**: 0-8s, 8-18s, 18-35s, 35-48s, 48-60s

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
