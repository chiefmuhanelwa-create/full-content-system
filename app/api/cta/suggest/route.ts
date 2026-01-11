import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { contentContext, goal } = await request.json()

    const prompt = `Generate custom CTAs for this content:

CONTENT: ${contentContext}
GOAL: ${goal}

Provide:
1. CUSTOM CTAs (5): Specific to this content
2. PLATFORM-SPECIFIC (Instagram, TikTok, YouTube, LinkedIn): Optimized CTA for each
3. A/B TESTING ADVICE: How to test these CTAs

Return JSON:
{
  "customCTAs": ["...", ...],
  "platformSpecific": {"instagram": "...", "tiktok": "...", "youtube": "...", "linkedin": "..."},
  "testingAdvice": "..."
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ suggestions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}
