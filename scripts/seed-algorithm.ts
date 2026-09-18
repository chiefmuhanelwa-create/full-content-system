/**
 * Seeds the CREATIVE ALGORITHM into system_settings — the layer the generators read.
 *
 * Sources, all inside this machine's estate:
 *   product-lab/Knowledge Base/NOCHILL_Storytelling_Scripting_Master_Framework  (hooks, rehooking, arc)
 *   NOCHILL-OS/02-UNDERSTANDING/patterns/U-P-002-agency-patterns               (840 campaign emails)
 *   NOCHILL-OS/02-INFORMATION/IPs/                                              (20 named IPs)
 *   ~/.claude/CLAUDE.md                                                         (identity, ladder, fact-lock)
 *
 * ⛔ Article IV: no agency contact name, email or domain is seeded. Patterns only.
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env' }); dotenv.config({ path: '.env.local', override: true })
import { setKey } from '../lib/governance'

const HOOK_LIBRARY = {
  source: 'NOCHILL Storytelling & Scripting Master Framework — 52 proven templates',
  selectionRule: 'Pick by topic + awareness level + goal (GROW / SELL / NURTURE). Score every candidate with R×A×C×U^B before use.',
  categories: [
    { name: 'Curiosity/Teaser', use: 'Cold audience, unaware. Opens a loop without naming the answer.', templates: [
      'This is why {thing} isn\'t working… and it\'s not {common_excuse}.',
      'Nobody tells you this about {platform/skill}.',
      'I wish someone told me this before I {action}.',
      'Here are 3 things I\'d do if I had to start over with {topic}.',
      'I lost money until I fixed THIS one thing…',
      'You\'ve been taught wrong about {topic}. Let me show you.',
      'If you get this wrong, you\'ll waste {time/money}.',
      'Why do some creators get paid and others don\'t? It\'s this.',
      'This ONE change doubled my {metric}.',
      'The fastest way to {result} is not what you think.',
      'Here\'s the mistake that makes your content look professional but flop.',
      'Stop scrolling. This {feature} changes everything.',
      'These tools made my content 10x faster (and most are free).',
      'I\'m about to save you {time/money} with one setting.',
      'I didn\'t believe this worked… until I tested it.',
    ]},
    { name: 'Comparison', use: 'Problem-aware. Sets a wrong way against the right way.', templates: [
      'Most people do {bad_way}. The ones getting paid do {good_way}.',
      'Posting daily vs posting with a system — guess which makes money?',
      'Views vs leads — stop chasing the wrong metric.',
      'Don\'t do {mistake}. Do this instead.',
      'Old me: {behavior}. New me: {system}.',
      'Followers vs buyers — choose your scoreboard.',
      'Don\'t teach everything. Tease it, then guide them.',
      'Free tools vs paid tools — what actually matters is {principle}.',
      'Hook without a CTA vs hook with a CTA — huge difference.',
    ]},
    { name: 'Shock/Harsh Truth', use: 'The accusation opener. Highest performer on this account.', templates: [
      'You don\'t have a content problem. You have a follow-up problem.',
      'If you\'re afraid to sell, you\'ll stay talented and broke.',
      'Stop posting {type_of_content}. It\'s killing your growth.',
      'Nobody cares about your niche until you solve their pain.',
      'If nobody can buy from you, you\'re just entertaining strangers.',
      'Your content is a hobby until it has a funnel.',
    ]},
    { name: 'Question', use: 'Forces a self-audit. Strong for comment volume.', templates: [
      'Do you know how much ONE post makes you?',
      'What happens after someone likes your post?',
      'Why are you posting every day but still broke?',
      'Would you rather have 1M views or 100 buyers?',
      'What offer are you actually selling in your content?',
      'Can you explain your offer in 10 seconds?',
      'Are you a {tool} user? Here\'s the feature you\'re missing.',
    ]},
    { name: 'Authority/Pattern Interrupt', use: 'Solution-aware. Numbered, systemised, teachable.', templates: [
      'Every creator who gets paid has these 3 systems.',
      'Here\'s the 5-step content-to-cash flow I run daily.',
      'If your Reel doesn\'t do these 3 things, don\'t post it.',
      'Top 5 hooks that never fail (steal this).',
      'Posting more won\'t fix bad positioning.',
      'The algorithm isn\'t your problem. Your offer is.',
    ]},
    { name: 'Relatability/FOMO', use: 'Warm audience. Lowers the wall before a teach.', templates: [
      'I used to overthink hooks until I used this one formula.',
      'I posted for {time} with no money. Here\'s what changed.',
      'If content is draining you, you\'re doing it wrong.',
      'Your phone is not for scrolling. It\'s a printing press.',
      'If you don\'t fix this this week, you\'ll repeat the same year.',
      'Creators who know this are winning quietly.',
      'Never post on {platform} without turning on {setting}.',
    ]},
  ],
  spokenHookLaw: 'The SPOKEN hook opens in the second person, about the viewer, and presupposes income. "You are accepting R750 for brand deals worth R15,000." His own loss enters at beat 3, around ten seconds. First-person spoken openers measured 22.6% completion against 27.8% and 29.7%.',
  captionHookLaw: 'The CAPTION opens on HIS loss with a rand figure that exists in the ledger. Measured 25.5 median comments vs 3.0. Write both. Never reuse one as the other.',
}

const REHOOK = {
  why: 'Algorithms push on average view duration. Rehooking closes one curiosity loop and immediately opens another. After 3–4 closed loops the viewer feels you solved four problems; you solved one and created three.',
  target: '80–95% watch time',
  steps: ['Present the problem', 'Build tension to peak', 'Deliver the solve, close the loop', 'IMMEDIATELY open a new loop', 'Repeat'],
  phrases: [
    'But here\'s the thing most people miss…',
    'Now that alone would be enough, but there\'s a bigger problem…',
    'And that works, but ONLY if you also fix this…',
    'The real reason this matters isn\'t what you think…',
    'But wait — none of this works without…',
    'Here\'s where it gets interesting…',
    'That\'s step one. Step two is where the money actually comes from…',
  ],
  cadence: [
    { duration: '15s', rehooks: 1,     every: '5–7s',   structure: 'Hook → Tension → Rehook → CTA' },
    { duration: '30s', rehooks: 2,     every: '8–10s',  structure: 'Hook → Problem → Rehook → Solve → Rehook → CTA' },
    { duration: '60s', rehooks: '3–4', every: '12–15s', structure: 'Hook → Build → Rehook → Build → Rehook → Peak → CTA' },
    { duration: '90s', rehooks: '4–5', every: '15–20s', structure: 'Hook → Build → Rehook → Build → Rehook → Build → Peak → CTA' },
  ],
  note: 'Measured runtime for this account is 90–105s. Above ~160s completion collapses under 12%.',
}

const SCRIPT_PRINCIPLES = {
  source: 'The 4 non-negotiable scripting principles',
  principles: [
    { n: 1, name: 'Negativity Always Wins', rule: 'Lead with the cost, the loss, the mistake. Not the benefit.' },
    { n: 2, name: 'You Format', rule: 'Second person. The viewer is the subject, not the creator.' },
    { n: 3, name: 'Short & Simple As Possible', rule: 'Median sentence 5 words. 57.2% six words or fewer. Line breaks carry the punctuation.' },
    { n: 4, name: 'The Audible Flow Check', rule: 'Read it out loud. If you stumble, the viewer scrolls.' },
  ],
  advanced: {
    villain: 'Every script needs a villain. Usually the platform, the agency, or the advice he was given.',
    rootFor: 'Give the viewer something to root for — usually their own next deal.',
    sharability: 'Atomic sharability — one line someone can screenshot.',
    visuals: 'Paint the picture. If the hook says "I owed SARS R207,879.20", show a document, not a suit.',
  },
}

const SCRIPT_FORMATS = {
  rule: 'Pick ONE per piece. Never blend two — it reads as neither.',
  formats: [
    { key: 'personal',   name: 'Personal Story',  shape: 'Loss → Numbers → What changed → Lesson', use: 'Beat 4, the confession. Highest comment driver.', bank: 'FAILURE-BANK.md' },
    { key: 'case_study', name: 'Case Study',      shape: 'Before → Intervention → After → Transferable rule', use: 'Beat 8, the receipt. Needs an E1 row.', bank: 'CREDIBILITY-BANK.md' },
    { key: 'explainer',  name: 'Explainer',       shape: 'Misconception → Mechanism → Worked example → One action', use: 'Latent-demand topics like tax, where nobody is searching yet.' },
    { key: 'storytelling', name: 'Story Arc',     shape: 'Modern arc — cold open, no setup. Conflict first, context later.', use: 'Long-form and carousel.' },
  ],
  law: 'A confession without a receipt is a diary. A receipt without a confession is a brag. Every strong piece takes one from each.',
}

const CTA_LIBRARY = {
  rule: 'No content publishes with a CTA that has no destination. Do not mint a tenth keyword.',
  mechanism: 'Comment-to-DM via ManyChat. "Must be following" — Instagram blocks DMs from non-followers, and that line converts as a filter.',

  // ⚠️ `status` and `converts` are TWO DIFFERENT THINGS and were previously one word.
  //
  //   status   — WHERE a comment lands.   live = automated · manual = fulfilled by hand ·
  //              orphaned = nowhere. Article XI: only live and manual may ship.
  //   converts — WHAT it does when it lands. Measured, not asserted.
  //
  // TAX was marked "unverified" here while the measured record had it as the BEST-converting
  // keyword on the account at 8.68%. Both were true: it converts, and its ManyChat flow is
  // not automated. One word carrying both meanings meant the generators, which filter on
  // status === 'live', silently refused to use the best keyword he has.
  keywords: [
    { k: 'RATE',     status: 'live',     converts: '5.75%', pillar: 'PRICE IT', destination: 'Rate Card Pro', note: '636 comments on its best reel — the highest on the account.' },
    { k: 'TAX',      status: 'manual',   converts: '8.68%', pillar: 'KEEP IT',  destination: 'ManyChat flow specced, fulfilled by hand until ManyChat Pro', note: 'Best rate on the account, on a third of RATE traffic.' },
    { k: 'GUIDE',    status: 'live',     converts: null,    pillar: 'OWN IT',   destination: 'Starter Kit (in bio)', note: 'Founder-confirmed live, volume unrecorded (D-53).' },
    { k: 'RENT',     status: 'manual',   converts: null,    pillar: 'OWN IT',   destination: 'scorecard', note: 'Used in the last 8 posts, absent from the estate. Unverified, not dead.' },
    { k: 'BOOK',     status: 'orphaned', converts: null,    pillar: 'BUILD IT ANYWAY', destination: null, note: '143 comments with nowhere to land.' },
    { k: 'PAID',     status: 'orphaned', converts: null,    pillar: 'PROVE IT', destination: null, note: '35 comments, PAIDS map promised.' },
    { k: 'CONTENT',  status: 'orphaned', converts: null,    pillar: 'BUILD IT ANYWAY', destination: null, note: '61 comments.' },
    { k: 'RESEARCH', status: 'orphaned', converts: null,    pillar: 'PROVE IT', destination: null, note: '81 comments.' },
  ],
  shippable: ['live', 'manual'],
  warning: 'A keyword without a destination converts nothing AND loses the comment. Wire it or reuse one that resolves.',
  suspended: 'The orphaned-comment counts above are SUSPENDED (R14) — built on a stale list that wrongly called RATE dead. Re-derive from live ManyChat and comment data before quoting any number.',
}

const IPS = {
  rule: 'Named, ownable methods extracted from what he already does. The bank holds 146 frameworks, 101 latent. The canonical cap is 19.',
  register: [
    { name: 'The Minimum-Viable-Rate',          stage: 'Pricing',       solves: 'Pricing by guessing. 11 of 25 creators could not produce a rate card.' },
    { name: 'The Fifty-Percent-Rejection-Rule', stage: 'Pricing',       solves: 'If nobody rejects your rate, it is too low.' },
    { name: 'The Follower-to-Income-Ratio',     stage: 'Pricing',       solves: 'Famous is not paid, made measurable.' },
    { name: 'The Receivables-Chase-Cadence',    stage: 'Money in',      solves: 'C-0412 E1 — five chases in 18 months, one uncovered a failed payment batch.' },
    { name: 'The Verified-Figure-Gate',         stage: 'Truth',         solves: 'Ten stated figures all drifted upward and none down.' },
    { name: 'The Decay-Curve-Audit',            stage: 'The Return',    solves: 'Every artifact ages. Rate card, reachable list, reserve.' },
    { name: 'The Third-Repetition-Rule',        stage: 'The Return',    solves: 'Anything done three times becomes a system.' },
    { name: 'The Owned-Audience-Migration-Model', stage: 'Ownership',   solves: 'Moving people off rented land onto the list.' },
    { name: 'The Concentration-Stress-Test',    stage: 'Ownership',     solves: 'What breaks if one platform ends tomorrow.' },
    { name: 'The Demand-Heatmap',               stage: 'Ownership',     solves: 'Where demand actually is vs where you post.' },
    { name: 'The Unprompted-Report-Protocol',   stage: 'Brand collab',  solves: 'Three agencies; one replied he was the only influencer who had ever done it.' },
    { name: 'The Five-Stream-Revenue-Grid',     stage: 'Monetisation',  solves: 'PAIDS, audited rather than aspired to.' },
    { name: 'The Asset-Qualification-Standard', stage: 'Monetisation',  solves: 'DARES — is it actually Recurring?' },
    { name: 'The Cause-Chain-Script-Engine',    stage: 'Production',    solves: 'Why the script lands, not just what it says.' },
    { name: 'The One-Record-Four-Format-Chain', stage: 'Production',    solves: 'One recording becomes reel, carousel, email, long form.' },
    { name: 'The Four-Criteria-Proof-Filter',   stage: 'Production',    solves: 'Which proof to spend, and when.' },
    { name: 'The Methodology-Naming-Formula',   stage: 'IP',            solves: 'How a method becomes a named, sellable thing.' },
    { name: 'The IP-Documentation-Standard',    stage: 'IP',            solves: 'What a framework must contain to be ownable.' },
    { name: 'The Twelve-Handoff-Enrolment-Pipeline', stage: 'Sales',    solves: 'Where an enrolment actually breaks.' },
    { name: 'The Six-Month-Exit-Trigger',       stage: 'Governance',    solves: 'When to stop something that is not working.' },
  ],
}

const IDENTITY = {
  mission: 'For children\'s children. The test of any asset is whether someone else could run it for six months without him.',
  vision: 'Contentpreneur Africa as the institution that teaches African creators to keep what they earn.',
  message: 'Famous is not paid.',
  messageNote: 'The only line of his any audience member ever repeated back, unprompted, across 373 comments.',
  institutionalLine: 'Turn What You Know Into Income You Own — contentpreneur.africa only.',
  values: [
    { name: 'Ubuntu', means: 'Umuntu ngumuntu ngabantu. The work exists because of other people, and returns to them.' },
    { name: 'Receipts before rhetoric', means: 'A number without a source does not ship. An empty slot beats a plausible filler.' },
    { name: 'Confession with the receipt', means: 'He teaches from what went wrong, with the record attached.' },
    { name: 'Faith as operating system', means: 'Natural, never preachy. One line, never a paragraph.' },
    { name: 'Duty of care', means: 'The vulnerability that makes the content work surfaces people in crisis. Never automate or sell into a crisis reply. SADAG 0800 567 567.' },
    { name: 'Own the land', means: 'Social is rented. The list is owned.' },
  ],
  entity: 'NOCHILL PTY LTD, Reg. 2016/507839/07. Contentpreneur Africa is the institution; chkplt.com is the storefront.',
}

const AGENCY_INTEL = {
  source: '840 campaign emails. 27 agencies, 30 brands — and that is an UNDERCOUNT.',
  privacy: '⛔ Article IV — no agency contact name, email or domain is stored in this system. Patterns only.',
  fourRules: [
    { n: 1, rule: 'The agency asks for your rate card BEFORE it proposes a budget to the client.',
      why: 'Your number sets their number. A rate card you have not costed becomes the ceiling on a budget you never see.',
      quote: 'We had a number for this before we ever contacted you. You came in under it. We were never going to correct you.',
      counter: 'Ask for the budget range first. If refused, quote from your costed floor, never from memory.' },
    { n: 2, rule: 'Nobody pays upfront. Ever. Invoice at the end of the campaign, paid end of month.',
      why: 'A creator with no reserve is financing the brand\'s campaign out of their own pocket.',
      counter: 'Price the delay in. Hold the 35% reserve from the moment money ARRIVES, not when it is promised.' },
    { n: 3, rule: 'The invoice goes to the agency\'s billing contact, never the brand.',
      why: 'The logo in the post is not the entity that owes you money.',
      counter: 'Get the billing contact and payment terms in writing before you shoot.' },
    { n: 4, rule: 'They ask a competitor question — and that is exclusivity with no price on it.',
      why: 'One documented campaign carried banking-category exclusivity for the campaign period. The fee was R10,500 for one Instagram reel.',
      counter: 'Exclusivity is a line item. Two of twenty-five creators priced usage or duration. Nine priced travel. The agencies have asked this for six years and got it free.' },
  ],
  theyAskFor: ['ID number', 'home address', 'contact number', 'bank details', 'competitor check', 'audience stats', 'rate card', 'content concept', 'compliance'],
  riskNote: 'Handing over an ID number and a home address is normal in this business. The creator has no equivalent record of who holds that data.',
  patterns: [
    'The brand gets the credit. The agency owes the money.',
    'Agency money arrives in pieces. Brand money arrives whole.',
    'Contracted, invoiced and received are three different words.',
    'One year carried the entire roster.',
    'The unprompted report worked on AGENCIES specifically. That is not a coincidence.',
    'He chased his own invoice twice and got paid.',
  ],
  retainer: 'R12,500/month — 40 meme reels a month plus bio link and affiliate. The only recurring line in the entire record, and the most under-used receipt in the estate.',
}

const KPI_MODEL = {
  rule: 'Every post carries ONE goal set before it ships. A post without a KPI cannot fail, which means it cannot teach.',
  goals: [
    { goal: 'GROW',    primary: 'reach',    secondary: 'shares',   pass: 'reach >= 1.2x trailing median' },
    { goal: 'NURTURE', primary: 'comments', secondary: 'saves',    pass: 'comments >= trailing median' },
    { goal: 'SELL',    primary: 'CTA comments', secondary: 'DM opens', pass: 'keyword comments >= 20' },
  ],
  benchmarks: {
    note: 'Set from this account, re-derive after each sync. Volume is not the constraint — Sept 2025 was the highest-volume month at 35 posts and one of the worst performing.',
    postsPerWeek: 4,
    reelRuntimeSeconds: '90-105',
    postHoursSAST: '18:00-22:00',
    neverPost: 'Friday — index 0.76',
    formatFinding: 'Carousels out-reach reels 2.2x and 2.7x across two windows. He posts 137 reels for every 14 feed posts.',
  },
  loop: 'Script -> Post -> Measure against the KPI -> Pass/Fail -> the failure reason feeds the next batch. Three failures on the same reason becomes a rule (The Third-Repetition-Rule).',
}

async function main() {
  const entries: [string, any][] = [
    ['hook_library', HOOK_LIBRARY],
    ['rehook', REHOOK],
    ['script_principles', SCRIPT_PRINCIPLES],
    ['script_formats', SCRIPT_FORMATS],
    ['cta_library', CTA_LIBRARY],
    ['ips', IPS],
    ['identity', IDENTITY],
    ['agency_intel', AGENCY_INTEL],
    ['kpi_model', KPI_MODEL],
  ]
  for (const [k, v] of entries) {
    await setKey(k, v, 'seed:algorithm-2026-09-17')
    const size = JSON.stringify(v).length
    console.log(`  ${k.padEnd(20)} ${String(size).padStart(6)} bytes`)
  }
  console.log(`\n  ${entries.length} algorithm keys seeded.`)
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
