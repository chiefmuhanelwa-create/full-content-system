'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Loader2, Copy, AlertTriangle, Database, MonitorPlay } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']
const TIERS = ['ENTRY', 'CORE', 'PREMIUM']
const DURATIONS = ['15s', '30s', '60s', '90s']
const FORMATS = [
  { k: 'personal', n: 'Personal story' }, { k: 'case_study', n: 'Case study' },
  { k: 'explainer', n: 'Explainer' }, { k: 'storytelling', n: 'Story arc' },
]

function ScriptWriter() {
  const params = useSearchParams()
  const [idea, setIdea] = useState('')
  const [hook, setHook] = useState('')
  const [pillar, setPillar] = useState('PRICE IT')
  const [tier, setTier] = useState('CORE')
  const [duration, setDuration] = useState('90s')
  const [format, setFormat] = useState('personal')
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)
  const [ideaId, setIdeaId] = useState('')
  const [saved, setSaved] = useState(false)

  // A hook handed over from the Hook Generator arrives here, already chosen.
  useEffect(() => {
    const id = params.get('handoff')
    if (!id) return
    fetch(`/api/handoff?id=${id}`).then(r => r.json()).then(j => {
      const p = j?.handoff?.payload
      if (!p) return
      if (p.hook) setHook(p.hook)
      if (p.topic) setIdea(p.topic)
      if (p.pillar) setPillar(p.pillar)
      if (p.tier) setTier(p.tier)
      if (p.ideaId) setIdeaId(p.ideaId)
      fetch('/api/handoff', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    }).catch(() => {})
  }, [params])

  const run = async () => {
    if (!idea.trim() && !hook.trim()) return
    setBusy(true); setD(null)
    try {
      const r = await fetch('/api/scripts/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, hook, pillar, tier, duration, format }),
      })
      setD(await r.json())
    } finally { setBusy(false) }
  }

  const s = d?.script

  // Close the loop: a script written from an Idea Bank handoff is saved back onto the idea
  // that produced it, and the idea moves to "script". Nothing is retyped, and the bank stops
  // being a list of titles and starts holding the work.
  const saveToIdea = async () => {
    if (!ideaId || !s) return
    const body = s.fullScript ?? (typeof s === 'string' ? s : JSON.stringify(s, null, 2))
    await fetch('/api/ideas', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ideaId, script: body, status: 'script', ...(hook ? { spokenHook: hook } : {}) }),
    })
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="80% DATA · 20% AI"
        title="Script Writer"
        description="The beat structure is measured, not chosen. Rehook count and spacing come from the cadence table — that is what produces 80–95% watch time."
        icon={FileText}
      />

      <Card>
        <CardContent className="space-y-3 pt-6">
          {hook && (
            <div className="rounded-lg border-l-4 border-l-primary bg-primary/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Opening line, already chosen</p>
              <p className="mt-0.5 text-[14px] font-semibold">{hook}</p>
            </div>
          )}
          <Textarea value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="What is the piece about?" className="min-h-[70px]" />
          <div className="grid gap-2 sm:grid-cols-4">
            <select value={pillar} onChange={e => setPillar(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {PILLARS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={tier} onChange={e => setTier(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {TIERS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={format} onChange={e => setFormat(e.target.value)} className="rounded-md border bg-card px-3 py-2 text-[13px]">
              {FORMATS.map(f => <option key={f.k} value={f.k}>{f.n}</option>)}
            </select>
            <div className="flex overflow-hidden rounded-md border">
              {DURATIONS.map(x => (
                <button key={x} onClick={() => setDuration(x)}
                  className={`flex-1 px-1 py-2 text-[12px] font-medium transition ${duration === x ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>
                  {x}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={run} disabled={busy || (!idea.trim() && !hook.trim())}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Writing into the skeleton…</> : 'Write the script'}
          </Button>
        </CardContent>
      </Card>

      {d?.error && (
        <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <p className="font-semibold">{d.error}</p>{d.fix && <p className="mt-1">{d.fix}</p>}
        </div>
      )}

      {d?.skeleton && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />The skeleton — from data
            </CardTitle>
            <CardDescription>
              {d.skeleton.format} · rehooks {d.skeleton.rehooks}
              {d.skeleton.cadence?.target ? ` · target ${d.skeleton.cadence.target}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {d.skeleton.beats?.map((b: any, i: number) => (
                <span key={b.n ?? i} className="rounded-full bg-muted px-3 py-1 text-[12px] font-medium">
                  {b.n ?? i + 1}. {b.beat} <span className="font-mono opacity-60">{b.band}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">{d.composition.ratio} — {d.composition.fromData}</p>
          </CardContent>
        </Card>
      )}

      {d?.blocked && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
          A banned claim survived the repair pass. Fix it before this ships.
        </p>
      )}

      {s && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Beats</CardTitle>
                <CardDescription>What you say, and what is on screen while you say it.</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {s.beats?.map((b: any) => (
                  <div key={b.n}>
                    <div className="rounded-lg border p-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{b.n}. {b.beat}</Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">{b.band ?? b.seconds}</span>
                        {b.marker && <Badge variant="outline" className="text-[10px]">{b.marker}</Badge>}
                      </div>
                      {b.screen && (
                        <p className="mb-2 inline-block rounded bg-zinc-900 px-2 py-1 text-[11px] font-bold uppercase text-white">
                          SCREEN: {b.screen}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{b.line}</p>
                    </div>
                    {/* Rehooks sit BETWEEN beats, at the seam they were written for. */}
                    {s.rehooks?.filter((r: any) => r.after === b.n).map((r: any, i: number) => (
                      <p key={i} className="my-2 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 px-3 py-2 text-[13px] italic">
                        REHOOK — {r.line}
                      </p>
                    ))}
                  </div>
                ))}

                {s.tail && (
                  <div className="rounded-lg border border-dashed p-3">
                    <Badge variant="outline" className="mb-1 text-[10px]">TAIL · loops back</Badge>
                    <p className="text-[14px] italic leading-relaxed">{s.tail}</p>
                    {s.loopsTo && <p className="mt-1 text-[12px] text-muted-foreground">↻ {s.loopsTo}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Text hook</CardTitle></CardHeader>
                <CardContent>
                  <p className="rounded-lg bg-zinc-900 px-3 py-5 text-center text-[16px] font-bold uppercase leading-tight text-white">
                    {s.textHook}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{s.editNotes?.runtimeTarget ?? s.runtimeCheck}</p>
                  {s.ctaKeyword && s.ctaKeyword !== 'NONE' && (
                    <Badge variant="secondary" className="mt-2">CTA {s.ctaKeyword}</Badge>
                  )}
                </CardContent>
              </Card>
              {s.editNotes && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Edit notes</CardTitle>
                    <CardDescription>What the cut needs, not what the script says.</CardDescription></CardHeader>
                  <CardContent className="space-y-1">
                    {Object.entries(s.editNotes).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-[12px]">
                        <span className="w-[104px] shrink-0 text-muted-foreground">
                          {k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
                        </span>
                        <span className="flex-1">{String(v)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {ideaId && (
            <Card>
              <CardContent className="flex items-center gap-3 py-4 flex-wrap">
                <p className="text-sm text-muted-foreground flex-1 min-w-[200px]">
                  This script came from the Idea Bank. Save it back and the idea moves to <strong>Scripted</strong>.
                </p>
                <Button size="sm" onClick={saveToIdea} disabled={saved}>
                  {saved ? 'Saved to the idea' : 'Save to idea'}
                </Button>
              </CardContent>
            </Card>
          )}

          {([['fullScript', 'Full script', MonitorPlay], ['caption', 'Caption', FileText]] as const).map(([k, label, Icon]) => (
            <Card key={k}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-base"><Icon className="h-4 w-4" />{label}</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(s[k])}><Copy className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{s[k]}</pre>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

/**
 * useSearchParams() opts the tree into client-side rendering, so Next requires a Suspense
 * boundary or the production prerender fails. A local build can miss this when .next is
 * warm — only a clean build reproduces it.
 */
export default function ScriptsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>}>
      <ScriptWriter />
    </Suspense>
  )
}
