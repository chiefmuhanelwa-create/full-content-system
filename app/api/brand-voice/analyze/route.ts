import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { brandVoice, contentSamples } = await request.json()

    const systemPrompt = `You are the NOCHILL Brand Voice Analyzer for Ndivhuwo Muhanelwa (@nochill_god).

NOCHILL VOICE STANDARD — score content against these:
- Direct sentence structure. No filler, no AI slop phrases
- YOU format throughout — never "people", "they", "one", "creators" — always "you"
- SA/African context: ZAR not dollars, WhatsApp, ManyChat, local platforms
- BANNED WORDS absent: delve, certainly, leverage, synergy, empower, journey, unlock, game-changer, hustle, grind, seamless
- Signature phrases (natural use): "That's when..." | "But here's the thing..." | "You understand? Because you understand."
- Shadow fear activated implicitly — never named directly
- Specific numbers beat vague claims. Dates + ZAR amounts beat generic achievements
- Short declarative sentences. Admission before flex. Active voice only.
- Confrontational but loving — names the real problem, doesn't coddle

Return ONLY valid JSON (no markdown fences):
{
  "tone": "detected tone description",
  "alignmentScore": 0-100,
  "consistency": 0-100,
  "suggestions": ["specific improvement 1", "specific improvement 2", "specific improvement 3", "specific improvement 4", "specific improvement 5"]
}`

    const prompt = `Analyze if this content matches the NOCHILL brand voice standard:

DEFINED VOICE: ${brandVoice}
CONTENT SAMPLES: ${contentSamples}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1500,
      system: systemPrompt,
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
