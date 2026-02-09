import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession(authOptions)
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
    const {
      title,
      description,
      contentType,
      topic,
      stage = 'ideation',
      substage,
      scriptId,
      hookId,
      storyId,
      platforms = [],
      fourETag,
      awarenessLevel,
      clarityType,
      shadowFear,
      socialUrls,
      scheduledFor,
      notes,
      tags,
      isPriority = false
    } = body

    // Validate required fields
    if (!title || !contentType || !fourETag || !awarenessLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: title, contentType, fourETag, and awarenessLevel are required' },
        { status: 400 }
      )
    }

    // Validate stage
    const validStages = ['ideation', 'scripting', 'shooting', 'editing', 'ready', 'posted']
    if (!validStages.includes(stage)) {
      return NextResponse.json(
        { error: `Invalid stage. Must be one of: ${validStages.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate fourETag
    const validFourETags = ['entertain', 'educate', 'encourage', 'earn']
    if (!validFourETags.includes(fourETag)) {
      return NextResponse.json(
        { error: `Invalid fourETag. Must be one of: ${validFourETags.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate awarenessLevel
    const validAwarenessLevels = ['symptom_aware', 'problem_aware', 'solution_aware', 'product_aware']
    if (!validAwarenessLevels.includes(awarenessLevel)) {
      return NextResponse.json(
        { error: `Invalid awarenessLevel. Must be one of: ${validAwarenessLevels.join(', ')}` },
        { status: 400 }
      )
    }

    // Create content progress
    const contentProgress = await prisma!.contentProgress.create({
      data: {
        userId: user.id,
        title,
        description,
        contentType,
        topic,
        stage,
        substage,
        scriptId,
        hookId,
        storyId,
        platforms,
        fourETag,
        awarenessLevel,
        clarityType,
        shadowFear,
        socialUrls,
        performance: {},
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        notes,
        tags,
        isPriority
      }
    })

    return NextResponse.json({
      success: true,
      contentProgress
    })
  } catch (error: any) {
    console.error('Content progress creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create content progress' },
      { status: 500 }
    )
  }
}
