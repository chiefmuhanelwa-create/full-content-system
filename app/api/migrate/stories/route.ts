import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'
import storiesData from '@/lib/knowledge/ndivhuwo-stories.json'

export async function POST(request: NextRequest) {
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

    let migratedCount = 0
    const errors: any[] = []

    // Process each story
    for (const [storyKey, story] of Object.entries(storiesData.stories)) {
      try {
        const storyData: any = story

        // Extract numbers if available
        const specificNumbers = storyData.numbers ? storyData.numbers : null

        // Determine 4-criteria test
        const isQuantifiable = specificNumbers !== null
        const isSpecial = storyKey.includes('meta') || storyKey.includes('viral') || storyData.use_for?.includes('Viral')
        const isRelevant = storyData.use_for && storyData.use_for.length > 0
        const hasNames = storyData.clients !== undefined || (specificNumbers && specificNumbers.clients)

        // Create story in database
        await prisma!.storyBankEntry.create({
          data: {
            userId: user.id,
            storyKey: storyKey,
            title: storyData.title,
            snippet: storyData.snippet,
            fullVersion: storyData.full_version || null,
            timeframe: storyData.timeframe || null,
            emotion: storyData.emotion || null,
            lesson: storyData.lesson || null,
            useFor: storyData.use_for || [],
            contentPillars: storyData.content_pillars || [],
            beforeState: specificNumbers?.before || null,
            afterState: specificNumbers?.after || null,
            specificNumbers: specificNumbers,
            isSpecial: isSpecial,
            isRelevant: isRelevant,
            isQuantifiable: isQuantifiable,
            hasNames: hasNames,
            villain: storyData.villain || null,
            shadowFear: storyData.shadow_fear || null,
            timesUsed: 0,
            lastUsed: null,
            avgImpact: 0,
            isFavorite: false,
            tags: {
              originalKey: storyKey,
              numbers: specificNumbers
            },
            notes: `Migrated from Ndivhuwo Stories Bank`
          }
        })
        migratedCount++
      } catch (error: any) {
        errors.push({ storyKey, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} stories to StoryBank`,
      migratedCount,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Story migration error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to migrate stories' },
      { status: 500 }
    )
  }
}
