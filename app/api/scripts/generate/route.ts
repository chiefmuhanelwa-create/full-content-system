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
${duration ? `Duration: ${duration}` : 'Duration: Auto-optimize'}

## GENERATION TASK

Create a COMPLETE production-ready script with:

### STRUCTURE (SEEDS Framework):
1. **SETUP (Hook - First 3-5 seconds)**
   - Scroll-stopping opening using R×A×C×U^B formula
   - Create immediate pattern interrupt

2. **ESCALATION (Context - 5-15 seconds)**
   - Establish the problem/topic
   - Build tension or curiosity

3. **EMOTION (Peak - 15-30 seconds)**
   - Main teaching content (FRESH, not template)
   - Use frameworks from knowledge base
   - This is 80% of the script

4. **DISCOVERY (Solution - 30-50 seconds)**
   - Actionable insights or steps
   - Include Ndivhuwo story snippet HERE (20% credibility)
   - Keep story under 15 seconds

5. **SUMMARY (CTA - Last 5-10 seconds)**
   - Clear call to action
   - Platform-optimized engagement ask

### CONTENT SPLIT (CRITICAL):
- **80% FRESH TEACHING**: Use frameworks, psychology, fresh insights
- **20% NDIVHUWO STORY**: Select 1 relevant story from story bank as proof point

### OUTPUT FORMAT:

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Compelling script title",
  "hook": "First 3-5 second opening line",
  "breakdown": [
    {
      "timestamp": "0-3s",
      "script": "Exact words to say (conversational, natural)",
      "visual": "What viewer sees on screen",
      "hookRetention": "Why they keep watching"
    },
    {
      "timestamp": "3-8s",
      "script": "...",
      "visual": "...",
      "hookRetention": "..."
    }
    // Continue for full duration
  ],
  "cta": "Final call to action (platform-specific)",
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
  "ndivhuwoTouch": {
    "story": "Selected story snippet from story bank (12-15 seconds)",
    "placement": "After main teaching content",
    "duration": "12 seconds"
  }
}

### CRITICAL REQUIREMENTS:

1. **Generate FRESH teaching content** (don't use story as filler)
2. **Select ONE relevant Ndivhuwo story** from the story bank
3. **Place story AFTER teaching** as proof/credibility
4. **Use SEEDS structure** throughout
5. **Platform-optimize timing** and visuals
6. **Apply 4 scripting principles**: Negativity (indirect), You-format, Short & Simple, Audible Flow
7. **Include specific numbers** when using stories
8. **Emotional arc in story**: Before → After → Lesson
9. **Second-by-second breakdown** with exact timestamps
10. **Natural, conversational language** (sounds good spoken out loud)

REMEMBER: The script should teach (80%) and use story as proof (20%), not the other way around!
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
