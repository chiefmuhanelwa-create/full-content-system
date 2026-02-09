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
    const storyKey = searchParams.get('storyKey')
    const isQuantifiable = searchParams.get('isQuantifiable')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: user.id }
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
