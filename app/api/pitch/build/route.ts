import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

const PITCH_BUILDER_PROMPT = `You are a 5 Pillars Pitch expert helping creators build compelling pitches for brand deals, collaborations, and opportunities.

## THE 5 PILLARS FRAMEWORK:

1. **PERSON**: Who you are (credibility, background, expertise)
2. **POSITION**: What you do (niche, platform, content type)
3. **PROOF**: What you've achieved (numbers, results, testimonials)
4. **PAIN**: Problem you solve (audience pain point you address)
5. **PROMISE**: What you deliver (unique value proposition)

## YOUR TASK:

Analyze the user's input and build a complete 5 Pillars Pitch with:
1. Clear, compelling language for each pillar
2. Specific numbers and metrics where provided
3. Professional tone suitable for brand outreach
4. 2-3 variations of the pitch (30s, 60s, email format)

## OUTPUT FORMAT:

Return ONLY a JSON object (no markdown):
{
  "pitch": {
    "person": "Professional credibility statement (2-3 sentences)",
    "position": "Clear positioning statement (1-2 sentences)",
    "proof": "Quantifiable achievements (with specific numbers)",
    "pain": "Problem you solve for brands/audience (1-2 sentences)",
    "promise": "Unique value proposition (1-2 sentences)"
  },
  "variations": {
    "elevator": "30-second verbal pitch (2-3 sentences)",
    "video": "60-second video script pitch (full 5 Pillars)",
    "email": "Email pitch template (professional format)"
  },
  "recommendations": {
    "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
    "improvements": ["What to strengthen 1", "What to strengthen 2"],
    "targetBrands": ["Brand type 1", "Brand type 2", "Brand type 3"]
  }
}

## CRITICAL RULES:

1. Use specific numbers whenever provided
2. Keep language professional but authentic
3. Focus on VALUE you bring (not just followers)
4. Address brand goals (reach, engagement, conversions)
5. Make it memorable and unique
6. Include actionable next steps in variations
7. Emphasize PROOF over promises
8. Use YOU format when addressing brands
`

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { person, position, proof, pain, promise } = body

    if (!person || !position) {
      return NextResponse.json(
        { error: 'Person and Position fields are required' },
        { status: 400 }
      )
    }

    const userPrompt = `Build a complete 5 Pillars Pitch based on this information:

**PERSON (Who I am):**
${person}

**POSITION (What I do):**
${position}

**PROOF (What I've achieved):**
${proof || 'Not provided - suggest what to include'}

**PAIN (Problem I solve):**
${pain || 'Not provided - suggest what to include'}

**PROMISE (What I deliver):**
${promise || 'Not provided - suggest what to include'}

Create a complete pitch with all 5 pillars filled out professionally, plus 3 variations (elevator, video, email).`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 3500,
      system: PITCH_BUILDER_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Extract the text content
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse the JSON response
    let result: any
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(content.text)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse pitch from Claude response')
    }

    return NextResponse.json({
      success: true,
      pitch: result,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Pitch generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate pitch' },
      { status: 500 }
    )
  }
}
