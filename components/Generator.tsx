'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Copy, AlertTriangle, Database } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { icon as resolveIcon } from '@/components/icon-map'
import type { GenSpec } from '@/lib/generators/specs'

/** Renders any JSON result readably without knowing its shape in advance. */
function Value({ v, depth = 0 }: { v: any; depth?: number }) {
  if (v == null) return <span className="text-muted-foreground">—</span>
  if (typeof v === 'string') return <span className="whitespace-pre-wrap leading-relaxed">{v}</span>
  if (typeof v === 'number' || typeof v === 'boolean') return <span className="font-mono">{String(v)}</span>
  if (Array.isArray(v)) {
    return (
      <div className="space-y-2">
        {v.map((x, i) => (
          <div key={i} className={depth === 0 ? 'rounded-lg border p-3' : ''}>
            <Value v={x} depth={depth + 1} />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      {Object.entries(v).map(([k, x]) => (
        <div key={k} className="grid grid-cols-[112px_1fr] gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</span>
          <div className="text-[13px]"><Value v={x} depth={depth + 1} /></div>
        </div>
      ))}
    </div>
  )
}

export function Generator({ spec, iconName }: { spec: GenSpec; iconName: string }) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(spec.fields.map(f => [f.name, f.type === 'select' ? (f.options?.[0] ?? '') : ''])),
  )
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)

  const run = async () => {
    setBusy(true); setD(null)
    try {
      const r = await fetch(`/api/gen/${spec.key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      setD(await r.json())
    } finally { setBusy(false) }
  }

  const ready = spec.fields.filter(f => !f.optional).every(f => String(form[f.name] ?? '').trim())

  return (
    <div className="space-y-6">
      <ToolPageHeader eyebrow={spec.eyebrow} title={spec.title} description={spec.description} icon={resolveIcon(iconName)} />

      <Card>
        <CardContent className="space-y-3 pt-6">
          {spec.fields.map(f => f.type === 'textarea' ? (
            <Textarea key={f.name} value={form[f.name]} placeholder={f.placeholder ?? f.label}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })} className="min-h-[84px]" />
          ) : f.type === 'select' ? (
            <label key={f.name} className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="text-[12px] font-medium text-muted-foreground">{f.label}</span>
              <select value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                className="rounded-md border bg-card px-3 py-2 text-[13px]">
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          ) : (
            <input key={f.name} value={form[f.name]} placeholder={f.placeholder ?? f.label}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              className="w-full rounded-md border bg-card px-3 py-2 text-[13px]" />
          ))}

          <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>The model does not choose {spec.grounding}. That comes from your seeded data — edit it in Knowledge.</span>
          </p>

          <Button onClick={run} disabled={busy || !ready}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Working…</> : `Run ${spec.title}`}
          </Button>
        </CardContent>
      </Card>

      {d?.error && (
        <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <p className="font-semibold">{d.error}</p>{d.fix && <p className="mt-1">{d.fix}</p>}
        </div>
      )}

      {d?.blocked && (
        <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-red-700" />
            {d.factLock.banned.length} banned claim{d.factLock.banned.length > 1 ? 's' : ''} survived. This does not ship.
          </p>
          {d.factLock.banned.map((b: any, i: number) => (
            <p key={i} className="mt-1.5"><b>{b.name}</b> — {b.fix}</p>
          ))}
        </div>
      )}

      {d?.composition && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-[12px]">
          <Database className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold">{d.composition.ratio}</span>
          <span className="text-muted-foreground">· from data: {d.composition.fromData}</span>
          {d.factLock?.clean && <Badge variant="secondary" className="ml-auto">fact-lock clean</Badge>}
        </div>
      )}

      {d?.result && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base">Result</CardTitle>
              <CardDescription>Everything written here was checked against the ledger.</CardDescription></div>
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(JSON.stringify(d.result, null, 2))}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent><Value v={d.result} /></CardContent>
        </Card>
      )}
    </div>
  )
}
