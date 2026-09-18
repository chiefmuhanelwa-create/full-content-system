/**
 * HOOK GENERATOR — 80% data, 20% model.
 *
 * The old version handed a topic to a model and asked for hooks. Whatever came back was
 * invention wearing the house voice, and nothing tied it to a template that had ever worked.
 *
 * This version is structural:
 *   DATA (80%)  the 50 proven templates from `hook_library`, chosen by pillar and awareness;
 *               the safe figure list; the CTA keyword that actually resolves; the voice
 *               mechanics; the spoken-vs-caption hook laws
 *   MODEL (20%) fills the {placeholders} for this specific topic and scores R×A×C×U^B
 *
 * Every hook returned carries the template it came from, so provenance is visible and a hook
 * can never be "where did this come from?"
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkDatabase } from '@/lib/db-helper'
import { getGovernance, OWNER } from '@/lib/governance'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'
import { logActivity } from '@/lib/activity'
import { explainGenerationFailure } from '@/lib/ai/explain'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
/**
 * vercel.json allows 300s, but a route-level export WINS over it — so the 60 that used to be
 * here was the real ceiling, and every long generation was killed mid-stream and reported as
 * a model failure. See lib/ai/explain.ts.
 */
export const maxDuration = 300

/** Awareness -> which trigger categories actually fit. From the library's own guidance. */
const BY_AWARENESS: Record<string, string[]> = {
  unaware:        ['Curiosity/Teaser', 'Shock/Harsh Truth'],
  problem:        ['Shock/Harsh Truth', 'Question', 'Comparison'],
  solution:       ['Comparison', 'Authority/Pattern Interrupt'],
  product:        ['Authority/Pattern Interrupt', 'Relatability/FOMO'],
  most:           ['Relatability/FOMO', 'Authority/Pattern Interrupt'],
}

function pick<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = []
  const pool = [...arr]
  let s = seed
  while (out.length < n && pool.length) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    out.push(pool.splice(s % pool.length, 1)[0])
  }
  return out
}

export async function POST(request: NextRequest) {
  const { topic, pillar, tier, awareness = 'problem', count = 9, surface = 'spoken' } = await request.json()
  if (!topic?.trim()) return NextResponse.json({ error: 'A topic is required.' }, { status: 400 })

  const gov = await getGovernance()
  const lib = gov.hook_library
  if (!lib?.categories?.length) {
    return NextResponse.json({
      error: 'The hook library is not seeded.',
      fix: 'Run scripts/seed-algorithm.ts, or import a hook_library in Knowledge.',
    }, { status: 503 })
  }

  // ── 80%: choose real templates from the seeded library ──────────────────
  const wanted = BY_AWARENESS[awareness] ?? BY_AWARENESS.problem
  const eligible = lib.categories.filter((c: any) => wanted.includes(c.name))
  const source = eligible.length ? eligible : lib.categories

  const seed = Math.floor(Date.now() / 1000)
  const perCat = Math.max(1, Math.ceil(count / source.length))
  const chosen: { category: string; use: string; template: string }[] = []
  for (const c of source) {
    for (const t of pick<string>(c.templates, perCat, seed + c.name.length)) {
      chosen.push({ category: c.name, use: c.use, template: t })
    }
  }
  const templates = chosen.slice(0, count)

  const safeFigures = (gov.fact_lock?.safe ?? []).map((s: any) => `${s.fig} — ${s.note}`).slice(0, 8)
  const cta = (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live' && k.pillar === pillar)
    ?? (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live')
  const law = surface === 'caption' ? lib.captionHookLaw : lib.spokenHookLaw

  const { system, skillsUsed } = await buildGovernedSystemPrompt('hooks', { pillar, tier })

  // ── 20%: the model only fills placeholders and scores ───────────────────
  const out = await generate({
    tool: 'hooks',
    prompt: `Fill each proven template below for ONE specific topic. Do not invent new hook shapes — the templates are the structure and they have already been proven.

TOPIC: ${topic}
PILLAR: ${pillar ?? 'infer and state it'}
TIER SERVED: ${tier ?? 'infer and state it'}
SURFACE: ${surface === 'caption' ? 'CAPTION (written)' : 'SPOKEN (on camera)'}
LAW FOR THIS SURFACE: ${law}

FIGURES YOU MAY USE — and nothing else:
${safeFigures.map((f: string) => `- ${f}`).join('\n')}
If a template wants a number you cannot source from that list, rewrite the line so it does not need one. An empty slot beats a plausible filler.

TEMPLATES (fill the {placeholders}, keep the shape):
${templates.map((t, i) => `${i + 1}. [${t.category}] ${t.template}`).join('\n')}

For each, score R×A×C×U^B 1–5:
R relevant to this audience · A matches awareness level "${awareness}" · C clarity of outcome · U unique, not a line they have heard · B broadened beyond the niche.

Return ONE JSON object, no prose:
{"hooks":[{"n":1,"hook":"the filled line","category":"...","scores":{"R":1,"A":1,"C":1,"U":1,"B":1},"total":0,"why":"one short sentence"}],"pillar":"...","tier":"..."}`,
    system, pillar, tier, tier_of: 'main', maxTokens: 4000,
  })

  const { data } = extractJson<any>(out.text)
  const bad = explainGenerationFailure(out, data?.hooks?.length ? data : null, 'hooks', 300)
  if (bad) {
    const { status, ...body } = bad
    return NextResponse.json(body, { status })
  }

  // Attach provenance and fact-check each line independently.
  const hooks = data.hooks.map((h: any, i: number) => {
    const src = templates[(h.n ?? i + 1) - 1] ?? templates[i] ?? null
    const fl = check(String(h.hook ?? ''))
    const sc = h.scores ?? {}
    const total = h.total ?? ['R', 'A', 'C', 'U', 'B'].reduce((a, k) => a + (Number(sc[k]) || 0), 0)
    return {
      ...h, total,
      sourceTemplate: src?.template ?? null,
      category: h.category ?? src?.category ?? null,
      clean: fl.clean,
      banned: fl.banned.map((b) => b.name),
    }
  }).sort((a: any, b: any) => b.total - a.total)

  // Persist so the bank fills from use, not from a separate chore.
  await logActivity('hook', 'generate', `${hooks.length} hooks for "${String(topic).slice(0, 60)}"`, {
    topic, pillar, tier, awareness, surface,
    templatesUsed: templates.length,
    topScore: hooks[0]?.total ?? null,
    flagged: hooks.filter((h: any) => h.clean === false).length,
  })

  return NextResponse.json({
    success: true,
    hooks,
    composition: {
      fromData: `${templates.length} proven templates, ${safeFigures.length} evidenced figures, the ${surface} hook law, and the ruled pillar set`,
      fromModel: 'placeholder filling and R×A×C×U^B scoring only',
      ratio: '80% data / 20% model',
    },
    cta: cta ? { keyword: cta.k, destination: cta.destination, note: cta.note } : null,
    meta: { ...out.meta, skillsUsed },
  })
}
