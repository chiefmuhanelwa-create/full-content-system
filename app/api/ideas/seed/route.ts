/**
 * POST /api/ideas/seed — load the 250-idea bank.
 *
 * Idempotent by title: an idea already in the bank is skipped, never duplicated, so this
 * can be re-run safely after the seed file grows. Nothing already written by hand is
 * overwritten — the seed only ever inserts.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'
import { IDEA_BANK_SEED } from '@/lib/idea-bank-seed'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    await ensureDefaultUser()

    const existing = await db.contentIdea.findMany({
      where: { userId: DEFAULT_USER_ID },
      select: { title: true },
    })
    const have = new Set(existing.map((e) => e.title.toLowerCase()))

    const fresh = IDEA_BANK_SEED.filter((i) => !have.has(i.title.toLowerCase())).map((i) => ({
      userId: DEFAULT_USER_ID,
      title: i.title,
      pillar: i.pillar,
      sourceGroup: i.sourceGroup,
      tier: i.tier,
      starred: i.starred,
    }))

    if (fresh.length) {
      await db.contentIdea.createMany({ data: fresh })
    }

    return NextResponse.json({
      inserted: fresh.length,
      skipped: IDEA_BANK_SEED.length - fresh.length,
      total: existing.length + fresh.length,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Seed failed' }, { status: 500 })
  }
}
