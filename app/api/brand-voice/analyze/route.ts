import { NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const { brandVoice, contentSamples } = await request.json()

    const prompt = `Analyze if this content matches the defined brand voice:

BRAND VOICE: ${brandVoice}
CONTENT: ${contentSamples}

Provide:
1. DETECTED TONE: What tone does the content have?
2. ALIGNMENT SCORE (0-100): How well does it match the brand voice?
3. CONSISTENCY RATING (0-100): Is the voice consistent throughout?
4. SUGGESTIONS (5): Specific improvements to match brand voice better

Return JSON:
{
  "tone": "...",
  "alignmentScore": 85,
  "consistency": 90,
  "suggestions": ["...", ...]
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
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
