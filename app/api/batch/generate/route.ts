import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELS } from '@/lib/claude'
import { buildBatchSystemPrompt } from '@/lib/knowledge-base'
import { checkRateLimit } from '@/lib/rate-limit'

// Two-pass JSON parse — escapes literal newlines inside string values
function safeParseJSON(raw: string): any {
  try {
    return JSON.parse(raw)
  } catch {
    // Escape literal newlines and tabs inside JSON string values
    const escaped = raw.replace(/("(?:[^"\\]|\\.)*")/g, (match) =>
      match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    )
    try {
      return JSON.parse(escaped)
    } catch {
      return null
    }
  }
}

// Extract whatever complete plan items exist from truncated/malformed JSON
function extractPartialPlan(raw: string): any[] {
  const items: any[] = []
  // Match complete JSON objects in the plan array
  const objRegex = /\{(?:[^{}]|\{[^{}]*\})*\}/g
  const matches = raw.match(objRegex) || []
  for (const m of matches) {
    try {
      const obj = JSON.parse(m)
      // Only include objects that look like plan items (have day + topic)
      if (obj.day && (obj.topic || obj.hookIdea || obj.hook)) {
        items.push(obj)
      }
    } catch { /* skip malformed */ }
  }
  return items
}

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
      ? 'ICP 1 — CALLED EXPERT. Target: 32–50, professional with unexploited expertise. Language: "your knowledge is worth more than your salary". Shadow fears: Imposter Syndrome, Generational Poverty, Wrong Path Terror, Spiritual Crisis.'
      : targetICP === 'icp2'
      ? 'ICP 2 — CONTENT CREATOR INSPIRER. Target: 18–35, posting daily with no income. Language: "you\'re posting every day and still broke". Shadow fears: Invisible Labour, Time Anxiety, Relationship Loss, Platform Dependency.'
      : 'Choose ICP 1 (Called Expert, 32–50) or ICP 2 (Content Creator Inspirer, 18–35) based on niche and goals. Lock onto ONE — never mix.'

    const systemPrompt = buildBatchSystemPrompt()

    const ctaLine = leadMagnet
      ? `CTA on every post: "Comment [KEYWORD] and I'll send you ${leadMagnet} free" — vary keyword per week: week 1 PAIDS, week 2 SYSTEM, week 3 GUIDE, week 4 START. CTA must feel earned, not begged.`
      : 'CTA on every post: drive to email list via ManyChat keyword. Pattern: "Comment [KEYWORD] and I\'ll DM you [something specific and free]". Never sell without giving first.'

    const seriesContext = seriesName
      ? `SERIES: "${seriesName}". Every post is a numbered episode. Build episode-to-episode. Viewer watching all 30 should move: Symptom Aware → Problem Aware → Solution Aware → Product Aware.`
      : 'NAME this series. Design it as a knowledge formation journey — not isolated posts. Each week is a named arc. Posts reference each other like episodes.'

    const userPrompt = `Generate a ${numPosts}-day NOCHILL content plan.

NICHE: ${niche}
GOALS: ${goals}
PLATFORM: ${platforms}
ICP LOCK: ${icpContext}
${seriesContext}
${ctaLine}

4E DISTRIBUTION — strictly enforce:
Educate: ${Math.round(numPosts * 0.40)} posts | Entertain: ${Math.round(numPosts * 0.30)} posts | Encourage: ${Math.round(numPosts * 0.20)} posts | Earn: ${Math.round(numPosts * 0.10)} posts

WEEKLY ARC:
Week 1 (Days 1–${Math.min(7, numPosts)}): DIAGNOSIS — name the hidden problem. Symptom Aware hooks.
Week 2 (Days 8–${Math.min(14, numPosts)}): EDUCATION — teach PAIDS/4E/framework. One component per post.
Week 3 (Days 15–${Math.min(21, numPosts)}): PROOF — origin stories, SA proof moments, Ubuntu, legacy.
Week 4 (Days 22–${numPosts}): CONVERSION — trust is earned, direct sell is now appropriate.

EVERY POST MUST:
1. Address a root ICP pain — not surface symptom (go 2 levels deeper)
2. Activate ONE shadow fear implicitly (never name it)
3. Name ONE villain (system/situation — never a person)
4. Reference Ndivhuwo's proof where relevant (R750 first deal, R23K affiliate day, bathroom floors, 780K followers lost, SARS R207K)
5. Include exact CTA keyword and lead magnet action
6. Use SA context naturally (ZAR, SARS, WhatsApp, loadshedding, Ubuntu)

BREVITY MANDATE — all fields max 15 words. JSON must be complete. NEVER truncate.
NEVER put literal newlines inside string values — write everything on one line per field.

Return ONLY this JSON structure, nothing else:
{
  "seriesName": "Series name (max 10 words)",
  "weeklyArcs": [
    {"week": 1, "title": "Arc title", "theme": "What this week builds", "awarenessLevel": "Symptom Aware"},
    {"week": 2, "title": "Arc title", "theme": "What this week builds", "awarenessLevel": "Problem Aware"},
    {"week": 3, "title": "Arc title", "theme": "What this week builds", "awarenessLevel": "Solution Aware"},
    {"week": 4, "title": "Arc title", "theme": "What this week builds", "awarenessLevel": "Product Aware"}
  ],
  "plan": [
    {
      "day": 1,
      "topic": "Post topic max 12 words",
      "hook": "Spoken hook max 18 words You Format indirect negativity",
      "fourE": "Educate",
      "paids": "Information",
      "shadowFear": "Fear name",
      "villain": "System villain max 5 words",
      "cta": "Comment PAIDS for free kit",
      "notes": "Episode purpose and awareness shift max 15 words"
    }
  ],
  "compliance": {
    "icp": "ICP targeted",
    "fourEBreakdown": {"educate": 0, "entertain": 0, "encourage": 0, "earn": 0},
    "shadowFearsActivated": ["fear1", "fear2"],
    "villainsDefined": true,
    "emailCtaOnAll": true
  }
}`

    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 12000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI returned no JSON. Please try again.' }, { status: 500 })
    }

    // Two-pass parse with literal newline escape
    const parsed = safeParseJSON(jsonMatch[0])

    if (parsed && Array.isArray(parsed.plan) && parsed.plan.length > 0) {
      // Normalise field names — model may use hookIdea vs hook
      parsed.plan = parsed.plan.map((item: any) => ({
        ...item,
        hookIdea: item.hookIdea || item.hook || '',
        hook: item.hook || item.hookIdea || '',
        paidsCategory: item.paidsCategory || item.paids || '',
        ctaSuggestion: item.ctaSuggestion || item.cta || '',
        contentType: item.contentType || item.fourE || 'Educational',
      }))
      return NextResponse.json(parsed)
    }

    // Fallback: extract partial plan items from malformed JSON
    const partial = extractPartialPlan(responseText)
    if (partial.length > 0) {
      return NextResponse.json({
        plan: partial.map((item: any) => ({
          ...item,
          hookIdea: item.hookIdea || item.hook || '',
          hook: item.hook || item.hookIdea || '',
          paidsCategory: item.paidsCategory || item.paids || '',
          ctaSuggestion: item.ctaSuggestion || item.cta || '',
          contentType: item.contentType || item.fourE || 'Educational',
        })),
        seriesName: niche,
        _partial: true,
        _recovered: partial.length,
      })
    }

    return NextResponse.json({ error: 'AI returned malformed JSON. Please try again.' }, { status: 500 })

  } catch (error) {
    console.error('Batch generate error:', error)
    return NextResponse.json({ error: 'Failed to generate content plan. Please try again.' }, { status: 500 })
  }
}
