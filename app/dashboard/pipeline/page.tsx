'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Kanban, Plus, X, ChevronRight, FileText, MonitorPlay, Hash,
  Camera, Edit3, CheckSquare, Square, ExternalLink, Trash2,
  Save, AlertCircle, Zap
} from 'lucide-react'

interface PipelineCard {
  id: string
  title: string
  platform: string
  icp: string
  status: string
  interestPeak: string
  hook: string
  visualHook: string
  value: string
  cta: string
  rawFootageLink: string
  scheduledFor: string | null
  checkStrong: boolean
  checkVisual: boolean
  checkActionable: boolean
  checkWorthy: boolean
  createdAt: string
}

const STAGES = [
  { id: 'idea',      label: 'Idea',            color: '#4a4a5a', bg: '#1a1a1a',                 dot: '#4a4a5a' },
  { id: 'scripting', label: 'Scripting',        color: '#C9A84C', bg: 'rgba(201,168,76,0.08)',   dot: '#C9A84C' },
  { id: 'recording', label: 'Ready to Record',  color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',   dot: '#3b82f6' },
  { id: 'editing',   label: 'Editing',          color: '#f97316', bg: 'rgba(249,115,22,0.08)',   dot: '#f97316' },
  { id: 'ready',     label: 'Ready to Post',    color: '#a855f7', bg: 'rgba(168,85,247,0.08)',   dot: '#a855f7' },
  { id: 'posted',    label: 'Posted',           color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    dot: '#22c55e' },
]

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'linkedin', 'facebook', 'twitter']
const ICP_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'icp1', label: 'Called Expert (32–50)' },
  { value: 'icp2', label: 'Content Creator (18–35)' },
]
const INTEREST_PEAKS = [
  { value: '', label: 'Select type...' },
  { value: 'risk_reversal', label: 'Risk Reversal — nothing to lose' },
  { value: 'authority', label: 'Authority Endorsement — borrow credibility' },
  { value: 'controversial', label: 'Controversial — trigger an emotion' },
  { value: 'personal_story', label: 'Personal Story — social proof' },
  { value: 'negative_assumption', label: 'Negative Assumption — prove you\'re different' },
  { value: 'hype_up', label: 'Hype Up — maximum anticipation' },
  { value: 'call_out', label: 'Call Out — name what they\'re thinking' },
]

const STAGE_NEXT: Record<string, string> = {
  idea: 'scripting', scripting: 'recording', recording: 'editing', editing: 'ready', ready: 'posted', posted: 'posted'
}

const emptyCard = (): Omit<PipelineCard, 'id' | 'createdAt'> => ({
  title: '', platform: 'instagram', icp: 'auto', status: 'idea',
  interestPeak: '', hook: '', visualHook: '', value: '', cta: '',
  rawFootageLink: '', scheduledFor: null,
  checkStrong: false, checkVisual: false, checkActionable: false, checkWorthy: false,
})

export default function PipelinePage() {
  const router = useRouter()
  const [cards, setCards] = useState<PipelineCard[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [activeCard, setActiveCard] = useState<PipelineCard | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<PipelineCard>>({})
  const [saving, setSaving] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newStatus, setNewStatus] = useState('idea')

  useEffect(() => {
    fetch('/api/pipeline')
      .then(r => r.json())
      .then(d => setCards(d.cards || []))
      .finally(() => setLoading(false))
  }, [])

  const cardsForStage = (stageId: string) => cards.filter(c => c.status === stageId)

  const createCard = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), status: newStatus }),
      })
      const data = await res.json()
      if (data.card) {
        setCards(prev => [data.card, ...prev])
        setNewTitle('')
      }
    } finally {
      setCreating(false)
    }
  }

  const openCard = (card: PipelineCard) => {
    setActiveCard(card)
    setEditDraft({ ...card })
  }

  const saveCard = async () => {
    if (!activeCard) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pipeline/${activeCard.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      })
      const data = await res.json()
      if (data.card) {
        setCards(prev => prev.map(c => c.id === data.card.id ? data.card : c))
        setActiveCard(data.card)
        setEditDraft({ ...data.card })
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteCard = async (id: string) => {
    await fetch(`/api/pipeline/${id}`, { method: 'DELETE' })
    setCards(prev => prev.filter(c => c.id !== id))
    if (activeCard?.id === id) setActiveCard(null)
  }

  const moveToNext = async (card: PipelineCard) => {
    const next = STAGE_NEXT[card.status]
    if (next === card.status) return
    const res = await fetch(`/api/pipeline/${card.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    const data = await res.json()
    if (data.card) setCards(prev => prev.map(c => c.id === data.card.id ? data.card : c))
  }

  const toggleCheck = async (card: PipelineCard, field: keyof Pick<PipelineCard, 'checkStrong' | 'checkVisual' | 'checkActionable' | 'checkWorthy'>) => {
    const updated = { ...card, [field]: !card[field] }
    setCards(prev => prev.map(c => c.id === card.id ? updated : c))
    await fetch(`/api/pipeline/${card.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !card[field] }),
    })
    if (activeCard?.id === card.id) {
      setActiveCard(updated)
      setEditDraft(prev => ({ ...prev, [field]: !card[field] }))
    }
  }

  const openInScriptWriter = (card: PipelineCard) => {
    if (card.hook || card.value) {
      localStorage.setItem('scriptWriterPreload', JSON.stringify({
        topic: card.title,
        hook: card.hook,
        value: card.value,
        platform: card.platform,
        icp: card.icp,
      }))
    }
    router.push('/dashboard/scripts')
  }

  const openInTeleprompter = (card: PipelineCard) => {
    if (card.hook) {
      localStorage.setItem('teleprompterScript', [card.hook, card.value, card.cta].filter(Boolean).join('\n\n'))
    }
    router.push('/dashboard/teleprompter')
  }

  const openCaptionGenerator = (card: PipelineCard) => {
    if (card.hook || card.value) {
      localStorage.setItem('captionScriptPreload', [card.hook, card.value, card.cta].filter(Boolean).join('\n\n'))
    }
    router.push('/dashboard/captions')
  }

  const qualityScore = (card: PipelineCard) => {
    const checks = [card.checkStrong, card.checkVisual, card.checkActionable, card.checkWorthy]
    return checks.filter(Boolean).length
  }

  const stage = (stageId: string) => STAGES.find(s => s.id === stageId) || STAGES[0]

  return (
    <div className="min-h-full" style={{ background: '#0f0f0f' }}>

      {/* Header */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #1e1e1e', background: '#111' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <Kanban className="w-5 h-5" style={{ color: '#C9A84C' }} />
            </div>
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#C9A84C' }}>Planning</p>
              <h1 className="text-xl font-display font-black tracking-tight leading-none" style={{ color: '#FAF7F0' }}>Pipeline Board</h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#5a5a6a' }}>
            {cards.length} piece{cards.length !== 1 ? 's' : ''} in production
          </p>
        </div>

        {/* Quick add */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createCard()}
            placeholder="New content piece title..."
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
          />
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-display outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
          >
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button
            onClick={createCard}
            disabled={creating || !newTitle.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-bold transition-all"
            style={{ background: '#C9A84C', color: '#0f0f0f', opacity: creating || !newTitle.trim() ? 0.4 : 1 }}
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto px-6 py-6">
        <div className="flex gap-4 min-w-max">
          {STAGES.map(s => {
            const stageCards = cardsForStage(s.id)
            return (
              <div key={s.id} className="w-64 flex-shrink-0">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                  <span className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: s.dot }}>{s.label}</span>
                  <span className="text-[10px] font-display ml-auto px-1.5 py-0.5 rounded"
                    style={{ background: '#222', color: '#5a5a6a', border: '1px solid #2b2b2b' }}>
                    {stageCards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[120px] rounded-xl p-2" style={{ background: '#141414', border: '1px solid #1e1e1e' }}>
                  {loading && (
                    <div className="py-8 text-center text-xs" style={{ color: '#3a3a4a' }}>Loading...</div>
                  )}

                  {!loading && stageCards.length === 0 && (
                    <div className="py-8 text-center text-xs" style={{ color: '#3a3a4a' }}>Empty</div>
                  )}

                  {stageCards.map(card => {
                    const score = qualityScore(card)
                    const scoreColor = score === 4 ? '#22c55e' : score >= 2 ? '#C9A84C' : '#4a4a5a'
                    return (
                      <div
                        key={card.id}
                        className="pipeline-card p-3 rounded-lg"
                        onClick={() => openCard(card)}
                      >
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <p className="text-xs font-display font-semibold leading-tight line-clamp-2" style={{ color: '#FAF7F0' }}>
                            {card.title}
                          </p>
                          <button
                            onClick={e => { e.stopPropagation(); deleteCard(card.id) }}
                            className="flex-shrink-0 p-0.5 rounded transition-colors"
                            style={{ color: '#3a3a4a' }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Platform + ICP tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                            style={{ background: '#222', color: '#8a8a96', border: '1px solid #2b2b2b' }}>
                            {card.platform}
                          </span>
                          {card.interestPeak && (
                            <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                              style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
                              {card.interestPeak.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>

                        {/* Quality score */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="flex gap-0.5">
                            {[card.checkStrong, card.checkVisual, card.checkActionable, card.checkWorthy].map((c, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c ? scoreColor : '#2b2b2b' }} />
                            ))}
                          </div>
                          <span className="text-[9px] font-display" style={{ color: scoreColor }}>{score}/4</span>
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => openInScriptWriter(card)}
                            className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-display font-bold transition-all"
                            style={{ background: '#1e1e1e', color: '#8a8a96', border: '1px solid #2b2b2b' }}
                            title="Open in Script Writer"
                          >
                            <FileText className="w-2.5 h-2.5" /> Script
                          </button>
                          <button
                            onClick={() => openCaptionGenerator(card)}
                            className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-display font-bold transition-all"
                            style={{ background: '#1e1e1e', color: '#8a8a96', border: '1px solid #2b2b2b' }}
                            title="Generate Caption"
                          >
                            <Hash className="w-2.5 h-2.5" /> Caption
                          </button>
                          {s.id !== 'posted' && (
                            <button
                              onClick={() => moveToNext(card)}
                              className="flex items-center justify-center py-1 px-1.5 rounded text-[9px] font-display font-bold transition-all"
                              style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}
                              title="Move to next stage"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card detail panel */}
      {activeCard && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setActiveCard(null)} />
          <div className="w-full max-w-lg overflow-y-auto" style={{ background: '#111', borderLeft: '1px solid #2b2b2b' }}>

            {/* Panel header */}
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: '#111', borderBottom: '1px solid #1e1e1e' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: stage(activeCard.status).dot }} />
                <span className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: stage(activeCard.status).dot }}>
                  {stage(activeCard.status).label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveCard}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all"
                  style={{ background: '#C9A84C', color: '#0f0f0f', opacity: saving ? 0.6 : 1 }}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setActiveCard(null)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#5a5a6a' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Title */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>Title</label>
                <input
                  value={editDraft.title || ''}
                  onChange={e => setEditDraft(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display font-semibold outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                />
              </div>

              {/* Platform + ICP + Status */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Platform', key: 'platform', opts: PLATFORMS.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) })) },
                  { label: 'ICP', key: 'icp', opts: ICP_OPTIONS },
                  { label: 'Stage', key: 'status', opts: STAGES.map(s => ({ value: s.id, label: s.label })) },
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>{label}</label>
                    <select
                      value={(editDraft as any)[key] || ''}
                      onChange={e => setEditDraft(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-2 py-2 rounded-lg text-xs font-display outline-none"
                      style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                    >
                      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Interest Peak */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>Interest Peak Type</label>
                <select
                  value={editDraft.interestPeak || ''}
                  onChange={e => setEditDraft(p => ({ ...p, interestPeak: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-xs font-display outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                >
                  {INTEREST_PEAKS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Hook */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>
                  Hook <span style={{ color: '#3a3a4a' }}>— verbal opening line</span>
                </label>
                <textarea
                  value={editDraft.hook || ''}
                  onChange={e => setEditDraft(p => ({ ...p, hook: e.target.value }))}
                  rows={2}
                  placeholder="The first sentence that stops the scroll..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display outline-none resize-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                />
              </div>

              {/* Visual Hook */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#C9A84C' }}>Visual Hook</label>
                  <span className="text-[9px] font-display px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>Opening frame concept</span>
                </div>
                <textarea
                  value={editDraft.visualHook || ''}
                  onChange={e => setEditDraft(p => ({ ...p, visualHook: e.target.value }))}
                  rows={2}
                  placeholder="What the viewer SEES in the first frame — text overlay, action, thumbnail concept..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display outline-none resize-none"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.25)', color: '#FAF7F0' }}
                />
              </div>

              {/* Value */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>Value / Core Content</label>
                <textarea
                  value={editDraft.value || ''}
                  onChange={e => setEditDraft(p => ({ ...p, value: e.target.value }))}
                  rows={3}
                  placeholder="The lesson, framework, or story being taught..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display outline-none resize-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                />
              </div>

              {/* CTA */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>CTA</label>
                <input
                  value={editDraft.cta || ''}
                  onChange={e => setEditDraft(p => ({ ...p, cta: e.target.value }))}
                  placeholder="What should they do? Save, DM, click the link..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                />
              </div>

              {/* Quality Gate */}
              <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid #2b2b2b' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  <span className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: '#C9A84C' }}>R50 Quality Gate</span>
                  <span className="text-[9px] font-display ml-auto px-1.5 py-0.5 rounded"
                    style={{
                      background: qualityScore(activeCard) === 4 ? 'rgba(34,197,94,0.1)' : 'rgba(201,168,76,0.1)',
                      color: qualityScore(activeCard) === 4 ? '#22c55e' : '#C9A84C',
                      border: `1px solid ${qualityScore(activeCard) === 4 ? 'rgba(34,197,94,0.3)' : 'rgba(201,168,76,0.25)'}`,
                    }}>
                    {qualityScore(activeCard)}/4
                  </span>
                </div>
                {[
                  { field: 'checkStrong' as const, label: 'Strong Hook', desc: 'Does the first line stop the scroll cold?' },
                  { field: 'checkVisual' as const, label: 'Visual Hook', desc: 'Is there a clear opening frame concept?' },
                  { field: 'checkActionable' as const, label: 'Actionable in 24 Hours', desc: 'Can they apply something from this today?' },
                  { field: 'checkWorthy' as const, label: 'Worth R50', desc: 'Would someone pay R50 to watch this?' },
                ].map(({ field, label, desc }) => {
                  const checked = (editDraft as any)[field] ?? false
                  return (
                    <button
                      key={field}
                      onClick={() => {
                        const newVal = !checked
                        setEditDraft(p => ({ ...p, [field]: newVal }))
                        if (activeCard) toggleCheck({ ...activeCard, ...editDraft as PipelineCard, [field]: !checked }, field)
                      }}
                      className="w-full flex items-start gap-3 py-2.5 px-3 rounded-lg mb-1 text-left transition-all"
                      style={{ background: checked ? 'rgba(34,197,94,0.06)' : 'transparent', border: `1px solid ${checked ? 'rgba(34,197,94,0.2)' : '#2b2b2b'}` }}
                    >
                      {checked
                        ? <CheckSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                        : <Square className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#3a3a4a' }} />
                      }
                      <div>
                        <p className="text-xs font-display font-semibold" style={{ color: checked ? '#22c55e' : '#D4D4D8' }}>{label}</p>
                        <p className="text-[10px] font-display" style={{ color: '#5a5a6a' }}>{desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Raw footage link */}
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#5a5a6a' }}>Raw Footage Link</label>
                <input
                  value={editDraft.rawFootageLink || ''}
                  onChange={e => setEditDraft(p => ({ ...p, rawFootageLink: e.target.value }))}
                  placeholder="Drive / Dropbox / Frame.io link..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-display outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#FAF7F0' }}
                />
              </div>

              {/* Cross-tool actions */}
              <div className="rounded-xl p-4" style={{ background: '#141414', border: '1px solid #1e1e1e' }}>
                <p className="text-[10px] font-display font-bold uppercase tracking-wider mb-3" style={{ color: '#5a5a6a' }}>Open In</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openInScriptWriter(activeCard)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all"
                    style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#8a8a96' }}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[10px] font-display font-bold">Script Writer</span>
                  </button>
                  <button
                    onClick={() => openInTeleprompter(activeCard)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all"
                    style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#8a8a96' }}
                  >
                    <MonitorPlay className="w-4 h-4" />
                    <span className="text-[10px] font-display font-bold">Teleprompter</span>
                  </button>
                  <button
                    onClick={() => openCaptionGenerator(activeCard)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all"
                    style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', color: '#8a8a96' }}
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-[10px] font-display font-bold">Caption</span>
                  </button>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteCard(activeCard.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-display font-medium transition-all"
                style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
              >
                <Trash2 className="w-4 h-4" />
                Delete this card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
