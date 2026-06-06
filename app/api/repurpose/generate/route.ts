import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { script, formats } = await request.json()

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 })
    }

    let prompt = `You are a content repurposing expert. Transform the following script into multiple formats.

ORIGINAL SCRIPT:
${script}

---

Generate the following formats based on the original script:
`

    if (formats.shortClips) {
      prompt += `

1. THREE SHORT CLIPS (15-30 seconds each):
   - Extract the most viral moments
   - Each clip should stand alone
   - Keep the hook strong
   - Format: Clip 1:..., Clip 2:..., Clip 3:...
`
    }

    if (formats.carouselPosts) {
      prompt += `

2. CAROUSEL POST (7-10 slides for Instagram/LinkedIn):
   - Slide 1: Hook/attention grabber
   - Slides 2-8: Break down the main teaching
   - Last slide: CTA
   - Each slide should be 1-2 sentences max
   - Format: Slide 1:..., Slide 2:...
`
    }

    if (formats.thread) {
      prompt += `

3. TWITTER/X THREAD (8-12 tweets):
   - Tweet 1: Hook that stops scrolling
   - Tweets 2-10: Break down the concept
   - Last tweet: CTA
   - Each tweet max 280 characters
   - Use numbers, emojis strategically
   - Format each tweet on a new line with numbering
`
    }

    if (formats.linkedinPost) {
      prompt += `

4. LINKEDIN LONG-FORM POST:
   - Professional tone but still engaging
   - Hook at the top
   - Break into short paragraphs
   - Use line breaks for readability
   - End with thoughtful question or CTA
   - 300-500 words
`
    }

    if (formats.emailSequence) {
      prompt += `

5. 5-PART EMAIL SEQUENCE:
   - Email 1: Introduction + Problem awareness
   - Email 2: Agitate the problem
   - Email 3: Introduce solution
   - Email 4: Proof/case study
   - Email 5: Call to action
   - Each email 150-250 words
   - Include subject lines
   - Format: Email 1: [Subject]..., Email 2:...
`
    }

    prompt += `

Return a JSON object with this structure:
{
  "shortClips": ["clip1", "clip2", "clip3"],
  "carouselPosts": ["slide1", "slide2", ...],
  "thread": "1. Tweet...\n\n2. Tweet...",
  "linkedinPost": "full post text",
  "emailSequence": ["email1", "email2", "email3", "email4", "email5"]
}

Only include the formats that were requested. Be creative but stay true to the original message.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
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
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error repurposing content:', error)
    return NextResponse.json(
      { error: 'Failed to repurpose content' },
      { status: 500 }
    )
  }
}
