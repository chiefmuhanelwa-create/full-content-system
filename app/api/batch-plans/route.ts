import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ plans: [] })
    if (!db) return NextResponse.json({ plans: [] })

    const plans = await db.batchPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        seriesName: true,
        niche: true,
        platform: true,
        targetICP: true,
        createdAt: true,
        plan: true,
        weeklyArcs: true,
        compliance: true,
        leadMagnet: true,
        goals: true,
      },
    })

    return NextResponse.json({ plans })
  } catch (err) {
    console.error('batch-plans GET error:', err)
    return NextResponse.json({ plans: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const body = await request.json()
    const { name, seriesName, leadMagnet, niche, goals, platform, targetICP, plan, weeklyArcs, compliance } = body

    if (!plan || !Array.isArray(plan) || plan.length === 0) {
      return NextResponse.json({ error: 'Plan array required' }, { status: 400 })
    }

    const saved = await db.batchPlan.create({
      data: {
        userId: session.user.id,
        name: name || `Plan — ${new Date().toLocaleDateString()}`,
        seriesName: seriesName || '',
        leadMagnet: leadMagnet || '',
        niche: niche || '',
        goals: goals || '',
        platform: platform || 'instagram',
        targetICP: targetICP || '',
        plan,
        weeklyArcs: weeklyArcs || [],
        compliance: compliance || {},
      },
    })

    return NextResponse.json({ id: saved.id })
  } catch (err) {
    console.error('batch-plans POST error:', err)
    return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
  }
}
