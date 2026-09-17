/**
 * seed-from-estate.ts
 *
 * Loads the current, ruled NOCHILL-OS data into full-content-system.
 * Run:  npx tsx scripts/seed-from-estate.ts
 *
 * Source of truth — in this order:
 *   NOCHILL-OS/00-CONTROL/DECISIONS.md          R13 · R15 · R16 · R17
 *   NOCHILL-OS/02-UNDERSTANDING/audience/       U-A-002 → U-A-007
 *   NOCHILL-OS/02-INFORMATION/PROOF_BANK.csv    every figure
 *   ~/.claude/CLAUDE.md v1.2                    the global fact-lock
 *
 * ⛔ Everything written here is fact-locked. No figure appears that does not have
 * a PROOF_BANK row. The old seed data this replaces carried R132,500, R600K, the
 * employer's name and the retired "Called Expert" persona.
 *
 * Writes ONLY to content_system.*  — never to public, which holds the live store.
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()
const U = 'default-user-id'
const ESTATE = join(process.env.HOME || '', 'Desktop/NOCHILL-OS')

/* ═══ 1 · THE RULES — SystemSetting, the config store ═══ */

const SETTINGS: { key: string; category: string; value: any }[] = [
  {
    key: 'icp', category: 'governance',
    value: {
      ruled: '2026-09-17 · R15',
      customer: 'The creator whose income is decided by somebody else, and who finds out afterwards.',
      gate: [
        'Money has moved, or money is visibly blocked. Not follower count, not niche.',
        'Does another human being appear in their fear? "Provide for my kids" = customer. "Get 0 likes" = traffic.',
      ],
      evidence: '~17 of 61 named provision as their deepest fear — the most repeated phrase in any dataset.',
      mechanism:
        'Meta decides eligibility, country and "originality". The agency asks for your rate card BEFORE setting a budget, never pays upfront, invoices through itself, and takes exclusivity free. Two money systems, one identical experience. That is what "Famous is not paid" means.',
      tiers: [
        { tier: 'FREE',    price: 'R0',            name: 'The Beginner Aspirant',          rule: '⛔ NEVER SOLD TO. Content only.', evidence: '203 of 290 — 70.0% — do not create content at all.' },
        { tier: 'ENTRY',   price: 'R350–R499',     name: 'The Blocked',                    rule: 'Money exists, a system holds it.', evidence: '25+ DMs, the #1 ask. 43,674/mo. Appeal cluster 90,000+/mo. NO PRODUCT EXISTS.' },
        { tier: 'CORE',    price: 'R1,500–R1,800', name: 'The Underpriced & Unreserved',   rule: 'Money arrives and leaks.',        evidence: 'Two people paid R1,606.47 the same night — the only price with two independent buyers.' },
        { tier: 'PREMIUM', price: '$499 / R9,000', name: 'The Asset-Backed Contentpreneur', rule: '🔒 Internal name only — "asset" is retired from public use.', evidence: 'Had it, lost it. The only tier whose language turns to legacy.' },
      ],
      retired: ['ICP1 "Called Expert" 32–50 at R9,000–R45,000', 'the ICP1/ICP2 split', 'the Sipho/Lerato personas'],
      whyRetired: 'Never measured. When it finally was: median age 21, two people over 32 out of 70, zero purchasers.',
    },
  },
  {
    key: 'pillars', category: 'governance',
    value: {
      ruled: '2026-09-01, mapped to tiers 2026-09-17 · R16',
      rotation: 'One pillar per week, five-week rotation.',
      pillars: [
        { k: 'KEEP IT',         pct: 30, sells: 'CORE + ENTRY',      why: 'TAX converts at 8.68% — best keyword on the account, on a third of RATE traffic. `sars` 13,089/mo ZA. Zero unprompted mentions across four surveys.' },
        { k: 'PRICE IT',        pct: 25, sells: 'CORE',              why: '11 of 25 could not produce a rate card. Same story priced R200 to R6,000. Brand deals 19,420/mo.' },
        { k: 'OWN IT',          pct: 20, sells: 'ENTRY + PREMIUM',   why: '25+ DMs — the #1 ask. Appeal cluster 90,000+/mo. His account terminated, two appeals refused.' },
        { k: 'BUILD IT ANYWAY', pct: 15, sells: 'CORE',              why: '`9 to 5` 2,434/mo in ZA, unclaimed. A 100k+ creator asked for it unprompted.' },
        { k: 'PROVE IT',        pct: 10, sells: 'PREMIUM',           why: 'Three agencies got unprompted reports. One said he was the only influencer who ever had.' },
      ],
      tension: 'OWN IT is weighted 20% and serves the largest measured audience. PRICE IT is 25% and serves the smallest. The weights are ruled — raise the conflict, do not act on it.',
      superseded: ['Knowledge→Income 50 / Creator Finance 20 / Founder Stories 20 / Ownership Thinking 10',
                   'PAIDS as a content rotation — it is an income model, not a pillar set'],
    },
  },
  {
    key: 'algorithm', category: 'measured',
    value: {
      source: 'S-091 · live Instagram Graph API, 2026-09-01',
      cadence: [
        { rule: '4 posts a week — not 35 a month', why: 'September 2025 was his highest-volume month (35 posts) and one of his worst, at 1,758 median reach.' },
        { rule: 'Never Friday',      why: 'Index 0.76, median saves 5 — the only genuinely bad signal in the data.' },
        { rule: 'Post 18:00–22:00',  why: '22:00 indexes 1.14, 18:00 1.07. But time swings ±15% and content swings 800%.' },
        { rule: 'Saturday is fine',  why: 'Indexes 1.08 — the highest day.' },
        { rule: 'Reels 90–105 seconds', why: 'Above ~160s completion collapses under 12%.' },
      ],
      formats: { finding: 'Carousels out-reach reels 2.2× and 2.7× across two independent windows — and need no camera.',
                 imbalance: 'He posts 137 reels for every 14 feed posts.',
                 caveat: 'n=4 per window. Directionally consistent — test with volume, do not assume.' },
      hooks: { spoken: 'Second person, about the viewer, presupposes income. His own loss enters at beat 3, ~10 seconds.',
               caption: 'Opens on HIS loss with a rand figure. 25.5 median comments vs 3.0.',
               warning: 'Write both. Never reuse one as the other.' },
      screen: { rule: '4–6 words, capitals, static 3 seconds, no cut.',
                evidence: 'Lowest skip measured 42.1%. Above 54% skip, no post has exceeded 3,000 views — six of six.' },
      audience: { followers: 270283, source: 'API 2026-09-01', za: '75.7%', age2534: '56.8%', medianEngagement: '2.78%' },
    },
  },
  {
    key: 'voice', category: 'governance',
    value: {
      persona: 'Big brother who went through it. Direct, warm, confrontational-with-love. Ubuntu. Faith as operating system — one line, never a paragraph.',
      measured: { medianSentence: '5 words', sixOrFewer: '57.2%', punctuation: 'Line breaks carry it.' },
      plainSpeech: {
        rule: 'Never leave an industry term sitting on its own. The next few words must say what it means in ordinary language.',
        examples: [
          'Not "your engagement rate" — "your engagement rate, which is just how many people react to what you post"',
          'Not "provisional tax" — "provisional tax, which means you pay SARS twice a year instead of once"',
        ],
        law: 'A lesson with no explanation is not a lesson. It is a word.',
      },
      never: ['delve', 'leverage', 'synergy', 'utilise', 'certainly', 'absolutely', "I'd be happy to", "it's important to note"],
      sa: { spelling: 'colour, organise, realise', money: 'R199 and R1,800 — never R 199 or R199.00', bodies: 'SARS, CIPC, PTY LTD — never IRS, LLC, SEC' },
      signature: ["That's why you're broke", 'Start with your phone', "You can't be shy and broke"],
      message: 'Famous is not paid.',
      echoes: { tax: 12, contentpreneur: 5, note: 'Measured across 373 comments. The only words anybody has ever repeated back.' },
      zeroEchoes: ['River–Fish–Tank', '"asset" as a public noun', '"Knowledge Entrepreneur"'],
    },
  },
  {
    key: 'fact_lock', category: 'governance',
    value: {
      law: 'A number without a source does not ship. An empty slot beats a plausible filler.',
      safe: [
        { fig: 'R15,000 → R45,000', note: 'Standing rate, against the costed job. April 2020, same account, same week.' },
        { fig: 'R350 then R750',     note: 'First brand deal, second the same month.' },
        { fig: 'R23,524',            note: 'Affiliate commission across MARCH 2019 — a month, not a day. 41.6% of all affiliate commission ever.' },
        { fig: 'R207,879.20',        note: 'SARS assessment. UNPAID, no payments started. Never rounded.' },
        { fig: '$22,180.93',         note: 'Remitted from Meta 2021–2025 by inward telegraphic transfer.' },
        { fig: 'R453,710.37',        note: 'Lifetime bank-confirmed receipts, 27 of 55 rows.' },
        { fig: '780,000 followers lost', note: '⛔ NEVER DATED. No cause attributed.' },
        { fig: 'Two appeals, both refused', note: 'Ad account terminated end-2024. Second refusal final, May 2025.' },
        { fig: '19 brands, 23 agencies', note: 'Conservative — the directory names 27 agencies from 840 emails.' },
        { fig: '270,283', note: 'Instagram followers, API-confirmed.' },
        { fig: '173', note: 'The email list.' },
      ],
      banned: [
        'R132,500 — disproven across 681 records',
        'R600K / R600,000 / any annual or lifetime total above R453,710.37',
        'the employer, the workplace, the airport, the industry — write "a full time job" / "night shifts"',
        'R100,000 per post · R750→R100K',
        'Samsung R450,000 · Huawei as deal proof',
        'Savanna R25K/month · R100K · R300K campaign month',
        'AdSense R180,000 · "Ads & Affiliates R800,000+"',
        'Netflix — under NDA, publish no figure and no client name',
        '"50 brand deals" / "50+" / "40+ brands"',
        'any SARS penalty, final, monthly or month-count figure · "SARS came for me"',
        '"47 subscribers" · "50,000 email list" · "18% engagement"',
        '"600k" / "millions of followers" / "3 million"',
        'any award TOTAL — say "award-winning"',
        '1,643 / 1,197 survey totals — D-73 open, cite none',
        'R300,000 a month — D-76, the estate disproves it in four files',
      ],
      sarsRule: 'Permitted only as: "I went to SARS before they came to me. Nobody prompted me and nobody audited me. And it still went wrong." He may add he came forward voluntarily — lodged July 2025, unprompted, unaudited — AND that it was later withdrawn. BOTH HALVES OR NEITHER.',
      articleIV: 'No real person is ever named. Not a client, lead, employer, family member, village or tax practitioner. Companies only.',
    },
  },
  {
    key: 'cta_keywords', category: 'measured',
    value: {
      rule: 'A keyword with no destination converts nothing and loses the comment. Do not mint a tenth.',
      keywords: [
        { k: 'TAX',      status: 'live',    conversion: '8.68%', note: 'Best-converting keyword on the account, on a third of RATE traffic.' },
        { k: 'RATE',     status: 'live',    conversion: '5.75%', note: 'On 3× the traffic of TAX.' },
        { k: 'GUIDE',    status: 'unknown', note: 'In the bio, founder-confirmed live, volume unrecorded — D-53.' },
        { k: 'BOOK',     status: 'orphan',  note: 'Tracked, no destination group.' },
        { k: 'RESEARCH', status: 'orphan',  note: 'Tracked, no destination group.' },
        { k: 'CONTENT',  status: 'orphan',  note: 'Tracked, no destination group.' },
        { k: 'PAID',     status: 'orphan',  note: 'Tracked, no destination group.' },
        { k: 'RENT',     status: 'unknown', note: 'Used in recent posts, absent from the estate.' },
      ],
      suspended: 'The orphaned-comment count is SUSPENDED (R14). It was built on a stale list that wrongly called RATE dead. Re-derive from live ManyChat and comment data before quoting any number.',
    },
  },
  {
    key: 'ledger_totals', category: 'governance',
    value: {
      warning: '⛔ NEVER SUM A COLUMN IN PROOF_BANK. It mixes money that arrived with money merely invoiced or contracted. That is how R132,500 happened.',
      received:   { zar: 453710.37, rows: 27, note: 'Bank-confirmed lifetime receipts, 2017–2025. THE ONLY quotable lifetime figure.' },
      invoiced:   { zar: 113052.00, rows: 4,  note: 'Sent, not confirmed. Say "I invoiced" — never "I earned".' },
      contracted: { zar: 146400.00, rows: 6,  note: 'Signed, not invoiced. Say "I was contracted at".' },
      unconfirmed: { zar: 259452.00, rows: 10, note: 'Invoiced + contracted. The biggest numbers in his record are disproportionately the ones that did not land.' },
      meta: { usd: 22180.93, note: 'Remitted 2021–2025. ⛔ The Meta USD rows are three views of one pot — remitted $22,180.93, earned $19,127.51, by-product $18,469.07. Summing them triple-counts. Quote remitted only.' },
      revenueTableNote: '⛔ The Revenue table holds 35 received ZAR rows summing to R499,083.30. That is NOT the lifetime figure and must never be displayed as one. The RULED lifetime figure is R453,710.37 across 27 rows. The two do not reconcile from the CSV alone — see D-86. Always display received.zar, never a computed sum.',
      discrepancy: { computed: 499083.30, computedRows: 35, ruled: 453710.37, ruledRows: 27, gap: 45372.93, defect: 'D-86 — the 27-row definition is not reproducible from PROOF_BANK.csv. Needs a founder ruling on which rows are in.' },
    },
  },
  {
    key: 'search_demand', category: 'measured',
    value: {
      caveats: ['Never quote a growth figure — four unrelated keywords returned identical baselines to four decimal places.',
                'Volumes are YouTube-derived. The Google picture is unmeasured. TikTok volume is not measurable.',
                'Instagram has no search-volume API. Meta removed it.'],
      topZA: [{ q: 'digital products', v: 19955 }, { q: 'sars', v: 13089 }, { q: '9 to 5', v: 2434, note: 'BUILD IT ANYWAY — unclaimed' }],
      emptiest: [
        { q: 'how to create a sales funnel for digital products', v: 13550, comp: 6.5 },
        { q: 'how to track brand deals as content creator',      v: 5326,  comp: 7.7, note: 'Deal Tracker already built' },
        { q: 'what can you tax write off as a content creator',  v: 3462,  comp: 8.5 },
        { q: 'how to file salary and content creator tax return', v: 4663, comp: 10.3, note: 'Employed AND earning — exactly his position' },
      ],
      biggest: [{ q: 'how to earn facebook content monetization', v: 43674 }, { q: 'demonetisation appeal cluster', v: 90000 }],
      titleRule: 'They say "brand deal" to GET one and "sponsorship" to PRICE one. Title with their words. Convert with his. Never "creator tax" — near-zero in ZA.',
    },
  },
]

/* ═══ 2 · REVENUE — only what has a PROOF_BANK row ═══ */

function loadRevenue() {
  // ⛔ PROOF_BANK.csv has quoted fields containing commas. A naive split misreads
  // columns — which is how an earlier pass here produced a total R42,000 too high.
  // data/revenue-received.json is generated with a real CSV parser and EXCLUDES:
  //   · 10 rows that were invoiced or contracted but never received (R259,452)
  //   · the refunded R9.00
  //
  // ⚠️ Its sum is R499,083.30 across 35 rows. The RULED lifetime figure is
  // R453,710.37 across 27 rows. THEY DO NOT MATCH, and this script does not try to
  // force them to. The 27-row definition is not reproducible from the CSV alone —
  // logged as a defect. Never display this sum as the lifetime total. Read
  // settings.ledger_totals.received instead.
  return JSON.parse(readFileSync(join(process.cwd(), 'data/revenue-received.json'), 'utf8'))
    .map((r: any) => ({ ...r, userId: U, date: new Date(r.date) }))
}

/* ═══ RUN ═══ */

async function main() {
  console.log('\n  Seeding full-content-system from NOCHILL-OS\n')

  await prisma.user.upsert({
    where: { id: U }, update: {},
    create: { id: U, email: 'info@nochill.co.za', name: 'Ndivhuwo Muhanelwa' },
  })

  // Settings
  for (const s of SETTINGS) {
    const existing = await prisma.systemSetting.findFirst({ where: { userId: U, key: s.key } })
    if (existing) await prisma.systemSetting.update({ where: { id: existing.id }, data: { value: s.value, category: s.category } })
    else await prisma.systemSetting.create({ data: { userId: U, key: s.key, value: s.value, category: s.category } })
  }
  console.log(`  ✅ settings           ${SETTINGS.length}  (${SETTINGS.map(s => s.key).join(', ')})`)

  // Revenue
  const rev = loadRevenue()
  await prisma.revenue.deleteMany({ where: { userId: U } })
  await prisma.revenue.createMany({ data: rev })
  const byStream = rev.reduce((a: any, r: any) => ((a[r.stream] = (a[r.stream] || 0) + r.amount), a), {})
  console.log(`  ✅ revenue            ${rev.length} rows from PROOF_BANK.csv`)
  for (const [k, v] of Object.entries(byStream)) console.log(`       ${k.padEnd(10)} R${(v as number).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`)

  const totals = {
    pains:   await prisma.iCPPainLibrary.count({ where: { userId: U } }),
    hooks:   await prisma.hookBank.count({ where: { userId: U } }),
    stories: await prisma.storyBankEntry.count({ where: { userId: U } }),
  }
  console.log(`\n  already seeded: ${totals.pains} pain points · ${totals.hooks} hooks · ${totals.stories} stories`)
  console.log('\n  ⛔ fact-locked. No figure without a PROOF_BANK row.\n')
  await prisma.$disconnect()
}

main().catch(async (e) => { console.error('  ⛔', e.message); await prisma.$disconnect(); process.exit(1) })
