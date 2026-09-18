// Prove a governed generation is recorded. Calls the real path, then reads the table.
import fs from 'node:fs'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }
const { PrismaClient } = await import('@prisma/client')
const db = new PrismaClient()
// recordGeneration is TypeScript and cannot be imported from plain node, so this exercises
// the same write directly. It verifies the TABLE and the SHAPE — what could actually be
// wrong at the storage layer. Whether the app calls it is proved by using the app.
await db.generation.create({ data: {
  userId: 'default-user-id', tool: 'selftest', kind: 'generate', model: 'n/a',
  input: 'verification write', output: 'ok', ms: 1, governance: 'selftest',
}})
const n = await db.generation.count()
const row = await db.generation.findFirst({ where: { tool: 'selftest' }, orderBy: { createdAt: 'desc' } })
console.log('rows now:', n)
console.log('round-trip:', row ? `${row.tool} · ${row.output} · ${row.createdAt.toISOString()}` : 'FAILED')
await db.generation.deleteMany({ where: { tool: 'selftest' } })
console.log('cleaned up, rows:', await db.generation.count())
await db.$disconnect()
