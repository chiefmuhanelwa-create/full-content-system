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
      return NextResponse.json({ error: 'Pain point ID is required' }, { status: 400 })
    }

    const existing = await prisma!.iCPPainLibrary.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Pain point not found' }, { status: 404 })
    }

    const icpPain = await prisma!.iCPPainLibrary.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, icpPain })
  } catch (error: any) {
    console.error('ICP pain library update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update pain point' },
      { status: 500 }
    )
  }
}
