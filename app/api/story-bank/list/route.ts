import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const storyKey = searchParams.get('storyKey')
    const isQuantifiable = searchParams.get('isQuantifiable')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: DEFAULT_USER_ID }
    if (storyKey) where.storyKey = storyKey
    if (isQuantifiable !== null) where.isQuantifiable = isQuantifiable === 'true'
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    const stories = await prisma!.storyBankEntry.findMany({
      where,
      orderBy: [
        { isFavorite: 'desc' },
        { avgImpact: 'desc' },
        { timesUsed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ success: true, stories })
  } catch (error: any) {
    console.error('Story bank list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
