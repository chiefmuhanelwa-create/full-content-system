import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function DELETE(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession()
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
      return NextResponse.json({ error: 'Hook ID is required' }, { status: 400 })
    }

    const existing = await prisma!.hookBank.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Hook not found or unauthorized' }, { status: 403 })
    }

    await prisma!.hookBank.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Hook deleted successfully' })
  } catch (error: any) {
    console.error('Hook bank deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete hook' },
      { status: 500 }
    )
  }
}
