/**
 * Integration health. Secrets never leave env — this reports presence and last contact.
 * A station that degrades loudly is diagnosable; one that fails silently is not.
 */

import { NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'

const PROVIDERS = [
  { provider: 'anthropic',  env: 'ANTHROPIC_API_KEY',         does: 'Every generator and every analysis pass' },
  { provider: 'instagram',  env: 'INSTAGRAM_ACCESS_TOKEN',    does: 'Live reel performance, caption fact-checking, pillar learning' },
  { provider: 'supabase',   env: 'SUPABASE_URL',              does: 'Reads the live chkplt.com product catalogue' },
  { provider: 'database',   env: 'DATABASE_URL',              does: 'Everything that survives logout' },
  { provider: 'mailerlite', env: 'MAILERLITE_API_KEY',        does: 'The weekly send and the CTA destination groups' },
  { provider: 'manychat',   env: 'MANYCHAT_API_KEY',          does: 'CTA keyword delivery — the orphan count depends on it' },
]

export async function GET() {
  const dbError = checkDatabase()
  const stored = !dbError && prisma
    ? await prisma.integration.findMany({ where: { userId: OWNER } })
    : []

  const rows = PROVIDERS.map((p) => {
    const present = Boolean(process.env[p.env])
    const s = stored.find((x) => x.provider === p.provider)
    return {
      ...p,
      configured: present,
      status: present ? (s?.status ?? 'ready') : 'missing_key',
      lastSyncedAt: s?.lastSyncedAt ?? null,
      detail: present ? (s?.detail ?? null) : `Set ${p.env} in .env.local`,
    }
  })

  return NextResponse.json({
    connected: rows.filter((r) => r.configured).length,
    total: rows.length,
    integrations: rows,
  })
}
