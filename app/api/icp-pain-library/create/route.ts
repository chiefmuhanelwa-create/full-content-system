import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const DEFAULT_USER_ID = 'default-user-id'

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const body = await request.json()
    const {
      audienceLevel,
      audienceSegment,
      painPoint,
      painCategory,
      painIntensity,
      shadowFear,
      emotionalTrigger,
      symptoms,
      objections,
      solutionType,
      productMatch,
      contentPillar,
      hookAngles,
      storyMatches,
      timesAddressed = 0,
      avgEngagement = 0,
      conversionRate = 0,
      isFavorite = false,
      tags,
      notes
    } = body

    if (!audienceLevel || !painPoint || !painCategory || !painIntensity) {
      return NextResponse.json(
        { error: 'Missing required fields: audienceLevel, painPoint, painCategory, and painIntensity are required' },
        { status: 400 }
      )
    }

    const icpPain = await prisma!.iCPPainLibrary.create({
      data: {
        userId: DEFAULT_USER_ID,
        audienceLevel,
        audienceSegment,
        painPoint,
        painCategory,
        painIntensity,
        shadowFear,
        emotionalTrigger,
        symptoms,
        objections,
        solutionType,
        productMatch,
        contentPillar,
        hookAngles,
        storyMatches,
        timesAddressed,
        avgEngagement,
        conversionRate,
        isFavorite,
        tags,
        notes
      }
    })

    return NextResponse.json({ success: true, icpPain })
  } catch (error: any) {
    console.error('ICP pain library creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create ICP pain point' },
      { status: 500 }
    )
  }
}
