'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, CheckCircle, AlertCircle } from 'lucide-react'

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

  const handleAnalyze = async () => {
    if (!brandVoice.trim() || !contentSamples.trim()) {
      alert('Please fill in all fields')
      return
    }

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

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Mic className="h-10 w-10 text-violet-600" />
          Brand Voice Consistency Checker
        </h1>
        <p className="text-gray-600">Ensure all content matches your unique voice</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Define Your Brand Voice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Brand Voice Description</label>
              <textarea
                className="w-full min-h-[150px] p-3 border rounded-lg mt-2"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Describe your brand voice... (e.g., Direct, no-nonsense, empowering, anti-guru)"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content to Analyze</label>
              <textarea
                className="w-full min-h-[200px] p-3 border rounded-lg mt-2"
                value={contentSamples}
                onChange={(e) => setContentSamples(e.target.value)}
                placeholder="Paste content you want to check for voice consistency..."
              />
            </div>
            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Check Voice Consistency'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {analysis.alignmentScore >= 70 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    Alignment Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2" style={{ color: analysis.alignmentScore >= 70 ? '#16a34a' : '#ea580c' }}>
                      {analysis.alignmentScore}%
                    </div>
                    <p className="text-sm text-gray-600">Voice alignment with your brand</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detected Tone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium p-3 bg-violet-50 rounded-lg">{analysis.tone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="text-sm p-3 bg-violet-50 border border-violet-200 rounded-lg">{s}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!analysis && !loading && (
            <Card>
              <CardContent className="pt-6 text-center py-12 text-gray-500">
                <Mic className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Voice analysis will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
