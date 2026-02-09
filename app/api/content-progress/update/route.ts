import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function PATCH(request: NextRequest) {
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
        { error: 'Unauthorized to update this content' },
        { status: 403 }
      )
    }

    // Convert scheduledFor to Date if provided
    if (updateData.scheduledFor) {
      updateData.scheduledFor = new Date(updateData.scheduledFor)
    }

    // If stage is being updated to "posted", set postedAt
    if (updateData.stage === 'posted' && !existingContent.postedAt) {
      updateData.postedAt = new Date()
    }

    // Update content progress
    const updatedContent = await prisma!.contentProgress.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      contentProgress: updatedContent
    })
  } catch (error: any) {
    console.error('Content progress update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update content progress' },
      { status: 500 }
    )
  }
}
