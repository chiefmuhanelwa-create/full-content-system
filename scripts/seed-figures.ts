/**
 * Widen the evidence pool the generators can reach.
 *
 * The script writer saw 11 figures. The estate holds 55 E1 rows in PROOF_BANK / the
 * CREDIBILITY-BANK and 109 stories. With 11, a script about travel or usage rights had
 * almost nothing to reach for, so it reached for the rate story — which is how six
 * different ideas came out sounding like one.
 *
 * Two rules, both load-bearing:
 *   1. RECEIVED / CONTRACTED / INVOICED never blur. "I was contracted at" is not "I earned",
 *      and summing the three is exactly how R132,500 happened.
 *   2. Every row carries its own `topics`. Relevance belongs in the data, editable in
 *      Knowledge — not in a regex map inside a route.
 *
 * ⛔ Nothing from CREDIBILITY-BANK §8 (what cannot be used) is here. No Netflix figure at
 *    all — under NDA, founder-only. No person is named: outlets and companies only, Article IV.
 *
 * Every row is run through the live fact-lock before it is written. A row that trips it is
 * reported and dropped, never seeded.
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env' }); dotenv.config({ path: '.env.local', override: true })
import { getGovernance, setKey } from '../lib/governance'
import { check } from '../lib/fact-lock'

type Row = { fig: string; note: string; topics: string[]; status?: 'received' | 'contracted' | 'invoiced' | 'measured' }

const ROWS: Row[] = [
  // ── THE RATE STORY — kept, but no longer the only thing on the shelf ──
  { fig: 'R15,000 → R45,000', status: 'received', topics: ['rate', 'pricing', 'quote', 'costing', 'undercharging', 'worth'],
    note: 'Standing rate against the same job once it was costed properly. April 2020, same account, same week.' },
  { fig: 'R350 then R750', status: 'received', topics: ['first deal', 'asking', 'negotiation', 'starting out', 'rate'],
    note: 'First brand deal, second the same month. The only thing that changed was that he asked.' },

  // ── WHAT BRANDS ACTUALLY PAID — received, bank-confirmed ──
  { fig: 'R47,500 — Grey Advertising', status: 'received', topics: ['agency', 'brand deal', 'who pays', 'roster'],
    note: 'Paid into the business account, 2020. An agency, not the brand.' },
  { fig: 'R36,000 — GBets', status: 'received', topics: ['brand deal', 'betting', 'who pays', 'roster'],
    note: 'Paid, 2020.' },
  { fig: 'R25,000 — DStv', status: 'received', topics: ['brand deal', 'media', 'who pays', 'roster'],
    note: 'Paid, 2020.' },
  { fig: 'R22,000 — SlikourOnLife', status: 'received', topics: ['brand deal', 'music', 'media', 'roster'],
    note: 'Paid, 2020.' },
  { fig: 'R20,000 — Investec', status: 'received', topics: ['brand deal', 'finance', 'banking', 'roster'],
    note: 'Paid, 2020. A bank, on a creator fee.' },
  { fig: 'R20,000 — Eclipse PR', status: 'received', topics: ['agency', 'pr', 'who pays', 'roster'],
    note: 'Paid, 2020.' },
  { fig: 'R15,000 — Ubu', status: 'received', topics: ['brand deal', 'roster'],
    note: 'Paid, 2020.' },
  { fig: 'R10,500 — Capitec, one Instagram reel', status: 'received', topics: ['rate', 'one deliverable', 'reel', 'banking', 'exclusivity', 'what a reel pays'],
    note: 'Via an agency, and the campaign carried banking-category exclusivity for its period. One reel. This is what a real single-deliverable fee looks like.' },

  // ── AFFILIATE AND PLATFORM ──
  { fig: 'R23,524', status: 'received', topics: ['affiliate', 'commission', 'link', 'passive', 'one good month'],
    note: 'Affiliate commission across MARCH 2019 — a month, never a day. 41.6% of all affiliate commission ever earned.' },
  { fig: 'R41,562.15 — AdMarula', status: 'received', topics: ['affiliate', 'commission', 'invoiced vs received'],
    note: 'RECEIVED. R56,564 was invoiced. State received, never invoiced — the gap is the lesson.' },
  { fig: 'R36,050.50 — OfferForge', status: 'received', topics: ['affiliate', 'commission', 'slow money', 'many payments'],
    note: 'Across 10 payments, 2017–2019. Affiliate money arrives in pieces.' },
  { fig: '$22,180.93 — Meta', status: 'received', topics: ['platform pay', 'meta', 'facebook', 'monetisation', 'payout', 'bonus'],
    note: 'Remitted 2021–2025 by inward telegraphic transfer. Quote the remitted figure only — the earned and by-product figures are the same pot seen twice more.' },
  { fig: '$22,986.76 — TuneCore', status: 'received', topics: ['music', 'royalties', 'long tail', 'catalogue', 'passive'],
    note: 'Gross, 2019–2025, across 29,143 lines. Money that arrives in thousands of tiny pieces.' },

  // ── CONTRACTED AND INVOICED — say "contracted at", never "earned" ──
  { fig: 'R50,000 — Flying Fish', status: 'contracted', topics: ['biggest deal', 'contract', 'agreement', 'rate ceiling'],
    note: 'Influencer agreement, 2020. CONTRACTED — the highest evidenced fee anywhere in the record. Say "I was contracted at", never "I earned".' },
  { fig: 'R36,000 — Dynamex', status: 'invoiced', topics: ['invoice', 'chasing', 'contract'],
    note: 'Invoice #24. INVOICED, not confirmed received.' },
  { fig: 'R35,000 — MediaCom', status: 'invoiced', topics: ['agency', 'purchase order', 'invoice'],
    note: 'Purchase order, June 2020. INVOICED.' },
  { fig: 'R30,000 — Siza Abantu', status: 'contracted', topics: ['contract', 'agreement'],
    note: 'CONTRACTED.' },
  { fig: 'R15,000 — Pernod Ricard SA', status: 'invoiced', topics: ['agency', 'invoice', 'alcohol brand'],
    note: 'Via an agency, April 2020. INVOICED.' },
  { fig: 'R8,400 — KoW Marketing', status: 'contracted', topics: ['small deal', 'agreement', 'low end'],
    note: 'Influencer agreement. CONTRACTED. The low end of the real range.' },

  // ── THE LEDGER TOTALS ──
  { fig: 'R453,710.37', status: 'received', topics: ['lifetime', 'career', 'total', 'eight years', 'receipts'],
    note: 'Lifetime bank-confirmed receipts, 2017–2025, 27 of 55 rows. Never the raw R755,162.37 — that sums arrived with merely agreed.' },
  { fig: 'R136,138.57', status: 'received', topics: ['international', 'inbound', 'forex', 'one year'],
    note: 'International inbound into the business account across 2025.' },

  // ── TAX ──
  { fig: 'R207,879.20', status: 'measured', topics: ['tax', 'sars', 'assessment', 'reserve', 'owe', 'provisional'],
    note: 'The SARS assessment. UNPAID — no payments have started. Always state it in full to the cent; a rounded form is banned, as is any penalty, waived or final-debt figure.' },

  // ── PLATFORM RISK ──
  { fig: '780,000 followers lost', status: 'measured', topics: ['lost', 'suspended', 'terminated', 'platform risk', 'own', 'rented'],
    note: 'NEVER DATED, and no cause attributed.' },
  { fig: 'Two appeals, both refused', status: 'measured', topics: ['appeal', 'suspended', 'terminated', 'meta', 'recovery', 'platform risk'],
    note: 'Ad account terminated end-2024. Second refusal final, May 2025.' },
  { fig: '1,246 → 148 in 25 days', status: 'measured', topics: ['email', 'list', 'attrition', 'cold list', 'unsubscribe'],
    note: 'Reachable list collapse, only 28 unsubscribes. The rest simply stopped being reachable.' },

  // ── AUDIENCE ──
  { fig: '270,283', status: 'measured', topics: ['follower', 'audience', 'size', 'vanity', 'reach'],
    note: 'Instagram followers, API-confirmed. Never a cross-platform total.' },
  { fig: '75.7% South African', status: 'measured', topics: ['audience', 'geography', 'local', 'media kit'],
    note: 'Audience by country, API. 56.8% are aged 25–34.' },
  { fig: '173', status: 'measured', topics: ['email', 'list', 'newsletter', 'owned audience', 'subscriber'],
    note: 'The email list. The whole owned audience.' },
  { fig: '2.78%', status: 'measured', topics: ['engagement', 'rate', 'media kit', 'benchmark'],
    note: 'Current Instagram median engagement, measured on REACH. A followers-based rate is a different number 10–20x smaller — always print which one.' },

  // ── THE BEHAVIOURAL PROOF — no figure, and the strongest thing here ──
  { fig: 'Three agencies, one reply', status: 'measured', topics: ['reporting', 'proof', 'standing out', 'agency', 'character', 'follow-up'],
    note: 'Unprompted written performance reports to three independent agencies, 2019–2020. One replied that he was the only influencer who had ever done it. Third-party character proof — it cannot be bought, and unlike reach it does not decay.' },
  { fig: 'Chased twice, then paid', status: 'measured', topics: ['invoice', 'chasing', 'receivables', 'getting paid', 'late payment'],
    note: 'He chased his own invoice twice and got paid. One chase uncovered a failed payment batch nobody had noticed.' },
  { fig: 'Three months became six', status: 'measured', topics: ['retainer', 'renewal', 'keeping a client', 'reporting'],
    note: 'A three-month engagement extended to six, after weekly reporting through the whole thing.' },
  { fig: '19 brands, 23 agencies', status: 'measured', topics: ['roster', 'how many', 'experience', 'track record', 'agency'],
    note: 'Conservative — the directory names 27 agencies from 840 campaign emails. Never inflate the count into a round claim about how many deals there have been.' },
  { fig: 'R12,500/month', status: 'received', topics: ['retainer', 'recurring', 'monthly', 'meme', 'volume'],
    note: 'Playa Bets retainer — 40 meme reels a month plus bio link and affiliate. The only recurring line in the entire record.' },

  // ── PRESS ──
  { fig: 'TimesLIVE / Sunday Times, 22 Nov 2025', status: 'measured', topics: ['press', 'media', 'credibility', 'national'],
    note: 'National title, dated and citable.' },
  { fig: 'News24, 27 Feb 2026', status: 'measured', topics: ['press', 'media', 'credibility', 'national'],
    note: 'National title, dated and citable.' },
]

async function main() {
  console.log(`  candidate rows: ${ROWS.length}\n`)

  const clean: Row[] = []
  for (const r of ROWS) {
    const fl = check(`${r.fig} ${r.note}`)
    if (!fl.clean) {
      console.log(`  ⛔ DROPPED  ${r.fig}`)
      fl.banned.forEach((b) => console.log(`              ${b.name} → ${b.found.join(', ')}`))
      continue
    }
    clean.push(r)
  }

  const gov = await getGovernance(true)
  const before = (gov.fact_lock?.safe ?? []).length
  await setKey('fact_lock', { ...gov.fact_lock, safe: clean }, 'figures widened from CREDIBILITY-BANK 2026-09-24')

  const after = await getGovernance(true)
  console.log(`\n  seeded ${clean.length} figures (was ${before})`)
  const byStatus: Record<string, number> = {}
  for (const r of clean) byStatus[r.status ?? 'unset'] = (byStatus[r.status ?? 'unset'] ?? 0) + 1
  console.log('  by status:', Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(' · '))
  console.log('  live in governance:', (after.fact_lock?.safe ?? []).length)
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
