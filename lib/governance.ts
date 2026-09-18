/**
 * LIVE GOVERNANCE — the single place every tool and every prompt reads doctrine from.
 *
 * Why this exists: lib/knowledge-base.ts is 2,038 hardcoded lines carrying the RETIRED
 * "Called Expert / ICP1 / ICP2" persona. Every generator built its system prompt from it,
 * so the AI was writing to a customer that was ruled dead on 2026-09-01 while the database
 * held the correct four tiers. Doctrine must be DATA, not source code — otherwise updating
 * the ICP means a deploy, and it silently never happens.
 *
 * Read order for any key:
 *   1. content_system.system_settings (editable in the UI, versioned, survives logout)
 *   2. the FALLBACK below (estate-derived, correct as of 2026-09-17)
 *
 * Anything written through /api/knowledge overrides the fallback immediately, for every tool.
 */

import { prisma } from '@/lib/db-helper'

export const OWNER = 'default-user-id'

export type GovKey =
  | 'icp' | 'tiers' | 'pillars' | 'voice' | 'fact_lock' | 'cta_keywords'
  | 'algorithm' | 'ledger_totals' | 'search_demand' | 'cadence' | 'frameworks'

/** Estate-derived defaults. Used only when a key has never been written to the DB. */
const FALLBACK: Record<string, any> = {
  plain_speech: {
    ruled: '2026-09-17',
    source: 'A line-by-line read of his own RATE script (332 words, ~115s).',
    law: 'No term stands alone. Name it, say what it means, say what to do.',
    why: 'A word the listener has to already know is a word that loses them — and they do not rewind, they scroll.',
    moves: [
      { n: 1, move: 'Name it', example: 'Part one is access.' },
      { n: 2, move: 'Say what it means', example: "That's the brand showing their product to your people." },
      { n: 3, move: 'Say what to do', example: 'Open your last nine posts, tap View Insights, and add up the likes, comments, shares and saves.' },
    ],
    order: 'Fixed. By the second item the listener can predict the shape, and that prediction carries them through items two and three — the places a list normally loses people.',
    banned: 'Never "The three parts are access, production and usage." That is three labels and nothing else. It is the shape of a slide, not of speech.',
    swaps: [
      { not: 'divide by reach', use: 'divide by how many people saw them' },
      { not: 'engagement rate, as a bare label', use: 'the bigger that number, the higher your price' },
      { not: 'usage rights, with no gloss', use: 'when the brand puts your video in their own adverts' },
    ],
  },
  icp: {
    ruled: '2026-09-17',
    definition: 'The earning creator who is leaking. Money has moved, or money is visibly blocked.',
    gate: [
      'Money has moved, or money is visibly blocked. Not follower count, not niche, not how long they have posted.',
      'Does another human being appear in their fear? "Provide for my kids" = customer. "To get 0 likes" = traffic.',
    ],
    mechanism: 'Somebody else decides what they earn, and they find out afterwards.',
    evidence: '~17 of 61 named provision as their deepest fear - the most repeated phrase in any dataset in the estate.',
    never_sold_to: 'FREE tier, the Beginner Aspirant. 203 of 290 (70.0%) do not create content at all.',
  },
  tiers: [
    { tier: 'FREE', price: 'R0', who: 'The Beginner Aspirant', age: '18-24', line: 'To get 0 likes',
      evidence: '203 of 290 - 70.0% - do not create content at all', sell: false },
    { tier: 'ENTRY', price: 'R350-R499', who: 'The Blocked', age: '20-32',
      line: 'Millions of views but I am not earning any money',
      evidence: '25+ DMs, the #1 ask. 43,674/mo search. Appeal cluster 90,000+/mo', sell: true },
    { tier: 'CORE', price: 'R1,500-R1,800', who: 'The Underpriced & Unreserved', age: '24-35',
      line: 'I am not sure about rates',
      evidence: '11 of 25 could not price. Same story R200-R6,000. 9 of 25 charge travel, 2 charge usage', sell: true },
    { tier: 'PREMIUM', price: '$499 / R9,000', who: 'The Asset-Backed Contentpreneur', age: '26-38',
      line: 'There was nobody to phone',
      evidence: 'Appeal cluster. "is it safer to own an email list than a Facebook page?"', sell: true,
      note: 'INTERNAL NAME ONLY - "asset" is retired from public use',
      limit: 'May NOT sell legal structuring, company registration, or financial statements for lenders. Teach the reserve, the deduction categories and the two statutory dates. Do not do the filing.' },
  ],
  pillars: [
    { name: 'KEEP IT', weight: 30, sells_to: 'CORE + ENTRY', topic: 'tax, reserves, SARS',
      evidence: 'TAX converts 8.68% - best keyword on the account, on a third of RATE traffic. sars 13,089/mo in ZA. Zero unprompted mentions across four surveys - latent demand, must be created not captured.' },
    { name: 'PRICE IT', weight: 25, sells_to: 'CORE', topic: 'rates, invoicing, chasing',
      evidence: '11 of 25 could not produce a rate card. Same Instagram story priced R200 to R6,000. His own R15,000 -> R45,000.' },
    { name: 'OWN IT', weight: 20, sells_to: 'ENTRY (biggest audience) + PREMIUM', topic: 'platform risk, email',
      evidence: '25+ inbound DMs - the #1 ask by a distance. Appeal cluster 90,000+/mo. facebook content monetization 43,674/mo. His account terminated, two appeals refused.' },
    { name: 'BUILD IT ANYWAY', weight: 15, sells_to: 'CORE - most have a job', topic: 'building while employed',
      evidence: '9 to 5 = 2,434/mo in ZA, unclaimed. "my biggest fear is leaving my job".' },
    { name: 'PROVE IT', weight: 10, sells_to: 'PREMIUM + every agency relationship', topic: 'receipts, reporting',
      evidence: 'Unprompted reports to three agencies; one replied he was the only influencer who had ever done it. Third-party character proof, and it does not decay.' },
  ],
  voice: {
    persona: 'Big brother who went through it. Direct, warm, confrontational-with-love. Ubuntu. Faith as operating system - natural, never preachy, one line, never a paragraph.',
    median_sentence_words: 5,
    six_words_or_fewer_pct: 57.2,
    signatures: ["That's why you're broke", 'Start with your phone', "You can't be shy and broke"],
    loss_law: 'A CAPTION opens on his own loss with a specific rand figure that exists in the ledger, or it does not open. Measured 25.5 median comments vs 3.0.',
    spoken_hook_law: 'The SPOKEN hook opens in the SECOND PERSON, about the viewer. "You are accepting R750 for brand deals worth R15,000." His own loss enters at beat 3, around ten seconds. First-person spoken openers measured 22.6% completion against 27.8% and 29.7%.',
    both: 'The same post does both. Caption = his loss + a figure. Video = accuse the viewer. Write both. Never reuse one as the other.',
    banned_format: 'Daily process documentation. 25 posts, median zero comments.',
    sa_english: 'colour, organise, realise. ZAR written R199 / R1,800 - never "R 199" or "R199.00". SARS/CIPC/PTY LTD, never IRS/LLC/SEC.',
    ai_slop_banned: ['delve', 'certainly', "I'd be happy to", 'absolutely', 'leverage', 'synergy', 'utilize'],
  },
  cta_keywords: {
    rule: 'No content publishes with a CTA that has no destination. Do not mint a tenth keyword.',
    live: ['RATE', 'GUIDE'],
    orphaned: ['BOOK', 'RESEARCH', 'CONTENT', 'PAID'],
    unverified: ['TAX', 'RENT'],
    note: 'The orphan COUNT is suspended - it was built on a stale list that wrongly called `rate` dead. Re-derive from live ManyChat and IG comment data before citing any number.',
  },
  algorithm: {
    posts_per_week: 4,
    post_hours_sast: '18:00-22:00',
    never: 'Friday - index 0.76, median saves 5, the only genuinely bad signal in the data',
    best_day: 'Saturday - indexes highest at 1.08',
    reel_runtime_seconds: '90-105',
    format_finding: 'Carousels out-reach reels 2.2x and 2.7x across two independent windows. He posts 137 reels for every 14 feed posts. Carousels need no camera - the one format that removes the human bottleneck is also the one outperforming.',
    caveat: 'Time of day swings performance about 15%. Content swings it 800%. Do not spend batch-day time optimising schedule.',
  },
  ledger_totals: {
    lifetime_received_zar: 453710.37,
    meta_remitted_usd: 22180.93,
    sars_assessment_zar: 207879.20,
    sars_status: 'UNPAID - no payments started. Never state it was reduced, negotiated or settled.',
    email_list: 173,
    instagram_followers: 270283,
    note: 'The bank raw ZAR total R755,162.37 sums received + invoiced + contracted. NEVER use it. This is exactly how R132,500 happened.',
  },
  cadence: {
    mon: 'Batch day. Script + record everything.',
    tue: 'Edit day. All the week cuts.',
    wed: 'Post. Reply to every comment.',
    thu: 'Post. CAROUSEL auto-posts.',
    fri: 'Send the weekly email 10:00. DO NOT POST - index 0.76.',
    sat: 'Post. Indexes highest.',
    sun: 'CAROUSEL auto-posts. Read the replies. Plan next week pillar.',
    rule: 'One pillar per week, five-week rotation. Four short-form a week, not daily.',
  },
  search_demand: {
    'facebook content monetization': 43674,
    'appeal cluster': 90000,
    'how to get brand deals on instagram': 19420,
    'sars (ZA)': 13089,
    '9 to 5 (ZA, unclaimed)': 2434,
  },
}


/**
 * Shape normalisers. The seeded estate settings and the fallback below use different field
 * names for the same facts ({k,pct,why,sells} vs {name,weight,evidence,sells_to}), and an
 * imported file will use a third. Normalising here means every consumer sees one shape and
 * an import can never silently break a prompt.
 */
export type Pillar = { name: string; weight: number; sells_to: string; topic?: string; evidence?: string }
export type Tier = { tier: string; price: string; who: string; line?: string; evidence?: string; sell?: boolean; limit?: string; age?: string }

export function normalisePillars(v: any): Pillar[] {
  const arr = Array.isArray(v) ? v : Array.isArray(v?.pillars) ? v.pillars : []
  return arr.map((p: any) => ({
    name: p.name ?? p.k ?? p.pillar ?? '',
    weight: Number(p.weight ?? p.pct ?? p.percent ?? 0),
    sells_to: p.sells_to ?? p.sells ?? p.tier ?? '',
    topic: p.topic ?? p.about ?? undefined,
    evidence: p.evidence ?? p.why ?? undefined,
  })).filter((p: Pillar) => p.name)
}

export function normaliseTiers(gov: any): Tier[] {
  const raw = Array.isArray(gov?.tiers) ? gov.tiers
    : Array.isArray(gov?.icp?.tiers) ? gov.icp.tiers
    : []
  return raw.map((t: any) => ({
    tier: t.tier ?? t.level ?? '',
    price: t.price ?? t.priceZar ?? '',
    who: t.who ?? t.name ?? '',
    age: t.age ?? undefined,
    line: t.line ?? t.says ?? t.quote ?? undefined,
    evidence: t.evidence ?? undefined,
    sell: t.sell !== undefined ? t.sell : !/FREE/i.test(t.tier ?? ''),
    limit: t.limit ?? t.rule ?? undefined,
  })).filter((t: Tier) => t.tier)
}

type Cache = { at: number; data: Record<string, any> }
let cache: Cache | null = null
const TTL_MS = 30_000

/** Every governance key, DB first, fallback second. Cached briefly so prompts stay cheap. */
export async function getGovernance(force = false): Promise<Record<string, any>> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.data
  const out: Record<string, any> = { ...FALLBACK }
  try {
    if (prisma) {
      const rows = await prisma.systemSetting.findMany({ where: { userId: OWNER } })
      for (const r of rows) {
        if (r.value !== null && r.value !== undefined) out[r.key] = r.value
      }
      out._source = rows.length ? `db:${rows.length} keys` : 'fallback only'
    } else {
      out._source = 'fallback only (no database)'
    }
  } catch {
    out._source = 'fallback only (database unreachable)'
  }
  cache = { at: Date.now(), data: out }
  return out
}

export async function getKey<T = any>(key: GovKey | string): Promise<T | null> {
  const g = await getGovernance()
  return (g[key] ?? null) as T | null
}

/**
 * Write a key. This is what makes the system modifiable rather than seeded-and-frozen.
 * The audit row is written HERE, not in the API route, so no code path can change doctrine
 * without leaving a trace. R132,500 propagated to 46 places precisely because nothing
 * recorded where it entered.
 */
export async function setKey(key: string, value: any, note?: string) {
  if (!prisma) throw new Error('Database not configured')
  const existing = await prisma.systemSetting.findFirst({ where: { userId: OWNER, key } })
  const before = existing?.value ?? null

  if (existing) {
    await prisma.systemSetting.update({
      where: { id: existing.id },
      data: { value, category: note ?? existing.category },
    })
  } else {
    await prisma.systemSetting.create({
      data: { userId: OWNER, key, value, category: note ?? 'governance' },
    })
  }

  try {
    await prisma.ingestLog.create({
      data: {
        userId: OWNER,
        source: note ?? 'edit',
        target: `system_settings.${key}`,
        rows: Array.isArray(value) ? value.length : 1,
        summary: `${existing ? 'Updated' : 'Created'} ${key}${note ? ' — ' + note : ''}`,
        before: before ?? undefined,
        after: value ?? undefined,
      },
    })
  } catch { /* an audit failure must never block the write it describes */ }

  cache = null // every tool sees the change on its next read
  return { key, updated: true }
}

export function invalidate() { cache = null }

/**
 * Doctrine compiled into prompt text. This replaces the retired ICP1/ICP2 block that
 * buildSystemPrompt() was injecting into every generation.
 */
export async function governanceForPrompt(opts: { pillar?: string; tier?: string } = {}): Promise<string> {
  const g = await getGovernance()
  const tiers = normaliseTiers(g)
  const pillars = normalisePillars(g.pillars)
  const icp = g.icp || {}
  const voice = g.voice || {}
  const ps = g.plain_speech || {}

  const tierLines = tiers.map((t) =>
    `- ${t.tier} (${t.price}) — ${t.who}${t.age ? ', ' + t.age : ''}.${t.line ? ` They say: "${t.line}".` : ''}${t.sell === false ? ' NEVER SOLD TO.' : ''}${t.limit ? ' RULE: ' + t.limit : ''}`
  ).join('\n')

  const pillarLines = pillars.map((p) =>
    `- ${p.name} (${p.weight}%) -> sells to ${p.sells_to}.${p.topic ? ' ' + p.topic + '.' : ''}`
  ).join('\n')

  const focus = opts.pillar ? pillars.find((p) => p.name.toUpperCase() === opts.pillar!.toUpperCase()) : null
  const gate: string[] = icp.gate ?? []
  const retired: string = typeof icp.retired === 'string' ? icp.retired : ''

  return `## WHO THIS IS FOR — ruled ${icp.ruled ?? '2026-09-17'}

${icp.customer ?? icp.definition ?? 'The earning creator who is leaking.'}

THE GATE, two tests on one sentence:
${gate.map((x: string, i: number) => `${i + 1}. ${x}`).join('\n')}

THE MECHANISM, true of every tier and never once said out loud by a respondent:
"${icp.mechanism ?? 'Somebody else decides what they earn, and they find out afterwards.'}"

THE FOUR TIERS:
${tierLines}

## THE PILLARS — each sells to a tier
${pillarLines}
${focus ? `\nTHIS PIECE IS ${focus.name}. It sells to ${focus.sells_to}. Evidence behind it: ${focus.evidence ?? ''}` : ''}
${opts.tier ? `\nTHIS PIECE SERVES THE ${opts.tier} TIER. Write to that person and no one else. Never mix two tiers in one output.` : ''}

## VOICE — measured, not described
${voice.persona ?? 'Big brother who went through it. Direct, warm, confrontational-with-love. Ubuntu.'}
Median sentence 5 words. 57.2% are six words or fewer. Line breaks carry the punctuation.
CAPTION LAW: opens on HIS loss with a rand figure that exists in the ledger. Measured 25.5 median comments vs 3.0.
SPOKEN HOOK LAW: opens in the SECOND PERSON, about the viewer. "You are accepting R750 for brand deals worth R15,000." His own loss enters at beat 3, around ten seconds.
The same post does both. Write both. Never reuse one as the other.
SA English: colour, organise, realise. ZAR written R199 / R1,800 — never "R 199" or "R199.00". SARS/CIPC/PTY LTD, never IRS/LLC/SEC.
BANNED FORMAT: daily process documentation — 25 posts, median zero comments.
NEVER use AI slop language: ${(voice.never ?? voice.ai_slop_banned ?? ['delve','leverage','synergy','utilize','certainly','absolutely']).join(', ')}.

## PLAIN SPEECH — ruled ${ps.ruled ?? '2026-09-17'}. This governs every word you write.

${ps.law ?? 'No term stands alone. Name it, say what it means, say what to do.'}
${ps.why ?? ''}

Every teaching unit takes the same three moves, in the same order, every time:
${(ps.moves ?? []).map((m: any) => `${m.n}. ${m.move} — e.g. "${m.example}"`).join('\n')}

${ps.order ?? ''}

BANNED: ${ps.banned ?? ''}

Say the plain thing, not the industry thing:
${(ps.swaps ?? []).map((w: any) => `- NOT "${w.not}" -> "${w.use}"`).join('\n')}

If you write a term the listener would have to already know, you have broken this rule. Gloss it in the next clause or cut it.

## RETIRED — never write these
"Called Expert", "ICP 1", "ICP 2", the 32-50 professional, R9,000-R45,000, R9,997, R18,000.${retired ? '\n' + retired : ''}
Retired from PUBLIC use (fine inside paid delivery): River-Fish-Tank, "asset" as a public noun, "Knowledge Entrepreneur".`
}
