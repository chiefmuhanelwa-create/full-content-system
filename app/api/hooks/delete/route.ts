import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export async function DELETE(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Hook ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const hook = await db!.hook.findUnique({
      where: { id },
    })

    if (!hook) {
      return NextResponse.json(
        { error: 'Hook not found' },
        { status: 404 }
      )
    }

    if (hook.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await db!.hook.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete hook error:', error)
    return NextResponse.json(
      { error: 'Failed to delete hook' },
      { status: 500 }
    )
  }
}
