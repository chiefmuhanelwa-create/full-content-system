'use client'

import { useState } from 'react'
import { BackButton } from '@/components/BackButton'
import { Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const ADVISORS = [
  {
    id: 'jesus',
    name: 'The Chairman',
    title: 'Kingdom Alignment · Covenant · Truth',
    description: 'Does this serve or exploit? Is this built on owned ground or rented? Will this produce fruit that lasts?',
    avatar: '✝',
    color: '#C9A84C',
    bgColor: '#FDF9EE',
    borderColor: '#C9A84C',
    lens: 'Kingdom Lens',
    question: 'From a kingdom alignment perspective...',
  },
  {
    id: 'selman',
    name: 'Apostle Joshua Selman',
    title: 'Apostolic Strategy · Spiritual Architecture · Kingdom Economics',
    description: 'Is this spiritually sequential? Does it equip or merely inspire? What is the apostolic mandate behind this?',
    avatar: 'JS',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#7C3AED',
    lens: 'Apostolic Lens',
    question: 'Is this spiritually sequential...',
  },
  {
    id: 'arokpo',
    name: 'Apostle Michael Arokpo',
    title: 'Systems Architecture · Operational Order · Scalable Delivery',
    description: 'Can this run without Ndivhuwo present? Is it documented? What is the operational cost per transformation?',
    avatar: 'MA',
    color: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#0F766E',
    lens: 'Systems Lens',
    question: 'Can this run without you...',
  },
  {
    id: 'dangote',
    name: 'Aliko Dangote',
    title: 'African Business Scale · Infrastructure · Long-Game Capital',
    description: 'What does this look like at 10× scale? Are we building infrastructure or performing? Is this a factory or a workshop?',
    avatar: 'AD',
    color: '#B45309',
    bgColor: '#FFFBEB',
    borderColor: '#B45309',
    lens: 'Scale Lens',
    question: 'At 10× scale, does this...',
  },
]

type AdvisorResponse = {
  advisor: string
  question: string
  response: string
}

export default function AdvisorsPage() {
  const [question, setQuestion] = useState('')
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<AdvisorResponse[]>([])
  const [error, setError] = useState('')
  const [expandedResponse, setExpandedResponse] = useState<number | null>(null)

  const handleConsult = async (advisorId: string) => {
    if (!question.trim()) {
      setError('Type your question or business decision first.')
      return
    }
    setError('')
    setLoading(true)
    setSelectedAdvisor(advisorId)

    try {
      const res = await fetch('/api/advisors/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), advisor: advisorId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Consultation failed')

      const advisor = ADVISORS.find(a => a.id === advisorId)
      setResponses(prev => [
        {
          advisor: advisor?.name || advisorId,
          question: question.trim(),
          response: data.response,
        },
        ...prev,
      ])
      setExpandedResponse(0)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setSelectedAdvisor(null)
    }
  }

  const handleAskAll = async () => {
    if (!question.trim()) {
      setError('Type your question or business decision first.')
      return
    }
    setError('')

    const newResponses: AdvisorResponse[] = []

    for (const advisor of ADVISORS) {
      setLoading(true)
      setSelectedAdvisor(advisor.id)
      try {
        const res = await fetch('/api/advisors/consult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: question.trim(), advisor: advisor.id }),
        })
        const data = await res.json()
        if (res.ok) {
          newResponses.push({
            advisor: advisor.name,
            question: question.trim(),
            response: data.response,
          })
        }
      } catch {
        // skip failed advisor
      }
    }

    setResponses(prev => [...newResponses, ...prev])
    setLoading(false)
    setSelectedAdvisor(null)
    setExpandedResponse(0)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: '#C9A84C', color: '#FFFFFF' }}>✝</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
                AI Board of Advisors
              </h1>
              <p className="text-sm" style={{ color: '#71717A' }}>
                Kingdom-aligned counsel before every major decision
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#FDF9EE', borderColor: '#C9A84C' }}>
            <p className="text-sm font-medium" style={{ color: '#92400E' }}>
              "For lack of guidance a nation falls, but victory is won through many advisers." — Proverbs 11:14
            </p>
            <p className="text-xs mt-1" style={{ color: '#B45309' }}>
              Run every major decision through at least one lens before executing. Jesus lens is always first.
            </p>
          </div>
        </div>

        {/* Question Input */}
        <div className="rounded-xl border p-5 mb-6" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
          <label className="block text-sm font-bold mb-2" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            Your decision or question
          </label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="E.g. 'Should I price the cohort at R9,997 or R18,000?' or 'Should I launch Series 1 or build more products first?' or 'Is it time to hire a VA?'"
            rows={4}
            className="w-full text-sm resize-none rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            style={{ borderColor: '#E4E4E7', color: '#18181B', background: '#FAFAFA' }}
          />
          {error && <p className="text-xs mt-2 text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={handleAskAll}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: '#18181B', color: '#FFFFFF' }}
            >
              {loading && !selectedAdvisor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Ask All Advisors
            </button>
          </div>
        </div>

        {/* Advisor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ADVISORS.map(advisor => (
            <div
              key={advisor.id}
              className="rounded-xl border p-5 flex flex-col"
              style={{ background: advisor.bgColor, borderColor: advisor.borderColor + '40' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: advisor.color, color: '#FFFFFF' }}
                >
                  {advisor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm leading-tight" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
                    {advisor.name}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: advisor.color }}>
                    {advisor.lens}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#52525B' }}>
                {advisor.description}
              </p>
              <button
                onClick={() => handleConsult(advisor.id)}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 border"
                style={{
                  background: selectedAdvisor === advisor.id ? advisor.color : '#FFFFFF',
                  color: selectedAdvisor === advisor.id ? '#FFFFFF' : advisor.color,
                  borderColor: advisor.color,
                }}
              >
                {loading && selectedAdvisor === advisor.id
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Consulting...</>
                  : `Consult ${advisor.name.split(' ')[0]}`
                }
              </button>
            </div>
          ))}
        </div>

        {/* Responses */}
        {responses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: '#71717A' }}>
              Board Counsel
            </h2>
            {responses.map((r, i) => {
              const advisorMeta = ADVISORS.find(a => a.name === r.advisor)
              const isExpanded = expandedResponse === i
              return (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden"
                  style={{
                    background: advisorMeta?.bgColor || '#FFFFFF',
                    borderColor: (advisorMeta?.color || '#C9A84C') + '40',
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4"
                    onClick={() => setExpandedResponse(isExpanded ? null : i)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background: advisorMeta?.color || '#C9A84C', color: '#FFFFFF' }}
                      >
                        {advisorMeta?.avatar || '?'}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#18181B' }}>
                          {r.advisor}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#71717A' }}>
                          {r.question.length > 60 ? r.question.slice(0, 60) + '…' : r.question}
                        </p>
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#A1A1AA' }} />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#A1A1AA' }} />
                    }
                  </button>
                  {isExpanded && (
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed border-t whitespace-pre-wrap"
                      style={{ color: '#27272A', borderColor: (advisorMeta?.color || '#C9A84C') + '20' }}
                    >
                      <div className="pt-4">
                        {r.response}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
