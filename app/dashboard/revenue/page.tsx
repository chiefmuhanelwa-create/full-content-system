'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, AlertTriangle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const R = (n: any) => n == null ? '—' : 'R' + Math.round(Number(n)).toLocaleString('en-ZA')

/** No AI. Received, invoiced and contracted are kept apart on purpose. */
export default function RevenuePage() {
  const [deals, setDeals] = useState<any>(null)
  const [g, setG] = useState<any>(null)

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(setDeals).catch(() => {})
    fetch('/api/knowledge').then(r => r.json()).then(d => {
      const m: any = {}; for (const k of d.keys || []) m[k.key] = k.value; setG(m)
    }).catch(() => {})
  }, [])

  const led = g?.ledger_totals ?? {}
  const money = deals?.money ?? {}

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="KEEP IT"
        title="Revenue"
        description="What actually arrived. Never what was promised — those are different words and mixing them is how a figure gets invented."
        icon={Wallet}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: 'Lifetime received', v: R(led.lifetime?.zar ?? led.lifetime_received_zar), s: 'bank-confirmed, 27 of 55 rows' },
          { l: 'Meta remitted', v: led.meta?.usd ? '$' + Number(led.meta.usd).toLocaleString('en-ZA') : R(led.meta_remitted_usd), s: 'inward telegraphic transfers' },
          { l: 'Tracked this system', v: R(money.received), s: 'deals logged here' },
          { l: 'SARS reserve owed', v: R(money.reserveOwed), s: '35% of what arrived' },
        ].map(c => (
          <Card key={c.l}><CardContent className="pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.l}</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums">{c.v}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{c.s}</p>
          </CardContent></Card>
        ))}
      </div>

      {(led.warning || money.warning) && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 text-[13px] leading-relaxed">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <span>{led.warning ?? money.warning}</span>
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Not income yet</CardTitle>
            <CardDescription>Invoiced and contracted money has not arrived. Saying "I earned" of either is how R132,500 happened.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b py-2"><span>Invoiced, unpaid</span><b className="font-mono">{R(money.invoicedOutstanding)}</b></div>
            <div className="flex justify-between py-2"><span>Contracted, not invoiced</span><b className="font-mono">{R(money.contracted)}</b></div>
            {!!deals?.chase?.overdueCount && (
              <p className="rounded-lg bg-red-50 p-3">
                <b>{deals.chase.overdueCount} overdue.</b> {deals.chase.evidence}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">The SARS position</CardTitle>
            <CardDescription>Reserve on money that ARRIVED, the day it arrives.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b py-2">
              <span>Assessment</span><b className="font-mono">{R(led.sars?.zar ?? led.sars_assessment_zar)}</b>
            </div>
            <div className="flex justify-between border-b py-2"><span>Status</span><b>UNPAID</b></div>
            <div className="flex justify-between py-2"><span>Reserve rate</span><b className="font-mono">35%</b></div>
            <p className="rounded-lg bg-muted p-3 leading-relaxed">
              Never a penalty figure, never a final-debt figure, never a monthly amount or month count.
              Never rounded to R207K.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Logged deals</CardTitle>
          <CardDescription>Add and chase them in Brand Deals.</CardDescription></CardHeader>
        <CardContent>
          {!deals?.deals?.length && <p className="py-12 text-center text-sm text-muted-foreground">No deals logged yet.</p>}
          <div className="divide-y">
            {deals?.deals?.map((x: any) => (
              <div key={x.id} className="grid grid-cols-[1fr_92px_auto] items-center gap-3 py-2.5 text-[13px]">
                <span className="truncate font-semibold">{x.brand}</span>
                <span className="text-[11px] uppercase text-muted-foreground">{x.status}</span>
                <span className="font-mono tabular-nums">{R(x.receivedZar ?? x.invoicedZar ?? x.contractedZar ?? x.quotedZar)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
