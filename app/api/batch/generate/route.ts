import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { niche, goals, postingFrequency, platforms } = await request.json()

    if (!niche || !goals) {
      return NextResponse.json({ error: 'Niche and goals are required' }, { status: 400 })
    }

    const numPosts = postingFrequency === 'daily' ? 30 : postingFrequency === 'weekdays' ? 22 : 13

    const prompt = `You are a content strategist. Create a comprehensive ${numPosts}-day content plan.

NICHE: ${niche}
GOALS: ${goals}
PLATFORM: ${platforms}
POSTING FREQUENCY: ${postingFrequency}

Create a strategic content plan with:
- Topic variety (educational, case studies, myths, trends, behind-the-scenes)
- Strategic progression (build authority, then sell)
- Mix of content types (scripts, hooks, stories, tips)
- Aligned with content goals

For each day provide:
- Day number (1-${numPosts})
- Date (starting from today, format: "Jan 11, 2026")
- Topic (specific, actionable topic)
- Hook Idea (attention-grabbing hook for that content)
- Content Type (e.g., "Educational", "Case Study", "Myth-Busting", "Trending Topic", "Story")
- Platform (${platforms})
- Notes (brief strategy note - why this content, what to include)

Return a JSON array with this structure:
[
  {
    "day": 1,
    "date": "Jan 11, 2026",
    "topic": "...",
    "hookIdea": "...",
    "contentType": "Educational",
    "platform": "${platforms}",
    "notes": "..."
  },
  {...}
]

Ensure content flows logically and builds momentum over 30 days. Start with value, then authority, then conversion-focused content.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Error generating batch plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate content plan' },
      { status: 500 }
    )
  }
}
