import dotenv from 'dotenv'
dotenv.config({ path: '.env' }); dotenv.config({ path: '.env.local', override: true })
import fs from 'fs'; import path from 'path'
import { getGovernance, governanceForPrompt } from '../lib/governance'
import { banListForPrompt } from '../lib/fact-lock'
import { buildGovernedSystemPrompt } from '../lib/skills'

async function main() {
  // 1. register honesty
  const src = fs.readFileSync('app/api/features/route.ts', 'utf8')
  const declared = Array.from(src.matchAll(/^  '([a-z0-9-]+)':\s*\{/gm)).map(m => m[1])
  const onDisk = fs.readdirSync('app/dashboard', { withFileTypes: true })
    .filter(e => e.isDirectory() && fs.existsSync(path.join('app/dashboard', e.name, 'page.tsx')))
    .map(e => e.name)
  const ghosts = declared.filter(d => !onDisk.includes(d))
  const unlisted = onDisk.filter(d => !declared.includes(d))
  console.log('1 · FEATURE REGISTER')
  console.log('   declared:', declared.length, '· on disk:', onDisk.length)
  console.log('   advertised but MISSING:', ghosts.length ? ghosts.join(', ') : 'none')
  console.log('   on disk, not yet described:', unlisted.length ? unlisted.join(', ') : 'none')

  // 2. algorithm reached
  const g = await getGovernance(true)
  console.log('\n2 · ALGORITHM IN THE DATABASE')
  const keys = ['hook_library','rehook','script_principles','script_formats','cta_library','ips','identity','agency_intel','kpi_model']
  for (const k of keys) {
    const v: any = g[k]
    let n = ''
    if (k === 'hook_library') n = `${v.categories.length} categories, ${v.categories.reduce((a: number, c: any) => a + c.templates.length, 0)} templates`
    else if (k === 'ips') n = `${v.register.length} named IPs`
    else if (k === 'cta_library') n = `${v.keywords.length} keywords, ${v.keywords.filter((x: any)=>x.status==='live').length} live`
    else if (k === 'identity') n = `${v.values.length} values · "${v.message}"`
    else if (k === 'agency_intel') n = `${v.fourRules.length} rules of the room, ${v.patterns.length} patterns`
    else if (k === 'rehook') n = `${v.phrases.length} phrases, ${v.cadence.length} cadences`
    else if (k === 'script_formats') n = v.formats.map((f: any)=>f.key).join('/')
    else n = 'ok'
    console.log(`   ${k.padEnd(19)} ${v ? n : 'MISSING'}`)
  }

  // 3. does it reach a prompt
  const { skills, skillsUsed } = await buildGovernedSystemPrompt('scripts', { pillar: 'PRICE IT', tier: 'CORE' })
  const doctrine = await governanceForPrompt({ pillar: 'PRICE IT', tier: 'CORE' })
  const system = [doctrine, banListForPrompt(), skills].filter(Boolean).join('\n\n---\n\n')
  console.log('\n3 · REACHES THE GENERATOR')
  console.log('   system prompt:', system.length.toLocaleString(), 'chars ·', skillsUsed.length, 'skill docs')
  console.log('   PII leaked (agency contact)?', /@\w+\.co\.za|@\w+\.com/.test(system) ? 'YES — LEAK' : 'no')
  await (await import('@prisma/client')).PrismaClient && 0
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
