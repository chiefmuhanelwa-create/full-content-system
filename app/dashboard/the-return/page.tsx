'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCw } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function TheReturnPage() {
  const [pieces, setPieces] = useState<any[]>([])
  const [icp, setIcp] = useState<any>(null)
  useEffect(() => {
    fetch('/api/content-progress/list').then(r => r.json()).then(d => setPieces(d.items || d.pieces || [])).catch(() => {})
    fetch('/api/governance?key=icp').then(r => r.json()).then(d => setIcp(d.value)).catch(() => {})
  }, [])

  const posted = pieces.filter((p: any) => (p.status || '').toLowerCase() === 'posted' && p.postedAt)
  const last = posted.map((p: any) => p.postedAt).sort().reverse()[0]
  const days = last ? Math.floor((Date.now() - new Date(last).getTime()) / 864e5) : null
  const wip = pieces.filter((p: any) => (p.status || '').toLowerCase() !== 'posted').length
  const tone = days === null ? 'text-muted-foreground' : days > 7 ? 'text-red-600' : days > 3 ? 'text-amber-600' : 'text-green-600'

  return (
    <div className="space-y-6">
      <ToolPageHeader eyebrow="TRACK" title="The Return"
        description="The only thing that matters long-term: do you come back. Six channels say you do not." icon={RotateCw} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardDescription>Days since posting</CardDescription></CardHeader>
          <CardContent><p className={`text-4xl font-bold ${tone}`}>{days === null ? '—' : days}</p>
            <p className="mt-1 text-xs text-muted-foreground">{last ? `Last: ${String(last).slice(0, 10)}` : 'Nothing posted yet'}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>In progress</CardDescription></CardHeader>
          <CardContent><p className="text-4xl font-bold">{wip}<span className="text-lg text-muted-foreground"> / 4</span></p>
            <p className="mt-1 text-xs text-muted-foreground">Against the weekly target</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Posted, all time</CardDescription></CardHeader>
          <CardContent><p className="text-4xl font-bold">{posted.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">4 a week, not 35 a month</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Why this page exists</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3">
            <p className="text-sm font-semibold">Six channels. One shape.</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">
              Push, peak, stop. It happened on six independent channels. It happened to the agency roster —
              almost everything worth naming is one year. And it happened to the survey itself:
              <strong> 47 responses in six days, 21 across the next seven months.</strong>
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3">
            <p className="text-sm font-semibold">That is not an embarrassment. It is beat 4.</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">
              Nobody in this market can teach the return with a straighter face than the person who has failed
              at it in six documented places. <strong>He is not selling a discipline he mastered. He is selling
              the system he built after failing six times, with the receipts.</strong>
            </p>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm font-semibold">The mechanic</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Borrow a calendar that is not yours.</strong> Provisional tax has two statutory deadlines a
              year. SARS enforces the return so you do not have to. That is the strongest strategic argument in
              the Constitution — <em>prefer the model whose calendar enforces the return over the model that asks
              the founder to enforce it himself</em> — and it is why <strong>KEEP IT carries 30%</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {icp && (
        <Card>
          <CardHeader><CardTitle className="text-base">Who this is for</CardTitle>
            <CardDescription>Ruled {icp.ruled}</CardDescription></CardHeader>
          <CardContent>
            <p className="text-[15px] font-semibold">{icp.customer}</p>
            <div className="mt-3 divide-y">
              {icp.tiers.map((t: any) => (
                <div key={t.tier} className="grid grid-cols-[150px_1fr] gap-4 py-2.5 text-[13px]">
                  <span className="font-semibold">{t.tier} <span className="font-normal text-muted-foreground">{t.price}</span></span>
                  <span><strong>{t.name}</strong> — <span className="text-muted-foreground">{t.rule}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
