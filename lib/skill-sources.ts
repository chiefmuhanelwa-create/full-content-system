/**
 * Where the skills live, and which ones get seeded. ONE list, read by both seeders.
 *
 * There were two: `scripts/seed-skills-and-ig.ts` knew about the second root and listed
 * `new-scripting`, and `app/api/skills/seed/route.ts` did neither. So seeding by script gave
 * you the governing scripting system and seeding by endpoint silently gave you a database
 * without it — the same output, two different meanings, and nothing to tell them apart.
 *
 * Roots are searched IN ORDER and the first one holding a skill wins, so a home-directory
 * copy still overrides a project copy if one is ever added.
 */

import fs from 'fs/promises'
import path from 'path'
import os from 'os'

export const SKILL_ROOTS = [
  path.join(os.homedir(), '.claude', 'skills'),
  // `new-scripting` — which its own 2026-09-15 ruling calls "THE scripting system... the one
  // that governs" — lives here, not in the home directory.
  path.join(os.homedir(), 'Desktop', 'VS code', 'ICP LEARNING', 'skills'),
]

export const WANTED = [
  'new-scripting', 'jatho-scripting', 'nochill-motion',
  'nochill-brain', 'nochill-script', 'nochill-storytelling', 'nochill-edit',
  'nochill-week', 'nochill-email', 'nochill-brand', 'nochill-carousel',
  'nochill-product-kit', 'nochill-claim-check', 'nochill-ops', 'nochill-curriculum',
]

/** Which root actually holds this skill, or null if none does. */
export async function rootFor(skill: string): Promise<string | null> {
  for (const r of SKILL_ROOTS) {
    try { await fs.access(path.join(r, skill)); return r } catch {}
  }
  return null
}

/** Every .md under a directory, recursively. */
export async function walkMarkdown(dir: string): Promise<string[]> {
  const out: string[] = []
  let entries: any[] = []
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walkMarkdown(p)))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}
