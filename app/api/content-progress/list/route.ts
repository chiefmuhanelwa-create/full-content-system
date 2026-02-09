import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession()
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma!.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const fourETag = searchParams.get('fourETag')
    const awarenessLevel = searchParams.get('awarenessLevel')
    const isPriority = searchParams.get('isPriority')
    const isArchived = searchParams.get('isArchived')
    const contentType = searchParams.get('contentType')

    // Build where clause
    const where: any = {
      userId: user.id
    }

    if (stage) where.stage = stage
    if (fourETag) where.fourETag = fourETag
    if (awarenessLevel) where.awarenessLevel = awarenessLevel
    if (isPriority !== null) where.isPriority = isPriority === 'true'
    if (isArchived !== null) where.isArchived = isArchived === 'true'
    if (contentType) where.contentType = contentType

    // Fetch content progress items
    const contentProgress = await prisma!.contentProgress.findMany({
      where,
      orderBy: [
        { isPriority: 'desc' },
        { scheduledFor: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get stage statistics
    const stageCounts = await prisma!.contentProgress.groupBy({
      by: ['stage'],
      where: {
        userId: user.id,
        isArchived: false
      },
      _count: true
    })

    // Get 4E tag statistics
    const fourECounts = await prisma!.contentProgress.groupBy({
      by: ['fourETag'],
      where: {
        userId: user.id,
        isArchived: false
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      contentProgress,
      stats: {
        byStage: stageCounts.reduce((acc: any, item) => {
          acc[item.stage] = item._count
          return acc
        }, {}),
        byFourE: fourECounts.reduce((acc: any, item) => {
          acc[item.fourETag] = item._count
          return acc
        }, {}),
        total: contentProgress.length
      }
    })
  } catch (error: any) {
    console.error('Content progress list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content progress' },
      { status: 500 }
    )
  }
}
