'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  contentIdeas,
  storyVariations,
  vaultCategories,
  storyThemes,
  getContentIdeasByCategory,
  getStoriesByTheme,
  type ContentIdea,
  type StoryVariation,
} from '@/lib/vaultData'
import {
  Lightbulb,
  BookOpen,
  Zap,
  Calendar,
  Copy,
  Search,
  Filter,
  Star,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StoryVaultBrowserProps {
  onSelectContent?: (content: ContentIdea) => void
  onSelectStory?: (story: StoryVariation) => void
}

export default function StoryVaultBrowser({
  onSelectContent,
  onSelectStory,
}: StoryVaultBrowserProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('financial')
  const [selectedTheme, setSelectedTheme] = useState<string>('origin')
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterHookType, setFilterHookType] = useState<string>('all')
  const [filterShadowFear, setFilterShadowFear] = useState<string>('all')

  // Get filtered content and stories
  const categoryContents = getContentIdeasByCategory(selectedCategory)
  const themeStories = getStoriesByTheme(selectedTheme)

  const filteredContents = categoryContents.filter((content) => {
    const matchesSearch =
      searchQuery === '' ||
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesHookType = filterHookType === 'all' || content.hookType === filterHookType
    const matchesShadowFear =
      filterShadowFear === 'all' || content.shadowFear.includes(filterShadowFear)

    return matchesSearch && matchesHookType && matchesShadowFear
  })

  const filteredStories = themeStories.filter((story) => {
    const matchesSearch =
      searchQuery === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.lesson.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesHookType = filterHookType === 'all' || story.hookType === filterHookType
    const matchesShadowFear =
      filterShadowFear === 'all' || story.shadowFear.includes(filterShadowFear)

    return matchesSearch && matchesHookType && matchesShadowFear
  })

  const selectedContent = filteredContents.find((c) => c.id === selectedContentId)
  const selectedStory = filteredStories.find((s) => s.id === selectedStoryId)

  // Integration actions
  const generateHookFromContent = (content: ContentIdea) => {
    const hookData = {
      contentIdea: content.title,
      description: content.description,
      hookType: content.hookType,
      shadowFear: content.shadowFear[0],
      platform: content.targetPlatform[0],
    }
    localStorage.setItem('vaultToHookGenerator', JSON.stringify(hookData))
    router.push('/dashboard/hooks')
  }

  const generateHookFromStory = (story: StoryVariation) => {
    const hookData = {
      story: story.snippet,
      hookType: story.hookType,
      shadowFear: story.shadowFear[0],
      lesson: story.lesson,
    }
    localStorage.setItem('vaultToHookGenerator', JSON.stringify(hookData))
    router.push('/dashboard/hooks')
  }

  const createScriptFromContent = (content: ContentIdea) => {
    const scriptData = {
      idea: content.title,
      description: content.description,
      platform: content.targetPlatform[0],
      duration: content.estimatedDuration,
      frameworks: content.frameworks,
    }
    localStorage.setItem('vaultToScriptWriter', JSON.stringify(scriptData))
    router.push('/dashboard/scripts')
  }

  const createScriptFromStory = (story: StoryVariation) => {
    const scriptData = {
      story: story.snippet,
      lesson: story.lesson,
      hookType: story.hookType,
      emotion: story.emotion,
      timeframe: story.timeframe,
    }
    localStorage.setItem('vaultToScriptWriter', JSON.stringify(scriptData))
    router.push('/dashboard/scripts')
  }

  const scheduleToCalendar = (item: ContentIdea | StoryVariation, type: 'content' | 'story') => {
    const calendarEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: type === 'content' ? (item as ContentIdea).title : (item as StoryVariation).snippet,
      contentType: type === 'content' ? 'Content Idea' : 'Story',
      source: 'Story Vault',
      sourceTools: ['Vault'],
      status: 'scheduled' as const,
      metadata: item,
    }

    const existing = localStorage.getItem('calendarEntries')
    const entries = existing ? JSON.parse(existing) : []
    entries.push(calendarEntry)
    localStorage.setItem('calendarEntries', JSON.stringify(entries))
    alert(`${type === 'content' ? 'Content idea' : 'Story'} scheduled to calendar!`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vault by keyword, title, or lesson..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterHookType}
                onChange={(e) => setFilterHookType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Hook Types</option>
                <option value="information_gap">Information Gap</option>
                <option value="desired_result">Desired Result</option>
                <option value="undesired_result">Undesired Result</option>
                <option value="a_to_b_transformation">A-to-B Transformation</option>
              </select>
              <select
                value={filterShadowFear}
                onChange={(e) => setFilterShadowFear(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Shadow Fears</option>
                <option value="Financial Insecurity">Financial Insecurity</option>
                <option value="Rejection">Rejection</option>
                <option value="Being Average">Being Average</option>
                <option value="Platform Dependency">Platform Dependency</option>
                <option value="Burnout">Burnout</option>
                <option value="Being Ignored">Being Ignored</option>
                <option value="Wasted Effort">Wasted Effort</option>
                <option value="Loss of Control">Loss of Control</option>
                <option value="Failure">Failure</option>
                <option value="Being Invisible">Being Invisible</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-Column Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Categories */}
        <Card className="h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Content Categories
            </CardTitle>
            <CardDescription>{vaultCategories.length} categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {vaultCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedContentId(null)
                }}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{category.name}</div>
                    <div
                      className={`text-xs ${
                        selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {getContentIdeasByCategory(category.id).length} ideas
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div className="pt-6 mt-6 border-t">
              <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Story Themes
              </div>
              {storyThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id)
                    setSelectedStoryId(null)
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-all mb-2 ${
                    selectedTheme === theme.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{theme.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-xs">{theme.name}</div>
                      <div
                        className={`text-xs ${
                          selectedTheme === theme.id ? 'text-purple-100' : 'text-gray-500'
                        }`}
                      >
                        {getStoriesByTheme(theme.id).length} stories
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MIDDLE COLUMN: Content Ideas */}
        <Card className="h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-lg">
              {vaultCategories.find((c) => c.id === selectedCategory)?.name}
            </CardTitle>
            <CardDescription>
              {filteredContents.length} content ideas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                onClick={() => setSelectedContentId(content.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedContentId === content.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-sm mb-2">{content.title}</div>
                <div className="text-xs text-gray-600 mb-3">{content.description}</div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {content.hookType.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {content.estimatedDuration}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {content.frameworks.slice(0, 3).map((framework, idx) => (
                    <Badge key={idx} className="text-xs bg-purple-100 text-purple-700">
                      {framework}
                    </Badge>
                  ))}
                </div>

                {selectedContentId === content.id && (
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        generateHookFromContent(content)
                      }}
                      className="flex-1 text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Generate Hook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        createScriptFromContent(content)
                      }}
                      className="flex-1 text-xs"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Create Script
                    </Button>
                  </div>
                )}

                {selectedContentId === content.id && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        scheduleToCalendar(content, 'content')
                      }}
                      className="flex-1 text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(`${content.title}\n\n${content.description}`)
                      }}
                      className="flex-1 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredContents.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No content ideas match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Story Variations */}
        <Card className="h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-lg">
              {storyThemes.find((t) => t.id === selectedTheme)?.name}
            </CardTitle>
            <CardDescription>
              {filteredStories.length} story variations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStoryId === story.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold text-sm mb-2">{story.title}</div>
                <div className="text-xs text-gray-700 mb-3 italic">"{story.snippet}"</div>

                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {story.hookType.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {story.timeframe}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  <strong>Emotion:</strong> {story.emotion}
                </div>
                <div className="text-xs text-green-700 mb-3">
                  <strong>Lesson:</strong> {story.lesson}
                </div>

                {story.numbers && (
                  <div className="bg-blue-50 p-2 rounded text-xs mb-3">
                    <div className="font-semibold mb-1">Numbers:</div>
                    {story.numbers.before && <div>Before: {story.numbers.before}</div>}
                    {story.numbers.after && <div>After: {story.numbers.after}</div>}
                    {story.numbers.timeline && <div>Timeline: {story.numbers.timeline}</div>}
                  </div>
                )}

                {selectedStoryId === story.id && (
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        generateHookFromStory(story)
                      }}
                      className="flex-1 text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Generate Hook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        createScriptFromStory(story)
                      }}
                      className="flex-1 text-xs"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Create Script
                    </Button>
                  </div>
                )}

                {selectedStoryId === story.id && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        scheduleToCalendar(story, 'story')
                      }}
                      className="flex-1 text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(story.snippet)
                      }}
                      className="flex-1 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredStories.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No stories match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{contentIdeas.length}</div>
              <div className="text-sm text-gray-600">Total Content Ideas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{storyVariations.length}</div>
              <div className="text-sm text-gray-600">Story Variations</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{vaultCategories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{storyThemes.length}</div>
              <div className="text-sm text-gray-600">Story Themes</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
