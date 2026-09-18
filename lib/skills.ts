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
 * PLAIN-SPEECH is now on every writing module. It was seeded all along and loaded by none
 * of them, which is why output kept using the industry word instead of the plain one.
 */
const MODULE_SKILLS: Record<string, string[]> = {
  hooks: [
    'new-scripting/SKILL',
    'new-scripting/references/HOOK-GATE',
    'new-scripting/references/VOICE',
    'nochill-script/references/PLAIN-SPEECH',
    'nochill-script/references/HOOK-BANK',
    'jatho-scripting/SKILL',   // borrowable mechanics, does NOT govern — see scripts above
  ],
  scripts: [
    'new-scripting/SKILL',
    'new-scripting/references/FORMATS',
    'new-scripting/references/VOICE',
    'nochill-script/references/PLAIN-SPEECH',
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
 * The replacement for buildSystemPrompt(module, icp).
 * Note there is no `icp` parameter: the ICP is ruled, singular, and read from the database.
 */
export async function buildGovernedSystemPrompt(
  module: string,
  opts: { pillar?: string; tier?: string; extra?: string } = {}
): Promise<{ system: string; skillsUsed: string[] }> {
  const [doctrine, skills] = await Promise.all([
    governanceForPrompt({ pillar: opts.pillar, tier: opts.tier }),
    skillsForModule(module),
  ])

  const system = [
    doctrine,
    skills.text,
    banListForPrompt(),
    opts.extra ?? '',
  ].filter(Boolean).join('\n\n---\n\n')

  return { system, skillsUsed: skills.used }
}
