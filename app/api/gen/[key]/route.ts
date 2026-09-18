/**
 * POST /api/gen/[key] — one governed route for every spec'd generator.
 *
 * The shape is identical for all of them on purpose: grounding out of the database, a narrow
 * filling job for the model, then a fact-lock pass over everything written. Eight tools that
 * cannot drift apart in rigour, because there is only one implementation of the rigour.
 */

import { NextRequest, NextResponse } from 'next/server'
import { SPECS } from '@/lib/generators/specs'
import { build } from '@/lib/generators/builders'
import { buildGovernedSystemPrompt } from '@/lib/skills'
import { generate } from '@/lib/ai/governed'
import { check } from '@/lib/fact-lock'
import { extractJson } from '@/lib/json-extract'
import { logActivity, type Entity } from '@/lib/activity'
import { explainGenerationFailure } from '@/lib/ai/explain'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
/**
 * vercel.json allows 300s, but a route-level export WINS over it — so the 60 that used to be
 * here was the real ceiling, and every long generation was killed mid-stream and reported as
 * a model failure. See lib/ai/explain.ts.
 */
export const maxDuration = 300

const ENTITY: Record<string, Entity> = {
  captions: 'caption', repurpose: 'script', storytelling: 'story', fears: 'governance',
  runsheet: 'shoot', pitch: 'script', offers: 'script', visuals: 'shoot',
}

/** Walk any JSON and collect every string, so a claim cannot hide in a nested field. */
function allText(v: any, acc: string[] = []): string[] {
  if (typeof v === 'string') acc.push(v)
  else if (Array.isArray(v)) v.forEach((x) => allText(x, acc))
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => allText(x, acc))
  return acc
}

export async function POST(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    return await run(request, params.key)
  } catch (e: any) {
    // A thrown handler returns a bare 500 with no body — nothing to act on. Say what broke.
    return NextResponse.json({
      error: e?.message || 'The generator failed.',
      hint: 'If this mentions a timeout, the piece is too long for one pass — try a shorter runtime or fewer items.',
    }, { status: 502 })
  }
}

async function run(request: NextRequest, key: string) {
  const spec = SPECS[key]
  if (!spec) return NextResponse.json({ error: `Unknown generator "${key}".` }, { status: 404 })

  const input = await request.json().catch(() => ({}))
  const required = spec.fields.filter((f) => !f.optional).map((f) => f.name)
  const missingInput = required.filter((f) => !String(input?.[f] ?? '').trim())
  if (missingInput.length) {
    return NextResponse.json({ error: `Missing: ${missingInput.join(', ')}` }, { status: 400 })
  }

  const built = await build(key, input)
  if (built.missing) {
    return NextResponse.json({
      error: `This generator needs "${built.missing}" and it is not seeded.`,
      fix: 'Run scripts/seed-algorithm.ts, or add the key in Knowledge.',
    }, { status: 503 })
  }

  const { system, skillsUsed } = await buildGovernedSystemPrompt(
    key === 'storytelling' ? 'stories' : key === 'runsheet' || key === 'visuals' ? 'edit' : 'scripts',
    { pillar: input.pillar, tier: input.tier },
  )

  const out = await generate({
    tool: key,   // captions | fears | storytelling | visuals | repurpose | runsheet | offers | pitch
    prompt: `${built.prompt}\n\nReturn ONE JSON object, no prose, no fence.\nShape: ${built.schemaHint}`,
    system, pillar: input.pillar, tier: input.tier, tier_of: 'main', maxTokens: 3000,
  })

  const { data } = extractJson<any>(out.text)
  const bad = explainGenerationFailure(out, data, spec.title.toLowerCase(), 300)
  if (bad) {
    const { status, ...body } = bad
    return NextResponse.json(body, { status })
  }

  const fl = check(allText(data).join('\n'))

  await logActivity(ENTITY[key] ?? 'script', 'generate', `${spec.title} — ${String(input[spec.fields[0].name]).slice(0, 60)}`, {
    generator: key, pillar: input.pillar, tier: input.tier, banned: !fl.clean,
  })

  return NextResponse.json({
    success: true,
    key,
    result: data,
    composition: { ratio: '80% data / 20% model', fromData: built.fromData, fromModel: 'filling the declared shape' },
    factLock: { clean: fl.clean, banned: fl.banned.map((b) => ({ name: b.name, found: b.found, fix: b.fix })) },
    blocked: !fl.clean,
    meta: { ...out.meta, skillsUsed },
  })
}
