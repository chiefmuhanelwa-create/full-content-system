import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      productName,
      productType,
      price,
      currency = 'ZAR',
      audienceLevel,
      audienceSegment,
      description,
      coreBenefits,
      painPoints,
      priceAnchor,
      bonuses,
      guarantee,
      testimonials,
      paidsStream,
      ladderPosition,
      upsellTo,
      downsellTo,
      totalSales = 0,
      totalRevenue = 0,
      conversionRate = 0,
      avgReviewScore = 0,
      status = 'active',
      launchDate,
      salesPageUrl,
      checkoutUrl,
      deliveryMethod,
      isFavorite = false,
      tags,
      notes
    } = body

    if (!productName || !productType || price === undefined || !audienceLevel || !description || !coreBenefits || !painPoints || !paidsStream || !ladderPosition) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, productType, price, audienceLevel, description, coreBenefits, painPoints, paidsStream, and ladderPosition are required' },
        { status: 400 }
      )
    }

    const product = await prisma!.product.create({
      data: {
        userId: user.id,
        productName,
        productType,
        price,
        currency,
        audienceLevel,
        audienceSegment,
        description,
        coreBenefits,
        painPoints,
        priceAnchor,
        bonuses,
        guarantee,
        testimonials,
        paidsStream,
        ladderPosition,
        upsellTo,
        downsellTo,
        totalSales,
        totalRevenue,
        conversionRate,
        avgReviewScore,
        status,
        launchDate: launchDate ? new Date(launchDate) : null,
        salesPageUrl,
        checkoutUrl,
        deliveryMethod,
        isFavorite,
        tags,
        notes
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
