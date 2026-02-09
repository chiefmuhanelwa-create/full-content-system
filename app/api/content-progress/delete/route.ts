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

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content progress ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingContent = await prisma!.contentProgress.findUnique({
      where: { id }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content progress not found' },
        { status: 404 }
      )
    }

    if (existingContent.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this content' },
        { status: 403 }
      )
    }

    // Delete content progress
    await prisma!.contentProgress.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Content progress deleted successfully'
    })
  } catch (error: any) {
    console.error('Content progress deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete content progress' },
      { status: 500 }
    )
  }
}
