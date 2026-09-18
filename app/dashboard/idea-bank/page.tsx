'use client'

/**
 * The Idea Bank — 250 seeded ideas, tracked from idea to posted.
 *
 * Three views over one dataset: Bank (filterable list), Board (kanban by status),
 * Calendar (what is scheduled, by month). The pillar weighting is enforced by the
 * calendar mix, not by the bank — the bank is inventory.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Lightbulb, Search, Star, Check, Download, Calendar as CalIcon,
  LayoutGrid, List, X, ChevronLeft, ChevronRight, Trash2, Plus,
} from 'lucide-react'
import { BackButton } from '@/components/BackButton'

interface Idea {
  id: string
  title: string
  pillar: string
  sourceGroup: string
  tier: string
  status: string
  format: string
  spokenHook: string
  captionOpener: string
  painPoint: string
  cta: string
  script: string
  notes: string
  storyId: string
  evidence: string
  factlock: string
  starred: boolean
  scheduledFor: string | null
  postedAt: string | null
}

/** R16, 2026-09-17. The weights are ruled — the calendar mix is measured against them. */
const PILLARS = [
  { id: 'KEEP IT',         pct: 30, color: '#D4A82F', tier: 'CORE + ENTRY' },
  { id: 'PRICE IT',        pct: 25, color: '#2563EB', tier: 'CORE' },
  { id: 'OWN IT',          pct: 20, color: '#16A34A', tier: 'ENTRY + PREMIUM' },
  { id: 'BUILD IT ANYWAY', pct: 15, color: '#9333EA', tier: 'CORE' },
  { id: 'PROVE IT',        pct: 10, color: '#DC2626', tier: 'PREMIUM' },
]
const PC = (p: string) => PILLARS.find(x => x.id === p)?.color ?? '#A1A1AA'

const STATUSES = [
  { id: 'idea',     label: 'Idea',      color: '#A1A1AA' },
  { id: 'draft',    label: 'Draft',     color: '#0EA5E9' },
  { id: 'script',   label: 'Scripted',  color: '#2563EB' },
  { id: 'shoot',    label: 'Shoot',     color: '#F97316' },
  { id: 'edit',     label: 'Edit',      color: '#A855F7' },
  { id: 'schedule', label: 'Scheduled', color: '#0891B2' },
  { id: 'posted',   label: 'Posted',    color: '#22C55E' },
  { id: 'parked',   label: 'Parked',    color: '#71717A' },
]
const SC = (s: string) => STATUSES.find(x => x.id === s)?.color ?? '#A1A1AA'
const SL = (s: string) => STATUSES.find(x => x.id === s)?.label ?? s

const TIERS = ['FREE', 'ENTRY', 'CORE', 'PREMIUM']
const FORMATS = ['reel', 'carousel', 'story', 'email', 'post']

export default function IdeaBankPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [view, setView] = useState<'bank' | 'board' | 'calendar'>('bank')

  const [q, setQ] = useState('')
  const [fPillar, setFPillar] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fTier, setFTier] = useState('')
  const [starOnly, setStarOnly] = useState(false)

  const [sel, setSel] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<Idea | null>(null)
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [newTitle, setNewTitle] = useState('')

  const fetchIdeas = useCallback(async () => {
    try {
      const r = await fetch('/api/ideas')
      const j = await r.json()
      setIdeas(j.ideas ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchIdeas() }, [fetchIdeas])

  async function seed() {
    setSeeding(true)
    try {
      await fetch('/api/ideas/seed', { method: 'POST' })
      await fetchIdeas()
    } finally { setSeeding(false) }
  }

  async function patch(id: string, data: Partial<Idea>) {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, ...data } as Idea : i)))
    setOpen(prev => (prev && prev.id === id ? { ...prev, ...data } as Idea : prev))
    await fetch('/api/ideas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
  }

  async function bulk(data: Partial<Idea>) {
    const ids = [...sel]
    setIdeas(prev => prev.map(i => (sel.has(i.id) ? { ...i, ...data } as Idea : i)))
    setSel(new Set())
    await Promise.all(ids.map(id =>
      fetch('/api/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
    ))
  }

  async function addIdea() {
    const title = newTitle.trim()
    if (!title) return
    setNewTitle('')
    await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, pillar: fPillar || 'KEEP IT' }),
    })
    fetchIdeas()
  }

  async function remove(id: string) {
    setIdeas(prev => prev.filter(i => i.id !== id))
    setOpen(null)
    await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' })
  }

  const filtered = useMemo(() => ideas.filter(i => {
    if (fPillar && i.pillar !== fPillar) return false
    if (fStatus && i.status !== fStatus) return false
    if (fTier && i.tier !== fTier) return false
    if (starOnly && !i.starred) return false
    if (q) {
      const hay = `${i.title} ${i.painPoint} ${i.spokenHook} ${i.sourceGroup}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  }), [ideas, q, fPillar, fStatus, fTier, starOnly])

  /* Scheduled + posted pieces, measured against the ruled weighting. */
  const mix = useMemo(() => {
    const live = ideas.filter(i => i.status === 'schedule' || i.status === 'posted')
    return PILLARS.map(p => {
      const n = live.filter(i => i.pillar === p.id).length
      return { ...p, n, actual: live.length ? Math.round((n / live.length) * 100) : 0 }
    })
  }, [ideas])

  const done = ideas.filter(i => i.status === 'posted').length
  const wip = ideas.filter(i => !['idea', 'posted', 'parked'].includes(i.status)).length

  if (loading) {
    return <div className="min-h-full flex items-center justify-center" style={{ background: '#F8F9FA' }}>
      <p className="text-sm" style={{ color: '#71717A' }}>Loading the bank…</p>
    </div>
  }

  return (
    <div className="min-h-full" style={{ background: '#F8F9FA' }}>
      <div className="px-6 pt-4 pb-2" style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7' }}>
        <BackButton />
      </div>

      {/* Header */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #E4E4E7', background: '#FFFFFF' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(212,168,47,0.10)', border: '1px solid rgba(212,168,47,0.30)' }}>
              <Lightbulb className="w-5 h-5" style={{ color: '#D4A82F' }} />
            </div>
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#D4A82F' }}>Ideation</p>
              <h1 className="text-xl font-display font-black tracking-tight leading-none" style={{ color: '#18181B' }}>The Idea Bank</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm" style={{ color: '#71717A' }}>
              <strong style={{ color: '#18181B' }}>{ideas.length}</strong> ideas · {wip} in production · {done} posted
            </p>
            {ideas.length === 0 && (
              <button onClick={seed} disabled={seeding}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-semibold"
                style={{ background: '#18181B', color: '#FFF' }}>
                <Download className="w-4 h-4" />{seeding ? 'Loading…' : 'Load the 250 ideas'}
              </button>
            )}
          </div>
        </div>

        {/* Pillar mix against the ruled weighting */}
        {ideas.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {mix.map(p => (
              <button key={p.id} onClick={() => setFPillar(fPillar === p.id ? '' : p.id)}
                className="px-3 py-1.5 rounded-lg text-left transition-all"
                style={{
                  background: fPillar === p.id ? p.color : `${p.color}12`,
                  border: `1px solid ${p.color}${fPillar === p.id ? '' : '33'}`,
                  color: fPillar === p.id ? '#FFF' : '#18181B',
                }}>
                <span className="text-xs font-display font-bold">{p.id}</span>
                <span className="text-[11px] ml-2 opacity-70">
                  {p.actual}% / {p.pct}% ruled
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 flex gap-2 flex-wrap items-center"
           style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A1A1AA' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ideas, pain, hooks…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }} />
        </div>

        <select value={fStatus} onChange={e => setFStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm font-display outline-none"
          style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>

        <select value={fTier} onChange={e => setFTier(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm font-display outline-none"
          style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
          <option value="">All tiers</option>
          {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <button onClick={() => setStarOnly(s => !s)}
          className="px-3 py-2 rounded-lg text-sm font-display inline-flex items-center gap-1.5"
          style={{
            background: starOnly ? '#D4A82F' : '#F8F9FA',
            border: '1px solid ' + (starOnly ? '#D4A82F' : '#E4E4E7'),
            color: starOnly ? '#FFF' : '#71717A',
          }}>
          <Star className="w-3.5 h-3.5" fill={starOnly ? '#FFF' : 'none'} />Starters
        </button>

        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #E4E4E7' }}>
          {([['bank', List], ['board', LayoutGrid], ['calendar', CalIcon]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-2"
              style={{ background: view === v ? '#18181B' : '#FFF', color: view === v ? '#FFF' : '#71717A' }}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Bulk bar */}
      {sel.size > 0 && (
        <div className="px-6 py-2.5 flex gap-2 items-center flex-wrap" style={{ background: '#18181B' }}>
          <span className="text-sm font-display font-semibold" style={{ color: '#FFF' }}>{sel.size} selected</span>
          <span className="text-xs" style={{ color: '#A1A1AA' }}>move to</span>
          {STATUSES.map(s => (
            <button key={s.id} onClick={() => bulk({ status: s.id })}
              className="px-2.5 py-1 rounded-md text-xs font-display font-semibold"
              style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}55` }}>
              {s.label}
            </button>
          ))}
          <button onClick={() => setSel(new Set())} className="ml-auto text-xs" style={{ color: '#A1A1AA' }}>Clear</button>
        </div>
      )}

      <div className="p-6">
        {/* ── BANK ─────────────────────────────────────────── */}
        {view === 'bank' && (
          <>
            <div className="flex gap-2 mb-4">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addIdea()}
                placeholder="Add an idea of your own…"
                className="flex-1 px-3 py-2 rounded-lg text-sm font-display outline-none"
                style={{ background: '#FFF', border: '1px solid #E4E4E7', color: '#18181B' }} />
              <button onClick={addIdea} className="px-3 py-2 rounded-lg inline-flex items-center gap-1.5 text-sm font-display font-semibold"
                style={{ background: '#18181B', color: '#FFF' }}><Plus className="w-4 h-4" />Add</button>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ background: '#FFF', border: '1px solid #E4E4E7' }}>
              {filtered.length === 0 && (
                <p className="p-8 text-center text-sm" style={{ color: '#71717A' }}>
                  {ideas.length === 0 ? 'The bank is empty. Load the 250 ideas above.' : 'Nothing matches those filters.'}
                </p>
              )}
              {filtered.map((i, idx) => (
                <div key={i.id}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#FAFAFA]"
                  style={{ borderTop: idx ? '1px solid #F1F1F3' : 'none' }}
                  onClick={() => setOpen(i)}>
                  <button onClick={e => {
                    e.stopPropagation()
                    setSel(p => { const n = new Set(p); n.has(i.id) ? n.delete(i.id) : n.add(i.id); return n })
                  }}
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ border: `1.5px solid ${sel.has(i.id) ? '#18181B' : '#D4D4D8'}`, background: sel.has(i.id) ? '#18181B' : 'transparent' }}>
                    {sel.has(i.id) && <Check className="w-3 h-3" style={{ color: '#FFF' }} />}
                  </button>

                  <button onClick={e => { e.stopPropagation(); patch(i.id, { starred: !i.starred }) }} className="shrink-0">
                    <Star className="w-3.5 h-3.5" style={{ color: i.starred ? '#D4A82F' : '#D4D4D8' }} fill={i.starred ? '#D4A82F' : 'none'} />
                  </button>

                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PC(i.pillar) }} />
                  <span className="text-sm font-display flex-1 min-w-0 truncate" style={{ color: '#18181B' }}>{i.title}</span>

                  {i.scheduledFor && (
                    <span className="text-[10px] font-display shrink-0" style={{ color: '#0891B2' }}>
                      {new Date(i.scheduledFor).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="text-[10px] font-display px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: '#F4F4F5', color: '#71717A' }}>{i.tier}</span>
                  <span className="text-[10px] font-display font-semibold px-2 py-0.5 rounded shrink-0"
                    style={{ background: `${SC(i.status)}18`, color: SC(i.status) }}>{SL(i.status)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#A1A1AA' }}>
              Showing {filtered.length} of {ideas.length}. The bank is inventory — the pillar
              weighting is enforced by what you schedule, not by what sits here.
            </p>
          </>
        )}

        {/* ── BOARD ────────────────────────────────────────── */}
        {view === 'board' && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STATUSES.map(s => {
              const col = filtered.filter(i => i.status === s.id)
              return (
                <div key={s.id} className="shrink-0 w-[260px] rounded-xl p-3"
                     style={{ background: '#FFF', border: '1px solid #E4E4E7' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs font-display font-bold" style={{ color: '#18181B' }}>{s.label}</span>
                    <span className="text-xs ml-auto" style={{ color: '#A1A1AA' }}>{col.length}</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[62vh] overflow-y-auto">
                    {col.map(i => (
                      <button key={i.id} onClick={() => setOpen(i)}
                        className="text-left p-2.5 rounded-lg hover:shadow-sm transition-shadow"
                        style={{ background: '#FAFAFA', border: '1px solid #EFEFF1' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: PC(i.pillar) }} />
                          <span className="text-[9px] font-display font-bold uppercase tracking-wide" style={{ color: PC(i.pillar) }}>{i.pillar}</span>
                        </div>
                        <p className="text-[13px] font-display leading-snug" style={{ color: '#18181B' }}>{i.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── CALENDAR ─────────────────────────────────────── */}
        {view === 'calendar' && (() => {
          const y = month.getFullYear(), m = month.getMonth()
          const first = new Date(y, m, 1).getDay()
          const days = new Date(y, m + 1, 0).getDate()
          const cells: (number | null)[] = [
            ...Array(first).fill(null),
            ...Array.from({ length: days }, (_, k) => k + 1),
          ]
          const onDay = (d: number) => ideas.filter(i =>
            i.scheduledFor && new Date(i.scheduledFor).toDateString() === new Date(y, m, d).toDateString())

          return (
            <div className="rounded-xl p-4" style={{ background: '#FFF', border: '1px solid #E4E4E7' }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setMonth(new Date(y, m - 1, 1))} className="p-1.5 rounded-lg" style={{ border: '1px solid #E4E4E7' }}>
                  <ChevronLeft className="w-4 h-4" style={{ color: '#71717A' }} />
                </button>
                <p className="text-sm font-display font-bold" style={{ color: '#18181B' }}>
                  {month.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
                </p>
                <button onClick={() => setMonth(new Date(y, m + 1, 1))} className="p-1.5 rounded-lg" style={{ border: '1px solid #E4E4E7' }}>
                  <ChevronRight className="w-4 h-4" style={{ color: '#71717A' }} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <p key={d} className="text-[10px] font-display font-bold text-center py-1" style={{ color: '#A1A1AA' }}>{d}</p>
                ))}
                {cells.map((d, k) => (
                  <div key={k} className="min-h-[74px] rounded-lg p-1.5"
                       style={{ background: d ? '#FAFAFA' : 'transparent', border: d ? '1px solid #F1F1F3' : 'none' }}>
                    {d && <>
                      <p className="text-[10px] font-display mb-1" style={{ color: '#A1A1AA' }}>{d}</p>
                      {onDay(d).map(i => (
                        <button key={i.id} onClick={() => setOpen(i)}
                          className="block w-full text-left text-[9px] font-display px-1 py-0.5 rounded mb-0.5 truncate"
                          style={{ background: `${PC(i.pillar)}1A`, color: PC(i.pillar) }}>
                          {i.title}
                        </button>
                      ))}
                    </>}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#A1A1AA' }}>
                Measured rule from the account audit: <strong>4 posts a week, not 35 a month.</strong> Never Friday
                (index 0.76). Saturday is the highest day at 1.08.
              </p>
            </div>
          )
        })()}
      </div>

      {/* ── DETAIL DRAWER ──────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.35)' }}
             onClick={() => setOpen(null)}>
          <div className="w-full max-w-[520px] h-full overflow-y-auto" style={{ background: '#FFF' }}
               onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 px-5 py-4 flex items-start gap-3"
                 style={{ background: '#FFF', borderBottom: '1px solid #E4E4E7' }}>
              <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: PC(open.pillar) }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-display font-bold uppercase tracking-wide" style={{ color: PC(open.pillar) }}>
                  {open.pillar} · {open.tier}
                </p>
                <h2 className="text-base font-display font-bold leading-snug" style={{ color: '#18181B' }}>{open.title}</h2>
                <p className="text-[11px] mt-0.5" style={{ color: '#A1A1AA' }}>from “{open.sourceGroup}”</p>
              </div>
              <button onClick={() => setOpen(null)}><X className="w-5 h-5" style={{ color: '#A1A1AA' }} /></button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* status + format */}
              <div>
                <p className="text-[11px] font-display font-bold uppercase tracking-wide mb-2" style={{ color: '#71717A' }}>Status</p>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUSES.map(s => (
                    <button key={s.id} onClick={() => patch(open.id, { status: s.id })}
                      className="px-2.5 py-1 rounded-md text-xs font-display font-semibold"
                      style={{
                        background: open.status === s.id ? s.color : `${s.color}14`,
                        color: open.status === s.id ? '#FFF' : s.color,
                        border: `1px solid ${s.color}${open.status === s.id ? '' : '44'}`,
                      }}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <select value={open.pillar} onChange={e => patch(open.id, { pillar: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-display outline-none"
                  style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
                  {PILLARS.map(p => <option key={p.id}>{p.id}</option>)}
                </select>
                <select value={open.tier} onChange={e => patch(open.id, { tier: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-display outline-none"
                  style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
                  {TIERS.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={open.format} onChange={e => patch(open.id, { format: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-display outline-none"
                  style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }}>
                  {FORMATS.map(f => <option key={f}>{f}</option>)}
                </select>
                <input type="date"
                  value={open.scheduledFor ? new Date(open.scheduledFor).toISOString().slice(0, 10) : ''}
                  onChange={e => patch(open.id, { scheduledFor: e.target.value || null } as Partial<Idea>)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-display outline-none"
                  style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }} />
              </div>

              <Field label="Spoken hook — second person, accuses the viewer"
                value={open.spokenHook} rows={2}
                onSave={v => patch(open.id, { spokenHook: v })} />
              <Field label="Caption opener — your own loss, with a figure"
                value={open.captionOpener} rows={2}
                onSave={v => patch(open.id, { captionOpener: v })} />
              <Field label="Pain point — their words, not yours"
                value={open.painPoint} rows={2}
                onSave={v => patch(open.id, { painPoint: v })} />
              <Field label="CTA keyword" value={open.cta} rows={1}
                onSave={v => patch(open.id, { cta: v })} />
              <Field label="Script" value={open.script} rows={10}
                onSave={v => patch(open.id, { script: v })} />
              <Field label="Story ID" value={open.storyId} rows={1}
                onSave={v => patch(open.id, { storyId: v })} />
              <Field label="Evidence — the source that makes this true"
                value={open.evidence} rows={2}
                onSave={v => patch(open.id, { evidence: v })} />
              <Field label="Notes" value={open.notes} rows={3}
                onSave={v => patch(open.id, { notes: v })} />

              <button onClick={() => remove(open.id)}
                className="self-start inline-flex items-center gap-1.5 text-xs font-display mt-2"
                style={{ color: '#DC2626' }}>
                <Trash2 className="w-3.5 h-3.5" />Delete this idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Textarea that only writes on blur, so typing never fires a request per keystroke. */
function Field({ label, value, rows, onSave }:
  { label: string; value: string; rows: number; onSave: (v: string) => void }) {
  const [v, setV] = useState(value)
  useEffect(() => { setV(value) }, [value])
  return (
    <div>
      <p className="text-[11px] font-display font-bold uppercase tracking-wide mb-1.5" style={{ color: '#71717A' }}>{label}</p>
      <textarea value={v} rows={rows}
        onChange={e => setV(e.target.value)}
        onBlur={() => { if (v !== value) onSave(v) }}
        className="w-full px-3 py-2 rounded-lg text-sm font-display outline-none resize-y"
        style={{ background: '#F8F9FA', border: '1px solid #E4E4E7', color: '#18181B' }} />
    </div>
  )
}
