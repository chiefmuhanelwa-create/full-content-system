'use client'

import { useState } from 'react'
import { Mic, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface VoiceAnalysis {
  tone: string
  consistency: number
  suggestions: string[]
  alignmentScore: number
}

export default function BrandVoicePage() {
  const [brandVoice, setBrandVoice] = useState('')
  const [contentSamples, setContentSamples] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!brandVoice.trim() || !contentSamples.trim()) {
      setError('Fill in both fields before analysing')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/brand-voice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandVoice, contentSamples }),
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

  const scoreColor = analysis
    ? analysis.alignmentScore >= 70 ? '#16a34a' : '#D4541F'
    : '#2563EB'

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Mic}
        iconColor="text-purple-500"
        eyebrow="Audience"
        title="Brand Voice"
        description="Score content against your voice profile — then rewrite anything that's off-brand."
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="nc-tool-section space-y-5">
            <div>
              <p className="nc-eyebrow mb-0.5">Input</p>
              <h2 className="font-display font-black text-[#18181B] text-lg leading-none">Define Your Voice</h2>
            </div>

            <div className="nc-form-row">
              <label htmlFor="brandVoice">Your Brand Voice</label>
              <textarea
                id="brandVoice"
                className="nc-tool-input min-h-[140px] resize-y"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Direct, no-nonsense, empowering. Anti-guru. Tough-love mentor. Short punchy sentences. SA context. Always speaks to 'you' directly. Never corporate."
              />
            </div>

            <div className="nc-form-row">
              <label htmlFor="contentSamples">Content to Analyse</label>
              <textarea
                id="contentSamples"
                className="nc-tool-input min-h-[180px] resize-y"
                value={contentSamples}
                onChange={(e) => setContentSamples(e.target.value)}
                placeholder="Paste the content you want to check for voice consistency..."
              />
            </div>

            {error && <div className="nc-error">{error}</div>}

            <button onClick={handleAnalyze} disabled={loading} className="nc-generate-btn">
              {loading ? <><Sparkles className="h-4 w-4 animate-spin" /> Analysing Voice...</> : <><Mic className="h-4 w-4" /> Check Voice Consistency</>}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {analysis ? (
              <>
                {/* Score card */}
                <div className="nc-result-card text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {analysis.alignmentScore >= 70
                      ? <CheckCircle className="h-5 w-5 text-emerald-600" />
                      : <AlertCircle className="h-5 w-5 text-[#D4541F]" />
                    }
                    <p className="nc-eyebrow">Alignment Score</p>
                  </div>
                  <div className="font-display font-black text-6xl leading-none mb-2" style={{ color: scoreColor }}>
                    {analysis.alignmentScore}%
                  </div>
                  <p className="text-[#71717A] text-sm">Voice alignment with your brand</p>
                </div>

                {/* Detected tone */}
                <div className="nc-result-card">
                  <p className="nc-eyebrow mb-2">Detected Tone</p>
                  <p className="font-display font-bold text-[#18181B] text-sm leading-relaxed p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg">
                    {analysis.tone}
                  </p>
                </div>

                {/* Suggestions */}
                <div className="nc-result-card space-y-3">
                  <p className="nc-eyebrow">Improvement Suggestions</p>
                  {analysis.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg">
                      <span className="w-5 h-5 rounded-full bg-[#2563EB]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-display font-black text-[#1D4ED8]">{i + 1}</span>
                      </span>
                      <p className="text-[13px] text-[#18181B] leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E4E4E7] flex items-center justify-center mb-5">
                  <Mic className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="font-display font-black text-[#18181B] text-lg mb-2">Voice analysis will appear here</h3>
                <p className="text-[#71717A] text-sm max-w-xs">
                  Describe your brand voice, paste content to check, and hit Analyse.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
