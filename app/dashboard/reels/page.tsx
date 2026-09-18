'use client'

/**
 * Reel Tracker — what the account actually did, per post, with the thumbnail so you can
 * see which one at a glance.
 *
 * The headline column is the OUTLIER MULTIPLE: this post's reach against the median of the
 * stored set. A raw view count says nothing on its own — 20,000 is a hit on one account and
 * a flop on another. The multiple is the only number here that is comparable to itself.
 */

import { useState, useEffect, useMemo } from 'react'
import {
  Instagram, RefreshCw, AlertTriangle, Loader2, ExternalLink,
  Heart, MessageCircle, Eye, TrendingUp, ImageOff,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

type Media = {
  mediaId: string; caption: string | null; permalink: string | null; postedAt: string | null
  thumbnailUrl?: string | null; mediaUrl?: string | null
  productType?: string | null
  likeCount: number; commentsCount: number; reach: number | null; views: number | null
  saved?: number | null; shares?: number | null
  pillar: string | null; tier: string | null; ctaKeyword: string | null; hookType: string | null
  factLock: any; engagementRate: number | null
}
type Payload = {
  count: number
  account: { followers: number; mediaCount: number; capturedAt: string } | null
  pillarPerformance: { pillar: string; posts: number; medianLikes: number; medianComments: number }[]
  flaggedCount: number
  flagged: { mediaId: string; permalink: string; postedAt: string; banned: string[] }[]
  media: Media[]
}

const PC: Record<string, string> = {
  'KEEP IT': '#D4A82F', 'PRICE IT': '#2563EB', 'OWN IT': '#16A34A',
  'BUILD IT ANYWAY': '#9333EA', 'PROVE IT': '#DC2626', UNMAPPED: '#A1A1AA',
}
const pc = (p?: string | null) => PC[(p ?? '').toUpperCase()] ?? '#A1A1AA'

const n = (v: number | null | undefined) => {
  if (v == null) return '—'
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(v)
}
const median = (xs: number[]) => {
  const s = xs.filter((x) => x > 0).sort((a, b) => a - b)
  if (!s.length) return 0
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

type Sort = 'recent' | 'reach' | 'engagement' | 'comments' | 'multiple'

export default function ReelsPage() {
  const [d, setD] = useState<Payload | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [pillar, setPillar] = useState('')

  const load = () => fetch('/api/instagram/sync').then((r) => r.json()).then(setD).catch(() => {})
  useEffect(() => { load() }, [])

  async function sync() {
    setSyncing(true); setMsg('')
    try {
      const r = await fetch('/api/instagram/sync', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 }),
      })
      const j = await r.json()
      setMsg(j.error ? (j.how ?? j.error) : `Synced ${j.synced} posts. ${j.postsWithBannedClaims} carry a banned claim.`)
      await load()
    } catch { setMsg('Sync failed.') } finally { setSyncing(false) }
  }

  const media = d?.media ?? []

  /** Median reach across everything stored — the baseline the multiple is measured against. */
  const medReach = useMemo(
    () => median(media.map((m) => m.reach ?? m.views ?? 0)),
    [media]
  )

  const rows = useMemo(() => {
    let xs = pillar ? media.filter((m) => (m.pillar ?? 'UNMAPPED') === pillar) : [...media]
    const mult = (m: Media) => (medReach ? (m.reach ?? m.views ?? 0) / medReach : 0)
    const by: Record<Sort, (a: Media, b: Media) => number> = {
      recent: (a, b) => +new Date(b.postedAt ?? 0) - +new Date(a.postedAt ?? 0),
      reach: (a, b) => (b.reach ?? b.views ?? 0) - (a.reach ?? a.views ?? 0),
      engagement: (a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0),
      comments: (a, b) => b.commentsCount - a.commentsCount,
      multiple: (a, b) => mult(b) - mult(a),
    }
    return xs.sort(by[sort])
  }, [media, sort, pillar, medReach])

  const pillars = useMemo(
    () => [...new Set(media.map((m) => m.pillar ?? 'UNMAPPED'))].sort(),
    [media]
  )

  return (
    <div className="min-h-full" style={{ background: '#F8F9FA' }}>
      <ToolPageHeader
        title="Reel Tracker"
        description="What the account actually did, not what the strategy says it should. Every caption is fact-checked on the way in."
        icon={Instagram}
        eyebrow="LIVE"
      />

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap"
           style={{ background: '#FFF', borderBottom: '1px solid #E4E4E7' }}>
        <button onClick={sync} disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold"
          style={{ background: '#18181B', color: '#FFF', opacity: syncing ? 0.6 : 1 }}>
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {syncing ? 'Syncing…' : 'Sync from Instagram'}
        </button>

        {d?.account && (
          <p className="text-sm" style={{ color: '#71717A' }}>
            <strong style={{ color: '#18181B' }}>{d.account.followers?.toLocaleString('en-ZA')}</strong> followers ·{' '}
            <strong style={{ color: '#18181B' }}>{d.count}</strong> posts stored
            {medReach > 0 && <> · median reach <strong style={{ color: '#18181B' }}>{n(medReach)}</strong></>}
          </p>
        )}

        <div className="ml-auto flex gap-2 flex-wrap">
          <select value={pillar} onChange={(e) => setPillar(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
            <option value="">All pillars</option>
            {pillars.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
            <option value="recent">Most recent</option>
            <option value="multiple">Biggest outlier</option>
            <option value="reach">Most reach</option>
            <option value="comments">Most comments</option>
            <option value="engagement">Best engagement</option>
          </select>
        </div>
      </div>

      {msg && (
        <div className="px-6 py-2.5 text-sm font-display" style={{ background: '#F4F4F5', color: '#3F3F46' }}>{msg}</div>
      )}

      <div className="p-6 flex flex-col gap-6">
        {/* Banned claims — already live, so this is a task list, not a warning */}
        {!!d?.flaggedCount && (
          <div className="rounded-xl overflow-hidden" style={{ background: '#FFF', border: '1px solid #FCA5A5', borderLeft: '3px solid #DC2626' }}>
            <div className="px-5 py-4">
              <p className="text-sm font-display font-bold flex items-center gap-2" style={{ color: '#18181B' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#DC2626' }} />
                {d.flaggedCount} published post{d.flaggedCount !== 1 ? 's' : ''} carry a banned claim
              </p>
              <p className="text-sm mt-1" style={{ color: '#71717A' }}>These are already live. Correcting them is a task, not a warning.</p>
            </div>
            <div className="px-5 pb-4 flex flex-col gap-1.5">
              {d.flagged.map((f) => (
                <a key={f.mediaId} href={f.permalink ?? '#'} target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                   style={{ background: '#FEF2F2' }}>
                  <span className="text-sm font-display flex-1" style={{ color: '#3F3F46' }}>{f.banned.join(' · ')}</span>
                  <span className="text-xs" style={{ color: '#A1A1AA' }}>{f.postedAt?.slice(0, 10)}</span>
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Pillar performance — computed from stored rows, never generated */}
        {!!d?.pillarPerformance?.length && (
          <div className="rounded-xl p-5" style={{ background: '#FFF', border: '1px solid #E4E4E7' }}>
            <p className="text-sm font-display font-bold" style={{ color: '#18181B' }}>What the account teaches</p>
            <p className="text-xs mb-3" style={{ color: '#71717A' }}>Computed from stored rows. Ranked by comments — the metric the Loss Law moves.</p>
            <div className="flex gap-2 flex-wrap">
              {d.pillarPerformance.map((p) => (
                <div key={p.pillar} className="px-3 py-2 rounded-lg"
                     style={{ background: `${pc(p.pillar)}0F`, border: `1px solid ${pc(p.pillar)}33` }}>
                  <p className="text-xs font-display font-bold" style={{ color: pc(p.pillar) }}>{p.pillar}</p>
                  <p className="text-[11px]" style={{ color: '#3F3F46' }}>
                    {p.posts} posts · {p.medianComments} comments · {p.medianLikes} likes
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The posts */}
        <div className="flex flex-col gap-2">
          {rows.length === 0 && (
            <p className="p-8 text-center text-sm rounded-xl"
               style={{ background: '#FFF', border: '1px solid #E4E4E7', color: '#71717A' }}>
              {d ? 'No posts stored yet. Sync to populate.' : 'Loading…'}
            </p>
          )}

          {rows.map((m) => {
            const reach = m.reach ?? m.views ?? 0
            const multiple = medReach ? reach / medReach : 0
            const img = m.thumbnailUrl || m.mediaUrl
            const dirty = m.factLock && !m.factLock.clean
            return (
              <div key={m.mediaId} className="flex gap-4 p-3 rounded-xl"
                   style={{ background: '#FFF', border: `1px solid ${dirty ? '#FCA5A5' : '#E4E4E7'}` }}>
                {/* thumbnail */}
                <a href={m.permalink ?? '#'} target="_blank" rel="noreferrer"
                   className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                   style={{ width: 84, height: 112, background: '#F4F4F5' }}>
                  {img
                    ? <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    : <ImageOff className="w-5 h-5" style={{ color: '#D4D4D8' }} />}
                </a>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {m.pillar && (
                      <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded"
                            style={{ background: `${pc(m.pillar)}18`, color: pc(m.pillar) }}>{m.pillar}</span>
                    )}
                    {m.tier && (
                      <span className="text-[10px] font-display px-1.5 py-0.5 rounded"
                            style={{ background: '#F4F4F5', color: '#71717A' }}>{m.tier}</span>
                    )}
                    {m.ctaKeyword && (
                      <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}>{m.ctaKeyword}</span>
                    )}
                    {dirty && (
                      <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded"
                            style={{ background: '#FEE2E2', color: '#DC2626' }}>BANNED CLAIM</span>
                    )}
                    <span className="text-[10px] ml-auto" style={{ color: '#A1A1AA' }}>
                      {m.postedAt?.slice(0, 10)}
                    </span>
                  </div>

                  <p className="text-[13px] font-display leading-snug mb-2" style={{ color: '#18181B' }}>
                    {(m.caption ?? '').split('\n')[0].slice(0, 130) || <em style={{ color: '#A1A1AA' }}>No caption</em>}
                  </p>

                  {/* the numbers */}
                  <div className="flex gap-1.5 flex-wrap mt-auto">
                    {multiple > 0 && (
                      <Stat icon={TrendingUp}
                        value={`${multiple.toFixed(1)}x`}
                        tone={multiple >= 2 ? '#16A34A' : multiple < 0.6 ? '#DC2626' : '#71717A'}
                        title="Reach against the median of everything stored" />
                    )}
                    <Stat icon={Eye} value={n(reach)} title="Reach (falls back to views)" />
                    <Stat icon={Heart} value={n(m.likeCount)} title="Likes" />
                    <Stat icon={MessageCircle} value={n(m.commentsCount)} title="Comments" />
                    {m.engagementRate != null && (
                      <Stat value={`${m.engagementRate.toFixed(2)}%`} title="(likes + comments) / reach" />
                    )}
                    {m.permalink && (
                      <a href={m.permalink} target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-display"
                         style={{ background: '#F4F4F5', color: '#2563EB' }}>
                        Open <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, value, tone, title }:
  { icon?: any; value: string; tone?: string; title?: string }) {
  return (
    <span title={title}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-display font-semibold"
      style={{ background: '#F8F9FA', border: '1px solid #EFEFF1', color: tone ?? '#3F3F46' }}>
      {Icon && <Icon className="w-3 h-3" />}
      {value}
    </span>
  )
}
