import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODELS = {
  SONNET: 'claude-sonnet-4-20250514',
}

const platformGuidelines = {
  linkedin: {
    maxLength: 3000,
    style: 'Professional yet personal, thought leadership tone',
    format: 'Open with strong hook, use line breaks for readability, end with question or CTA',
    hashtags: '3-5 relevant industry hashtags',
    bestTime: 'Tuesday-Thursday, 7-9am or 5-6pm EST',
    tips: [
      'Start with a personal story or bold statement',
      'Use short paragraphs (2-3 lines max)',
      'Include a question to drive comments',
      'Tag relevant people or companies (when appropriate)',
      'End with clear CTA or discussion prompt'
    ]
  },
  twitter: {
    maxLength: 280,
    style: 'Conversational, concise, thread format',
    format: 'Break into tweet-sized chunks (280 chars), number tweets (1/X), strong hook in first tweet',
    hashtags: '1-2 hashtags max per thread',
    bestTime: 'Monday-Friday, 8-10am or 6-9pm EST',
    tips: [
      'First tweet must be a strong hook',
      'Each tweet should be valuable standalone',
      'Use line breaks for emphasis',
      'Ask for RT/like at the end',
      'Keep threads to 5-10 tweets max'
    ]
  },
  facebook: {
    maxLength: 63206,
    style: 'Casual, storytelling, community-focused',
    format: 'Engaging opening, story-driven, visual-friendly, clear CTA',
    hashtags: '2-3 hashtags (less important than other platforms)',
    bestTime: 'Wednesday-Friday, 1-4pm EST',
    tips: [
      'Lead with emotion or story',
      'Use emojis sparingly for emphasis',
      'Encourage shares and tags',
      'Ask questions to spark discussion',
      'Keep it scannable with line breaks'
    ]
  },
  newsletter: {
    maxLength: 10000,
    style: 'Direct, valuable, relationship-building',
    format: 'Compelling subject line, personal greeting, clear sections, strong CTA',
    hashtags: 'N/A',
    bestTime: 'Tuesday-Thursday, 10am EST',
    tips: [
      'Write subject line that creates curiosity',
      'Open with personal note or story',
      'Use subheadings for scannability',
      'Include actionable takeaways',
      'End with clear single CTA'
    ]
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalContent, platforms } = body

    if (!originalContent || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: originalContent and platforms are required' },
        { status: 400 }
      )
    }

    // Build system prompt
    const systemPrompt = `You are an expert content adaptation specialist. Your expertise is in transforming content from one format to another while optimizing for each platform's unique characteristics, audience expectations, and best practices.

# PLATFORM GUIDELINES

${JSON.stringify(platformGuidelines, null, 2)}

# YOUR TASK

Adapt the provided content for each selected platform. Your adaptations should:

1. **Maintain Core Message**: Keep the main point and value proposition intact
2. **Optimize for Platform**: Adjust tone, style, length, and format for platform norms
3. **Preserve Voice**: Maintain the creator's authentic voice and personality
4. **Maximize Engagement**: Use platform-specific engagement tactics
5. **Be Native**: Make it feel like it was created specifically for that platform

# OUTPUT FORMAT

Return a JSON object with this exact structure:
{
  "adaptedContent": [
    {
      "platform": "linkedin",
      "content": "The full adapted content ready to post",
      "characterCount": 1234,
      "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"],
      "bestTimeToPost": "Tuesday-Thursday, 7-9am EST",
      "engagementTips": [
        "Specific tip 1",
        "Specific tip 2",
        "Specific tip 3"
      ]
    }
  ]
}

# ADAPTATION RULES BY PLATFORM

## LinkedIn
- Professional but personal tone
- Start with hook (story, bold statement, or question)
- Use short paragraphs with line breaks
- Include 3-5 industry-relevant hashtags
- End with discussion question or clear CTA
- Length: 300-1500 characters (optimal)
- Use "I/we" language to show expertise
- Make it thought leadership-worthy

## X/Twitter (Thread Format)
- Break into 5-10 tweets
- Each tweet ≤ 280 characters
- Number tweets: "1/10", "2/10", etc.
- First tweet = killer hook
- Each tweet should be valuable standalone
- Use line breaks for emphasis
- End with CTA or engagement ask
- Add 1-2 relevant hashtags to first tweet
- Conversational, punchy tone

## Facebook
- Storytelling approach
- More casual and personal
- Longer paragraphs OK (but scannable)
- Use emojis (sparingly, for emphasis)
- Community and emotion-focused
- Ask questions to spark discussion
- Encourage shares and tags
- 2-3 hashtags (less critical here)
- Make it relatable and shareable

## Newsletter (Email)
- Subject line: Create curiosity/value
- Personal greeting
- Clear structure with subheadings
- Scannable format
- Personal story or opening
- Actionable content/takeaways
- Single clear CTA at end
- Conversational, like letter to friend
- Length: 500-2000 words
- Use "you" language, direct address

# CRITICAL RULES

1. **Don't Just Summarize**: Rewrite and restructure for the platform
2. **Keep the Value**: Every adaptation must deliver the core value/insight
3. **Be Platform-Native**: Should feel organic to that platform
4. **Maintain Voice**: Don't make it generic - keep personality
5. **Optimize for Engagement**: Use platform-specific tactics
6. **Be Actionable**: Include clear next steps or discussion prompts
7. **Character Counts**: Respect platform limits (especially Twitter)
8. **Hashtag Strategy**: Follow platform norms for hashtag usage

# QUALITY CHECKS

Before finalizing each adaptation, verify:
- ✓ Core message intact?
- ✓ Platform-appropriate tone and style?
- ✓ Engagement tactics included?
- ✓ Proper formatting for platform?
- ✓ Authentic voice preserved?
- ✓ Clear CTA or discussion prompt?
- ✓ Character count within limits?

Remember: The best adaptations don't just resize content - they reimagine it for each platform's unique ecosystem and audience expectations.`

    // Build user prompt
    const userPrompt = `Adapt this content for the following platforms: ${platforms.join(', ')}

ORIGINAL CONTENT:
${originalContent}

TARGET PLATFORMS: ${platforms.join(', ')}

For each platform, create a fully adapted version that:
- Maintains the core message and value
- Optimizes for that platform's format and audience
- Includes platform-specific engagement tactics
- Feels native to the platform

Return the complete JSON output as specified in the system prompt.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 8000,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Parse response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    let adapterOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        adapterOutput = JSON.parse(jsonMatch[0])
      } else {
        adapterOutput = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse adapter output. Please try again.' },
        { status: 500 }
      )
    }

    // Validate output structure
    if (!adapterOutput.adaptedContent || !Array.isArray(adapterOutput.adaptedContent)) {
      console.error('Invalid output structure:', adapterOutput)
      return NextResponse.json(
        { error: 'Invalid adapter output structure. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(adapterOutput)
  } catch (error: any) {
    console.error('Adapter generation error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to adapt content',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
