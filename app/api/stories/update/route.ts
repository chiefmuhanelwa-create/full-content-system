import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'
import { DEFAULT_USER_ID } from '@/lib/ensure-user'

export async function PUT(req: Request) {
  const dbError = checkDatabase()
  if (dbError) return dbError

  try {
    const { id, title, content, storyType, category, isFavorite, beforeState, afterState } = await req.json()

    if (!id) return NextResponse.json({ error: 'Story ID required' }, { status: 400 })

    const existing = await db!.story.findFirst({ where: { id, userId: DEFAULT_USER_ID } })
    if (!existing) return NextResponse.json({ error: 'Story not found' }, { status: 404 })

    const story = await db!.story.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(storyType !== undefined && { storyType }),
        ...(category !== undefined && { category }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(beforeState !== undefined && { beforeState }),
        ...(afterState !== undefined && { afterState }),
      },
    })

    return NextResponse.json({ story })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update story' }, { status: 500 })
  }
}
