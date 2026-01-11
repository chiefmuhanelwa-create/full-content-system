'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Zap, Copy, Heart, Trash2, Sparkles, ArrowRight, Calendar as CalendarIcon, Target, X, Save } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

interface Hook {
  id: string
  content: string
  likes: number
}

export default function HookGeneratorPage() {
  const router = useRouter()
  const { addHook, setPendingAction, addContentToCalendar, selectedFears, pendingAction } = useContent()

  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [duration, setDuration] = useState('60s')
  const [tone, setTone] = useState('educational')
  const [hookType, setHookType] = useState('any')
  const [targetAudience, setTargetAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Hook[]>([])
  const [error, setError] = useState('')
  const [targetedFear, setTargetedFear] = useState<{ id: number; name: string; relevance: number } | null>(null)

  // Check for pending action from Fear Analyzer
  useEffect(() => {
    if (pendingAction.action === 'target-fear-in-hooks' && pendingAction.data) {
      const fear = pendingAction.data
      setTargetedFear({
        id: fear.id,
        name: fear.name,
        relevance: fear.relevance,
      })
      setTargetAudience(fear.targetAudience || '')
      // Clear pending action
      setPendingAction(null)
    }
  }, [pendingAction, setPendingAction])

  const generateHooks = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/hooks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          platform,
          duration,
          tone,
          hookType,
          targetAudience: targetAudience.trim() || undefined,
          targetFear: targetedFear ? {
            id: targetedFear.id,
            name: targetedFear.name,
            relevance: targetedFear.relevance,
          } : undefined,
          count: 5,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate hooks')
      }

      // Transform hooks into objects with IDs and save to context
      const generatedHooks: Hook[] = data.hooks.map((content: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        content,
        likes: 0,
      }))

      // Save to local state for display
      setHooks(generatedHooks)

      // Also save to global context for cross-tool communication
      generatedHooks.forEach((hook) => {
        addHook({
          content: hook.content,
          type: hookType !== 'any' ? hookType as any : 'information_gap', // Default type
          platform,
        })
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error generating hooks:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyHook = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const likeHook = (id: string) => {
    setHooks((prev) =>
      prev.map((hook) =>
        hook.id === id ? { ...hook, likes: hook.likes + 1 } : hook
      )
    )
  }

  const deleteHook = (id: string) => {
    setHooks((prev) => prev.filter((hook) => hook.id !== id))
  }

  const saveHook = (hook: any) => {
    const savedHook = {
      id: Date.now().toString(),
      content: hook.content,
      hookType: hookType,
      platform: platform,
      timestamp: new Date().toISOString(),
      isFavorite: false,
      targetAudience: targetAudience,
      notes: '',
    }

    const existing = localStorage.getItem('savedHooks')
    const hooks = existing ? JSON.parse(existing) : []
    hooks.unshift(savedHook)
    localStorage.setItem('savedHooks', JSON.stringify(hooks))

    alert('Hook saved to your library!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          Hook Generator
        </h1>
        <p className="text-gray-600">
          Generate viral hooks using the R×A×C×U^B formula
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Viral Hooks</CardTitle>
          <CardDescription>
            Enter your topic and preferences to generate scroll-stopping hooks
          </CardDescription>

          {/* Targeted Fear Badge */}
          {targetedFear && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Targeting Shadow Fear: {targetedFear.name}
                  </p>
                  <p className="text-xs text-purple-600">
                    Relevance: {targetedFear.relevance}% | Hooks will address this specific fear
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTargetedFear(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., 'brand deals for small creators'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Target Audience Input */}
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., 'creators making R0-5K/month' or 'small business owners'"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Be specific for better results. Who is this hook for?
            </p>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15s">15 seconds</SelectItem>
                <SelectItem value="30s">30 seconds</SelectItem>
                <SelectItem value="60s">60 seconds</SelectItem>
                <SelectItem value="90s">90 seconds</SelectItem>
                <SelectItem value="3min">3 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="entertaining">Entertaining</SelectItem>
                <SelectItem value="inspiring">Inspiring</SelectItem>
                <SelectItem value="controversial">Controversial</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hook Type Selection - R×A×C×U^B Hook Science */}
          <div className="space-y-2">
            <Label htmlFor="hookType">Hook Type (Component C: Clarity of Outcome)</Label>
            <Select value={hookType} onValueChange={setHookType}>
              <SelectTrigger id="hookType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="information_gap">🔍 Information Gap - Reveal missing crucial context</SelectItem>
                <SelectItem value="desired_result">🎯 Desired Result - Promise specific achievable outcome</SelectItem>
                <SelectItem value="undesired_result">⚠️ Undesired Result - Call out mistake & consequences</SelectItem>
                <SelectItem value="a_to_b_transformation">🔄 A-to-B Transformation - Show pathway from wrong to right</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Based on R×A×C×U^B Hook Science. These are proven psychological outcome patterns.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateHooks}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Hooks...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate 5 Hooks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Hooks Display */}
      {hooks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Generated Hooks ({hooks.length})</h2>

          {hooks.map((hook, index) => (
            <Card key={hook.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">Hook #{index + 1}</div>
                    <p className="text-lg font-medium leading-relaxed">{hook.content}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => likeHook(hook.id)}
                      title="Like this hook"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          hook.likes > 0 ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                    {hook.likes > 0 && (
                      <span className="text-sm text-gray-500">{hook.likes}</span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyHook(hook.content)}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveHook(hook)}
                      title="Save to library"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Save hook to context and navigate to Script Writer
                        const savedHook = addHook({
                          content: hook.content,
                          type: hookType !== 'any' ? hookType as any : 'information_gap',
                          platform,
                        })
                        setPendingAction({
                          action: 'use-hook-in-script',
                          data: savedHook,
                        })
                        router.push('/dashboard/scripts')
                      }}
                      className="gap-1"
                      title="Use in Script Writer"
                    >
                      <ArrowRight className="h-3 w-3" />
                      Script
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addContentToCalendar({
                          title: hook.content.substring(0, 50) + '...',
                          platform,
                          sourceTools: ['Hook Generator'],
                        })
                        // Show toast or notification (optional)
                      }}
                      className="gap-1"
                      title="Add to Content Calendar"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHook(hook.id)}
                      title="Delete hook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button onClick={generateHooks} disabled={loading} className="flex-1">
              Generate More
            </Button>
            <Button variant="outline" className="flex-1">
              Save All to Hook Bank
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {hooks.length === 0 && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hooks generated yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Enter your topic and preferences above, then click "Generate 5 Hooks" to
              create viral hooks using the NOCHILL framework.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
