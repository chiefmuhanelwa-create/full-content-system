import { NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const { performanceData } = await request.json()

    if (!performanceData || performanceData.length === 0) {
      return NextResponse.json(
        { error: 'No performance data provided' },
        { status: 400 }
      )
    }

    // Analyze performance data with Claude
    const prompt = `You are a content performance analyst specializing in viral content strategy.

Analyze this performance data and provide 5 actionable insights and recommendations:

${JSON.stringify(performanceData, null, 2)}

Focus on:
1. Which hook types perform best
2. Which platforms show highest engagement
3. Content patterns that drive shares
4. Timing patterns for better performance
5. Specific recommendations for future content

Return a JSON object with this structure:
{
  "recommendations": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "bestHookType": "hook type name",
  "bestPlatform": "platform name",
  "keyPattern": "main pattern discovered"
}

Be specific and actionable. Use the actual data provided.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : { recommendations: [] }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
