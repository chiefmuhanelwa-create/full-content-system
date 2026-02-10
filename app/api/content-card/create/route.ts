import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

import { ensureDefaultUser, DEFAULT_USER_ID } from '@/lib/ensure-user'

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    const dbError = checkDatabase()
    if (dbError) return dbError

    const body = await request.json()
    const {
      contentTitle,
      platform,
      contentType,
      status = 'ideation',
      contentPillar,
      frameworkUsed,
      audienceLevel,
      icpPainPoint,
      shadowFear,
      desiredTransformationFrom,
      desiredTransformationTo,
      hookRelevant,
      hookAwareness,
      hookClarity,
      hookUnique,
      hookBroadened,
      hookVariations,
      scriptHook,
      scriptValuePromise,
      scriptFirstConflict,
      scriptBody,
      scriptRehooks,
      scriptEmotionalPeak,
      scriptCTA,
      scriptRetentionLoop,
      fullScript,
      personalStoryUsed,
      villain,
      proofMoment,
      problemThisSolves,
      productThatSolvesIt,
      offerLevel,
      productId,
      shootDate,
      publishDate,
      productionChecklist,
      cameraStyle,
      energyLevel,
      location,
      bRollIdeas,
      visualInterrupts,
      views = 0,
      comments = 0,
      shares = 0,
      saves = 0,
      watchTime = 0,
      leadsGenerated = 0,
      revenueGenerated = 0,
      lessonLearned,
      whatWorked,
      whatFailed,
      isFavorite = false,
      tags
    } = body

    // Validate required fields
    if (!contentTitle || !platform || !contentType || !contentPillar || !audienceLevel || !icpPainPoint || !hookAwareness) {
      return NextResponse.json(
        { error: 'Missing required fields: contentTitle, platform, contentType, contentPillar, audienceLevel, icpPainPoint, and hookAwareness are required' },
        { status: 400 }
      )
    }

    // Ensure default user exists
    await ensureDefaultUser()

    // Create content card
    const contentCard = await prisma!.contentCard.create({
      data: {
        userId: DEFAULT_USER_ID,
        contentTitle,
        platform,
        contentType,
        status,
        contentPillar,
        frameworkUsed,
        audienceLevel,
        icpPainPoint,
        shadowFear,
        desiredTransformationFrom,
        desiredTransformationTo,
        hookRelevant,
        hookAwareness,
        hookClarity,
        hookUnique,
        hookBroadened,
        hookVariations,
        scriptHook,
        scriptValuePromise,
        scriptFirstConflict,
        scriptBody,
        scriptRehooks,
        scriptEmotionalPeak,
        scriptCTA,
        scriptRetentionLoop,
        fullScript,
        personalStoryUsed,
        villain,
        proofMoment,
        problemThisSolves,
        productThatSolvesIt,
        offerLevel,
        productId,
        shootDate: shootDate ? new Date(shootDate) : null,
        publishDate: publishDate ? new Date(publishDate) : null,
        productionChecklist,
        cameraStyle,
        energyLevel,
        location,
        bRollIdeas,
        visualInterrupts,
        views,
        comments,
        shares,
        saves,
        watchTime,
        leadsGenerated,
        revenueGenerated,
        lessonLearned,
        whatWorked,
        whatFailed,
        isFavorite,
        tags
      }
    })

    return NextResponse.json({
      success: true,
      contentCard
    })
  } catch (error: any) {
    console.error('Content card creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create content card' },
      { status: 500 }
    )
  }
}
