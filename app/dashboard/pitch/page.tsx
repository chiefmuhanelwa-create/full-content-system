'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Target, Sparkles, Copy, Check, AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PitchData {
  person: string
  position: string
  proof: string
  pain: string
  promise: string
}

interface PitchVariations {
  elevator: string
  video: string
  email: string
}

interface PitchRecommendations {
  strengths: string[]
  improvements: string[]
  targetBrands: string[]
}

interface GeneratedPitch {
  pitch: PitchData
  variations: PitchVariations
  recommendations: PitchRecommendations
}

export default function PitchBuilderPage() {
  const [formData, setFormData] = useState<PitchData>({
    person: '',
    position: '',
    proof: '',
    pain: '',
    promise: '',
  })
  const [loading, setLoading] = useState(false)
  const [generatedPitch, setGeneratedPitch] = useState<GeneratedPitch | null>(null)
  const [error, setError] = useState('')
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const buildPitch = async () => {
    if (!formData.person.trim() || !formData.position.trim()) {
      setError('Person and Position fields are required')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedPitch(null)

    try {
      const response = await fetch('/api/pitch/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pitch')
      }

      setGeneratedPitch(data.pitch)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error generating pitch:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Target className="h-8 w-8 text-orange-600" />
          Pitch Builder
        </h1>
        <p className="text-gray-600">
          Build compelling pitches using the 5 Pillars: Person, Position, Proof, Pain, Promise
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>5 Pillars Framework</CardTitle>
              <CardDescription>
                Fill out each pillar to build your complete pitch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Person */}
              <div className="space-y-2">
                <Label htmlFor="person" className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  Person (Who you are) *
                </Label>
                <Textarea
                  id="person"
                  placeholder="Example: I'm a content creator and digital marketing strategist with 5 years of experience helping African brands connect with Gen-Z audiences..."
                  rows={3}
                  value={formData.person}
                  onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                  className="text-sm"
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  Position (What you do) *
                </Label>
                <Textarea
                  id="position"
                  placeholder="Example: I create viral educational content about personal finance for young African professionals on Instagram and TikTok..."
                  rows={3}
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="text-sm"
                />
              </div>

              {/* Proof */}
              <div className="space-y-2">
                <Label htmlFor="proof" className="flex items-center gap-2">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  Proof (What you've achieved)
                </Label>
                <Textarea
                  id="proof"
                  placeholder="Example: 50K followers, 2M+ monthly impressions, 8% average engagement rate, worked with 15+ brands including..."
                  rows={3}
                  value={formData.proof}
                  onChange={(e) => setFormData({ ...formData, proof: e.target.value })}
                  className="text-sm"
                />
              </div>

              {/* Pain */}
              <div className="space-y-2">
                <Label htmlFor="pain" className="flex items-center gap-2">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  Pain (Problem you solve)
                </Label>
                <Textarea
                  id="pain"
                  placeholder="Example: Most brands struggle to authentically connect with African Gen-Z because traditional marketing feels out of touch..."
                  rows={3}
                  value={formData.pain}
                  onChange={(e) => setFormData({ ...formData, pain: e.target.value })}
                  className="text-sm"
                />
              </div>

              {/* Promise */}
              <div className="space-y-2">
                <Label htmlFor="promise" className="flex items-center gap-2">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</span>
                  Promise (What you deliver)
                </Label>
                <Textarea
                  id="promise"
                  placeholder="Example: I create culturally relevant content that drives real engagement and conversions, not just views..."
                  rows={3}
                  value={formData.promise}
                  onChange={(e) => setFormData({ ...formData, promise: e.target.value })}
                  className="text-sm"
                />
              </div>

              <Button
                onClick={buildPitch}
                disabled={loading || !formData.person.trim() || !formData.position.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Building Pitch...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Build My Pitch
                  </>
                )}
              </Button>

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
          {generatedPitch ? (
            <div className="space-y-4">
              {/* 5 Pillars Pitch */}
              <Card>
                <CardHeader>
                  <CardTitle>Your 5 Pillars Pitch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(generatedPitch.pitch).map(([key, value], index) => (
                    <div key={key} className="p-3 bg-gray-50 border rounded-md">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-600 uppercase">{key}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(value, key)}
                        >
                          {copiedSection === key ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pitch Variations */}
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Variations</CardTitle>
                  <CardDescription>Different formats for different situations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="elevator">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="elevator">30s Elevator</TabsTrigger>
                      <TabsTrigger value="video">60s Video</TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                    </TabsList>
                    <TabsContent value="elevator" className="mt-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold text-blue-600">30-SECOND ELEVATOR PITCH</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPitch.variations.elevator, 'elevator')}
                          >
                            {copiedSection === 'elevator' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-blue-900 whitespace-pre-wrap">{generatedPitch.variations.elevator}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold text-purple-600">60-SECOND VIDEO SCRIPT</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPitch.variations.video, 'video')}
                          >
                            {copiedSection === 'video' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-purple-900 whitespace-pre-wrap">{generatedPitch.variations.video}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="email" className="mt-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold text-green-600">EMAIL TEMPLATE</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPitch.variations.email, 'email')}
                          >
                            {copiedSection === 'email' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-green-900 whitespace-pre-wrap font-mono">{generatedPitch.variations.email}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-2">✅ STRENGTHS:</p>
                    <ul className="text-sm space-y-1">
                      {generatedPitch.recommendations.strengths.map((strength, index) => (
                        <li key={index} className="text-green-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-600 mb-2">💡 IMPROVEMENTS:</p>
                    <ul className="text-sm space-y-1">
                      {generatedPitch.recommendations.improvements.map((improvement, index) => (
                        <li key={index} className="text-orange-700">• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-2">🎯 TARGET BRANDS:</p>
                    <ul className="text-sm space-y-1">
                      {generatedPitch.recommendations.targetBrands.map((brand, index) => (
                        <li key={index} className="text-blue-700">• {brand}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Target className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pitch generated yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Fill out at least Person and Position pillars, then click "Build My Pitch"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
