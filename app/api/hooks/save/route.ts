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

    // Ensure default user exists
    await ensureDefaultUser()

    const hook = await db!.hook.create({
      data: {
        userId: DEFAULT_USER_ID,
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
  } catch (error: any) {
    console.error('Save hook error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save hook' },
      { status: 500 }
    )
  }
}
