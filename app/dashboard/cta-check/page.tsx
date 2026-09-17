'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function CTACheckPage() {
  const [v, setV] = useState<any>(null)
  useEffect(() => { fetch('/api/governance?key=cta_keywords').then(r => r.json()).then(d => setV(d.value)).catch(() => {}) }, [])
  const pill = (s: string) => s === 'live'
    ? 'bg-green-50 text-green-700' : s === 'orphan' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
  const label = (s: string) => s === 'live' ? 'Resolves' : s === 'orphan' ? 'No destination' : 'Unverified'
  const orphans = v?.keywords?.filter((k: any) => k.status === 'orphan').length ?? 0

  return (
    <div className="space-y-6">
      <ToolPageHeader eyebrow="CHECK" title="CTA Check"
        description="A keyword with no destination converts nothing — and loses the comment." icon={Link2} />
      {v && (
        <>
          {orphans > 0 && (
            <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-4">
              <p className="text-sm font-semibold">⛔ {orphans} keywords land nowhere</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">{v.rule}</p>
            </div>
          )}
          <Card>
            <CardHeader><CardTitle className="text-base">The nine keywords</CardTitle>
              <CardDescription>Before any CTA is written — wire the destination, or reuse one that resolves.</CardDescription></CardHeader>
            <CardContent>
              <div className="divide-y">
                {v.keywords.map((k: any) => (
                  <div key={k.k} className="grid grid-cols-[110px_150px_1fr] items-center gap-4 py-3">
                    <span className="font-mono text-sm font-bold">{k.k}</span>
                    <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill(k.status)}`}>
                      {label(k.status)}{k.conversion ? ` · ${k.conversion}` : ''}
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">{k.note}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t pt-3 text-[12px] leading-relaxed text-muted-foreground">{v.suspended}</p>
            </CardContent>
          </Card>
        </>
      )}
      {!v && <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>}
    </div>
  )
}
