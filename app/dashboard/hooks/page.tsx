'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, Copy, ArrowRight, AlertTriangle, Database } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']
const TIERS = ['ENTRY', 'CORE', 'PREMIUM']
const AWARENESS = [
  { k: 'unaware', n: 'Unaware' }, { k: 'problem', n: 'Problem-aware' },
  { k: 'solution', n: 'Solution-aware' }, { k: 'product', n: 'Product-aware' }, { k: 'most', n: 'Most aware' },
]

export default function HooksPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [ideaId, setIdeaId] = useState('')
  const [topic, setTopic] = useState('')
  const [pillar, setPillar] = useState('PRICE IT')
  const [tier, setTier] = useState('CORE')
  const [awareness, setAwareness] = useState('problem')
  const [surface, setSurface] = useState<'spoken' | 'caption'>('spoken')
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)

  // An idea handed over from the Idea Bank arrives here already chosen. The ideaId rides
  // along so whatever is written downstream can be saved back onto the idea it came from.
  useEffect(() => {
    const id = params.get('handoff')
    if (!id) return
    fetch(`/api/handoff?id=${id}`).then(r => r.json()).then(j => {
      const p = j?.handoff?.payload
      if (!p) return
      if (p.topic) setTopic(p.topic)
      if (p.pillar) setPillar(p.pillar)
      if (p.tier) setTier(p.tier)
      if (p.surface) setSurface(p.surface)
      if (p.ideaId) setIdeaId(p.ideaId)
      fetch('/api/handoff', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    }).catch(() => {})
  }, [params])

  const run = async () => {
    if (!topic.trim()) return
    setBusy(true); setD(null)
    try {
      const r = await fetch('/api/hooks/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, pillar, tier, awareness, surface, count: 9 }),
      })
      setD(await r.json())
    } finally { setBusy(false) }
  }

  const toScript = async (hook: string) => {
    const r = await fetch('/api/handoff', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromTool: 'hooks', toTool: 'scripts', kind: 'hook', payload: { hook, topic, pillar, tier, ideaId } }),
    })
    router.push(`/dashboard/scripts?handoff=${(await r.json()).id}`)
  }

  const bar = (v: number) => (
    <span className="inline-flex h-1 w-5 overflow-hidden rounded-full bg-muted">
      <span className="h-full rounded-full bg-primary" style={{ width: `${(v / 5) * 100}%` }} />
    </span>
  )

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="80% DATA · 20% AI"
        title="Hook Generator"
        description="Fifty templates that have already worked, filled for your topic. The model fills placeholders and scores — it does not invent the shape."
        icon={Zap}
      />

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="What is this piece about? e.g. creators hand over a rate card before the agency names a budget"
            className="min-h-[76px]" />
          <div className="grid gap-2 sm:grid-cols-4">
            <select value={pillar} onChange={e => setPillar(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {PILLARS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={tier} onChange={e => setTier(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {TIERS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={awareness} onChange={e => setAwareness(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {AWARENESS.map(a => <option key={a.k} value={a.k}>{a.n}</option>)}
            </select>
            <div className="flex overflow-hidden rounded-md border">
              {(['spoken', 'caption'] as const).map(s => (
                <button key={s} onClick={() => setSurface(s)}
                  className={`flex-1 px-2 py-2 text-[12px] font-medium capitalize transition ${surface === s ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {surface === 'spoken'
              ? 'Spoken opens in the second person, about the viewer. Your own loss enters at beat 3, around ten seconds.'
              : 'Caption opens on your loss with a figure from the ledger. Measured 25.5 median comments against 3.0.'}
          </p>
          <Button onClick={run} disabled={busy || !topic.trim()}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Filling templates…</> : 'Generate 9 hooks'}
          </Button>
        </CardContent>
      </Card>

      {d?.error && (
        <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <p className="font-semibold">{d.error}</p>{d.fix && <p className="mt-1">{d.fix}</p>}
        </div>
      )}

      {d?.composition && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-[12px]">
          <Database className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold">{d.composition.ratio}</span>
          <span className="text-muted-foreground">· from data: {d.composition.fromData}</span>
          {d.cta && <Badge variant="secondary" className="ml-auto">CTA {d.cta.keyword}</Badge>}
        </div>
      )}

      {d?.hooks?.map((h: any, i: number) => (
        <Card key={i} className={h.clean === false ? 'border-l-4 border-l-red-600' : undefined}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[16px] font-semibold leading-snug">{h.hook}</p>
              <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-[13px] font-bold text-primary">
                {h.total}<span className="text-[10px] font-normal">/25</span>
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              {h.category && <Badge variant="outline" className="text-[10px]">{h.category}</Badge>}
              {['R', 'A', 'C', 'U', 'B'].map(k => (
                <span key={k} className="inline-flex items-center gap-1">{k}{bar(Number(h.scores?.[k]) || 0)}</span>
              ))}
            </div>

            {h.why && <p className="mt-2 text-[12px] text-muted-foreground">{h.why}</p>}

            {h.sourceTemplate && (
              <p className="mt-2 rounded bg-muted px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
                from: {h.sourceTemplate}
              </p>
            )}

            {h.clean === false && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-red-700">
                <AlertTriangle className="h-3.5 w-3.5" />banned: {h.banned?.join(', ')}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard?.writeText(h.hook)}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />Copy
              </Button>
              <Button size="sm" onClick={() => toScript(h.hook)} disabled={h.clean === false}>
                Script it<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
