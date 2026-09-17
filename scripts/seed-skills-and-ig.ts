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
const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills')
const WANTED = ['nochill-brain','nochill-script','nochill-storytelling','nochill-edit','nochill-week','nochill-email','nochill-brand','nochill-carousel','nochill-product-kit','nochill-claim-check','nochill-ops','nochill-curriculum']

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

async function main() {
  let n = 0, chars = 0
  const missing: string[] = []
  for (const skill of WANTED) {
    const base = path.join(SKILLS_DIR, skill)
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
