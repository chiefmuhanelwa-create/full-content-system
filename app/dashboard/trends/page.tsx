'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, Search, Lightbulb, Hash, Target, Zap, Sparkles } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface TrendData {
  topic: string
  volume: string
  platform: string
  relevance: number
}

interface TrendSuggestions {
  contentAngles: string[]
  hookIdeas: string[]
  hashtags: string[]
  timingSuggestion: string
}

export default function TrendsPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [trends, setTrends] = useState<TrendData[]>([])
  const [selectedTrend, setSelectedTrend] = useState<string>('')
  const [suggestions, setSuggestions] = useState<TrendSuggestions | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const handleFetchTrends = async () => {
    if (!niche.trim()) { alert('Enter your niche first'); return }
    setLoading(true)
    try {
      const response = await fetch('/api/trends/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform }),
      })
      if (response.ok) {
        const data = await response.json()
        setTrends(data.trends)
      } else {
        alert('Failed to fetch trends')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGetSuggestions = async (trend: string) => {
    setSelectedTrend(trend)
    setLoadingSuggestions(true)
    try {
      const response = await fetch('/api/trends/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend, niche, platform }),
      })
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
      } else {
        alert('Failed to generate suggestions')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={TrendingUp}
        iconColor="text-emerald-600"
        eyebrow="Audience"
        title="Trend Scanner"
        description="Discover what's trending in your niche — then get instant content angles, hook ideas, and hashtags."
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Discovery */}
          <div className="nc-tool-section space-y-5">
            <div>
              <p className="nc-eyebrow mb-0.5">Discover</p>
              <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">Find Trends</h2>
            </div>

            <div className="nc-form-row">
              <label htmlFor="niche">Your Niche</label>
              <input
                id="niche"
                className="nc-tool-input"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. creator economy, digital products, SA business"
              />
            </div>

            <div className="nc-form-row">
              <label>Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="nc-tool-input h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button onClick={handleFetchTrends} disabled={loading} className="nc-generate-btn">
              {loading ? <><Sparkles className="h-4 w-4 animate-spin" /> Fetching Trends...</> : <><Search className="h-4 w-4" /> Find Trends</>}
            </button>

            {trends.length > 0 && (
              <div className="space-y-3 mt-2">
                <p className="label-nc">Trending Now — click to get content ideas</p>
                {trends.map((trend, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGetSuggestions(trend.topic)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${selectedTrend === trend.topic ? 'border-[#C9A646] bg-[#FAF7F0] shadow-sm' : 'border-[#DED5C2] bg-white hover:border-[#C9A646]/50'}`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-heading font-bold text-[#0A0A0A] text-sm">{trend.topic}</span>
                      <span className="nc-badge">{trend.volume}</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#8A8071] font-heading">
                      <span>Relevance {trend.relevance}%</span>
                      <span>{trend.platform}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            {loadingSuggestions && (
              <div className="nc-tool-section flex flex-col items-center justify-center py-16">
                <Sparkles className="h-8 w-8 text-[#C9A646] animate-spin mb-4" />
                <p className="text-[#8A8071] font-heading text-sm">Generating content suggestions...</p>
              </div>
            )}

            {suggestions && !loadingSuggestions && (
              <div className="space-y-4">
                {/* Selected trend */}
                <div className="nc-result-card border-l-4 border-l-[#C9A646]">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Selected Trend</p>
                  </div>
                  <p className="font-heading font-black text-[#0A0A0A] text-base mb-1">{selectedTrend}</p>
                  <p className="text-[13px] text-[#5C5448]">{suggestions.timingSuggestion}</p>
                </div>

                {/* Content angles */}
                <div className="nc-result-card space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Content Angles</p>
                  </div>
                  {suggestions.contentAngles.map((angle, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#E8E1D0] rounded-lg">
                      <p className="text-[13px] font-heading font-semibold text-[#1F1B16]">{angle}</p>
                    </div>
                  ))}
                </div>

                {/* Hook ideas */}
                <div className="nc-result-card space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Hook Ideas</p>
                  </div>
                  {suggestions.hookIdeas.map((hook, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#E8E1D0] rounded-lg">
                      <p className="text-[13px] text-[#1F1B16] italic leading-relaxed">"{hook}"</p>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="nc-result-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-[#C9A646]" />
                    <p className="nc-eyebrow">Recommended Hashtags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#FAF7F0] border border-[#DED5C2] rounded-full text-[12px] font-heading font-bold text-[#4A3F35]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!suggestions && !loadingSuggestions && (
              <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#DED5C2] flex items-center justify-center mb-5">
                  <TrendingUp className="h-6 w-6 text-[#C9A646]" />
                </div>
                <h3 className="font-heading font-black text-[#0A0A0A] text-lg mb-2">Content ideas will appear here</h3>
                <p className="text-[#8A8071] text-sm max-w-xs">Click on a trend on the left to get angles, hooks, and hashtags instantly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
