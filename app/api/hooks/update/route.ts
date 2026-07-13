import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkDatabase } from '@/lib/db-helper'
import { DEFAULT_USER_ID } from '@/lib/ensure-user'

export async function PUT(req: Request) {
  const dbError = checkDatabase()
  if (dbError) return dbError

  try {
    const { id, content, category, isFavorite, hookType, topic } = await req.json()

    if (!id) return NextResponse.json({ error: 'Hook ID required' }, { status: 400 })

    const existing = await db!.hook.findFirst({ where: { id, userId: DEFAULT_USER_ID } })
    if (!existing) return NextResponse.json({ error: 'Hook not found' }, { status: 404 })

    const hook = await db!.hook.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(hookType !== undefined && { hookType }),
        ...(topic !== undefined && { topic }),
      },
    })

    return NextResponse.json({ hook })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update hook' }, { status: 500 })
  }
}
