import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { script, platform } = await request.json()

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 })
    }

    const systemPrompt = `You are the NOCHILL Visual Content System for Ndivhuwo Muhanelwa (@nochill_god), South African content creator.

BRAND VISUAL DNA:
- Colours: Heritage Gold (#C9A84C), Charcoal (#1C1C1C), Tool Black (#111111), Cream (#FAF7F0)
- Typography: Montserrat (headings, bold/black) + Lato (body)
- Tone: Raw, direct, confrontational energy in visuals — NOT polished, NOT corporate
- ICP 1 (Called Expert): professional/office/boardroom setups, suit + clean desk
- ICP 2 (Content Creator): phone, ring light, bedroom/home studio, casual lifestyle
- SA context first: Johannesburg skyline, townships, phones, people who look like Ndivhuwo's audience
- Thumbnail text: short, punchy, YOU format, max 6 words — activates a fear or desire, never explains

Generate visual content packages that support NOCHILL content. Return ONLY valid JSON (no markdown fences):
{
  "thumbnails": [
    { "concept": "...", "colors": "Heritage Gold + Charcoal", "text": "SHORT PUNCHY TEXT", "composition": "..." },
    { "concept": "...", "colors": "...", "text": "...", "composition": "..." },
    { "concept": "...", "colors": "...", "text": "...", "composition": "..." }
  ],
  "bRollSuggestions": [
    { "scene": "...", "duration": "3-5 seconds", "stockKeywords": ["keyword1", "keyword2", "keyword3"] }
  ],
  "textOverlays": ["overlay1", "overlay2", "overlay3", "overlay4", "overlay5", "overlay6"],
  "captions": {
    "instagram": "150-200 chars with 3-5 hashtags",
    "tiktok": "50-80 chars casual with 2-3 hashtags",
    "youtube": "200-300 chars description with timestamps"
  }
}`

    const prompt = `Generate a NOCHILL-branded visual content package for this ${platform} script:

SCRIPT:
${script}`

    const message = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const visuals = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ visuals })
  } catch (error) {
    console.error('Error generating visuals:', error)
    return NextResponse.json(
      { error: 'Failed to generate visual content' },
      { status: 500 }
    )
  }
}
