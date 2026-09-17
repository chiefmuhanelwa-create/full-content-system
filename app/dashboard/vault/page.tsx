'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Archive } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function VaultPage() {
  const [d, setD] = useState<any>(null)
  const [kind, setKind] = useState('all')
  const [q, setQ] = useState('')
  useEffect(() => { fetch('/api/vault').then(r => r.json()).then(setD).catch(() => {}) }, [])

  const items = (d?.items ?? []).filter((i: any) =>
    (kind === 'all' || i.kind === kind) &&
    (!q.trim() || String(i.title).toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="EVERYTHING KEPT"
        title="Vault"
        description="Every hook, script, story and shoot, read from the live tables — not a second copy that can drift."
        icon={Archive}
      />

      <div className="flex flex-wrap items-center gap-2">
        {['all', ...Object.keys(d?.byKind ?? {})].map(k => (
          <button key={k} onClick={() => setKind(k)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium capitalize transition ${kind === k ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
            {k}{k !== 'all' && <span className="ml-1.5 opacity-70">{d.byKind[k]}</span>}
          </button>
        ))}
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
          className="ml-auto w-56 rounded-md border bg-card px-3 py-1.5 text-[13px]" />
      </div>

      {d?.banks && (
        <p className="rounded-lg bg-muted px-4 py-2.5 text-[12px] text-muted-foreground">
          Banks: <b className="text-foreground">{d.banks.hookBank}</b> hooks · <b className="text-foreground">{d.banks.storyBank}</b> stories.
          The Story Bank holds 109 rows, 39 of them E1 — most have never shipped.
        </p>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">{items.length} items</CardTitle>
          <CardDescription>Newest first.</CardDescription></CardHeader>
        <CardContent>
          {!items.length && <p className="py-14 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
          <div className="divide-y">
            {items.map((i: any) => (
              <div key={i.kind + i.id} className="grid grid-cols-[74px_1fr_auto] items-center gap-3 py-2.5 text-[13px]">
                <Badge variant="outline" className="justify-center text-[10px] capitalize">{i.kind}</Badge>
                <span className="truncate">
                  {i.title}
                  {i.meta?.pillar && <Badge variant="secondary" className="ml-2 text-[10px]">{i.meta.pillar}</Badge>}
                  {i.meta?.verdict && <Badge className={`ml-2 text-[10px] ${i.meta.verdict === 'pass' ? 'bg-green-600' : 'bg-red-600'}`}>{i.meta.verdict}</Badge>}
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                  {new Date(i.at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
