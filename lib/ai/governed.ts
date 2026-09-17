/**
 * GOVERNED GENERATION — the only way this system should call a model.
 *
 * Three things happen that a raw anthropic.messages.create() does not do:
 *   1. IN  — live doctrine from the database (ICP, tiers, pillars, voice) plus the
 *            fact-lock ban list are prepended to the system prompt. The model is told
 *            what it may not claim BEFORE it writes, not after.
 *   2. OUT — the completion is run through the fact-lock engine. A banned claim triggers
 *            ONE repair pass naming the exact violations. Still dirty = returned blocked,
 *            never silently shipped.
 *   3. LOG — every call records what governance it used, so a bad output is traceable to
 *            the doctrine version that produced it.
 *
 * The model id is never hardcoded at a call site: it resolves from env, so swapping models
 * is a config change.
 */

import { anthropic } from '@/lib/claude'
import { check, banListForPrompt, verdict, type Hit } from '@/lib/fact-lock'
import { governanceForPrompt, getGovernance } from '@/lib/governance'

export const MODEL = {
  fast: process.env.AI_MODEL_FAST || 'claude-haiku-4-5-20251001',
  main: process.env.AI_MODEL_MAIN || 'claude-sonnet-5',
  deep: process.env.AI_MODEL_DEEP || 'claude-opus-5',
} as const

export type GovernedResult = {
  text: string
  blocked: boolean
  factLock: { clean: boolean; banned: Hit[]; careful: Hit[]; verdict: string }
  repaired: boolean
  meta: { model: string; pillar?: string; tier?: string; governance: string; ms: number }
}

export type GovernedOpts = {
  /** What the tool is asking for. */
  prompt: string
  /** Tool-specific rules appended after the shared doctrine. */
  system?: string
  pillar?: string
  tier?: string
  tier_of?: 'fast' | 'main' | 'deep'
  maxTokens?: number
  temperature?: number
  /** Set false for pure analysis (no claims made), which skips the repair pass. */
  enforceFactLock?: boolean
}

async function callModel(model: string, system: string, prompt: string, maxTokens: number, temperature: number) {
  const res: any = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system,
    messages: [{ role: 'user', content: prompt }],
  })
  return (res.content ?? [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
}

export async function generate(opts: GovernedOpts): Promise<GovernedResult> {
  const started = Date.now()
  const model = MODEL[opts.tier_of ?? 'main']
  const enforce = opts.enforceFactLock !== false
  const maxTokens = opts.maxTokens ?? 4000
  const temperature = opts.temperature ?? 0.7

  const g = await getGovernance()
  const doctrine = await governanceForPrompt({ pillar: opts.pillar, tier: opts.tier })

  const system = [
    doctrine,
    enforce ? banListForPrompt() : '',
    opts.system ?? '',
  ].filter(Boolean).join('\n\n---\n\n')

  let text = await callModel(model, system, opts.prompt, maxTokens, temperature)
  let repaired = false
  let fl = check(text)

  // One repair pass. Naming the exact violation works far better than a generic retry.
  if (enforce && !fl.clean) {
    const violations = fl.banned
      .map((b) => `- You wrote ${b.found.join(', ')} which is "${b.name}". ${b.fix}`)
      .join('\n')
    const repairPrompt = `You produced output containing claims that are disproven or legally locked. Rewrite it completely, keeping the structure, the voice and the argument, but removing every violation below. Do NOT substitute a different unverified number — if you cannot source a figure, cut the claim and keep the sentence working without it.

VIOLATIONS:
${violations}

YOUR PREVIOUS OUTPUT:
${text}

Return only the corrected version, nothing else.`
    text = await callModel(model, system, repairPrompt, maxTokens, 0.4)
    repaired = true
    fl = check(text)
  }

  return {
    text,
    blocked: enforce && !fl.clean,
    factLock: { ...fl, verdict: verdict(fl) },
    repaired,
    meta: {
      model,
      pillar: opts.pillar,
      tier: opts.tier,
      governance: String(g._source ?? 'unknown'),
      ms: Date.now() - started,
    },
  }
}

/**
 * Analysis, not authorship. Returns parsed JSON and skips the fact-lock repair pass,
 * because describing a banned figure found in someone's data is not the same as claiming it.
 */
export async function analyse<T = any>(opts: {
  prompt: string
  system?: string
  schemaHint: string
  tier_of?: 'fast' | 'main' | 'deep'
  maxTokens?: number
}): Promise<{ data: T | null; raw: string; model: string }> {
  const model = MODEL[opts.tier_of ?? 'fast']
  const doctrine = await governanceForPrompt()
  const system = [
    doctrine,
    opts.system ?? '',
    `Reply with ONE valid JSON object and nothing else. No prose, no markdown fence.\nShape: ${opts.schemaHint}`,
  ].filter(Boolean).join('\n\n---\n\n')

  const raw = await callModel(model, system, opts.prompt, opts.maxTokens ?? 3000, 0.2)
  let data: T | null = null
  try {
    const m = raw.match(/\{[\s\S]*\}/)
    data = m ? JSON.parse(m[0]) : null
  } catch { data = null }
  return { data, raw, model }
}
