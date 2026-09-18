/**
 * Seeds the .claude skills into skill_docs and verifies the governance chain.
 * Run: npx tsx scripts/seed-skills-and-ig.ts
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const prisma = new PrismaClient()
const OWNER = 'default-user-id'
/**
 * Skills do not all live in ~/.claude/skills.
 *
 * `new-scripting` — which its own 2026-09-15 ruling calls "THE scripting system... the one
 * that governs" — lives under `ICP LEARNING/skills`, so a seeder that only read the home
 * directory could never see it. It was missing from the database entirely, and every script
 * the app generated was therefore built on nochill-script, which that same ruling says is
 * "out of date" on the container it names.
 *
 * Roots are searched in order; the FIRST one holding a skill wins, so a home-directory copy
 * still overrides a project copy if one is ever added.
 */
const SKILL_ROOTS = [
  path.join(os.homedir(), '.claude', 'skills'),
  path.join(os.homedir(), 'Desktop', 'VS code', 'ICP LEARNING', 'skills'),
]
const SKILLS_DIR = SKILL_ROOTS[0]
const WANTED = ['new-scripting','jatho-scripting','nochill-motion','nochill-brain','nochill-script','nochill-storytelling','nochill-edit','nochill-week','nochill-email','nochill-brand','nochill-carousel','nochill-product-kit','nochill-claim-check','nochill-ops','nochill-curriculum']

/** Where does this skill actually live? */
async function rootFor(skill: string): Promise<string | null> {
  for (const r of SKILL_ROOTS) {
    try { await fs.access(path.join(r, skill)); return r } catch {}
  }
  return null
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  let entries: any[] = []
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

/**
 * The global CLAUDE.md is the brain the whole system generates from, and it is NOT under any
 * skills directory — so the walk above cannot see it. It was seeded only by the API route,
 * which meant editing the file left the database stale and every generation kept running on
 * the old brain.
 */
async function seedBrain() {
  const brainPath = path.join(os.homedir(), '.claude', 'CLAUDE.md')
  let body = ''
  try { body = await fs.readFile(brainPath, 'utf8') } catch { return null }
  await prisma.skillDoc.upsert({
    where: { userId_slug: { userId: OWNER, slug: 'global/CLAUDE' } },
    create: { userId: OWNER, slug: 'global/CLAUDE', title: 'Global CLAUDE.md — the brain',
              path: brainPath, body, section: 'SKILL', tokens: Math.ceil(body.length / 4) },
    update: { title: 'Global CLAUDE.md — the brain', path: brainPath, body,
              tokens: Math.ceil(body.length / 4) },
  })
  return body.length
}

async function main() {
  const brainChars = await seedBrain()
  console.log(brainChars
    ? `  brain: global/CLAUDE re-seeded · ${brainChars.toLocaleString()} chars`
    : '  brain: ~/.claude/CLAUDE.md not found — SKIPPED')

  let n = 0, chars = 0
  const missing: string[] = []
  for (const skill of WANTED) {
    const root = await rootFor(skill)
    if (!root) { missing.push(skill); continue }
    const base = path.join(root, skill)
    const files = await walk(base)
    if (!files.length) { missing.push(skill); continue }
    for (const f of files) {
      const rel = path.relative(base, f)
      const body = await fs.readFile(f, 'utf8')
      const slug = `${skill}/${rel}`.replace(/\.md$/, '')
      const title = (body.match(/^#\s+(.+)$/m) || [])[1] || rel
      const section = rel.toUpperCase().startsWith('SKILL') ? 'SKILL' : 'reference'
      await prisma.skillDoc.upsert({
        where: { userId_slug: { userId: OWNER, slug } },
        create: { userId: OWNER, slug, title, path: f, body, section, tokens: Math.ceil(body.length/4) },
        update: { title, path: f, body, section, tokens: Math.ceil(body.length/4) },
      })
      n++; chars += body.length
    }
  }
  console.log(`  seeded ${n} skill documents · ${chars.toLocaleString()} chars`)
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`)

  const bySkill = await prisma.skillDoc.groupBy({ by: ['slug'], where: { userId: OWNER }, _count: true })
  const grouped: Record<string, number> = {}
  for (const r of bySkill) { const k = r.slug.split('/')[0]; grouped[k] = (grouped[k]||0)+1 }
  console.log('  ' + Object.entries(grouped).map(([k,v])=>`${k}:${v}`).join(' · '))

  // The prompt-critical ones lib/skills.ts asks for by exact slug
  const critical = ['nochill-script/SKILL','nochill-script/references/HOOK-BANK','nochill-script/references/VOICE-EVIDENCE','nochill-script/references/ARCHITECTURES','nochill-storytelling/SKILL','nochill-week/SKILL']
  console.log('\n  slugs lib/skills.ts requests:')
  for (const c of critical) {
    const hit = await prisma.skillDoc.findFirst({ where: { userId: OWNER, slug: c } })
    console.log(`    ${hit ? 'OK  ' : 'MISS'} ${c}${hit ? ` (${hit.body.length} chars)` : ''}`)
  }
  await prisma.$disconnect()
}
main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
