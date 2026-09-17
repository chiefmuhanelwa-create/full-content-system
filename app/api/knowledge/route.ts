/**
 * The modifiable spine. Doctrine is DATA here, not source code.
 *
 * GET    /api/knowledge          — every governance key, its value, and where it came from
 * PUT    /api/knowledge          — { key, value, note }  overwrite one key
 * PATCH  /api/knowledge          — { key, merge }        merge into an object/array key
 * POST   /api/knowledge          — import CSV/JSON/text into a key or an append-list
 *
 * Every write snapshots the previous value into ingest_logs, so a ledger that moves can be
 * traced to the import that moved it. That is the R132,500 lesson: the figure propagated
 * because nothing recorded where it entered.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { getGovernance, setKey, invalidate, OWNER } from '@/lib/governance'

export async function GET() {
  const gov = await getGovernance(true)
  const dbError = checkDatabase()
  let stored: any[] = []
  if (!dbError && prisma) {
    stored = await prisma.systemSetting.findMany({ where: { userId: OWNER }, orderBy: { key: 'asc' } })
  }
  const storedKeys = new Set(stored.map((s) => s.key))
  const keys = Object.keys(gov).filter((k) => !k.startsWith('_')).sort()

  return NextResponse.json({
    source: gov._source,
    keys: keys.map((k) => ({
      key: k,
      editable: true,
      origin: storedKeys.has(k) ? 'database' : 'fallback (never edited)',
      updatedAt: stored.find((s) => s.key === k)?.updatedAt ?? null,
      value: gov[k],
    })),
  })
}

export async function PUT(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { key, value, note } = await request.json()
  if (!key) return NextResponse.json({ error: 'key is required' }, { status: 400 })

  const gov = await getGovernance(true)
  const before = gov[key] ?? null
  await setKey(key, value, note ?? 'edit') // setKey writes the audit row

  return NextResponse.json({ success: true, key, previous: before, now: value,
    note: 'Live for every tool on its next read — no deploy, no restart.' })
}

export async function PATCH(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { key, merge } = await request.json()
  if (!key || merge === undefined) return NextResponse.json({ error: 'key and merge are required' }, { status: 400 })

  const gov = await getGovernance(true)
  const before = gov[key] ?? null
  let next: any

  if (Array.isArray(before)) {
    next = before.concat(Array.isArray(merge) ? merge : [merge])
  } else if (before && typeof before === 'object') {
    next = { ...before, ...merge }
  } else {
    next = merge
  }

  await setKey(key, next, 'merge')
  return NextResponse.json({ success: true, key, previous: before, now: next })
}

/** Minimal RFC-4180 CSV reader. Quoted fields containing commas broke a ledger once. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQ = false
      else field += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  if (!rows.length) return []
  const head = rows[0].map((h) => h.trim())
  return rows.slice(1).filter((r) => r.some((c) => c.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])))
}

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { key, format, content, mode = 'replace', note } = await request.json()
  if (!key || !content) return NextResponse.json({ error: 'key and content are required' }, { status: 400 })

  let parsed: any
  try {
    if (format === 'csv') parsed = parseCsv(content)
    else if (format === 'json') parsed = JSON.parse(content)
    else parsed = String(content).split('\n').map((l) => l.trim()).filter(Boolean)
  } catch (e: any) {
    return NextResponse.json({ error: `Could not parse ${format}: ${e.message}` }, { status: 400 })
  }

  const gov = await getGovernance(true)
  const before = gov[key] ?? null
  let next = parsed
  if (mode === 'append' && Array.isArray(before) && Array.isArray(parsed)) next = before.concat(parsed)
  if (mode === 'merge' && before && typeof before === 'object' && !Array.isArray(before)) next = { ...before, ...parsed }

  await setKey(key, next, `import:${format || 'paste'}`)
  const rows = Array.isArray(parsed) ? parsed.length : 1

  invalidate()
  return NextResponse.json({
    success: true, key, mode, rowsImported: rows,
    previewFirstRow: Array.isArray(parsed) ? parsed[0] : parsed,
    note: 'Every generator reads this on its next call.',
  })
}
