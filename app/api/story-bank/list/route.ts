import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

export async function GET(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const storyKey = searchParams.get('storyKey')
    const isQuantifiable = searchParams.get('isQuantifiable')
    const isFavorite = searchParams.get('isFavorite')

    const where: any = { userId: DEFAULT_USER_ID }
    if (storyKey) where.storyKey = storyKey
    if (isQuantifiable !== null) where.isQuantifiable = isQuantifiable === 'true'
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    let stories = await prisma!.storyBankEntry.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: [
        { isFavorite: 'desc' },
        { avgImpact: 'desc' },
        { timesUsed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Auto-seed proof stories on first access
    if (stories.length === 0) {
      try {
        const baseUrl = request.headers.get('x-forwarded-host')
          ? `https://${request.headers.get('x-forwarded-host')}`
          : 'http://localhost:3000'
        await fetch(`${baseUrl}/api/story-bank/seed`, {
          method: 'POST',
          headers: { 'x-internal-seed': '1' },
        })
        stories = await prisma!.storyBankEntry.findMany({
          where: { userId: DEFAULT_USER_ID },
          orderBy: [{ isFavorite: 'desc' }, { avgImpact: 'desc' }, { createdAt: 'desc' }]
        })
      } catch (seedErr) {
        console.warn('Story auto-seed failed', seedErr)
      }
    }

    // Apply filters after potential seed
    let filtered = stories
    if (storyKey) filtered = filtered.filter((s: any) => s.storyKey === storyKey)
    if (isQuantifiable !== null) filtered = filtered.filter((s: any) => s.isQuantifiable === (isQuantifiable === 'true'))
    if (isFavorite !== null) filtered = filtered.filter((s: any) => s.isFavorite === (isFavorite === 'true'))

    return NextResponse.json({ success: true, stories: filtered })
  } catch (error: any) {
    console.error('Story bank list error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
