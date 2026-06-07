'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Download, Copy, Check } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ContentPiece {
  day: number
  date: string
  topic: string
  hookIdea: string
  contentType: string
  platform: string
  notes: string
}

export default function BatchPlannerPage() {
  const [niche, setNiche] = useState('')
  const [goals, setGoals] = useState('')
  const [postingFrequency, setPostingFrequency] = useState('daily')
  const [platforms, setPlatforms] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [contentPlan, setContentPlan] = useState<ContentPiece[]>([])

  const handleGenerate = async () => {
    if (!niche.trim() || !goals.trim()) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/batch/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, postingFrequency, platforms }),
      })

      if (response.ok) {
        const data = await response.json()
        setContentPlan(data.plan)
      } else {
        alert('Failed to generate content plan')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const exportAsCSV = () => {
    const headers = ['Day', 'Date', 'Topic', 'Hook Idea', 'Type', 'Platform', 'Notes']
    const rows = contentPlan.map(item => [
      item.day,
      item.date,
      item.topic,
      item.hookIdea,
      item.contentType,
      item.platform,
      item.notes
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '30-day-content-plan.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Calendar}
        iconColor="text-teal-600"
        eyebrow="Plan"
        title="Batch Content Planner"
        description="Generate 30 days of content ideas in seconds"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Plan Configuration</CardTitle>
            <CardDescription>Set up your 30-day content plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="niche">Your Niche</Label>
              <Input
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Digital Marketing"
              />
            </div>

            <div>
              <Label htmlFor="goals">Content Goals</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What do you want to achieve? (e.g., grow audience, drive sales, establish authority)"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Posting Frequency</Label>
              <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (30 posts)</SelectItem>
                  <SelectItem value="weekdays">Weekdays Only (20-22 posts)</SelectItem>
                  <SelectItem value="3x-week">3x per Week (12-13 posts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platforms">Primary Platform</Label>
              <Select value={platforms} onValueChange={setPlatforms}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="multi">Multi-Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? 'Generating Plan...' : 'Generate 30-Day Plan'}
            </Button>

            {contentPlan.length > 0 && (
              <Button onClick={exportAsCSV} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your 30-day content plan...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {contentPlan.length > 0 && !loading && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your 30-Day Content Calendar</CardTitle>
                  <CardDescription>{contentPlan.length} pieces of content planned</CardDescription>
                </CardHeader>
              </Card>

              {/* Week-by-week view */}
              {[1, 2, 3, 4].map(week => {
                const weekContent = contentPlan.filter(item =>
                  item.day >= (week - 1) * 7 + 1 && item.day <= week * 7
                )

                if (weekContent.length === 0) return null

                return (
                  <Card key={week}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Week {week}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {weekContent.map((content, idx) => (
                          <div key={idx} className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-3 items-start">
                                <div className="bg-teal-600 text-white rounded-lg w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-semibold">DAY</span>
                                  <span className="text-lg font-bold">{content.day}</span>
                                </div>
                                <div>
                                  <p className="font-bold text-teal-900">{content.topic}</p>
                                  <p className="text-xs text-gray-600 mt-1">{content.date}</p>
                                </div>
                              </div>
                              <span className="text-xs bg-teal-200 px-2 py-1 rounded">{content.contentType}</span>
                            </div>
                            <div className="ml-15 pl-3 border-l-2 border-teal-300">
                              <p className="text-sm text-gray-700 mb-2">
                                <span className="font-semibold">Hook:</span> "{content.hookIdea}"
                              </p>
                              {content.notes && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-semibold">Notes:</span> {content.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </>
          )}

          {contentPlan.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">30-day content plan will appear here</p>
                  <p className="text-sm mt-2">Fill in your details and click "Generate 30-Day Plan"</p>
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
