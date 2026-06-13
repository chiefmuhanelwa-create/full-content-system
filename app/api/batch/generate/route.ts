import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)
  if (rl) return rl
  try {
    const { niche, goals, postingFrequency, platforms, targetICP, leadMagnet, seriesName } = await request.json()

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

    const ctaInstruction = leadMagnet
      ? `EMAIL CTA (MANDATORY ON EVERY POST): Every single post must end with a CTA that drives to email capture. Lead magnet: "${leadMagnet}". CTA format: "Comment [KEYWORD] and I'll send you [lead magnet] free" → ManyChat automation → email opt-in. Vary the keyword per week (week 1: PAIDS, week 2: SYSTEM, week 3: GUIDE, week 4: START). The CTA must feel earned — never beg, always frame the lead magnet as the next logical step after the lesson.`
      : `EMAIL CTA (MANDATORY ON EVERY POST): Every post must drive to email capture via a lead magnet exchange. Use ManyChat keywords in the CTA. Frame it as value delivery, not selling. Pattern: "Comment [KEYWORD] and I'll DM you [something free and specific]".`

    const seriesInstruction = seriesName
      ? `SERIES NAME: "${seriesName}" — Structure the 30 posts as a formal knowledge series with episode numbers. Every post is an episode in the formation. Use "Episode X of 30" or "Part X" framing in the notes field. Each week should have a mini-arc sub-title that builds on the previous week.`
      : `SERIES STRUCTURE: Design this as a knowledge formation series — not isolated posts. Each week is a named arc that builds on the last. Name the series and the weekly arcs. Posts should reference each other like episodes. A viewer who watches all 30 should go from Symptom Aware → Problem Aware → Solution Aware → Product Aware.`

    const userPrompt = `## BATCH CONTENT PLAN GENERATION

NICHE: ${niche}
GOALS: ${goals}
PLATFORM: ${platforms}
POSTING FREQUENCY: ${postingFrequency}
NUMBER OF POSTS: ${numPosts}
TARGET ICP: ${icpContext}

## SERIES ARCHITECTURE (CRITICAL — NOT OPTIONAL)
${seriesInstruction}

The 4-week knowledge formation arc:
- WEEK 1 (Days 1–7): DIAGNOSIS — Name the problem they didn't know they had. Symptom Aware content. Hook: attack the symptom. CTA: email opt-in for free diagnostic resource.
- WEEK 2 (Days 8–14): EDUCATION — Introduce the framework. PAIDS, 4E, SEEDS. Problem Aware → Solution Aware. Each post teaches one component of the system. CTA: email opt-in for the workbook or template.
- WEEK 3 (Days 15–21): PROOF + COMMUNITY — Show it works. Origin stories, student wins, SA proof moments. Encourage heavily. Ubuntu. Legacy. CTA: email opt-in for a community or challenge.
- WEEK 4 (Days 22–30): TRANSFORMATION + CONVERSION — The call. Direct sell is earned here because trust is built. 70% encourage/educate, 30% earn. CTA: email → paid product offer.

## ${ctaInstruction}

## YOUR TASK
Generate a ${numPosts}-day NOCHILL content plan. Every post must serve ONE ICP, ONE PAIDS category, and ONE 4E type. No generic content.

## MANDATORY REQUIREMENTS FOR EACH DAY:
1. Topic must address a REAL root pain from the ICP (not surface symptoms — go two levels deeper)
2. Hook idea must use ONE of the 52 hook templates (curiosity, comparison, shock, question, authority, FOMO)
3. Content type from 4E engine: Educate (40%) | Entertain (30%) | Encourage (20%) | Earn (10%)
4. Shadow Fear activated implicitly — activate but NEVER name it directly
5. PAIDS category identified
6. Hook: You Format + Negativity (indirect) + W-Stack (WHAT+WHY first) — max 25 words spoken
7. Where relevant, reference Ndivhuwo's real proof stories (R600K from R6K phone, 780K followers lost but revenue held, R23K affiliate day, sleeping in UP bathrooms, SARS R207K debt)
8. SA African context: ZAR pricing, SARS references, WhatsApp delivery, data cost awareness, loadshedding
9. seriesEpisode field: "Episode X — [Series Arc Name]" — every post has one
10. ctaSuggestion field: The exact CTA line for this post — specific keyword, specific lead magnet, specific action

## 4E DISTRIBUTION FOR ${numPosts} POSTS:
- Educate: ${Math.round(numPosts * 0.40)} posts
- Entertain: ${Math.round(numPosts * 0.30)} posts
- Encourage: ${Math.round(numPosts * 0.20)} posts
- Earn: ${Math.round(numPosts * 0.10)} posts

CRITICAL: Return ONLY a raw JSON object. No markdown. No code fences. No explanation. Start with { and end with }.

{
  "seriesName": "The 30-day series name",
  "weeklyArcs": [
    { "week": 1, "title": "Arc name", "theme": "What this week teaches", "awarenessLevel": "Symptom Aware" },
    { "week": 2, "title": "Arc name", "theme": "What this week teaches", "awarenessLevel": "Problem Aware" },
    { "week": 3, "title": "Arc name", "theme": "What this week teaches", "awarenessLevel": "Solution Aware" },
    { "week": 4, "title": "Arc name", "theme": "What this week teaches", "awarenessLevel": "Product Aware" }
  ],
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "seriesEpisode": "Episode 1 — [Arc Name]",
      "topic": "Specific actionable topic aligned to root ICP pain",
      "hookIdea": "Hook — max 25 words spoken, You Format, indirect negativity, WHAT+WHY first",
      "contentType": "Educational | Story | Encouraging | Promotional",
      "fourE": "Educate | Entertain | Encourage | Earn",
      "platform": "${platforms}",
      "icp": "ICP 1 — Called Expert | ICP 2 — Content Creator Inspirer",
      "shadowFear": "Fear name e.g. Invisible Labour",
      "paidsCategory": "Products | Ads | Information | Deals | Services",
      "villain": "The system/situation villain — never the person",
      "proofStory": "Specific story reference or null",
      "ctaSuggestion": "Exact CTA line for this post — keyword + lead magnet + action",
      "notes": "Episode purpose: what the viewer learns, what awareness level shifts, why this position in the series"
    }
  ],
  "compliance": {
    "icp": "Which ICP this plan targets",
    "fourEBreakdown": { "educate": 0, "entertain": 0, "encourage": 0, "earn": 0 },
    "paidsDistribution": { "products": 0, "ads": 0, "information": 0, "deals": 0, "services": 0 },
    "shadowFearsUsed": ["list"],
    "principlesApplied": ["Negativity (indirect)", "You Format", "Short & Simple", "Audible Flow"],
    "africaContext": "✅ ZAR pricing, SA references, WhatsApp-native delivery",
    "villainsDefined": "✅ System/situation villains assigned — no personal attacks",
    "emailCtaCoverage": "✅ All 30 posts have email CTA"
  }
}`

    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 16000,
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
