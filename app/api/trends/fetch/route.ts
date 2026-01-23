import { NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const { niche, platform } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const prompt = `You are a social media trend analyst. Identify the top 8-10 trending topics right now for ${niche} on ${platform}.

Consider:
- Current viral conversations
- Emerging technologies or methods
- Controversial debates
- Success stories gaining traction
- Common pain points being discussed

For each trend, provide:
- Topic: Short name (3-6 words)
- Volume: "High", "Medium", or "Rising"
- Platform: Where it's trending most
- Relevance: 1-100 score for how relevant to ${niche}

Return a JSON array with this structure:
[
  {
    "topic": "...",
    "volume": "High",
    "platform": "${platform}",
    "relevance": 95
  },
  {...}
]

Only return trends that are happening NOW (2026). Be specific and actionable.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
    const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ trends })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
