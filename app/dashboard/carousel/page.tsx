'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, Loader2, Copy, Download } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { CarouselSlide, isDark } from '@/components/CarouselSlide'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']

/** A short, blunt ghost anchor for the cover — a figure if the idea carries one. */
function anchorFor(idea: string) {
  const m = idea.match(/R\s?[\d,.]{3,}|\d{2,3}%/)
  return m ? m[0].replace(/\s/g, '') : '≠'
}

export default function CarouselPage() {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(0)

  /** Export each slide at its true 1080x1350, one file per slide, in order. */
  const exportAll = async () => {
    setExporting(true); setDone(0)
    try {
      const html2canvas = (await import('html2canvas')).default
      for (let i = 0; i < slideRefs.current.length; i++) {
        const el = slideRefs.current[i]
        if (!el) continue
        const canvas = await html2canvas(el, { width: 1080, height: 1350, scale: 1, backgroundColor: null, useCORS: true })
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = `slide-${String(i + 1).padStart(2, '0')}.png`
        a.click()
        setDone(i + 1)
        await new Promise(r => setTimeout(r, 180))   // browsers throttle rapid downloads
      }
    } finally { setExporting(false) }
  }

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
          {/* Rendered at full 1080x1350 off-screen, then scaled for preview. html2canvas
              captures the real element, so what exports is exactly what is shown. */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-[13px] text-muted-foreground">
              {d.deck.slides.length} slides · 1080×1350 · Montserrat + Lato, the locked product palette
            </p>
            <Button size="sm" onClick={exportAll} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" />
              {exporting ? `Exporting ${done}/${d.deck.slides.length}…` : 'Download all slides'}
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3">
            {d.deck.slides.map((sl: any, i: number) => (
              <div key={sl.n} className="shrink-0" style={{ width: 270 }}>
                <div style={{ width: 270, height: 337.5, overflow: 'hidden', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.12)' }}>
                  <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }}>
                    <div ref={(el) => { slideRefs.current[i] = el }}>
                      <CarouselSlide s={{ ...sl, kind: sl.kind ?? (sl.n === 1 ? 'cover' : undefined), anchor: sl.anchor ?? (sl.n === 1 ? anchorFor(idea) : undefined) }}
                        total={d.deck.slides.length} dark={isDark(sl.n)} />
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-center font-mono text-[11px] text-muted-foreground">{sl.n}/{d.deck.slides.length}</p>
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
