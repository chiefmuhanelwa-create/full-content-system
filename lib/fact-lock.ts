/**
 * The fact-lock engine. ONE copy, imported everywhere.
 *
 * Previously this lived inside app/api/fact-lock/route.ts, which meant the AI
 * generators could not reach it — they produced text nothing ever checked.
 * Every rule carries its replacement: a ban without an alternative gets ignored
 * under deadline, which is how R132,500 survived to 46 places.
 *
 * Source of truth: ~/.claude/CLAUDE.md FACT-LOCK + NOCHILL-OS/00-CONTROL.
 */

export type Severity = 'banned' | 'careful'
export type Rule = { rx: RegExp; name: string; fix: string; severity: Severity }
export type Hit = { name: string; fix: string; found: string[]; severity: Severity }

export const RULES: Rule[] = [
  { rx: /R\s?132[,.]?500/gi, name: 'R132,500', severity: 'banned',
    fix: 'Disproven across 681 financial records (D-52). Use the rate story: R15,000 standing rate -> R45,000 once costed, April 2020, same account same week.' },
  { rx: /R\s?600[,.]?000|R600K/gi, name: 'R600K / R600,000', severity: 'banned',
    fix: 'Bank-confirmed lifetime receipts are R453,710.37 across 2017-2025. State no annual total.' },
  { rx: /\bATNS\b|OR Tambo|air traffic/gi, name: 'the employer', severity: 'banned',
    fix: 'NEVER name the employer, workplace, airport or industry. Write "a full time job", "night shifts", "on shift". Article IV.' },
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
  { rx: /\bNetflix\b/gi, name: 'Netflix (NDA)', severity: 'banned',
    fix: 'LOCKED. The contract is under NDA. Publish neither the figure (R100,000 and R28,000 are both banned) NOR the client name. Founder-only disclosure.' },
  { rx: /50\+?\s*brand deals|40\+\s*brands|first 50 deals/gi, name: '"50+ brand deals"', severity: 'banned',
    fix: '19 named brands, 23 agencies - and that is conservative. The directory names 27 agencies from 840 emails.' },
  { rx: /R\s?285[,.]?000|R285K|R207K\b|R\s?162[,.]?174|R\s?45[,.]?705/gi, name: 'a banned SARS figure', severity: 'banned',
    fix: 'The ONLY publishable SARS figure is R207,879.20, and it is UNPAID. Never a penalty figure (R45,705.06), never a final-debt figure (R162,174.14), never a monthly amount or month count, never rounded to R207K.' },
  { rx: /SARS came for me/gi, name: '"SARS came for me"', severity: 'banned',
    fix: 'LOCKED. Inverts the evidenced sequence. Permitted only as: "I went to SARS before they came to me. Nobody prompted me and nobody audited me. And it still went wrong." He may add he came forward voluntarily - lodged July 2025, unprompted, unaudited - AND that it was later withdrawn. BOTH HALVES OR NEITHER.' },
  { rx: /negotiated it down|penalties came down|final debt was|debt (is|was) (now )?R/gi, name: 'a claim the SARS debt moved', severity: 'banned',
    fix: 'RULED 2026-08-25: the debt is UNPAID and no payments have started. Never state it was reduced, negotiated, settled or placed on a plan.' },
  { rx: /47\s+(email\s+)?subscribers|50,?000\+?\s*email list/gi, name: 'a wrong list size', severity: 'banned',
    fix: 'The email list is 173.' },
  { rx: /18%\s*engagement/gi, name: '"18% engagement"', severity: 'banned',
    fix: 'Undated and unsupported. Current Instagram median is 2.78%.' },
  { rx: /\b600k\b|millions of followers|3 million followers|had millions of/gi, name: 'a cross-platform follower total', severity: 'banned',
    fix: '270,283 Instagram followers, API-confirmed. Never a cross-platform sum, never "600k", never "millions of followers".' },
  { rx: /R\s?23,?000 in (a|one)\s*(single\s*)?(day|night)|R23K (affiliate )?day/gi, name: '"R23,000 in one day"', severity: 'banned',
    fix: 'It was R23,524 across MARCH 2019 - a month, not a day. 41.6% of all affiliate commission ever earned.' },
  { rx: /\b(8|9|10)\s+awards\b/gi, name: 'an award total', severity: 'banned',
    fix: 'Say "award-winning", or name one award. State no total - the count carries an open conflict.' },
  { rx: /1,\s?643|1,\s?197/g, name: 'a disputed survey total', severity: 'banned',
    fix: 'D-73 is open - 1,197, 425 and 1,643 are all in circulation. Cite no survey total. "I asked 135 creators" is safe for one instrument.' },
  { rx: /6,?000\+?\s*(copies|books)|5,?000\+?\s*copies/gi, name: 'a book sales count', severity: 'banned',
    fix: 'Two published books is safe. The unit count is unverified.' },
  { rx: /R\s?300,?000\s*(a|per)?\s*month|R300K\/mo/gi, name: 'R300,000 a month', severity: 'banned',
    fix: 'D-76. R300,000/month is ~8x the entire lifetime bank-confirmed total, every year.' },
  { rx: /Called Expert|ICP\s?1\b|ICP\s?2\b|32\s?[–-]\s?50|R9,?000\s?[–-]\s?R45,?000|R9,?997/gi, name: 'the retired ICP', severity: 'banned',
    fix: 'Retired 2026-09-01. Median measured age 21, two people over 32 out of 70, zero purchasers. The customer is the earning creator whose income is decided by somebody else. Four tiers: FREE / ENTRY R350-R499 / CORE R1,500-R1,800 / PREMIUM $499-R9,000.' },
  { rx: /River\s?[–—-]\s?Fish\s?[–—-]\s?Tank|River, Fish, Tank|the river is social/gi, name: 'River-Fish-Tank in public', severity: 'careful',
    fix: 'RETIRED FROM PUBLIC USE - zero audience echoes. Keep it inside paid delivery. In public say: rented land vs land you own.' },
  { rx: /\b(Florah|Red Lion Hotel)\b/gi, name: 'a named private individual', severity: 'banned',
    fix: 'Article IV. No real person is ever named - not a client, lead, employer, family member, village or tax practitioner. Companies only.' },
  { rx: /\bR\s?\d{1,3}(,\d{3})+(\.\d{2})?\b/g, name: 'a rand figure', severity: 'careful',
    fix: 'Every rand figure needs a row in PROOF_BANK.csv. If you cannot point at one, leave the slot empty - an empty slot beats a plausible filler.' },
]

export const SAFE: [string, string][] = [
  ['R15,000 -> R45,000', 'Standing rate against the costed job. April 2020, same account, same week.'],
  ['R350 then R750', 'First brand deal, second the same month. The only thing that changed was that he asked.'],
  ['R23,524', 'Affiliate commission across MARCH 2019 - a month. 41.6% of all affiliate commission ever.'],
  ['R207,879.20', 'The SARS assessment. UNPAID, no payments started. Never rounded.'],
  ['$22,180.93', 'Remitted from Meta 2021-2025 by inward telegraphic transfer.'],
  ['R453,710.37', 'Lifetime bank-confirmed receipts, 27 of 55 rows. See D-86 - not currently reproducible from the CSV.'],
  ['780,000 followers lost', 'NEVER DATED. No cause attributed.'],
  ['Two appeals, both refused', 'Ad account terminated end-2024. Second refusal final, May 2025.'],
  ['19 brands, 23 agencies', 'Conservative. The directory names 27 agencies from 840 campaign emails.'],
  ['270,283', 'Instagram followers, API-confirmed.'],
  ['173', 'The email list.'],
  ['R10,500', 'Capitec, one Instagram reel, via an agency. E1.'],
  ['R12,500/month', 'Playa Bets retainer - 40 meme reels a month. The only recurring line in the record.'],
]

/** Run a draft against every rule. Pure, no IO, safe to call in a hot path. */
export function check(text: string): { clean: boolean; banned: Hit[]; careful: Hit[] } {
  const banned: Hit[] = []
  const careful: Hit[] = []
  for (const r of RULES) {
    r.rx.lastIndex = 0
    const found = Array.from(new Set(String(text).match(r.rx) || []))
    if (!found.length) continue
    const entry: Hit = { name: r.name, fix: r.fix, found, severity: r.severity }
    ;(r.severity === 'banned' ? banned : careful).push(entry)
  }
  // A figure already caught as banned should not be double-reported as careful.
  const bannedText = banned.flatMap((b) => b.found).join(' ')
  const carefulFiltered = careful
    .map((c) => ({ ...c, found: c.found.filter((f) => !bannedText.includes(f)) }))
    .filter((c) => c.found.length)
  return { clean: banned.length === 0, banned, careful: carefulFiltered }
}

/** The ban list as prompt text, so a model is told BEFORE it writes, not after. */
export function banListForPrompt(): string {
  const bans = RULES.filter((r) => r.severity === 'banned')
    .map((r) => `- ${r.name}: ${r.fix}`)
    .join('\n')
  const safe = SAFE.map(([f, n]) => `- ${f} — ${n}`).join('\n')
  return `## FACT-LOCK — a number without a receipt does not ship\n\nNEVER write any of these. They are disproven or legally locked:\n${bans}\n\nThese are SAFE and evidenced — prefer them:\n${safe}\n\nIf you need a figure you cannot source, LEAVE THE SLOT EMPTY and say so. An empty slot beats a plausible filler. Never estimate, never write "approximately".`
}

/** One-line verdict for logs and UI. */
export function verdict(r: ReturnType<typeof check>): string {
  if (r.banned.length) return `BLOCKED — ${r.banned.length} banned claim${r.banned.length > 1 ? 's' : ''}`
  if (r.careful.length) return `PASS WITH FLAGS — ${r.careful[0].found.length} figure(s) need a PROOF_BANK row`
  return 'CLEAN'
}
