import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function POST(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
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

    const script = await db!.script.create({
      data: {
        userId: DEFAULT_USER_ID,
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
