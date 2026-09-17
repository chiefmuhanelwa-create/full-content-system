'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, Loader2, Copy } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']

export default function CarouselPage() {
  const [idea, setIdea] = useState('')
  const [pillar, setPillar] = useState('OWN IT')
  const [slides, setSlides] = useState(8)
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)

  const run = async () => {
    if (!idea.trim()) return
    setBusy(true); setD(null)
    try {
      const r = await fetch('/api/carousel', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, pillar, slides }),
      })
      setD(await r.json())
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="HIGHEST REACH"
        title="Carousel Generator"
        description="Carousels out-reach reels 2.2× on this account, and need no camera. He posts 137 reels for every 14 feed posts."
        icon={LayoutGrid}
      />

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="e.g. The four things an agency asks for before they ever mention a budget"
            className="min-h-[80px]" />
          <div className="flex flex-wrap gap-2">
            <select value={pillar} onChange={e => setPillar(e.target.value)} className="rounded-md border px-3 py-2 text-[13px]">
              {PILLARS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={slides} onChange={e => setSlides(Number(e.target.value))} className="rounded-md border px-3 py-2 text-[13px]">
              {[6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} slides</option>)}
            </select>
            <Button onClick={run} disabled={busy || !idea.trim()}>
              {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building…</> : 'Build the deck'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {d?.error && <p className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">{d.error}</p>}

      {d?.deck && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.deck.slides.map((s: any) => (
              <div key={s.n} className="flex aspect-square flex-col justify-between rounded-xl border-2 p-5">
                <span className="font-mono text-[11px] text-muted-foreground">{s.n} / {d.deck.slides.length}</span>
                <div>
                  <p className="text-[19px] font-bold leading-tight">{s.headline}</p>
                  {s.body && <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>}
                </div>
                <span />
              </div>
            ))}
          </div>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Caption</CardTitle>
                <CardDescription>{d.deck.designNote}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {d.deck.ctaKeyword && d.deck.ctaKeyword !== 'NONE' && <Badge variant="secondary">{d.deck.ctaKeyword}</Badge>}
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(d.deck.caption)}><Copy className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent><pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{d.deck.caption}</pre></CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
