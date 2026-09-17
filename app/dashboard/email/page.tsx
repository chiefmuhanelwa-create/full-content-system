'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Mail, Loader2, Send, AlertTriangle, Copy } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']

export default function EmailPage() {
  const [ml, setMl] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [pillar, setPillar] = useState('KEEP IT')
  const [busy, setBusy] = useState(false)
  const [d, setD] = useState<any>(null)
  const [subject, setSubject] = useState('')
  const [groups, setGroups] = useState<string[]>([])
  const [pushed, setPushed] = useState<any>(null)

  useEffect(() => { fetch('/api/email').then(r => r.json()).then(setMl).catch(() => {}) }, [])

  const draft = async () => {
    if (!topic.trim()) return
    setBusy(true); setD(null); setPushed(null)
    try {
      const r = await fetch('/api/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'draft', topic, pillar }),
      })
      const j = await r.json()
      setD(j)
      if (j.email?.subjectLines?.[0]) setSubject(j.email.subjectLines[0])
    } finally { setBusy(false) }
  }

  const push = async () => {
    if (!d?.email || !subject) return
    setBusy(true)
    try {
      const r = await fetch('/api/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'push', subject, groupIds: groups,
          bodyHtml: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.65">${String(d.email.body).split('\n').map((l: string) => l.trim() ? `<p>${l}</p>` : '').join('')}</div>`,
        }),
      })
      setPushed(await r.json())
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="OWNED CHANNEL"
        title="Email"
        description="Social is acquisition. Email is the only channel nobody can switch off. Drafts push to MailerLite — nothing ever sends from here."
        icon={Mail}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted px-4 py-3 text-[13px]">
        <Badge variant={ml?.connected ? 'secondary' : 'outline'}>
          MailerLite {ml?.connected ? 'connected' : 'not connected'}
        </Badge>
        {ml?.connected && <span>{ml.groups?.length} groups · <b className="font-mono">{ml.totalActive}</b> active subscribers</span>}
        {ml?.error && <span className="text-red-700">{ml.error}</span>}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">What is this week about?</CardTitle>
          <CardDescription>One idea, one mechanism, one ask.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Why invoiced money is not income, and what to hold back the day it lands"
            className="min-h-[80px]" />
          <div className="flex flex-wrap gap-2">
            <select value={pillar} onChange={e => setPillar(e.target.value)} className="rounded-md border px-3 py-2 text-[13px]">
              {PILLARS.map(p => <option key={p}>{p}</option>)}
            </select>
            <Button onClick={draft} disabled={busy || !topic.trim()}>
              {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Writing…</> : 'Draft the email'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {d?.error && <p className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">{d.error}</p>}

      {d?.blocked && (
        <p className="flex items-start gap-2 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />{d.warning}
        </p>
      )}

      {d?.email && (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Subject lines</CardTitle>
              <CardDescription>Pick one. It becomes the campaign name in MailerLite.</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {d.email.subjectLines?.map((s: string) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-[13px] ${subject === s ? 'border-foreground bg-muted' : 'hover:bg-muted/50'}`}>
                  {s} <span className="ml-2 font-mono text-[11px] text-muted-foreground">{s.length}</span>
                </button>
              ))}
              <p className="pt-1 text-[12px] text-muted-foreground"><b>Preheader:</b> {d.email.preheader}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div><CardTitle className="text-base">Body</CardTitle>
                <CardDescription>CTA: {d.email.cta}</CardDescription></div>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(d.email.body)}><Copy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent><pre className="whitespace-pre-wrap font-serif text-[14px] leading-relaxed">{d.email.body}</pre></CardContent>
          </Card>

          {ml?.connected && (
            <Card>
              <CardHeader><CardTitle className="text-base">Push to MailerLite as a draft</CardTitle>
                <CardDescription>{ml.note}</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {ml.groups?.map((g: any) => (
                    <button key={g.id} onClick={() => setGroups(gr => gr.includes(g.id) ? gr.filter(x => x !== g.id) : [...gr, g.id])}
                      className={`rounded-full px-3 py-1.5 text-[12px] ${groups.includes(g.id) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
                      {g.name} <span className="font-mono opacity-70">{g.active}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={push} disabled={busy || !subject || d.blocked}>
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Create draft in MailerLite
                </Button>
                {pushed?.error && (
                  <div className="rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3 text-[13px]">
                    <p className="font-semibold">{pushed.error}</p>
                    {pushed.banned?.map((b: any, i: number) => <p key={i} className="mt-1">{b.name}: {b.found?.join(', ')}</p>)}
                  </div>
                )}
                {pushed?.success && <p className="rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3 text-[13px]">{pushed.note}</p>}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
