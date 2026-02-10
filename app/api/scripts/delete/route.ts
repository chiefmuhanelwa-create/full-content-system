import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

export async function DELETE(req: Request) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    // Verify script exists
    const script = await db!.script.findUnique({
      where: { id },
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    await db!.script.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete script error:', error)
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    )
  }
}
