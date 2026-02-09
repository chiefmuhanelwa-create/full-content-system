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
    const hookType = searchParams.get('hookType')
    const awarenessLevel = searchParams.get('awarenessLevel')
    const contentPillar = searchParams.get('contentPillar')
    const platform = searchParams.get('platform')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: user.id }
    if (hookType) where.hookType = hookType
    if (awarenessLevel) where.awarenessLevel = awarenessLevel
    if (contentPillar) where.contentPillar = contentPillar
    if (platform) where.platform = platform
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    const hooks = await prisma!.hookBank.findMany({
      where,
      orderBy: [
        { isFavorite: 'desc' },
        { avgPerformance: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ success: true, hooks })
  } catch (error: any) {
    console.error('Hook bank list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hooks' },
      { status: 500 }
    )
  }
}
