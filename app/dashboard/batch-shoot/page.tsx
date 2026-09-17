'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Clapperboard, Loader2, AlertTriangle, Copy } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']
const TIERS = ['ENTRY', 'CORE', 'PREMIUM']
const GOALS = ['GROW', 'NURTURE', 'SELL']
const FORMATS = [
  { k: 'personal', n: 'Personal Story' },
  { k: 'case_study', n: 'Case Study' },
  { k: 'explainer', n: 'Explainer' },
  { k: 'storytelling', n: 'Story Arc' },
]
const DURATIONS = ['15s', '30s', '60s', '90s']

export default function BatchShootPage() {
  const [idea, setIdea] = useState('')
  const [pillar, setPillar] = useState('PRICE IT')
  const [tier, setTier] = useState('CORE')
  const [goal, setGoal] = useState('NURTURE')
  const [format, setFormat] = useState('personal')
  const [duration, setDuration] = useState('90s')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<any>(null)
  const [err, setErr] = useState('')

  const run = async () => {
    if (!idea.trim()) return
    setBusy(true); setErr(''); setRes(null)
    try {
      const r = await fetch('/api/batch-shoot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, pillar, tier, goal, format, duration }),
      })
      const j = await r.json()
      if (j.error) setErr(j.error); else setRes(j)
    } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  const copy = (t: string) => navigator.clipboard?.writeText(t)
  const b = res?.bundle

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="BATCH DAY"
        title="Batch Shoot"
        description="One idea in. Spoken hook, on-screen text hook, reel script with rehooks on the measured cadence, the long-form version, caption and shot list out."
        icon={Clapperboard}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">The idea</CardTitle>
          <CardDescription>One sentence is enough. Everything else is read from the algorithm.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={idea} onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. Creators hand over their rate card before the agency names a budget, and it becomes the ceiling"
            className="min-h-[90px]" />
          <div className="grid gap-2 sm:grid-cols-5">
            {[
              [pillar, setPillar, PILLARS], [tier, setTier, TIERS], [goal, setGoal, GOALS], [duration, setDuration, DURATIONS],
            ].map(([v, set, opts]: any, i) => (
              <select key={i} value={v} onChange={(e) => set(e.target.value)} className="rounded-md border px-2 py-2 text-[13px]">
                {opts.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="rounded-md border px-2 py-2 text-[13px]">
              {FORMATS.map((f) => <option key={f.k} value={f.k}>{f.n}</option>)}
            </select>
          </div>
          <Button onClick={run} disabled={busy || !idea.trim()}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building the bundle…</> : 'Generate the shoot bundle'}
          </Button>
        </CardContent>
      </Card>

      {err && <p className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">{err}</p>}

      {res?.blocked && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />{res.note}
        </p>
      )}

      {b && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-base">Spoken hook</CardTitle>
                <CardDescription>Second person. Accuses the viewer. His loss enters at beat 3.</CardDescription></CardHeader>
              <CardContent>
                <p className="text-[15px] font-semibold leading-snug">{b.spokenHook}</p>
                {b.hookScore && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['R', 'A', 'C', 'U', 'B'].map((k) => (
                      <Badge key={k} variant="outline" className="font-mono">{k} {b.hookScore[k]}</Badge>
                    ))}
                  </div>
                )}
                {b.hookScore?.why && <p className="mt-2 text-[12px] text-muted-foreground">{b.hookScore.why}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Text hook</CardTitle>
                <CardDescription>On-screen overlay. Readable with sound off.</CardDescription></CardHeader>
              <CardContent>
                <p className="rounded-lg bg-zinc-900 px-4 py-6 text-center text-[17px] font-bold uppercase leading-tight text-white">
                  {b.textHook}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">KPI</CardTitle>
                <CardDescription>Set before it ships, or it cannot fail — and cannot teach.</CardDescription></CardHeader>
              <CardContent className="space-y-1 text-[13px]">
                <p><span className="text-muted-foreground">Goal</span> <span className="font-semibold">{res.kpi?.goal}</span></p>
                <p><span className="text-muted-foreground">Metric</span> <span className="font-semibold">{res.kpi?.metric}</span></p>
                <p className="text-muted-foreground">{res.kpi?.pass}</p>
                <p className="pt-2"><span className="text-muted-foreground">CTA</span> <Badge variant="secondary">{b.ctaKeyword}</Badge></p>
              </CardContent>
            </Card>
          </div>

          {([['reelScript', `Reel script · ${duration}`], ['longFormScript', 'Long form'], ['caption', 'Caption']] as const).map(([k, label]) => (
            <Card key={k}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{label}</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => copy(b[k])}><Copy className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{b[k]}</pre>
              </CardContent>
            </Card>
          ))}

          {!!b.shotList?.length && (
            <Card>
              <CardHeader><CardTitle className="text-base">Shot list</CardTitle>
                <CardDescription>The part that stays permanently yours.</CardDescription></CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-1 pl-5 text-[13px]">
                  {b.shotList.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ol>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
