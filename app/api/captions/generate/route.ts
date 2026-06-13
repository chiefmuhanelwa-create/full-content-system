import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl

  try {
    const body = await request.json()
    const { script, platform = 'instagram', icp = 'auto', tone = 'auto' } = body

    if (!script || !script.trim()) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt('hooks')

    const platformRules: Record<string, string> = {
      instagram: '2200 chars max, 30 hashtags max. Mix niche + broad tags. First line must be hook.',
      tiktok: '2200 chars max, 3–5 hashtags only. Caption = hook, hashtags below.',
      youtube: '500 chars max, no hashtags needed — put them in tags field instead.',
      linkedin: '3000 chars max, 3–5 hashtags. Professional SA tone. End with CTA question.',
      facebook: '63,206 chars max but keep under 500 for engagement. 1–3 hashtags.',
      twitter: '280 chars max. No hashtags in tweet — put 1–2 at very end if needed.',
    }

    const userPrompt = `Generate a caption + hashtag set for this NOCHILL content.

PLATFORM: ${platform}
PLATFORM RULES: ${platformRules[platform] || platformRules.instagram}
ICP: ${icp === 'auto' ? 'Auto-detect from script content' : icp}
TONE: ${tone === 'auto' ? 'Match Ndivhuwo voice — direct, raw, SA energy' : tone}

SCRIPT CONTENT:
${script.slice(0, 2000)}

OUTPUT FORMAT (strict JSON):
{
  "caption": "The full caption text — first line is the hook that stops the scroll, then the body. SA context. ZAR pricing where relevant. Ndivhuwo voice — short sentences, no fluff. End with a CTA that drives a comment or save.",
  "hashtags": ["array", "of", "hashtags", "no", "hash", "symbol"],
  "altCaption": "A shorter alternative caption version (50% shorter than main, hook-focused only)",
  "captionWithHashtags": "The full caption with hashtags appended at the end, ready to copy-paste",
  "strategy": "1-sentence explanation of the hook choice and hashtag strategy"
}

CAPTION RULES:
- First line = stop-scroll hook (use R×A×C×U^B formula)
- Short punchy sentences — no walls of text
- SA/African context: ZAR not dollars, Mzansi not Africa
- NEVER use: journey, unlock, game-changer, empower, synergy, leverage, guru, grind
- End with action CTA: "comment your answer" / "save this" / "share with someone who..."
- Hashtags: mix niche (3-5 specific) + broad (5-10 reach) + community (5-10 SA/creator)

Return ONLY valid JSON. No markdown fences.`

    const response = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 3500,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'text', text: userPrompt },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = raw
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/\s*```$/m, '')
      .trim()

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)

    return NextResponse.json({ success: true, ...parsed })
  } catch (error: any) {
    console.error('Caption generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate caption' },
      { status: 500 }
    )
  }
}
