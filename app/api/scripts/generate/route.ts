import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { SCRIPT_WRITER_PROMPT } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hook, goal, platform, duration, topic } = body

    // Validate required fields
    if (!hook || !goal || !platform || !duration) {
      return NextResponse.json(
        { error: 'Hook, goal, platform, and duration are required' },
        { status: 400 }
      )
    }

    // Construct user prompt
    const userPrompt = `Create a complete viral script using the SEEDS framework:

Hook: "${hook}"
Goal: ${goal} (Entertain, Educate, Encourage, or Earn)
Platform: ${platform}
Duration: ${duration}
Topic: ${topic || 'Based on the hook'}

Requirements:
1. Use SEEDS structure (Start, Explain, Evidence, Deliver, Sell)
2. Provide second-by-second breakdown from 0 to ${duration}
3. Include visual directions for each segment
4. Suggest B-roll footage
5. Recommend text overlays
6. Ensure each second has a hook retention reason

Return a JSON object with this structure:
{
  "title": "Script title",
  "hook": "Opening hook line",
  "breakdown": [
    {
      "timestamp": "0-3s",
      "script": "Exact words to say",
      "visual": "What's shown on screen",
      "hookRetention": "Why viewer keeps watching"
    }
  ],
  "cta": "Final call to action",
  "bRoll": ["B-roll suggestion 1", "B-roll suggestion 2"],
  "textOverlays": ["Text overlay 1", "Text overlay 2"]
}

Make it ${goal.toLowerCase()} and platform-optimized for ${platform}.`

    // Call Claude API with larger token limit for scripts
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 4096,
      system: SCRIPT_WRITER_PROMPT,
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
        hook,
        goal,
        platform,
        duration,
        generatedAt: new Date().toISOString(),
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
