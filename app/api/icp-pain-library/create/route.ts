import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, checkDatabase } from '@/lib/db-helper'

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma!.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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
        userId: user.id,
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
