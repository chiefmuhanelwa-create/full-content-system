import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const { searchParams } = new URL(req.url)
    const storyType = searchParams.get('storyType')
    const category = searchParams.get('category')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = {
      userId: DEFAULT_USER_ID,
    }

    if (storyType) where.storyType = storyType
    if (category) where.category = category
    if (isFavorite === 'true') where.isFavorite = true

    const stories = await db!.story.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('List stories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
