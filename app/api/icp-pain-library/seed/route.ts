import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

const ICP_PAIN_POINTS = [
  // --- DNA Creator (18-35, aspiring creator) ---
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I have been posting for months and made zero money',
    painCategory: 'financial',
    painIntensity: 'critical',
    shadowFear: 'Permanent Failure',
    emotionalTrigger: 'Wasted time, invisible effort, broke creator',
    hookAngles: JSON.stringify(['wasted', 'invisible', 'broke']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I do not know what my niche is — I keep changing it',
    painCategory: 'knowledge',
    painIntensity: 'high',
    shadowFear: 'Wrong Path Terror',
    emotionalTrigger: 'Scattered focus, lost identity, confused direction',
    hookAngles: JSON.stringify(['scattered', 'lost', 'confused']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'Brands never message me even though I post good content',
    painCategory: 'visibility',
    painIntensity: 'critical',
    shadowFear: 'Invisible Labor',
    emotionalTrigger: 'Ignored, overlooked, undervalued work',
    hookAngles: JSON.stringify(['ignored', 'overlooked', 'undervalued']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I do not know what to post or when — I just guess',
    painCategory: 'knowledge',
    painIntensity: 'medium',
    shadowFear: 'Time Anxiety',
    emotionalTrigger: 'Guessing, wasting time, no plan',
    hookAngles: JSON.stringify(['guessing', 'wasting time', 'no plan']),
    isFavorite: false,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I am scared people will judge me or think I am selling out',
    painCategory: 'confidence',
    painIntensity: 'high',
    shadowFear: 'Family Shame',
    emotionalTrigger: 'Embarrassed, judged, exposed',
    hookAngles: JSON.stringify(['embarrassed', 'judged', 'exposed']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I said yes to a brand deal and undercharged — now that is my rate',
    painCategory: 'financial',
    painIntensity: 'high',
    shadowFear: 'Exploitation',
    emotionalTrigger: 'Underpaid, stuck, regret',
    hookAngles: JSON.stringify(['underpaid', 'stuck', 'regret']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'My following is growing but my income is not',
    painCategory: 'financial',
    painIntensity: 'critical',
    shadowFear: 'Permanent Failure',
    emotionalTrigger: 'Big following broke creator, plateaued',
    hookAngles: JSON.stringify(['big following', 'broke', 'plateaued']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'I copy successful creators and it does not work for me',
    painCategory: 'confidence',
    painIntensity: 'medium',
    shadowFear: 'Imposter Syndrome',
    emotionalTrigger: 'Copying, fake, not original',
    hookAngles: JSON.stringify(['copying', 'fake', 'not original']),
    isFavorite: false,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'SARS is going to come after me for brand deal income I never declared',
    painCategory: 'financial',
    painIntensity: 'critical',
    shadowFear: 'Generational Poverty',
    emotionalTrigger: 'SARS, tax, owe money',
    hookAngles: JSON.stringify(['SARS', 'tax', 'owe money']),
    isFavorite: true,
  },
  {
    audienceLevel: 'beginner',
    audienceSegment: 'DNA Creator',
    painPoint: 'My family thinks content creation is not a real job',
    painCategory: 'confidence',
    painIntensity: 'high',
    shadowFear: 'Family Shame',
    emotionalTrigger: 'Not taken seriously, prove them wrong',
    hookAngles: JSON.stringify(['not taken seriously', 'prove them wrong', 'embarrassed']),
    isFavorite: true,
  },

  // --- Called Expert (32-50, credentialed professional) ---
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I have knowledge and credentials but no one is paying me for my content',
    painCategory: 'financial',
    painIntensity: 'critical',
    shadowFear: 'Invisible Labor',
    emotionalTrigger: 'Ignored, undervalued, wasted expertise',
    hookAngles: JSON.stringify(['ignored', 'undervalued', 'wasted expertise']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I do not know how to turn my professional experience into content',
    painCategory: 'knowledge',
    painIntensity: 'high',
    shadowFear: 'Wrong Path Terror',
    emotionalTrigger: 'Stuck, translation gap, do not know where to start',
    hookAngles: JSON.stringify(['stuck', 'translation gap', 'where to start']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I tried posting professional content and got no engagement',
    painCategory: 'visibility',
    painIntensity: 'high',
    shadowFear: 'Permanent Failure',
    emotionalTrigger: 'Crickets, waste of time, nobody cares',
    hookAngles: JSON.stringify(['crickets', 'waste of time', 'nobody cares']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I am worried my colleagues or clients will judge my content',
    painCategory: 'confidence',
    painIntensity: 'high',
    shadowFear: 'Relationship Loss',
    emotionalTrigger: 'Reputation, professional image, judged',
    hookAngles: JSON.stringify(['reputation', 'professional image', 'judged']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I am trading time for money with no passive income or leverage',
    painCategory: 'financial',
    painIntensity: 'critical',
    shadowFear: 'Generational Poverty',
    emotionalTrigger: 'One income stream, burnout, ceiling',
    hookAngles: JSON.stringify(['one income stream', 'burnout', 'ceiling']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I feel like my calling is bigger than my current job but I do not know how to bridge it',
    painCategory: 'confidence',
    painIntensity: 'critical',
    shadowFear: 'Spiritual Crisis',
    emotionalTrigger: 'Calling, purpose, wasted potential',
    hookAngles: JSON.stringify(['calling', 'purpose', 'wasted potential']),
    isFavorite: true,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I start content creation then stop because I see no results fast enough',
    painCategory: 'confidence',
    painIntensity: 'high',
    shadowFear: 'Time Anxiety',
    emotionalTrigger: 'Gave up, inconsistent, impatient',
    hookAngles: JSON.stringify(['gave up', 'inconsistent', 'impatient']),
    isFavorite: false,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I do not know the difference between LinkedIn, IG and TikTok strategy for my field',
    painCategory: 'knowledge',
    painIntensity: 'medium',
    shadowFear: 'Wrong Path Terror',
    emotionalTrigger: 'Platform confused, wrong audience, wasting effort',
    hookAngles: JSON.stringify(['platform confused', 'wrong audience', 'wasting effort']),
    isFavorite: false,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I am scared that starting online will distract from my primary career',
    painCategory: 'time',
    painIntensity: 'high',
    shadowFear: 'Relationship Loss',
    emotionalTrigger: 'Losing focus, career risk, balance',
    hookAngles: JSON.stringify(['losing focus', 'career risk', 'balance']),
    isFavorite: false,
  },
  {
    audienceLevel: 'established',
    audienceSegment: 'Called Expert',
    painPoint: 'I do not know how to package my expertise into a product people will actually buy',
    painCategory: 'knowledge',
    painIntensity: 'critical',
    shadowFear: 'Invisible Labor',
    emotionalTrigger: 'Packaging, pricing, nobody buying',
    hookAngles: JSON.stringify(['packaging', 'pricing', 'nobody buying']),
    isFavorite: true,
  },
]

export async function POST(request: NextRequest) {
  const internalSeed = request.headers.get('x-internal-seed')
  if (internalSeed !== '1') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const existing = await prisma!.iCPPainLibrary.count({ where: { userId: DEFAULT_USER_ID } })
    if (existing > 0) {
      await prisma!.iCPPainLibrary.deleteMany({ where: { userId: DEFAULT_USER_ID } })
    }

    const created = await prisma!.iCPPainLibrary.createMany({
      data: ICP_PAIN_POINTS.map((p) => ({ ...p, userId: DEFAULT_USER_ID })),
    })

    return NextResponse.json({ success: true, seeded: created.count })
  } catch (error: any) {
    console.error('ICP seed error:', error)
    return NextResponse.json({ error: error.message || 'Seed failed' }, { status: 500 })
  }
}
