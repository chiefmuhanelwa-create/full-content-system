import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function DELETE(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content progress ID is required' },
        { status: 400 }
      )
    }

    // Verify content exists
    const existingContent = await prisma!.contentProgress.findUnique({
      where: { id }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content progress not found' },
        { status: 404 }
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
