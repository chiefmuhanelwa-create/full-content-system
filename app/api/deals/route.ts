/**
 * Brand deals — the money and tax layer. Nothing in the estate tracked these anywhere,
 * which is why "was I paid?" has never been answerable without opening a bank statement.
 *
 * GET    /api/deals  — the pipeline, what is owed, and the SARS reserve on what ARRIVED
 * POST   /api/deals  — create
 * PUT    /api/deals  — update / log a chase
 *
 * The reserve is computed on RECEIVED money only. Reserving against invoiced or contracted
 * money is the same arithmetic error that produced R132,500.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER, getKey } from '@/lib/governance'

const RESERVE_RATE = 0.35 // Creator Finance V1, the 35% Rule

export async function GET() {
  const dbError = checkDatabase(); if (dbError) return dbError
  const deals = await prisma!.deal.findMany({ where: { userId: OWNER }, orderBy: { updatedAt: 'desc' } })

  const sum = (f: (d: any) => number | null | undefined) =>
    deals.reduce((a, d) => a + (f(d) ?? 0), 0)

  const received = sum((d) => d.receivedZar)
  const invoicedOutstanding = deals
    .filter((d) => d.status === 'invoiced')
    .reduce((a, d) => a + ((d.invoicedZar ?? 0) - (d.receivedZar ?? 0)), 0)
  const contracted = deals.filter((d) => d.status === 'contracted').reduce((a, d) => a + (d.contractedZar ?? 0), 0)

  const now = Date.now()
  const overdue = deals.filter(
    (d) => d.status === 'invoiced' && d.dueAt && new Date(d.dueAt).getTime() < now
  )

  const pricing = deals.filter((d) => d.quotedZar && d.quotedZar > 0).map((d) => d.quotedZar!)
  const spread = pricing.length > 1
    ? { low: Math.min(...pricing), high: Math.max(...pricing), ratio: +(Math.max(...pricing) / Math.min(...pricing)).toFixed(1) }
    : null

  return NextResponse.json({
    count: deals.length,
    money: {
      received,
      reserveOwed: +(received * RESERVE_RATE).toFixed(2),
      reserveRate: '35%',
      invoicedOutstanding,
      contracted,
      warning: 'received / invoiced / contracted are three different things. Never sum them. Say "I was contracted at" or "I invoiced" — never "I earned" — of an unconfirmed row.',
    },
    chase: {
      overdueCount: overdue.length,
      overdue: overdue.map((d) => ({ id: d.id, brand: d.brand, amount: d.invoicedZar, dueAt: d.dueAt })),
      evidence: 'C-0412 is E1: five chases in 18 months, and one uncovered a failed payment batch. Chasing works.',
    },
    leaks: {
      usageRightsCharged: deals.filter((d) => d.usageRights).length,
      travelCharged: deals.filter((d) => d.travelCharged).length,
      benchmark: 'In the intake of 25 creators, 9 charged travel and only 2 charged usage rights.',
      yourSpread: spread,
    },
    deals,
  })
}

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const b = await request.json()
  if (!b.brand) return NextResponse.json({ error: 'brand is required' }, { status: 400 })
  const d = await prisma!.deal.create({
    data: {
      userId: OWNER, brand: b.brand, agency: b.agency ?? null,
      deliverables: b.deliverables ?? null, status: b.status ?? 'lead',
      quotedZar: b.quotedZar ?? null, contractedZar: b.contractedZar ?? null,
      invoicedZar: b.invoicedZar ?? null, receivedZar: b.receivedZar ?? null,
      usageRights: !!b.usageRights, travelCharged: !!b.travelCharged, exclusivity: !!b.exclusivity,
      dueAt: b.dueAt ? new Date(b.dueAt) : null,
      reserveZar: b.receivedZar ? +(b.receivedZar * RESERVE_RATE).toFixed(2) : null,
      notes: b.notes ?? null,
    },
  })
  return NextResponse.json({ success: true, deal: d })
}

export async function PUT(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { id, chase, ...patch } = await request.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const existing = await prisma!.deal.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: any = { ...patch }
  for (const k of ['quotedAt', 'contractedAt', 'invoicedAt', 'receivedAt', 'dueAt']) {
    if (data[k]) data[k] = new Date(data[k])
  }
  if (data.receivedZar != null) data.reserveZar = +(data.receivedZar * RESERVE_RATE).toFixed(2)
  if (chase) {
    const log = Array.isArray(existing.chases) ? (existing.chases as any[]) : []
    data.chases = [...log, { at: new Date().toISOString(), note: chase }]
  }
  const d = await prisma!.deal.update({ where: { id }, data })
  return NextResponse.json({ success: true, deal: d })
}
