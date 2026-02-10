import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function PUT(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Hook ID is required' }, { status: 400 })
    }

    const existing = await prisma!.hookBank.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Hook not found' }, { status: 404 })
    }

    const hookBank = await prisma!.hookBank.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, hookBank })
  } catch (error: any) {
    console.error('Hook bank update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update hook' },
      { status: 500 }
    )
  }
}
