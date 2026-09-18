// What each generator needs before the model is even called. Most "the model failed" errors
// are actually a missing seed — this says which, without spending a token.
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }

const db = new PrismaClient()
const rows = await db.systemSetting.findMany({ select: { key: true, value: true } })
const G = Object.fromEntries(rows.map(r => {
  let v = r.value
  if (typeof v === 'string') { try { v = JSON.parse(v) } catch {} }
  return [r.key, v]
}))

// generator -> the governance keys it reads before generating
const NEEDS = {
  'Hook Generator':      ['hook_library', 'fact_lock', 'cta_library'],
  'Script Writer':       ['script_principles', 'script_formats', 'fact_lock', 'pillars'],
  'Carousel':            ['cta_library', 'fact_lock', 'pillars'],
  'Email':               ['fact_lock', 'icp', 'voice'],
  'Batch Shoot':         ['pillars', 'fact_lock', 'voice'],
  'Brand Engine':        ['identity', 'voice'],
  'Shared generators':   ['algorithm', 'voice', 'fact_lock'],
  'Reel classify':       ['pillars'],
}

const nonEmpty = (v) => v != null && (Array.isArray(v) ? v.length : typeof v === 'object' ? Object.keys(v).length : String(v).length) > 0

let bad = 0
console.log('GENERATOR                 STATUS   MISSING')
for (const [tool, keys] of Object.entries(NEEDS)) {
  const missing = keys.filter(k => !nonEmpty(G[k]))
  if (missing.length) bad++
  console.log(`${tool.padEnd(25)} ${(missing.length ? 'BLOCKED' : 'ok').padEnd(8)} ${missing.join(', ') || '—'}`)
}

console.log('\nDEPTH CHECKS')
const hl = G.hook_library ?? {}
const cats = hl.categories ?? []
console.log(`  hook templates        ${cats.reduce((a, c) => a + (c.templates?.length ?? 0), 0)} across ${cats.length} categories`)
console.log(`  spoken/caption laws   ${hl.spokenHookLaw ? 'yes' : 'MISSING'} / ${hl.captionHookLaw ? 'yes' : 'MISSING'}`)
const live = (G.cta_library?.keywords ?? []).filter(k => k.status === 'live')
console.log(`  live CTA keywords     ${live.length ? live.map(k => k.k).join(', ') : 'NONE — every CTA will be orphaned (Article XI)'}`)
console.log(`  banned figures        ${(G.fact_lock?.banned ?? G.fact_lock?.rules ?? []).length || '?'}`)
const pil = Array.isArray(G.pillars) ? G.pillars : Object.values(G.pillars ?? {})
console.log(`  pillars               ${pil.length}`)

console.log('\nENV')
for (const k of ['ANTHROPIC_API_KEY','AI_MODEL_FAST','AI_MODEL_MAIN','DATABASE_URL','FB_PAGE_TOKEN','INSTAGRAM_ACCESS_TOKEN'])
  console.log(`  ${k.padEnd(24)} ${process.env[k] ? 'set' : 'MISSING'}`)

console.log(bad ? `\n${bad} generator(s) blocked on seed data.` : '\nNo generator is blocked on seed data.')
await db.$disconnect()
