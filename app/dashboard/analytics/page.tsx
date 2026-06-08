'use client'

import { useState, useEffect } from 'react'
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
import { BarChart, TrendingUp, Award, Target, Lightbulb, LineChart } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface PerformanceData {
  contentId: string
  contentType: 'hook' | 'script' | 'story'
  hookType?: string
  views: number
  engagement: number
  shares: number
  saves: number
  platform: string
  postedDate: string
}

export default function AnalyticsPage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Form state for tracking new content performance
  const [contentId, setContentId] = useState('')
  const [contentType, setContentType] = useState<'hook' | 'script' | 'story'>('script')
  const [hookType, setHookType] = useState('')
  const [views, setViews] = useState('')
  const [engagement, setEngagement] = useState('')
  const [shares, setShares] = useState('')
  const [saves, setSaves] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [postedDate, setPostedDate] = useState('')

  // Load saved performance data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('performanceData')
    if (saved) {
      setPerformanceData(JSON.parse(saved))
    }
  }, [])

  // Save performance data
  const handleTrackPerformance = () => {
    const newEntry: PerformanceData = {
      contentId: contentId || `content-${Date.now()}`,
      contentType,
      hookType: contentType === 'hook' ? hookType : undefined,
      views: parseInt(views) || 0,
      engagement: parseFloat(engagement) || 0,
      shares: parseInt(shares) || 0,
      saves: parseInt(saves) || 0,
      platform,
      postedDate: postedDate || new Date().toISOString().split('T')[0],
    }

    const updated = [...performanceData, newEntry]
    setPerformanceData(updated)
    localStorage.setItem('performanceData', JSON.stringify(updated))

    // Reset form
    setContentId('')
    setViews('')
    setEngagement('')
    setShares('')
    setSaves('')
    setPostedDate('')

    // Trigger insights generation
    generateInsights(updated)
  }

  // Generate AI insights from performance data
  const generateInsights = async (data: PerformanceData[]) => {
    if (data.length === 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceData: data }),
      })

      if (response.ok) {
        const result = await response.json()
        setInsights(result.insights)
      }
    } catch (error) {
      console.error('Failed to generate insights:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate top performers
  const topPerformers = [...performanceData]
    .sort((a, b) => (b.views + b.engagement * 10 + b.shares * 20) - (a.views + a.engagement * 10 + a.shares * 20))
    .slice(0, 5)

  // Calculate hook type performance
  const hookTypeStats = performanceData
    .filter(d => d.contentType === 'hook' && d.hookType)
    .reduce((acc, item) => {
      const type = item.hookType!
      if (!acc[type]) {
        acc[type] = { count: 0, totalViews: 0, totalEngagement: 0 }
      }
      acc[type].count++
      acc[type].totalViews += item.views
      acc[type].totalEngagement += item.engagement
      return acc
    }, {} as Record<string, { count: number; totalViews: number; totalEngagement: number }>)

  const bestHookType = Object.entries(hookTypeStats)
    .sort((a, b) => (b[1].totalViews + b[1].totalEngagement * 100) - (a[1].totalViews + a[1].totalEngagement * 100))
    [0]

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={BarChart}
        iconColor="text-blue-500"
        eyebrow="Analyze"
        title="Performance Analytics"
        description="Track, analyze, and learn from your content performance"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Content Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{performanceData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData.reduce((sum, d) => sum + d.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData.length > 0
                ? (performanceData.reduce((sum, d) => sum + d.engagement, 0) / performanceData.length).toFixed(1)
                : '0'}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceData.reduce((sum, d) => sum + d.shares, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Track New Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Track Content Performance
            </CardTitle>
            <CardDescription>Add your content metrics to build insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentId">Content ID (optional)</Label>
              <Input
                id="contentId"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="script-001, hook-video-1"
              />
            </div>

            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="script">Script</SelectItem>
                  <SelectItem value="hook">Hook</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contentType === 'hook' && (
              <div>
                <Label htmlFor="hookType">Hook Type</Label>
                <Select value={hookType} onValueChange={setHookType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hook type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="information_gap">Information Gap</SelectItem>
                    <SelectItem value="desired_result">Desired Result</SelectItem>
                    <SelectItem value="undesired_result">Undesired Result</SelectItem>
                    <SelectItem value="a_to_b_transformation">A-to-B Transformation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  type="number"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label htmlFor="engagement">Engagement Rate (%)</Label>
                <Input
                  id="engagement"
                  type="number"
                  step="0.1"
                  value={engagement}
                  onChange={(e) => setEngagement(e.target.value)}
                  placeholder="5.2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="250"
                />
              </div>
              <div>
                <Label htmlFor="saves">Saves</Label>
                <Input
                  id="saves"
                  type="number"
                  value={saves}
                  onChange={(e) => setSaves(e.target.value)}
                  placeholder="180"
                />
              </div>
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

            <div>
              <Label htmlFor="postedDate">Posted Date</Label>
              <Input
                id="postedDate"
                type="date"
                value={postedDate}
                onChange={(e) => setPostedDate(e.target.value)}
              />
            </div>

            <Button onClick={handleTrackPerformance} className="w-full">
              Track Performance
            </Button>
          </CardContent>
        </Card>

        {/* AI Insights & Learning */}
        <div className="space-y-6">
          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((content, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">#{idx + 1} {content.contentId}</span>
                        <span className="text-xs bg-yellow-200 px-2 py-1 rounded">{content.platform}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-700">
                        <span>👁️ {content.views.toLocaleString()}</span>
                        <span>💬 {content.engagement}%</span>
                        <span>🔗 {content.shares}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Best Hook Type */}
          {bestHookType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Best Performing Hook Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-bold text-lg text-green-900 mb-2">
                    {bestHookType[0].replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Used:</span>
                      <span className="font-semibold ml-2">{bestHookType[1].count} times</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Views:</span>
                      <span className="font-semibold ml-2">
                        {Math.round(bestHookType[1].totalViews / bestHookType[1].count).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          {insights && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Data-driven recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.recommendations?.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-900">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {performanceData.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No performance data yet</p>
                  <p className="text-sm mt-2">Track your content metrics to unlock AI insights</p>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Generating insights...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
