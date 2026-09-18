/**
 * Skill-aware prompt composition.
 *
 * Generators used to build their system prompt from lib/knowledge-base.ts — 2,038 hardcoded
 * lines carrying the retired Called Expert / ICP1 / ICP2 persona. This composes instead from:
 *   live governance (database)  +  the seeded .claude skills  +  the fact-lock ban list
 * so the app and the CLI teach the same thing, and updating doctrine is an edit, not a deploy.
 */

import { prisma } from '@/lib/db-helper'
import { OWNER, governanceForPrompt } from '@/lib/governance'
import { banListForPrompt } from '@/lib/fact-lock'

/**
 * Which skill documents each module carries. Order matters — the GOVERNING skill is first,
 * evidence and craft references after it.
 *
 * 🔴 `new-scripting` leads anything that writes. Its own standing ruling, 2026-09-15:
 *   "This is the scripting system. Not a second container... the one that governs."
 *   "Do not write a script to the eleven beats."
 *   "Where nochill-script/SKILL.md still names FW-147 as the canonical container, that
 *    file is out of date."
 *
 * It was absent from the database entirely until 2026-09-18 — it lives under
 * `ICP LEARNING/skills`, and the seeder only ever read ~/.claude/skills. So every script
 * this app produced ran on the superseded container and came out in a generic
 * Hook/Build/Rehook spine instead of one of the three ruled formats.
 *
 * PLAIN-SPEECH moved OUT of these bundles on 2026-09-18. Its law, the teaching-beat shape
 * and the worked example now sit in the doctrine block in lib/governance.ts, which every
 * call receives and no character budget can drop. It was in the bundles before that, where
 * a larger skill could silently push it out — which is exactly what happened when
 * new-scripting/SKILL (35k) landed. Do not add it back here; edit `plain_speech` in
 * Knowledge instead.
 */
const MODULE_SKILLS: Record<string, string[]> = {
  hooks: [
    'new-scripting/SKILL',
    'new-scripting/references/HOOK-GATE',
    'new-scripting/references/VOICE',
    'nochill-script/references/HOOK-BANK',
    'jatho-scripting/SKILL',   // borrowable mechanics, does NOT govern — see scripts above
  ],
  scripts: [
    'new-scripting/SKILL',
    // INTAKE is the gate BEFORE the hook: "this spine needs a method, not a feeling."
    // Without it, a thematic idea ("I want to talk about purpose") has no mechanism to run
    // on, and the model invents one to fill the gap — which is how a script came back
    // teaching "purpose · cost · the number", a three-part model that exists in no file.
    'new-scripting/references/INTAKE',
    'new-scripting/references/FORMATS',
    'new-scripting/references/VOICE',
    'nochill-script/references/VOICE-EVIDENCE',
    // Borrowable mechanics only. Its own header: "THIS SKILL DOES NOT GOVERN — every one
    // must clear new-scripting's gate and his own measured data before use." Loaded LAST
    // so new-scripting is read first and stays the container.
    'jatho-scripting/SKILL',
  ],
  stories:      ['new-scripting/SKILL', 'nochill-storytelling/SKILL', 'nochill-script/references/PLAIN-SPEECH', 'nochill-script/references/PROOF'],
  storytelling: ['new-scripting/SKILL', 'nochill-storytelling/SKILL', 'nochill-script/references/PLAIN-SPEECH'],
  captions:     ['new-scripting/SKILL', 'new-scripting/references/VOICE', 'nochill-script/references/PLAIN-SPEECH'],
  repurpose:    ['new-scripting/SKILL', 'new-scripting/references/FORMATS', 'nochill-script/references/PLAIN-SPEECH'],
  carousel:     ['nochill-carousel/SKILL', 'nochill-script/references/PLAIN-SPEECH', 'nochill-brand/SKILL'],
  email:        ['nochill-email/SKILL', 'nochill-script/references/PLAIN-SPEECH'],
  week:         ['nochill-week/SKILL'],
  edit:         ['nochill-edit/SKILL', 'nochill-edit/references/RETENTION-EVIDENCE', 'nochill-motion/SKILL'],
  products:     ['nochill-product-kit/SKILL', 'nochill-script/references/PLAIN-SPEECH'],
  pitch:        ['nochill-product-kit/SKILL', 'nochill-script/references/PLAIN-SPEECH'],
  fears:        ['nochill-brain/SKILL'],
  offers:       ['nochill-product-kit/SKILL', 'nochill-script/references/PLAIN-SPEECH'],
  visuals:      ['nochill-brand/SKILL', 'nochill-motion/SKILL'],
  runsheet:     ['nochill-edit/SKILL'],
}

// new-scripting/SKILL alone is ~35k chars and FORMATS another ~15k, so 60k dropped the
// plain-speech and voice references behind them — silently producing exactly the output
// this was meant to prevent.
//
// 100k is affordable because the doctrine block is now PROMPT-CACHED (lib/ai/governed.ts):
// a large stable prefix is paid for once and read back at about a tenth of the price on
// every call after. Cheap to be thorough, expensive to be wrong.
//
// Drops are still reported, never silent.
const CHAR_BUDGET = 100000

/** Pull seeded skill bodies for a module. Falls back to nothing rather than to stale text. */
export async function skillsForModule(module: string): Promise<{ text: string; used: string[] }> {
  const wanted = MODULE_SKILLS[module]
  if (!wanted?.length || !prisma) return { text: '', used: [] }

  const rows = await prisma.skillDoc.findMany({
    where: { userId: OWNER, slug: { in: wanted } },
    select: { slug: true, body: true },
  })
  if (!rows.length) return { text: '', used: [] }

  // Preserve the declared order, and stop before the prompt gets silly.
  const ordered = wanted.map((w) => rows.find((r) => r.slug === w)).filter(Boolean) as { slug: string; body: string }[]
  const used: string[] = []
  const dropped: string[] = []
  let text = '', spent = 0
  for (const r of ordered) {
    if (spent + r.body.length > CHAR_BUDGET) { dropped.push(r.slug); continue }
    text += `\n\n## SKILL — ${r.slug}\n\n${r.body}`
    spent += r.body.length
    used.push(r.slug)
  }
  if (dropped.length) console.warn(`[skills] budget exceeded, dropped: ${dropped.join(', ')}`)
  return { text, used }
}

/**
 * The global CLAUDE.md — the brain this whole system derives from.
 *
 * It is seeded as `global/CLAUDE` and was reaching no prompt at all: in the database,
 * loaded by nothing. Exactly what had happened to PLAIN-SPEECH.
 *
 * It is NOT a module skill. It leads every generation regardless of tool, so it is returned
 * separately and sent as the FIRST cached block — the most-shared prefix in the system, and
 * therefore the one that caches best.
 */
export async function brainDoc(): Promise<string> {
  if (!prisma) return ''
  try {
    const row = await prisma.skillDoc.findFirst({
      where: { userId: OWNER, slug: 'global/CLAUDE' },
      select: { body: true },
    })
    return row?.body ?? ''
  } catch {
    return ''   // a missing brain must not stop a generation; the doctrine still stands
  }
}

/**
 * The skills a module needs, ready to hand to generate().
 *
 * ⚠️ THIS RETURNS SKILLS ONLY — no doctrine, no ban list.
 *
 * It used to return all three glued together, and every caller passed that straight into
 * generate(), which ALSO prepends the doctrine and the ban list. So both were sent TWICE on
 * every single call, and the skills text — 88k chars on the scripts module — landed in the
 * uncacheable half of the prompt.
 *
 * generate() now composes: doctrine, ban list and skills are three separate CACHED blocks,
 * because all three are stable per module. Only the tool's own rules stay uncached.
 */
export async function buildGovernedSystemPrompt(
  module: string,
  opts: { pillar?: string; tier?: string; extra?: string } = {}
): Promise<{ skills: string; skillsUsed: string[] }> {
  const skills = await skillsForModule(module)
  const text = [skills.text, opts.extra ?? ''].filter(Boolean).join('\n\n---\n\n')
  return { skills: text, skillsUsed: skills.used }
}
