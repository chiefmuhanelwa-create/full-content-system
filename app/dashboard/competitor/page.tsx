'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, TrendingUp, Lightbulb, Target } from 'lucide-react'

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
    if (!competitorContent.trim()) {
      alert('Please enter competitor content samples')
      return
    }

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
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Users className="h-10 w-10 text-indigo-600" />
          Competitor Analysis
        </h1>
        <p className="text-gray-600">Analyze competitor content and find your edge</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Competitor Name (optional)</Label>
              <Input value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="@competitor" />
            </div>
            <div>
              <Label>Paste their content samples</Label>
              <textarea
                className="w-full min-h-[300px] p-3 border rounded-lg"
                value={competitorContent}
                onChange={(e) => setCompetitorContent(e.target.value)}
                placeholder="Paste 3-5 of their best performing posts, scripts, or hooks..."
              />
            </div>
            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Analyze Competitor'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Hook Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.topHookPatterns.map((p, i) => <li key={i} className="text-sm p-2 bg-blue-50 rounded">{p}</li>)}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Content Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.contentGaps.map((g, i) => <li key={i} className="text-sm p-2 bg-green-50 rounded">{g}</li>)}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Your Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((o, i) => <li key={i} className="text-sm p-2 bg-yellow-50 rounded font-medium">{o}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!analysis && !loading && (
            <Card>
              <CardContent className="pt-6 text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Analysis will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
