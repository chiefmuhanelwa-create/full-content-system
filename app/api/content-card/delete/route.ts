import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

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
        { error: 'Unauthorized to delete this content card' },
        { status: 403 }
      )
    }

    // Delete content card
    await prisma!.contentCard.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Content card deleted successfully'
    })
  } catch (error: any) {
    console.error('Content card deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete content card' },
      { status: 500 }
    )
  }
}
