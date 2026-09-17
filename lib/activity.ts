/**
 * Activity log — one helper so every tool records the same way.
 *
 * The point is not analytics. It is that The Return and the Scorecard can answer "what did
 * you actually do this week" from the record rather than from memory, and that a bad output
 * is traceable to the run that produced it.
 *
 * Never throws: a logging failure must not take down the tool it describes.
 */

import { prisma } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

export type Entity =
  | 'hook' | 'script' | 'carousel' | 'caption' | 'email' | 'story'
  | 'shoot' | 'deal' | 'invoice' | 'ratecard' | 'instagram' | 'governance' | 'factlock'

export async function logActivity(
  entityType: Entity,
  action: string,
  description: string,
  metadata?: Record<string, any>,
  entityId?: string,
) {
  if (!prisma) return
  try {
    await prisma.activityLog.create({
      data: {
        userId: OWNER,
        action,
        entityType,
        entityId: entityId ?? null,
        description,
        metadata: (metadata ?? {}) as any,
      },
    })
  } catch { /* logging never breaks the caller */ }
}

/** Recent activity, newest first — what The Return and the dashboard read. */
export async function recentActivity(take = 50) {
  if (!prisma) return []
  try {
    return await prisma.activityLog.findMany({
      where: { userId: OWNER },
      orderBy: { createdAt: 'desc' },
      take,
    })
  } catch { return [] }
}
