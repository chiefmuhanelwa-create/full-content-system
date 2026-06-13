import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    await db.batchPlan.deleteMany({
      where: { id: params.id, userId: session.user.id },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('batch-plans DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
