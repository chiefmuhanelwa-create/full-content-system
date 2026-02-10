import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform')
    const category = searchParams.get('category')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = {
      userId: DEFAULT_USER_ID,
    }

    if (platform) where.platform = platform
    if (category) where.category = category
    if (isFavorite === 'true') where.isFavorite = true

    const scripts = await db!.script.findMany({
      where,
      include: {
        hook: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('List scripts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}
