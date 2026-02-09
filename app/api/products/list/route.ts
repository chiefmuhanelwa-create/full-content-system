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
    const productType = searchParams.get('productType')
    const audienceLevel = searchParams.get('audienceLevel')
    const paidsStream = searchParams.get('paidsStream')
    const status = searchParams.get('status')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: user.id }
    if (productType) where.productType = productType
    if (audienceLevel) where.audienceLevel = audienceLevel
    if (paidsStream) where.paidsStream = paidsStream
    if (status) where.status = status
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    const products = await prisma!.product.findMany({
      where,
      orderBy: [
        { isFavorite: 'desc' },
        { totalRevenue: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error('Products list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
