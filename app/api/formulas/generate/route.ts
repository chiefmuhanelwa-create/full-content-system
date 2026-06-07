import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit } from '@/lib/rate-limit'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import contentFormulas from '@/lib/knowledge/content-formulas.json'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

    let voiceInstructions = ''
    if (voiceProfile?.name) {
      voiceInstructions = `

## VOICE PROFILE
Creator: ${voiceProfile.name}
Cadence: ${voiceProfile.cadence} | Vocabulary: ${voiceProfile.vocabulary}
Perspective: ${voiceProfile.perspective} | Energy: ${voiceProfile.energy}
${voiceProfile.signaturePhrases?.length ? `\nSIGNATURE PHRASES:\n${voiceProfile.signaturePhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
${voiceProfile.avoidPhrases?.length ? `\nAVOID:\n${voiceProfile.avoidPhrases.map((p: string) => `- "${p}"`).join('\n')}` : ''}
CRITICAL: Write in THEIR voice, not a generic voice.`
    }

    const formulaType = contentType === 'talking-head' ? 'talkingHeadFormulas' : 'youtubeFormulas'
    const formulaData = (contentFormulas as any)[formulaType] || {}

    const systemPrompt = buildSystemPrompt('scripts') + `

## SELECTED FORMULA DATA
${JSON.stringify(formulaData, null, 2).substring(0, 2000)}` + voiceInstructions

    const userPrompt = `Create a production-ready ${contentType} script using the ${formula} formula for ${platform}.

TOPIC/TITLE: ${topic}

KEY POINTS TO COVER:
${keyPoints}

${personalStory ? `PERSONAL STORY TO INCLUDE:\n${personalStory}` : ''}

## YOUR TASK
Apply the ${formula} formula structure while enforcing ALL NOCHILL Master Framework rules:
- ICP: Identify which audience this topic serves (Called Expert or Content Creator Inspirer)
- Hook: R×A×C×U^B — WHAT+WHY first, 70% intensity from word one, max 25 words
- Villain: Name the system/situation villain — never a person
- Atomic share line: One line so tight the viewer can share it verbatim
- Retention loop: End with a tease for the next piece of content
- You Format: "you" throughout — no they/people/someone
- AFRICA Method: ZAR pricing, SA context, WhatsApp-friendly where relevant

Return ONLY a JSON object:
{
  "title": "Compelling video title optimized for ${platform}",
  "formula": "${formula}",
  "platform": "${platform}",
  "fullScript": "Complete script ready to be read on camera. Natural paragraph breaks. Write exactly how it should be spoken — conversational, short punchy sentences. Include [PAUSE] markers, [DIRECTION] notes, [TEXT OVERLAY: content] markers.",
  "structure": [
    {
      "section": "Section name from ${formula} formula",
      "duration": "X seconds",
      "content": "What happens in this section",
      "deliveryNotes": "Tone, energy, camera direction"
    }
  ],
  "visualSuggestions": [
    "Specific visual suggestion 1 (b-roll, text overlay, cut, timestamp)",
    "Specific visual suggestion 2",
    "Specific visual suggestion 3"
  ],
  ${platform === 'youtube' ? '"thumbnailIdeas": ["Thumbnail idea 1", "Thumbnail idea 2", "Thumbnail idea 3"],' : ''}
  "retentionTips": [
    "Specific retention tip 1 — where viewers might drop and how to re-hook",
    "Specific retention tip 2",
    "Specific retention tip 3"
  ],
  "compliance": {
    "icp": "ICP 1 — Called Expert | ICP 2 — Content Creator Inspirer",
    "shadowFear": "Name (#number)",
    "villain": "Named system/situation villain",
    "atomicShareLine": "The one line viewers can share verbatim",
    "paidsCategory": "Products | Ads | Information | Deals | Services",
    "fourE": "Educate | Entertain | Encourage | Earn",
    "businessOutcome": "Lead Generation | Direct Sale | Authority Building",
    "retentionLoop": "The exact retention loop tease line at the end",
    "section13": {
      "hookQuality": "✅/❌ — R×A×C×U^B check",
      "wStackOrder": "✅/❌ — WHAT+WHY leads",
      "intensity": "✅/❌ — 70%+ from word one",
      "rehooking": "✅/❌ — [cadence used]",
      "villainContrast": "✅/❌ — [villain named]",
      "wordEconomy": "✅/❌",
      "youFormat": "✅/❌",
      "audibleFlow": "✅/❌",
      "emotionalPeak": "✅/❌ — [the peak moment]",
      "atomicSharability": "✅/❌ — [the line]",
      "visualDirection": "✅/❌ — changes every 8s minimum",
      "ctaClarity": "✅/❌ — single CTA to owned channel",
      "retentionLoop": "✅/❌ — [the tease]",
      "businessOutcome": "✅/❌",
      "africaContext": "✅/❌"
    },
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"]
  }
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3500,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let formulaOutput
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      formulaOutput = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json({ error: 'Failed to parse formula output. Please try again.' }, { status: 500 })
    }

    if (!formulaOutput.fullScript || !formulaOutput.structure || !formulaOutput.visualSuggestions) {
      return NextResponse.json({ error: 'Invalid formula output structure. Please try again.' }, { status: 500 })
    }

    if (platform !== 'youtube' && formulaOutput.thumbnailIdeas) {
      delete formulaOutput.thumbnailIdeas
    }

    return NextResponse.json(formulaOutput)
  } catch (error: any) {
    console.error('Formula generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate formula' }, { status: 500 })
  }
}
