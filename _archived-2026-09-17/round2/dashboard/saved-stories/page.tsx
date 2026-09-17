'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Trash2, FileText, Calendar, Copy, Star, Loader2, Check } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { useRouter } from 'next/navigation'
import { useDatabase } from '@/hooks/useDatabase'
import { useContent } from '@/contexts/ContentContext'

interface SavedStory {
  id: string
  content: string
  source: string
  timestamp: string
  category: string
  isFavorite: boolean
  notes?: string
  title?: string
}

export default function SavedStoriesPage() {
  const router = useRouter()
  const { listStories, deleteStory: deleteStoryDb, loading } = useDatabase()
  const { setPendingAction } = useContent()
  const [savedStories, setSavedStories] = useState<SavedStory[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [scheduledId, setScheduledId] = useState<string | null>(null)

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    const stories = await listStories()
    const formatted = stories.map((s: any) => ({
      id: s.id,
      content: s.content,
      source: s.storyType,
      timestamp: s.createdAt,
      category: s.category || 'general',
      isFavorite: s.isFavorite,
      notes: s.title,
      title: s.title,
    }))
    setSavedStories(formatted)
  }

  const deleteStory = async (id: string) => {
    const success = await deleteStoryDb(id)
    if (success) {
      setSavedStories(savedStories.filter(s => s.id !== id))
    }
  }

  const toggleFavorite = async (id: string) => {
    const updated = savedStories.map(s =>
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    )
    setSavedStories(updated)
    await loadStories()
  }

  const useInScript = (story: SavedStory) => {
    setPendingAction({ action: 'use-story-in-script', data: { content: story.content || story.notes || '', title: story.title } })
    router.push('/dashboard/scripts')
  }

  const scheduleToCalendar = async (story: SavedStory) => {
    try {
      const res = await fetch('/api/content-calendar-plus/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledDate: new Date().toISOString(),
          title: story.title || story.notes || story.content?.substring(0, 80) || 'Story',
          notes: story.content,
          contentPillar: 'storytelling',
          fourETag: '30% Entertain',
          platform: 'instagram',
          contentType: 'Story',
          status: 'planned',
        }),
      })
      if (res.ok) {
        setScheduledId(story.id)
        setTimeout(() => setScheduledId(null), 2500)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const copyStory = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredStories = filter === 'all'
    ? savedStories
    : filter === 'favorites'
    ? savedStories.filter(s => s.isFavorite)
    : savedStories.filter(s => s.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={BookOpen}
        iconColor="text-green-600"
        eyebrow="Library"
        title="Saved Stories"
        description="Your collection of extracted stories ready to use"
      />
      <div className="px-6 py-8">

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">{savedStories.length}</div>
            <p className="text-sm text-gray-600">Total Stories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-600">
              {savedStories.filter(s => s.isFavorite).length}
            </div>
            <p className="text-sm text-gray-600">Favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">
              {savedStories.filter(s => s.category === 'success').length}
            </div>
            <p className="text-sm text-gray-600">Success Stories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">
              {savedStories.filter(s => s.category === 'failure').length}
            </div>
            <p className="text-sm text-gray-600">Failure Stories</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Stories
        </Button>
        <Button
          variant={filter === 'favorites' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('favorites')}
        >
          ⭐ Favorites
        </Button>
        <Button
          variant={filter === 'success' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('success')}
        >
          Success
        </Button>
        <Button
          variant={filter === 'failure' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('failure')}
        >
          Failure
        </Button>
        <Button
          variant={filter === 'transformation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('transformation')}
        >
          Transformation
        </Button>
      </div>

      {/* Stories List */}
      {filteredStories.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-medium">No saved stories yet</p>
            <p className="text-sm text-gray-500 mt-2">Extract stories and save them for later use</p>
            <Button onClick={() => router.push('/dashboard/stories')} className="mt-4">
              Go to Story Extractor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredStories.map((story) => (
            <Card key={story.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        story.category === 'success' ? 'bg-green-100 text-green-700' :
                        story.category === 'failure' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {story.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(story.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <CardDescription className="text-xs">From: {story.source}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(story.id)}
                  >
                    <Star className={`h-5 w-5 ${story.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 whitespace-pre-wrap">{story.content}</p>

                {story.notes && (
                  <div className="p-2 bg-gray-50 rounded mb-4">
                    <p className="text-xs text-gray-600"><strong>Notes:</strong> {story.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => useInScript(story)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Use in Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => scheduleToCalendar(story)} disabled={scheduledId === story.id}>
                    {scheduledId === story.id ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Calendar className="h-4 w-4 mr-2" />}
                    {scheduledId === story.id ? 'Scheduled!' : 'Schedule'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyStory(story.id, story.content)}>
                    {copiedId === story.id ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedId === story.id ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteStory(story.id)}>
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
