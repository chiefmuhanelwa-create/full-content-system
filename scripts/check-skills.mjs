// Does every generator actually receive every skill it asks for? A dropped reference is
// silent in the output and loud in the result — this is how that gets caught.
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }

const src = fs.readFileSync('lib/skills.ts','utf8')
const budget = Number(src.match(/CHAR_BUDGET\s*=\s*(\d+)/)[1])
// Strip line comments FIRST. A quoted phrase inside a comment ("...gate and his own
// measured data...") otherwise parses as a slug and reports a false failure — which is
// exactly what this script exists to prevent, so it must not do it itself.
const block = src
  .slice(src.indexOf('const MODULE_SKILLS'), src.indexOf('const CHAR_BUDGET'))
  .split('\n')
  .map((l) => l.replace(/\/\/.*$/, ''))
  .join('\n')
const modules = {}
for (const m of block.matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
  modules[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1])
}

const db = new PrismaClient()
const rows = await db.skillDoc.findMany({ select: { slug: true, body: true } })
const size = new Map(rows.map(r => [r.slug, r.body.length]))

console.log(`budget ${budget.toLocaleString()} chars\n`)
console.log('MODULE'.padEnd(14), 'CHARS'.padStart(8), '  STATUS')
let bad = 0
for (const [mod, slugs] of Object.entries(modules)) {
  const missing = slugs.filter(s => !size.has(s))
  let spent = 0; const dropped = []
  for (const s of slugs) {
    const n = size.get(s) ?? 0
    if (spent + n > budget) { dropped.push(s); continue }
    spent += n
  }
  const problems = [
    ...missing.map(s => `NOT SEEDED: ${s}`),
    ...dropped.map(s => `DROPPED (over budget): ${s}`),
  ]
  if (problems.length) bad++
  console.log(mod.padEnd(14), String(spent).padStart(8), problems.length ? '  ⛔ ' + problems.join(' · ') : '  ok')
}
console.log(bad ? `\n⛔ ${bad} module(s) with problems` : '\n✅ every module receives every skill it asks for')
await db.$disconnect()
