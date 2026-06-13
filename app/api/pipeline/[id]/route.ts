import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const body = await request.json()

    const existing = await db.contentPipeline.findFirst({
      where: { id: params.id, userId: session.user.id },
    })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const card = await db.contentPipeline.update({
      where: { id: params.id },
      data: {
        ...body,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : body.scheduledFor === null ? null : existing.scheduledFor,
        postedAt: body.postedAt ? new Date(body.postedAt) : body.postedAt === null ? null : existing.postedAt,
      },
    })

    return NextResponse.json({ card })
  } catch {
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const existing = await db.contentPipeline.findFirst({
      where: { id: params.id, userId: session.user.id },
    })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.contentPipeline.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}
