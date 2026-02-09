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
import { Zap, Copy, Heart, Trash2, Sparkles, ArrowRight, Calendar as CalendarIcon, Target, X, Save, Download, BookOpen, ChevronDown, ChevronUp, Database } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { get120HooksBank } from '@/lib/knowledge-base'

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

  // NOCHILL 120 Hooks Bank
  const [showHookBank, setShowHookBank] = useState(false)
  const [selectedHookCategory, setSelectedHookCategory] = useState('all')
  const hookBank = get120HooksBank()

  // Check for pending action from Fear Analyzer or Calendar
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
    } else if (pendingAction.action === 'generate-hooks-from-calendar' && pendingAction.data) {
      const entry = pendingAction.data
      setTopic(entry.notes || entry.title)
      setPlatform(entry.platform.toLowerCase())
      // Clear pending action
      setPendingAction(null)
    }
  }, [pendingAction, setPendingAction])

  // Check for vault data integration
  useEffect(() => {
    const vaultData = localStorage.getItem('vaultToHookGenerator')
    if (vaultData) {
      try {
        const data = JSON.parse(vaultData)

        // Pre-fill from content idea
        if (data.contentIdea) {
          setTopic(data.contentIdea)
          if (data.hookType) setHookType(data.hookType)
          if (data.platform) setPlatform(data.platform)
          if (data.shadowFear) {
            // Create targeted fear from vault shadow fear
            setTargetedFear({
              id: Date.now(),
              name: data.shadowFear,
              relevance: 85, // High relevance from vault
            })
          }
        }

        // Pre-fill from story
        if (data.story) {
          setTopic(`Create hook about: ${data.lesson || data.story}`)
          if (data.hookType) setHookType(data.hookType)
          if (data.shadowFear) {
            setTargetedFear({
              id: Date.now(),
              name: data.shadowFear,
              relevance: 85,
            })
          }
        }

        // Clear vault data after loading
        localStorage.removeItem('vaultToHookGenerator')
      } catch (error) {
        console.error('Error loading vault data:', error)
      }
    }
  }, [])

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
      type: hookType,
      platform: platform,
      createdAt: new Date().toISOString(),
    }

    const existing = localStorage.getItem('savedHooks')
    const hooks = existing ? JSON.parse(existing) : []
    hooks.unshift(savedHook)
    localStorage.setItem('savedHooks', JSON.stringify(hooks))

    alert('Hook saved to your library!')
  }

  const saveToHookBank = async (hook: Hook) => {
    try {
      const response = await fetch('/api/hook-bank/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hookText: hook.content,
          hookType: hookType !== 'any' ? hookType : 'question',
          awarenessLevel: 'symptom_aware',
          broadened: false,
          topic: topic || '',
          platform: platform || '',
          timesUsed: 0,
          avgPerformance: 0,
          isFavorite: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save hook to Hook Bank')
      }

      alert('Hook saved to Hook Bank!')
    } catch (err: any) {
      alert('Error saving to Hook Bank: ' + err.message)
      console.error('Error saving to Hook Bank:', err)
    }
  }

  const saveAllToHookBank = async () => {
    if (hooks.length === 0) {
      alert('No hooks to save!')
      return
    }

    setLoading(true)
    let successCount = 0
    let failCount = 0

    for (const hook of hooks) {
      try {
        const response = await fetch('/api/hook-bank/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hookText: hook.content,
            hookType: hookType !== 'any' ? hookType : 'question',
            awarenessLevel: 'symptom_aware',
            broadened: false,
            topic: topic || '',
            platform: platform || '',
            timesUsed: 0,
            avgPerformance: 0,
            isFavorite: false,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          successCount++
        } else {
          failCount++
          console.error('Failed to save hook:', data.error)
        }
      } catch (err: any) {
        failCount++
        console.error('Error saving hook:', err)
      }
    }

    setLoading(false)
    alert(`Saved ${successCount} hooks to Hook Bank${failCount > 0 ? ` (${failCount} failed)` : '!'}`)
  }

  const exportHooksToPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Generated Hooks - ${new Date().toLocaleDateString()}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
              color: #2d3748;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 15px;
            }
            .hook {
              margin-bottom: 30px;
              padding: 20px;
              background: #f7fafc;
              border-left: 4px solid #667eea;
              border-radius: 5px;
            }
            .hook-number {
              font-size: 12px;
              color: #718096;
              margin-bottom: 10px;
            }
            .hook-content {
              font-size: 16px;
              font-weight: 500;
              line-height: 1.6;
            }
            @media print {
              body { padding: 20px; }
              .hook-content { font-size: 14px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Generated Hooks</h1>
            <p>Topic: ${topic}</p>
            <p>Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)} • ${duration}</p>
            <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          ${hooks.map((hook, index) => `
            <div class="hook">
              <div class="hook-number">Hook #${index + 1}</div>
              <div class="hook-content">${hook.content}</div>
            </div>
          `).join('')}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
        </html>
      `
      printWindow.document.write(content)
      printWindow.document.close()
    }
  }

  const filteredHooks = selectedHookCategory === 'all'
    ? hookBank.categories.flatMap(cat => cat.hooks)
    : hookBank.categories.find(cat => cat.id.toString() === selectedHookCategory)?.hooks || []

  const copyBankHook = (hookText: string) => {
    navigator.clipboard.writeText(hookText)
    alert('Hook copied to clipboard!')
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

      {/* NOCHILL 120 Hooks Bank Browser */}
      <Card className="mb-8 border-purple-200">
        <CardHeader className="cursor-pointer" onClick={() => setShowHookBank(!showHookBank)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-900">
                NOCHILL 120 Hooks Bank
              </CardTitle>
            </div>
            {showHookBank ? (
              <ChevronUp className="h-5 w-5 text-purple-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <CardDescription>
            Browse 120 proven hooks across 6 categories from the NOCHILL Viral Scripting Master Guide
          </CardDescription>
        </CardHeader>

        {showHookBank && (
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={selectedHookCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedHookCategory('all')}
                className={selectedHookCategory === 'all' ? 'bg-purple-600' : ''}
              >
                All (120)
              </Button>
              {hookBank.categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedHookCategory === category.id.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedHookCategory(category.id.toString())}
                  className={selectedHookCategory === category.id.toString() ? 'bg-purple-600' : ''}
                >
                  {category.category.split(' & ')[0]} ({category.count})
                </Button>
              ))}
            </div>

            {/* Selected Category Info */}
            {selectedHookCategory !== 'all' && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                {hookBank.categories
                  .filter(cat => cat.id.toString() === selectedHookCategory)
                  .map(category => (
                    <div key={category.id}>
                      <p className="font-semibold text-purple-900">{category.category}</p>
                      <p className="text-sm text-purple-700 mt-1">{category.description}</p>
                      <p className="text-xs text-purple-600 mt-2">
                        <strong>Emotional Impact:</strong> {category.emotional_impact} |
                        <strong> Best for:</strong> {category.best_for.join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {/* Hooks List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredHooks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hooks found</p>
              ) : (
                filteredHooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          {hook.hook}
                        </p>
                        {hook.r_a_c_u_b && (
                          <div className="mt-2 text-xs text-gray-600 space-y-1">
                            <p><strong>Relevant:</strong> {hook.r_a_c_u_b.relevant}</p>
                            <p><strong>Unique:</strong> {hook.r_a_c_u_b.unique}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyBankHook(hook.hook)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTopic(hook.hook)}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-purple-600 italic">
              💡 These hooks are patterns to learn from - use them as inspiration to create your own custom hooks
            </p>
          </CardContent>
        )}
      </Card>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Generated Hooks ({hooks.length})</h2>
            <Button onClick={exportHooksToPDF} variant="outline" className="bg-green-50 hover:bg-green-100 border-green-300">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>

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
                      variant="ghost"
                      size="icon"
                      onClick={() => saveToHookBank(hook)}
                      title="Save to Hook Bank"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Database className="h-4 w-4" />
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
            <Button
              variant="outline"
              className="flex-1 border-purple-300 hover:bg-purple-50"
              onClick={saveAllToHookBank}
              disabled={loading}
            >
              <Database className="mr-2 h-4 w-4 text-purple-600" />
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
