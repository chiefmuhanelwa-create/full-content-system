// Which tools have ever been used? Row counts per table, from the live database.
// "Query the live system before asserting a commercial fact."
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }

const db = new PrismaClient()
const models = Object.keys(db).filter(k => !k.startsWith('_') && !k.startsWith('$') && typeof db[k]?.count === 'function')
const rows = []
for (const m of models) {
  try { rows.push([m, await db[m].count()]) } catch { rows.push([m, -1]) }
}
rows.sort((a,b) => a[1] - b[1])
console.log('TABLE'.padEnd(26), 'ROWS')
for (const [m,c] of rows) console.log(m.padEnd(26), c < 0 ? 'error' : c)
console.log('\nEMPTY (never used):', rows.filter(r => r[1] === 0).map(r => r[0]).join(', ') || 'none')
await db.$disconnect()
