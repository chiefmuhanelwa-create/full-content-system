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
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
    }

    const existing = await prisma!.storyBankEntry.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    if (updateData.lastUsed) updateData.lastUsed = new Date(updateData.lastUsed)

    const storyBank = await prisma!.storyBankEntry.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, storyBank })
  } catch (error: any) {
    console.error('Story bank update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update story' },
      { status: 500 }
    )
  }
}
