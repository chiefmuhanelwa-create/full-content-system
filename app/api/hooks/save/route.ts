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
  } catch (error) {
    console.error('Save hook error:', error)
    return NextResponse.json(
      { error: 'Failed to save hook' },
      { status: 500 }
    )
  }
}
