/**
 * POST /api/carousel — a slide deck from one idea.
 *
 * Carousels out-reach reels 2.2x and 2.7x across two independent windows on this account,
 * and comments favour feed harder still (36 vs 5). He posts 137 reels for every 14 feed posts.
 * This is the only format that removes the camera bottleneck AND outperforms.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { getGovernance, OWNER } from '@/lib/governance'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'
import { ctaForPillar, shippableCtas } from '@/lib/cta'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
/**
 * vercel.json allows 300s, but a route-level export WINS over it — so the 60 that used to be
 * here was the real ceiling, and every long generation was killed mid-stream and reported as
 * a model failure. See lib/ai/explain.ts.
 */
export const maxDuration = 300

export async function POST(request: NextRequest) {
  const { idea, pillar, tier, slides = 8 } = await request.json()
  if (!idea?.trim()) return NextResponse.json({ error: 'An idea is required.' }, { status: 400 })

  const gov = await getGovernance()
  const cta = ctaForPillar(gov, pillar)

  const { skills } = await buildGovernedSystemPrompt('carousel', { pillar, tier })

  const out = await generate({
    tool: 'carousel',
    prompt: `Build a ${slides}-slide Instagram carousel.

IDEA: ${idea}
PILLAR: ${pillar ?? 'choose and say which'}
TIER: ${tier ?? 'choose and say which'}

RULES:
- Slide 1 is the hook. It must work as a thumbnail — big, blunt, readable at a glance. Six words or fewer.
- Slide 2 names the cost of not knowing this.
- Middle slides teach ONE mechanism each. One idea per slide, never two.
- Second-to-last slide is the summary someone would screenshot.
- Last slide is the ONE CTA${cta ? ` — use "${cta.k}", it resolves to ${cta.destination}` : ' — no keyword currently resolves, so ask for a save or a follow instead'}.
- Each slide: a headline of at most 7 words, plus at most 25 words of body.
- The caption opens on HIS loss with a figure from the ledger.

Return ONE JSON object, no prose:
{"slides":[{"n":1,"headline":"...","body":"..."}],"caption":"...","ctaKeyword":"${cta?.k ?? 'NONE'}","designNote":"one line on the visual treatment"}`,
    skills, pillar, tier, tier_of: 'main', maxTokens: 6000,
  })

  const ex = extractJson<any>(out.text)
  const deck = ex.data
  if (!deck) {
    return NextResponse.json({
      error: 'The model did not return usable JSON.',
      diagnosis: ex.truncated
        ? 'The response was cut off at the token limit. Try fewer slides.'
        : 'No JSON object was found in the response.',
      raw: out.text.slice(0, 1500),
    }, { status: 502 })
  }

  const fl = check([deck.caption, ...(deck.slides ?? []).map((s: any) => `${s.headline} ${s.body}`)].join('\n'))

  const dbError = checkDatabase()
  if (!dbError && prisma) {
    await prisma.handoff.create({
      data: { userId: OWNER, fromTool: 'carousel', toTool: 'visuals', kind: 'carousel', payload: deck as any },
    }).catch(() => {})
  }

  return NextResponse.json({
    success: true, deck,
    factLock: { clean: fl.clean, banned: fl.banned.map(b => ({ name: b.name, found: b.found })) },
    blocked: !fl.clean,
    evidence: gov.algorithm?.format_finding ?? 'Carousels out-reach reels 2.2x on this account.',
  })
}
