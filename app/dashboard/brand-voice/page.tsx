'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic, Loader2, Check, X } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function BrandVoicePage() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)

  const run = async () => {
    if (!text.trim()) return
    setBusy(true); setD(null)
    try {
      const r = await fetch('/api/voice-check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
      })
      setD(await r.json())
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="100% COMPUTED"
        title="Voice Check"
        description="Median sentence 5 words. 57.2% six or fewer. These are arithmetic, so they are measured here — no model is called."
        icon={Mic}
      />

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste a caption, script or email…" className="min-h-[180px]" />
          <Button onClick={run} disabled={busy || !text.trim()}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Measuring…</> : 'Measure it'}
          </Button>
        </CardContent>
      </Card>

      {d?.checks && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { l: 'Score', v: d.score + '%' }, { l: 'Median sentence', v: d.stats.medianSentence + 'w' },
              { l: 'Six or fewer', v: d.stats.sixOrFewerPct + '%' }, { l: 'Sentences', v: d.stats.sentences },
            ].map(c => (
              <Card key={c.l}><CardContent className="pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.l}</p>
                <p className="mt-1 font-mono text-xl font-bold">{c.v}</p>
              </CardContent></Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">{d.passed} of {d.total} passed</CardTitle>
              <CardDescription>{d.computed}</CardDescription></CardHeader>
            <CardContent>
              <div className="divide-y">
                {d.checks.map((c: any) => (
                  <div key={c.name} className="grid grid-cols-[22px_1fr_auto] items-start gap-3 py-2.5 text-[13px]">
                    {c.pass ? <Check className="mt-0.5 h-4 w-4 text-green-700" /> : <X className="mt-0.5 h-4 w-4 text-red-600" />}
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      {c.note && <p className="text-[12px] text-muted-foreground">{c.note}</p>}
                    </div>
                    <span className={`whitespace-nowrap font-mono text-[12px] ${c.pass ? 'text-muted-foreground' : 'font-semibold text-red-700'}`}>
                      {c.actual}<span className="text-muted-foreground"> / {c.target}</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">The opener</CardTitle>
              <CardDescription>Spoken hooks accuse the viewer. Captions open on his loss with a figure. Never reuse one as the other.</CardDescription></CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted p-3 text-[14px] font-medium">{d.opener.text}</p>
              <p className="mt-2 text-[13px] leading-relaxed">{d.opener.guidance}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
