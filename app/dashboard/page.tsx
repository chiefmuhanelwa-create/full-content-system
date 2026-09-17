'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FeatureTile, type Accent } from '@/components/FeatureTile'
import { icon } from '@/components/icon-map'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Clapperboard, ArrowRight } from 'lucide-react'

type Item = { slug: string; href: string; name: string; cat: string; pillar?: string; solves: string; stage?: string; icon: string; accent: Accent }
type Group = { category: string; items: Item[] }

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [total, setTotal] = useState(0)
  const [gov, setGov] = useState<any>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/features').then(r => r.json()).then(d => { setGroups(d.byCategory || []); setTotal(d.total || 0) }).catch(() => {})
    fetch('/api/knowledge').then(r => r.json()).then(d => {
      const m: any = {}; for (const k of d.keys || []) m[k.key] = k.value; setGov(m)
    }).catch(() => {})
  }, [])

  const term = q.trim().toLowerCase()
  const shown = term
    ? groups.map(g => ({ ...g, items: g.items.filter(i =>
        i.name.toLowerCase().includes(term) || i.solves.toLowerCase().includes(term) || (i.pillar || '').toLowerCase().includes(term)) }))
        .filter(g => g.items.length)
    : groups

  const pillars = gov?.pillars?.pillars ?? []
  const thisWeek = pillars[0]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Command centre</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Famous is not <span className="text-primary">paid</span>.
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          {total} tools, every one reading the same ruled doctrine. Change it once in Knowledge and
          every generator reads the change on its next call.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'This week', value: thisWeek?.k ?? '—', sub: thisWeek ? `${thisWeek.pct}% · sells to ${thisWeek.sells}` : 'seed the pillars' },
          { label: 'Post cadence', value: '4 / week', sub: '18:00–22:00 SAST · never Friday' },
          { label: 'Reel runtime', value: '90–105s', sub: 'above ~160s completion collapses' },
          { label: 'Best format', value: 'Carousel', sub: 'out-reaches reels 2.2× · no camera' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-xl font-bold">{s.value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { href: '/dashboard/batch-shoot', icon: Clapperboard, name: 'Start a batch', desc: 'One idea to a full shoot bundle with a KPI attached.' },
          { href: '/dashboard/fact-lock', icon: ShieldCheck, name: 'Check before it ships', desc: 'Paste anything. 24 rules, each carrying its replacement.' },
        ].map(a => (
          <Link key={a.href} href={a.href}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:border-foreground/25 hover:shadow-sm">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <a.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold">{a.name}</span>
              <span className="block text-[12px] text-muted-foreground">{a.desc}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search tools — try “rate”, “tax”, “PRICE IT”…"
          className="w-full rounded-lg border bg-card px-4 py-2.5 text-[14px] outline-none transition focus:border-primary/50"
        />
      </div>

      {shown.map(g => (
        <section key={g.category}>
          <div className="mb-3 flex items-baseline gap-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">{g.category}</h2>
            <span className="text-[12px] text-muted-foreground">{g.items.length}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map(i => (
              <FeatureTile
                key={i.slug} href={i.href} name={i.name}
                eyebrow={i.pillar ?? i.stage ?? i.cat}
                icon={icon(i.icon)} accent={i.accent} fact={i.solves}
              />
            ))}
          </div>
        </section>
      ))}

      {!shown.length && q && (
        <p className="py-16 text-center text-sm text-muted-foreground">Nothing matches “{q}”.</p>
      )}
    </div>
  )
}
