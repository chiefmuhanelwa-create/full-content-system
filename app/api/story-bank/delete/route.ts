import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function DELETE(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
    }

    const existing = await prisma!.storyBankEntry.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    await prisma!.storyBankEntry.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Story deleted successfully' })
  } catch (error: any) {
    console.error('Story bank deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete story' },
      { status: 500 }
    )
  }
}
