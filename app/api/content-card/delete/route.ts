import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function DELETE(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Content card ID is required' },
        { status: 400 }
      )
    }

    // Verify card exists
    const existingCard = await prisma!.contentCard.findUnique({
      where: { id }
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Content card not found' },
        { status: 404 }
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
