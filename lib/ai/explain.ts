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
 *   1. EMPTY, SLOW      the function hit its ceiling. Raise maxDuration or ask for less.
 *   2. EMPTY, FAST      the model genuinely returned nothing. Usually a bad prompt or a refusal.
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
  stage: 'timeout' | 'empty' | 'unparseable' | 'blocked'
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
): Explained | null {
  const text = (out.text ?? '').trim()
  const ms = out.meta?.ms ?? 0
  const model = out.meta?.model
  const timedOut = out.meta?.stopReason === 'function_timeout'

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
    if (timedOut || ms > maxDurationSec * 900) {
      const secs = (ms / 1000).toFixed(0)
      // Only claim the route ceiling if we actually got near it. Otherwise something ELSE
      // killed the stream — most often a platform function limit BELOW the route's setting,
      // which is invisible from here. Saying "you hit 300s" when it died at 60 sends
      // everyone to the wrong place, which is the whole failure this file exists to stop.
      const nearCeiling = ms > maxDurationSec * 900
      return {
        stage: 'timeout',
        error: `Ran out of time before finishing ${noun}.`,
        why: nearCeiling
          ? `It ran ${secs}s against this route's ${maxDurationSec}s ceiling and was killed mid-stream. A killed stream returns empty text, which looks exactly like a model failure and is not one.`
          : `It returned nothing after ${secs}s — well short of this route's ${maxDurationSec}s ceiling, so something else ended the stream. The usual cause is a PLATFORM function limit lower than the route's own setting: a Vercel Hobby project caps at 60s no matter what maxDuration says.`,
        fix: nearCeiling
          ? `Ask for less in one pass. A fact-lock repair counts as a second full generation inside the same ${maxDurationSec}s budget.`
          : `Check the deployment's actual function limit before changing anything here. If it is 60s, the fix is the plan or a shorter generation — not maxDuration, which is already ${maxDurationSec}.`,
        elapsedMs: ms, model, status: 504,
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

  // 3 — there IS text, it just is not the shape the route needs.
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
