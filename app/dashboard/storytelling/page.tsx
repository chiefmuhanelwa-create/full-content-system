'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Copy, Save, FileText, Download, Loader2, BookOpen, Lightbulb, Database } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

interface StoryOutput {
  title: string
  framework: string
  fullStory: string
  breakdown: {
    stage: string
    content: string
    duration: string
  }[]
  emotionalBeats: string[]
  hooks: string[]
  applicationTips: string[]
}

const frameworks = [
  { value: 'heros-journey', label: "Hero's Journey", description: '12-stage transformation story', bestFor: 'Personal transformation, origin stories' },
  { value: 'bab', label: 'Before-After-Bridge', description: 'Problem to solution journey', bestFor: 'Transformation stories, testimonials' },
  { value: 'pas', label: 'Problem-Agitate-Solve', description: 'Amplify pain, then provide relief', bestFor: 'Urgent problems, sales content' },
  { value: 'star', label: 'STAR Method', description: 'Situation-Task-Action-Result', bestFor: 'Case studies, client results, credibility' },
  { value: 'three-act', label: 'Three-Act Structure', description: 'Setup, confrontation, resolution', bestFor: 'Long-form content, detailed transformations' },
  { value: 'pixar-spine', label: "Pixar's Story Spine", description: 'Once upon a time... narrative flow', bestFor: 'Engaging narratives, viral content' },
  { value: 'nested-loop', label: 'Nested Loop', description: 'Multiple story loops for attention', bestFor: 'Long-form content, complex stories' },
  { value: 'curiosity-gap', label: 'Curiosity Gap', description: 'Create information gap tension', bestFor: 'Hooks, maintaining attention' },
]

const storyTypes = [
  { value: 'origin', label: 'Origin Story', description: 'Your journey to credibility' },
  { value: 'client-victory', label: 'Client Victory', description: 'Client transformation story' },
  { value: 'framework-teaching', label: 'Framework Teaching', description: 'Teach while storytelling' },
  { value: 'vulnerability', label: 'Vulnerability Story', description: 'Build deep connection' },
  { value: 'contrarian', label: 'Contrarian Take', description: 'Challenge common beliefs' },
  { value: 'case-study', label: 'Case Study', description: 'Detailed result story' },
]

export default function StorytellingStudio() {
  const [selectedFramework, setSelectedFramework] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [storyInput, setStoryInput] = useState('')
  const [coreMessage, setCoreMessage] = useState('')
  const [targetEmotion, setTargetEmotion] = useState('')
  const [duration, setDuration] = useState('90')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<StoryOutput | null>(null)
  const { addScript, setPendingAction } = useContent()

  const generateStory = async () => {
    if (!selectedFramework || !storyInput || !coreMessage) {
      alert('Please select a framework and provide story details')
      return
    }

    // Load voice profile if available
    let voiceProfile = null
    try {
      const savedProfile = localStorage.getItem('voiceProfile')
      if (savedProfile) {
        voiceProfile = JSON.parse(savedProfile)
      }
    } catch (e) {
      console.error('Failed to load voice profile:', e)
    }

    setLoading(true)
    try {
      const response = await fetch('/api/storytelling/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          framework: selectedFramework,
          storyType: selectedType,
          rawStory: storyInput,
          coreMessage,
          targetEmotion,
          duration: parseInt(duration),
          voiceProfile,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate story')
      }

      const data = await response.json()
      setOutput(data)
    } catch (error: any) {
      alert(error.message || 'Failed to generate story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const saveStory = () => {
    if (!output) return

    const stories = JSON.parse(localStorage.getItem('stories') || '[]')
    stories.push({
      id: Date.now(),
      title: output.title,
      framework: output.framework,
      content: output.fullStory,
      breakdown: output.breakdown,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('stories', JSON.stringify(stories))
    alert('Story saved to library!')
  }

  const saveToStoryBank = async () => {
    if (!output) return

    try {
      setLoading(true)
      const response = await fetch('/api/story-bank/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyKey: output.title,
          storyTitle: output.title,
          storySnippet: output.fullStory.substring(0, 150),
          fullStoryVersion: output.fullStory,
          isSpecial: true,
          isRelevant: true,
          isQuantifiable: false,
          hasNames: false,
          transformationBefore: '',
          transformationAfter: '',
          timeframe: duration + 's',
          emotionBefore: 'curious',
          emotionAfter: targetEmotion || 'inspired',
          useCases: [selectedType || 'story'],
          contentPillar: coreMessage || '',
          timesUsed: 0,
          avgImpact: 0,
          isFavorite: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save story to Story Bank')
      }

      alert('Story saved to Story Bank!')
    } catch (err: any) {
      alert('Error saving to Story Bank: ' + err.message)
      console.error('Error saving to Story Bank:', err)
    } finally {
      setLoading(false)
    }
  }

  const useInScriptWriter = () => {
    if (!output) return

    setPendingAction({
      action: 'use-story-in-script',
      data: {
        story: output.fullStory,
        title: output.title,
        framework: output.framework,
      },
    })

    window.location.href = '/dashboard/scripts'
  }

  const exportPDF = () => {
    if (!output) return

    const content = `
STORYTELLING STUDIO OUTPUT
${new Date().toLocaleDateString()}

TITLE: ${output.title}
FRAMEWORK: ${output.framework}
DURATION: ${duration} seconds

═══════════════════════════════════════

FULL STORY:
${output.fullStory}

═══════════════════════════════════════

STORY BREAKDOWN:
${output.breakdown.map(b => `
${b.stage} (${b.duration})
${b.content}
`).join('\n')}

═══════════════════════════════════════

EMOTIONAL BEATS:
${output.emotionalBeats.map((e, i) => `${i + 1}. ${e}`).join('\n')}

═══════════════════════════════════════

SUGGESTED HOOKS:
${output.hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

═══════════════════════════════════════

APPLICATION TIPS:
${output.applicationTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `story-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Storytelling Studio</h1>
            <p className="text-gray-600">Genesis Framework (5 story types) + 7-Stage Story Arc + Proven narrative frameworks</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Genesis Framework</h3>
                <p className="text-xs text-gray-600 mt-1">
                  5 story types: Origin, Struggle, Transformation, Breakthrough, Lesson + 7-Stage Story Arc
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-pink-500">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-pink-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Your Voice, Enhanced</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Maintains your authentic voice while structuring your story
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Full Integration</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Export to Script Writer, generate hooks, save to library
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Story Configuration</h2>

            {/* Framework Selection */}
            <div className="space-y-2 mb-4">
              <Label>Storytelling Framework</Label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a framework..." />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.value} value={fw.value}>
                      <div>
                        <div className="font-medium">{fw.label}</div>
                        <div className="text-xs text-gray-500">{fw.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFramework && (
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Best for:</strong> {frameworks.find(f => f.value === selectedFramework)?.bestFor}
                </p>
              )}
            </div>

            {/* Story Type */}
            <div className="space-y-2 mb-4">
              <Label>Story Type (Optional)</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select story type..." />
                </SelectTrigger>
                <SelectContent>
                  {storyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2 mb-4">
              <Label>Target Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 seconds (Short-form)</SelectItem>
                  <SelectItem value="90">90 seconds (Standard)</SelectItem>
                  <SelectItem value="180">3 minutes (Extended)</SelectItem>
                  <SelectItem value="300">5+ minutes (Long-form)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Story Input */}
            <div className="space-y-2 mb-4">
              <Label>Your Raw Story</Label>
              <Textarea
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                placeholder="Tell your story in your own words. Include:
• What happened (specific details, names, numbers)
• How you felt (emotions, struggles)
• What changed (the transformation)
• What you learned (the lesson)

Example: 'I was working 80-hour weeks, making $3K/month, sleeping 4 hours a night. My wife said she felt like a single parent. I missed my daughter's first steps. One night at 2am, crying in my car, I realized I couldn't keep doing this. I discovered a framework that changed everything. Within 90 days, I was working 30 hours a week and making $15K/month...'"
                rows={12}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                {storyInput.length} characters • Be specific with names, numbers, and sensory details
              </p>
            </div>

            {/* Core Message */}
            <div className="space-y-2 mb-4">
              <Label>Core Message/Takeaway</Label>
              <Textarea
                value={coreMessage}
                onChange={(e) => setCoreMessage(e.target.value)}
                placeholder="What should the audience learn from this story?

Example: 'Working harder isn't the answer. The right system lets you work less and earn more.'"
                rows={3}
                className="text-sm"
              />
            </div>

            {/* Target Emotion */}
            <div className="space-y-2 mb-4">
              <Label>Target Emotion (Optional)</Label>
              <Select value={targetEmotion} onValueChange={setTargetEmotion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select emotion to evoke..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hope">Hope (transformation is possible)</SelectItem>
                  <SelectItem value="fear">Fear (what they'll lose)</SelectItem>
                  <SelectItem value="anger">Anger (at the system/problem)</SelectItem>
                  <SelectItem value="relief">Relief (there's a solution)</SelectItem>
                  <SelectItem value="pride">Pride (they can do this)</SelectItem>
                  <SelectItem value="belonging">Belonging (they're not alone)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateStory}
              disabled={loading || !selectedFramework || !storyInput || !coreMessage}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Crafting Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Story
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {output ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{output.title}</h2>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {output.framework}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(output.fullStory)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Story
                  </Button>
                  <Button size="sm" variant="outline" onClick={saveStory}>
                    <Save className="h-3 w-3 mr-1" />
                    Save to Library
                  </Button>
                  <Button size="sm" variant="outline" onClick={saveToStoryBank} className="border-purple-300 hover:bg-purple-50">
                    <Database className="h-3 w-3 mr-1 text-purple-600" />
                    Save to Story Bank
                  </Button>
                  <Button size="sm" variant="outline" onClick={useInScriptWriter}>
                    <FileText className="h-3 w-3 mr-1" />
                    Use in Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportPDF}>
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>

                {/* Full Story */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Complete Story</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {output.fullStory}
                    </p>
                  </div>
                </div>

                {/* Story Breakdown */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Story Arc Breakdown</h3>
                  <div className="space-y-3">
                    {output.breakdown.map((section, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-700">{section.stage}</span>
                          <span className="text-xs text-gray-500">{section.duration}</span>
                        </div>
                        <p className="text-sm text-gray-700">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotional Beats */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Emotional Journey</h3>
                  <div className="space-y-2">
                    {output.emotionalBeats.map((beat, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-xs font-medium text-pink-600 mt-0.5">→</span>
                        <p className="text-sm text-gray-700">{beat}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Hooks */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Hook Variations</h3>
                  <div className="space-y-2">
                    {output.hooks.map((hook, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">{hook}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(hook)}
                          className="mt-2 h-7 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Hook
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Tips */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Use This Story</h3>
                  <ul className="space-y-2">
                    {output.applicationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs font-medium text-purple-600 mt-0.5">✓</span>
                        <p className="text-sm text-gray-700">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                Your crafted story will appear here
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Fill in the story details and select a framework to get started
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
