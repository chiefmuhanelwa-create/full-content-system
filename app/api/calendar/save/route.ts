import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function POST(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const {
      date,
      title,
      description,
      category,
      platform,
      scriptId,
      hookId,
      status,
    } = await req.json()

    if (!date || !title || !category || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const calendarEntry = await db!.calendarEntry.create({
      data: {
        userId: DEFAULT_USER_ID,
        date: new Date(date),
        title,
        description,
        category,
        platform,
        scriptId,
        hookId,
        status: status || 'planned',
      },
    })

    return NextResponse.json({ calendarEntry }, { status: 201 })
  } catch (error) {
    console.error('Save calendar entry error:', error)
    return NextResponse.json(
      { error: 'Failed to save calendar entry' },
      { status: 500 }
    )
  }
}
