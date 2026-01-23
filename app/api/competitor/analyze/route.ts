import { NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const { competitorName, content } = await request.json()

    const prompt = `Analyze this competitor's content and provide strategic insights:

COMPETITOR: ${competitorName || 'Unknown'}
CONTENT SAMPLES:
${content}

Provide:
1. TOP HOOK PATTERNS (5): What hooks do they use repeatedly?
2. CONTENT GAPS (5): What are they NOT covering that you could?
3. STRENGTHS & WEAKNESSES (3 each)
4. YOUR OPPORTUNITIES (5): How can you differentiate?

Return JSON:
{
  "topHookPatterns": ["...", ...],
  "contentGaps": ["...", ...],
  "strengthsWeaknesses": {"strengths": ["...", ...], "weaknesses": ["...", ...]},
  "opportunities": ["...", ...]
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ analysis })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 })
  }
}
