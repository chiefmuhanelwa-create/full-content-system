import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { niche, goals, postingFrequency, platforms, targetICP } = await request.json()

    if (!niche || !goals) {
      return NextResponse.json({ error: 'Niche and goals are required' }, { status: 400 })
    }

    const numPosts = postingFrequency === 'daily' ? 30 : postingFrequency === 'weekdays' ? 22 : 13

    const icpContext = targetICP === 'icp1'
      ? 'ICP 1 — THE CALLED EXPERT (ages 32–50, professional, unexploited expertise, shadow fears: Imposter Syndrome, Generational Poverty, Wrong Path Terror, Spiritual Crisis). Language: "your knowledge is worth more than your salary", "you don\'t need another certification"'
      : targetICP === 'icp2'
      ? 'ICP 2 — THE CONTENT CREATOR INSPIRER (ages 18–35, aspiring creator, Instagram/TikTok/FB-first, shadow fears: Time Anxiety, Relationship Loss, Invisible Labor). Language: "you\'re posting every day and still broke", "your content is working — your strategy isn\'t"'
      : 'Determine the best ICP fit based on the niche and goals provided. Choose ONE: ICP 1 (Called Expert, 32–50) or ICP 2 (Content Creator Inspirer, 18–35).'

    const systemPrompt = buildSystemPrompt('scripts')

    const userPrompt = `## BATCH CONTENT PLAN GENERATION

NICHE: ${niche}
GOALS: ${goals}
PLATFORM: ${platforms}
POSTING FREQUENCY: ${postingFrequency}
NUMBER OF POSTS: ${numPosts}
TARGET ICP: ${icpContext}

## YOUR TASK
Generate a ${numPosts}-day NOCHILL content plan. Every post must serve ONE ICP, ONE PAIDS category, and ONE 4E type. No generic content.

## MANDATORY REQUIREMENTS FOR EACH DAY:
1. Topic must address a REAL pain from the ICP profile (not surface wants — real root pains)
2. Hook idea must use ONE of the 52 hook templates (curiosity, comparison, shock, question, authority, FOMO)
3. Content type must come from the 4E engine: Educate (40%) | Entertain (30%) | Encourage (20%) | Earn (10%)
4. Shadow Fear must be one of the 10 (implicit — activate but never name it)
5. PAIDS category must be identified
6. Hook idea must apply: You Format, Negativity (indirect), W-Stack (WHAT+WHY first)
7. Where relevant, reference Ndivhuwo's real proof stories (S001–S020)
8. Use SA African context: ZAR pricing, SARS references, WhatsApp delivery, data cost awareness

## 4E DISTRIBUTION FOR ${numPosts} POSTS:
- Educate: ${Math.round(numPosts * 0.40)} posts (teach frameworks, systems, PAIDS, etc.)
- Entertain: ${Math.round(numPosts * 0.30)} posts (stories, relatable struggles, proof moments)
- Encourage: ${Math.round(numPosts * 0.20)} posts (faith-integrated motivation, Ubuntu, legacy)
- Earn: ${Math.round(numPosts * 0.10)} posts (direct product/service content with CTA)

## CONTENT PROGRESSION:
- Posts 1–${Math.round(numPosts * 0.4)}: Authority building (educate heavy, establish trust)
- Posts ${Math.round(numPosts * 0.4) + 1}–${Math.round(numPosts * 0.7)}: Engagement (mix educate + entertain, deepen connection)
- Posts ${Math.round(numPosts * 0.7) + 1}–${Math.round(numPosts * 0.9)}: Community (encourage, Ubuntu, community wins)
- Posts ${Math.round(numPosts * 0.9) + 1}–${numPosts}: Conversion (earn, drive to owned channels)

Return a JSON object with this structure:
{
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "topic": "Specific actionable topic aligned to ICP pain",
      "hookIdea": "Hook using one of the 52 templates — max 25 words, You Format, WHAT+WHY first",
      "contentType": "Educational | Story | Encouraging | Promotional",
      "fourE": "Educate | Entertain | Encourage | Earn",
      "platform": "${platforms}",
      "icp": "ICP 1 — Called Expert | ICP 2 — Content Creator Inspirer",
      "shadowFear": "Fear name (#number) e.g. Imposter Syndrome (#3)",
      "paidsCategory": "Products | Ads | Information | Deals | Services",
      "villain": "The system/situation villain for this post",
      "proofStory": "S00X if applicable, or null",
      "notes": "Why this content at this point in the sequence — ICP pain addressed, awareness level, business outcome"
    }
  ],
  "compliance": {
    "icp": "Which ICP this plan targets",
    "fourEBreakdown": { "educate": 0, "entertain": 0, "encourage": 0, "earn": 0 },
    "paidsDistribution": { "products": 0, "ads": 0, "information": 0, "deals": 0, "services": 0 },
    "shadowFearsUsed": ["list of fears activated across the plan"],
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"],
    "africaContext": "✅ ZAR pricing, SA references, WhatsApp-native delivery",
    "villainsDefined": "✅ System/situation villains assigned — no personal attacks"
  }
}`

    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { plan: [], compliance: {} }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating batch plan:', error)
    return NextResponse.json({ error: 'Failed to generate content plan' }, { status: 500 })
  }
}
