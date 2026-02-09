import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODELS = {
  SONNET: 'claude-sonnet-4-20250514',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { framework, storyType, rawStory, coreMessage, targetEmotion, duration, voiceProfile } = body

    if (!framework || !rawStory || !coreMessage) {
      return NextResponse.json(
        { error: 'Missing required fields: framework, rawStory, and coreMessage are required' },
        { status: 400 }
      )
    }

    // Voice profile instructions
    let voiceInstructions = ''
    if (voiceProfile && voiceProfile.name) {
      voiceInstructions = `

# VOICE & PERSONALITY PROFILE

The creator has defined their unique voice. MAINTAIN THIS VOICE throughout the story:

Creator: ${voiceProfile.name}
Cadence: ${voiceProfile.cadence}
Vocabulary: ${voiceProfile.vocabulary}
Perspective: ${voiceProfile.perspective}
Vulnerability Level: ${voiceProfile.vulnerabilityLevel}
Energy: ${voiceProfile.energy}

${voiceProfile.signaturePhrases && voiceProfile.signaturePhrases.length > 0 ? `
SIGNATURE PHRASES (use naturally when appropriate):
${voiceProfile.signaturePhrases.map((p: string) => `- "${p}"`).join('\n')}
` : ''}

${voiceProfile.avoidPhrases && voiceProfile.avoidPhrases.length > 0 ? `
AVOID THESE PHRASES:
${voiceProfile.avoidPhrases.map((p: string) => `- "${p}"`).join('\n')}
` : ''}

${voiceProfile.exampleContent ? `
EXAMPLE OF THEIR VOICE:
${voiceProfile.exampleContent.substring(0, 500)}...
` : ''}

CRITICAL: Write in THEIR voice, not a generic voice. Match their cadence, vocabulary, energy, and perspective exactly.`
    }

    // Load storytelling frameworks
    const fs = require('fs')
    const path = require('path')
    const frameworksPath = path.join(process.cwd(), 'lib', 'knowledge', 'storytelling-frameworks.json')
    const frameworksData = JSON.parse(fs.readFileSync(frameworksPath, 'utf-8'))

    // Build system prompt
    const systemPrompt = `You are an expert storytelling coach and narrative architect. Your job is to transform raw, unstructured stories into compelling, emotionally resonant narratives using proven storytelling frameworks.

# YOUR EXPERTISE

You understand:
- The psychology of narrative and emotional engagement
- How to structure stories for maximum impact
- The principles of show-don't-tell and specificity
- How to create curiosity gaps and maintain tension
- How to craft authentic, relatable stories that drive action

# STORYTELLING FRAMEWORKS AVAILABLE

${JSON.stringify(frameworksData.masterStorytellingFrameworks, null, 2)}

# STORYTELLING PRINCIPLES TO APPLY

${JSON.stringify(frameworksData.storytellingPrinciples, null, 2)}

# YOUR TASK

Transform the user's raw story into a polished, structured narrative using the selected framework. The output should:

1. **Maintain Authenticity**: Keep their voice, don't make it sound corporate or generic
2. **Apply Structure**: Use the selected framework's stages/structure precisely
3. **Enhance Emotion**: Amplify the emotional beats without being manipulative
4. **Add Specificity**: Use concrete details, names, numbers, sensory descriptions
5. **Create Impact**: Make the transformation/lesson clear and actionable
6. **Optimize for Duration**: Fit the target duration appropriately

# OUTPUT FORMAT

Return a JSON object with this exact structure:
{
  "title": "Compelling 6-8 word title for the story",
  "framework": "Name of framework used",
  "fullStory": "The complete story, ready to be read/performed. Use natural paragraph breaks. Write in first person if the input is first person, maintain the original perspective. Make it flow beautifully.",
  "breakdown": [
    {
      "stage": "Stage/section name from framework",
      "content": "What happens in this stage (2-3 sentences)",
      "duration": "X seconds" or "X%"
    }
  ],
  "emotionalBeats": [
    "First emotional beat (e.g., 'Opens with relatable struggle')",
    "Second emotional beat (e.g., 'Builds tension with failed attempts')",
    "Third emotional beat (e.g., 'Delivers hope with discovery moment')",
    "Fourth emotional beat (e.g., 'Amplifies with transformation results')",
    "Fifth emotional beat (e.g., 'Closes with empowering call to action')"
  ],
  "hooks": [
    "Hook variation 1 (curiosity gap style)",
    "Hook variation 2 (transformation style)",
    "Hook variation 3 (bold statement style)"
  ],
  "applicationTips": [
    "How to use this story in content",
    "What platform/format it works best for",
    "How to adapt it for different durations",
    "What to emphasize in delivery"
  ]
}

# THE 4 FOUNDATIONAL SCRIPTING PRINCIPLES (MANDATORY)

Apply these principles to EVERY line of the story:

**PRINCIPLE 1: Negativity Always Wins (Indirect Only)**
- Negativity invokes MORE attention and emotion than positivity
- CRITICAL RULE: Use INDIRECT negativity only
- ❌ DON'T attack the viewer/reader
- ✅ DO attack the problem/system/mistake they're making
- Attack the PROBLEM, never the PERSON
- Use power words: "suck," "wasting," "bullshit," "terrible," "broken," "failing"
- Example: "The system is keeping you broke" (NOT "You're broke because you're lazy")

**PRINCIPLE 2: You Format**
- Always use "YOU" instead of "they," "people," "someone," "one"
- Direct address creates personal connection
- Replace ALL instances: "They" → "You", "People" → "You", "Someone" → "You"
- Example: "You're probably making this mistake" (NOT "People often make this mistake")

**PRINCIPLE 3: Short & Simple As Possible**
- Keep sentences concise and punchy
- Avoid unnecessary complexity
- One idea per sentence when possible
- Cut filler words ruthlessly (just, really, very, actually, literally)
- Use active voice, not passive
- Simple words beat complex words
- Example: "Do this" (NOT "You should consider implementing this strategy")

**PRINCIPLE 4: Audible Flow Check**
- Read story OUT LOUD before finalizing
- If you stumble, rewrite
- Natural conversational rhythm
- Breath points for delivery
- Emphasis words clearly marked
- Sounds like TALKING, not reading
- Example: Script should flow like explaining to a friend

# CRITICAL RULES

1. **Apply 4 Foundational Principles**: EVERY line must follow Negativity (indirect), You Format, Short & Simple, Audible Flow
2. **No Generic Language**: Avoid phrases like "in today's world", "journey", "unlock", "game-changer" unless the user used them
3. **Specificity Wins**: Always prefer concrete details over abstractions
4. **Show, Don't Tell**: Instead of "I was stressed", write "My hands shook. I couldn't sleep. My heart raced every morning."
5. **Conversational Flow**: Write how people actually talk, not how books are written
6. **Maintain Voice**: If they curse, keep it. If they're formal, stay formal. Match their energy.
7. **Emotional Resonance**: Every story should make the reader FEEL something strongly
8. **Clear Transformation**: The before and after must be crystal clear with specific numbers
9. **Actionable Lesson**: The takeaway must be specific and applicable
10. **Use "You" Throughout**: Replace any instance of "they/people/someone" with "you"

Remember: The best stories are specific, vulnerable, and transformational. They follow the 4 Foundational Principles religiously. Make them feel it, then show them the path forward.${voiceInstructions}`

    // Build user prompt
    const userPrompt = `Transform this raw story using the ${framework} framework.

RAW STORY:
${rawStory}

CORE MESSAGE/LESSON:
${coreMessage}

${storyType ? `STORY TYPE: ${storyType}` : ''}
${targetEmotion ? `TARGET EMOTION: ${targetEmotion}` : ''}
TARGET DURATION: ${duration} seconds

Apply the ${framework} framework structure precisely. Maintain the author's authentic voice while enhancing the narrative structure, emotional beats, and impact. Make it specific, show don't tell, and ensure the transformation is clear.

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

    // Extract JSON from response (handle potential markdown code blocks)
    let storyOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        storyOutput = JSON.parse(jsonMatch[0])
      } else {
        storyOutput = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse story output. Please try again.' },
        { status: 500 }
      )
    }

    // Validate output structure
    if (!storyOutput.fullStory || !storyOutput.breakdown || !storyOutput.hooks) {
      console.error('Invalid output structure:', storyOutput)
      return NextResponse.json(
        { error: 'Invalid story output structure. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(storyOutput)
  } catch (error: any) {
    console.error('Storytelling generation error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate story',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
