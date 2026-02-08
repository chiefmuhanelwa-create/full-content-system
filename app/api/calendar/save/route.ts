import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      date,
      title,
      description,
      category,
      platform,
      scriptId,
      hookId,
      status,
    } = await req.json()

    if (!date || !title || !category || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const calendarEntry = await db.calendarEntry.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        title,
        description,
        category,
        platform,
        scriptId,
        hookId,
        status: status || 'planned',
      },
    })

    return NextResponse.json({ calendarEntry }, { status: 201 })
  } catch (error) {
    console.error('Save calendar entry error:', error)
    return NextResponse.json(
      { error: 'Failed to save calendar entry' },
      { status: 500 }
    )
  }
}
