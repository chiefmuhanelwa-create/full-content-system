import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { HOOK_GENERATOR_PROMPT } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, platform, duration, tone, hookType, count = 5 } = body

    // Validate required fields
    if (!topic || !platform) {
      return NextResponse.json(
        { error: 'Topic and platform are required' },
        { status: 400 }
      )
    }

    // Construct user prompt
    const userPrompt = `Generate ${count} viral hooks for:

Topic: ${topic}
Platform: ${platform}
Duration: ${duration || 'any'}
Tone: ${tone || 'any'}
Hook Type: ${hookType || 'any'}

Requirements:
- Each hook must be 8-15 words maximum
- Use the R×A×C×U^B formula (Relevance × Authenticity × Curiosity × Urgency ^ Boldness)
- Start with power words that trigger emotion
- Address the viewer directly when possible
- Create information gaps
- Be platform-specific (${platform} audience expectations)

Return ONLY a JSON array of strings. No other text.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 1024,
      system: HOOK_GENERATOR_PROMPT,
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
        count: hooks.length,
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
