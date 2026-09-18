/**
 * POST /api/instagram/sync   — pull live media + insights, classify, fact-check, store
 * GET  /api/instagram/sync   — what is stored right now, plus what was learned
 *
 * Two input paths on purpose:
 *   - INSTAGRAM_ACCESS_TOKEN set  -> live pull from graph.instagram.com
 *   - body { media: [...] }       -> import a payload by hand (no token needed)
 * The second exists because doctrine says: query the live system before asserting a
 * commercial fact. A tool that only works when a token is healthy gets bypassed.
 *
 * Every caption is run through the fact-lock engine on the way in. Banned figures that are
 * ALREADY PUBLISHED are found here — the estate recorded several as "currently live" and
 * nothing in the codebase could see them.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { check } from '@/lib/fact-lock'
import { analyse } from '@/lib/ai/governed'
import { getGovernance, OWNER, normalisePillars } from '@/lib/governance'

/** Hobby plan ceiling. A function killed mid-stream returns empty text, which reads
 * exactly like a model failure — that is what made this hard to see. */
export const maxDuration = 60

const GV = process.env.INSTAGRAM_GRAPH_VERSION || 'v26.0'
const BASE = 'https://graph.instagram.com'

const MEDIA_FIELDS =
  'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,thumbnail_url,media_url'

type RawMedia = {
  id: string; caption?: string; media_type?: string; media_product_type?: string
  permalink?: string; timestamp?: string; like_count?: number; comments_count?: number
  thumbnail_url?: string; media_url?: string
}

async function fetchJson(url: string) {
  const r = await fetch(url, { cache: 'no-store' })
  const j = await r.json()
  if (!r.ok || j.error) throw new Error(j?.error?.message || `Instagram API ${r.status}`)
  return j
}

/** Insights are per-media and the valid metric set differs by type, so failures are non-fatal. */
async function mediaInsights(id: string, token: string, isReel: boolean) {
  const metrics = isReel ? 'reach,saved,shares,likes,comments,views' : 'reach,saved,shares,likes,comments'
  try {
    const j = await fetchJson(`${BASE}/${GV}/${id}/insights?metric=${metrics}&access_token=${token}`)
    const out: Record<string, number> = {}
    for (const d of j.data || []) out[d.name] = d.values?.[0]?.value ?? d.total_value?.value ?? 0
    return out
  } catch { return {} }
}

/** Classify against the RULED pillar set, read live from governance — never a hardcoded list. */
async function classify(items: { id: string; caption: string }[], pillars: string[]) {
  if (!items.length) return {}
  const sample = items.map((m) => `[${m.id}]\n${(m.caption || '').slice(0, 700)}`).join('\n\n---\n\n')
  const { data } = await analyse<Record<string, any>>({
    prompt: `Classify each Instagram caption below. For each, return the pillar it belongs to (one of: ${pillars.join(', ')}), the tier it serves (FREE, ENTRY, CORE or PREMIUM), the CTA keyword it asks for in capitals if any, and the hook type in three words.\n\n${sample}`,
    schemaHint: '{"<media_id>": {"pillar": "...", "tier": "...", "ctaKeyword": "..."|null, "hookType": "..."}}',
    system: 'You are classifying content that already shipped. Report what it IS, not what it should be. If a caption fits no ruled pillar, return pillar "UNMAPPED" rather than forcing one.',
    tier_of: 'fast',
    maxTokens: 2000,
  })
  return data || {}
}

export async function POST(request: NextRequest) {
  try {
    return await runSync(request)
  } catch (e: any) {
    return NextResponse.json({
      error: e?.message || 'Instagram sync failed.',
      hint: 'If this mentions an access token, it has expired. Refresh it at graph.instagram.com/refresh_access_token and update INSTAGRAM_ACCESS_TOKEN.',
    }, { status: 502 })
  }
}

async function runSync(request: NextRequest) {
  const dbError = checkDatabase()
  if (dbError) return dbError

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  let body: any = {}
  try { body = await request.json() } catch {}

  let media: RawMedia[] = []
  let source = ''
  let profile: any = null

  if (Array.isArray(body?.media) && body.media.length) {
    media = body.media
    source = 'imported payload'
  } else if (token) {
    const limit = Number(body?.limit ?? 50)
    // `me` is not valid for every token type; the explicit user id always is.
    const who = process.env.INSTAGRAM_USER_ID || 'me'
    const j = await fetchJson(`${BASE}/${GV}/${who}/media?fields=${MEDIA_FIELDS}&limit=${limit}&access_token=${token}`)
    media = j.data || []
    source = 'graph.instagram.com'
    try {
      profile = await fetchJson(`${BASE}/${GV}/${who}?fields=username,followers_count,follows_count,media_count&access_token=${token}`)
    } catch {}
  } else {
    return NextResponse.json({
      error: 'No INSTAGRAM_ACCESS_TOKEN set, and no media payload supplied.',
      how: 'Either paste a long-lived token into .env.local as INSTAGRAM_ACCESS_TOKEN, or POST { "media": [ ...Graph API media objects... ] } to import by hand.',
    }, { status: 400 })
  }

  if (!media.length) return NextResponse.json({ error: 'No media returned. Nothing changed.' }, { status: 404 })

  const gov = await getGovernance()
  // The seeded shape is { ruled, pillars: [...] }, not a bare array — normalise it.
  const pillarNames = normalisePillars(gov.pillars).map((p) => p.name)

  const cls = await classify(
    media.map((m) => ({ id: m.id, caption: m.caption || '' })),
    pillarNames
  )

  let withBanned = 0
  const violations: any[] = []

  for (const m of media) {
    const caption = m.caption || ''
    const fl = check(caption)
    if (!fl.clean) {
      withBanned++
      violations.push({
        mediaId: m.id, permalink: m.permalink,
        posted: m.timestamp?.slice(0, 10),
        banned: fl.banned.map((b) => ({ name: b.name, found: b.found })),
      })
    }

    const c = (cls as any)[m.id] || {}
    const isReel = (m.media_product_type || '') === 'REELS'
    const ins = token && source !== 'imported payload' ? await mediaInsights(m.id, token, isReel) : {}

    const likes = m.like_count ?? ins.likes ?? 0
    const comments = m.comments_count ?? ins.comments ?? 0
    const reach = ins.reach ?? null
    const er = reach && reach > 0 ? ((likes + comments) / reach) * 100 : null

    const data = {
      userId: OWNER,
      caption,
      mediaType: m.media_type ?? null,
      productType: m.media_product_type ?? null,
      permalink: m.permalink ?? null,
      thumbnailUrl: m.thumbnail_url ?? null,
      mediaUrl: m.media_url ?? null,
      postedAt: m.timestamp ? new Date(m.timestamp) : null,
      likeCount: likes,
      commentsCount: comments,
      reach,
      saved: ins.saved ?? null,
      shares: ins.shares ?? null,
      views: ins.views ?? null,
      pillar: c.pillar ?? null,
      tier: c.tier ?? null,
      ctaKeyword: c.ctaKeyword ?? null,
      hookType: c.hookType ?? null,
      factLock: { clean: fl.clean, banned: fl.banned, careful: fl.careful } as any,
      engagementRate: er,
      syncedAt: new Date(),
    }

    await prisma!.instagramMedia.upsert({
      where: { mediaId: m.id },
      create: { mediaId: m.id, ...data },
      update: data,
    })
  }

  if (profile) {
    await prisma!.instagramSnapshot.create({
      data: {
        userId: OWNER,
        followers: profile.followers_count ?? null,
        follows: profile.follows_count ?? null,
        mediaCount: profile.media_count ?? null,
        raw: profile as any,
      },
    })
  }

  await prisma!.ingestLog.create({
    data: {
      userId: OWNER, source: 'instagram', target: 'instagram_media',
      rows: media.length,
      summary: `Synced ${media.length} posts from ${source}. ${withBanned} carry a banned claim.`,
      after: { violations } as any,
    },
  })

  await prisma!.integration.upsert({
    where: { userId_provider: { userId: OWNER, provider: 'instagram' } },
    create: { userId: OWNER, provider: 'instagram', status: 'ok', lastSyncedAt: new Date(), lastCheckedAt: new Date(), detail: source },
    update: { status: 'ok', lastSyncedAt: new Date(), lastCheckedAt: new Date(), detail: source },
  })

  return NextResponse.json({
    success: true, source, synced: media.length,
    postsWithBannedClaims: withBanned,
    violations,
    note: withBanned
      ? `${withBanned} PUBLISHED posts contain a banned claim. These are already live — correcting them is a real task, not a warning.`
      : 'No banned claims found in the synced captions.',
  })
}

export async function GET() {
  const dbError = checkDatabase()
  if (dbError) return dbError

  const rows = await prisma!.instagramMedia.findMany({
    where: { userId: OWNER }, orderBy: { postedAt: 'desc' }, take: 200,
  })
  const snap = await prisma!.instagramSnapshot.findFirst({
    where: { userId: OWNER }, orderBy: { capturedAt: 'desc' },
  })

  // What the account actually teaches, computed from rows — never generated.
  const byPillar: Record<string, { posts: number; likes: number; comments: number }> = {}
  for (const r of rows) {
    const k = r.pillar || 'UNMAPPED'
    byPillar[k] ??= { posts: 0, likes: 0, comments: 0 }
    byPillar[k].posts++
    byPillar[k].likes += r.likeCount
    byPillar[k].comments += r.commentsCount
  }
  const pillarPerformance = Object.entries(byPillar)
    .map(([pillar, v]) => ({
      pillar, posts: v.posts,
      medianLikes: Math.round(v.likes / v.posts),
      medianComments: Math.round(v.comments / v.posts),
    }))
    .sort((a, b) => b.medianComments - a.medianComments)

  const flagged = rows.filter((r) => r.factLock && !(r.factLock as any).clean)

  return NextResponse.json({
    count: rows.length,
    account: snap ? { followers: snap.followers, mediaCount: snap.mediaCount, capturedAt: snap.capturedAt } : null,
    pillarPerformance,
    flaggedCount: flagged.length,
    flagged: flagged.slice(0, 25).map((r) => ({
      mediaId: r.mediaId, permalink: r.permalink, postedAt: r.postedAt,
      banned: ((r.factLock as any)?.banned || []).map((b: any) => b.name),
    })),
    media: rows.slice(0, 60),
  })
}
