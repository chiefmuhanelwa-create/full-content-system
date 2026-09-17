/**
 * SCRIPT WRITER — 80% data, 20% model.
 *
 * The beat structure is not the model's choice. It comes from the measured rehook cadence
 * for the chosen runtime: rehooking is what produces 80–95% watch time, and the cadence table
 * says exactly how many loops a 15/30/60/90-second piece carries and how far apart.
 *
 *   DATA (80%)  rehook count and spacing for the runtime · the rehook phrase bank · the four
 *               scripting principles · the chosen format's shape · the evidenced figure list ·
 *               the CTA that resolves · the ruled pillar and tier
 *   MODEL (20%) writes the lines into that skeleton and nothing more
 *
 * The response carries the skeleton it was built on, so the beats are inspectable rather
 * than implied.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getGovernance } from '@/lib/governance'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'
import { logActivity } from '@/lib/activity'

export async function POST(request: NextRequest) {
  const {
    idea, hook, pillar, tier, duration = '90s', format = 'personal', platform = 'reel',
  } = await request.json()
  if (!idea?.trim() && !hook?.trim()) {
    return NextResponse.json({ error: 'An idea or a hook is required.' }, { status: 400 })
  }

  const gov = await getGovernance()
  const cadence = (gov.rehook?.cadence ?? []).find((c: any) => c.duration === duration)
  if (!cadence) {
    return NextResponse.json({
      error: `No rehook cadence is seeded for "${duration}".`,
      fix: 'Run scripts/seed-algorithm.ts, or add a cadence row to `rehook` in Knowledge.',
      available: (gov.rehook?.cadence ?? []).map((c: any) => c.duration),
    }, { status: 503 })
  }

  const fmt = (gov.script_formats?.formats ?? []).find((f: any) => f.key === format)
  const cta = (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live' && k.pillar === pillar)
    ?? (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live')
  const safe = (gov.fact_lock?.safe ?? []).slice(0, 8)
  const principles = gov.script_principles?.principles ?? []
  const phrases = gov.rehook?.phrases ?? []

  // ── The skeleton is computed from data, not chosen by the model ─────────
  const beats = String(cadence.structure).split('→').map((b: string) => b.trim())

  const { system, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar, tier })

  const out = await generate({
    prompt: `Write ONE ${duration} ${platform} script into the skeleton below. The skeleton is fixed — it is measured, not a preference.

${hook ? `OPENING LINE (already chosen, use it verbatim as beat 1):\n"${hook}"\n` : ''}IDEA: ${idea || hook}
PILLAR: ${pillar ?? 'infer and state it'}
TIER SERVED: ${tier ?? 'infer and state it'}
FORMAT: ${fmt ? `${fmt.name} — ${fmt.shape}. ${fmt.use}` : format}

SKELETON — ${cadence.rehooks} rehook(s), one every ${cadence.every}:
${beats.map((b: string, i: number) => `  beat ${i + 1}: ${b}`).join('\n')}

REHOOK PHRASES you may adapt (do not invent a new shape):
${phrases.slice(0, 5).map((p: string) => `  - ${p}`).join('\n')}

SCRIPTING PRINCIPLES — all four are non-negotiable:
${principles.map((p: any) => `  ${p.n}. ${p.name} — ${p.rule}`).join('\n')}
Villain: ${gov.script_principles?.advanced?.villain ?? ''}

FIGURES YOU MAY USE — and nothing else:
${safe.map((s: any) => `  - ${s.fig} — ${s.note}`).join('\n')}
If a beat wants a number you cannot source from that list, write the beat so it does not need one.

CTA: ${cta ? `"${cta.k}" — resolves to ${cta.destination}` : 'no keyword resolves; ask for a save or a reply instead'}

Return ONE JSON object, no prose:
{
  "beats":[{"n":1,"label":"Hook","seconds":"0-8","line":"what he says","screen":"on-screen text or null"}],
  "rehooksUsed":["the rehook lines, in order"],
  "fullScript":"the whole thing as continuous speakable text, with [SCREEN: ...] cues inline",
  "textHook":"3-7 words for the opening overlay",
  "caption":"opens on HIS loss with a figure from the list, then the teach, then ONE CTA",
  "ctaKeyword":"${cta?.k ?? 'NONE'}",
  "runtimeCheck":"your estimate of spoken length at ~150 words per minute"
}`,
    system, pillar, tier, tier_of: 'main', maxTokens: 6000,
  })

  const { data } = extractJson<any>(out.text)
  if (!data) {
    return NextResponse.json({ error: 'The model did not return a usable script.', raw: out.text.slice(0, 1200) }, { status: 502 })
  }

  const surfaces = ['fullScript', 'caption', 'textHook'] as const
  const perSurface: Record<string, any> = {}
  let anyBanned = false
  for (const s of surfaces) {
    const r = check(String(data[s] ?? ''))
    perSurface[s] = { clean: r.clean, banned: r.banned.map((b) => ({ name: b.name, found: b.found })) }
    if (!r.clean) anyBanned = true
  }

  await logActivity('script', 'generate', `${duration} ${platform} — ${String(idea || hook).slice(0, 60)}`, {
    pillar, tier, duration, format, rehooks: cadence.rehooks, banned: anyBanned,
  })

  return NextResponse.json({
    success: true,
    script: data,
    skeleton: {
      duration, beats, rehooks: cadence.rehooks, every: cadence.every,
      why: gov.rehook?.why, target: gov.rehook?.target,
    },
    composition: {
      fromData: `the ${duration} rehook cadence (${cadence.rehooks} loops, every ${cadence.every}), ${principles.length} scripting principles, the ${fmt?.name ?? format} shape, ${safe.length} evidenced figures and the ruled pillar set`,
      fromModel: 'the lines inside the fixed skeleton',
      ratio: '80% data / 20% model',
    },
    factLock: { anyBanned, perSurface },
    blocked: anyBanned,
    cta: cta ?? null,
    meta: { ...out.meta, skillsUsed },
  })
}
