import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
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
      model: 'claude-sonnet-4-6',
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
