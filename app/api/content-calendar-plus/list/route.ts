import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function GET(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma!.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const contentPillar = searchParams.get('contentPillar')
    const fourETag = searchParams.get('fourETag')
    const platform = searchParams.get('platform')
    const isPriority = searchParams.get('isPriority')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { userId: user.id }
    if (status) where.status = status
    if (contentPillar) where.contentPillar = contentPillar
    if (fourETag) where.fourETag = fourETag
    if (platform) where.platform = platform
    if (isPriority !== null) where.isPriority = isPriority === 'true'

    if (startDate || endDate) {
      where.scheduledDate = {}
      if (startDate) where.scheduledDate.gte = new Date(startDate)
      if (endDate) where.scheduledDate.lte = new Date(endDate)
    }

    const calendarEntries = await prisma!.contentCalendarPlus.findMany({
      where,
      orderBy: [
        { isPriority: 'desc' },
        { scheduledDate: 'asc' }
      ]
    })

    return NextResponse.json({ success: true, calendarEntries })
  } catch (error: any) {
    console.error('Content calendar plus list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar entries' },
      { status: 500 }
    )
  }
}
