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

    const prompt = `You are a visual content strategist specializing in ${platform} content.

Based on this script, generate complete visual content package:

SCRIPT:
${script}

---

Generate the following:

1. THREE THUMBNAIL CONCEPTS:
   For each thumbnail provide:
   - Concept: Visual idea and mood
   - Colors: Color scheme (e.g., "Bold red & black contrast")
   - Text: Exact text to appear on thumbnail (5-7 words max, ALL CAPS)
   - Composition: Where elements should be placed

2. B-ROLL SUGGESTIONS (5-7 scenes):
   For each scene provide:
   - Scene: What to show
   - Duration: How long (e.g., "3-5 seconds")
   - Stock Keywords: 3-4 keywords to find stock footage

3. TEXT OVERLAYS (6-8 key phrases):
   - Extract the most impactful one-liners from the script
   - Make them short (3-6 words)
   - These will be animated text on screen

4. PLATFORM-SPECIFIC CAPTIONS:
   - Instagram: 150-200 chars with emojis and 3-5 hashtags
   - TikTok: 50-80 chars, casual tone with 2-3 hashtags
   - YouTube: 200-300 chars description with timestamps

Return a JSON object with this exact structure:
{
  "thumbnails": [
    {
      "concept": "...",
      "colors": "...",
      "text": "...",
      "composition": "..."
    },
    {...}, {...}
  ],
  "bRollSuggestions": [
    {
      "scene": "...",
      "duration": "...",
      "stockKeywords": ["keyword1", "keyword2", "keyword3"]
    },
    {...}
  ],
  "textOverlays": ["overlay1", "overlay2", ...],
  "captions": {
    "instagram": "...",
    "tiktok": "...",
    "youtube": "..."
  }
}

Be specific and actionable. Make visuals that will STOP THE SCROLL.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
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
