import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

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
        userId: DEFAULT_USER_ID,
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
