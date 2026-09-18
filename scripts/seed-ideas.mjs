import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'

// load DATABASE_URL / DIRECT_URL from .env (node does not do this itself)
for (const f of ['.env', '.env.local']) {
  if (!fs.existsSync(f)) continue
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const s = line.trim()
    if (!s || s.startsWith('#') || !s.includes('=')) continue
    const [k, ...r] = s.split('=')
    const v = r.join('=').trim().replace(/^["']|["']$/g, '')
    if (!process.env[k.trim()]) process.env[k.trim()] = v
  }
}

// Anchor past the "=", not on the first "[" — the type annotation `SeedIdea[]` sits
// between the name and the array and its bracket would win.
const src = fs.readFileSync('lib/idea-bank-seed.ts', 'utf8')
const eq = src.indexOf('=', src.indexOf('IDEA_BANK_SEED'))
const seed = JSON.parse(src.slice(src.indexOf('[', eq), src.lastIndexOf(']') + 1))

const db = new PrismaClient()
const USER = 'default-user-id'

const u = await db.user.findUnique({ where: { id: USER } })
if (!u) {
  await db.user.create({ data: { id: USER, name: 'NoChill', email: 'owner@nochill.local' } })
  console.log('created default user')
}

const have = new Set((await db.contentIdea.findMany({ where: { userId: USER }, select: { title: true } }))
  .map(x => x.title.toLowerCase()))

const fresh = seed.filter(i => !have.has(i.title.toLowerCase()))
  .map(i => ({ userId: USER, title: i.title, pillar: i.pillar, sourceGroup: i.sourceGroup, tier: i.tier, starred: i.starred }))

if (fresh.length) await db.contentIdea.createMany({ data: fresh })

const total = await db.contentIdea.count({ where: { userId: USER } })
const byPillar = await db.contentIdea.groupBy({ by: ['pillar'], _count: true, where: { userId: USER } })
console.log(`inserted ${fresh.length}, skipped ${seed.length - fresh.length}, total ${total}`)
byPillar.forEach(p => console.log(`  ${p.pillar.padEnd(18)} ${p._count}`))
await db.$disconnect()
