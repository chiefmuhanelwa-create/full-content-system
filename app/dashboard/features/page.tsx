'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, AlertTriangle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const BLURB: Record<string, string> = {
  Content: 'Ideation, scripting, storytelling, hooks, captions, recording.',
  Tracking: 'What actually happened after you posted, and whether it hit its KPI.',
  Audience: 'Who they are, what they fear, what they search for.',
  Planning: 'Which pillar, which week, and what makes you come back.',
  Marketing: 'Email, copy, CTAs — the owned channel.',
  Brand: 'Rate cards, media kits, agency handling, deal tracking.',
  Financial: 'What arrived, what SARS is owed, what is actually yours.',
  Building: 'Products and offers.',
  Library: 'Everything kept — hooks, stories, scripts, IP.',
  Governance: 'The rules the whole system obeys, and the ability to change them.',
}

export default function FeaturesPage() {
  const [d, setD] = useState<any>(null)
  useEffect(() => { fetch('/api/features').then(r => r.json()).then(setD).catch(() => {}) }, [])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="THE SYSTEM"
        title="Features"
        description="Every tool, grouped by the job it does. This page reads the filesystem — it cannot advertise something that is not there."
        icon={LayoutGrid}
      />

      <div className="flex flex-wrap gap-4 rounded-lg bg-muted px-4 py-3 text-[13px]">
        <span><b className="font-mono">{d?.total ?? '—'}</b> features</span>
        <span><b className="font-mono">{d?.byCategory?.length ?? '—'}</b> categories</span>
        <span className={d?.healthy ? 'text-green-700' : 'text-red-700'}>
          {d?.healthy ? 'No dead links' : `${d?.advertisedButMissing?.length} advertised but missing`}
        </span>
      </div>

      {!!d?.advertisedButMissing?.length && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
          Listed in the register but not on disk: <span className="font-mono">{d.advertisedButMissing.join(', ')}</span>
        </p>
      )}

      {d?.byCategory?.map((g: any) => (
        <Card key={g.category}>
          <CardHeader>
            <CardTitle className="text-base">{g.category} <span className="ml-2 font-normal text-muted-foreground">{g.items.length}</span></CardTitle>
            <CardDescription>{BLURB[g.category]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.items.map((i: any) => (
                <Link key={i.slug} href={i.href}
                  className="rounded-lg border p-3 transition hover:border-foreground/30 hover:bg-muted/50">
                  <p className="flex items-center gap-2 text-[14px] font-semibold">
                    {i.name}
                    {i.pillar && <Badge variant="outline" className="text-[10px]">{i.pillar}</Badge>}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{i.solves}</p>
                  {i.stage && <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{i.stage}</p>}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {!!d?.unclassified?.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unclassified</CardTitle>
            <CardDescription>On disk but not yet described in the register. Listed rather than hidden.</CardDescription>
          </CardHeader>
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
