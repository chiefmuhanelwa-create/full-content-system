'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Trash2, FileText, Calendar, Copy, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SavedStory {
  id: string
  content: string
  source: string
  timestamp: string
  category: string
  isFavorite: boolean
  notes?: string
}

export default function SavedStoriesPage() {
  const router = useRouter()
  const [savedStories, setSavedStories] = useState<SavedStory[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const stored = localStorage.getItem('savedStories')
    if (stored) {
      setSavedStories(JSON.parse(stored))
    }
  }, [])

  const deleteStory = (id: string) => {
    const updated = savedStories.filter(s => s.id !== id)
    setSavedStories(updated)
    localStorage.setItem('savedStories', JSON.stringify(updated))
  }

  const toggleFavorite = (id: string) => {
    const updated = savedStories.map(s =>
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    )
    setSavedStories(updated)
    localStorage.setItem('savedStories', JSON.stringify(updated))
  }

  const useInScript = (story: SavedStory) => {
    localStorage.setItem('tempStoryForScript', JSON.stringify(story))
    router.push('/dashboard/scripts')
  }

  const scheduleToCalendar = (story: SavedStory) => {
    const calendarEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: story.content,
      contentType: 'Story',
      source: story.source,
      sourceTools: ['Story Extractor'],
      status: 'scheduled' as const,
    }

    const existing = localStorage.getItem('calendarEntries')
    const entries = existing ? JSON.parse(existing) : []
    entries.push(calendarEntry)
    localStorage.setItem('calendarEntries', JSON.stringify(entries))

    alert('Story scheduled to calendar!')
  }

  const copyStory = (content: string) => {
    navigator.clipboard.writeText(content)
    alert('Story copied to clipboard!')
  }

  const filteredStories = filter === 'all'
    ? savedStories
    : filter === 'favorites'
    ? savedStories.filter(s => s.isFavorite)
    : savedStories.filter(s => s.category === filter)

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-green-600" />
          Saved Stories Library
        </h1>
        <p className="text-gray-600">Your collection of extracted stories ready to use</p>
      </div>

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
                  <Button size="sm" variant="outline" onClick={() => scheduleToCalendar(story)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyStory(story.content)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
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
  )
}
