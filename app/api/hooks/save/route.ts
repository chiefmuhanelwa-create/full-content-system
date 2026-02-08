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
      content,
      topic,
      platform,
      duration,
      tone,
      hookType,
      category,
      isFavorite,
    } = await req.json()

    if (!content || !topic || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const hook = await db.hook.create({
      data: {
        userId: session.user.id,
        content,
        topic,
        platform,
        duration,
        tone,
        hookType,
        category,
        isFavorite: isFavorite || false,
      },
    })

    return NextResponse.json({ hook }, { status: 201 })
  } catch (error) {
    console.error('Save hook error:', error)
    return NextResponse.json(
      { error: 'Failed to save hook' },
      { status: 500 }
    )
  }
}
