'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Instagram, RefreshCw, AlertTriangle, TrendingUp, Loader2, ExternalLink } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

type Media = {
  mediaId: string; caption: string | null; permalink: string | null; postedAt: string | null
  likeCount: number; commentsCount: number; reach: number | null; views: number | null
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

export default function ReelsPage() {
  const [d, setD] = useState<Payload | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => fetch('/api/instagram/sync').then(r => r.json()).then(setD).catch(() => {})
  useEffect(() => { load() }, [])

  const sync = async () => {
    setSyncing(true); setMsg('')
    try {
      const r = await fetch('/api/instagram/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const j = await r.json()
      setMsg(j.error ? `${j.error} ${j.how ?? ''}` : `Synced ${j.synced} posts. ${j.postsWithBannedClaims} carry a banned claim.`)
      if (!j.error) load()
    } finally { setSyncing(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="LIVE"
        title="Reel Tracker"
        description="What the account actually did, not what the strategy says it should. Every caption is fact-checked on the way in."
        icon={Instagram}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={sync} disabled={syncing}>
          {syncing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Syncing…</> : <><RefreshCw className="mr-2 h-4 w-4" />Sync from Instagram</>}
        </Button>
        {d?.account && (
          <span className="text-sm text-muted-foreground">
            {d.account.followers?.toLocaleString()} followers · {d.count} posts stored
          </span>
        )}
      </div>
      {msg && <p className="rounded-lg bg-muted p-3 text-sm">{msg}</p>}

      {!!d?.flaggedCount && (
        <Card className="border-l-4 border-l-red-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-700" />
              {d.flaggedCount} published post{d.flaggedCount > 1 ? 's' : ''} carry a banned claim
            </CardTitle>
            <CardDescription>These are already live. Correcting them is a task, not a warning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {d.flagged.map((f) => (
              <div key={f.mediaId} className="flex items-start justify-between gap-4 rounded-lg bg-red-50 p-3 text-[13px]">
                <div>
                  <p className="font-semibold">{f.banned.join(' · ')}</p>
                  <p className="text-muted-foreground">{f.postedAt?.slice(0, 10)}</p>
                </div>
                {f.permalink && (
                  <a href={f.permalink} target="_blank" rel="noreferrer" className="shrink-0 text-blue-700 hover:underline">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4" />What the account teaches</CardTitle>
            <CardDescription>Computed from stored rows, never generated. Ranked by comments — the metric the Loss Law moves.</CardDescription>
          </CardHeader>
          <CardContent>
            {!d?.pillarPerformance?.length && <p className="py-10 text-center text-sm text-muted-foreground">Sync to populate.</p>}
            <div className="divide-y">
              {d?.pillarPerformance?.map((p) => (
                <div key={p.pillar} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2.5 text-[13px]">
                  <span className="font-semibold">{p.pillar}</span>
                  <span className="text-muted-foreground">{p.posts} posts</span>
                  <span className="font-mono tabular-nums">{p.medianComments} comments · {p.medianLikes} likes</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent posts</CardTitle>
            <CardDescription>Classified against the ruled pillar set by the governed model.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[420px] space-y-2 overflow-y-auto">
            {d?.media?.map((m) => (
              <div key={m.mediaId} className="rounded-lg border p-3 text-[13px]">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {m.pillar && <Badge variant="secondary">{m.pillar}</Badge>}
                  {m.ctaKeyword && <Badge variant="outline">{m.ctaKeyword}</Badge>}
                  {m.factLock && !m.factLock.clean && <Badge className="bg-red-600">banned claim</Badge>}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {m.likeCount} ♥ · {m.commentsCount} 💬
                  </span>
                </div>
                <p className="line-clamp-2 text-muted-foreground">{m.caption?.slice(0, 160)}</p>
              </div>
            ))}
            {!d?.media?.length && <p className="py-10 text-center text-sm text-muted-foreground">No posts stored yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
