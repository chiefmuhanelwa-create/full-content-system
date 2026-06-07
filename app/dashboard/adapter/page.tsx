'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Share2, Copy, Download, Loader2, Linkedin, Twitter, Facebook, Mail, CheckCircle2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface AdaptedContent {
  platform: string
  content: string
  characterCount?: number
  hashtags?: string[]
  bestTimeToPost?: string
  engagementTips?: string[]
}

const platforms = [
  { id: 'linkedin', name: 'LinkedIn Post', icon: Linkedin, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'twitter', name: 'X/Twitter Thread', icon: Twitter, color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { id: 'facebook', name: 'Facebook Post', icon: Facebook, color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'newsletter', name: 'Email Newsletter', icon: Mail, color: 'text-purple-600', bgColor: 'bg-purple-50' },
]

export default function ContentAdapter() {
  const [originalContent, setOriginalContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [adaptedContent, setAdaptedContent] = useState<AdaptedContent[]>([])

  // Check for pending content from other tools
  useEffect(() => {
    const pendingScript = localStorage.getItem('adapterScript')
    if (pendingScript) {
      try {
        const script = JSON.parse(pendingScript)
        setOriginalContent(script.content || script.fullScript || '')
        localStorage.removeItem('adapterScript')
      } catch (e) {
        console.error('Failed to load pending script:', e)
      }
    }
  }, [])

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const adaptContent = async () => {
    if (!originalContent || selectedPlatforms.length === 0) {
      alert('Please provide content and select at least one platform')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/adapter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent,
          platforms: selectedPlatforms,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to adapt content')
      }

      const data = await response.json()
      setAdaptedContent(data.adaptedContent)
    } catch (error: any) {
      alert(error.message || 'Failed to adapt content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const exportAll = () => {
    if (adaptedContent.length === 0) return

    const content = adaptedContent.map(adapted => `
═══════════════════════════════════════
${adapted.platform.toUpperCase()}
═══════════════════════════════════════

${adapted.content}

${adapted.characterCount ? `Character Count: ${adapted.characterCount}` : ''}
${adapted.hashtags ? `\nSuggested Hashtags: ${adapted.hashtags.join(' ')}` : ''}
${adapted.bestTimeToPost ? `\nBest Time to Post: ${adapted.bestTimeToPost}` : ''}
${adapted.engagementTips ? `\nEngagement Tips:\n${adapted.engagementTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}` : ''}

`).join('\n')

    const fullContent = `
MULTI-PLATFORM CONTENT ADAPTATION
Generated: ${new Date().toLocaleDateString()}

ORIGINAL CONTENT:
${originalContent}

${content}
    `.trim()

    const blob = new Blob([fullContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `adapted-content-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Share2}
        iconColor="text-green-600"
        eyebrow="Repurpose"
        title="Multi-Platform Adapter"
        description="Adapt your content for LinkedIn, X, Facebook, and Newsletter"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Info Card */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <p className="text-sm text-gray-700">
            <strong>How it works:</strong> Paste your video script or content, select target platforms, and get perfectly adapted versions optimized for each platform's format, style, and audience expectations.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Original Content</h2>

            {/* Original Content Input */}
            <div className="space-y-2 mb-6">
              <Label>Your Video Script or Content</Label>
              <Textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="Paste your video script, blog post, or any content you want to adapt for multiple platforms...

This can be:
- A video script from Script Writer or Formulas
- A story from Storytelling Studio
- An existing piece of content
- A blog post or article

The adapter will transform it into platform-optimized versions while maintaining your core message and voice."
                rows={16}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                {originalContent.length} characters
              </p>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3 mb-6">
              <Label>Select Target Platforms</Label>
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)

                  return (
                    <div
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <Icon className={`h-5 w-5 ${platform.color}`} />
                      <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select one or more platforms to generate adapted content
              </p>
            </div>

            {/* Adapt Button */}
            <Button
              onClick={adaptContent}
              disabled={loading || !originalContent || selectedPlatforms.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adapting Content...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Adapt to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {adaptedContent.length > 0 ? (
            <>
              {/* Export All Button */}
              <div className="flex justify-end">
                <Button onClick={exportAll} variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Export All
                </Button>
              </div>

              {/* Adapted Content Cards */}
              {adaptedContent.map((adapted, index) => {
                const platform = platforms.find(p => p.id === adapted.platform)
                if (!platform) return null

                const Icon = platform.icon

                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${platform.color}`} />
                        <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(adapted.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    {/* Adapted Content */}
                    <div className={`${platform.bgColor} p-4 rounded-lg border mb-4 max-h-96 overflow-y-auto`}>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {adapted.content}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                      {adapted.characterCount && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Character Count</span>
                          <span className="font-medium text-gray-900">{adapted.characterCount}</span>
                        </div>
                      )}

                      {adapted.hashtags && adapted.hashtags.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Suggested Hashtags</p>
                          <div className="flex flex-wrap gap-1">
                            {adapted.hashtags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs bg-white px-2 py-1 rounded border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {adapted.bestTimeToPost && (
                        <div className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                          <span className="text-gray-600">Best Time to Post</span>
                          <span className="font-medium text-gray-900">{adapted.bestTimeToPost}</span>
                        </div>
                      )}

                      {adapted.engagementTips && adapted.engagementTips.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Engagement Tips</p>
                          <ul className="space-y-1">
                            {adapted.engagementTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-xs text-green-600 mt-0.5">→</span>
                                <span className="text-xs text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </>
          ) : (
            <Card className="p-12 text-center">
              <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                Your adapted content will appear here
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Paste your content and select platforms to get started
              </p>
            </Card>
          )}
        </div>
      </div>
      </div>
  )
}
