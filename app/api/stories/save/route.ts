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
      storyType,
      isSpecial,
      isRelevant,
      isQuantifiable,
      hasNames,
      beforeState,
      afterState,
      timeframe,
      metrics,
      category,
      isFavorite,
    } = await req.json()

    if (!title || !content || !storyType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure default user exists
    await ensureDefaultUser()

    const story = await db!.story.create({
      data: {
        userId: DEFAULT_USER_ID,
        title,
        content,
        storyType,
        isSpecial: isSpecial || false,
        isRelevant: isRelevant || false,
        isQuantifiable: isQuantifiable || false,
        hasNames: hasNames || false,
        beforeState,
        afterState,
        timeframe,
        metrics: metrics || null,
        category,
        isFavorite: isFavorite || false,
      },
    })

    return NextResponse.json({ story }, { status: 201 })
  } catch (error: any) {
    console.error('Save story error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save story' },
      { status: 500 }
    )
  }
}
