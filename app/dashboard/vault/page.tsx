'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Archive, X, Copy, AlertTriangle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function VaultPage() {
  const [d, setD] = useState<any>(null)
  const [kind, setKind] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<any>(null)
  useEffect(() => { fetch('/api/vault').then(r => r.json()).then(setD).catch(() => {}) }, [])

  /** Outputs are held server-side, so the full text is fetched on demand rather than
   *  shipped for all 200 rows. Nothing here depends on this browser's memory. */
  const openItem = async (id: string) => {
    setOpen({ loading: true })
    const j = await fetch(`/api/vault?id=${id}`).then(r => r.json()).catch(() => null)
    setOpen(j?.generation ?? { error: true })
  }

  const items = (d?.items ?? []).filter((i: any) =>
    (kind === 'all' || i.kind === kind) &&
    (!q.trim() || String(i.title).toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="EVERYTHING KEPT"
        title="Vault"
        description="Every output this system has generated, written the moment it was produced. Survives refresh, logout and redeploy."
        icon={Archive}
      />

      {!!d?.generations && (
        <p className="rounded-lg border-l-4 border-l-emerald-600 bg-emerald-50 px-4 py-2.5 text-[12px]">
          <b>{d.generations}</b> generated outputs kept. Recorded server-side at generation time —
          not when anyone presses save, which is why the old tables sat empty.
        </p>
      )}

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
              <div key={i.kind + i.id}
                   onClick={() => i.meta?.generation && openItem(i.id)}
                   className={`grid grid-cols-[74px_1fr_auto] items-center gap-3 py-2.5 text-[13px] ${i.meta?.generation ? 'cursor-pointer hover:bg-muted/40' : ''}`}>
                <Badge variant="outline" className="justify-center text-[10px] capitalize">{i.kind}</Badge>
                <span className="truncate">
                  {i.title}
                  {i.meta?.pillar && <Badge variant="secondary" className="ml-2 text-[10px]">{i.meta.pillar}</Badge>}
                  {i.meta?.verdict && <Badge className={`ml-2 text-[10px] ${i.meta.verdict === 'pass' ? 'bg-green-600' : 'bg-red-600'}`}>{i.meta.verdict}</Badge>}
                  {i.meta?.blocked && <Badge className="ml-2 bg-red-600 text-[10px]">blocked</Badge>}
                  {i.meta?.repaired && <Badge variant="secondary" className="ml-2 text-[10px]">repaired</Badge>}
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                  {new Date(i.at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/35" onClick={() => setOpen(null)}>
          <div className="h-full w-full max-w-[640px] overflow-y-auto bg-background" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 flex items-start gap-3 border-b bg-background px-5 py-4">
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {open.tool} · {open.model}
                  {open.pillar && ` · ${open.pillar}`}
                  {open.ms ? ` · ${(open.ms / 1000).toFixed(1)}s` : ''}
                </p>
                <p className="text-sm font-semibold">
                  {open.createdAt ? new Date(open.createdAt).toLocaleString('en-ZA') : 'Loading…'}
                </p>
              </div>
              {open.output && (
                <button onClick={() => navigator.clipboard?.writeText(open.output)} className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setOpen(null)} className="p-1.5 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {open.blocked && (
                <p className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-[12px]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  This output was BLOCKED by the fact-lock at the time it was made. Kept as a record —
                  a bad output should be traceable to the doctrine that produced it, not quietly deleted.
                </p>
              )}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Asked</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-sans text-[12px] leading-relaxed">{open.input}</pre>
              </div>
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Produced</p>
                <pre className="whitespace-pre-wrap rounded-lg border p-3 font-sans text-[13px] leading-relaxed">{open.output}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
