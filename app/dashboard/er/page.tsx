'use client'

/**
 * Engagement Rate — yours, or anyone's.
 *
 * The number it prints is computed on FOLLOWERS, because reach is only available for the
 * account that owns the token. That is stated on the page, every time, deliberately: the
 * estate already carries a reach-based median, and two numbers with one name is how a
 * contested figure gets made.
 */

import { useState } from 'react'
import { Activity, Search, Loader2, AlertCircle, Heart, MessageCircle, Users } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

type Result = {
  username: string; profilePicture: string | null
  followers: number; mediaCount: number | null
  postsAnalysed: number; reelsInSample: number
  denominator: string; denominatorNote: string
  engagementRate: number; engagementRateMedian: number
  avgInteractions: number; avgLikes: number; avgComments: number
  commentSharePct: number
  band: { label: string; note: string }
  window: { newest: string | null; oldest: string | null }
}

const MINE = 'nochill_god'

export default function ErPage() {
  const [u, setU] = useState('')
  const [d, setD] = useState<Result | null>(null)
  const [err, setErr] = useState<{ error: string; how?: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function run(name: string) {
    const q = name.trim().replace(/^@/, '')
    if (!q) return
    setBusy(true); setErr(null); setD(null)
    try {
      const r = await fetch(`/api/er?username=${encodeURIComponent(q)}`)
      const j = await r.json()
      if (!r.ok) setErr(j); else setD(j)
    } catch { setErr({ error: 'Lookup failed.' }) } finally { setBusy(false) }
  }

  // Colour follows the size-aware band from the API, not a flat threshold — a big account
  // with a low follower-ER is normal, and painting it red would be lying with a colour.
  const TONE: Record<string, string> = {
    Exceptional: '#16A34A', Strong: '#16A34A', Healthy: '#D4A82F', 'Below par': '#F97316',
  }
  const tone = (b: string) => TONE[b] ?? '#6B6480'

  return (
    <div className="min-h-full" style={{ background: '#FAFAFA' }}>
      <ToolPageHeader
        icon={Activity}
        eyebrow="PUBLIC DATA"
        title="Engagement Rate"
        description="Any public Business or Creator account. Type a username — no login, no screenshots, no guessing."
      />

      <div className="p-6 flex flex-col gap-5 max-w-3xl">
        {/* input */}
        <div className="rounded-xl p-4" style={{ background: '#FFF', border: '1px solid #E9E5F5' }}>
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9B94AD' }}>@</span>
              <input value={u} onChange={(e) => setU(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && run(u)}
                placeholder="username"
                className="w-full pl-7 pr-3 py-2.5 rounded-lg text-sm font-display outline-none"
                style={{ background: '#FAFAFA', border: '1px solid #E9E5F5', color: '#1A1523' }} />
            </div>
            <button onClick={() => run(u)} disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-display font-semibold"
              style={{ background: '#1A1523', color: '#FFF', opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Check
            </button>
            <button onClick={() => { setU(MINE); run(MINE) }} disabled={busy}
              className="px-4 py-2.5 rounded-lg text-sm font-display font-semibold"
              style={{ background: '#F5F3FF', color: '#1A1523', border: '1px solid #E9E5F5' }}>
              Mine
            </button>
          </div>
        </div>

        {err && (
          <div className="rounded-xl p-4 flex gap-3" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#DC2626' }} />
            <div>
              <p className="text-sm font-display font-semibold" style={{ color: '#1A1523' }}>{err.error}</p>
              {err.how && <p className="text-sm mt-1" style={{ color: '#6B6480' }}>{err.how}</p>}
            </div>
          </div>
        )}

        {d && (
          <>
            <div className="rounded-xl p-6" style={{ background: '#FFF', border: '1px solid #E9E5F5' }}>
              <div className="flex items-center gap-3 mb-5">
                {d.profilePicture && (
                  <img src={d.profilePicture} alt="" className="w-11 h-11 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-base font-display font-bold" style={{ color: '#1A1523' }}>@{d.username}</p>
                  <p className="text-xs" style={{ color: '#6B6480' }}>
                    {d.followers.toLocaleString('en-ZA')} followers · {d.mediaCount?.toLocaleString('en-ZA')} posts
                  </p>
                </div>
              </div>

              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest" style={{ color: '#6B6480' }}>
                    Engagement rate
                  </p>
                  <p className="font-display font-black leading-none" style={{ fontSize: 52, color: tone(d.band.label) }}>
                    {d.engagementRate.toFixed(2)}%
                  </p>
                </div>
                <div className="pb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-display font-bold"
                        style={{ background: `${tone(d.band.label)}18`, color: tone(d.band.label) }}>
                    {d.band.label}
                  </span>
                  <p className="text-xs mt-1.5" style={{ color: '#6B6480' }}>{d.band.note}</p>
                </div>
              </div>

              {/* The denominator, said out loud. Not a footnote. */}
              <div className="mt-4 rounded-lg px-3 py-2.5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <p className="text-xs" style={{ color: '#78350F' }}>
                  <strong>Measured on followers</strong>, not reach. Reach is only visible to the account that owns it —
                  so a reach-based engagement rate is a different number and is always much higher.
                  Never compare the two.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <Cell icon={Users} label="Avg interactions" value={d.avgInteractions.toLocaleString('en-ZA')} />
                <Cell icon={Heart} label="Avg likes" value={d.avgLikes.toLocaleString('en-ZA')} />
                <Cell icon={MessageCircle} label="Avg comments" value={d.avgComments.toLocaleString('en-ZA')} />
                <Cell label="Median ER" value={`${d.engagementRateMedian.toFixed(2)}%`} />
              </div>

              <p className="text-xs mt-4" style={{ color: '#9B94AD' }}>
                Across the last <strong>{d.postsAnalysed}</strong> public posts
                {d.reelsInSample > 0 && <> ({d.reelsInSample} reels)</>}
                {d.window.oldest && <> · {d.window.oldest.slice(0, 10)} to {d.window.newest?.slice(0, 10)}</>}.
                Median is the honest one — a single viral post drags the average and nothing else.
              </p>
            </div>

            {/* Comments share — the metric the Loss Law moves */}
            <div className="rounded-xl p-5" style={{ background: '#FFF', border: '1px solid #E9E5F5' }}>
              <p className="text-sm font-display font-bold" style={{ color: '#1A1523' }}>
                {d.commentSharePct.toFixed(1)}% of engagement is comments
              </p>
              <p className="text-sm mt-1" style={{ color: '#6B6480' }}>
                Likes are cheap and comments are not. On this account a caption opening on a real
                loss with a real figure measured <strong>25.5 median comments against 3.0</strong> —
                an 8.5× difference, with reach held constant. If this share is low, the opening line
                is the thing to change.
              </p>
            </div>
          </>
        )}

        {!d && !err && (
          <p className="text-sm" style={{ color: '#6B6480' }}>
            Works on any public Business or Creator account. Personal accounts cannot be read by
            anyone through Instagram&apos;s API — that is a platform rule, not a missing setting.
          </p>
        )}
      </div>
    </div>
  )
}

function Cell({ icon: Icon, label, value }: { icon?: any; label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2.5" style={{ background: '#FAFAFA', border: '1px solid #EFEBF8' }}>
      <p className="text-[10px] font-display font-bold uppercase tracking-wide flex items-center gap-1" style={{ color: '#9B94AD' }}>
        {Icon && <Icon className="w-3 h-3" />}{label}
      </p>
      <p className="text-base font-display font-bold mt-0.5" style={{ color: '#1A1523' }}>{value}</p>
    </div>
  )
}
