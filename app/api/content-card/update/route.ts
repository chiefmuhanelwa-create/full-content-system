import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content card ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingCard = await prisma!.contentCard.findUnique({
      where: { id }
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Content card not found' },
        { status: 404 }
      )
    }

    if (existingCard.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this content card' },
        { status: 403 }
      )
    }

    // Convert date fields if present
    if (updateData.shootDate) updateData.shootDate = new Date(updateData.shootDate)
    if (updateData.publishDate) updateData.publishDate = new Date(updateData.publishDate)

    // Update content card
    const contentCard = await prisma!.contentCard.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      contentCard
    })
  } catch (error: any) {
    console.error('Content card update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update content card' },
      { status: 500 }
    )
  }
}
