'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Fingerprint } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function IpRegisterPage() {
  const [g, setG] = useState<any>(null)
  useEffect(() => {
    fetch('/api/knowledge').then(r => r.json()).then(d => {
      const m: any = {}
      for (const k of d.keys || []) m[k.key] = k.value
      setG(m)
    }).catch(() => {})
  }, [])

  const ips = g?.ips?.register ?? []
  const id = g?.identity
  const byStage = ips.reduce((a: any, i: any) => ({ ...a, [i.stage]: [...(a[i.stage] || []), i] }), {})

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="WHAT YOU OWN"
        title="IP Register"
        description="Named, ownable methods extracted from what he already does — plus the mission, vision and values everything else is judged against."
        icon={Fingerprint}
      />

      {id && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">The message</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">&ldquo;{id.message}&rdquo;</p>
              <p className="mt-2 text-[13px] text-muted-foreground">{id.messageNote}</p>
              <div className="mt-4 space-y-2 text-[13px]">
                <p><span className="font-semibold">Mission.</span> {id.mission}</p>
                <p><span className="font-semibold">Vision.</span> {id.vision}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Entity</CardTitle></CardHeader>
            <CardContent><p className="text-[13px] leading-relaxed">{id.entity}</p></CardContent>
          </Card>
        </div>
      )}

      {!!id?.values?.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Values</CardTitle>
            <CardDescription>The Brand Engine judges every incoming deal against these.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {id.values.map((v: any) => (
                <div key={v.name} className="rounded-lg border p-3">
                  <p className="text-[14px] font-semibold">{v.name}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{v.means}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ips.length} named IPs</CardTitle>
          <CardDescription>{g?.ips?.rule}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(byStage).map(([stage, items]: any) => (
            <div key={stage}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{stage}</p>
              <div className="space-y-1.5">
                {items.map((i: any) => (
                  <div key={i.name} className="grid grid-cols-[minmax(0,260px)_1fr] gap-4 rounded-lg border p-2.5 text-[13px]">
                    <span className="font-semibold">{i.name}</span>
                    <span className="text-muted-foreground">{i.solves}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {g?.agency_intel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">The four rules of the room</CardTitle>
            <CardDescription>{g.agency_intel.source} · {g.agency_intel.privacy}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {g.agency_intel.fourRules.map((r: any) => (
              <div key={r.n} className="rounded-lg border-l-4 border-l-zinc-800 bg-muted/40 p-3 text-[13px]">
                <p className="font-semibold">{r.n}. {r.rule}</p>
                <p className="mt-1 text-muted-foreground">{r.why}</p>
                {r.quote && <p className="mt-1 italic">&ldquo;{r.quote}&rdquo;</p>}
                <p className="mt-1.5 rounded bg-green-50 px-2 py-1"><b>Counter:</b> {r.counter}</p>
              </div>
            ))}
            <p className="rounded-lg bg-amber-50 p-3 text-[13px]">
              <b>They will also ask for:</b> {g.agency_intel.theyAskFor?.join(' · ')}<br />
              <span className="text-muted-foreground">{g.agency_intel.riskNote}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
