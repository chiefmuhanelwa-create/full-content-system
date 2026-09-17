'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FeatureTile, type Accent } from '@/components/FeatureTile'
import { icon } from '@/components/icon-map'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, AlertTriangle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const BLURB: Record<string, string> = {
  Content: 'Ideation, scripting, storytelling, hooks, captions, recording.',
  Tracking: 'What happened after you posted, and whether it hit its KPI.',
  Planning: 'Which pillar, which week, and what makes you come back.',
  'Brand & Money': 'Rate cards, deals, invoices, and what actually arrived.',
  Marketing: 'Email, copy and CTAs — the owned channel.',
  Audience: 'Who they are, and what they fear.',
  Library: 'Everything kept — hooks, stories, scripts, IP.',
  Governance: 'The rules the whole system obeys, and the ability to change them.',
}

export default function FeaturesPage() {
  const [d, setD] = useState<any>(null)
  const [q, setQ] = useState('')
  useEffect(() => { fetch('/api/features').then(r => r.json()).then(setD).catch(() => {}) }, [])

  const term = q.trim().toLowerCase()
  const groups = (d?.byCategory ?? [])
    .map((g: any) => ({ ...g, items: term
      ? g.items.filter((i: any) => (i.name + i.solves + (i.pillar ?? '')).toLowerCase().includes(term))
      : g.items }))
    .filter((g: any) => g.items.length)

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="THE SYSTEM"
        title="All Features"
        description="Every tool, grouped by the job it does. This page reads the filesystem — it cannot advertise something that is not there."
        icon={LayoutGrid}
      />

      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted px-4 py-3 text-[13px]">
        <span><b className="font-mono">{d?.total ?? '—'}</b> features</span>
        <span><b className="font-mono">{d?.byCategory?.length ?? '—'}</b> categories</span>
        <span className={d?.healthy ? 'text-green-700' : 'text-red-700'}>
          {d?.healthy ? 'no dead links' : `${d?.advertisedButMissing?.length ?? 0} advertised but missing`}
        </span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
          className="ml-auto w-64 rounded-md border bg-card px-3 py-1.5 text-[13px]" />
      </div>

      {!!d?.advertisedButMissing?.length && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
          In the register but not on disk: <span className="font-mono">{d.advertisedButMissing.join(', ')}</span>
        </p>
      )}

      {groups.map((g: any) => (
        <section key={g.category}>
          <div className="mb-3 flex items-baseline gap-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">{g.category}</h2>
            <span className="text-[12px] text-muted-foreground">{g.items.length}</span>
            <span className="text-[12px] text-muted-foreground">· {BLURB[g.category]}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map((i: any) => (
              <FeatureTile key={i.slug} href={i.href} name={i.name}
                eyebrow={i.pillar ?? i.stage ?? i.cat} icon={icon(i.icon)}
                accent={i.accent as Accent} fact={i.solves} />
            ))}
          </div>
        </section>
      ))}

      {!!d?.unclassified?.length && (
        <Card>
          <CardHeader><CardTitle className="text-base">Unclassified</CardTitle>
            <CardDescription>On disk but not described in the register. Listed rather than hidden.</CardDescription></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {d.unclassified.map((s: string) => (
                <Link key={s} href={`/dashboard/${s}`} className="rounded-full bg-muted px-3 py-1 font-mono text-[12px] hover:bg-muted/70">{s}</Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
