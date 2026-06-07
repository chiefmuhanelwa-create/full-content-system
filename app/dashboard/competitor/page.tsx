'use client'

import { useState } from 'react'
import { Users, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface CompetitorAnalysis {
  topHookPatterns: string[]
  contentGaps: string[]
  strengthsWeaknesses: { strengths: string[]; weaknesses: string[] }
  opportunities: string[]
}

export default function CompetitorPage() {
  const [competitorName, setCompetitorName] = useState('')
  const [competitorContent, setCompetitorContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!competitorContent.trim()) { alert('Paste competitor content samples first'); return }
    setLoading(true)
    try {
      const response = await fetch('/api/competitor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorName, content: competitorContent }),
      })
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Users}
        iconColor="text-indigo-500"
        eyebrow="Audience"
        title="Competitor Intel"
        description="Analyse competitor content — find content gaps and positioning angles they missed."
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="nc-tool-section space-y-5">
            <div>
              <p className="nc-eyebrow mb-0.5">Input</p>
              <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">Competitor Content</h2>
            </div>

            <div className="nc-form-row">
              <label htmlFor="competitorName">Competitor Name <span className="text-[#B0A898] normal-case font-normal tracking-normal">(optional)</span></label>
              <input
                id="competitorName"
                className="nc-tool-input"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                placeholder="@competitorhandle"
              />
            </div>

            <div className="nc-form-row">
              <label>Their Content Samples</label>
              <textarea
                className="nc-tool-input min-h-[280px] resize-y"
                value={competitorContent}
                onChange={(e) => setCompetitorContent(e.target.value)}
                placeholder="Paste 3–5 of their best performing posts, scripts, or hooks..."
              />
            </div>

            <button onClick={handleAnalyze} disabled={loading} className="nc-generate-btn">
              {loading ? <><Sparkles className="h-4 w-4 animate-spin" /> Analysing...</> : <><Users className="h-4 w-4" /> Analyse Competitor</>}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {analysis ? (
              <>
                {/* Hook patterns */}
                <div className="nc-result-card space-y-2">
                  <p className="nc-eyebrow mb-1">Hook Patterns They Use</p>
                  {analysis.topHookPatterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-[#FAF7F0] border border-[#E8E1D0] rounded-lg">
                      <span className="w-5 h-5 rounded-full bg-[#C9A646]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-heading font-black text-[#8C6F1F]">{idx + 1}</span>
                      </span>
                      <p className="text-[13px] text-[#1F1B16] leading-relaxed">{pattern}</p>
                    </div>
                  ))}
                </div>

                {/* Content gaps */}
                <div className="nc-result-card space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Content Gaps You Can Own</p>
                  </div>
                  {analysis.contentGaps.map((gap, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#DED5C2] rounded-lg">
                      <p className="text-[13px] font-heading font-semibold text-[#0A0A0A]">{gap}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths & weaknesses */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="nc-result-card space-y-2">
                    <p className="nc-eyebrow text-emerald-600 mb-1">Their Strengths</p>
                    {analysis.strengthsWeaknesses.strengths.map((s, idx) => (
                      <p key={idx} className="text-[12px] text-[#3D342A] leading-relaxed p-2 bg-[#FAF7F0] rounded-lg">{s}</p>
                    ))}
                  </div>
                  <div className="nc-result-card space-y-2">
                    <p className="nc-eyebrow text-red-500 mb-1">Their Weaknesses</p>
                    {analysis.strengthsWeaknesses.weaknesses.map((w, idx) => (
                      <p key={idx} className="text-[12px] text-[#3D342A] leading-relaxed p-2 bg-[#FAF7F0] rounded-lg">{w}</p>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div className="nc-result-card space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Your Opportunities</p>
                  </div>
                  {analysis.opportunities.map((opp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 border border-[#C9A646]/20 bg-[#FAF7F0] rounded-lg">
                      <TrendingUp className="h-3.5 w-3.5 text-[#C9A646] flex-shrink-0 mt-0.5" />
                      <p className="text-[13px] font-heading font-semibold text-[#1F1B16]">{opp}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#DED5C2] flex items-center justify-center mb-5">
                  <Users className="h-6 w-6 text-[#C9A646]" />
                </div>
                <h3 className="font-heading font-black text-[#0A0A0A] text-lg mb-2">No analysis yet</h3>
                <p className="text-[#8A8071] text-sm max-w-xs">Paste competitor content on the left and hit Analyse — gaps and opportunities surface immediately.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
