import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { get120HooksBank } from '@/lib/knowledge-base'

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

    // Get 120 hooks from knowledge base
    const hooksData = get120HooksBank()
    let migratedCount = 0
    const errors: any[] = []

    // Process each category
    for (const category of hooksData.categories) {
      for (const hookData of category.hooks) {
        try {
          const racub = hookData.r_a_c_u_b || {}

          // Map awareness level
          let awarenessLevel = 'symptom_aware'
          if (racub.awareness) {
            if (racub.awareness.includes('Problem aware')) awarenessLevel = 'problem_aware'
            else if (racub.awareness.includes('Solution aware')) awarenessLevel = 'solution_aware'
            else if (racub.awareness.includes('Product aware')) awarenessLevel = 'product_aware'
          }

          // Create hook in database
          await prisma!.hookBank.create({
            data: {
              userId: user.id,
              hookText: hookData.hook,
              hookType: category.category.toLowerCase().includes('origin') ? 'story' :
                       category.category.toLowerCase().includes('pain') ? 'question' :
                       category.category.toLowerCase().includes('result') ? 'statement' :
                       category.category.toLowerCase().includes('question') ? 'question' :
                       category.category.toLowerCase().includes('pattern') ? 'pattern_interrupt' : 'statement',
              relevant: racub.relevant || null,
              awarenessLevel: awarenessLevel,
              clarity: racub.clarity || null,
              unique: racub.unique || null,
              broadened: racub.broadened ? true : false,
              topic: category.category,
              contentPillar: category.best_for?.[0] || null,
              platform: null,
              shadowFear: null,
              timesUsed: 0,
              avgPerformance: 0,
              isFavorite: false,
              tags: {
                category: category.category,
                emotionalImpact: category.emotional_impact,
                originalId: hookData.id
              },
              notes: `Migrated from 120 Hooks Bank - ${category.description}`
            }
          })
          migratedCount++
        } catch (error: any) {
          errors.push({ hookId: hookData.id, error: error.message })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} hooks to HookBank`,
      migratedCount,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Hook migration error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to migrate hooks' },
      { status: 500 }
    )
  }
}
