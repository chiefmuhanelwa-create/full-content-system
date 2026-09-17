/**
 * THE BATCH SHOOT PIPELINE — idea in, a shootable bundle out.
 *
 * POST /api/batch-shoot            { idea, pillar, tier, goal, format, duration }
 *   -> spoken hook (second person, accuses the viewer)
 *   -> text hook   (the on-screen overlay — a DIFFERENT job, usually shorter and blunter)
 *   -> reel script with rehooks placed on the measured cadence
 *   -> long-form script from the same record (One-Record-Four-Format-Chain)
 *   -> caption (opens on HIS loss with a ledger figure — the Loss Law)
 *   -> CTA keyword that actually resolves
 *   -> KPI set BEFORE it ships
 *
 * GET  /api/batch-shoot            the board
 * PUT  /api/batch-shoot            record the result and judge it
 *
 * Everything the model is told comes from system_settings, so changing the hook library or
 * the rehook cadence changes the output with no deploy.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { getGovernance, OWNER, normalisePillars } from '@/lib/governance'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'

function pickCta(gov: any, pillar?: string) {
  const lib = gov.cta_library?.keywords ?? []
  const live = lib.filter((k: any) => k.status === 'live')
  const forPillar = live.find((k: any) => k.pillar === pillar)
  return forPillar ?? live[0] ?? null
}

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { idea, pillar, tier, goal = 'NURTURE', format = 'personal', duration = '90s' } = await request.json()
  if (!idea?.trim()) return NextResponse.json({ error: 'An idea is required.' }, { status: 400 })

  const gov = await getGovernance()
  const cadence = (gov.rehook?.cadence ?? []).find((c: any) => c.duration === duration) ?? gov.rehook?.cadence?.[3]
  const cta = pickCta(gov, pillar)
  const fmt = (gov.script_formats?.formats ?? []).find((f: any) => f.key === format)
  const kpi = (gov.kpi_model?.goals ?? []).find((g: any) => g.goal === goal)

  const { system, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar, tier })

  const prompt = `Produce a complete shoot bundle for ONE idea.

IDEA: ${idea}
PILLAR: ${pillar ?? 'choose the best fit and say which'}
TIER SERVED: ${tier ?? 'choose and say which'}
GOAL: ${goal} — ${kpi ? `pass condition: ${kpi.pass}` : ''}
FORMAT: ${fmt ? `${fmt.name} — ${fmt.shape}. ${fmt.use}` : format}
RUNTIME: ${duration}

REHOOK CADENCE (non-negotiable, this is measured):
${cadence ? `${cadence.rehooks} rehooks, one every ${cadence.every}. Structure: ${cadence.structure}` : ''}
Rehook phrases you may adapt: ${(gov.rehook?.phrases ?? []).slice(0, 4).join(' | ')}

HOOK RULES:
- SPOKEN hook: ${gov.hook_library?.spokenHookLaw ?? ''}
- CAPTION hook: ${gov.hook_library?.captionHookLaw ?? ''}
- TEXT hook (on-screen overlay) is a THIRD thing: 3–7 words, blunt, readable at a glance with sound off. It is not the spoken line and not the caption opener.
- Score the spoken hook with R×A×C×U^B (Relevant, Awareness, Clarity, Unique, Broadened) and give each 1–5.

CTA: ${cta ? `use "${cta.k}" — it resolves to ${cta.destination}. ${cta.note}` : 'NO KEYWORD RESOLVES. Write the piece with no CTA and say so — a keyword without a destination converts nothing AND loses the comment.'}

SCRIPTING PRINCIPLES:
${(gov.script_principles?.principles ?? []).map((p: any) => `${p.n}. ${p.name} — ${p.rule}`).join('\n')}
Villain: ${gov.script_principles?.advanced?.villain ?? ''}

Return ONE JSON object, no prose, no fence:
{
  "pillar": "...", "tier": "...",
  "spokenHook": "the opening line, second person",
  "hookScore": {"R":1-5,"A":1-5,"C":1-5,"U":1-5,"B":1-5,"why":"one sentence"},
  "textHook": "3-7 words for the screen",
  "reelScript": "the full ${duration} script, with [REHOOK] markers and [SCREEN: ...] cues inline",
  "rehooks": ["the rehook lines used, in order"],
  "screenText": ["each on-screen text cue, in order"],
  "longFormScript": "the same record expanded to 4-6 minutes: same argument, more mechanism, more worked example",
  "caption": "opens on HIS loss with a ledger figure, then the teach, then ONE CTA",
  "ctaKeyword": "${cta?.k ?? 'NONE'}",
  "shotList": ["what to physically record, in order"]
}`

  const out = await generate({
    prompt, system, pillar, tier, tier_of: 'main', maxTokens: 8000,
  })

  const ex = extractJson<any>(out.text)
  const bundle = ex.data

  if (!bundle) {
    return NextResponse.json({
      error: 'The model did not return usable JSON.',
      diagnosis: ex.truncated
        ? 'The response was cut off at the token limit. Try a shorter runtime.'
        : 'No JSON object was found in the response.',
      factLock: out.factLock, raw: out.text.slice(0, 1500),
    }, { status: 502 })
  }

  // Fact-check every written surface separately — a clean script with a dirty caption still ships dirty.
  const surfaces = ['spokenHook', 'textHook', 'reelScript', 'longFormScript', 'caption'] as const
  const perSurface: Record<string, any> = {}
  let anyBanned = false
  for (const s of surfaces) {
    const r = check(String(bundle[s] ?? ''))
    perSurface[s] = { clean: r.clean, banned: r.banned.map((b) => ({ name: b.name, found: b.found })) }
    if (!r.clean) anyBanned = true
  }

  const item = await prisma!.shootItem.create({
    data: {
      userId: OWNER, idea,
      pillar: bundle.pillar ?? pillar ?? null,
      tier: bundle.tier ?? tier ?? null,
      format, goal,
      spokenHook: bundle.spokenHook ?? null,
      textHook: bundle.textHook ?? null,
      reelScript: bundle.reelScript ?? null,
      longFormScript: bundle.longFormScript ?? null,
      caption: bundle.caption ?? null,
      ctaKeyword: bundle.ctaKeyword && bundle.ctaKeyword !== 'NONE' ? bundle.ctaKeyword : null,
      rehooks: bundle.rehooks ?? undefined,
      screenText: bundle.screenText ?? undefined,
      hookScore: bundle.hookScore ?? undefined,
      factLock: { anyBanned, perSurface } as any,
      kpiMetric: kpi?.primary ?? null,
      status: 'scripted',
    },
  })

  return NextResponse.json({
    success: true, id: item.id, bundle,
    shotList: bundle.shotList ?? [],
    kpi: kpi ? { goal, metric: kpi.primary, pass: kpi.pass } : null,
    factLock: { anyBanned, perSurface },
    blocked: anyBanned,
    meta: { ...out.meta, skillsUsed, repaired: out.repaired },
    note: anyBanned
      ? 'A banned claim survived the repair pass. Fix it before this is recorded.'
      : 'Clean. Set the KPI target, shoot it, then record the result.',
  })
}

export async function GET() {
  const dbError = checkDatabase(); if (dbError) return dbError
  const items = await prisma!.shootItem.findMany({
    where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 100,
  })
  const measured = items.filter((i) => i.verdict)
  const byReason: Record<string, number> = {}
  for (const i of measured.filter((m) => m.verdict === 'fail')) {
    const k = i.lesson?.slice(0, 60) || 'unrecorded'
    byReason[k] = (byReason[k] || 0) + 1
  }
  return NextResponse.json({
    count: items.length,
    byStatus: items.reduce((a: any, i) => ({ ...a, [i.status]: (a[i.status] || 0) + 1 }), {}),
    passRate: measured.length ? Math.round((measured.filter((m) => m.verdict === 'pass').length / measured.length) * 100) : null,
    repeatedFailures: Object.entries(byReason).filter(([, n]) => n >= 3)
      .map(([reason, n]) => ({ reason, times: n, rule: 'Three repeats becomes a rule — The Third-Repetition-Rule.' })),
    items,
  })
}

export async function PUT(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { id, ...patch } = await request.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const item = await prisma!.shootItem.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: any = { ...patch }
  if (patch.postedAt) data.postedAt = new Date(patch.postedAt)

  // Judge only when a target was set BEFORE the result arrived.
  if (patch.actualValue != null && item.kpiTarget != null) {
    data.verdict = patch.actualValue >= item.kpiTarget ? 'pass' : 'fail'
    data.status = 'measured'
  }

  const updated = await prisma!.shootItem.update({ where: { id }, data })
  return NextResponse.json({
    success: true, item: updated,
    judged: updated.verdict ?? null,
    note: item.kpiTarget == null && patch.actualValue != null
      ? 'No KPI target was set before posting, so this result cannot be judged. It teaches nothing.'
      : undefined,
  })
}
