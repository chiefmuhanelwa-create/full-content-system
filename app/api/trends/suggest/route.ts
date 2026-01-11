import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { trend, niche, platform } = await request.json()

    if (!trend) {
      return NextResponse.json({ error: 'Trend is required' }, { status: 400 })
    }

    const prompt = `You are a viral content strategist. Create content suggestions for this trend:

TREND: ${trend}
NICHE: ${niche}
PLATFORM: ${platform}

Generate:

1. CONTENT ANGLES (5 unique perspectives):
   - Different ways to approach this trend
   - Each angle should be specific and actionable
   - Mix: educational, controversial, case study, myth-busting, behind-the-scenes

2. HOOK IDEAS (5 scroll-stopping hooks):
   - Use R×A×C×U^B Hook Science
   - Make them platform-specific
   - Each hook should grab attention immediately

3. HASHTAGS (8-12 relevant hashtags):
   - Mix high-volume and niche-specific
   - Include trend-specific tags
   - Platform-optimized

4. TIMING SUGGESTION:
   - Best time to post this content
   - Why this timing matters
   - How long the trend will last

Return a JSON object with this structure:
{
  "contentAngles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
  "hookIdeas": ["hook1", "hook2", "hook3", "hook4", "hook5"],
  "hashtags": ["tag1", "tag2", ...],
  "timingSuggestion": "Post within next 48 hours - trend is at peak virality"
}

Be specific and immediately actionable. These suggestions should help create content TODAY.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
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
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
