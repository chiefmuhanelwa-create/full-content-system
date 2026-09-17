/**
 * BRAND COLLAB ENGINE — one route, five jobs, all driven by live numbers.
 *
 * POST /api/brand  { action }
 *   ratecard  — a costed rate card from ACTUAL followers + engagement, not a guess
 *   mediakit   — the forwardable one-pager
 *   fit        — accept or reject a brand against the ruled values, with a reason
 *   reply      — draft the email back to the agency, priced from objectives
 *   invoice    — invoice + the 35% SARS take, held from RECEIVED money only
 *
 * The rate card is the product's reason to exist: the same deliverable was priced R100 to
 * R22,000 across 25 creators in the intake. And per the four rules of the room, the agency
 * asks for your rate card BEFORE it proposes a budget — so an uncosted number becomes the
 * ceiling on a budget you never see.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { getGovernance, OWNER } from '@/lib/governance'
import { generate, analyse } from '@/lib/ai/governed'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
export const maxDuration = 60

/** Live account numbers. Falls back to the ruled figures if no sync has run. */
async function accountNumbers() {
  const gov = await getGovernance()
  let followers = gov.ledger_totals?.instagram_followers ?? 270283
  let er: number | null = null
  let medianReach: number | null = null

  if (prisma) {
    const snap = await prisma.instagramSnapshot.findFirst({ where: { userId: OWNER }, orderBy: { capturedAt: 'desc' } })
    if (snap?.followers) followers = snap.followers
    const media = await prisma.instagramMedia.findMany({
      where: { userId: OWNER }, orderBy: { postedAt: 'desc' }, take: 30,
      select: { likeCount: true, commentsCount: true, reach: true },
    })
    if (media.length) {
      const ers = media.filter((m) => m.reach && m.reach > 0)
        .map((m) => ((m.likeCount + m.commentsCount) / (m.reach as number)) * 100)
      if (ers.length) er = +(ers.reduce((a, b) => a + b, 0) / ers.length).toFixed(2)
      const reaches = media.map((m) => m.reach).filter(Boolean) as number[]
      if (reaches.length) { reaches.sort((a, b) => a - b); medianReach = reaches[Math.floor(reaches.length / 2)] }
      if (er === null) {
        const eng = media.map((m) => m.likeCount + m.commentsCount)
        const avg = eng.reduce((a, b) => a + b, 0) / eng.length
        er = +((avg / followers) * 100).toFixed(2)
      }
    }
  }
  return { followers, engagementRate: er, medianReach, postsAnalysed: medianReach ? 30 : 0 }
}

/**
 * The costed floor. Built from measured reach, not a CPM table — the estate holds two CPM
 * tables that disagree 6.4x (B1), so neither is trusted as the base.
 */
function rateCard(n: { followers: number; engagementRate: number | null; medianReach: number | null }) {
  const reach = n.medianReach ?? Math.round(n.followers * 0.02)
  const base = Math.max(3000, Math.round((reach / 1000) * 1200 / 500) * 500)
  const line = (label: string, mult: number, note: string) => ({
    deliverable: label, zar: Math.round(base * mult / 500) * 500, note,
  })
  return {
    basis: `Priced from median reach (${reach.toLocaleString()}), not follower count. Famous is not paid.`,
    core: [
      line('Instagram Reel (1)', 1, 'The standard unit.'),
      line('Reel + Story set (3)', 1.4, 'Stories expire — price them as amplification, not content.'),
      line('Carousel / Feed post', 0.8, 'Out-reaches reels 2.2x on this account, and needs no camera.'),
      line('Reel + Carousel + Stories', 2.1, 'The bundle most agencies actually want.'),
      line('Monthly retainer (4 pieces)', 3.2, 'R12,500/mo is the only recurring line in the record. Retainers beat one-offs.'),
    ],
    addOns: [
      { item: 'Usage rights — 3 months, organic only', pct: 30, note: 'Only 2 of 25 creators charge this. It is not a favour.' },
      { item: 'Usage rights — 6 months + paid amplification', pct: 75, note: 'If they can run it as an ad, it is a different product.' },
      { item: 'Category exclusivity — campaign period', pct: 40, note: 'One documented deal carried banking exclusivity for R10,500 total. Agencies have asked for six years and got it free.' },
      { item: 'Whitelisting / handle access', pct: 60, note: 'They are renting your account, not your content.' },
      { item: 'Travel beyond 40km', pct: 15, note: '9 of 25 charge travel. Charge it.' },
      { item: 'Production — additional location or talent', pct: 25, note: 'Real cost, passed through.' },
      { item: 'Rush — under 5 working days', pct: 25, note: 'Their planning failure is not your discount.' },
    ],
    terms: [
      'Invoice on delivery. Payment 30 days. Nobody pays upfront — price the delay in.',
      'Invoice goes to the agency billing contact, not the brand. Get it in writing before shooting.',
      'Rates exclude VAT. Quoted in ZAR.',
      'Two rounds of amends included; further rounds billed at 15%.',
    ],
    floorRule: 'Never quote below the floor from memory. If they will not share a budget range, quote the costed number — your number sets theirs.',
  }
}

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const body = await request.json()
  const { action } = body
  const gov = await getGovernance()
  const numbers = await accountNumbers()

  if (action === 'ratecard') {
    return NextResponse.json({ success: true, numbers, rateCard: rateCard(numbers) })
  }

  if (action === 'mediakit') {
    const out = await generate({
      prompt: `Write a forwardable one-page media kit. The reader is an agency account manager who will paste it into an email to a client.

LIVE NUMBERS: ${numbers.followers.toLocaleString()} Instagram followers${numbers.engagementRate ? `, ${numbers.engagementRate}% engagement rate` : ''}${numbers.medianReach ? `, ${numbers.medianReach.toLocaleString()} median reach` : ''}. Audience 75.7% South Africa, 56.8% aged 25–34.

Include: who the audience is, what he makes, the behavioural proof (unprompted performance reports to three independent agencies — one replied he was the only influencer who had ever done it), press (TimesLIVE/Sunday Times, News24 — both dated and citable), and what a brand gets.

Do NOT include any figure that is not in the safe list. No follower totals across platforms. No award count — say "award-winning" or name one.`,
      tier_of: 'main', maxTokens: 2000,
    })
    return NextResponse.json({ success: true, numbers, mediaKit: out.text, factLock: out.factLock, blocked: out.blocked })
  }

  if (action === 'fit') {
    const { brand, offer, deliverables, fee } = body
    const values = (gov.identity?.values ?? []).map((v: any) => `${v.name}: ${v.means}`).join('\n')
    const { data } = await analyse<any>({
      prompt: `Decide whether to take this brand deal.

BRAND: ${brand}
OFFER: ${offer ?? 'not stated'}
DELIVERABLES: ${deliverables ?? 'not stated'}
FEE OFFERED: ${fee ? `R${fee}` : 'not stated'}

HIS VALUES:
${values}

HIS AUDIENCE: creators who are already earning and leaking it — being underpaid, untaxed, and dependent on a platform.

Judge on four things: (1) does it contradict a stated value, (2) does it contradict what he teaches — a creator-finance teacher promoting a debt or gambling product is a contradiction, (3) is the fee at or above the costed floor, (4) does the audience actually want it.`,
      schemaHint: '{"verdict":"accept"|"negotiate"|"reject","confidence":"high"|"medium"|"low","reasons":["..."],"valueConflicts":["..."],"counterOffer":"...or null","walkAwayLine":"one sentence he can send"}',
      tier_of: 'main', maxTokens: 1500,
    })
    return NextResponse.json({ success: true, brand, decision: data })
  }

  if (action === 'reply') {
    const { thread, objective, fee, intent = 'negotiate' } = body
    const rules = (gov.agency_intel?.fourRules ?? []).map((r: any) => `${r.n}. ${r.rule} → ${r.counter}`).join('\n')
    const out = await generate({
      prompt: `Draft the reply to this agency email.

THEIR EMAIL:
${thread}

MY INTENT: ${intent}
CAMPAIGN OBJECTIVE AS STATED: ${objective ?? 'not stated — ask for it'}
MY NUMBER: ${fee ? `R${fee}` : 'derive from the costed floor and say how it was derived'}

WHAT 840 CAMPAIGN EMAILS ESTABLISHED ABOUT HOW THEY OPERATE:
${rules}

Rules for the reply:
- Professional, warm, brief. No grovelling, no over-explaining.
- If they have not given a budget range, ask for it BEFORE naming a number.
- Name usage rights, exclusivity and travel as separate line items if they are implied but unpriced.
- Ask for the billing contact and payment terms.
- Never name another brand or client.
- Sign off as Ndivhuwo.

Return the email only.`,
      tier_of: 'main', maxTokens: 1200,
    })
    return NextResponse.json({ success: true, draft: out.text, factLock: out.factLock,
      checklist: gov.agency_intel?.theyAskFor ?? [] })
  }

  if (action === 'invoice') {
    const { dealId, amountZar, brand, deliverables, invoiceNumber } = body
    const amount = Number(amountZar || 0)
    const reserve = +(amount * 0.35).toFixed(2)
    const invoice = {
      from: gov.identity?.entity ?? 'NOCHILL PTY LTD, Reg. 2016/507839/07',
      to: brand ?? 'the agency billing contact',
      number: invoiceNumber ?? `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      issued: new Date().toISOString().slice(0, 10),
      dueDays: 30,
      deliverables: deliverables ?? '',
      amountZar: amount,
      vatNote: 'Excludes VAT unless separately stated.',
      sarsReserve: reserve,
      reserveRule: '35% held the moment the money ARRIVES, not when it is invoiced. Invoiced money is not income.',
      takeHome: +(amount - reserve).toFixed(2),
      terms: 'Payment 30 days from invoice date. Invoice addressed to the agency billing contact, not the brand.',
    }
    if (dealId && prisma) {
      await prisma.deal.update({
        where: { id: dealId },
        data: { invoicedZar: amount, invoicedAt: new Date(), status: 'invoiced',
                dueAt: new Date(Date.now() + 30 * 864e5) },
      }).catch(() => {})
    }
    return NextResponse.json({ success: true, invoice })
  }

  return NextResponse.json({ error: `Unknown action "${action}". Use ratecard, mediakit, fit, reply or invoice.` }, { status: 400 })
}

export async function GET() {
  const numbers = await accountNumbers()
  return NextResponse.json({
    numbers,
    live: numbers.postsAnalysed > 0,
    note: numbers.postsAnalysed
      ? `Rate card is priced from ${numbers.postsAnalysed} synced posts.`
      : 'No Instagram sync yet — the rate card falls back to the ruled follower figure. Sync for a costed number.',
    actions: ['ratecard', 'mediakit', 'fit', 'reply', 'invoice'],
  })
}
