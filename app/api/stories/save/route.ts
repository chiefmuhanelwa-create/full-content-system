import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export async function POST(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

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

    const story = await db!.story.create({
      data: {
        userId: session.user.id,
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
  } catch (error) {
    console.error('Save story error:', error)
    return NextResponse.json(
      { error: 'Failed to save story' },
      { status: 500 }
    )
  }
}
