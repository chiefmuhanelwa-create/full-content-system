import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function DELETE(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Calendar entry ID is required' }, { status: 400 })
    }

    const existing = await prisma!.contentCalendarPlus.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Calendar entry not found' }, { status: 404 })
    }

    await prisma!.contentCalendarPlus.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Calendar entry deleted successfully' })
  } catch (error: any) {
    console.error('Content calendar plus deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete calendar entry' },
      { status: 500 }
    )
  }
}
