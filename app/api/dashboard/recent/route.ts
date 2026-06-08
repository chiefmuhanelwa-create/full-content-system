import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DEFAULT_USER_ID } from '@/lib/ensure-user'

export async function GET(_request: NextRequest) {
  if (!db) {
    return NextResponse.json({ hooks: [], scripts: [] })
  }
  try {
    const [hooks, scripts] = await Promise.all([
      db.hook.findMany({
        where: { userId: DEFAULT_USER_ID },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          content: true,
          platform: true,
          hookType: true,
          createdAt: true,
        },
      }),
      db.script.findMany({
        where: { userId: DEFAULT_USER_ID },
        orderBy: { createdAt: 'desc' },
        take: 2,
        select: {
          id: true,
          title: true,
          platform: true,
          goal: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({ hooks, scripts })
  } catch {
    return NextResponse.json({ hooks: [], scripts: [] })
  }
}
