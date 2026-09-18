/**
 * GET    /api/ideas   — the whole bank, newest edits first
 * POST   /api/ideas   — add one idea by hand
 * PATCH  /api/ideas   — update one idea (status, hook, script, schedule…)
 * DELETE /api/ideas?id=…  — remove one
 *
 * The bank is inventory. The 30/25/20/15/10 pillar weighting is enforced by what gets
 * SCHEDULED, not by what sits in the bank — so nothing here rations by pillar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'

const STATUSES = ['idea', 'draft', 'script', 'shoot', 'edit', 'schedule', 'posted', 'parked']
const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ ideas: [], seeded: false })

    const ideas = await db.contentIdea.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: [{ starred: 'desc' }, { updatedAt: 'desc' }],
    })

    // Close the loop: an idea that became a post carries its live numbers back.
    // Metrics are JOINED, never copied onto the idea, so there is one source of truth
    // and the bank can never drift out of step with the tracker.
    const linked = ideas.map((i) => i.mediaId).filter(Boolean) as string[]
    const perf = linked.length
      ? await db.instagramMedia.findMany({
          where: { mediaId: { in: linked } },
          select: {
            mediaId: true, permalink: true, thumbnailUrl: true, mediaUrl: true,
            likeCount: true, commentsCount: true, reach: true, views: true,
            engagementRate: true, postedAt: true,
          },
        })
      : []
    const byMedia = new Map(perf.map((p) => [p.mediaId, p]))

    return NextResponse.json({
      ideas: ideas.map((i) => ({ ...i, performance: i.mediaId ? byMedia.get(i.mediaId) ?? null : null })),
      seeded: ideas.length > 0,
    })
  } catch {
    return NextResponse.json({ ideas: [], seeded: false })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    await ensureDefaultUser()
    const body = await request.json()
    const title = String(body.title ?? '').trim()
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const pillar = PILLARS.includes(body.pillar) ? body.pillar : 'KEEP IT'

    const idea = await db.contentIdea.create({
      data: {
        userId: DEFAULT_USER_ID,
        title,
        pillar,
        sourceGroup: String(body.sourceGroup ?? 'Added by hand'),
        tier: String(body.tier ?? 'CORE'),
        painPoint: String(body.painPoint ?? ''),
        cta: String(body.cta ?? ''),
      },
    })

    return NextResponse.json({ idea })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Create failed' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const body = await request.json()
    const id = String(body.id ?? '')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Only these may be written, so a stray key cannot rewrite the pillar map.
    const allowed = [
      'title', 'pillar', 'tier', 'status', 'format', 'spokenHook', 'captionOpener',
      'painPoint', 'cta', 'script', 'notes', 'storyId', 'evidence', 'factlock', 'starred',
      'mediaId',
    ] as const

    const data: Record<string, unknown> = {}
    for (const k of allowed) {
      if (k in body) data[k] = body[k]
    }
    if (data.pillar && !PILLARS.includes(String(data.pillar))) delete data.pillar
    if (data.status && !STATUSES.includes(String(data.status))) delete data.status

    if ('scheduledFor' in body) {
      data.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null
    }
    // Moving a card to "posted" stamps the date once; moving it back clears it.
    if (data.status === 'posted') data.postedAt = new Date()
    if (data.status && data.status !== 'posted') data.postedAt = null

    const idea = await db.contentIdea.update({
      where: { id },
      data,
    })

    return NextResponse.json({ idea })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const id = request.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await db.contentIdea.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Delete failed' }, { status: 500 })
  }
}
