import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'

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

    // Ensure default user exists before creating hook
    try {
      await ensureDefaultUser()
    } catch (userError: any) {
      console.error('Failed to ensure default user:', userError)
      return NextResponse.json(
        {
          error: 'Failed to initialize user',
          details: userError.message,
          hint: 'Please ensure your database is properly configured and migrations have been run.'
        },
        { status: 500 }
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

    // Provide more detailed error messages
    let errorMessage = error.message || 'Failed to create hook'
    let errorDetails = ''

    if (error.code === 'P2002') {
      errorMessage = 'Duplicate hook detected'
      errorDetails = 'This hook already exists in your Hook Bank'
    } else if (error.code === 'P2003') {
      errorMessage = 'Database relationship error'
      errorDetails = 'Failed to link hook to user. Please try again.'
    } else if (error.code === 'P1001') {
      errorMessage = 'Database connection failed'
      errorDetails = 'Could not connect to the database. Please check your internet connection.'
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails || error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
