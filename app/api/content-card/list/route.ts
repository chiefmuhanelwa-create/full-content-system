import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const contentPillar = searchParams.get('contentPillar')
    const audienceLevel = searchParams.get('audienceLevel')
    const isFavorite = searchParams.get('isFavorite')

    // Build where clause
    const where: any = {
      userId: DEFAULT_USER_ID
    }

    if (platform) where.platform = platform
    if (status) where.status = status
    if (contentPillar) where.contentPillar = contentPillar
    if (audienceLevel) where.audienceLevel = audienceLevel
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    // Fetch content cards
    const contentCards = await prisma!.contentCard.findMany({
      where,
      orderBy: [
        { isFavorite: 'desc' },
        { publishDate: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        product: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get statistics
    const stats = {
      total: contentCards.length,
      byPlatform: await prisma!.contentCard.groupBy({
        by: ['platform'],
        where: { userId: DEFAULT_USER_ID },
        _count: true
      }),
      byStatus: await prisma!.contentCard.groupBy({
        by: ['status'],
        where: { userId: DEFAULT_USER_ID },
        _count: true
      }),
      byPillar: await prisma!.contentCard.groupBy({
        by: ['contentPillar'],
        where: { userId: DEFAULT_USER_ID },
        _count: true
      })
    }

    return NextResponse.json({
      success: true,
      contentCards,
      stats
    })
  } catch (error: any) {
    console.error('Content card list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content cards' },
      { status: 500 }
    )
  }
}
