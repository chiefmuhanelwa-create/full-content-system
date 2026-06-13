import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ cards: [] })

    const cards = await db.contentPipeline.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cards })
  } catch {
    return NextResponse.json({ cards: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const body = await request.json()
    const {
      title, platform = 'instagram', icp = 'auto', status = 'idea',
      interestPeak = '', hook = '', visualHook = '', value = '', cta = '',
      rawFootageLink = '', scheduledFor,
    } = body

    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const card = await db.contentPipeline.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        platform,
        icp,
        status,
        interestPeak,
        hook,
        visualHook,
        value,
        cta,
        rawFootageLink,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    })

    return NextResponse.json({ card })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}
