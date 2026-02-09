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
      storyKey,
      title,
      snippet,
      fullVersion,
      timeframe,
      emotion,
      lesson,
      useFor,
      contentPillars,
      beforeState,
      afterState,
      specificNumbers,
      isSpecial = false,
      isRelevant = false,
      isQuantifiable = false,
      hasNames = false,
      villain,
      shadowFear,
      timesUsed = 0,
      lastUsed,
      avgImpact = 0,
      isFavorite = false,
      tags,
      notes
    } = body

    if (!storyKey || !title || !snippet || !useFor) {
      return NextResponse.json(
        { error: 'Missing required fields: storyKey, title, snippet, and useFor are required' },
        { status: 400 }
      )
    }

    const storyBank = await prisma!.storyBankEntry.create({
      data: {
        userId: user.id,
        storyKey,
        title,
        snippet,
        fullVersion,
        timeframe,
        emotion,
        lesson,
        useFor,
        contentPillars,
        beforeState,
        afterState,
        specificNumbers,
        isSpecial,
        isRelevant,
        isQuantifiable,
        hasNames,
        villain,
        shadowFear,
        timesUsed,
        lastUsed: lastUsed ? new Date(lastUsed) : null,
        avgImpact,
        isFavorite,
        tags,
        notes
      }
    })

    return NextResponse.json({ success: true, storyBank })
  } catch (error: any) {
    console.error('Story bank creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create story' },
      { status: 500 }
    )
  }
}
