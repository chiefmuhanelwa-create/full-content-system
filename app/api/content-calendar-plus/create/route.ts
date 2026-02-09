import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession(authOptions)
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
      scheduledDate,
      publishTime,
      timezone = 'Africa/Johannesburg',
      title,
      description,
      contentPillar,
      fourETag,
      platform,
      contentType,
      contentCardId,
      scriptId,
      hookId,
      storyId,
      status = 'planned',
      completionPct = 0,
      campaignName,
      seriesName,
      episodeNumber,
      targetViews,
      targetEngagement,
      targetLeads,
      targetRevenue,
      color,
      isPriority = false,
      isRecurring = false,
      recurringPattern,
      tags,
      notes
    } = body

    if (!scheduledDate || !title || !contentPillar || !fourETag || !platform || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: scheduledDate, title, contentPillar, fourETag, platform, and contentType are required' },
        { status: 400 }
      )
    }

    const calendar = await prisma!.contentCalendarPlus.create({
      data: {
        userId: user.id,
        scheduledDate: new Date(scheduledDate),
        publishTime,
        timezone,
        title,
        description,
        contentPillar,
        fourETag,
        platform,
        contentType,
        contentCardId,
        scriptId,
        hookId,
        storyId,
        status,
        completionPct,
        campaignName,
        seriesName,
        episodeNumber,
        targetViews,
        targetEngagement,
        targetLeads,
        targetRevenue,
        color,
        isPriority,
        isRecurring,
        recurringPattern,
        tags,
        notes
      }
    })

    return NextResponse.json({ success: true, calendar })
  } catch (error: any) {
    console.error('Content calendar plus creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create calendar entry' },
      { status: 500 }
    )
  }
}
