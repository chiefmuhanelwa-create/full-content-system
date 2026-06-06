import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit } from '@/lib/rate-limit'
import contentFormulas from '@/lib/knowledge/content-formulas.json'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODELS = {
  SONNET: 'claude-sonnet-4-6',
}

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const body = await request.json()
    const { contentType, formula, platform, topic, keyPoints, personalStory, voiceProfile } = body

    if (!contentType || !formula || !platform || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType, formula, platform, and topic are required' },
        { status: 400 }
      )
    }

    // Voice profile instructions
    let voiceInstructions = ''
    if (voiceProfile && voiceProfile.name) {
      voiceInstructions = `

# VOICE & PERSONALITY PROFILE

The creator has defined their unique voice. MAINTAIN THIS VOICE throughout the script:

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

    const formulaType = contentType === 'talking-head' ? 'talkingHeadFormulas' : 'youtubeFormulas'
    const formulaData = (contentFormulas as any)[formulaType] || {}

    // Build system prompt
    const systemPrompt = `You are the NOCHILL Formula Writer — expert video content strategist for Ndivhuwo Muhanelwa (NoChill), South African creator.

Apply the selected content formula to write production-ready scripts in Ndivhuwo's voice.

## NOCHILL VOICE RULES
- Short punchy sentences. Direct. No fluff. Tough-love tone.
- Always "you" never "they/people/someone"
- ZAR currency, SA context (SARS, Mzansi, Ubuntu)
- Banned: journey, unlock, empower, game-changer

## 4 SCRIPTING PRINCIPLES (apply to every line)
1. Negativity Wins: Attack the problem, not the person
2. You Format: Every line says "you" not "they/people"
3. Short & Simple: Cut every word that doesn't earn its place
4. Audible Flow: Must sound natural when read aloud

## FORMULA LIBRARY (selected formula)
${JSON.stringify(formulaData, null, 2).substring(0, 3000)}

## YOUR TASK
Create a production-ready script using the selected formula. Include: hook, body by formula stage, CTA, timestamps, visual directions.
Return as JSON object.

# OUTPUT FORMAT

Return a JSON object with this exact structure:
{
  "title": "Compelling video title (optimized for platform)",
  "formula": "Name of formula used",
  "platform": "Platform name",
  "fullScript": "The complete script ready to be read on camera. Use clear paragraph breaks. Write exactly how it should be spoken - conversational, natural, with energy. Include [PAUSE] markers where needed.",
  "structure": [
    {
      "section": "Section name from formula",
      "duration": "X seconds" or "X minutes",
      "content": "What happens in this section (2-3 sentences)",
      "deliveryNotes": "How to deliver this (tone, energy, gestures, camera work)"
    }
  ],
  "visualSuggestions": [
    "Specific visual suggestion 1 (b-roll, text overlay, cut, etc.)",
    "Specific visual suggestion 2",
    "Specific visual suggestion 3",
    "..."
  ],
  "thumbnailIdeas": [
    "Thumbnail idea 1 (for YouTube only)",
    "Thumbnail idea 2",
    "Thumbnail idea 3"
  ],
  "retentionTips": [
    "Specific retention tip 1",
    "Specific retention tip 2",
    "Specific retention tip 3",
    "..."
  ]
}

# THE 4 FOUNDATIONAL SCRIPTING PRINCIPLES (MANDATORY)

Apply these principles to EVERY line of the script:

**PRINCIPLE 1: Negativity Always Wins (Indirect Only)**
- Negativity invokes MORE attention and emotion than positivity
- CRITICAL RULE: Use INDIRECT negativity only
- ❌ DON'T attack the viewer
- ✅ DO attack the problem/system/mistake they're making
- Attack the PROBLEM, never the PERSON
- Use power words: "suck," "wasting," "bullshit," "terrible," "broken," "failing"
- Example: "This strategy is keeping you broke" (NOT "You're broke because you're lazy")

**PRINCIPLE 2: You Format**
- Always use "YOU" instead of "they," "people," "someone," "one"
- Direct address creates personal connection
- Replace ALL instances: "They" → "You", "People" → "You", "Someone" → "You"
- Example: "You're making this mistake" (NOT "People often make this mistake")

**PRINCIPLE 3: Short & Simple As Possible**
- Keep sentences concise and punchy
- Avoid unnecessary complexity
- One idea per sentence when possible
- Cut filler words ruthlessly (just, really, very, actually, literally)
- Use active voice, not passive
- Simple words beat complex words
- Example: "Do this" (NOT "You should consider implementing this")

**PRINCIPLE 4: Audible Flow Check**
- Read script OUT LOUD before finalizing
- If you stumble, rewrite
- Natural conversational rhythm
- Breath points for camera delivery
- Emphasis words clearly marked
- Sounds like TALKING, not reading

# CRITICAL RULES

## Script Writing (WITH 4 PRINCIPLES)
1. **Apply 4 Foundational Principles**: EVERY line follows Negativity (indirect), You Format, Short & Simple, Audible Flow
2. **Conversational Flow**: Write how people actually talk, not how books are written
3. **No Fluff**: Every sentence must serve a purpose (hook, teach, transition, engage)
4. **Energy**: Write with 8-9/10 energy, use exclamations, emphasis, emotion
5. **Pacing**: Vary sentence length. Short punchy sentences. Then longer explanatory ones. Mix it up.
6. **Direct Address**: Always "you" never "people/they/someone" - direct conversation with viewer

## Platform-Specific
- **Short-form (Reels/TikTok/Shorts)**: Ultra-fast pacing, no intros, hook in first 1 second, quick cuts
- **YouTube Long-form**: Strong first 30 seconds, pattern interrupts every 60-90 seconds, story elements
- **LinkedIn**: Professional but personal, lead with business value, subtle CTAs

## Delivery Notes
- Be specific: "High energy, leaning forward, gesture with hands" not "be enthusiastic"
- Include camera work: "Quick cut here", "Zoom in for emphasis", "Show screen recording"
- Note tone shifts: "Shift to serious tone", "Return to playful energy"

## Visual Suggestions
- Be actionable: "Text overlay: '3 Steps' with animation" not "add text"
- Specify timing: "At 0:15 - cut to b-roll of X"
- Include style notes: "Fast cuts every 1-2 seconds" or "Cinematic slow pans"

## Retention
- Identify specific moments where viewers might drop off
- Suggest pattern interrupts at those points
- Include open loops and payoff timing
- Note engagement asks (comments, likes, shares)

Remember: The best content formula combines proven structure with authentic personal voice. Make it feel natural, not formulaic.${voiceInstructions}`

    // Build user prompt
    const userPrompt = `Create a production-ready ${contentType} script using the ${formula} formula for ${platform}.

TOPIC/TITLE:
${topic}

KEY POINTS TO COVER:
${keyPoints}

${personalStory ? `PERSONAL STORY TO INCLUDE:\n${personalStory}` : ''}

Platform: ${platform}
Formula: ${formula}
Content Type: ${contentType}

Apply the ${formula} formula structure precisely while optimizing for ${platform}. Make it production-ready with detailed delivery notes, visual suggestions, and retention tactics.

Return the complete JSON output as specified in the system prompt.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 3500,
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
    let formulaOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        formulaOutput = JSON.parse(jsonMatch[0])
      } else {
        formulaOutput = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse formula output. Please try again.' },
        { status: 500 }
      )
    }

    // Validate output structure
    if (!formulaOutput.fullScript || !formulaOutput.structure || !formulaOutput.visualSuggestions) {
      console.error('Invalid output structure:', formulaOutput)
      return NextResponse.json(
        { error: 'Invalid formula output structure. Please try again.' },
        { status: 500 }
      )
    }

    // If not YouTube, remove thumbnailIdeas
    if (platform !== 'youtube' && formulaOutput.thumbnailIdeas) {
      delete formulaOutput.thumbnailIdeas
    }

    return NextResponse.json(formulaOutput)
  } catch (error: any) {
    console.error('Formula generation error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate formula',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
