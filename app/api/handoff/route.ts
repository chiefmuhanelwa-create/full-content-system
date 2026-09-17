/**
 * Tool-to-tool handoff. The chain is idea -> hook -> script -> teleprompter -> runsheet ->
 * carousel -> email, and nothing should be re-decided downstream.
 *
 * POST /api/handoff            — { fromTool, toTool, kind, payload }
 * GET  /api/handoff?tool=X     — unconsumed handoffs waiting for tool X
 * PUT  /api/handoff            — { id } mark consumed
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { fromTool, toTool, kind, payload } = await request.json()
  if (!fromTool || !toTool || !payload) {
    return NextResponse.json({ error: 'fromTool, toTool and payload are required' }, { status: 400 })
  }
  const h = await prisma!.handoff.create({
    data: { userId: OWNER, fromTool, toTool, kind: kind || 'idea', payload },
  })
  return NextResponse.json({ success: true, id: h.id, toTool,
    open: `/dashboard/${toTool}?handoff=${h.id}` })
}

export async function GET(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { searchParams } = new URL(request.url)
  const tool = searchParams.get('tool')
  const id = searchParams.get('id')

  if (id) {
    const one = await prisma!.handoff.findUnique({ where: { id } })
    return NextResponse.json({ handoff: one })
  }
  const rows = await prisma!.handoff.findMany({
    where: { userId: OWNER, consumed: false, ...(tool ? { toTool: tool } : {}) },
    orderBy: { createdAt: 'desc' }, take: 50,
  })
  return NextResponse.json({ count: rows.length, handoffs: rows })
}

export async function PUT(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const { id } = await request.json()
  await prisma!.handoff.update({ where: { id }, data: { consumed: true, consumedAt: new Date() } })
  return NextResponse.json({ success: true })
}
