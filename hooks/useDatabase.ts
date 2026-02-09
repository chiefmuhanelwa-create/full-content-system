'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface Hook {
  id: string
  content: string
  topic: string
  platform: string
  duration?: string
  tone?: string
  hookType?: string
  category?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

interface Script {
  id: string
  title: string
  content: string
  platform: string
  duration: string
  goal: string
  breakdown?: any
  visuals?: any
  overlays?: any
  category?: string
  isFavorite: boolean
  hookId?: string
  createdAt: string
  updatedAt: string
}

interface Story {
  id: string
  title: string
  content: string
  storyType: string
  isSpecial: boolean
  isRelevant: boolean
  isQuantifiable: boolean
  hasNames: boolean
  beforeState?: string
  afterState?: string
  timeframe?: string
  metrics?: any
  category?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export function useDatabase() {
  const sessionHook = useSession()
  const { data: session, status } = sessionHook ?? { data: null, status: 'loading' as const }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hooks operations
  const saveHook = useCallback(async (hook: Omit<Hook, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to save hooks')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/hooks/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hook),
      })

      if (!response.ok) {
        throw new Error('Failed to save hook')
      }

      const data = await response.json()
      return data.hook
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save hook')
      return null
    } finally {
      setLoading(false)
    }
  }, [status])

  const listHooks = useCallback(async (filters?: { platform?: string; category?: string; isFavorite?: boolean }) => {
    if (status !== 'authenticated') {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters?.platform) params.append('platform', filters.platform)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.isFavorite) params.append('isFavorite', 'true')

      const response = await fetch(`/api/hooks/list?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch hooks')
      }

      const data = await response.json()
      return data.hooks as Hook[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hooks')
      return []
    } finally {
      setLoading(false)
    }
  }, [status])

  const deleteHook = useCallback(async (id: string) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to delete hooks')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/hooks/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete hook')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete hook')
      return false
    } finally {
      setLoading(false)
    }
  }, [status])

  // Scripts operations
  const saveScript = useCallback(async (script: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to save scripts')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/scripts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(script),
      })

      if (!response.ok) {
        throw new Error('Failed to save script')
      }

      const data = await response.json()
      return data.script
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save script')
      return null
    } finally {
      setLoading(false)
    }
  }, [status])

  const listScripts = useCallback(async (filters?: { platform?: string; category?: string; isFavorite?: boolean }) => {
    if (status !== 'authenticated') {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters?.platform) params.append('platform', filters.platform)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.isFavorite) params.append('isFavorite', 'true')

      const response = await fetch(`/api/scripts/list?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch scripts')
      }

      const data = await response.json()
      return data.scripts as Script[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scripts')
      return []
    } finally {
      setLoading(false)
    }
  }, [status])

  const updateScript = useCallback(async (id: string, updates: Partial<Script>) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to update scripts')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/scripts/update?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update script')
      }

      const data = await response.json()
      return data.script
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update script')
      return null
    } finally {
      setLoading(false)
    }
  }, [status])

  const deleteScript = useCallback(async (id: string) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to delete scripts')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/scripts/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete script')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete script')
      return false
    } finally {
      setLoading(false)
    }
  }, [status])

  // Stories operations
  const saveStory = useCallback(async (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to save stories')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stories/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      })

      if (!response.ok) {
        throw new Error('Failed to save story')
      }

      const data = await response.json()
      return data.story
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save story')
      return null
    } finally {
      setLoading(false)
    }
  }, [status])

  const listStories = useCallback(async (filters?: { storyType?: string; category?: string; isFavorite?: boolean }) => {
    if (status !== 'authenticated') {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters?.storyType) params.append('storyType', filters.storyType)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.isFavorite) params.append('isFavorite', 'true')

      const response = await fetch(`/api/stories/list?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch stories')
      }

      const data = await response.json()
      return data.stories as Story[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories')
      return []
    } finally {
      setLoading(false)
    }
  }, [status])

  const deleteStory = useCallback(async (id: string) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to delete stories')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stories/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete story')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story')
      return false
    } finally {
      setLoading(false)
    }
  }, [status])

  return {
    loading,
    error,
    isAuthenticated: status === 'authenticated',
    // Hooks
    saveHook,
    listHooks,
    deleteHook,
    // Scripts
    saveScript,
    listScripts,
    updateScript,
    deleteScript,
    // Stories
    saveStory,
    listStories,
    deleteStory,
  }
}
