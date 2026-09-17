/**
 * Robust JSON extraction from a model response.
 *
 * A naive /\{[\s\S]*\}/ + JSON.parse fails intermittently, which is worse than failing
 * always — the tool looks broken at random. Three real causes, all seen in production:
 *   1. preamble or a ```json fence around the object
 *   2. a literal newline inside a string value (common in captions), which is invalid JSON
 *   3. the response truncated at max_tokens, leaving the object unclosed
 *
 * This handles all three, and reports WHICH repair was needed so a recurring one can be
 * fixed at the prompt rather than patched here forever.
 */

export type Extracted<T> = {
  data: T | null
  repair: 'none' | 'fenced' | 'escaped-newlines' | 'closed-truncated' | 'failed'
  truncated: boolean
}

/** Find the first balanced {...}, respecting strings and escapes. Returns null if unclosed. */
function balanced(src: string): { body: string; closed: boolean } | null {
  const start = src.indexOf('{')
  if (start === -1) return null
  let depth = 0, inStr = false, esc = false
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{') depth++
    else if (c === '}') { depth--; if (depth === 0) return { body: src.slice(start, i + 1), closed: true } }
  }
  return { body: src.slice(start), closed: false }
}

/** Escape raw control characters that appear INSIDE string literals. */
function escapeInsideStrings(src: string): string {
  let out = '', inStr = false, esc = false
  for (const c of src) {
    if (esc) { out += c; esc = false; continue }
    if (c === '\\') { out += c; esc = true; continue }
    if (c === '"') { inStr = !inStr; out += c; continue }
    if (inStr) {
      if (c === '\n') { out += '\\n'; continue }
      if (c === '\r') { out += '\\r'; continue }
      if (c === '\t') { out += '\\t'; continue }
    }
    out += c
  }
  return out
}

/** Close an object cut off mid-flight: shut any open string, drop a trailing comma, balance. */
function closeTruncated(src: string): string {
  let inStr = false, esc = false, depth = 0
  for (const c of src) {
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') depth--
  }
  let out = src
  if (inStr) out += '"'
  out = out.replace(/,\s*$/, '')
  // Re-walk to emit closers in the right order.
  const stack: string[] = []
  inStr = false; esc = false
  for (const c of out) {
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{') stack.push('}')
    else if (c === '[') stack.push(']')
    else if (c === '}' || c === ']') stack.pop()
  }
  return out + stack.reverse().join('')
}

export function extractJson<T = any>(raw: string): Extracted<T> {
  if (!raw?.trim()) return { data: null, repair: 'failed', truncated: false }

  // Strip a fence if one is present; the balanced scan handles plain preamble on its own.
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const src = fenced ? fenced[1] : raw
  const found = balanced(src)
  if (!found) return { data: null, repair: 'failed', truncated: false }

  const attempts: [string, Extracted<T>['repair']][] = [
    [found.body, fenced ? 'fenced' : 'none'],
    [escapeInsideStrings(found.body), 'escaped-newlines'],
  ]
  if (!found.closed) {
    attempts.push([closeTruncated(escapeInsideStrings(found.body)), 'closed-truncated'])
  }

  for (const [candidate, repair] of attempts) {
    try {
      return { data: JSON.parse(candidate) as T, repair, truncated: !found.closed }
    } catch { /* try the next repair */ }
  }
  return { data: null, repair: 'failed', truncated: !found.closed }
}

/**
 * Drop-in replacement for `text.match(/\{[\s\S]*\}/)`.
 *
 * Returns a one-element array whose [0] is REPAIRED JSON text, so existing call sites of the
 * shape `JSON.parse(m[0])` keep working while gaining fence-stripping, newline escaping and
 * truncation recovery. Returns null when nothing usable is present, matching .match().
 */
export function jsonMatch(raw: string): [string] | null {
  const { data } = extractJson<any>(raw)
  return data === null ? null : [JSON.stringify(data)]
}
