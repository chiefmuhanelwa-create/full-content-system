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
import { explainGenerationFailure } from '@/lib/ai/explain'
import { ctaForPillar } from '@/lib/cta'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
/**
 * vercel.json allows 300s, but a route-level export WINS over it — so the 60 that used to be
 * here was the real ceiling, and every long generation was killed mid-stream and reported as
 * a model failure. See lib/ai/explain.ts.
 */
export const maxDuration = 300

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
  const cta = ctaForPillar(gov, pillar)
  const safe = (gov.fact_lock?.safe ?? []).slice(0, 8)
  const principles = gov.script_principles?.principles ?? []
  const phrases = gov.rehook?.phrases ?? []

  // ── The skeleton is the FORMAT'S OWN BEATS ──────────────────────────────
  // Not rehook.cadence.structure. That is a generic Hook→Build→Rehook→Peak spine belonging
  // to no format, and because this prompt says "the skeleton is fixed" it beat the seeded
  // skill every time — which is why every script came out in it.
  const fmtBeats: { n: number; beat: string; band: string }[] = fmt?.beats ?? []
  if (!fmtBeats.length) {
    return NextResponse.json({
      error: `The "${format}" format has no beat table.`,
      why: 'Beats come from script_formats, which mirrors new-scripting/references/FORMATS.md. Without them there is no skeleton and the model would invent one.',
      fix: 'Run scripts/seed-algorithm.ts.',
      available: (gov.script_formats?.formats ?? []).map((f: any) => f.key),
    }, { status: 503 })
  }
  const markers: string[] = gov.script_formats?.markers ?? []
  const slots = gov.script_formats?.slots ?? {}

  const { system, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar, tier })

  const out = await generate({
    tool: 'scripts',
    prompt: `Write ONE ${duration} ${platform} script into the skeleton below. The skeleton is fixed — it is measured, not a preference.

${hook ? `OPENING LINE (already chosen, use it verbatim as beat 1):\n"${hook}"\n` : ''}IDEA: ${idea || hook}
PILLAR: ${pillar ?? 'infer and state it'}
TIER SERVED: ${tier ?? 'infer and state it'}
FORMAT: ${fmt ? `${fmt.name} — ${fmt.shape}. ${fmt.use}` : format}

BEATS — these names are the shared vocabulary from the format. Use them EXACTLY, do not rename or paraphrase:
${fmtBeats.map((b) => `  ${b.n}. ${b.beat}  [${b.band}]`).join('\n')}

REHOOKS — ${fmt.rehooks}. Write them as their own lines between beats, labelled REHOOK 1 / REHOOK 2.
FORMAT NOTE: ${fmt.note ?? ''}

EVERY BEAT CARRIES ONE MARKER: ${markers.join(' · ')}

JOINERS — write [BUT] and [THEREFORE] INLINE in the spoken line where the turn and the consequence land. Do not describe them.

SLOTS:
  [QUOTE SLOT] ${slots.QUOTE_SLOT ?? ''}
  [SCREENSHOT] ${slots.SCREENSHOT ?? ''}
  [TAIL] ${slots.TAIL ?? ''}

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
  "format":"${fmt.name}",
  "beats":[{"n":1,"beat":"the exact beat name from the list","band":"0-8s","marker":"one of the four","screen":"ON-SCREEN TEXT IN CAPS or null","line":"what he says, with [BUT] and [THEREFORE] inline where they land"}],
  "rehooks":[{"after":2,"line":"the rehook line"}],
  "tail":"the unfinished line that loops back",
  "loopsTo":"the opening line, word for word",
  "fullScript":"the whole thing as continuous speakable text, with SCREEN: cues and REHOOK labels inline",
  "textHook":"3-7 words for the opening overlay",
  "caption":"opens on HIS loss with a figure from the list, then the teach, then ONE CTA",
  "ctaKeyword":"${cta?.k ?? 'NONE'}",
  "editNotes":{
    "runtimeTarget":"e.g. 94s",
    "bands":"the beat bands joined with a dot",
    "rehooks":"where they sit",
    "visualHook":"ONE object, described",
    "firstCut":"no earlier than 5.0s",
    "cutCadence":"11-14/min",
    "screenshotBeat":"which beat carries it",
    "figuresOnScreen":"only figures from the list above",
    "figuresSpoken":"any range the viewer replaces with their own, marked as such",
    "ctaKeyword":"${cta?.k ?? 'NONE'} — confirm live before recording"
  }
}`,
    system, pillar, tier, tier_of: 'main', maxTokens: 6000,
  })

  const { data } = extractJson<any>(out.text)
  const bad = explainGenerationFailure(out, data, 'a script', 300)
  if (bad) {
    const { status, ...body } = bad
    return NextResponse.json(body, { status })
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
      duration,
      format: fmt.name,
      beats: fmtBeats,
      rehooks: fmt.rehooks,
      // The measured rehook cadence is still reported — it is the retention evidence — but
      // it no longer supplies the skeleton. The format's beat table does.
      cadence: { loops: cadence.rehooks, every: cadence.every, why: gov.rehook?.why, target: gov.rehook?.target },
    },
    composition: {
      fromData: `the ${fmt.name} beat table from new-scripting (${fmtBeats.length} beats, rehooks ${fmt.rehooks}), the ${duration} rehook cadence, ${principles.length} scripting principles, ${safe.length} evidenced figures and the ruled pillar set`,
      fromModel: 'the lines inside the fixed skeleton',
      ratio: '80% data / 20% model',
    },
    factLock: { anyBanned, perSurface },
    blocked: anyBanned,
    cta: cta ?? null,
    meta: { ...out.meta, skillsUsed },
  })
}
