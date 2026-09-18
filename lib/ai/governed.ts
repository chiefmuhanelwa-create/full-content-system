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
import { brainDoc } from '@/lib/skills'
import { extractJson } from '@/lib/json-extract'
import { recordGeneration } from '@/lib/ai/record'

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
  meta: { model: string; pillar?: string; tier?: string; governance: string; ms: number; stopReason?: string | null }
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
  /** Accepted for call-site compatibility; never sent — deprecated on current models. */
  temperature?: number
  /** Set false for pure analysis (no claims made), which skips the repair pass. */
  enforceFactLock?: boolean
  /** Which tool asked. Recorded so the history is browsable by tool. */
  tool?: string
  /**
   * Skill text for this module, from buildGovernedSystemPrompt. Cached as its own block —
   * it is stable per module, so after the first call it is read back at a fraction of the
   * price instead of re-sent whole.
   */
  skills?: string
  /** Set when the work came from an Idea Bank handoff, so the record links back. */
  ideaId?: string
}


/**
 * Strip unpaired UTF-16 surrogates.
 *
 * Captions are full of emoji, and slicing one by code UNITS can cut a surrogate pair in half.
 * The lone half is not valid UTF-8, so the request body is rejected outright with
 * "no low surrogate in string" — a failure that looks like a model problem and is not.
 * Applied to everything sent, so no caller has to remember.
 */
export function sanitiseForModel(s: string): string {
  return String(s ?? '').replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
}

/**
 * The system prompt in two parts, because only one of them is worth caching.
 *
 * `stable` is the doctrine + ban list. It is byte-identical on every call from every tool,
 * so it is sent as its own block marked cacheable — the cache is a PREFIX match, so all ten
 * tools share one cached prefix and pay ~10% for it on a hit instead of full price.
 *
 * `volatile` is the tool's own rules. It changes per tool and is never cached.
 *
 * This is the whole token story on this system: input ran ~6.7x output over 30 days, so the
 * saving is in what we RE-SEND, not in what the model writes.
 */
export type SystemParts = { cached: string[]; volatile?: string }

let cacheUnsupported = false // set once if the API rejects cache_control, then never retried

/**
 * `cached` blocks are ordered most-shared first — doctrine, then the ban list — so every
 * tool matches on the doctrine prefix even when it does not send the ban list. The cache is
 * a prefix match, so block ORDER is what decides the hit rate, not block content.
 */
function systemBlocks(s: SystemParts): any {
  const cached = s.cached.map(sanitiseForModel).filter(Boolean)
  const volatile = sanitiseForModel(s.volatile ?? '')
  if (cacheUnsupported) {
    return [...cached, volatile].filter(Boolean).join('\n\n---\n\n')
  }
  const blocks: any[] = cached.map((text) => ({
    type: 'text', text, cache_control: { type: 'ephemeral' },
  }))
  if (volatile) blocks.push({ type: 'text', text: volatile })
  return blocks
}

async function callModel(model: string, system: SystemParts, prompt: string, maxTokens: number) {
  // Streaming, not a single blocking POST. A non-streamed request with a large system prompt
  // and a high max_tokens holds the connection open long enough that the hop in front of it
  // closes the body early — surfacing as "Premature close" with no useful detail. The SDK
  // recommends streaming for exactly this, and .finalMessage() still gives one whole result.
  //
  // `temperature` is deprecated on current Claude models and is rejected outright, so it is
  // never sent. Determinism is steered through the prompt instead.
  const send = (sys: any) => (anthropic as any).messages.stream({
    model,
    max_tokens: maxTokens,
    system: sys,
    messages: [{ role: 'user', content: sanitiseForModel(prompt) }],
  })

  let res: any
  try {
    res = await send(systemBlocks(system)).finalMessage()
  } catch (e: any) {
    // The pinned SDK predates prompt caching going GA. If the shape is rejected, fall back
    // to a plain string once and stop trying for the life of the process — a caching
    // optimisation must never be the reason generation fails.
    const msg = String(e?.message ?? '')
    if (!cacheUnsupported && /cache_control|system/i.test(msg)) {
      cacheUnsupported = true
      res = await send(systemBlocks(system)).finalMessage()
    } else {
      throw e
    }
  }

  const u = res.usage ?? {}
  const cache = {
    created: u.cache_creation_input_tokens ?? 0,
    read: u.cache_read_input_tokens ?? 0,
    input: u.input_tokens ?? 0,
    output: u.output_tokens ?? 0,
  }
  const text = (res.content ?? [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
  return { text, stopReason: res.stop_reason ?? null, cache }
}

/**
 * An empty completion has two very different causes, and retrying only helps one of them:
 *   - the stream genuinely returned nothing (fast, and a retry fixes it)
 *   - the serverless function was killed mid-stream at the plan's duration ceiling (slow,
 *     and a retry guarantees a second kill)
 * So retry ONLY when the first attempt came back quickly. Anything slower is a timeout
 * wearing an empty-response costume, and the honest move is to say so.
 */
const RETRY_IF_FASTER_THAN_MS = 20_000

async function callModelWithRetry(model: string, system: SystemParts, prompt: string, maxTokens: number) {
  const t0 = Date.now()
  const first = await callModel(model, system, prompt, maxTokens)
  const elapsed = Date.now() - t0
  if (first.text.trim()) return first
  if (elapsed > RETRY_IF_FASTER_THAN_MS) {
    return { ...first, timedOut: true as const }
  }
  return await callModel(model, system, prompt, maxTokens)
}

export async function generate(opts: GovernedOpts): Promise<GovernedResult> {
  const started = Date.now()
  const model = MODEL[opts.tier_of ?? 'main']
  const enforce = opts.enforceFactLock !== false
  // 2000, not 4000. Output was ~15% of the 30-day spend and almost nothing here needs
  // 4k tokens; a caller that genuinely does still passes maxTokens explicitly.
  const maxTokens = opts.maxTokens ?? 2000

  const g = await getGovernance()
  const [brain, doctrine] = await Promise.all([
    brainDoc(),
    governanceForPrompt({ pillar: opts.pillar, tier: opts.tier }),
  ])

  // Three cached blocks, ordered most-shared first: doctrine is common to every tool, the
  // ban list to every authoring tool, skills to this module. The tool's own rules are the
  // only part that changes per call, so they alone stay uncached.
  // Four cached blocks, most-shared first. The brain leads because it is identical for
  // every tool on every call — the best possible cache prefix — and because it is the
  // document everything below is derived from.
  const system: SystemParts = {
    cached: [brain, doctrine, enforce ? banListForPrompt() : '', opts.skills ?? ''],
    volatile: opts.system ?? '',
  }

  const first = await callModelWithRetry(model, system, opts.prompt, maxTokens)
  let text = first.text
  const stopReason = (first as any).timedOut ? 'function_timeout' : first.stopReason
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
    text = (await callModelWithRetry(model, system, repairPrompt, maxTokens)).text
    repaired = true
    fl = check(text)
  }

  const ms = Date.now() - started

  // Recorded here, at the single choke point every governed tool passes through, rather
  // than at each call site — so a tool added tomorrow is covered without being told to.
  recordGeneration({
    tool: opts.tool ?? 'unknown',
    kind: 'generate',
    model,
    pillar: opts.pillar,
    tier: opts.tier,
    input: opts.prompt,
    output: text,
    factLock: { clean: fl.clean, banned: fl.banned, careful: fl.careful },
    blocked: enforce && !fl.clean,
    repaired,
    ms,
    governance: String(g._source ?? 'unknown'),
    ideaId: opts.ideaId,
  })

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
      stopReason,
      ms,
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
  tool?: string
}): Promise<{ data: T | null; raw: string; model: string }> {
  const model = MODEL[opts.tier_of ?? 'fast']
  const doctrine = await governanceForPrompt()
  // Same cached prefix as generate() uses, so analysis calls hit the cache the authoring
  // calls warmed — and vice versa.
  const system: SystemParts = {
    cached: [doctrine],
    volatile: [
      opts.system ?? '',
      `Reply with ONE valid JSON object and nothing else. No prose, no markdown fence.\nShape: ${opts.schemaHint}`,
    ].filter(Boolean).join('\n\n---\n\n'),
  }

  const t0 = Date.now()
  const raw = (await callModelWithRetry(model, system, opts.prompt, opts.maxTokens ?? 2000)).text
  const { data } = extractJson<T>(raw)

  recordGeneration({
    tool: opts.tool ?? 'analysis', kind: 'analyse', model,
    input: opts.prompt, output: raw, ms: Date.now() - t0,
  })

  return { data, raw, model }
}
