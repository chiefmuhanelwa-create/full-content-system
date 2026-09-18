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
  Heart, MessageCircle, Eye, TrendingUp, ImageOff, Link2, Check,
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
  'KEEP IT': '#D4A82F', 'PRICE IT': '#8B5CF6', 'OWN IT': '#16A34A',
  'BUILD IT ANYWAY': '#9333EA', 'PROVE IT': '#DC2626', UNMAPPED: '#9B94AD',
}
const pc = (p?: string | null) => PC[(p ?? '').toUpperCase()] ?? '#9B94AD'

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
  // Linking a post back to the idea that produced it is what turns the bank into a
  // scoreboard. Metrics stay here; the idea just holds the mediaId.
  const [ideas, setIdeas] = useState<{ id: string; title: string; mediaId?: string | null }[]>([])
  const [linking, setLinking] = useState<string | null>(null)
  const [pick, setPick] = useState('')

  const load = () => fetch('/api/instagram/sync').then((r) => r.json()).then(setD).catch(() => {})
  useEffect(() => { load() }, [])
  useEffect(() => {
    fetch('/api/ideas').then(r => r.json()).then(j => setIdeas(j.ideas ?? [])).catch(() => {})
  }, [])

  async function linkToIdea(ideaId: string, mediaId: string) {
    await fetch('/api/ideas', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ideaId, mediaId, status: 'posted' }),
    })
    setIdeas(prev => prev.map(i => (i.id === ideaId ? { ...i, mediaId } : i)))
    setLinking(null); setPick('')
  }

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
    <div className="min-h-full" style={{ background: '#FAFAFA' }}>
      <ToolPageHeader
        title="Reel Tracker"
        description="What the account actually did, not what the strategy says it should. Every caption is fact-checked on the way in."
        icon={Instagram}
        eyebrow="LIVE"
      />

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap"
           style={{ background: '#FFF', borderBottom: '1px solid #E9E5F5' }}>
        <button onClick={sync} disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold"
          style={{ background: '#1A1523', color: '#FFF', opacity: syncing ? 0.6 : 1 }}>
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {syncing ? 'Syncing…' : 'Sync from Instagram'}
        </button>

        {d?.account && (
          <p className="text-sm" style={{ color: '#6B6480' }}>
            <strong style={{ color: '#1A1523' }}>{d.account.followers?.toLocaleString('en-ZA')}</strong> followers ·{' '}
            <strong style={{ color: '#1A1523' }}>{d.count}</strong> posts stored
            {medReach > 0 && <> · median reach <strong style={{ color: '#1A1523' }}>{n(medReach)}</strong></>}
          </p>
        )}

        <div className="ml-auto flex gap-2 flex-wrap">
          <select value={pillar} onChange={(e) => setPillar(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#FAFAFA', border: '1px solid #E9E5F5', color: '#1A1523' }}>
            <option value="">All pillars</option>
            {pillars.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#FAFAFA', border: '1px solid #E9E5F5', color: '#1A1523' }}>
            <option value="recent">Most recent</option>
            <option value="multiple">Biggest outlier</option>
            <option value="reach">Most reach</option>
            <option value="comments">Most comments</option>
            <option value="engagement">Best engagement</option>
          </select>
        </div>
      </div>

      {msg && (
        <div className="px-6 py-2.5 text-sm font-display" style={{ background: '#F5F3FF', color: '#3F3A4D' }}>{msg}</div>
      )}

      <div className="p-6 flex flex-col gap-6">
        {/* Banned claims — already live, so this is a task list, not a warning */}
        {!!d?.flaggedCount && (
          <div className="rounded-xl overflow-hidden" style={{ background: '#FFF', border: '1px solid #FCA5A5', borderLeft: '3px solid #DC2626' }}>
            <div className="px-5 py-4">
              <p className="text-sm font-display font-bold flex items-center gap-2" style={{ color: '#1A1523' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#DC2626' }} />
                {d.flaggedCount} published post{d.flaggedCount !== 1 ? 's' : ''} carry a banned claim
              </p>
              <p className="text-sm mt-1" style={{ color: '#6B6480' }}>These are already live. Correcting them is a task, not a warning.</p>
            </div>
            <div className="px-5 pb-4 flex flex-col gap-1.5">
              {d.flagged.map((f) => (
                <a key={f.mediaId} href={f.permalink ?? '#'} target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                   style={{ background: '#FEF2F2' }}>
                  <span className="text-sm font-display flex-1" style={{ color: '#3F3A4D' }}>{f.banned.join(' · ')}</span>
                  <span className="text-xs" style={{ color: '#9B94AD' }}>{f.postedAt?.slice(0, 10)}</span>
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: '#8B5CF6' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Pillar performance — computed from stored rows, never generated */}
        {!!d?.pillarPerformance?.length && (
          <div className="rounded-xl p-5" style={{ background: '#FFF', border: '1px solid #E9E5F5' }}>
            <p className="text-sm font-display font-bold" style={{ color: '#1A1523' }}>What the account teaches</p>
            <p className="text-xs mb-3" style={{ color: '#6B6480' }}>Computed from stored rows. Ranked by comments — the metric the Loss Law moves.</p>
            <div className="flex gap-2 flex-wrap">
              {d.pillarPerformance.map((p) => (
                <div key={p.pillar} className="px-3 py-2 rounded-lg"
                     style={{ background: `${pc(p.pillar)}0F`, border: `1px solid ${pc(p.pillar)}33` }}>
                  <p className="text-xs font-display font-bold" style={{ color: pc(p.pillar) }}>{p.pillar}</p>
                  <p className="text-[11px]" style={{ color: '#3F3A4D' }}>
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
               style={{ background: '#FFF', border: '1px solid #E9E5F5', color: '#6B6480' }}>
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
                   style={{ background: '#FFF', border: `1px solid ${dirty ? '#FCA5A5' : '#E9E5F5'}` }}>
                {/* thumbnail */}
                <a href={m.permalink ?? '#'} target="_blank" rel="noreferrer"
                   className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                   style={{ width: 84, height: 112, background: '#F5F3FF' }}>
                  {img
                    ? <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    : <ImageOff className="w-5 h-5" style={{ color: '#D6CFEA' }} />}
                </a>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {m.pillar && (
                      <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded"
                            style={{ background: `${pc(m.pillar)}18`, color: pc(m.pillar) }}>{m.pillar}</span>
                    )}
                    {m.tier && (
                      <span className="text-[10px] font-display px-1.5 py-0.5 rounded"
                            style={{ background: '#F5F3FF', color: '#6B6480' }}>{m.tier}</span>
                    )}
                    {m.ctaKeyword && (
                      <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(139,92,246,0.10)', color: '#8B5CF6' }}>{m.ctaKeyword}</span>
                    )}
                    {dirty && (
                      <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded"
                            style={{ background: '#FEE2E2', color: '#DC2626' }}>BANNED CLAIM</span>
                    )}
                    <span className="text-[10px] ml-auto" style={{ color: '#9B94AD' }}>
                      {m.postedAt?.slice(0, 10)}
                    </span>
                  </div>

                  <p className="text-[13px] font-display leading-snug mb-2" style={{ color: '#1A1523' }}>
                    {(m.caption ?? '').split('\n')[0].slice(0, 130) || <em style={{ color: '#9B94AD' }}>No caption</em>}
                  </p>

                  {/* the numbers */}
                  <div className="flex gap-1.5 flex-wrap mt-auto">
                    {multiple > 0 && (
                      <Stat icon={TrendingUp}
                        value={`${multiple.toFixed(1)}x`}
                        tone={multiple >= 2 ? '#16A34A' : multiple < 0.6 ? '#DC2626' : '#6B6480'}
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
                         style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                        Open <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {(() => {
                      const linked = ideas.find(i => i.mediaId === m.mediaId)
                      if (linked) return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-display font-semibold"
                              style={{ background: 'rgba(22,163,74,0.10)', color: '#16A34A' }}
                              title={linked.title}>
                          <Check className="w-3 h-3" />{linked.title.slice(0, 28)}
                        </span>
                      )
                      return linking === m.mediaId ? (
                        <select autoFocus value={pick}
                          onChange={e => { if (e.target.value) linkToIdea(e.target.value, m.mediaId) }}
                          onBlur={() => setLinking(null)}
                          className="px-2 py-1 rounded-md text-[11px] font-display outline-none"
                          style={{ background: '#FFF', border: '1px solid #8B5CF6', maxWidth: 260 }}>
                          <option value="">Pick the idea this came from…</option>
                          {ideas.filter(i => !i.mediaId).map(i => (
                            <option key={i.id} value={i.id}>{i.title}</option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => setLinking(m.mediaId)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-display"
                          style={{ background: '#F5F3FF', color: '#6B6480' }}>
                          <Link2 className="w-3 h-3" />Link to idea
                        </button>
                      )
                    })()}
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
      style={{ background: '#FAFAFA', border: '1px solid #EFEBF8', color: tone ?? '#3F3A4D' }}>
      {Icon && <Icon className="w-3 h-3" />}
      {value}
    </span>
  )
}
