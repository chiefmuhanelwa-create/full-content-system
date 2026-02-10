import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function PUT(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Calendar entry ID is required' }, { status: 400 })
    }

    const existing = await prisma!.contentCalendarPlus.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Calendar entry not found' }, { status: 404 })
    }

    if (updateData.scheduledDate) updateData.scheduledDate = new Date(updateData.scheduledDate)

    const calendar = await prisma!.contentCalendarPlus.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, calendar })
  } catch (error: any) {
    console.error('Content calendar plus update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update calendar entry' },
      { status: 500 }
    )
  }
}
