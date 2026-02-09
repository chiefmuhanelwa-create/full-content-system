import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function GET(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession(authOptions)
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
    const audienceLevel = searchParams.get('audienceLevel')
    const painCategory = searchParams.get('painCategory')
    const shadowFear = searchParams.get('shadowFear')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: user.id }
    if (audienceLevel) where.audienceLevel = audienceLevel
    if (painCategory) where.painCategory = painCategory
    if (shadowFear) where.shadowFear = shadowFear
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    const painPoints = await prisma!.iCPPainLibrary.findMany({
      where,
      orderBy: [
        { isFavorite: 'desc' },
        { conversionRate: 'desc' },
        { avgEngagement: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ success: true, painPoints })
  } catch (error: any) {
    console.error('ICP pain library list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pain points' },
      { status: 500 }
    )
  }
}
