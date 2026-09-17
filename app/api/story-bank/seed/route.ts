// ⛔ FACT-LOCK 2026-09-17 — this file is a claim surface. It seeds copy into the product DB.
// Never add a number here without a row in ~/Desktop/NOCHILL-OS/02-INFORMATION/PROOF_BANK.csv.
// BANNED: R132,500 · R600K/R600,000 or any annual total · R750→R100K · "R100,000 per post" ·
// Samsung R450,000 · Huawei as deal proof · Savanna R25K/R100K/R300K · AdSense R180,000 ·
// Netflix figures (under NDA) · "50 brand deals"/"40+ brands" · R285K/R207K/R162,174/R45,705 ·
// "SARS came for me" · "47 subscribers"/"50,000 email list" · "18% engagement" ·
// "600k"/"millions of followers"/"3 million" · R50K→R8K · R84K course · "6,000+ books sold" ·
// "R23,000 in ONE DAY" · 9/10 awards (say "award-winning") · R9,997–R18,000 · "Called Expert"/ICP1/ICP2/32–50.
// ⛔ NEVER name the employer, workplace, airport or industry. Never name a real private individual.
// Governing ICP: ~/Desktop/NOCHILL-OS/02-UNDERSTANDING/audience/U-A-007-icp-by-tier.md
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
    // ⛔ storyKey kept for reference resolution only. The R750→R100K escalation is BANNED (unsupported).
    // Ruled replacement: R15,000 standing rate → R45,000 once costed, April 2020 — same account, same week.
    storyKey: 'r750_to_r100k',
    title: 'R15,000 Standing Rate → R45,000 Once Costed',
    snippet: 'My standing rate was R15,000. Then one brief came in and I actually costed the work. I quoted R45,000. April 2020.',
    fullVersion: "My standing rate was R15,000. I did not arrive at it. I inherited it from the first person who ever said a number to me. Then a brief landed that was bigger than the number, and for the first time I sat down and costed the work — the shoot, the usage, the exclusivity, the time. R45,000. Same account. Same week. Nothing about me changed. The costing changed. My first deal was R350. The second was R750, the same month. I spent years pricing off that R750 instead of off the work.",
    timeframe: '15-18s',
    emotion: 'Ignorance → Mastery',
    lesson: 'Undercharging is not humility. It is ignorance. Learn your worth.',
    useFor: JSON.stringify(['Pricing', 'Brand Deals', 'Content Creator Inspirer', 'Monetisation']),
    contentPillars: JSON.stringify(['education', 'authority', 'story']),
    beforeState: 'Standing rate R15,000, never costed',
    afterState: 'R45,000 quoted once the scope was costed, April 2020',
    specificNumbers: JSON.stringify({ before: 'R15,000 standing rate', after: 'R45,000 once costed', date: 'April 2020', first_deal: 'R350', second_deal: 'R750 the same month' }),
    isSpecial: true, isRelevant: true, isQuantifiable: true, hasNames: false,
    villain: 'Undervaluing your own worth',
    shadowFear: 'Fear of asking for real money',
    isFavorite: true,
    tags: JSON.stringify(['monetisation', 'brand-deals', 'pricing', 'creator-inspirer']),
  },
  {
    storyKey: 'huawei_r6000_investment',
    title: 'R6,000 Phone, 2014',
    snippet: "In 2014 I put R6,000 of my own salary into a phone to start creating. That R6,000 bet on myself changed everything.",
    fullVersion: "Everyone talks about needing perfect conditions to start. In 2014 I took R6,000 out of my own salary. I bet it on a phone — and decided that this was my tool. Not a camera. Not a studio. A phone. Everything I built started with that one uncomfortable decision to invest in myself when I had the least.",
    timeframe: '10-12s',
    emotion: 'Scarcity → Abundance through action',
    lesson: 'Start with what you have. The conditions will never be perfect.',
    useFor: JSON.stringify(['Starting Out', 'Taking Action', 'Content Creator Inspirer', 'Resourcefulness']),
    contentPillars: JSON.stringify(['motivation', 'story', 'education']),
    beforeState: 'One salary, R6,000 spent on a phone, no other equipment',
    afterState: 'Built entire content business starting from that phone',
    specificNumbers: JSON.stringify({ investment: 'R6,000', year: '2014', source: 'own salary', tool: 'a phone' }),
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
    title: 'SARS R207,879.20 Assessment — Unpaid',
    snippet: "SARS assessed me R207,879.20 on undeclared content income. Nobody told me brand payments were taxable. I came forward instead of hiding — and I am still carrying it.",
    fullVersion: "Nobody teaches creators about tax. I found out the hard way. SARS assessed R207,879.20 in undeclared brand income — years of not knowing the rules. I came forward and corrected it rather than hiding, because hiding only makes the number grow. But I am not going to sell you a neat ending: it is not paid, and I carry it into every month I trade. That is what it costs to spend money that was never yours. So split every payment the day it lands — 25% SARS, 10% business, 65% yours. I tell you this not because it's comfortable. Because you need to know before SARS tells you first.",
    timeframe: '15-18s',
    emotion: 'Ignorance → Coming Forward → Still Carrying It',
    lesson: 'Track every brand payment from your first R1. SARS can see your Payfast. Reserve before it is owed — 25% SARS, 10% business, 65% yours.',
    useFor: JSON.stringify(['Tax Education', 'Business Structure', 'Financial Systems', 'Creator Compliance']),
    contentPillars: JSON.stringify(['education', 'story', 'authority']),
    beforeState: 'R207,879.20 SARS assessment on undeclared content income',
    afterState: 'Still unpaid, still carried — he came forward rather than hiding. Never claim it was paid off, cleared or settled.',
    specificNumbers: JSON.stringify({ original_assessment: 'R207,879.20', status: 'UNPAID — no payments started, still carried', reserve_rule: '35% Rule: 25% SARS / 10% business / 65% yours' }),
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
    // ⛔ storyKey kept for reference resolution only. The Netflix engagement is UNDER NDA —
    // publish no figure and no client name. Rewritten as the unnamed inbound-authority story.
    storyKey: 'first_netflix_deal',
    title: 'The Brand That Came To Me',
    snippet: 'The day a brand I grew up watching called me. I almost thought it was spam. A content creator from Mzansi.',
    fullVersion: "I grew up watching them. Never in any version of my life did I think they would come to me. But that is exactly what happened. And when it did, I understood something — the creator who shows up consistently, who builds real authority, does not chase the brand. The brand comes to them.",
    timeframe: '10-12s',
    emotion: 'Disbelief → Validation → Responsibility',
    lesson: 'Build authority so consistently that opportunities find you.',
    useFor: JSON.stringify(['Brand Deals', 'Authority', 'Called Expert', 'Social Proof', 'Mzansi']),
    contentPillars: JSON.stringify(['story', 'authority', 'social-proof']),
    beforeState: 'Unknown content creator from South Africa',
    afterState: 'An inbound international partnership. ⛔ Client is under NDA — never named, no figure.',
    specificNumbers: JSON.stringify({ brand: 'UNDER NDA — never name, never quote a figure' }),
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: true,
    villain: "Imposter syndrome — 'this can't be for me'",
    shadowFear: 'Fear that big opportunities are not for people like you',
    isFavorite: true,
    tags: JSON.stringify(['inbound-authority', 'brand-deal', 'authority', 'social-proof', 'mzansi']),
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
    // ⛔ storyKey kept for reference resolution only. The Samsung R450,000 / 18-month partnership
    // claim is DISPROVEN — evidence shows one week, March 2020, no fee. No brand named, no figure.
    storyKey: 'samsung_partnership',
    title: 'They Found Me',
    snippet: 'A brand approached me. Not because I had the most followers. Because I had the right audience and the right authority.',
    fullVersion: "When they came to me, I had not pitched them. They found me. And the conversation was not about my follower count — it was about my engagement, my audience's buying behaviour, and the authority I had built. That is the advantage. You become undeniable to the right brands.",
    timeframe: '12-15s',
    emotion: 'Authority → Inbound opportunity',
    lesson: 'The right audience is worth more than a large audience.',
    useFor: JSON.stringify(['Brand Deals', 'Audience Quality', 'Called Expert', 'Authority', 'Niche']),
    contentPillars: JSON.stringify(['authority', 'story', 'social-proof', 'education']),
    beforeState: 'Building niche authority without massive follower count',
    afterState: 'An inbound engagement won on authority, not reach',
    specificNumbers: JSON.stringify({ brand: 'not named — the Samsung deal claim is disproven' }),
    isSpecial: true, isRelevant: true, isQuantifiable: false, hasNames: true,
    villain: 'Chasing follower count over audience quality',
    shadowFear: 'Fear that you need a huge following to get brand deals',
    isFavorite: false,
    tags: JSON.stringify(['inbound-authority', 'brand-deal', 'authority', 'niche']),
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
