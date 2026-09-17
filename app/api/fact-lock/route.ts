/**
 * GET  /api/fact-lock  → the ban list and the safe list, read from settings
 * POST /api/fact-lock  → check a draft, return every violation with its replacement
 *
 * Source: content_system.system_settings.fact_lock, seeded from NOCHILL-OS.
 * A ban without an alternative gets ignored under deadline, so every rule carries
 * the thing to say instead.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

const U = 'default-user-id'

type Rule = { rx: RegExp; name: string; fix: string; severity: 'banned' | 'careful' }

const RULES: Rule[] = [
  { rx: /R\s?132[,.]?500/gi, name: 'R132,500', severity: 'banned',
    fix: 'Disproven across 681 financial records (D-52). Use the rate story: R15,000 standing rate → R45,000 once costed, April 2020, same account same week.' },
  { rx: /R\s?600[,.]?000|R600K/gi, name: 'R600K / R600,000', severity: 'banned',
    fix: 'Bank-confirmed lifetime receipts are R453,710.37 across 2017–2025. State no annual total.' },
  { rx: /\bATNS\b|OR Tambo|air traffic/gi, name: 'the employer', severity: 'banned',
    fix: 'NEVER name the employer, workplace, airport or industry. Write "a full time job", "night shifts", "on shift". Article IV — it breaches his company\'s rules.' },
  { rx: /R\s?750\s*[–—>-]+\s*R\s?100K|R\s?100,?000 per post/gi, name: 'R100,000 per post', severity: 'banned',
    fix: 'Unsupported. The highest evidenced fee is Flying Fish R50,000 contracted.' },
  { rx: /Samsung\s+R\s?450|Samsung.{0,20}18 months/gi, name: 'Samsung R450,000', severity: 'banned',
    fix: 'Evidence shows one week, March 2020, no fee.' },
  { rx: /Savanna\s+R\s?(25|100|300)|R\s?300,?000 campaign/gi, name: 'the Savanna figures', severity: 'banned',
    fix: 'Evidence shows R45,000 quoted, 2020. The R300,000 campaign-month has no support anywhere.' },
  { rx: /AdSense\s+R\s?180|R\s?180K\/year|R\s?180,?000/gi, name: 'AdSense R180,000', severity: 'banned',
    fix: '13 payments, peak month $260.01. Neither the total nor the annual figure survives.' },
  { rx: /Ads?\s*(&|and)\s*Affiliates.{0,15}R\s?800|R\s?800,?000/gi, name: 'Ads & Affiliates R800,000+', severity: 'banned',
    fix: 'Not reconstructable.' },
  { rx: /Netflix\s+R\s?(100|28)/gi, name: 'the Netflix figure', severity: 'banned',
    fix: '🔒 Under NDA. Publish neither the figure nor the client name.' },
  { rx: /50\+?\s*brand deals|40\+\s*brands|first 50 deals/gi, name: '"50+ brand deals"', severity: 'banned',
    fix: '19 named brands, 23 agencies — and that is conservative. The directory names 27 agencies from 840 emails.' },
  { rx: /R\s?285[,.]?000|R285K|R207K\b|R\s?162,?174|R\s?45,?705/gi, name: 'a banned SARS figure', severity: 'banned',
    fix: 'The ONLY publishable SARS figure is R207,879.20, and it is UNPAID. Never a penalty, final, monthly or month-count figure. Never rounded to R207K.' },
  { rx: /SARS came for me/gi, name: '"SARS came for me"', severity: 'banned',
    fix: '🔒 Inverts the evidenced sequence. Permitted only as: "I went to SARS before they came to me. Nobody prompted me and nobody audited me. And it still went wrong." He may add he came forward voluntarily — lodged July 2025, unprompted, unaudited — AND that it was later withdrawn. BOTH HALVES OR NEITHER.' },
  { rx: /47\s+(email\s+)?subscribers|50,?000\+?\s*email list/gi, name: 'a wrong list size', severity: 'banned',
    fix: 'The email list is 173.' },
  { rx: /18%\s*engagement/gi, name: '"18% engagement"', severity: 'banned',
    fix: 'Undated and unsupported. Current Instagram median is 2.78%.' },
  { rx: /\b600k\b|millions of followers|3 million followers/gi, name: 'a cross-platform follower total', severity: 'banned',
    fix: '270,283 Instagram followers, API-confirmed 2026-09-01. Never a cross-platform sum.' },
  { rx: /R\s?23,?000 in (a|one)\s*(single\s*)?(day|night)|R23K (affiliate )?day/gi, name: '"R23,000 in one day"', severity: 'banned',
    fix: 'It was R23,524 across MARCH 2019 — a month, not a day. 41.6% of all affiliate commission ever earned.' },
  { rx: /\b(8|9|10)\s+awards\b/gi, name: 'an award total', severity: 'banned',
    fix: 'Say "award-winning", or name one award. State no total — the count carries an open conflict.' },
  { rx: /1,\s?643|1,\s?197/g, name: 'a disputed survey total', severity: 'banned',
    fix: 'D-73 is open — 1,197, 425 and 1,643 are all in circulation. Cite no survey total. "I asked 135 creators" is safe for one instrument.' },
  { rx: /6,?000\+?\s*(copies|books)|5,?000\+?\s*copies/gi, name: 'a book sales count', severity: 'banned',
    fix: 'Two published books is safe. The unit count is unverified.' },
  { rx: /R\s?300,?000\s*(a|per)?\s*month|R300K\/mo/gi, name: 'R300,000 a month', severity: 'banned',
    fix: 'D-76. The estate disproves it in four files and ships it as hook copy in two. R300,000/month is ~8× the entire lifetime bank-confirmed total, every year.' },
  { rx: /Called Expert|ICP\s?1\b|ICP\s?2\b|32\s?[–-]\s?50|R9,?000\s?[–-]\s?R45,?000|R9,?997/gi, name: 'the retired ICP', severity: 'banned',
    fix: 'Retired 2026-09-01. Never measured; when it was, median age 21, two people over 32 out of 70, zero purchasers. The customer is the creator whose income is decided by somebody else.' },
  { rx: /\b(Florah|Red Lion Hotel)\b/gi, name: 'a named private individual', severity: 'banned',
    fix: 'Article IV. No real person is ever named — not a client, lead, employer, family member, village or tax practitioner. Companies only.' },
  { rx: /\bR\s?\d{1,3}(,\d{3})+(\.\d{2})?\b/g, name: 'a rand figure', severity: 'careful',
    fix: 'Every rand figure needs a row in PROOF_BANK.csv. If you cannot point at one, leave the slot empty — an empty slot beats a plausible filler.' },
]

const SAFE = [
  ['R15,000 → R45,000', 'Standing rate against the costed job. April 2020, same account, same week.'],
  ['R350 then R750', 'First brand deal, second the same month. The only thing that changed was that he asked.'],
  ['R23,524', 'Affiliate commission across MARCH 2019 — a month. 41.6% of all affiliate commission ever.'],
  ['R207,879.20', 'The SARS assessment. UNPAID, no payments started. Never rounded.'],
  ['$22,180.93', 'Remitted from Meta 2021–2025 by inward telegraphic transfer.'],
  ['R453,710.37', 'Lifetime bank-confirmed receipts, 27 of 55 rows. ⚠️ See D-86 — not currently reproducible from the CSV.'],
  ['780,000 followers lost', '⛔ NEVER DATED. No cause attributed.'],
  ['Two appeals, both refused', 'Ad account terminated end-2024. Second refusal final, May 2025.'],
  ['19 brands, 23 agencies', 'Conservative. The directory names 27 agencies from 840 campaign emails.'],
  ['270,283', 'Instagram followers, API-confirmed 2026-09-01.'],
  ['173', 'The email list.'],
  ['R10,500', 'Capitec, one Instagram reel, via an agency. E1.'],
  ['R12,500/month', 'Playa Bets retainer — 40 meme reels a month, plus bio link and affiliate. The only recurring line in the record.'],
]

export async function GET() {
  const dbError = checkDatabase()
  let seeded: any = null
  if (!dbError) {
    const s = await prisma!.systemSetting.findFirst({ where: { userId: U, key: 'fact_lock' } })
    seeded = s?.value ?? null
  }
  return NextResponse.json({
    rules: RULES.map((r) => ({ name: r.name, fix: r.fix, severity: r.severity })),
    safe: SAFE.map(([fig, note]) => ({ fig, note })),
    seeded,
  })
}

export async function POST(request: NextRequest) {
  const { text } = await request.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Paste something to check.' }, { status: 400 })

  const banned: any[] = []
  const careful: any[] = []

  for (const r of RULES) {
    const found = [...new Set(String(text).match(r.rx) || [])]
    if (!found.length) continue
    const entry = { name: r.name, fix: r.fix, found }
    if (r.severity === 'banned') banned.push(entry)
    else careful.push(entry)
  }

  // A figure already flagged as banned should not also be listed as "careful"
  const bannedText = banned.flatMap((b) => b.found).join(' ')
  const carefulFiltered = careful
    .map((c) => ({ ...c, found: c.found.filter((f: string) => !bannedText.includes(f)) }))
    .filter((c) => c.found.length)

  return NextResponse.json({
    clean: banned.length === 0,
    banned,
    careful: carefulFiltered,
    verdict: banned.length
      ? `⛔ ${banned.length} banned claim${banned.length > 1 ? 's' : ''}. This does not ship.`
      : carefulFiltered.length
        ? `⚠️ Nothing banned — but ${carefulFiltered[0].found.length} figure${carefulFiltered[0].found.length > 1 ? 's' : ''} need a PROOF_BANK row.`
        : '✅ Nothing banned found.',
    caveat:
      'Clean is not the same as verified. This checks against KNOWN-BAD, not against unknown-unsupported. Any number still needs a row in PROOF_BANK.csv.',
  })
}
