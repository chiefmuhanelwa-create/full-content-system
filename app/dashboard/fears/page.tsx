'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Brain, Sparkles, Copy, Check, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

interface FearHook {
  hook: string
}

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

export default function FearAnalyzerPage() {
  const router = useRouter()
  const { addFear, setPendingAction } = useContent()

  const [audienceDescription, setAudienceDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FearAnalysis | null>(null)
  const [error, setError] = useState('')
  const [copiedHook, setCopiedHook] = useState<string | null>(null)

  const analyzeFears = async () => {
    if (!audienceDescription.trim()) {
      setError('Please describe your target audience')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/fears/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audienceDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze fears')
      }

      // Set local state
      setAnalysis(data.analysis)

      // Save identified fears to global context for Hook Generator
      data.analysis.identifiedFears.forEach((fear: IdentifiedFear) => {
        addFear({
          id: fear.fearId,
          name: fear.fearName,
          relevance: fear.relevanceScore,
          hooks: fear.hooks,
          targetAudience: audienceDescription,
        })
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error analyzing fears:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyHook = (hook: string) => {
    navigator.clipboard.writeText(hook)
    setCopiedHook(hook)
    setTimeout(() => setCopiedHook(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200'
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-red-600" />
          Fear Analyzer
        </h1>
        <p className="text-gray-600">
          Identify the 10 Shadow Fears driving your audience and generate fear-targeted hooks
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Audience</CardTitle>
              <CardDescription>
                Tell us about your target audience - their struggles, goals, demographics, pain points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience Description</Label>
                <Textarea
                  id="audience"
                  placeholder="Example: African creators aged 25-35 who are stuck at 10K followers. They post 3x daily but get no engagement. They've tried courses and coaching but still broke. Working 9-5 jobs they hate, want financial freedom but don't know how to monetize content..."
                  rows={10}
                  value={audienceDescription}
                  onChange={(e) => setAudienceDescription(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Include: demographics, pain points, goals, current situation, frustrations
                </p>
              </div>

              <Button
                onClick={analyzeFears}
                disabled={loading || !audienceDescription.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Shadow Fears...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Shadow Fears
                  </>
                )}
              </Button>

              {/* 10 Shadow Fears Reference */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-semibold text-red-600 mb-2">
                  10 Shadow Fears:
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>1. Fear of Invisibility</li>
                  <li>2. Fear of Wasted Potential</li>
                  <li>3. Fear of Being Left Behind</li>
                  <li>4. Fear of Exposure (Impostor Syndrome)</li>
                  <li>5. Fear of Permanent Mediocrity</li>
                  <li>6. Fear of Missed Timing</li>
                  <li>7. Fear of Being Forgotten</li>
                  <li>8. Fear of Financial Dependency</li>
                  <li>9. Fear of Creative Exhaustion</li>
                  <li>10. Fear of Systemic Exclusion</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {analysis ? (
            <div className="space-y-4">
              {/* Primary Fear */}
              <Card className="border-2 border-red-600 bg-red-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-red-900">Primary Fear</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg text-red-900 mb-2">
                    {analysis.primaryFear.fearName}
                  </p>
                  <p className="text-sm text-red-700">{analysis.primaryFear.reasoning}</p>
                </CardContent>
              </Card>

              {/* Recommended Approach */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-900">Recommended Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700">{analysis.recommendedApproach}</p>
                </CardContent>
              </Card>

              {/* Identified Fears */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  Identified Fears ({analysis.identifiedFears.length})
                </h2>
                {analysis.identifiedFears
                  .sort((a, b) => b.relevanceScore - a.relevanceScore)
                  .map((fear, index) => (
                    <Card key={index} className={`border-l-4 ${getScoreColor(fear.relevanceScore)}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{fear.fearName}</CardTitle>
                            <CardDescription className="mt-1">
                              Relevance: {fear.relevanceScore}%
                            </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Save fear and navigate to Hook Generator
                              const savedFear = addFear({
                                id: fear.fearId,
                                name: fear.fearName,
                                relevance: fear.relevanceScore,
                                hooks: fear.hooks,
                                targetAudience: audienceDescription,
                              })
                              setPendingAction({
                                action: 'target-fear-in-hooks',
                                data: savedFear,
                              })
                              router.push('/dashboard/hooks')
                            }}
                            className="gap-1"
                            title="Generate more hooks targeting this fear"
                          >
                            <ArrowRight className="h-3 w-3" />
                            More Hooks
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Reasoning */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Why This Fear:</p>
                          <p className="text-sm">{fear.reasoning}</p>
                        </div>

                        {/* Hooks */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Fear-Targeted Hooks:
                          </p>
                          <div className="space-y-2">
                            {fear.hooks.map((hook, hookIndex) => (
                              <div
                                key={hookIndex}
                                className="p-3 bg-white border rounded-md flex items-start gap-2 group"
                              >
                                <p className="text-sm flex-1">{hook}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyHook(hook)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {copiedHook === hook ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Content Strategy */}
                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                          <p className="text-xs font-semibold text-purple-600 mb-1">
                            Content Strategy:
                          </p>
                          <p className="text-xs text-purple-700">{fear.contentStrategy}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Brain className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No analysis yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Describe your target audience and click "Analyze Shadow Fears" to identify their
                  deepest unspoken fears
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
