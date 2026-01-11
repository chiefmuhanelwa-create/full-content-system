'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Trash2, FileText, Calendar, Copy, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SavedHook {
  id: string
  content: string
  hookType: string
  platform: string
  timestamp: string
  isFavorite: boolean
  targetAudience?: string
  notes?: string
}

export default function SavedHooksPage() {
  const router = useRouter()
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const stored = localStorage.getItem('savedHooks')
    if (stored) {
      setSavedHooks(JSON.parse(stored))
    }
  }, [])

  const deleteHook = (id: string) => {
    const updated = savedHooks.filter(h => h.id !== id)
    setSavedHooks(updated)
    localStorage.setItem('savedHooks', JSON.stringify(updated))
  }

  const toggleFavorite = (id: string) => {
    const updated = savedHooks.map(h =>
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    )
    setSavedHooks(updated)
    localStorage.setItem('savedHooks', JSON.stringify(updated))
  }

  const useInScript = (hook: SavedHook) => {
    localStorage.setItem('tempHookForScript', JSON.stringify(hook))
    router.push('/dashboard/scripts')
  }

  const scheduleToCalendar = (hook: SavedHook) => {
    const calendarEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: hook.content,
      contentType: 'Hook',
      source: hook.hookType,
      sourceTools: ['Hook Generator'],
      status: 'scheduled' as const,
    }

    const existing = localStorage.getItem('calendarEntries')
    const entries = existing ? JSON.parse(existing) : []
    entries.push(calendarEntry)
    localStorage.setItem('calendarEntries', JSON.stringify(entries))

    alert('Hook scheduled to calendar!')
  }

  const copyHook = (content: string) => {
    navigator.clipboard.writeText(content)
    alert('Hook copied to clipboard!')
  }

  const filteredHooks = filter === 'all'
    ? savedHooks
    : filter === 'favorites'
    ? savedHooks.filter(h => h.isFavorite)
    : savedHooks.filter(h => h.hookType === filter)

  const getHookTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      information_gap: '🔍 Information Gap',
      desired_result: '🎯 Desired Result',
      undesired_result: '⚠️ Undesired Result',
      a_to_b_transformation: '🔄 A-to-B Transformation',
    }
    return labels[type] || type
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Zap className="h-10 w-10 text-blue-600" />
          Saved Hooks Library
        </h1>
        <p className="text-gray-600">Your collection of scroll-stopping hooks ready to use</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">{savedHooks.length}</div>
            <p className="text-sm text-gray-600">Total Hooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-600">
              {savedHooks.filter(h => h.isFavorite).length}
            </div>
            <p className="text-sm text-gray-600">Favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">
              {savedHooks.filter(h => h.hookType === 'information_gap').length}
            </div>
            <p className="text-sm text-gray-600">Information Gap</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {savedHooks.filter(h => h.hookType === 'desired_result').length}
            </div>
            <p className="text-sm text-gray-600">Desired Result</p>
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
          All Hooks
        </Button>
        <Button
          variant={filter === 'favorites' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('favorites')}
        >
          ⭐ Favorites
        </Button>
        <Button
          variant={filter === 'information_gap' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('information_gap')}
        >
          🔍 Info Gap
        </Button>
        <Button
          variant={filter === 'desired_result' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('desired_result')}
        >
          🎯 Desired Result
        </Button>
        <Button
          variant={filter === 'undesired_result' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('undesired_result')}
        >
          ⚠️ Undesired Result
        </Button>
        <Button
          variant={filter === 'a_to_b_transformation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('a_to_b_transformation')}
        >
          🔄 A-to-B
        </Button>
      </div>

      {/* Hooks List */}
      {filteredHooks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Zap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-medium">No saved hooks yet</p>
            <p className="text-sm text-gray-500 mt-2">Generate hooks and save them for later use</p>
            <Button onClick={() => router.push('/dashboard/hooks')} className="mt-4">
              Go to Hook Generator
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredHooks.map((hook) => (
            <Card key={hook.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {getHookTypeLabel(hook.hookType)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {hook.platform}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(hook.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {hook.targetAudience && (
                      <CardDescription className="text-xs">For: {hook.targetAudience}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(hook.id)}
                  >
                    <Star className={`h-5 w-5 ${hook.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  "{hook.content}"
                </p>

                {hook.notes && (
                  <div className="p-2 bg-gray-50 rounded mb-4">
                    <p className="text-xs text-gray-600"><strong>Notes:</strong> {hook.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => useInScript(hook)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Use in Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => scheduleToCalendar(hook)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyHook(hook.content)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteHook(hook.id)}>
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
