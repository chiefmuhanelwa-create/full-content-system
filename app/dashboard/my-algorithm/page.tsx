'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, AlertTriangle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

/** No AI. Every number here is measured and lives in Knowledge — change it there. */
export default function MyAlgorithmPage() {
  const [g, setG] = useState<any>(null)
  useEffect(() => {
    fetch('/api/knowledge').then(r => r.json()).then(d => {
      const m: any = {}; for (const k of d.keys || []) m[k.key] = k.value
      setG(m)
    }).catch(() => {})
  }, [])

  const pillars = g?.pillars?.pillars ?? []
  const algo = g?.algorithm ?? {}
  const cta = g?.cta_library?.keywords ?? []
  const kpi = g?.kpi_model ?? {}
  const rehook = g?.rehook ?? {}
  const total = pillars.reduce((a: number, p: any) => a + (p.pct ?? 0), 0)

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="100% MEASURED"
        title="My Algorithm"
        description="The rules this account actually runs on. Nothing here is generated — every line is measured and editable in Knowledge."
        icon={Cpu}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">The pillars</CardTitle>
          <CardDescription>One per week, five-week rotation. Every piece names the tier it serves.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex h-2.5 overflow-hidden rounded-full">
            {pillars.map((p: any, i: number) => (
              <span key={p.k} title={`${p.k} ${p.pct}%`}
                style={{ width: `${p.pct}%`, background: ['#8B5CF6', '#059669', '#7C3AED', '#D97706', '#E11D48'][i % 5] }} />
            ))}
          </div>
          <div className="space-y-2">
            {pillars.map((p: any) => (
              <div key={p.k} className="rounded-lg border p-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-semibold">{p.k}</span>
                  <span className="font-mono text-[13px] text-primary">{p.pct}%</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">sells to {p.sells}</Badge>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{p.why}</p>
              </div>
            ))}
          </div>
          {total !== 100 && (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-[13px]">
              <AlertTriangle className="h-4 w-4 text-amber-700" />The weights sum to {total}%, not 100%.
            </p>
          )}
          {g?.pillars?.tension && (
            <p className="mt-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 text-[12px] leading-relaxed">
              {typeof g.pillars.tension === 'string' ? g.pillars.tension : JSON.stringify(g.pillars.tension)}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Cadence and format</CardTitle>
            <CardDescription>{algo.caveat}</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            {[
              ['Posts per week', algo.posts_per_week ?? kpi?.benchmarks?.postsPerWeek],
              ['Post window', algo.post_hours_sast ?? kpi?.benchmarks?.postHoursSAST],
              ['Never post', algo.never ?? kpi?.benchmarks?.neverPost],
              ['Best day', algo.best_day],
              ['Reel runtime', algo.reel_runtime_seconds ?? kpi?.benchmarks?.reelRuntimeSeconds],
            ].filter(([, v]) => v).map(([k, v]: any) => (
              <div key={k} className="flex justify-between gap-4 border-b py-1.5 last:border-0">
                <span className="text-muted-foreground">{k}</span><span className="text-right font-semibold">{String(v)}</span>
              </div>
            ))}
            {(algo.format_finding ?? kpi?.benchmarks?.formatFinding) && (
              <p className="rounded-lg bg-muted p-3 leading-relaxed">{algo.format_finding ?? kpi.benchmarks.formatFinding}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Rehooking</CardTitle>
            <CardDescription>Target {rehook.target}. {rehook.why}</CardDescription></CardHeader>
          <CardContent>
            <div className="divide-y text-[13px]">
              {(rehook.cadence ?? []).map((c: any) => (
                <div key={c.duration} className="grid grid-cols-[52px_1fr] gap-3 py-2">
                  <span className="font-mono font-semibold">{c.duration}</span>
                  <span><b>{c.rehooks}</b> every {c.every}<br /><span className="text-muted-foreground">{c.structure}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">CTA keywords</CardTitle>
          <CardDescription>{g?.cta_library?.warning}</CardDescription></CardHeader>
        <CardContent>
          <div className="divide-y">
            {cta.map((k: any) => (
              <div key={k.k} className="grid grid-cols-[86px_92px_1fr] items-center gap-3 py-2 text-[13px]">
                <span className="font-mono font-bold">{k.k}</span>
                <Badge variant={k.status === 'live' ? 'default' : k.status === 'orphaned' ? 'destructive' : 'outline'} className="justify-center text-[10px]">
                  {k.status}
                </Badge>
                <span className="text-muted-foreground">{k.note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
