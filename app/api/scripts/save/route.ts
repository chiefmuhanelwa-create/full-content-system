import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'
import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'

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

    // Ensure default user exists
    await ensureDefaultUser()

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
  } catch (error: any) {
    console.error('Save script error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save script' },
      { status: 500 }
    )
  }
}
