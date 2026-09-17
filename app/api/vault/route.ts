/**
 * GET /api/vault — everything produced, in one place.
 * Reads the real tables rather than a separate copy, so nothing can drift out of sync.
 */
import { NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

export async function GET() {
  const dbError = checkDatabase(); if (dbError) return dbError

  const [hooks, scripts, stories, shoots, hookBank, storyBank] = await Promise.all([
    prisma!.hook.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.script.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.story.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.shootItem.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.hookBank.count({ where: { userId: OWNER } }),
    prisma!.storyBankEntry.count({ where: { userId: OWNER } }),
  ])

  const items = [
    ...hooks.map((h: any) => ({ id: h.id, kind: 'hook', title: h.hookText ?? h.text ?? 'Hook', at: h.createdAt, meta: { platform: h.platform, score: h.score } })),
    ...scripts.map((s: any) => ({ id: s.id, kind: 'script', title: s.title ?? s.idea ?? 'Script', at: s.createdAt, meta: { platform: s.platform, duration: s.duration } })),
    ...stories.map((s: any) => ({ id: s.id, kind: 'story', title: s.title ?? 'Story', at: s.createdAt, meta: {} })),
    ...shoots.map((s: any) => ({ id: s.id, kind: 'shoot', title: s.spokenHook ?? s.idea, at: s.createdAt, meta: { pillar: s.pillar, status: s.status, verdict: s.verdict } })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  return NextResponse.json({
    total: items.length,
    banks: { hookBank, storyBank },
    byKind: items.reduce((a: any, i) => ({ ...a, [i.kind]: (a[i.kind] || 0) + 1 }), {}),
    items: items.slice(0, 120),
  })
}
