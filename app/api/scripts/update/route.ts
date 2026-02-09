import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export async function PUT(req: Request) {
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
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingScript = await db!.script.findUnique({
      where: { id },
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    if (existingScript.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updates = await req.json()

    const script = await db!.script.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Update script error:', error)
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    )
  }
}
