'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Sparkles, Copy, Check, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface IdentifiedFear {
  fearId: number
  fearName: string
  relevanceScore: number
  reasoning: string
  hooks: string[]
  contentStrategy: string
}

interface PrimaryFear {
  fearId: number
  fearName: string
  reasoning: string
}

interface FearAnalysis {
  identifiedFears: IdentifiedFear[]
  primaryFear: PrimaryFear
  recommendedApproach: string
}

const SHADOW_FEARS = [
  'Fear of Invisibility',
  'Fear of Wasted Potential',
  'Fear of Being Left Behind',
  'Fear of Exposure (Impostor Syndrome)',
  'Fear of Permanent Mediocrity',
  'Fear of Missed Timing',
  'Fear of Being Forgotten',
  'Fear of Financial Dependency',
  'Fear of Creative Exhaustion',
  'Fear of Systemic Exclusion',
]

export default function FearAnalyzerPage() {
  const router = useRouter()
  const { addFear, setPendingAction } = useContent()

  const [audienceDescription, setAudienceDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FearAnalysis | null>(null)
  const [error, setError] = useState('')
  const [copiedHook, setCopiedHook] = useState<string | null>(null)

  const analyzeFears = async () => {
    if (!audienceDescription.trim()) { setError('Describe your target audience first'); return }
    setLoading(true)
    setError('')
    setAnalysis(null)
    try {
      const response = await fetch('/api/fears/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audienceDescription }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze fears')
      setAnalysis(data.analysis)
      data.analysis.identifiedFears.forEach((fear: IdentifiedFear) => {
        addFear({ id: fear.fearId, name: fear.fearName, relevance: fear.relevanceScore, hooks: fear.hooks, targetAudience: audienceDescription })
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyHook = (hook: string) => {
    navigator.clipboard.writeText(hook)
    setCopiedHook(hook)
    setTimeout(() => setCopiedHook(null), 2000)
  }

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-700 border-red-200'
    if (score >= 60) return 'bg-[#FFF3E8] text-[#9A3A12] border-[#F2701E]/30'
    return 'bg-[#F9FAFB] text-[#1D4ED8] border-[#2563EB]/30'
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Brain}
        iconColor="text-red-500"
        eyebrow="Audience"
        title="Fear Analyzer"
        description="Identify the 10 Shadow Fears driving your audience — then generate fear-targeted hooks and content angles."
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="space-y-5">
            <div className="nc-tool-section space-y-5">
              <div>
                <p className="nc-eyebrow mb-0.5">Input</p>
                <h2 className="font-display font-black text-[#18181B] text-lg leading-none">Describe Your Audience</h2>
              </div>

              <div className="nc-form-row">
                <label htmlFor="audience">Audience Description</label>
                <textarea
                  id="audience"
                  className="nc-tool-input min-h-[220px] resize-y"
                  placeholder="African creators aged 25–35 who are stuck at 10K followers. They post daily but get no engagement. They've tried courses and coaching but still broke. Working 9–5 jobs they hate, want financial freedom but don't know how to monetise their knowledge..."
                  value={audienceDescription}
                  onChange={(e) => setAudienceDescription(e.target.value)}
                />
                <p className="nc-helper">Include: demographics, pain points, goals, current situation, frustrations</p>
              </div>

              {error && <div className="nc-error flex items-center gap-2"><AlertCircle className="h-4 w-4 flex-shrink-0" />{error}</div>}

              <button onClick={analyzeFears} disabled={loading || !audienceDescription.trim()} className="nc-generate-btn">
                {loading ? <><Sparkles className="h-4 w-4 animate-spin" /> Analysing Shadow Fears...</> : <><Brain className="h-4 w-4" /> Analyse Shadow Fears</>}
              </button>
            </div>

            {/* 10 Shadow Fears reference */}
            <div className="nc-panel p-5">
              <p className="nc-eyebrow mb-3">Reference</p>
              <p className="font-display font-bold text-[#18181B] text-sm mb-3">The 10 Shadow Fears</p>
              <div className="space-y-1.5">
                {SHADOW_FEARS.map((fear, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB]/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-display font-black text-[#1D4ED8]">{i + 1}</span>
                    </span>
                    <p className="text-[13px] text-[#18181B] font-display font-semibold">{fear}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {analysis ? (
              <div className="space-y-4">
                {/* Primary fear */}
                <div className="nc-result-card border-l-4 border-l-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <p className="nc-eyebrow text-red-500">Primary Fear</p>
                  </div>
                  <p className="font-display font-black text-[#18181B] text-base mb-2">{analysis.primaryFear.fearName}</p>
                  <p className="text-[13px] text-[#52525B] leading-relaxed">{analysis.primaryFear.reasoning}</p>
                </div>

                {/* Recommended approach */}
                <div className="nc-panel p-5">
                  <p className="nc-eyebrow mb-2">Strategy</p>
                  <p className="font-display font-bold text-[#18181B] text-sm mb-2">Recommended Approach</p>
                  <p className="text-[13px] text-[#52525B] leading-relaxed">{analysis.recommendedApproach}</p>
                </div>

                {/* All identified fears */}
                <div>
                  <p className="font-display font-black text-[#18181B] text-base mb-3">
                    Identified Fears ({analysis.identifiedFears.length})
                  </p>
                  <div className="space-y-3">
                    {analysis.identifiedFears
                      .sort((a, b) => b.relevanceScore - a.relevanceScore)
                      .map((fear, index) => (
                        <div key={index} className="nc-result-card space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-display font-bold text-[#18181B] text-sm">{fear.fearName}</p>
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-display font-black tracking-wide uppercase ${getScoreBadgeClass(fear.relevanceScore)}`}>
                                  {fear.relevanceScore}%
                                </span>
                              </div>
                              <p className="text-[12px] text-[#71717A]">{fear.reasoning}</p>
                            </div>
                            <button
                              onClick={() => {
                                const savedFear = addFear({ id: fear.fearId, name: fear.fearName, relevance: fear.relevanceScore, hooks: fear.hooks, targetAudience: audienceDescription })
                                setPendingAction({ action: 'target-fear-in-hooks', data: savedFear })
                                router.push('/dashboard/hooks')
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-[#52525B] hover:border-[#2563EB]/50 hover:text-[#18181B] transition-all text-[11px] font-display font-bold uppercase tracking-wide flex-shrink-0"
                            >
                              <ArrowRight className="h-3 w-3" /> Hooks
                            </button>
                          </div>

                          {/* Fear-targeted hooks */}
                          <div className="space-y-2">
                            <p className="label-nc">Fear-Targeted Hooks</p>
                            {fear.hooks.map((hook, hookIndex) => (
                              <div key={hookIndex} className="flex items-start gap-2 p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg group">
                                <p className="text-[13px] text-[#18181B] flex-1 leading-relaxed">{hook}</p>
                                <button
                                  onClick={() => copyHook(hook)}
                                  className="p-1 rounded text-[#B0A898] hover:text-[#2563EB] transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                >
                                  {copiedHook === hook ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Content strategy */}
                          <div className="p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg">
                            <p className="label-nc mb-1.5">Content Strategy</p>
                            <p className="text-[12px] text-[#52525B] leading-relaxed">{fear.contentStrategy}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E4E4E7] flex items-center justify-center mb-5">
                  <Brain className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="font-display font-black text-[#18181B] text-lg mb-2">No analysis yet</h3>
                <p className="text-[#71717A] text-sm max-w-xs">
                  Describe your audience on the left and hit Analyse — the 10 Shadow Fears that drive them will surface.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
