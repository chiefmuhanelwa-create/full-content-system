'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Repeat } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function ScorecardPage() {
  const [d, setD] = useState<any>(null)
  const [edit, setEdit] = useState<Record<string, { target?: string; actual?: string; lesson?: string }>>({})

  const load = () => fetch('/api/batch-shoot').then(r => r.json()).then(setD).catch(() => {})
  useEffect(() => { load() }, [])

  const save = async (id: string, patch: any) => {
    await fetch('/api/batch-shoot', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    })
    load()
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="THE LOOP"
        title="Scorecard"
        description="Every post carries one goal, set before it ships. A post without a KPI cannot fail — which means it cannot teach."
        icon={Target}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: 'Tracked', v: d?.count ?? 0 },
          { l: 'Pass rate', v: d?.passRate == null ? '—' : d.passRate + '%' },
          { l: 'Measured', v: Object.entries(d?.byStatus ?? {}).find(([k]) => k === 'measured')?.[1] ?? 0 },
        ].map(c => (
          <Card key={c.l}><CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.l}</p>
            <p className="mt-1 font-mono text-2xl font-bold">{String(c.v)}</p>
          </CardContent></Card>
        ))}
      </div>

      {!!d?.repeatedFailures?.length && (
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Repeat className="h-4 w-4" />This has failed three times</CardTitle>
            <CardDescription>The Third-Repetition-Rule — anything done three times becomes a system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {d.repeatedFailures.map((f: any, i: number) => (
              <div key={i} className="rounded-lg bg-amber-50 p-3 text-[13px]">
                <b>{f.times}×</b> {f.reason}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Posts</CardTitle>
          <CardDescription>Set the target before you post. Record the actual after.</CardDescription></CardHeader>
        <CardContent>
          {!d?.items?.length && <p className="py-10 text-center text-sm text-muted-foreground">Nothing scripted yet — start in Batch Shoot.</p>}
          <div className="space-y-3">
            {d?.items?.map((it: any) => {
              const e = edit[it.id] ?? {}
              return (
                <div key={it.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px]">
                    {it.pillar && <Badge variant="secondary">{it.pillar}</Badge>}
                    {it.goal && <Badge variant="outline">{it.goal}</Badge>}
                    <Badge variant="outline">{it.status}</Badge>
                    {it.verdict && <Badge className={it.verdict === 'pass' ? 'bg-green-600' : 'bg-red-600'}>{it.verdict}</Badge>}
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">{it.kpiMetric}</span>
                  </div>
                  <p className="mb-2 text-[13px] font-medium">{it.spokenHook || it.idea}</p>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <input placeholder={`target ${it.kpiMetric ?? ''}`} value={e.target ?? it.kpiTarget ?? ''}
                      onChange={ev => setEdit({ ...edit, [it.id]: { ...e, target: ev.target.value } })}
                      className="rounded-md border px-2 py-1.5 text-[13px]" />
                    <input placeholder="actual" value={e.actual ?? it.actualValue ?? ''}
                      onChange={ev => setEdit({ ...edit, [it.id]: { ...e, actual: ev.target.value } })}
                      className="rounded-md border px-2 py-1.5 text-[13px]" />
                    <input placeholder="lesson if it failed" value={e.lesson ?? it.lesson ?? ''}
                      onChange={ev => setEdit({ ...edit, [it.id]: { ...e, lesson: ev.target.value } })}
                      className="rounded-md border px-2 py-1.5 text-[13px]" />
                    <Button size="sm" variant="secondary" onClick={() => save(it.id, {
                      kpiTarget: e.target ? Number(e.target) : undefined,
                      actualValue: e.actual ? Number(e.actual) : undefined,
                      lesson: e.lesson,
                    })}>Save</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
