/**
 * GET /api/vault — everything produced, in one place.
 * Reads the real tables rather than a separate copy, so nothing can drift out of sync.
 *
 * The four original tables only ever held what somebody pressed SAVE on, which turned out to
 * be nothing at all. `generations` is written server-side at the moment of generation, so it
 * is the honest record — and it is what this page mostly shows now.
 *
 * GET /api/vault?tool=hooks  — filter to one tool
 * GET /api/vault?id=…        — one full output, for reading back
 */
import { NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

export async function GET(request: Request) {
  const dbError = checkDatabase(); if (dbError) return dbError

  const url = new URL(request.url)
  const one = url.searchParams.get('id')
  const toolFilter = url.searchParams.get('tool')

  if (one) {
    const g = await prisma!.generation.findUnique({ where: { id: one } })
    return NextResponse.json({ generation: g })
  }

  const [gens, tools, hooks, scripts, stories, shoots, hookBank, storyBank] = await Promise.all([
    prisma!.generation.findMany({
      where: { userId: OWNER, ...(toolFilter ? { tool: toolFilter } : {}) },
      orderBy: { createdAt: 'desc' }, take: 200,
      select: { id: true, tool: true, kind: true, model: true, pillar: true, tier: true,
                input: true, blocked: true, repaired: true, ms: true, ideaId: true,
                starred: true, createdAt: true },
    }),
    prisma!.generation.groupBy({ by: ['tool'], _count: true, where: { userId: OWNER } }),
    prisma!.hook.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.script.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.story.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.shootItem.findMany({ where: { userId: OWNER }, orderBy: { createdAt: 'desc' }, take: 60 }),
    prisma!.hookBank.count({ where: { userId: OWNER } }),
    prisma!.storyBankEntry.count({ where: { userId: OWNER } }),
  ])

  const items = [
    ...gens.map((g: any) => ({
      id: g.id, kind: g.tool, title: String(g.input ?? '').split('\n')[0].slice(0, 120) || g.tool,
      at: g.createdAt,
      meta: { model: g.model, pillar: g.pillar, tier: g.tier, blocked: g.blocked,
              repaired: g.repaired, ms: g.ms, ideaId: g.ideaId, generation: true },
    })),
    ...hooks.map((h: any) => ({ id: h.id, kind: 'hook', title: h.hookText ?? h.text ?? 'Hook', at: h.createdAt, meta: { platform: h.platform, score: h.score } })),
    ...scripts.map((s: any) => ({ id: s.id, kind: 'script', title: s.title ?? s.idea ?? 'Script', at: s.createdAt, meta: { platform: s.platform, duration: s.duration } })),
    ...stories.map((s: any) => ({ id: s.id, kind: 'story', title: s.title ?? 'Story', at: s.createdAt, meta: {} })),
    ...shoots.map((s: any) => ({ id: s.id, kind: 'shoot', title: s.spokenHook ?? s.idea, at: s.createdAt, meta: { pillar: s.pillar, status: s.status, verdict: s.verdict } })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  return NextResponse.json({
    total: items.length,
    generations: gens.length,
    tools: tools.map((t: any) => ({ tool: t.tool, count: t._count })).sort((a: any, b: any) => b.count - a.count),
    banks: { hookBank, storyBank },
    byKind: items.reduce((a: any, i) => ({ ...a, [i.kind]: (a[i.kind] || 0) + 1 }), {}),
    items: items.slice(0, 120),
  })
}
