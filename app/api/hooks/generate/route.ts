import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt, buildUserContextPrompt } from '@/lib/knowledge-base'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      topic,
      platform,
      duration,
      tone,
      hookType,
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
    const userContext = buildUserContextPrompt({
      topic,
      platform,
      duration,
      tone,
      targetAudience,
      additionalContext: hookType ? `Hook Type Preference: ${hookType}` : undefined,
    })

    // Construct generation instruction
    const userPrompt = `${userContext}

## GENERATION TASK

Generate ${count} CUSTOM viral hooks for this specific user and context.

REQUIREMENTS:
1. Each hook must be 8-15 words maximum
2. Apply R×A×C×U^B formula intelligently (don't force it)
3. Use power words naturally from the categories that fit
4. Make it sound authentic to ${platform} audience
5. Address the viewer directly ("you" not "people")
6. Create curiosity gaps without clickbait
7. Consider which Shadow Fear their audience likely has

PROCESS:
1. Analyze the topic and identify the core pain/desire
2. Determine audience's awareness level (problem/solution aware)
3. Select appropriate power words from relevant categories
4. Apply proven hook patterns but make them UNIQUE
5. Ensure platform-specific optimization

CRITICAL: Generate FRESH hooks that sound like they could ONLY work for this topic/audience.
Don't use generic templates or copy example patterns verbatim.

OUTPUT FORMAT: Return ONLY a JSON array of ${count} hook strings, no other text.
Example: ["Hook 1 here", "Hook 2 here", "Hook 3 here"]`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 1024,
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

    // Parse the JSON response
    let hooks: string[]
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        hooks = JSON.parse(jsonMatch[0])
      } else {
        hooks = JSON.parse(content.text)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse hooks from Claude response')
    }

    return NextResponse.json({
      success: true,
      hooks,
      metadata: {
        topic,
        platform,
        duration,
        tone,
        hookType,
        targetAudience,
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
