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
      hookText,
      hookType,
      relevant,
      awarenessLevel,
      clarity,
      unique,
      broadened = false,
      topic,
      contentPillar,
      platform,
      shadowFear,
      timesUsed = 0,
      avgPerformance = 0,
      isFavorite = false,
      tags,
      notes
    } = body

    if (!hookText || !hookType || !awarenessLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: hookText, hookType, and awarenessLevel are required' },
        { status: 400 }
      )
    }

    const hookBank = await prisma!.hookBank.create({
      data: {
        userId: user.id,
        hookText,
        hookType,
        relevant,
        awarenessLevel,
        clarity,
        unique,
        broadened,
        topic,
        contentPillar,
        platform,
        shadowFear,
        timesUsed,
        avgPerformance,
        isFavorite,
        tags,
        notes
      }
    })

    return NextResponse.json({ success: true, hookBank })
  } catch (error: any) {
    console.error('Hook bank creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create hook' },
      { status: 500 }
    )
  }
}
