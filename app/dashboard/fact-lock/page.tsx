'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

type Hit = { name: string; fix: string; found: string[] }
type Result = { clean: boolean; banned: Hit[]; careful: Hit[]; verdict: string; caveat: string }

export default function FactLockPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [safe, setSafe] = useState<{ fig: string; note: string }[]>([])

  useEffect(() => {
    fetch('/api/fact-lock').then(r => r.json()).then(d => setSafe(d.safe || [])).catch(() => {})
  }, [])

  const check = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/fact-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="CHECK"
        title="Fact-Lock"
        description="Paste anything before it ships. A number without a receipt does not go out."
        icon={ShieldCheck}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">The draft</CardTitle>
            <CardDescription>Caption, script, email, carousel, sales page — anything.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the draft here…"
              className="min-h-[260px] font-mono text-[13px] leading-relaxed"
            />
            <div className="flex items-center gap-3">
              <Button onClick={check} disabled={loading || !text.trim()}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking…</> : 'Check it'}
              </Button>
              <span className="text-xs text-muted-foreground">
                {text.trim() ? `${text.trim().split(/\s+/).length} words` : ''}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verdict</CardTitle>
            <CardDescription>Every rule carries its replacement. A ban without an alternative gets ignored under deadline.</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Paste a draft and press Check.
              </p>
            )}

            {result && (
              <div className="space-y-3">
                <div className={`rounded-lg border-l-4 p-3 ${
                  result.banned.length ? 'border-l-red-600 bg-red-50'
                  : result.careful.length ? 'border-l-amber-500 bg-amber-50'
                  : 'border-l-green-600 bg-green-50'}`}>
                  <p className="text-sm font-semibold">{result.verdict}</p>
                </div>

                {result.banned.map((h, i) => (
                  <div key={i} className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3">
                    <p className="text-sm font-semibold flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-700" />
                      <span>{h.name}
                        <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                          found: {h.found.join(', ')}
                        </span>
                      </span>
                    </p>
                    <p className="mt-1.5 pl-6 text-[13px] leading-relaxed text-zinc-700">{h.fix}</p>
                  </div>
                ))}

                {result.careful.map((h, i) => (
                  <div key={i} className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3">
                    <p className="text-sm font-semibold">
                      {h.found.length} figure{h.found.length > 1 ? 's' : ''} to verify
                      <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                        {h.found.join(', ')}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-700">{h.fix}</p>
                  </div>
                ))}

                {result.clean && !result.careful.length && (
                  <div className="rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-700" />Nothing banned found
                    </p>
                  </div>
                )}

                <p className="pt-1 text-[12px] leading-relaxed text-muted-foreground">{result.caveat}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Safe to use, any time</CardTitle>
          <CardDescription>Every one of these has a row behind it.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {safe.map((s, i) => (
              <div key={i} className="grid grid-cols-[200px_1fr] gap-4 py-2.5 text-[13px]">
                <span className="font-mono font-semibold">{s.fig}</span>
                <span className="text-muted-foreground leading-relaxed">{s.note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
