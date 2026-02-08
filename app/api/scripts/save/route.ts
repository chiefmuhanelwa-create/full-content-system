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
      title,
      content,
      platform,
      duration,
      goal,
      breakdown,
      visuals,
      overlays,
      category,
      isFavorite,
      hookId,
    } = await req.json()

    if (!title || !content || !platform || !duration || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const script = await db.script.create({
      data: {
        userId: session.user.id,
        title,
        content,
        platform,
        duration,
        goal,
        breakdown: breakdown || null,
        visuals: visuals || null,
        overlays: overlays || null,
        category,
        isFavorite: isFavorite || false,
        hookId,
      },
    })

    return NextResponse.json({ script }, { status: 201 })
  } catch (error) {
    console.error('Save script error:', error)
    return NextResponse.json(
      { error: 'Failed to save script' },
      { status: 500 }
    )
  }
}
