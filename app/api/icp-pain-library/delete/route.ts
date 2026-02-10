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
      return NextResponse.json({ error: 'Pain point ID is required' }, { status: 400 })
    }

    const existing = await prisma!.iCPPainLibrary.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Pain point not found' }, { status: 404 })
    }

    await prisma!.iCPPainLibrary.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Pain point deleted successfully' })
  } catch (error: any) {
    console.error('ICP pain library deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete pain point' },
      { status: 500 }
    )
  }
}
