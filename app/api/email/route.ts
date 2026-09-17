/**
 * EMAIL — the one owned channel, wired to MailerLite.
 *
 * GET  /api/email                 groups + list health from MailerLite
 * POST /api/email {action:'draft'} governed email draft (subject lines + body)
 * POST /api/email {action:'push'}  create it in MailerLite AS A DRAFT — never sends
 *
 * Nothing here sends. A factory that publishes on its own publishes its first mistake at
 * full volume. MailerLite's own UI is the send button.
 *
 * Duty of care: the vulnerability that makes this content work also surfaces people in
 * crisis. Never automate into a crisis reply. SADAG 0800 567 567 · SMS 31393.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { getGovernance, OWNER } from '@/lib/governance'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'

/** Generation regularly runs past the default ceiling; a truncated function reads as an empty model response. */
export const maxDuration = 300

const ML = 'https://connect.mailerlite.com/api'

function mlHeaders() {
  const key = process.env.MAILERLITE_API_KEY
  if (!key) return null
  return { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' }
}

export async function GET() {
  const h = mlHeaders()
  if (!h) {
    return NextResponse.json({
      connected: false,
      error: 'MAILERLITE_API_KEY is not set in .env.local.',
      note: 'Drafting still works without it. Only pushing to MailerLite needs the key.',
    })
  }
  try {
    const r = await fetch(`${ML}/groups?limit=50`, { headers: h, cache: 'no-store' })
    const j = await r.json()
    if (!r.ok) return NextResponse.json({ connected: false, error: j?.message || `MailerLite ${r.status}` }, { status: 502 })
    const groups = (j.data || []).map((g: any) => ({
      id: g.id, name: g.name, active: g.active_count, total: g.total ?? null,
    }))
    if (prisma) {
      await prisma.integration.upsert({
        where: { userId_provider: { userId: OWNER, provider: 'mailerlite' } },
        create: { userId: OWNER, provider: 'mailerlite', status: 'ok', lastCheckedAt: new Date(), detail: `${groups.length} groups` },
        update: { status: 'ok', lastCheckedAt: new Date(), detail: `${groups.length} groups` },
      }).catch(() => {})
    }
    return NextResponse.json({
      connected: true,
      groups,
      totalActive: groups.reduce((a: number, g: any) => a + (g.active || 0), 0),
      note: 'The reachable list fell 1,246 to 148 in 25 days with only 28 unsubscribes. Attrition on a cold list is healthy sorting, not bleeding.',
    })
  } catch (e: any) {
    return NextResponse.json({ connected: false, error: e.message }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action } = body
  const gov = await getGovernance()

  if (action === 'draft') {
    const { topic, pillar, tier, purpose = 'teach' } = body
    if (!topic?.trim()) return NextResponse.json({ error: 'A topic is required.' }, { status: 400 })

    const cta = (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live' && k.pillar === pillar)
      ?? (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live')
    const { system } = await buildGovernedSystemPrompt('email', { pillar, tier })

    const out = await generate({
      prompt: `Write the weekly email.

TOPIC: ${topic}
PILLAR: ${pillar ?? 'choose and say which'}
TIER SERVED: ${tier ?? 'choose and say which'}
PURPOSE: ${purpose}

RULES:
- This goes to a list of ${gov.ledger_totals?.email_list ?? 173} people who raised their hand. Write to ONE of them, not to a list.
- Open on HIS loss with a figure that exists in the ledger. That is the Loss Law and it governs written surfaces.
- One idea. One mechanism. One ask.
- Short paragraphs. Median sentence 5 words. Line breaks carry the punctuation.
- ONE CTA${cta ? `, pointing at ${cta.destination}` : ' — and no keyword currently resolves, so make the ask a reply instead'}.
- Plain text feel. No hero images, no marketing furniture.
- SA English. ZAR as R1,800.

Return ONE JSON object:
{"subjectLines":["three options, under 45 characters each"],"preheader":"under 90 characters","body":"the email, plain text with line breaks","cta":"the single ask","pillar":"...","tier":"..."}`,
      system, pillar, tier, tier_of: 'main', maxTokens: 3000,
    })

    const ex = extractJson<any>(out.text)
    const email = ex.data
    if (!email) {
      return NextResponse.json({
        error: 'The model did not return usable JSON.',
        diagnosis: ex.truncated ? 'The response was cut off at the token limit.' : 'No JSON object found.',
        raw: out.text.slice(0, 1500),
      }, { status: 502 })
    }

    const fl = check(`${email.subjectLines?.join(' ')} ${email.preheader} ${email.body}`)
    return NextResponse.json({
      success: true, email,
      factLock: { clean: fl.clean, banned: fl.banned.map(b => ({ name: b.name, found: b.found })) },
      blocked: !fl.clean,
      warning: !fl.clean ? 'A re-permission email once reached the cold list carrying a banned figure. Do not push this until it is clean.' : null,
    })
  }

  if (action === 'push') {
    const { subject, bodyHtml, groupIds, name } = body
    const h = mlHeaders()
    if (!h) return NextResponse.json({ error: 'MAILERLITE_API_KEY is not set.' }, { status: 400 })
    if (!subject || !bodyHtml) return NextResponse.json({ error: 'subject and bodyHtml are required.' }, { status: 400 })

    // Refuse to push anything that fails the fact-lock. This is the guard that was missing
    // when a re-permission email reached the cold list carrying R285,000.
    const fl = check(`${subject} ${bodyHtml}`)
    if (!fl.clean) {
      return NextResponse.json({
        error: 'Blocked — this email contains a banned claim.',
        banned: fl.banned.map(b => ({ name: b.name, found: b.found, fix: b.fix })),
      }, { status: 422 })
    }

    try {
      const r = await fetch(`${ML}/campaigns`, {
        method: 'POST', headers: h,
        body: JSON.stringify({
          name: name || subject,
          type: 'regular',
          groups: groupIds ?? [],
          emails: [{ subject, from_name: 'Ndivhuwo', from: process.env.OWNER_EMAIL || 'info@nochill.co.za', content: bodyHtml }],
        }),
      })
      const j = await r.json()
      if (!r.ok) return NextResponse.json({ error: j?.message || `MailerLite ${r.status}`, detail: j }, { status: 502 })
      return NextResponse.json({
        success: true,
        campaignId: j?.data?.id,
        status: j?.data?.status ?? 'draft',
        note: 'Created as a DRAFT in MailerLite. Nothing was sent. You press send there.',
      })
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 502 })
    }
  }

  return NextResponse.json({ error: `Unknown action "${action}". Use draft or push.` }, { status: 400 })
}
