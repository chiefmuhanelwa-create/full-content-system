'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Image, Film, Type, MessageCircle, Copy, Download } from 'lucide-react'

interface VisualContent {
  thumbnails: Array<{
    concept: string
    colors: string
    text: string
    composition: string
  }>
  bRollSuggestions: Array<{
    scene: string
    duration: string
    stockKeywords: string[]
  }>
  textOverlays: string[]
  captions: {
    instagram: string
    tiktok: string
    youtube: string
  }
}

export default function VisualsPage() {
  const [script, setScript] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [visualContent, setVisualContent] = useState<VisualContent | null>(null)

  const handleGenerate = async () => {
    if (!script.trim()) {
      alert('Please enter your script')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/visuals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, platform }),
      })

      if (response.ok) {
        const data = await response.json()
        setVisualContent(data.visuals)
      } else {
        alert('Failed to generate visuals')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Image className="h-10 w-10 text-pink-600" />
          Visual Content Generator
        </h1>
        <p className="text-gray-600">Generate thumbnails, B-roll, overlays & captions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Script</CardTitle>
            <CardDescription>Generate visual elements for your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="script">Script or Content Idea</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your script or describe your content idea..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="platform">Primary Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? 'Generating Visuals...' : 'Generate Visual Content'}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating visual content...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {visualContent && (
            <>
              {/* Thumbnail Concepts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Image className="h-5 w-5 text-pink-600" />
                    Thumbnail Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visualContent.thumbnails.map((thumb, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-pink-900">Concept {idx + 1}</span>
                          <span className="text-xs bg-pink-200 px-2 py-1 rounded">{thumb.colors}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Concept:</span>
                            <p className="text-gray-900 mt-1">{thumb.concept}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Text on Thumbnail:</span>
                            <p className="text-lg font-bold text-pink-900 mt-1">"{thumb.text}"</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Composition:</span>
                            <p className="text-gray-900 mt-1">{thumb.composition}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* B-Roll Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Film className="h-5 w-5 text-blue-600" />
                    B-Roll Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {visualContent.bRollSuggestions.map((broll, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm text-blue-900">Scene {idx + 1}</span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">{broll.duration}</span>
                        </div>
                        <p className="text-sm mb-2">{broll.scene}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-semibold text-gray-600">Stock Keywords:</span>
                          {broll.stockKeywords.map((keyword, kidx) => (
                            <span key={kidx} className="text-xs bg-blue-100 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Text Overlays */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Type className="h-5 w-5 text-purple-600" />
                    Text Overlays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {visualContent.textOverlays.map((overlay, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center">
                        <p className="text-sm font-medium text-purple-900">"{overlay}"</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(overlay)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Captions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Platform Captions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Instagram */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-purple-900">Instagram Caption</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(visualContent.captions.instagram)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{visualContent.captions.instagram}</p>
                    </div>

                    {/* TikTok */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-blue-900">TikTok Caption</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(visualContent.captions.tiktok)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{visualContent.captions.tiktok}</p>
                    </div>

                    {/* YouTube */}
                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm text-red-900">YouTube Description</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(visualContent.captions.youtube)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{visualContent.captions.youtube}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!visualContent && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-12">
                  <Image className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Visual content will appear here</p>
                  <p className="text-sm mt-2">Enter your script and click "Generate Visual Content"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
