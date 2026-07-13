import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = buildSystemPrompt('fears') + `

## FEAR ANALYZER — OUTPUT RULES

Your task: analyze the audience description, identify which of the 10 NOCHILL Shadow Fears are MOST relevant, and generate R×A×C×U^B hooks for each.

Return ONLY a JSON object (no markdown):
{
  "identifiedFears": [
    {
      "fearId": 1,
      "fearName": "Wasted Life",
      "relevanceScore": 95,
      "reasoning": "This audience explicitly mentions...",
      "hooks": [
        "Hook 1 (max 25 words, YOU format, R×A×C×U^B compliant)",
        "Hook 2",
        "Hook 3"
      ],
      "contentStrategy": "Content angle that activates this fear without naming it"
    }
  ],
  "primaryFear": {
    "fearId": 1,
    "fearName": "Wasted Life",
    "reasoning": "Dominant theme in this audience description"
  },
  "recommendedApproach": "Lead hook strategy based on primary fear"
}

RULES:
1. Use NOCHILL Shadow Fear names (Wasted Life, Generational Poverty Trap, Imposter Syndrome, Wrong Path Terror, Invisible Labor, Platform Dependency, Time Anxiety, Relationship Loss, Spiritual Crisis, Legacy Void)
2. Identify 3-5 fears maximum (most relevant only), ranked by relevance score
3. All hooks ≤ 25 words, YOU format, indirect negativity (attack system not person)
4. Never name the shadow fear directly in the hook — activate it
5. Match fears to correct ICP (ICP 1 vs ICP 2) from the knowledge base`

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { audienceDescription } = body

    if (!audienceDescription || !audienceDescription.trim()) {
      return NextResponse.json(
        { error: 'Audience description is required' },
        { status: 400 }
      )
    }

    const userPrompt = `Analyze this audience and identify their Shadow Fears:

AUDIENCE DESCRIPTION:
"${audienceDescription}"

Identify the top 3-5 most relevant Shadow Fears from the 10 categories. For each identified fear, generate 3 scroll-stopping hooks and explain the content strategy.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      system: SYSTEM_PROMPT,
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
      throw new Error('Failed to parse fear analysis from Claude response')
    }

    return NextResponse.json({
      success: true,
      analysis: result,
      metadata: {
        audienceDescription,
        fearsIdentified: result.identifiedFears.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Fear analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze fears' },
      { status: 500 }
    )
  }
}
