/**
 * POST /api/libraries/seed
 *
 * Seeds the three empty libraries from the NOCHILL-OS estate:
 *   · ICP Pain Library  ← U-A-002 / U-A-005, the ten symptom clusters
 *   · Hook Bank         ← the measured hooks, with the reach beside each
 *   · Story Bank        ← the ledger, safe figures only
 *
 * ⛔ FACT-LOCK. Every figure below has a row in PROOF_BANK.csv. Nothing here
 * may be edited to include: R132,500 · R600K · the employer's name · R100,000
 * per post · Samsung R450,000 · Savanna figures · AdSense R180,000 · Netflix
 * figures (NDA) · "50 brand deals" · any SARS penalty or final figure · "SARS
 * came for me" · "47 subscribers" · "18% engagement" · any award total.
 *
 * Note: the Prisma schema's own comments show `r750_to_r100k` as an example
 * storyKey. That is a banned figure. It is not used here.
 *
 * Created 2026-09-17.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const U = 'default-user-id'

/* ── ICP PAIN LIBRARY — their words, four surveys + ~250 DMs + 373 comments ── */
const PAINS = [
  {
    audienceLevel: 'established_creator', audienceSegment: 'The Blocked — money exists, a system holds it',
    painPoint: 'I have millions of views but I am not earning any money',
    painCategory: 'financial', painIntensity: 'critical',
    shadowFear: 'powerlessness', emotionalTrigger: 'The money is real, visible, and out of reach',
    symptoms: ['Page says "not yet eligible" with no reason given', 'Monetization tab greyed out',
               'Facebook wants a TIN they do not have', 'Country is not on the eligible list',
               'Appealed three times, same sentence back'],
    objections: ['I already followed every tutorial', 'I have been scammed trying to learn this before'],
    solutionType: 'system', contentPillar: 'OWN IT',
    hookAngles: ['Your page says "not yet eligible" and nobody will tell you why. I will tell you why.',
                 'You have millions of views and R0 in the bank. That is not the algorithm. That is one setting.'],
    storyMatches: ['account_switched_off', 'meta_remitted'],
    notes: '25+ inbound DMs — the #1 ask by a distance. `facebook content monetization` 43,674/mo. Appeal cluster 90,000+/mo. ENTRY tier. No product exists for this.',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'The Underpriced',
    painPoint: "I'm not sure about rates, but I would like to charge 5k",
    painCategory: 'knowledge', painIntensity: 'high',
    shadowFear: 'exposure', emotionalTrigger: 'Naming a price feels like claiming a rank',
    symptoms: ['Quotes a number they invented', 'Says "it depends" instead of a figure',
               'Lists their costs when asked for their prices', 'Never approached a brand because of low followers'],
    objections: ['Every deal is different', 'I negotiate case by case'],
    solutionType: 'framework', contentPillar: 'PRICE IT',
    hookAngles: ['You are accepting R750 for brand deals worth R15,000.',
                 'Two creators here charge R1,500 and R8,500 for the same post. One of you is wrong, and it is not a matter of opinion.'],
    storyMatches: ['rate_never_costed', 'first_deals'],
    notes: '25 real rate cards: 11 of 25 could not produce a priced list. Same Instagram story priced R200 to R6,000 — thirty times. CORE tier.',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'The Underpriced',
    painPoint: 'They ran my face on ads for months and I was paid for one post',
    painCategory: 'knowledge', painIntensity: 'high',
    shadowFear: 'being taken advantage of', emotionalTrigger: 'The loss is invisible until it is gone',
    symptoms: ['No end date on any deliverable', 'No exclusivity fee', 'No usage or licensing line on the invoice'],
    objections: ['They never offered to pay for that', 'Nobody else charges for it either'],
    solutionType: 'framework', contentPillar: 'PRICE IT',
    hookAngles: ['You charged R5,000 for the drive. You gave away the next twelve months for free.'],
    storyMatches: ['agency_rules'],
    notes: '9 of 25 charge for travel. 2 of 25 charge for usage rights. They price the petrol and give away the licence. `usage rights` scored the highest opportunity in its pull.',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'The Unreserved — does not know they are in it',
    painPoint: 'Ending 2025 with no savings again',
    painCategory: 'financial', painIntensity: 'critical',
    shadowFear: 'the letter that has not arrived yet', emotionalTrigger: 'Spent money that was never theirs',
    symptoms: ['Spends the whole payout', 'Has never moved a percentage aside', 'Does not know the provisional dates'],
    objections: ['I will deal with it at tax time', 'I do not earn enough for SARS to care'],
    solutionType: 'system', contentPillar: 'KEEP IT',
    hookAngles: ["If you're making money on your phone, you already owe SARS — and nothing has arrived to tell you."],
    storyMatches: ['sars_assessment'],
    notes: 'LATENT. Zero mentions of tax across four surveys and ~250 DMs — while TAX converts at 8.68%, best on the account, on a third of RATE traffic. `sars` 13,089/mo ZA. Demand must be created, not captured.',
  },
  {
    audienceLevel: 'contentpreneur', audienceSegment: 'The Switched-Off',
    painPoint: 'My account is no longer earning anything',
    painCategory: 'financial', painIntensity: 'critical',
    shadowFear: 'repetition — starting from zero again', emotionalTrigger: 'It was taken, and nobody explained',
    symptoms: ['"Limited originality"', '"Your ability to earn is limited"', 'Deleted most of their content and still nothing',
               'Asks whether it is safer to own an email list than a page'],
    objections: ['I have appealed already', 'Maybe the page is just dead'],
    solutionType: 'system', contentPillar: 'OWN IT',
    hookAngles: ['They switched it off, and there was nobody to phone.',
                 'You have started six things and gone back to none of them. I have done it in six places too.'],
    storyMatches: ['account_switched_off', 'followers_lost'],
    notes: 'PREMIUM tier. The buying signal is the only question in the 100-question bank where somebody worked out the mechanism themselves: "is it safer to own an email list than a Facebook page?"',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'Most of them have a job',
    painPoint: 'My biggest fear is leaving my job to concentrate on this',
    painCategory: 'time', painIntensity: 'high',
    shadowFear: 'wasted years', emotionalTrigger: 'The waiting has no date on it',
    symptoms: ['Waiting until they can go full time', 'Three years in, nothing built', 'Blames time'],
    objections: ['I do not have the hours', 'I will start properly when I quit'],
    solutionType: 'mindset_shift', contentPillar: 'BUILD IT ANYWAY',
    hookAngles: ['You are waiting until you can go full time. That is why it has been three years and there is nothing built.',
                 'Your shift is not the obstacle. It is the funding.'],
    storyMatches: ['built_around_the_job'],
    notes: '`9 to 5` is 2,434/mo in ZA and unclaimed. One creator with 100k+ followers asked for this unprompted: "how other influencers manage time if they are not full time."',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'Every tier',
    painPoint: "I've been scammed several times while trying to learn",
    painCategory: 'confidence', painIntensity: 'critical',
    shadowFear: 'being made a fool of again', emotionalTrigger: 'Paid to learn and got nothing',
    symptoms: ['Will not click a paid link', 'Asks for proof before anything else', 'Fake "Meta Support" DMs target them'],
    objections: ['How do I know you are not the same', 'Everyone says they can teach this'],
    solutionType: 'education', contentPillar: 'PROVE IT',
    hookAngles: ["I've been scammed too. Here's how to tell."],
    storyMatches: ['unprompted_reports'],
    notes: 'Blocks every sale at every tier. Appears in no other survey, no strategy document and no skill. Receipts first, offer second — always.',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'The provider',
    painPoint: 'Not being able to provide for my children',
    painCategory: 'financial', painIntensity: 'critical',
    shadowFear: 'failing the people who depend on them', emotionalTrigger: 'Someone else is counting on this working',
    symptoms: ['Names a dependant when asked about fear', 'Treats the brand as a rescue mission', 'Breadwinner'],
    objections: [],
    solutionType: 'system', contentPillar: 'KEEP IT',
    hookAngles: ["You didn't come here for followers."],
    storyMatches: ['mother_potatoes'],
    notes: '⭐ ~17 of 61 — the most repeated phrase in ANY dataset in the estate. This is the qualifying test: does another human being appear in their fear? If yes, customer. If it names an audience reaction, traffic.',
  },
  {
    audienceLevel: 'established_creator', audienceSegment: 'Consistency',
    painPoint: 'I am a consistent inconsistent creator',
    painCategory: 'time', painIntensity: 'high',
    shadowFear: 'being someone who never finishes', emotionalTrigger: 'Guilt, then a new channel',
    symptoms: ['High-motivation bursts then weeks of silence', 'Too many balls in the air', 'Starts and stops'],
    objections: ['I lack discipline', 'Life gets in the way'],
    solutionType: 'system', contentPillar: 'BUILD IT ANYWAY',
    hookAngles: ["You're not inconsistent. You're a starter with no return date."],
    storyMatches: ['six_channels'],
    notes: 'Not a character flaw — a pattern. Push, peak, stop. Six independent channels, the agency roster, and the survey itself: 47 responses in six days, 21 across the next seven months.',
  },
  {
    audienceLevel: 'beginner_creator', audienceSegment: '⛔ The Beginner Aspirant — NEVER SOLD TO',
    painPoint: 'My phone has low camera quality',
    painCategory: 'technical', painIntensity: 'medium',
    shadowFear: 'being seen and mocked', emotionalTrigger: 'Shame about the room, not the gear',
    symptoms: ['Blames equipment', 'Waiting for better gear', '"My background is dull and I am currently renting"'],
    objections: ['I need a better camera first'],
    solutionType: 'mindset_shift', contentPillar: null,
    hookAngles: ['Nobody skipped because of your camera. Say the real reason out loud.'],
    storyMatches: ['first_phone'],
    notes: '⛔ FREE TIER — content only, never sold to. Eight reels measured: replay ratio identical at 1.33–1.41 across winners and failures. The first two seconds separated them, not the camera. Five separate people named equipment — the most common objection.',
  },
]

/* ── HOOK BANK — measured, with the reach beside each ── */
const HOOKS = [
  { hookText: 'You are accepting R750 for brand deals worth R15,000.', hookType: 'statement',
    awarenessLevel: 'problem_aware', contentPillar: 'PRICE IT', shadowFear: 'exposure',
    unique: 'Second person + a rand figure they can locate themselves in', broadened: false,
    notes: '25,300 reach — the best-performing spoken hook on the account.' },
  { hookText: "If you're making money on your phone, you already owe SARS — and nothing has arrived to tell you.",
    hookType: 'statement', awarenessLevel: 'symptom_aware', contentPillar: 'KEEP IT', shadowFear: 'the unseen bill',
    unique: 'Presupposes income — someone not earning has nothing for it to land on', broadened: false,
    notes: '23,100 reach. TAX converts at 8.68%.' },
  { hookText: 'Your account can end tonight. Not suspended — ended. And there is nobody to phone.',
    hookType: 'pattern_interrupt', awarenessLevel: 'problem_aware', contentPillar: 'OWN IT', shadowFear: 'powerlessness',
    unique: 'Names the finality, then removes the escape', broadened: false,
    notes: 'His own: terminated end-2024, two appeals refused, the second final May 2025. Appeal cluster 90,000+/mo.' },
  { hookText: 'You have millions of views and R0 in the bank. That is not the algorithm. That is one setting.',
    hookType: 'statement', awarenessLevel: 'symptom_aware', contentPillar: 'OWN IT', shadowFear: 'powerlessness',
    unique: 'Two facts that cannot both be comfortable', broadened: false,
    notes: 'The #1 inbound ask — 25+ DMs. ENTRY tier, and nothing is built for it.' },
  { hookText: 'You finished the campaign, you posted, you got paid — and the brand has no idea whether it worked.',
    hookType: 'statement', awarenessLevel: 'problem_aware', contentPillar: 'PROVE IT', shadowFear: 'being forgotten',
    unique: 'Second-person accusation shape', broadened: false,
    notes: '22,800 against 1,676 for the category version.' },
  { hookText: 'You are waiting until you can go full time. That is why it has been three years and there is nothing built.',
    hookType: 'challenge', awarenessLevel: 'problem_aware', contentPillar: 'BUILD IT ANYWAY', shadowFear: 'wasted years',
    unique: 'Names the waiting, then prices it', broadened: false,
    notes: '`9 to 5` is 2,434/mo in ZA and unclaimed.' },
  { hookText: 'You charged R5,000 for the drive. You gave away the next twelve months for free.',
    hookType: 'statement', awarenessLevel: 'solution_aware', contentPillar: 'PRICE IT', shadowFear: 'being taken advantage of',
    unique: 'Names the invisible cost beside the visible one', broadened: false,
    notes: '9 of 25 price travel. 2 of 25 price usage rights.' },
  { hookText: 'Two creators in this comment section charge R1,500 and R8,500 for the same post. One of you is wrong, and it is not a matter of opinion.',
    hookType: 'statistic', awarenessLevel: 'problem_aware', contentPillar: 'PRICE IT', shadowFear: 'exposure',
    unique: 'The spread, stated without judgement', broadened: true,
    notes: '25 rate cards. Instagram story ranged R200 to R6,000 — thirty times.' },
  { hookText: "You didn't come here for followers.", hookType: 'pattern_interrupt',
    awarenessLevel: 'symptom_aware', contentPillar: 'KEEP IT', shadowFear: 'failing the people who depend on them',
    unique: 'Names the real reason before they do', broadened: true,
    notes: '⭐ ~17 of 61 named providing for family as their deepest fear — the most repeated phrase in any dataset. Handle with care, not volume.' },
  { hookText: "I've been scammed too. Here's how to tell.", hookType: 'story',
    awarenessLevel: 'symptom_aware', contentPillar: 'PROVE IT', shadowFear: 'being made a fool of again',
    unique: 'Concedes the objection before making the offer', broadened: true,
    notes: 'Answers the trust barrier that blocks every sale at every tier.' },
]

/* ── STORY BANK — ledger only. Every figure has a PROOF_BANK row. ── */
const STORIES = [
  { storyKey: 'rate_never_costed', title: 'The rate I never worked out',
    snippet: 'I quoted R15,000 for years and never once costed it. The first job I actually costed came to R45,000. Same account, same week.',
    timeframe: '10-12s', emotion: 'Mistake → Mastery', lesson: 'Your number becomes their ceiling, and you never see the budget.',
    useFor: ['Pricing', 'Undercharging', 'Agency negotiation'], contentPillars: ['PRICE IT'],
    beforeState: 'A standing rate carried for years, never costed',
    afterState: 'A number built from what the work actually costs',
    specificNumbers: { before: 'R15,000 standing rate', after: 'R45,000 once costed', when: 'April 2020' },
    isQuantifiable: true, isSpecial: true, villain: 'A number he invented and then defended',
    notes: 'E1. Paired quote from the buying side: "We had a number for this before we ever contacted you. You came in under it. We were never going to correct you."' },
  { storyKey: 'first_deals', title: 'R350, then R750 the same month',
    snippet: 'My first brand deal was R350. The second was R750, the same month. The only thing that changed was that I asked.',
    timeframe: '5-8s', emotion: 'Vulnerability → Agency', lesson: 'The price moved because he did, not because anything else did.',
    useFor: ['First deal', 'Starting from nothing', 'Asking'], contentPillars: ['PRICE IT', 'BUILD IT ANYWAY'],
    beforeState: 'R350', afterState: 'R750 the same month',
    specificNumbers: { first: 'R350', second: 'R750', year: '2017' },
    isQuantifiable: true, villain: 'Not asking',
    notes: 'E1. ⚠️ R200 was the first ONLINE payment — a different event. Do not merge them.' },
  { storyKey: 'account_switched_off', title: 'There was nobody to phone',
    snippet: 'My ad account was switched off at the end of 2024. I appealed twice. Both refused, the second one final. There was nobody to phone.',
    timeframe: '10-12s', emotion: 'Loss → Resolve', lesson: 'Platform income is rented ground.',
    useFor: ['Platform risk', 'Owning your audience', 'Demonetisation'], contentPillars: ['OWN IT'],
    beforeState: 'Earning from the platform', afterState: 'Two refusals and no recourse',
    specificNumbers: { appeals: 'two, both refused', final: 'May 2025', terminated: 'end-2024' },
    isQuantifiable: true, isSpecial: true, villain: 'A system with no phone number',
    notes: 'E1. The strongest OWN IT story he owns. Answers the 90,000+/mo appeal cluster honestly.' },
  { storyKey: 'sars_assessment', title: 'I went to SARS before they came to me',
    snippet: 'I went to SARS before they came to me. Nobody prompted me and nobody audited me. And it still went wrong.',
    timeframe: '10-12s', emotion: 'Honesty → Consequence', lesson: 'Coming forward is not the same as being safe.',
    useFor: ['Tax', 'Reserves', 'Compliance'], contentPillars: ['KEEP IT'],
    beforeState: 'Voluntary disclosure', afterState: 'An assessment still unpaid',
    specificNumbers: { assessed: 'R207,879.20', status: 'UNPAID — no payments started' },
    isQuantifiable: true, isSpecial: true, villain: 'Money spent that was never his',
    notes: '🔒 BOTH HALVES OR NEITHER. He may say he came forward voluntarily — lodged July 2025, unprompted, unaudited — AND that it was later withdrawn. ⛔ Never a penalty, final, monthly or month-count figure. Never "SARS came for me". Never R207K.' },
  { storyKey: 'meta_remitted', title: 'What platform money actually looks like here',
    snippet: 'Meta sent me $22,180.93 between 2021 and 2025 — inward telegraphic transfers into a South African account.',
    timeframe: '5-8s', emotion: 'Plain fact', lesson: 'Cross-border creator income is real, and it is smaller than people think.',
    useFor: ['Platform income', 'Foreign income', 'Tax on foreign earnings'], contentPillars: ['OWN IT', 'KEEP IT'],
    specificNumbers: { remitted: '$22,180.93', period: '2021–2025' },
    isQuantifiable: true, villain: 'The gap between what people imagine and what arrives',
    notes: 'E1, bank-confirmed. ⛔ Never sum with the "earned" or "by-product" Meta rows — they are three views of one pot.' },
  { storyKey: 'first_phone', title: 'The R6,000 phone',
    snippet: 'I bought my first smartphone in 2014 for about R6,000, out of my first salary.',
    timeframe: '5-8s', emotion: 'Constraint → Start', lesson: 'Start with your phone.',
    useFor: ['Equipment excuses', 'Starting from nothing'], contentPillars: ['BUILD IT ANYWAY'],
    specificNumbers: { cost: 'R6,000', year: '2014' },
    isQuantifiable: true, villain: 'Waiting for better gear',
    notes: '⚠️ For some of this audience, owning a phone IS the ask. One respondent depends on borrowing one. The line needs a second sentence for them.' },
  { storyKey: 'unprompted_reports', title: 'The report nobody asked for',
    snippet: 'I sent written performance reports to three agencies before anybody asked. One wrote back and said I was the only influencer who had ever done it.',
    timeframe: '10-12s', emotion: 'Diligence → Recognition', lesson: 'An agency has to report upward. Send it unasked and you are doing their homework.',
    useFor: ['Proof', 'Getting rebooked', 'Standing out'], contentPillars: ['PROVE IT'],
    beforeState: 'Deliver and go quiet', afterState: 'A three-month deal became six',
    specificNumbers: { agencies: 'three, independent', years: '2019–2020' },
    isQuantifiable: true, isSpecial: true, villain: 'Delivering and disappearing',
    notes: '⭐ Third-party character proof. It cannot be bought or faked, and unlike every reach number it does not decay.' },
  { storyKey: 'built_around_the_job', title: 'I never quit first',
    snippet: 'I never quit first. I built first — four-hour windows between night shifts, around a full time job.',
    timeframe: '8-10s', emotion: 'Constraint → Method', lesson: 'The job is the funding, not the obstacle.',
    useFor: ['Building while employed', 'Time', 'Excuses'], contentPillars: ['BUILD IT ANYWAY'],
    specificNumbers: { window: 'four hours', book: 'one hour a day for two years produced the first book' },
    isQuantifiable: true, villain: 'Waiting to quit',
    notes: '⛔ NEVER name the employer, the workplace, the airport or the industry. Write "a full time job", "night shifts", "on shift". Article IV. ⛔ State no lifetime earnings total.' },
  { storyKey: 'followers_lost', title: '780,000 gone',
    snippet: 'I lost 780,000 followers. The audience can go the same way the money can.',
    timeframe: '5-8s', emotion: 'Loss → Lesson', lesson: 'Nothing on rented ground is yours.',
    useFor: ['Platform risk', 'Owning your audience'], contentPillars: ['OWN IT'],
    specificNumbers: { lost: '780,000' },
    isQuantifiable: true, villain: 'Rented ground',
    notes: '⛔ NEVER DATED. No cause attributed. Both are rulings.' },
  { storyKey: 'mother_potatoes', title: 'R400 a month, four people',
    snippet: 'My mother earned about R400 a month picking potatoes. Four people lived on it.',
    timeframe: '5-8s', emotion: 'Origin', lesson: 'Where the standard came from.',
    useFor: ['Origin story', 'Provision', 'Why this matters'], contentPillars: ['KEEP IT'],
    specificNumbers: { earned: '~R400/month', supported: 'four people', died: '2011' },
    isQuantifiable: true, isSpecial: true, hasNames: false, villain: 'Poverty that was nobody\'s fault',
    notes: '⛔ Never name her. Article IV. Pairs with the most repeated fear in the estate — ~17 of 61 named providing for family.' },
  { storyKey: 'six_channels', title: 'Six channels, one shape',
    snippet: 'I have started six things and gone back to none of them. Push, peak, stop. I will show you the chart.',
    timeframe: '8-10s', emotion: 'Confession', lesson: 'Consistency is not discipline. It is a return date.',
    useFor: ['Consistency', 'The return', 'Beat 4'], contentPillars: ['BUILD IT ANYWAY'],
    specificNumbers: { channels: 'six', survey: '47 responses in six days, 21 across the next seven months' },
    isQuantifiable: true, isSpecial: true, villain: 'His own pattern',
    notes: '⭐ Beat 4. He is not selling a discipline he mastered — he is selling the system he built after failing six times, with the receipts.' },
]

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const force = new URL(request.url).searchParams.get('force') === 'true'
    const counts = {
      pains:   await prisma!.iCPPainLibrary.count({ where: { userId: U } }),
      hooks:   await prisma!.hookBank.count({ where: { userId: U } }),
      stories: await prisma!.storyBankEntry.count({ where: { userId: U } }),
    }
    const total = counts.pains + counts.hooks + counts.stories
    if (total > 0 && !force) {
      return NextResponse.json({
        success: true, skipped: true, counts,
        message: `${total} library entries already exist. Use ?force=true to reseed.`,
      })
    }
    if (force) {
      await prisma!.iCPPainLibrary.deleteMany({ where: { userId: U } })
      await prisma!.hookBank.deleteMany({ where: { userId: U } })
      await prisma!.storyBankEntry.deleteMany({ where: { userId: U } })
    }

    const p = await prisma!.iCPPainLibrary.createMany({ data: PAINS.map(x => ({ ...x, userId: U })) as any })
    const h = await prisma!.hookBank.createMany({ data: HOOKS.map(x => ({ ...x, userId: U })) as any })
    const s = await prisma!.storyBankEntry.createMany({ data: STORIES.map(x => ({ ...x, userId: U })) as any })

    return NextResponse.json({
      success: true,
      source: 'NOCHILL-OS estate — U-A-002 to U-A-007, PROOF_BANK.csv',
      seeded: { icpPainLibrary: p.count, hookBank: h.count, storyBank: s.count },
      message: `Seeded ${p.count} pain points, ${h.count} hooks and ${s.count} stories.`,
      factLock: 'Every figure has a PROOF_BANK row. Nothing banned was used.',
    })
  } catch (error: any) {
    console.error('Library seed error:', error)
    return NextResponse.json({ error: error.message || 'Seed failed' }, { status: 500 })
  }
}
