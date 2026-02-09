'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookOpen, Sparkles, Copy, Check, AlertCircle, ArrowRight, Save, Database } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

interface StoryMetrics {
  before: string
  after: string
  timeframe: string
}

interface StoryCriteria {
  special: boolean
  relevant: boolean
  quantifiable: boolean
  named: boolean
}

interface ExtractedStory {
  title: string
  content: string
  type: string
  criteria: StoryCriteria
  metrics: StoryMetrics
  useCase: string
}

export default function StoryExtractorPage() {
  const router = useRouter()
  const { addStory, setPendingAction } = useContent()

  const [storyInput, setStoryInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState<ExtractedStory[]>([])
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const extractStories = async () => {
    if (!storyInput.trim()) {
      setError('Please enter your story or experiences')
      return
    }

    setLoading(true)
    setError('')
    setStories([])

    try {
      const response = await fetch('/api/stories/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: {
            'Your Story': storyInput,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract stories')
      }

      // Set local state
      setStories(data.stories)

      // Also save to global context for cross-tool communication
      data.stories.forEach((story: ExtractedStory) => {
        addStory({
          title: story.title,
          content: story.content,
          metrics: story.metrics,
        })
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error extracting stories:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyStory = (story: ExtractedStory, index: number) => {
    const storyText = `${story.title}

${story.content}

Transformation:
Before: ${story.metrics.before}
After: ${story.metrics.after}
Timeframe: ${story.metrics.timeframe}

Use Case: ${story.useCase}
`
    navigator.clipboard.writeText(storyText)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getCriteriaCount = (criteria: StoryCriteria) => {
    return Object.values(criteria).filter(Boolean).length
  }

  const saveStory = (story: ExtractedStory) => {
    const savedStory = {
      id: Date.now().toString(),
      content: story.content,
      source: story.title,
      timestamp: new Date().toISOString(),
      category: story.type,
      isFavorite: false,
      notes: `${story.metrics.before} → ${story.metrics.after} (${story.metrics.timeframe})`,
    }

    const existing = localStorage.getItem('savedStories')
    const stories = existing ? JSON.parse(existing) : []
    stories.unshift(savedStory)
    localStorage.setItem('savedStories', JSON.stringify(stories))

    alert('Story saved to your library!')
  }

  const saveToStoryBank = async (story: ExtractedStory) => {
    try {
      const response = await fetch('/api/story-bank/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyKey: story.title,
          storyTitle: story.title,
          storySnippet: story.content.substring(0, 150),
          fullStoryVersion: story.content,
          isSpecial: story.criteria.special,
          isRelevant: story.criteria.relevant,
          isQuantifiable: story.criteria.quantifiable,
          hasNames: story.criteria.named,
          transformationBefore: story.metrics.before,
          transformationAfter: story.metrics.after,
          timeframe: story.metrics.timeframe,
          emotionBefore: 'uncertain',
          emotionAfter: 'confident',
          useCases: [story.useCase],
          contentPillar: '',
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
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-purple-600" />
          Story Extractor
        </h1>
        <p className="text-gray-600">
          Extract proof stories using Genesis Framework (Origin, Struggle, Transformation, Breakthrough, Lesson) and 4-Criteria Test
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Story or Experience</CardTitle>
              <CardDescription>
                Share your achievements, transformations, or client results. The AI will extract powerful proof stories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea
                  id="story"
                  placeholder="Example: I started as a broke creator making R750/month. After 90 days of using the NOCHILL system, I scaled to R100,000/month. I went from posting 3 times a day with no strategy to posting once with a system. My first brand deal was R8,333 for a single post..."
                  rows={12}
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Include: numbers, timeframes, specific results, before/after states
                </p>
              </div>

              <Button
                onClick={extractStories}
                disabled={loading || !storyInput.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Stories...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Extract Proof Stories
                  </>
                )}
              </Button>

              {/* 4-Criteria Info */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-sm font-semibold text-purple-600 mb-2">
                  4-Criteria Test:
                </p>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>✅ <strong>Special:</strong> Unique, memorable moment</li>
                  <li>✅ <strong>Relevant:</strong> Connects to audience's goals</li>
                  <li>✅ <strong>Quantifiable:</strong> Has specific numbers/metrics</li>
                  <li>✅ <strong>Named:</strong> Includes real names/brands/places</li>
                </ul>
                <p className="text-xs text-purple-600 mt-2">
                  Stories must pass 3 of 4 criteria to be effective
                </p>
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
          {stories.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">
                Extracted Stories ({stories.length})
              </h2>
              {stories.map((story, index) => (
                <Card key={index} className="border-l-4 border-purple-600">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {story.type.charAt(0).toUpperCase() + story.type.slice(1)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveStory(story)}
                          className="gap-1"
                          title="Save to Library"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveToStoryBank(story)}
                          className="gap-1 border-purple-300 hover:bg-purple-50"
                          title="Save to Story Bank"
                        >
                          <Database className="h-3 w-3 text-purple-600" />
                          Bank
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Save story to context and navigate to Script Writer
                            const savedStory = addStory({
                              title: story.title,
                              content: story.content,
                              metrics: story.metrics,
                            })
                            setPendingAction({
                              action: 'use-story-in-script',
                              data: savedStory,
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
                          variant="ghost"
                          size="sm"
                          onClick={() => copyStory(story, index)}
                          title="Copy story"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{story.content}</p>

                    {/* Metrics */}
                    <div className="p-3 bg-gray-50 rounded-md space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Transformation:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Before:</span>
                          <p className="font-medium text-gray-900">{story.metrics.before}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">After:</span>
                          <p className="font-medium text-gray-900">{story.metrics.after}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium text-gray-900">{story.metrics.timeframe}</p>
                        </div>
                      </div>
                    </div>

                    {/* Criteria Check */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-600">
                        Criteria ({getCriteriaCount(story.criteria)}/4):
                      </span>
                      <div className="flex gap-2">
                        {story.criteria.special && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Special
                          </span>
                        )}
                        {story.criteria.relevant && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Relevant
                          </span>
                        )}
                        {story.criteria.quantifiable && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Quantifiable
                          </span>
                        )}
                        {story.criteria.named && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            Named
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Use Case */}
                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                      <p className="text-xs font-semibold text-purple-600 mb-1">Best Use:</p>
                      <p className="text-xs text-purple-700">{story.useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No stories extracted yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Enter your story or experience in the left panel and click "Extract Proof Stories"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
