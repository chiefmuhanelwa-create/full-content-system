'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History as HistoryIcon } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const COLOUR: Record<string, string> = {
  hook: 'bg-blue-100 text-blue-800', script: 'bg-blue-100 text-blue-800',
  carousel: 'bg-violet-100 text-violet-800', email: 'bg-violet-100 text-violet-800',
  governance: 'bg-amber-100 text-amber-800', instagram: 'bg-rose-100 text-rose-800',
  deal: 'bg-emerald-100 text-emerald-800', shoot: 'bg-emerald-100 text-emerald-800',
}

export default function HistoryPage() {
  const [d, setD] = useState<any>(null)
  useEffect(() => { fetch('/api/activity').then(r => r.json()).then(setD).catch(() => {}) }, [])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="THE RECORD"
        title="History"
        description="What you actually did, and what changed underneath. Read from the log, never remembered."
        icon={HistoryIcon}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: 'Recorded', v: d?.count ?? 0 },
          { l: 'This week', v: d?.thisWeek ?? 0 },
          { l: 'Kinds', v: Object.keys(d?.byKind ?? {}).length },
        ].map(c => (
          <Card key={c.l}><CardContent className="pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.l}</p>
            <p className="mt-1 font-mono text-2xl font-bold">{c.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity</CardTitle>
          <CardDescription>Tool runs and governance changes, merged into one timeline.</CardDescription>
        </CardHeader>
        <CardContent>
          {!d?.rows?.length && (
            <p className="py-14 text-center text-sm text-muted-foreground">
              Nothing recorded yet. Generate something and it lands here.
            </p>
          )}
          <div className="space-y-1.5">
            {d?.rows?.map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-[92px_1fr_auto] items-start gap-3 rounded-lg border p-2.5 text-[13px]">
                <span className={`rounded px-2 py-0.5 text-center text-[10px] font-semibold uppercase ${COLOUR[r.kind] ?? 'bg-muted text-muted-foreground'}`}>
                  {r.kind}
                </span>
                <span>
                  {r.text}
                  {r.meta?.pillar && <Badge variant="outline" className="ml-2 text-[10px]">{r.meta.pillar}</Badge>}
                  {r.meta?.flagged > 0 && <Badge className="ml-2 bg-red-600 text-[10px]">{r.meta.flagged} flagged</Badge>}
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                  {new Date(r.at).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
