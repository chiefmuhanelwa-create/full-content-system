import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const existing = await prisma!.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma!.product.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}
