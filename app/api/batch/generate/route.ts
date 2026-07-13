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

    const userPrompt = `Generate a complete ${numPosts}-day NOCHILL content plan. Every single day must be filled — no gaps, no truncation.

NICHE: ${niche}
GOALS: ${goals}
PLATFORM: ${platforms}
ICP LOCK: ${icpContext}
${seriesContext}
${ctaLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 1 — EPISODIC SERIES, NOT ISOLATED POSTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is ONE series. Each post is a numbered episode that builds on the previous one.
Every episode has a BEFORE (what the viewer knows coming in) and an AFTER (what they leave with).
The viewer who watches all ${numPosts} episodes moves through this exact journey:
  Day 1: Stranger → Day 7: Aware → Day 14: Educated → Day 21: Trusting → Day ${numPosts}: Ready to buy

Episode-to-episode rules:
- Day 2 must reference what Day 1 introduced ("Yesterday I told you who I am. Today I show you what's costing you.")
- Day 8 transitions from diagnosis to solution ("Last week we named the problem. This week I give you the system.")
- Day 15 shifts from frameworks to proof ("I've taught you the map. Now let me show you I've walked the route.")
- Day 22 earns the right to sell ("You've had 3 weeks of free game. Here's how to go deeper.")
- The "notes" field MUST say: what the previous episode built + what this episode adds + what the next episode will open.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 2 — DAY 1: MANDATORY REINTRODUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 1 is non-negotiable. It must hit all 4 of these beats:
  1. WHO: Bathroom floors 2013 → R600K/year. Lost 780K followers overnight — didn't lose the income. SARS R207K debt → paid off.
  2. PROMISE: What this series will do for the viewer in ${numPosts} days (be specific — not "change your life", say the exact outcome)
  3. PROBLEM: Name the ONE thing holding this ICP back that they don't have language for yet
  4. CLIFFHANGER: End with a reason to come back tomorrow — tease Day 2's revelation
Day 1 fourE: Entertain. Day 1 framework: "Reintroduction". Day 1 proofStory: "bathroom_floors → R600K" .
Hook pattern: "You don't know me yet. But if you stay for ${numPosts} days, [specific outcome]. Let me earn your attention."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 3 — PAIDS: ONE EPISODE, ONE COMPLETE FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAIDS = Products | Ads & Affiliates | Information | Deals | Services
These 5 streams work TOGETHER as one system — they are not separate posts.
PAIDS gets ONE dedicated episode (Week 2) that teaches all 5 streams with real proof numbers.
Never split PAIDS: do NOT assign "Information only" or "Products only" to individual posts.
When any framework appears in the plan, the "framework" field must state what is INTRODUCED this episode:
  Options: "PAIDS — 5-stream overview" | "4E content ratio" | "SEEDS sales pipeline" | "9-Step Shell structure" | "R×A×C×U^B hook formula" | "Shadow Fear activation" | "Villain framing"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 4 — 4E DISTRIBUTION (enforce exactly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Educate: ${Math.round(numPosts * 0.40)} posts | Entertain: ${Math.round(numPosts * 0.30)} posts | Encourage: ${Math.round(numPosts * 0.20)} posts | Earn: ${Math.round(numPosts * 0.10)} posts
Earn posts appear ONLY in Week 4. Even in Week 4: 70% value, 30% direct sell. Max 3 posts that lead with an offer.
Never open with a product. Open with a transformation, close with access.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 5 — 4-WEEK AWARENESS LADDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1 — REINTRODUCTION + DIAGNOSIS (Days 1–${Math.min(7, numPosts)})
  Goal: viewer goes from Stranger → Symptom Aware
  Day 1 = who I am + series promise (see Rule 2)
  Days 2–7 = name the hidden problems this ICP feels but can't articulate. Give them the language.
  Hooks use: Undesired Result | A→B Transformation | Information Gap

Week 2 — EDUCATION (Days 8–${Math.min(14, numPosts)})
  Goal: viewer goes from Symptom Aware → Problem Aware
  Reveal the complete NOCHILL frameworks one per episode: PAIDS (all 5 streams), 4E, SEEDS, 9-Step Shell, R×A×C×U^B
  Each episode: teach ONE framework completely → give one real proof number → end with "tomorrow we go deeper"
  Hooks use: Desired Result | Information Gap

Week 3 — PROOF + TRANSFORMATION (Days 15–${Math.min(21, numPosts)})
  Goal: viewer goes from Problem Aware → Solution Aware
  Real stories only: R23K affiliate day | bathroom floors 2013 | 780K follower loss | R207K SARS debt | R350 first deal
  Ubuntu + legacy frames. SA community proof. "I'm not the exception — I'm the proof the system works."
  Hooks use: A→B Transformation | Social Proof

Week 4 — CONVERSION (Days 22–${numPosts})
  Goal: viewer goes from Solution Aware → Product Aware → Buyer
  Trust is earned. Now sell. 3 posts maximum lead with offer; rest are case studies, objection handling, social proof.
  Never beg. Never discount. Sell from abundance: "You've had 3 weeks of free game. Here's how to go all in."
  Hooks use: Desired Result | Undesired Result (cost of NOT buying)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE 6 — EVERY EPISODE MUST HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ROOT PAIN — not the surface complaint (go 2 levels deeper). "No views" → "no income" → "proof my expertise is worthless"
2. ONE SHADOW FEAR — activate implicitly through the content, never name it. Embody the fear, don't announce it.
3. ONE VILLAIN — a system, trap, or situation. Never a person. e.g. "the algorithm" | "gatekeeping institutions" | "9-to-5 identity trap"
4. PROOF ANCHOR — cite one real verified story/number when relevant. Use "proofStory" field with the story key (e.g. "r750_to_r100k", "r23k_affiliate_day", "bathroom_floors", "780k_followers_lost", "sars_r207k")
5. EPISODIC BRIDGE — "notes" field must say: what Day [N-1] set up + what this episode delivers + what Day [N+1] opens
6. SA TEXTURE — ZAR, SARS, WhatsApp, loadshedding, data costs, Ubuntu — where natural, never forced

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Generate ALL ${numPosts} days. Do not stop early. Do not skip days.
- All field values: max 15 words. Single line. No literal newlines inside strings.
- JSON must be valid and complete. Never truncate mid-array.
- seriesEpisode format: "Episode N of ${numPosts}"

Return ONLY this JSON, nothing else:
{
  "seriesName": "Series name max 8 words",
  "weeklyArcs": [
    {"week": 1, "title": "Arc name", "theme": "What the viewer gains this week", "awarenessLevel": "Symptom Aware"},
    {"week": 2, "title": "Arc name", "theme": "What the viewer gains this week", "awarenessLevel": "Problem Aware"},
    {"week": 3, "title": "Arc name", "theme": "What the viewer gains this week", "awarenessLevel": "Solution Aware"},
    {"week": 4, "title": "Arc name", "theme": "What the viewer gains this week", "awarenessLevel": "Product Aware"}
  ],
  "plan": [
    {
      "day": 1,
      "seriesEpisode": "Episode 1 of ${numPosts}",
      "topic": "Topic max 12 words",
      "hook": "Hook max 18 words — you-format, indirect, pulls on a wound",
      "fourE": "Entertain",
      "contentType": "Story",
      "framework": "Reintroduction — who I am and the series promise",
      "icp": "${targetICP === 'icp1' ? 'icp1' : targetICP === 'icp2' ? 'icp2' : 'icp1'}",
      "shadowFear": "Shadow fear name",
      "villain": "System villain max 5 words",
      "proofStory": "bathroom_floors",
      "cta": "Comment PAIDS I'll DM you the framework free",
      "notes": "Day 1: reintro + series promise. Sets language for Day 2 diagnosis."
    },
    {
      "day": 2,
      "seriesEpisode": "Episode 2 of ${numPosts}",
      "topic": "Topic max 12 words",
      "hook": "Hook max 18 words — references what Day 1 named, deepens the wound",
      "fourE": "Educate",
      "contentType": "Educational",
      "framework": "Root pain diagnosis — the problem they couldn't name",
      "icp": "${targetICP === 'icp1' ? 'icp1' : targetICP === 'icp2' ? 'icp2' : 'icp1'}",
      "shadowFear": "Shadow fear name",
      "villain": "System villain max 5 words",
      "proofStory": "",
      "cta": "Comment SYSTEM I'll DM you the breakdown",
      "notes": "Day 1 gave identity. Day 2 names the real enemy. Day 3 shows why most people never see it."
    }
  ],
  "compliance": {
    "icp": "ICP targeted",
    "fourEBreakdown": {"educate": 0, "entertain": 0, "encourage": 0, "earn": 0},
    "shadowFearsActivated": ["fear1", "fear2"],
    "villainsDefined": true,
    "emailCtaOnAll": true,
    "episodicStructure": true,
    "day1IsReintroduction": true,
    "paidsAsSingleEpisode": true,
    "week4OnlySellPosts": true
  }
}

Now generate all ${numPosts} plan items. Every day. No gaps.`

    const message = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 16000,
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
      // Normalise field names
      parsed.plan = parsed.plan.map((item: any) => ({
        ...item,
        hookIdea: item.hookIdea || item.hook || '',
        hook: item.hook || item.hookIdea || '',
        // framework replaces paids — teach PAIDS as one unit, not per-post stream
        paidsCategory: item.framework || item.paidsCategory || item.paids || '',
        ctaSuggestion: item.ctaSuggestion || item.cta || '',
        contentType: item.contentType || item.fourE || 'Educational',
      }))

      // Formula compliance warnings
      const batchWarnings: string[] = []
      const earnPosts = parsed.plan.filter((p: any) => (p.contentType || '').toLowerCase().includes('earn')).length
      const earnRatio = earnPosts / parsed.plan.length
      if (earnRatio > 0.15) batchWarnings.push(`${earnPosts}/${parsed.plan.length} posts are Earn — 4E ratio should be ≤15% Earn`)
      const shadowFearsUsed = parsed.plan.map((p: any) => p.shadowFear).filter(Boolean)
      const fearCounts: Record<string, number> = {}
      shadowFearsUsed.forEach((f: string) => { fearCounts[f] = (fearCounts[f] || 0) + 1 })
      Object.entries(fearCounts).forEach(([f, count]) => {
        if (count > 2) batchWarnings.push(`Shadow fear "${f}" used ${count} times — max 2 per plan to avoid fatigue`)
      })
      const day1 = parsed.plan[0]
      const day1Hook = (day1?.hookIdea || day1?.hook || '').toLowerCase()
      const day1Notes = (day1?.notes || '').toLowerCase()
      if (!/who am i|reintroduc|introduc|meet|i am/.test(day1Hook + day1Notes)) {
        batchWarnings.push('Day 1 post missing reintroduction — first post should establish who you are')
      }

      return NextResponse.json({ ...parsed, warnings: batchWarnings })
    }

    // Fallback: extract partial plan items from malformed JSON
    const partial = extractPartialPlan(responseText)
    if (partial.length > 0) {
      return NextResponse.json({
        plan: partial.map((item: any) => ({
          ...item,
          hookIdea: item.hookIdea || item.hook || '',
          hook: item.hook || item.hookIdea || '',
          paidsCategory: item.framework || item.paidsCategory || item.paids || '',
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
