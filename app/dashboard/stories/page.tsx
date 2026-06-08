'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookOpen, Sparkles, Copy, Check, AlertCircle, ArrowRight, Save, Database } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { ToolPageHeader } from '@/components/ToolPageHeader'

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
  const [savedStoryIndices, setSavedStoryIndices] = useState<Set<number>>(new Set())
  const [savedBankIndices, setSavedBankIndices] = useState<Set<number>>(new Set())

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

  const saveStory = async (story: ExtractedStory, index: number) => {
    try {
      await saveToStoryBank(story, index)
    } catch {
      // saveToStoryBank handles its own error state
    }
  }

  const saveToStoryBank = async (story: ExtractedStory, index: number) => {
    try {
      const response = await fetch('/api/story-bank/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyKey: story.title,
          title: story.title,
          snippet: story.content.substring(0, 150),
          fullVersion: story.content,
          isSpecial: story.criteria.special,
          isRelevant: story.criteria.relevant,
          isQuantifiable: story.criteria.quantifiable,
          hasNames: story.criteria.named,
          beforeState: story.metrics.before,
          afterState: story.metrics.after,
          timeframe: story.metrics.timeframe,
          emotion: 'confident',
          lesson: '',
          useFor: story.useCase,
          contentPillars: '',
          timesUsed: 0,
          avgImpact: 0,
          isFavorite: false,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to save story to Story Bank'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      setSavedBankIndices(prev => new Set(prev).add(index))
    } catch (err: any) {
      setError('Error saving to Story Bank: ' + err.message)
      console.error('Error saving to Story Bank:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={BookOpen}
        iconColor="text-purple-600"
        eyebrow="Extract"
        title="Story Extractor"
        description="Extract proof stories using Genesis Framework (Origin, Struggle, Transformation, Breakthrough, Lesson) and 4-Criteria Test"
      />
      <div className="max-w-6xl mx-auto px-6 py-8">
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
              <div className="p-4 bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl">
                <p className="text-xs font-display font-black text-[#1D4ED8] mb-2 uppercase tracking-widest">
                  4-Criteria Test
                </p>
                <ul className="text-xs text-[#52525B] space-y-1">
                  <li>✅ <strong>Special:</strong> Unique, memorable moment</li>
                  <li>✅ <strong>Relevant:</strong> Connects to audience's goals</li>
                  <li>✅ <strong>Quantifiable:</strong> Has specific numbers/metrics</li>
                  <li>✅ <strong>Named:</strong> Includes real names/brands/places</li>
                </ul>
                <p className="text-xs text-[#71717A] mt-2">
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
                <Card key={index} className="border-l-4 border-[#2563EB]">
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
                          onClick={() => saveStory(story, index)}
                          className="gap-1"
                          title="Save to Story Bank"
                          disabled={savedBankIndices.has(index)}
                        >
                          <Save className="h-3 w-3" />
                          {savedBankIndices.has(index) ? 'Saved' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveToStoryBank(story, index)}
                          className="gap-1 border-[#2563EB]/40 hover:bg-[#2563EB]/10"
                          title="Save to Story Bank"
                          disabled={savedBankIndices.has(index)}
                        >
                          <Database className="h-3 w-3 text-[#2563EB]" />
                          {savedBankIndices.has(index) ? 'Banked' : 'Bank'}
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
                    <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E4E4E7] space-y-2">
                      <p className="text-xs font-display font-bold text-[#71717A] uppercase tracking-wide">Transformation</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[#71717A]">Before:</span>
                          <p className="font-display font-bold text-[#18181B]">{story.metrics.before}</p>
                        </div>
                        <div>
                          <span className="text-[#71717A]">After:</span>
                          <p className="font-display font-bold text-[#18181B]">{story.metrics.after}</p>
                        </div>
                        <div>
                          <span className="text-[#71717A]">Time:</span>
                          <p className="font-display font-bold text-[#18181B]">{story.metrics.timeframe}</p>
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
                          <span className="text-xs bg-[#2563EB]/15 text-[#7A5F18] px-2 py-1 rounded font-display font-bold">
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
                    <div className="p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg">
                      <p className="text-xs font-display font-bold text-[#1D4ED8] mb-1 uppercase tracking-wide">Best Use</p>
                      <p className="text-xs text-[#52525B]">{story.useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E4E4E7] flex items-center justify-center mb-5">
                <BookOpen className="h-6 w-6 text-[#2563EB]" />
              </div>
              <h3 className="font-display font-black text-[#18181B] text-lg mb-2">No stories extracted yet</h3>
              <p className="text-[#71717A] text-sm max-w-xs">
                Enter your story or experience on the left and hit Extract.
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
