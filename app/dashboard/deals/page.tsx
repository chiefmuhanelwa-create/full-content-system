'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Handshake, Plus, AlertTriangle, Loader2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const R = (n: number | null | undefined) =>
  n == null ? '—' : 'R' + Math.round(n).toLocaleString('en-ZA')

export default function DealsPage() {
  const [d, setD] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ brand: '', agency: '', quotedZar: '', status: 'lead', deliverables: '' })

  const load = () => fetch('/api/deals').then(r => r.json()).then(setD).catch(() => {})
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.brand) return
    setBusy(true)
    try {
      await fetch('/api/deals', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quotedZar: form.quotedZar ? Number(form.quotedZar) : null }),
      })
      setForm({ brand: '', agency: '', quotedZar: '', status: 'lead', deliverables: '' })
      load()
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="MONEY"
        title="Brand Deals"
        description="Quoted, contracted, invoiced and received are four different things. This is the only place that keeps them apart."
        icon={Handshake}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Received', value: R(d?.money?.received), note: 'Money that actually arrived' },
          { label: 'SARS reserve owed', value: R(d?.money?.reserveOwed), note: '35% Rule, on received only' },
          { label: 'Invoiced, unpaid', value: R(d?.money?.invoicedOutstanding), note: 'Chase this' },
          { label: 'Contracted', value: R(d?.money?.contracted), note: 'Not income yet' },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{c.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{c.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {d?.money?.warning && (
        <p className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 text-[13px]">{d.money.warning}</p>
      )}

      {!!d?.chase?.overdueCount && (
        <Card className="border-l-4 border-l-red-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-700" />{d.chase.overdueCount} overdue
            </CardTitle>
            <CardDescription>{d.chase.evidence}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {d.chase.overdue.map((o: any) => (
              <div key={o.id} className="flex justify-between rounded bg-red-50 p-2 text-[13px]">
                <span className="font-semibold">{o.brand}</span>
                <span className="font-mono">{R(o.amount)} · due {String(o.dueAt).slice(0, 10)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Where the money leaks</CardTitle>
            <CardDescription>{d?.leaks?.benchmark}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b py-2">
              <span>Deals where you charged usage rights</span>
              <span className="font-mono font-semibold">{d?.leaks?.usageRightsCharged ?? 0} / {d?.count ?? 0}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span>Deals where you charged travel</span>
              <span className="font-mono font-semibold">{d?.leaks?.travelCharged ?? 0} / {d?.count ?? 0}</span>
            </div>
            {d?.leaks?.yourSpread && (
              <div className="flex justify-between py-2">
                <span>Your own quote spread</span>
                <span className="font-mono font-semibold">
                  {R(d.leaks.yourSpread.low)}–{R(d.leaks.yourSpread.high)} · {d.leaks.yourSpread.ratio}×
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Plus className="h-4 w-4" />Log a deal</CardTitle>
            <CardDescription>A deal that is not written down is priced from memory next time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {([['brand', 'Brand'], ['agency', 'Agency (optional)'], ['quotedZar', 'Quoted, in rands'], ['deliverables', 'Deliverables']] as const).map(([k, label]) => (
              <input key={k} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                placeholder={label} className="w-full rounded-md border px-3 py-2 text-[13px]" />
            ))}
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-[13px]">
              {['lead', 'quoted', 'contracted', 'invoiced', 'received', 'dead'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button onClick={add} disabled={busy || !form.brand}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Add
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All deals ({d?.count ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {!d?.deals?.length && <p className="py-10 text-center text-sm text-muted-foreground">Nothing logged yet.</p>}
          <div className="divide-y">
            {d?.deals?.map((x: any) => (
              <div key={x.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2.5 text-[13px]">
                <span className="font-semibold">{x.brand}{x.agency ? <span className="font-normal text-muted-foreground"> · {x.agency}</span> : null}</span>
                <Badge variant="outline">{x.status}</Badge>
                <span className="font-mono tabular-nums">{R(x.receivedZar ?? x.invoicedZar ?? x.contractedZar ?? x.quotedZar)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
