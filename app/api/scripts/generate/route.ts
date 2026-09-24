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


/**
 * A fixed `slice(0, 8)` over a fixed list is why six different ideas came out telling the
 * same story. The ledger was ordered with the rate receipts first, so R15,000 → R45,000 and
 * "R350 then R750" sat at the top of every prompt ever sent.
 *
 * Two things fixed it. The pool went from 11 figures to 38 — a script about travel or usage
 * rights now has evidence of its own to reach for instead of reaching for the rate story.
 * And relevance moved INTO the data: every figure carries its own `topics`, editable in
 * Knowledge, so adding a receipt no longer means editing a regex map in this file.
 */
function figuresFor(all: any[], topic: string): { rows: any[]; anyRelevant: boolean } {
  // Match on the IDEA, never the pillar. "PRICE IT" would otherwise pull the rate story onto
  // every pricing topic, including the ones — usage rights, exclusivity, travel — that are
  // about something else entirely.
  const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, '')
  const words = new Set((String(topic || '').toLowerCase().match(/[a-z]{4,}/g) ?? []).map(stem))
  const score = (r: any) => {
    let hits = 0
    for (const t of (r.topics ?? [])) {
      for (const w of String(t).toLowerCase().split(/\s+/)) {
        if (w.length >= 4 && words.has(stem(w))) { hits++; break }
      }
    }
    return hits
  }
  const scored = [...all].map((r, i) => ({ r, i, s: score(r) }))
  const anyRelevant = scored.some((x) => x.s > 0)
  const rows = scored.sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.r)
  return { rows, anyRelevant }
}

/**
 * The same five rehook phrases went out on every call, so they stopped being shapes and
 * became boilerplate — "but here's the thing most people" turned up across unrelated topics.
 * Rotate a subset, seeded by the idea, so a given topic is stable across regenerations but
 * two different topics do not get the same three.
 */
function rotate<T>(arr: T[], n: number, seed: string): T[] {
  if (arr.length <= n) return arr
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0x7fffffff
  const start = h % arr.length
  return Array.from({ length: n }, (_, i) => arr[(start + i) % arr.length])
}

export async function POST(request: NextRequest) {
  const {
    idea, hook, pillar, tier, duration = '90s', format = 'personal', platform = 'reel',
    holding = '',   // one of INTAKE's six starting points — what you are actually holding
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
  const { rows: safe, anyRelevant } = figuresFor(gov.fact_lock?.safe ?? [], `${idea ?? ''} ${hook ?? ''}`)
  const principles = gov.script_principles?.principles ?? []
  const phrases: string[] = gov.rehook?.phrases ?? []

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

  const { skills, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar, tier })

  const out = await generate({
    tool: 'scripts',
    prompt: `Write ONE ${duration} ${platform} script into the skeleton below. The skeleton is fixed — it is measured, not a preference.

${hook ? `OPENING LINE (already chosen, use it verbatim as beat 1):\n"${hook}"\n` : ''}IDEA: ${idea || hook}
PILLAR: ${pillar ?? 'infer and state it'}
TIER SERVED: ${tier ?? 'infer and state it'}
FORMAT: ${fmt ? `${fmt.name} — ${fmt.shape}. ${fmt.use}` : format}

BEATS — these names are the shared vocabulary from the format. Use them EXACTLY, do not rename or paraphrase:
${fmtBeats.map((b) => `  ${b.n}. ${b.beat}  [${b.band}]`).join('\n')}

REHOOKS — ${fmt.rehooks}
  Read that placement literally. "3→4 seam" means a line of its own between beats 3 and 4.
  "before the last step" / "before the last item" / "before the So What turn" means INSIDE
  that beat, written into its line as [REHOOK] immediately before the final item — NOT a
  separate line between beats. His own script puts it there: "The third one is the one
  you're going to skip." The last item is where a list drops people; a rehook sitting
  between beats does nothing for that drop.
  Put seam rehooks in the "rehooks" array. Put in-beat rehooks inline in the beat's line.
FORMAT NOTE: ${fmt.note ?? ''}

EVERY BEAT CARRIES ONE MARKER: ${markers.join(' · ')}

JOINERS — write [BUT] and [THEREFORE] INLINE in the spoken line where the turn and the consequence land. Do not describe them.

SLOTS:
  [QUOTE SLOT] ${slots.QUOTE_SLOT ?? ''}
  [SCREENSHOT] ${slots.SCREENSHOT ?? ''}
  [TAIL] ${slots.TAIL ?? ''}

REHOOK — these are SHAPES, not lines to copy. Every one of them has already shipped, so a
script that reuses the words verbatim sounds like the last one. Write the rehook in the
language of THIS topic; borrow only the turn each shape makes:
${rotate(phrases, 3, idea || hook || '').map((p: string) => `  - ${p}`).join('\n')}

WHAT IS BEING HELD: ${holding || 'not stated — infer it, and if none of the six fits, say so in the first beat rather than inventing a mechanism'}

⛔ DO NOT INVENT A FRAMEWORK. If you teach a numbered breakdown, every part must be a
mechanism that already exists in the doctrine above — what a brand actually pays for, the
reserve split, the two statutory dates, the deduction categories, the agency patterns. If the
idea has no evidenced mechanism behind it, TEACH IT WITHOUT NUMBERING. A three-part model
invented to fit the topic reads authoritative and is worth nothing — there are already 147
frameworks in the bank against a cap of 19, and minting a 148th inside a reel is how that
happened.

PLAIN SPEECH — the law, and the rule most often half-followed:
  No term stands alone. NAME IT → SAY WHAT IT MEANS → SAY WHAT TO DO. All three, same order,
  every time. A word the listener has to already know is a word that loses them, and they do
  not rewind — they scroll.

  Every numbered item inside a breakdown takes all three moves:
    1 NAME IT        "Part one is access."
    2 WHAT IT MEANS  "That's the brand showing their product to your people."
    3 WHAT TO DO     "Open your last nine posts, tap View Insights, and add up the likes."

  ⛔ Two moves is the common failure: naming it and explaining it, then moving on. An item
  with no action is a definition, not a lesson.
  ⛔ Never "The three parts are access, production and usage." Three labels and nothing else
  is the shape of a slide, not of speech.

SCRIPTING PRINCIPLES — all four are non-negotiable:
${principles.map((p: any) => `  ${p.n}. ${p.name} — ${p.rule}`).join('\n')}
Villain: ${gov.script_principles?.advanced?.villain ?? ''}

QUOTE SLOT — the ONLY lines you may put in quotation marks as something somebody said.
${(gov.quote_bank?.lines ?? []).map((q: any) => `  - "${q.say}" — ${q.who} (${q.tier})`).join('\n')}
${gov.quote_bank?.rule ?? ''}
If none of them fits this piece, WRITE NO QUOTE AT ALL and leave the slot out. Never invent a
line and never attach a figure to a speaker who did not say it — a figure can be on the safe
list and the ATTRIBUTION still be fabricated, which no figure check can catch.

FIGURES YOU MAY USE — and nothing else. Ordered by what this topic is actually about:
${safe.map((s: any) => `  - ${s.fig} — ${s.note}`).join('\n')}
If a beat wants a number you cannot source from that list, write the beat so it does not need one.

${anyRelevant
  ? `⛔ DO NOT DEFAULT TO THE RATE STORY. R15,000 → R45,000 and "R350 then R750" are the two most
reachable receipts in the ledger, so they turn up in every script unless you stop yourself.
Use a figure because THIS topic needs that specific evidence — not because it is the one you
reached first. The list above is ordered by what this idea is actually about; the top of it is
where the fitting evidence is.`
  : `⛔ NOTHING IN THE LEDGER IS ABOUT THIS TOPIC. The list above is ordered by relevance and
nothing scored — there is no receipt for this idea. So WRITE IT WITHOUT A FIGURE. Teach the
mechanism, name the cost in the viewer's own terms, and leave the number out. Do NOT reach for
the rate story because it is the nearest thing to hand; an unrelated receipt bolted onto a
topic is how six different ideas come out sounding like one. An empty slot beats a plausible
filler.`}

THIS PIECE MUST NOT READ LIKE THE LAST ONE. The format is fixed and the ledger is fixed —
everything else is yours. The opening image, the mechanism you teach, the evidence you pick
and the words you pick it with all come from this idea and no other.

CTA: ${cta ? `"${cta.k}" — resolves to ${cta.destination}` : 'no keyword resolves; ask for a save or a reply instead'}

Return ONE JSON object, no prose:
{
  "format":"${fmt.name}",
  "beats":[{"n":1,"beat":"the exact beat name from the list","band":"0-8s","marker":"one of the four","screen":"ON-SCREEN TEXT IN CAPS or null","line":"what he says, with [BUT] and [THEREFORE] inline where they land. In a TEACHING beat, put [REHOOK] inline immediately before the LAST item — see the teaching-beat rule."}],
  "rehooks":[{"after":2,"line":"the rehook line"}],   // BETWEEN beats only. The teaching beat's own rehook goes INLINE in its line, not here — "after" cannot express "before the last item".
  "tail":"the unfinished line that loops back",
  // NOTE: do NOT ask for fullScript. It is the beats again in prose — composing it here from
  // the beats roughly halves the output and stops the two versions drifting apart.
  "loopsTo":"the opening line, word for word",
  "textHook":"3-7 words for the opening overlay",
  "caption":"opens on HIS loss with a figure from the list, then the teach, then ONE CTA",
  "ctaKeyword":"${cta?.k ?? 'NONE'}",
  "editNotes":{
    "visualHook":"ONE object, described",
    "screenshotBeat":"which beat carries it",
    "figuresOnScreen":"only figures from the list above",
    "figuresSpoken":"any range the viewer replaces with their own, marked as such"
  }
}`,
    skills, pillar, tier, tier_of: 'main',
    // max_tokens is a CEILING, not a spend — output is billed on what is produced. Headroom
    // is free; truncation is not. The last run stopped mid-sentence at 6000 and rendered as
    // a success, because a repaired-but-cut object still parses.
    maxTokens: 10000,
  })

  const { data, truncated } = extractJson<any>(out.text)
  const bad = explainGenerationFailure(out, data, 'a script', 300, truncated)
  if (bad) {
    const { status, ...body } = bad
    return NextResponse.json(body, { status })
  }

  // ── Two checks the fact-lock cannot do, because neither is about a figure ──────
  const warnings: string[] = []

  // 1 · A quote must be in the bank, word for word. A safe figure inside an invented
  //     attribution passes every figure check there is — that is how
  //     [QUOTE SLOT] "We already had R45,000 budgeted for this." shipped.
  const bank: string[] = (gov.quote_bank?.lines ?? []).map((q: any) => String(q.say).toLowerCase())
  const norm = (x: string) => x.toLowerCase().replace(/[“”"']/g, '').replace(/\s+/g, ' ').trim()
  for (const m of String(out.text).matchAll(/\[QUOTE SLOT\]\s*[“"']([^”"']{12,})[”"']/g)) {
    const said = norm(m[1])
    if (!bank.some((b) => norm(b).includes(said) || said.includes(norm(b)))) {
      warnings.push(`QUOTE NOT IN THE BANK — "${m[1].slice(0, 90)}". Nobody is recorded saying this. Cut it or replace it with a line from the quote bank.`)
    }
  }

  // 2 · A numbered breakdown must run on a mechanism that exists. "Purpose · cost · the
  //     number" appeared in a generated script and in zero files anywhere — invented on the
  //     spot to fit a thematic prompt. It reads exactly as authoritative as the real one.
  const numberedBeat = (data.beats ?? []).find((b: any) => /Part one|One\.\s/i.test(String(b.line ?? '')))
  if (numberedBeat && !holding) {
    warnings.push(`Beat ${numberedBeat.n} teaches a numbered model, but no starting point was given. Check each part against the doctrine — a three-part model invented to fit the topic reads exactly as convincing as an evidenced one.`)
  }

  // 3 · Plain speech, move three. Naming a thing and explaining it is two moves; the rule
  //     wants an ACTION on each item. Detected loosely — an imperative or a second-person
  //     instruction somewhere in the beat that carries the numbered list.
  const numbered = (data.beats ?? []).find((b: any) => /\bOne\.|\b1\./.test(String(b.line ?? '')))
  if (numbered) {
    const line = String(numbered.line)
    const hasAction = /\b(open|ask|send|write|count|check|add up|divide|take|go|tap|put|make|charge|reply|save|start|stop)\b/i.test(line)
    if (!hasAction) {
      warnings.push(`PLAIN SPEECH — beat ${numbered.n} names and explains each item but never says what to do. Two moves out of three. An item with no action is a definition, not a lesson.`)
    }
  }

  // 4 · The format names how many rehooks and where. Missing ones vanish silently in the
  //     composed script, because the composer only renders rehooks that match a beat.
  const wantRehooks = String(fmt.rehooks ?? '').split('·').length
  const gotRehooks = (data.rehooks ?? []).length
  if (gotRehooks < wantRehooks) {
    warnings.push(`REHOOKS: ${gotRehooks} of ${wantRehooks}. ${fmt.name} wants them at ${fmt.rehooks}.`)
  }
  const orphanRehooks = (data.rehooks ?? []).filter((r: any) => !(data.beats ?? []).some((b: any) => b.n === r.after))
  if (orphanRehooks.length) {
    warnings.push(`${orphanRehooks.length} rehook(s) point at a beat that does not exist, so they would not appear in the script.`)
  }

  // The rest of the edit notes are already known here. Asking the model to restate the
  // bands, the rehook seams, the CTA and two measured constants cost output tokens it did
  // not have — run two hit the 8,000 ceiling and could not even be repaired. Derived.
  data.editNotes = {
    runtimeTarget: fmtBeats[fmtBeats.length - 1]?.band?.split('-')[1] ?? duration,
    bands: fmtBeats.map((b) => b.band).join(' · '),
    rehooks: fmt.rehooks,
    firstCut: 'no earlier than 5.0s',
    cutCadence: '11-14/min',
    ctaKeyword: cta ? `${cta.k} — ${cta.destination}` : 'none resolves; ask for a save',
    ...(data.editNotes ?? {}),
  }

  // fullScript is the beats again in prose. Asking the model for both roughly doubles the
  // output tokens — which is what was truncating the script — and lets the two drift apart.
  // Composed here instead, from the beats it already wrote, so they cannot disagree.
  data.fullScript = [
    ...(data.beats ?? []).flatMap((b: any) => [
      b.screen ? `SCREEN: ${b.screen}` : null,
      b.line,
      ...(data.rehooks ?? []).filter((r: any) => r.after === b.n).map((r: any) => `REHOOK — ${r.line}`),
    ]),
    data.tail ? `TAIL — ${data.tail}` : null,
  ].filter(Boolean).join('\n\n')

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
    warnings,
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
