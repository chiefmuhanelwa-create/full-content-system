import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const productType = searchParams.get('productType')
    const audienceLevel = searchParams.get('audienceLevel')
    const paidsStream = searchParams.get('paidsStream')
    const status = searchParams.get('status')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: DEFAULT_USER_ID }
    if (productType) where.productType = productType
    if (audienceLevel) where.audienceLevel = audienceLevel
    if (paidsStream) where.paidsStream = paidsStream
    if (status) where.status = status
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    let products = await prisma!.product.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: [
        { isFavorite: 'desc' },
        { totalRevenue: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Auto-seed NOCHILL products on first access
    if (products.length === 0) {
      try {
        const baseUrl = request.headers.get('x-forwarded-host')
          ? `https://${request.headers.get('x-forwarded-host')}`
          : 'http://localhost:3000'
        await fetch(`${baseUrl}/api/products/seed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-internal-seed': '1' },
        })
        products = await prisma!.product.findMany({
          where: { userId: DEFAULT_USER_ID },
          orderBy: [{ isFavorite: 'desc' }, { totalRevenue: 'desc' }, { createdAt: 'desc' }]
        })
      } catch (seedErr) {
        console.warn('Auto-seed failed, continuing with empty products', seedErr)
      }
    }

    // Apply filters after potential seed
    let filtered = products
    if (productType) filtered = filtered.filter((p: any) => p.productType === productType)
    if (audienceLevel) filtered = filtered.filter((p: any) => p.audienceLevel === audienceLevel)
    if (paidsStream) filtered = filtered.filter((p: any) => p.paidsStream === paidsStream)
    if (status) filtered = filtered.filter((p: any) => p.status === status)

    return NextResponse.json({ success: true, products: filtered })
  } catch (error: any) {
    console.error('Products list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
