'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, Search, Lightbulb, Hash, Target, Zap } from 'lucide-react'

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
    if (!niche.trim()) {
      alert('Please enter your niche')
      return
    }

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
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-orange-600" />
          Real-Time Trend Integration
        </h1>
        <p className="text-gray-600">Discover trending topics and get instant content angles</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trend Discovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-600" />
              Discover Trends
            </CardTitle>
            <CardDescription>Find what's trending in your niche</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="niche">Your Niche</Label>
              <Input
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., digital marketing, fitness, AI tools"
              />
            </div>

            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleFetchTrends} disabled={loading} className="w-full">
              {loading ? 'Fetching Trends...' : 'Find Trends'}
            </Button>

            {/* Trending Topics List */}
            {trends.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="font-semibold text-sm text-gray-700">Trending Now:</p>
                {trends.map((trend, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:border-orange-400 transition-colors cursor-pointer"
                    onClick={() => handleGetSuggestions(trend.topic)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-orange-900">{trend.topic}</span>
                      <span className="text-xs bg-orange-200 px-2 py-1 rounded">{trend.volume}</span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-600">
                      <span>📊 Relevance: {trend.relevance}%</span>
                      <span>📱 {trend.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Suggestions */}
        <div className="space-y-6">
          {loadingSuggestions && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating content suggestions...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {suggestions && !loadingSuggestions && (
            <>
              {/* Selected Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                    Selected Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-orange-100 border-2 border-orange-300 rounded-lg">
                    <p className="font-bold text-lg text-orange-900">{selectedTrend}</p>
                    <p className="text-sm text-orange-700 mt-1">{suggestions.timingSuggestion}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Angles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Content Angles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestions.contentAngles.map((angle, idx) => (
                      <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-900">{angle}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hook Ideas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Hook Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestions.hookIdeas.map((hook, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">"{hook}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Hash className="h-5 w-5 text-purple-600" />
                    Recommended Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!suggestions && !loadingSuggestions && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-12">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Content suggestions will appear here</p>
                  <p className="text-sm mt-2">Click on a trend to get instant content ideas</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
