import dotenv from 'dotenv'
dotenv.config({ path: '.env' }); dotenv.config({ path: '.env.local', override: true })
import { getGovernance, setKey, normalisePillars } from '../lib/governance'
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const OWNER = 'default-user-id'

async function main() {
  console.log('A · EDIT A LEDGER VALUE, CONFIRM EVERY TOOL SEES IT')
  const before: any = (await getGovernance(true)).ledger_totals
  const origList = before?.list ?? before?.emailList ?? null
  await setKey('ledger_totals', { ...before, _probe: 'written-by-verification' })
  const after: any = (await getGovernance(true)).ledger_totals
  console.log('   wrote probe -> read back:', after._probe === 'written-by-verification' ? 'YES' : 'NO')
  delete after._probe
  await setKey('ledger_totals', after)
  const reverted: any = (await getGovernance(true)).ledger_totals
  console.log('   reverted cleanly:        ', reverted._probe === undefined ? 'YES' : 'NO')

  console.log('\nB · IMPORT A NEW KEY THAT NEVER EXISTED')
  await setKey('agency_patterns', [
    { pattern: 'Asks for your rate card BEFORE proposing a budget', effect: 'your number becomes the ceiling' },
    { pattern: 'Invoices through itself, not the brand', effect: 'you never see the real budget' },
    { pattern: 'Asks a competitor question', effect: 'exclusivity, taken free' },
  ], 'imported 2026-09-17')
  const g = await getGovernance(true)
  console.log('   agency_patterns rows:    ', (g.agency_patterns as any[])?.length)
  console.log('   survives a cold read:    ', (await db.systemSetting.findFirst({ where: { userId: OWNER, key: 'agency_patterns' } })) ? 'YES (in Postgres)' : 'NO')

  console.log('\nC · TOOL-TO-TOOL HANDOFF')
  const h = await db.handoff.create({
    data: { userId: OWNER, fromTool: 'hooks', toTool: 'scripts', kind: 'hook',
            payload: { hook: 'You are accepting R750 for brand deals worth R15,000', pillar: 'PRICE IT', tier: 'CORE' } },
  })
  const waiting = await db.handoff.findMany({ where: { userId: OWNER, toTool: 'scripts', consumed: false } })
  console.log('   handoff created, waiting for scripts:', waiting.length)
  await db.handoff.update({ where: { id: h.id }, data: { consumed: true, consumedAt: new Date() } })
  const left = await db.handoff.count({ where: { userId: OWNER, toTool: 'scripts', consumed: false } })
  console.log('   consumed, remaining:                ', left)

  console.log('\nD · WHAT IS STORED AND SURVIVES LOGOUT')
  for (const [label, n] of [
    ['system_settings (doctrine)', await db.systemSetting.count({ where: { userId: OWNER } })],
    ['skill_docs',                 await db.skillDoc.count({ where: { userId: OWNER } })],
    ['instagram_media',            await db.instagramMedia.count()],
    ['deals',                      await db.deal.count()],
    ['handoffs',                   await db.handoff.count()],
    ['ingest_logs (audit trail)',  await db.ingestLog.count()],
  ] as [string, number][]) console.log(`   ${label.padEnd(28)} ${n}`)

  console.log('\nE · AUDIT TRAIL — every change traceable to its import')
  const logs = await db.ingestLog.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 4 })
  for (const l of logs) console.log(`   ${l.source.padEnd(8)} -> ${l.target} (${l.rows} rows)`)

  await db.$disconnect()
}
main().catch(async e => { console.error('FAILED:', e.message); await db.$disconnect(); process.exit(1) })
