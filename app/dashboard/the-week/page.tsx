'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function TheWeekPage() {
  const [p, setP] = useState<any>(null)
  const [a, setA] = useState<any>(null)
  useEffect(() => {
    fetch('/api/governance?key=pillars').then(r => r.json()).then(d => setP(d.value)).catch(() => {})
    fetch('/api/governance?key=algorithm').then(r => r.json()).then(d => setA(d.value)).catch(() => {})
  }, [])
  return (
    <div className="space-y-6">
      <ToolPageHeader eyebrow="PLAN" title="The Week"
        description="One pillar per week, five-week rotation. A week of one thing teaches something complete." icon={CalendarDays} />
      {p && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {p.pillars.map((x: any) => (
              <Card key={x.k}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{x.k}</CardTitle>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">{x.pct}%</span>
                  </div>
                  <CardDescription>Sells to {x.sells}</CardDescription>
                </CardHeader>
                <CardContent><p className="text-[13px] leading-relaxed text-muted-foreground">{x.why}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-4">
            <p className="text-sm font-semibold">⚠️ A tension worth naming — not a licence to change the weights</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">{p.tension}</p>
          </div>
        </>
      )}
      {a && (
        <Card>
          <CardHeader><CardTitle className="text-base">The cadence</CardTitle>
            <CardDescription>Measured on his own account — {a.source}</CardDescription></CardHeader>
          <CardContent>
            <div className="divide-y">
              {a.cadence.map((c: any, i: number) => (
                <div key={i} className="grid grid-cols-[230px_1fr] gap-4 py-3">
                  <span className="text-[13px] font-semibold">{c.rule}</span>
                  <span className="text-[13px] leading-relaxed text-muted-foreground">{c.why}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3">
              <p className="text-sm font-semibold">Carousels are under-used</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">{a.formats.finding} {a.formats.imbalance} <em>{a.formats.caveat}</em></p>
            </div>
          </CardContent>
        </Card>
      )}
      {!p && <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>}
    </div>
  )
}
