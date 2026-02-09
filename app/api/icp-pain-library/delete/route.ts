import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function DELETE(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma!.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Pain point ID is required' }, { status: 400 })
    }

    const existing = await prisma!.iCPPainLibrary.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Pain point not found or unauthorized' }, { status: 403 })
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
