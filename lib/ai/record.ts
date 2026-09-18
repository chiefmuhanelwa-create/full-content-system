/**
 * Record every generated output, the moment it is produced.
 *
 * This exists because the `hooks` and `scripts` tables sat empty for months: saving was a
 * manual step and nobody took it, so there was no record of what the system had made.
 * Recording server-side at generation time asks nothing of the user and cannot be forgotten.
 *
 * It is deliberately FIRE-AND-FORGET. A failure to write the record must never fail the
 * generation the user is waiting for — the output is the product, the record is bookkeeping.
 */

import { db } from '@/lib/db'
import { DEFAULT_USER_ID } from '@/lib/ensure-user'

export type RecordInput = {
  tool: string
  kind?: 'generate' | 'analyse'
  model?: string
  pillar?: string
  tier?: string
  input: string
  output: string
  factLock?: unknown
  blocked?: boolean
  repaired?: boolean
  ms?: number
  governance?: string
  ideaId?: string
}

/** Long prompts are trimmed: this is a record of what happened, not a replay buffer. */
const CAP_IN = 4000
const CAP_OUT = 20000

export function recordGeneration(r: RecordInput): void {
  if (!db) return
  // Not awaited on purpose. See the header.
  void db.generation
    .create({
      data: {
        userId: DEFAULT_USER_ID,
        tool: r.tool,
        kind: r.kind ?? 'generate',
        model: r.model ?? '',
        pillar: r.pillar ?? null,
        tier: r.tier ?? null,
        input: String(r.input ?? '').slice(0, CAP_IN),
        output: String(r.output ?? '').slice(0, CAP_OUT),
        factLock: (r.factLock ?? null) as any,
        blocked: !!r.blocked,
        repaired: !!r.repaired,
        ms: r.ms ?? 0,
        governance: r.governance ?? '',
        ideaId: r.ideaId ?? null,
      },
    })
    .catch(() => {
      // Swallowed deliberately: bookkeeping must not surface as a generation failure.
    })
}
