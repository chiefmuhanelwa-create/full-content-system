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
import { FileText, Sparkles, Copy, Download } from 'lucide-react'

interface ScriptBreakdown {
  timestamp: string
  script: string
  visual: string
  hookRetention?: string
}

interface GeneratedScript {
  title: string
  hook: string
  breakdown: ScriptBreakdown[]
  cta: string
  bRoll: string[]
  textOverlays: string[]
  ndivhuwoTouch?: {
    story: string
    placement: string
    duration: string
  }
}

export default function ScriptWriterPage() {
  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('auto')
  const [duration, setDuration] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<GeneratedScript | null>(null)
  const [error, setError] = useState('')

  const generateScript = async () => {
    if (!idea.trim()) {
      setError('Please enter your content idea')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          platform: platform === 'auto' ? undefined : platform,
          duration: duration === 'auto' ? undefined : duration,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script')
      }

      setScript(data.script)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error generating script:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyScript = () => {
    if (!script) return

    const fullScript = `
${script.title}

HOOK (0-3s):
${script.hook}

FULL SCRIPT:
${script.breakdown.map(b => `
[${b.timestamp}]
SCRIPT: ${b.script}
VISUAL: ${b.visual}
`).join('\n')}

CTA:
${script.cta}

B-ROLL SUGGESTIONS:
${script.bRoll.map((b, i) => `${i + 1}. ${b}`).join('\n')}

TEXT OVERLAYS:
${script.textOverlays.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${script.ndivhuwoTouch ? `
NDIVHUWO'S STORY TOUCH:
${script.ndivhuwoTouch.story}
Placement: ${script.ndivhuwoTouch.placement}
Duration: ${script.ndivhuwoTouch.duration}
` : ''}
`.trim()

    navigator.clipboard.writeText(fullScript)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Script Writer
        </h1>
        <p className="text-gray-600">
          One-input script generator: 80% fresh teaching + 20% Ndivhuwo's proven stories
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>What's Your Idea?</CardTitle>
              <CardDescription>
                Describe what you want to teach or share. AI will create a complete production-ready script.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Idea Input */}
              <div className="space-y-2">
                <Label htmlFor="idea">Your Content Idea *</Label>
                <Textarea
                  id="idea"
                  placeholder="e.g., 'Teach creators how to price their brand deals' or 'Share my journey from R750 to R100K brand partnerships'"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Be specific about what you want to teach or share
                </p>
              </div>

              {/* Platform Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform (Optional)</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect best platform</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                    <SelectItem value="youtube-long">YouTube (Long-form)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-optimize duration</SelectItem>
                    <SelectItem value="15s">15 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">60 seconds</SelectItem>
                    <SelectItem value="90s">90 seconds</SelectItem>
                    <SelectItem value="3min">3 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  🎯 How It Works:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 80% Fresh Teaching (frameworks + psychology)</li>
                  <li>• 20% Ndivhuwo's Stories (credibility + proof)</li>
                  <li>• SEEDS Structure (Setup → Escalation → Emotion → Discovery → Summary)</li>
                  <li>• Platform-optimized timing and visuals</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateScript}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Complete Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div>
          {script ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{script.title}</CardTitle>
                    <CardDescription>Production-ready script</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyScript}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    HOOK (0-3 seconds)
                  </p>
                  <p className="font-medium text-blue-900">{script.hook}</p>
                </div>

                {/* Script Breakdown */}
                <div className="space-y-4">
                  <p className="font-semibold text-sm">COMPLETE SCRIPT:</p>
                  {script.breakdown.map((section, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md bg-gray-50"
                    >
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        {section.timestamp}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            SCRIPT:
                          </span>
                          <p className="text-sm mt-1">{section.script}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            VISUAL:
                          </span>
                          <p className="text-sm mt-1 text-gray-600">
                            {section.visual}
                          </p>
                        </div>
                        {section.hookRetention && (
                          <div>
                            <span className="text-xs font-semibold text-gray-600">
                              RETENTION:
                            </span>
                            <p className="text-sm mt-1 text-gray-500 italic">
                              {section.hookRetention}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ndivhuwo's Story Touch */}
                {script.ndivhuwoTouch && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                    <p className="text-xs font-semibold text-purple-600 mb-2">
                      NDIVHUWO'S STORY (20% Personality Touch)
                    </p>
                    <p className="text-sm text-purple-900 mb-2">
                      {script.ndivhuwoTouch.story}
                    </p>
                    <div className="flex gap-4 text-xs text-purple-700">
                      <span>📍 {script.ndivhuwoTouch.placement}</span>
                      <span>⏱️ {script.ndivhuwoTouch.duration}</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs font-semibold text-green-600 mb-2">
                    CALL TO ACTION
                  </p>
                  <p className="font-medium text-green-900">{script.cta}</p>
                </div>

                {/* B-Roll Suggestions */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    B-ROLL SUGGESTIONS:
                  </p>
                  <ul className="text-sm space-y-1">
                    {script.bRoll.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Text Overlays */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    TEXT OVERLAYS:
                  </p>
                  <ul className="text-sm space-y-1">
                    {script.textOverlays.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No script generated yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Enter your content idea and click "Generate Complete Script" to create
                  a production-ready script with NOCHILL frameworks + Ndivhuwo's proven stories.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
