import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { answers } = body

    // Validate required fields
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Answers object is required' },
        { status: 400 }
      )
    }

    // Construct user prompt with questionnaire answers
    const userPrompt = `Analyze these responses and extract 5-10 powerful proof stories:

${Object.entries(answers)
  .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
  .join('\n\n')}

For each story:
1. Apply the 4-CRITERIA TEST (Special, Relevant, Quantifiable, Named)
2. Story must pass 3 of 4 criteria
3. Extract specific numbers and metrics
4. Identify transformation (before → after)
5. Suggest best use cases for content

Return a JSON object with this structure:
{
  "stories": [
    {
      "title": "Short, compelling title",
      "content": "Full story in 2-3 sentences",
      "type": "transformation|achievement|milestone|case_study",
      "criteria": {
        "special": true/false,
        "relevant": true/false,
        "quantifiable": true/false,
        "named": true/false
      },
      "metrics": {
        "before": "Starting point",
        "after": "End result",
        "timeframe": "Duration"
      },
      "useCase": "Best for: educational content about X"
    }
  ]
}`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 4096,
      system: buildSystemPrompt('stories'),
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
    let result: any
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(content.text)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse stories from Claude response')
    }

    return NextResponse.json({
      success: true,
      stories: result.stories,
      metadata: {
        totalStories: result.stories.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Story extraction error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to extract stories' },
      { status: 500 }
    )
  }
}
