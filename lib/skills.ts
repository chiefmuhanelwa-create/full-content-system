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

/** Which skill documents each module should carry. Order matters — most specific last. */
const MODULE_SKILLS: Record<string, string[]> = {
  hooks:        ['nochill-script/SKILL', 'nochill-script/references/HOOK-BANK', 'nochill-script/references/VOICE-EVIDENCE'],
  scripts:      ['nochill-script/SKILL', 'nochill-script/references/ARCHITECTURES', 'nochill-script/references/SHORT-FORM', 'nochill-script/references/VOICE-EVIDENCE'],
  stories:      ['nochill-storytelling/SKILL', 'nochill-script/references/PROOF'],
  storytelling: ['nochill-storytelling/SKILL'],
  carousel:     ['nochill-carousel/SKILL', 'nochill-brand/SKILL'],
  email:        ['nochill-email/SKILL'],
  week:         ['nochill-week/SKILL'],
  edit:         ['nochill-edit/SKILL', 'nochill-edit/references/RETENTION-EVIDENCE'],
  products:     ['nochill-product-kit/SKILL'],
  pitch:        ['nochill-product-kit/SKILL'],
  fears:        ['nochill-brain/SKILL'],
}

// nochill-script/SKILL alone is ~17k chars. A budget of 18k silently dropped every
// reference behind it, which is worse than a long prompt — the references carry the
// measured mechanics. Budget is per-module and drops are reported, never silent.
const CHAR_BUDGET = 60000

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
