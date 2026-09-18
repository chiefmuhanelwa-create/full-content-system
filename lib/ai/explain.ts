/**
 * Turn a failed generation into an error that teaches.
 *
 * "The model did not return usable hooks" was wrong nearly every time it appeared. The model
 * had usually returned nothing at all, because the serverless function was killed mid-stream
 * at its duration ceiling. Blaming the model sent everyone looking in the wrong place — which
 * is exactly what the route's own comment warned about and nothing acted on.
 *
 * There are four distinct failures behind one symptom, and they need four different answers:
 *
 *   1. EMPTY, AT THE CEILING   ran the full budget. Ask for less in one pass.
 *   2. EMPTY, UNDER THE CEILING the model returned no text, twice. NOT a timeout — if this
 *                               message renders, the function was alive to write it.
 *   3. TEXT, NO JSON    it wrote prose instead of the object. A prompt problem.
 *   4. BLOCKED          it wrote a banned claim twice, so the fact-lock kept it in.
 */

export type GenerationLike = {
  text: string
  blocked?: boolean
  factLock?: { banned?: { name: string; found?: string[] }[] }
  meta?: { ms?: number; model?: string; stopReason?: string | null }
}

export type Explained = {
  error: string
  why: string
  fix: string
  stage: 'timeout' | 'empty' | 'unparseable' | 'truncated' | 'blocked'
  elapsedMs?: number
  model?: string
  raw?: string
  status: number
}

/**
 * @param out       what generate() returned
 * @param parsed    what extractJson() produced — null or undefined means it could not parse
 * @param noun      what this tool was trying to make, e.g. "hooks", "a script"
 * @param maxDurationSec the route's own ceiling, so the message can name the real number
 */
export function explainGenerationFailure(
  out: GenerationLike,
  parsed: unknown,
  noun: string,
  maxDurationSec = 60,
  /**
   * From extractJson(). TRUE means the object was closed by repair because the model stopped
   * mid-write — the JSON parses, but the content is cut off.
   *
   * This is the quiet one. A truncated script PARSES, so it renders as a success with a
   * sentence that stops mid-word, and nobody is told. It has to fail loudly or it ships.
   */
  truncated = false,
): Explained | null {
  const text = (out.text ?? '').trim()
  const ms = out.meta?.ms ?? 0
  const model = out.meta?.model
  // The model answered with nothing, twice. This is NOT evidence of a function timeout:
  // if this message is being rendered, the function was alive long enough to write it.
  const emptyCompletion = out.meta?.stopReason === 'empty_completion'

  // 4 — it produced something, but the fact-lock refused to let it out.
  if (out.blocked) {
    const names = (out.factLock?.banned ?? []).map((b) => b.name).filter(Boolean)
    return {
      stage: 'blocked',
      error: `Wrote ${noun}, then blocked it.`,
      why: names.length
        ? `The output kept using ${names.join(', ')} — a claim the fact-lock bans. It was asked to rewrite once and used it again.`
        : 'The output carried a banned claim twice, so it was withheld rather than shipped.',
      fix: 'Change the topic so the claim is not needed, or check the figure in Fact-Lock. An empty slot beats a plausible filler — never swap in a different unsourced number.',
      elapsedMs: ms, model, raw: text.slice(0, 1200), status: 422,
    }
  }

  // 1 and 2 — nothing came back. The elapsed time says which.
  if (!text) {
    const nearCeiling = ms > maxDurationSec * 900
    if (nearCeiling) {
      const secs = (ms / 1000).toFixed(0)
      return {
        stage: 'timeout',
        error: `Ran out of time before finishing ${noun}.`,
        why: `It ran ${secs}s against this route's ${maxDurationSec}s ceiling. That is genuinely close to the limit, and a stream cut at the ceiling returns empty text — which looks exactly like a model failure and is not one.`,
        fix: `Ask for less in one pass. A fact-lock repair counts as a second full generation inside the same ${maxDurationSec}s budget.`,
        elapsedMs: ms, model, status: 504,
      }
    }
    if (emptyCompletion) {
      const secs = (ms / 1000).toFixed(0)
      return {
        stage: 'empty',
        error: `The model returned nothing for ${noun}, twice.`,
        // Do not blame the platform here. This message only exists because the function was
        // alive to write it — so it was not killed, and maxDuration is not involved.
        why: `It was asked twice and came back with no text both times, over ${secs}s total. The function was not killed: it stayed alive long enough to report this.`,
        // The measured cause, 2026-09-19: thinking is billed as output and was unbounded, so
        // it consumed the whole ceiling before a text block was ever opened — 8,766 of 10,000
        // tokens on one run. "Transient, try again" was the wrong answer and sent people back
        // to re-run a call that would fail the same way.
        fix: 'Check the thinking budget against maxTokens on this route. Unbounded thinking is billed as output and can spend the entire ceiling before any text is written, which arrives here looking like an empty response. If the budget is already capped, then the topic is being refused.',
        elapsedMs: ms, model, status: 502,
      }
    }
    return {
      stage: 'empty',
      error: `The model returned nothing for ${noun}.`,
      why: `It came back empty in ${(ms / 1000).toFixed(1)}s — too fast to be a timeout, so the model genuinely produced no text. That usually means the prompt asked for something it would not write, or an input was empty.`,
      fix: 'Check the topic is filled in and specific. If it keeps happening on one topic, the topic is the problem, not the tool.',
      elapsedMs: ms, model, status: 502,
    }
  }

  // 3a — it parsed, but it stopped mid-write.
  if (truncated) {
    return {
      stage: 'truncated',
      error: `The ${noun.replace(/^a /, '')} stopped mid-sentence.`,
      why: `The model hit its token ceiling before finishing. The JSON was closed by repair so it still parses — which is why this can look like a success and read like a draft someone abandoned.`,
      fix: 'Raise maxTokens on this route, or ask for a shorter piece. If the last beat trails off mid-word, that is this and nothing else.',
      elapsedMs: ms, model, raw: text.slice(-600), status: 502,
    }
  }

  // 3b — there IS text, it just is not the shape the route needs.
  if (parsed == null) {
    return {
      stage: 'unparseable',
      error: `Got ${noun} back in the wrong shape.`,
      why: `It wrote ${text.length} characters but not the JSON object this tool needs — usually prose, an apology, or JSON cut off mid-way at the token ceiling.`,
      fix: 'If the raw text below ends mid-sentence it ran out of tokens: raise maxTokens or ask for fewer items. If it is prose, the prompt needs a firmer instruction to return only JSON.',
      elapsedMs: ms, model, raw: text.slice(0, 1200), status: 502,
    }
  }

  return null   // nothing wrong
}
