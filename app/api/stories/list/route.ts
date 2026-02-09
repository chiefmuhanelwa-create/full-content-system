import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const storyType = searchParams.get('storyType')
    const category = searchParams.get('category')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = {
      userId: session.user.id,
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
