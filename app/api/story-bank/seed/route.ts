import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

const PROOF_STORIES = [
  {
    storyKey: 'bathroom_floors',
    title: 'Bathroom Floors — The Beginning',
    snippet: "I was sitting on bathroom floors crying, not knowing how I was going to make it. Today I run a content business that has changed my family's life.",
    fullVersion: "Before any of this — before the brand deals, before the courses, before anyone knew who NoChill was — I was sitting on bathroom floors at 2am crying. No income. No plan. No one believed it was possible. That moment is why everything I teach is real. Not theory. Not inspiration. Proof.",
    timeframe: '10-12s',
    emotion: 'Vulnerability → Triumph',
    lesson: 'The lowest point is often the starting line, not the end.',
    useFor: JSON.stringify(['Resilience', 'Origin Story', 'Transformation', 'Called Expert']),
    contentPillars: JSON.stringify(['story', 'authority', 'motivation']),
    beforeState: 'Broke, unknown, sitting on bathroom floors at 2am',
    afterState: 'Running a profitable content business, brand deals, teaching others',
    specificNumbers: JSON.stringify({ before: 'R0 income', after: 'Multi-stream revenue' }),
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: false,
    villain: 'Self-doubt and financial pressure',
    shadowFear: 'Fear of permanent failure',
    isFavorite: true,
    tags: JSON.stringify(['origin', 'resilience', 'called-expert', 'transformation']),
  },
  {
    storyKey: 'r750_to_r100k',
    title: 'From R750/Post to R100K Deals',
    snippet: 'I used to charge R750 per post. Then I learned my worth. First R100K brand deal changed everything.',
    fullVersion: "I was charging R750 per sponsored post. R750. Posting for brands who were making millions off my audience and I thought that was normal. The moment I learned how to price my value — using real data, real frameworks — I closed my first R100K deal. Same audience. Different knowledge.",
    timeframe: '15-18s',
    emotion: 'Ignorance → Mastery',
    lesson: 'Undercharging is not humility. It is ignorance. Learn your worth.',
    useFor: JSON.stringify(['Pricing', 'Brand Deals', 'Content Creator Inspirer', 'Monetisation']),
    contentPillars: JSON.stringify(['education', 'authority', 'story']),
    beforeState: 'Charging R750 per sponsored post',
    afterState: 'Closing R100K brand deals',
    specificNumbers: JSON.stringify({ before: 'R750 per post', after: 'R100,000 per deal' }),
    isSpecial: true, isRelevant: true, isQuantifiable: true, hasNames: false,
    villain: 'Undervaluing your own worth',
    shadowFear: 'Fear of asking for real money',
    isFavorite: true,
    tags: JSON.stringify(['monetisation', 'brand-deals', 'pricing', 'creator-inspirer']),
  },
  {
    storyKey: 'huawei_r6000_investment',
    title: 'R6000 Huawei Investment',
    snippet: "I invested R6000 I didn't have into a Huawei phone to start creating. That R6000 bet on myself changed everything.",
    fullVersion: "Everyone talks about needing perfect conditions to start. I had R6000 to my name. I bet it on a phone — a Huawei — and decided that this was my tool. Not a camera. Not a studio. A phone. Everything I built started with that one uncomfortable decision to invest in myself when I had the least.",
    timeframe: '10-12s',
    emotion: 'Scarcity → Abundance through action',
    lesson: 'Start with what you have. The conditions will never be perfect.',
    useFor: JSON.stringify(['Starting Out', 'Taking Action', 'Content Creator Inspirer', 'Resourcefulness']),
    contentPillars: JSON.stringify(['motivation', 'story', 'education']),
    beforeState: 'R6000 to my name, no equipment',
    afterState: 'Built entire content business starting from that phone',
    specificNumbers: JSON.stringify({ investment: 'R6,000', tool: 'Huawei phone' }),
    isSpecial: true, isRelevant: true, isQuantifiable: true, hasNames: true,
    villain: 'Waiting for perfect conditions',
    shadowFear: 'Fear of wasting money on yourself',
    isFavorite: false,
    tags: JSON.stringify(['starting-out', 'resourcefulness', 'action', 'creator-inspirer']),
  },
  {
    storyKey: 'instagram_780k_loss',
    title: 'Lost 780K Instagram Followers Overnight',
    snippet: 'I built 780K Instagram followers then lost the account overnight. Had to start again. Best thing that ever happened.',
    fullVersion: "I had 780,000 Instagram followers. Then the account was gone. Overnight. Every brand deal, every connection, every proof of work — gone. Most people would have quit. I rebuilt. And what I learned from rebuilding is what this entire system is built on. You can never lose what is in your mind.",
    timeframe: '15-18s',
    emotion: 'Loss → Reconstruction → Greater strength',
    lesson: 'Build skills, not just followers. Skills cannot be taken from you.',
    useFor: JSON.stringify(['Resilience', 'Platform Risk', 'Called Expert', 'Mindset']),
    contentPillars: JSON.stringify(['story', 'education', 'motivation']),
    beforeState: '780K Instagram followers',
    afterState: 'Lost account, rebuilt with stronger foundations',
    specificNumbers: JSON.stringify({ followers_lost: '780,000' }),
    isSpecial: true, isRelevant: true, isQuantifiable: true, hasNames: false,
    villain: 'Platform dependency and algorithm',
    shadowFear: 'Fear that success can be taken away',
    isFavorite: true,
    tags: JSON.stringify(['resilience', 'platform-risk', 'rebuilding', 'mindset']),
  },
  {
    storyKey: 'sars_debt',
    title: 'SARS R207,879 Tax Debt',
    snippet: "SARS assessed me R207,879.20. Undeclared Meta income, 2020–2022. Nobody told me brand payments were taxable. Got an accountant. Filed amended returns. Penalties waived: R45,705. Final paid: R162,174 over 11 months.",
    fullVersion: "Nobody teaches creators about tax. I found out the hard way. SARS assessed R207,879.20 in undeclared brand income — three years of not knowing the rules. Filed amended returns. SARS waived R45,705.06 in penalties. Final debt: R162,174.14. Paid over 11 months at R17,000/month. Plus R30,000 in professional fees. Total cost of not having a structure: over R192,000. I tell you this not because it's comfortable. Because you need to know before SARS tells you first.",
    timeframe: '15-18s',
    emotion: 'Ignorance → Expert Guidance → Resolution',
    lesson: 'Track every brand payment from your first R1. SARS can see your Payfast. Get an accountant before you need one.',
    useFor: JSON.stringify(['Tax Education', 'Business Structure', 'Financial Systems', 'Creator Compliance']),
    contentPillars: JSON.stringify(['education', 'story', 'authority']),
    beforeState: 'R207,879.20 SARS assessment — undeclared Meta income 2020–2022',
    afterState: 'R162,174.14 final debt paid (R45,705.06 penalties waived). 11-month payment plan.',
    specificNumbers: JSON.stringify({ original_assessment: 'R207,879.20', penalties_waived: 'R45,705.06', final_paid: 'R162,174.14', professional_fees: 'R30,000' }),
    isSpecial: true, isRelevant: true, isQuantifiable: true, hasNames: true,
    villain: 'Financial illiteracy — no system for tracking taxable creator income',
    shadowFear: 'Fear of being exposed as bad with money / SARS catching up with you',
    isFavorite: false,
    tags: JSON.stringify(['tax', 'sars', 'business-structure', 'financial-literacy', 'compliance']),
  },
  {
    storyKey: 'family_shame_dropout',
    title: "Family Shame — The Dropout",
    snippet: "My family thought I was throwing my life away. 'Get a real job.' I chose to build instead. For their children's children.",
    fullVersion: "In our culture, you study. You get a job. You survive. When I chose content creation, I was choosing shame in the eyes of people I loved. They were not wrong to worry. They just could not see what I could see. I built this not to prove them wrong. I built it to show our family what is possible.",
    timeframe: '10-15s',
    emotion: 'Shame → Purpose → Legacy',
    lesson: 'Build for the generation coming, not the generation judging.',
    useFor: JSON.stringify(['Cultural Context', 'Purpose', 'African Creator', 'Legacy', 'Called Expert']),
    contentPillars: JSON.stringify(['story', 'motivation', 'identity']),
    beforeState: "Family expectations of traditional career, shame for choosing content creation",
    afterState: "Built a business that provides for family and proves what's possible",
    specificNumbers: Prisma.JsonNull,
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: false,
    villain: 'Cultural expectations and fear of family disapproval',
    shadowFear: 'Fear of being a disappointment',
    isFavorite: true,
    tags: JSON.stringify(['legacy', 'culture', 'family', 'african-creator', 'purpose']),
  },
  {
    storyKey: 'first_netflix_deal',
    title: 'First Netflix Deal',
    snippet: 'The day Netflix called. I almost thought it was spam. A content creator from Mzansi, on Netflix.',
    fullVersion: "I grew up watching Netflix. Never in any version of my life did I think Netflix would come to me. But that is exactly what happened. And when it did, I understood something — the called expert who shows up consistently, who builds real authority, does not chase the brand. The brand comes to them.",
    timeframe: '10-12s',
    emotion: 'Disbelief → Validation → Responsibility',
    lesson: 'Build authority so consistently that opportunities find you.',
    useFor: JSON.stringify(['Brand Deals', 'Authority', 'Called Expert', 'Social Proof', 'Mzansi']),
    contentPillars: JSON.stringify(['story', 'authority', 'social-proof']),
    beforeState: 'Unknown content creator from South Africa',
    afterState: 'Netflix partnership, international brand recognition',
    specificNumbers: JSON.stringify({ brand: 'Netflix' }),
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: true,
    villain: "Imposter syndrome — 'this can't be for me'",
    shadowFear: 'Fear that big opportunities are not for people like you',
    isFavorite: true,
    tags: JSON.stringify(['netflix', 'brand-deal', 'authority', 'social-proof', 'mzansi']),
  },
  {
    storyKey: 'content_burnout',
    title: 'The Content Burnout',
    snippet: 'I was posting every day and making nothing. Exhausted. Empty. Creating without a system will break you.',
    fullVersion: "There was a period where I was posting every single day. Reels, stories, TikToks, tweets — everything. And I was getting views. But I was making no money and I was exhausted. That burnout is what forced me to build a system. You do not need more content. You need a smarter system.",
    timeframe: '12-15s',
    emotion: 'Hustle culture → Collapse → System building',
    lesson: 'Volume without strategy is just exhaustion. Build systems, not streaks.',
    useFor: JSON.stringify(['Burnout', 'Systems', 'Content Creator Inspirer', 'Efficiency', 'DARES']),
    contentPillars: JSON.stringify(['education', 'story', 'problem-solution']),
    beforeState: 'Posting every day, exhausted, making no money',
    afterState: 'Built content systems that generate results without burnout',
    specificNumbers: Prisma.JsonNull,
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: false,
    villain: 'Hustle culture and volume-first mentality',
    shadowFear: 'Fear that you are not working hard enough',
    isFavorite: false,
    tags: JSON.stringify(['burnout', 'systems', 'efficiency', 'dares', 'creator-inspirer']),
  },
  {
    storyKey: 'samsung_partnership',
    title: 'Samsung Partnership',
    snippet: 'Samsung approached me. Not because I had the most followers. Because I had the right audience and the right authority.',
    fullVersion: "When Samsung came to me, I had not pitched them. They found me. And the conversation was not about my follower count — it was about my engagement, my audience's buying behaviour, and the authority I had built. That is the called expert advantage. You become undeniable to the right brands.",
    timeframe: '12-15s',
    emotion: 'Authority → Inbound opportunity',
    lesson: 'The right audience is worth more than a large audience.',
    useFor: JSON.stringify(['Brand Deals', 'Audience Quality', 'Called Expert', 'Authority', 'Niche']),
    contentPillars: JSON.stringify(['authority', 'story', 'social-proof', 'education']),
    beforeState: 'Building niche authority without massive follower count',
    afterState: 'Samsung partnership through inbound authority',
    specificNumbers: JSON.stringify({ brand: 'Samsung' }),
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: true,
    villain: 'Chasing follower count over audience quality',
    shadowFear: 'Fear that you need millions of followers to get brand deals',
    isFavorite: false,
    tags: JSON.stringify(['samsung', 'brand-deal', 'authority', 'niche', 'called-expert']),
  },
  {
    storyKey: 'ubuntu_principle',
    title: 'Ubuntu — I Am Because We Are',
    snippet: 'Ubuntu is not just a philosophy. It is my business model. Every person I help makes the whole movement stronger.',
    fullVersion: "In Venda and across African culture, we say: Umuntu ngumuntu ngabantu. A person is a person through other people. That is not just philosophy — it is strategy. Every creator I help build makes the content creator economy in South Africa stronger. When we win together, we win bigger.",
    timeframe: '10-15s',
    emotion: 'Personal belief → Community purpose → Movement building',
    lesson: 'Your success multiplied by others is legacy. Your success alone is just money.',
    useFor: JSON.stringify(['Community', 'African Creator', 'Legacy', 'Ubuntu', 'Purpose', 'Brand Ethos']),
    contentPillars: JSON.stringify(['identity', 'motivation', 'community', 'culture']),
    beforeState: 'Individual success mindset',
    afterState: 'Community-first movement building across African creator space',
    specificNumbers: Prisma.JsonNull,
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: false,
    villain: 'Scarcity mindset — "if others win, I lose"',
    shadowFear: 'Fear that helping others reduces your own success',
    isFavorite: true,
    tags: JSON.stringify(['ubuntu', 'community', 'legacy', 'african', 'purpose', 'movement']),
  },
]

export async function POST(request: NextRequest) {
  if (request.headers.get('x-internal-seed') !== '1') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const dbError = checkDatabase()
  if (dbError) return dbError

  try {
    // Skip stories that already exist for this user
    const existing = await prisma!.storyBankEntry.findMany({
      where: { userId: DEFAULT_USER_ID },
      select: { storyKey: true },
    })
    const existingKeys = new Set(existing.map((s: any) => s.storyKey))

    const toSeed = PROOF_STORIES.filter((s) => !existingKeys.has(s.storyKey))

    if (toSeed.length === 0) {
      return NextResponse.json({ success: true, seeded: 0, message: 'Already seeded' })
    }

    await prisma!.storyBankEntry.createMany({
      data: toSeed.map((s) => ({ userId: DEFAULT_USER_ID, ...s })),
    })

    return NextResponse.json({ success: true, seeded: toSeed.length })
  } catch (error: any) {
    console.error('Story seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
