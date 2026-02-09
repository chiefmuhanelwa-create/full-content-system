import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Pain point ID is required' }, { status: 400 })
    }

    const existing = await prisma!.iCPPainLibrary.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Pain point not found or unauthorized' }, { status: 403 })
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
