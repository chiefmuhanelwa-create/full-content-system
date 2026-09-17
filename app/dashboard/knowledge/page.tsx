'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Database, Save, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

type Key = { key: string; origin: string; updatedAt: string | null; value: any }

export default function KnowledgePage() {
  const [keys, setKeys] = useState<Key[]>([])
  const [source, setSource] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  // import panel
  const [impKey, setImpKey] = useState('')
  const [impFormat, setImpFormat] = useState<'csv' | 'json' | 'lines'>('csv')
  const [impMode, setImpMode] = useState<'replace' | 'append' | 'merge'>('append')
  const [impBody, setImpBody] = useState('')

  const load = () =>
    fetch('/api/knowledge').then(r => r.json()).then(d => { setKeys(d.keys || []); setSource(d.source || '') })
  useEffect(() => { load() }, [])

  const open = (k: Key) => { setActive(k.key); setDraft(JSON.stringify(k.value, null, 2)); setMsg('') }

  const save = async () => {
    if (!active) return
    setBusy(true); setMsg('')
    try {
      const value = JSON.parse(draft)
      const r = await fetch('/api/knowledge', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: active, value, note: 'edited in Knowledge' }),
      })
      const j = await r.json()
      setMsg(j.error ? j.error : `Saved. ${j.note}`)
      if (!j.error) load()
    } catch (e: any) { setMsg(`Not valid JSON: ${e.message}`) }
    finally { setBusy(false) }
  }

  const doImport = async () => {
    if (!impKey || !impBody.trim()) return
    setBusy(true); setMsg('')
    try {
      const r = await fetch('/api/knowledge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: impKey, format: impFormat, content: impBody, mode: impMode, note: 'imported' }),
      })
      const j = await r.json()
      setMsg(j.error ? j.error : `Imported ${j.rowsImported} row(s) into ${j.key}. ${j.note}`)
      if (!j.error) { setImpBody(''); load() }
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="MODIFIABLE"
        title="Knowledge"
        description="Doctrine is data, not source code. Change it here and every tool reads the change on its next call — no deploy, no restart."
        icon={Database}
      />

      <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        Reading from <span className="font-mono font-semibold">{source}</span>. Keys marked
        <em> fallback</em> have never been edited — they come from the estate defaults compiled into the app.
        Every write snapshots the previous value into <span className="font-mono">ingest_logs</span>.
      </p>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader><CardTitle className="text-base">Keys</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {keys.map(k => (
              <button key={k.key} onClick={() => open(k)}
                className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition ${active === k.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                <span className="font-mono font-semibold">{k.key}</span>
                <span className={`mt-0.5 block text-[11px] ${active === k.key ? 'opacity-80' : 'text-muted-foreground'}`}>
                  {k.origin}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{active ? <span className="font-mono">{active}</span> : 'Pick a key'}</CardTitle>
              <CardDescription>Edit the JSON directly. Shape is normalised on read, so extra fields are safe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea value={draft} onChange={e => setDraft(e.target.value)}
                placeholder="Select a key on the left…"
                className="min-h-[300px] font-mono text-[12px] leading-relaxed" />
              <Button onClick={save} disabled={busy || !active}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Upload className="h-4 w-4" />Import new data</CardTitle>
              <CardDescription>Paste a CSV, JSON or a plain list. Quoted commas are handled — a naive split once read the wrong column and moved a ledger by R42,000.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <input value={impKey} onChange={e => setImpKey(e.target.value)} placeholder="target key e.g. search_demand"
                  className="flex-1 rounded-md border px-3 py-2 font-mono text-[13px]" />
                <select value={impFormat} onChange={e => setImpFormat(e.target.value as any)} className="rounded-md border px-3 py-2 text-[13px]">
                  <option value="csv">CSV</option><option value="json">JSON</option><option value="lines">Lines</option>
                </select>
                <select value={impMode} onChange={e => setImpMode(e.target.value as any)} className="rounded-md border px-3 py-2 text-[13px]">
                  <option value="append">Append</option><option value="merge">Merge</option><option value="replace">Replace</option>
                </select>
              </div>
              <Textarea value={impBody} onChange={e => setImpBody(e.target.value)}
                placeholder={'brand,quoted,received\nGrey Advertising,47500,47500'}
                className="min-h-[140px] font-mono text-[12px]" />
              <Button onClick={doImport} disabled={busy || !impKey || !impBody.trim()} variant="secondary">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Import
              </Button>
            </CardContent>
          </Card>

          {msg && (
            <div className="flex items-start gap-2 rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3 text-[13px]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /><span>{msg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
