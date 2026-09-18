/**
 * Generate one script through the REAL composition path and check it.
 *
 * The route is behind auth, so this rebuilds exactly what it sends — governance, ban list,
 * seeded skills, the format's beat table, the quote bank — and runs the same checks over
 * what comes back. The SDK fails locally under Node 22 ("Premature close"), so the request
 * goes out over fetch, which does not.
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env' }); dotenv.config({ path: '.env.local', override: true })
process.env.DATABASE_URL = process.env.DIRECT_URL!

import { getGovernance, governanceForPrompt } from '../lib/governance'
import { banListForPrompt, check } from '../lib/fact-lock'
import { buildGovernedSystemPrompt } from '../lib/skills'
import { extractJson } from '../lib/json-extract'

const IDEA = process.argv[2] ?? 'many creators do not know how to charge brands'
const FORMAT = process.argv[3] ?? 'personal'

async function main() {
  const gov = await getGovernance()
  const fmt = (gov.script_formats?.formats ?? []).find((f: any) => f.key === FORMAT)
  if (!fmt?.beats?.length) throw new Error(`no beat table for "${FORMAT}"`)

  const { skills, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar: 'PRICE IT', tier: 'CORE' })
  const doctrine = await governanceForPrompt({ pillar: 'PRICE IT', tier: 'CORE' })
  const system = [doctrine, banListForPrompt(), skills].join('\n\n---\n\n')

  const safe = (gov.fact_lock?.safe ?? []).slice(0, 8)
  const quotes = gov.quote_bank?.lines ?? []
  const markers = gov.script_formats?.markers ?? []

  const prompt = `Write ONE 90s reel script into the skeleton below. The skeleton is fixed.

IDEA: ${IDEA}
PILLAR: PRICE IT
TIER SERVED: CORE
FORMAT: ${fmt.name} — ${fmt.use}

BEATS — use these names EXACTLY:
${fmt.beats.map((b: any) => `  ${b.n}. ${b.beat}  [${b.band}]`).join('\n')}

REHOOKS — ${fmt.rehooks}. Write them as their own lines, labelled, between beats.
FORMAT NOTE: ${fmt.note}

EVERY BEAT CARRIES ONE MARKER: ${markers.join(' · ')}
JOINERS — write [BUT] and [THEREFORE] INLINE where the turn and the consequence land.

PLAIN SPEECH — NAME IT -> SAY WHAT IT MEANS -> SAY WHAT TO DO. All three, every numbered item.
Two moves is the common failure. An item with no action is a definition, not a lesson.

QUOTE SLOT — the ONLY lines you may quote:
${quotes.map((q: any) => `  - "${q.say}" — ${q.who} (${q.tier})`).join('\n')}
${gov.quote_bank?.rule}
If none fits, write NO quote at all.

FIGURES YOU MAY USE — and nothing else:
${safe.map((s: any) => `  - ${s.fig} — ${s.note}`).join('\n')}

CTA: "RATE" — resolves to Rate Card Pro

Return ONE JSON object, no prose:
{"format":"","beats":[{"n":1,"beat":"","band":"","marker":"","screen":"","line":""}],
 "rehooks":[{"after":2,"line":""}],"tail":"","loopsTo":"","textHook":"","caption":"","ctaKeyword":"RATE",
 "editNotes":{"visualHook":"","screenshotBeat":"","figuresOnScreen":"","figuresSpoken":""}}`

  console.log(`prompt: system ${system.length.toLocaleString()} + user ${prompt.length.toLocaleString()} chars`)
  console.log(`skills: ${skillsUsed.length} docs\n`)

  const t0 = Date.now()
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL_MAIN || 'claude-sonnet-5',
      max_tokens: 10000,
      system: [
        { type: 'text', text: doctrine, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: banListForPrompt(), cache_control: { type: 'ephemeral' } },
        { type: 'text', text: skills, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const j: any = await r.json()
  const ms = Date.now() - t0
  if (j.error) { console.error('API:', j.error.message); process.exit(1) }

  const text = (j.content ?? []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
  const u = j.usage ?? {}
  console.log(`${(ms / 1000).toFixed(1)}s · in ${u.input_tokens} · cache_created ${u.cache_creation_input_tokens ?? 0} · cache_read ${u.cache_read_input_tokens ?? 0} · out ${u.output_tokens} · stop ${j.stop_reason}\n`)

  const { data, truncated, repair } = extractJson<any>(text)
  console.log(`parsed: ${!!data} · truncated: ${truncated} · repair: ${repair}\n`)
  if (!data) { console.log(text.slice(0, 600)); process.exit(1) }

  // ── the same checks the route runs ──────────────────────────────────────────
  const warnings: string[] = []
  const bank = quotes.map((q: any) => String(q.say).toLowerCase())
  const norm = (x: string) => x.toLowerCase().replace(/[“”"']/g, '').replace(/\s+/g, ' ').trim()
  for (const m of text.matchAll(/\[QUOTE SLOT\]\s*[“"']([^”"']{12,})[”"']/g)) {
    const said = norm(m[1])
    if (!bank.some((b: string) => norm(b).includes(said) || said.includes(norm(b))))
      warnings.push(`QUOTE NOT IN BANK — "${m[1].slice(0, 70)}"`)
  }
  const want = String(fmt.rehooks).split('·').length
  if ((data.rehooks ?? []).length < want) warnings.push(`REHOOKS: ${(data.rehooks ?? []).length} of ${want}`)
  const numbered = (data.beats ?? []).find((b: any) => /\bOne\.|\b1\./.test(String(b.line ?? '')))
  if (numbered && !/\b(open|ask|send|write|count|check|add up|divide|take|go|tap|put|make|charge|reply|save|start|stop)\b/i.test(numbered.line))
    warnings.push(`PLAIN SPEECH — beat ${numbered.n}: names and explains, never says what to do`)

  console.log('BEATS')
  for (const b of data.beats ?? []) {
    console.log(`  ${b.n}. ${b.beat}  [${b.band}]  ${b.marker ?? '—'}`)
    if (b.screen) console.log(`     SCREEN: ${b.screen}`)
    console.log(`     ${String(b.line).slice(0, 150)}`)
    for (const rh of (data.rehooks ?? []).filter((r: any) => r.after === b.n))
      console.log(`     ↳ REHOOK: ${rh.line}`)
  }
  console.log(`\nTAIL: ${data.tail}\n↻ ${data.loopsTo}`)
  console.log(`\nTEXT HOOK: ${data.textHook}`)

  const fl = check([data.caption, ...(data.beats ?? []).map((b: any) => b.line)].join('\n'))
  console.log(`\nFACT-LOCK: ${fl.clean ? 'CLEAN' : 'BANNED — ' + fl.banned.map((b: any) => b.name).join(', ')}`)
  console.log(warnings.length ? `\nWARNINGS:\n${warnings.map((w) => '  ⚠️  ' + w).join('\n')}` : '\nWARNINGS: none ✅')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
