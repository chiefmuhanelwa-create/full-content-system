import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ cards: [] })

    const cards = await db.contentPipeline.findMany({
      where: { userId: DEFAULT_USER_ID },
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

    await ensureDefaultUser()

    const body = await request.json()
    const {
      title, platform = 'instagram', icp = 'auto', status = 'idea',
      interestPeak = '', hook = '', visualHook = '', value = '', cta = '',
      rawFootageLink = '', scheduledFor,
    } = body

    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const card = await db.contentPipeline.create({
      data: {
        userId: DEFAULT_USER_ID,
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
  } catch (err: any) {
    // Prisma P2021 = table does not exist (schema not pushed to DB yet)
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return NextResponse.json({
        error: 'Pipeline table not set up. Go to supabase.com → restore project → run: npx prisma db push --accept-data-loss',
        code: 'DB_SCHEMA_MISSING',
      }, { status: 503 })
    }
    console.error('Pipeline POST error:', err)
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}
