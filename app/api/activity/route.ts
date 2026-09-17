/**
 * GET /api/activity — what actually happened, newest first.
 * Merges the tool activity log with the governance audit trail, so "what changed" and
 * "what did I make" read as one history rather than two.
 */
import { NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

export async function GET() {
  const dbError = checkDatabase(); if (dbError) return dbError

  const [acts, ingests] = await Promise.all([
    prisma!.activityLog.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 120 }),
    prisma!.ingestLog.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
  ])

  const rows = [
    ...acts.map((a) => ({
      at: a.createdAt, kind: a.entityType, action: a.action,
      text: a.description ?? `${a.action} ${a.entityType}`,
      meta: a.metadata as any, source: 'tool',
    })),
    ...ingests.map((i) => ({
      at: i.createdAt, kind: 'governance', action: i.source,
      text: i.summary ?? `${i.source} → ${i.target}`,
      meta: { target: i.target, rows: i.rows }, source: 'data',
    })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  const byKind: Record<string, number> = {}
  for (const r of rows) byKind[r.kind] = (byKind[r.kind] || 0) + 1

  const weekAgo = Date.now() - 7 * 864e5
  return NextResponse.json({
    count: rows.length,
    thisWeek: rows.filter((r) => +new Date(r.at) > weekAgo).length,
    byKind,
    rows: rows.slice(0, 100),
  })
}
