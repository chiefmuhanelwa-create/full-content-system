import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

const SHADOW_FEARS = [
  {
    id: 1,
    name: 'Fear of Invisibility',
    description: 'What if nobody ever notices me?',
    indicators: ['ignored', 'unnoticed', 'invisible', 'overlooked', 'forgotten'],
  },
  {
    id: 2,
    name: 'Fear of Wasted Potential',
    description: 'What if I\'m capable of more but never reach it?',
    indicators: ['potential', 'capable', 'talent', 'wasting', 'unfulfilled'],
  },
  {
    id: 3,
    name: 'Fear of Being Left Behind',
    description: 'What if everyone else figures it out except me?',
    indicators: ['left behind', 'everyone else', 'missed out', 'late', 'falling behind'],
  },
  {
    id: 4,
    name: 'Fear of Exposure',
    description: 'What if they find out I\'m not as good as I seem?',
    indicators: ['impostor', 'fake', 'fraud', 'exposed', 'not good enough'],
  },
  {
    id: 5,
    name: 'Fear of Permanent Mediocrity',
    description: 'What if this is as good as it gets?',
    indicators: ['stuck', 'plateau', 'mediocre', 'average', 'settling'],
  },
  {
    id: 6,
    name: 'Fear of Missed Timing',
    description: 'What if I\'m too late/too early?',
    indicators: ['too late', 'too early', 'timing', 'missed opportunity', 'wrong time'],
  },
  {
    id: 7,
    name: 'Fear of Being Forgotten',
    description: 'What if my work doesn\'t matter long-term?',
    indicators: ['forgotten', 'legacy', 'lasting impact', 'remembered', 'irrelevant'],
  },
  {
    id: 8,
    name: 'Fear of Financial Dependency',
    description: 'What if I never control my own income?',
    indicators: ['broke', 'dependent', 'paycheck', 'financial freedom', 'money control'],
  },
  {
    id: 9,
    name: 'Fear of Creative Exhaustion',
    description: 'What if I run out of ideas/relevance?',
    indicators: ['running out', 'dried up', 'burnout', 'no ideas', 'creative block'],
  },
  {
    id: 10,
    name: 'Fear of Systemic Exclusion',
    description: 'What if the game is rigged against people like me?',
    indicators: ['rigged', 'unfair', 'excluded', 'system', 'gatekeeping'],
  },
]

const SYSTEM_PROMPT = `You are a Shadow Fear Psychology expert analyzing audience descriptions to identify their deepest unspoken fears.

## THE 10 SHADOW FEARS:

${SHADOW_FEARS.map(
  (fear) =>
    `${fear.id}. **${fear.name}**: "${fear.description}"\nIndicators: ${fear.indicators.join(', ')}`
).join('\n\n')}

## YOUR TASK:

1. Analyze the audience description
2. Identify which Shadow Fears are MOST relevant (rank top 3-5)
3. Explain WHY each fear applies to this specific audience
4. Generate 3 fear-targeted hook examples for EACH identified fear
5. Suggest content strategies that address these fears

## OUTPUT FORMAT:

Return ONLY a JSON object (no markdown):
{
  "identifiedFears": [
    {
      "fearId": 1,
      "fearName": "Fear of Invisibility",
      "relevanceScore": 95,
      "reasoning": "This audience explicitly mentions feeling overlooked...",
      "hooks": [
        "We've all been told to post more, but you're still invisible on the algorithm",
        "Your family thinks you're wasting time, but nobody's watching your content anyway",
        "Stop posting into the void. Here's how to get noticed."
      ],
      "contentStrategy": "Create content about getting attention, standing out, pattern interrupts"
    }
  ],
  "primaryFear": {
    "fearId": 8,
    "fearName": "Fear of Financial Dependency",
    "reasoning": "Money anxiety is the dominant theme in this audience description"
  },
  "recommendedApproach": "Lead with financial freedom hooks, transition to skill-building content"
}

## CRITICAL RULES:

1. Identify 3-5 fears maximum (most relevant only)
2. Rank by relevance score (0-100)
3. Generate 3 unique hooks per fear
4. All hooks must use R×A×C×U^B formula
5. All hooks must use indirect negativity (attack system, not person)
6. All hooks must use YOU format
7. Provide actionable content strategy
`

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
      model: MODELS.SONNET,
      max_tokens: 4096,
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
