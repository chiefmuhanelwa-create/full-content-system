'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Loader2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const R = (n: number) => 'R' + Math.round(n).toLocaleString('en-ZA')
const TABS = ['ratecard', 'mediakit', 'fit', 'reply', 'invoice'] as const
const LABEL: Record<string, string> = {
  ratecard: 'Rate Card', mediakit: 'Media Kit', fit: 'Should I take it?', reply: 'Reply to agency', invoice: 'Invoice + tax',
}

export default function BrandPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('ratecard')
  const [numbers, setNumbers] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [out, setOut] = useState<any>(null)
  const [f, setF] = useState({ brand: '', offer: '', deliverables: '', fee: '', thread: '', objective: '', amountZar: '' })

  useEffect(() => { fetch('/api/brand').then(r => r.json()).then(d => { setNumbers(d) }).catch(() => {}) }, [])

  const run = async () => {
    setBusy(true); setOut(null)
    try {
      const r = await fetch('/api/brand', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: tab, ...f, fee: f.fee ? Number(f.fee) : undefined, amountZar: f.amountZar ? Number(f.amountZar) : undefined }),
      })
      setOut(await r.json())
    } finally { setBusy(false) }
  }

  const field = (k: keyof typeof f, ph: string, big = false) => big
    ? <Textarea key={k} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={ph} className="min-h-[130px] text-[13px]" />
    : <input key={k} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={ph} className="w-full rounded-md border px-3 py-2 text-[13px]" />

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="BRAND COLLABS"
        title="Brand Engine"
        description="The agency asks for your rate card before it names a budget. An uncosted number becomes the ceiling on a budget you never see."
        icon={Briefcase}
      />

      {numbers?.numbers && (
        <div className="flex flex-wrap gap-4 rounded-lg bg-muted px-4 py-3 text-[13px]">
          <span><span className="text-muted-foreground">Followers</span> <b className="font-mono">{numbers.numbers.followers?.toLocaleString()}</b></span>
          {numbers.numbers.engagementRate && <span><span className="text-muted-foreground">ER</span> <b className="font-mono">{numbers.numbers.engagementRate}%</b></span>}
          {numbers.numbers.medianReach && <span><span className="text-muted-foreground">Median reach</span> <b className="font-mono">{numbers.numbers.medianReach.toLocaleString()}</b></span>}
          <span className="text-muted-foreground">{numbers.note}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setOut(null) }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
            {LABEL[t]}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{LABEL[tab]}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {tab === 'fit' && <>{field('brand', 'Brand name')}{field('offer', 'What are they offering?')}{field('deliverables', 'Deliverables')}{field('fee', 'Fee offered, in rands')}</>}
          {tab === 'reply' && <>{field('objective', 'Their stated campaign objective')}{field('fee', 'Your number, in rands (blank = derive it)')}{field('thread', 'Paste their email here', true)}</>}
          {tab === 'invoice' && <>{field('brand', 'Agency billing contact / brand')}{field('deliverables', 'Deliverables')}{field('amountZar', 'Amount, in rands')}</>}
          <Button onClick={run} disabled={busy}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Working…</> : LABEL[tab]}
          </Button>
        </CardContent>
      </Card>

      {out?.rateCard && (
        <div className="space-y-4">
          <p className="rounded-lg bg-muted p-3 text-[13px]">{out.rateCard.basis}</p>
          <Card>
            <CardHeader><CardTitle className="text-base">Core deliverables</CardTitle></CardHeader>
            <CardContent><div className="divide-y">
              {out.rateCard.core.map((c: any) => (
                <div key={c.deliverable} className="grid grid-cols-[1fr_auto] gap-4 py-2.5 text-[13px]">
                  <div><p className="font-semibold">{c.deliverable}</p><p className="text-muted-foreground">{c.note}</p></div>
                  <span className="font-mono font-bold tabular-nums">{R(c.zar)}</span>
                </div>
              ))}
            </div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Add-ons — where the money actually leaks</CardTitle>
              <CardDescription>Only 2 of 25 creators charge usage rights. Nine charge travel.</CardDescription></CardHeader>
            <CardContent><div className="divide-y">
              {out.rateCard.addOns.map((a: any) => (
                <div key={a.item} className="grid grid-cols-[1fr_auto] gap-4 py-2.5 text-[13px]">
                  <div><p className="font-semibold">{a.item}</p><p className="text-muted-foreground">{a.note}</p></div>
                  <span className="font-mono font-bold">+{a.pct}%</span>
                </div>
              ))}
            </div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Terms</CardTitle></CardHeader>
            <CardContent><ul className="list-disc space-y-1 pl-5 text-[13px]">
              {out.rateCard.terms.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
            <p className="mt-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 text-[13px]">{out.rateCard.floorRule}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {out?.decision && (
        <Card className={`border-l-4 ${out.decision.verdict === 'accept' ? 'border-l-green-600' : out.decision.verdict === 'reject' ? 'border-l-red-600' : 'border-l-amber-500'}`}>
          <CardHeader>
            <CardTitle className="text-base uppercase">{out.decision.verdict} <Badge variant="outline" className="ml-2">{out.decision.confidence} confidence</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[13px]">
            <ul className="list-disc space-y-1 pl-5">{out.decision.reasons?.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
            {!!out.decision.valueConflicts?.length && (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="font-semibold">Value conflicts</p>
                <ul className="list-disc pl-5">{out.decision.valueConflicts.map((v: string, i: number) => <li key={i}>{v}</li>)}</ul>
              </div>
            )}
            {out.decision.counterOffer && <p><b>Counter:</b> {out.decision.counterOffer}</p>}
            {out.decision.walkAwayLine && <p className="rounded-lg bg-muted p-3 italic">"{out.decision.walkAwayLine}"</p>}
          </CardContent>
        </Card>
      )}

      {(out?.mediaKit || out?.draft) && (
        <Card>
          <CardHeader><CardTitle className="text-base">{out.mediaKit ? 'Media kit' : 'Draft reply'}</CardTitle>
            {out.checklist && <CardDescription>They will also ask for: {out.checklist.join(' · ')}</CardDescription>}</CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{out.mediaKit || out.draft}</pre>
          </CardContent>
        </Card>
      )}

      {out?.invoice && (
        <Card>
          <CardHeader><CardTitle className="text-base">Invoice {out.invoice.number}</CardTitle>
            <CardDescription>{out.invoice.terms}</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b py-2"><span>Amount</span><b className="font-mono">{R(out.invoice.amountZar)}</b></div>
            <div className="flex justify-between border-b py-2"><span>SARS reserve (35%)</span><b className="font-mono text-amber-700">−{R(out.invoice.sarsReserve)}</b></div>
            <div className="flex justify-between py-2 text-[15px]"><span className="font-semibold">Take home</span><b className="font-mono">{R(out.invoice.takeHome)}</b></div>
            <p className="rounded-lg bg-amber-50 p-3">{out.invoice.reserveRule}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
