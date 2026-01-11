'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ============================================================================
// NOCHILL Content Integration Context
// Enables all 7 tools to communicate and share data
// ============================================================================

interface Hook {
  id: string
  content: string
  type: 'information_gap' | 'desired_result' | 'undesired_result' | 'a_to_b_transformation'
  platform: string
  createdAt: string
}

interface Script {
  id: string
  hook: string
  fullScript: string
  platform: string
  duration: string
  createdAt: string
}

interface Story {
  id: string
  title: string
  content: string
  metrics: {
    before: string
    after: string
    timeframe: string
  }
  createdAt: string
}

interface Fear {
  id: number
  name: string
  relevance: number
  hooks: string[]
  targetAudience: string
  createdAt: string
}

interface CalendarEntry {
  id: string
  date: string
  title: string
  category: '40% Educate' | '30% Entertain' | '20% Encourage' | '10% Earn'
  platform: string
  notes: string
  sourceTools: string[] // Which tools were used to create this
  hookId?: string
  scriptId?: string
  storyId?: string
}

interface RevenueEntry {
  id: string
  date: string
  amount: number
  stream: 'Products' | 'Ads/Affiliates' | 'Information' | 'Deals' | 'Services'
  description: string
  contentId?: string // Link to content that generated revenue
}

interface ContentContextType {
  // Hooks state
  hooks: Hook[]
  addHook: (hook: Omit<Hook, 'id' | 'createdAt'>) => Hook
  selectedHook: Hook | null
  selectHook: (hook: Hook | null) => void

  // Scripts state
  scripts: Script[]
  addScript: (script: Omit<Script, 'id' | 'createdAt'>) => Script
  selectedScript: Script | null
  selectScript: (script: Script | null) => void

  // Stories state
  stories: Story[]
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => Story
  selectedStory: Story | null
  selectStory: (story: Story | null) => void

  // Fears state
  fears: Fear[]
  addFear: (fear: Omit<Fear, 'createdAt'>) => Fear
  selectedFears: Fear[]
  selectFears: (fears: Fear[]) => void

  // Calendar state
  calendarEntries: CalendarEntry[]
  addToCalendar: (entry: Omit<CalendarEntry, 'id'>) => CalendarEntry
  removeFromCalendar: (id: string) => void

  // Revenue state
  revenueEntries: RevenueEntry[]
  addRevenue: (entry: Omit<RevenueEntry, 'id'>) => RevenueEntry
  removeRevenue: (id: string) => void

  // Quick actions
  createScriptFromHook: (hookId: string) => void
  addContentToCalendar: (content: { title: string; platform: string; sourceTools: string[] }) => void

  // Cross-tool navigation state
  pendingAction: {
    action: 'use-hook-in-script' | 'use-story-in-script' | 'target-fear-in-hooks' | null
    data: any
  }
  setPendingAction: (action: { action: string; data: any } | null) => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  // Hooks
  const [hooks, setHooks] = useState<Hook[]>([])
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null)

  // Scripts
  const [scripts, setScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)

  // Stories
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  // Fears
  const [fears, setFears] = useState<Fear[]>([])
  const [selectedFears, setSelectedFears] = useState<Fear[]>([])

  // Calendar
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([])

  // Revenue
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([])

  // Pending actions for cross-tool navigation
  const [pendingAction, setPendingAction] = useState<{
    action: 'use-hook-in-script' | 'use-story-in-script' | 'target-fear-in-hooks' | null
    data: any
  }>({ action: null, data: null })

  // Hook operations
  const addHook = useCallback((hook: Omit<Hook, 'id' | 'createdAt'>) => {
    const newHook: Hook = {
      ...hook,
      id: `hook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setHooks(prev => [newHook, ...prev])
    return newHook
  }, [])

  const selectHook = useCallback((hook: Hook | null) => {
    setSelectedHook(hook)
  }, [])

  // Script operations
  const addScript = useCallback((script: Omit<Script, 'id' | 'createdAt'>) => {
    const newScript: Script = {
      ...script,
      id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setScripts(prev => [newScript, ...prev])
    return newScript
  }, [])

  const selectScript = useCallback((script: Script | null) => {
    setSelectedScript(script)
  }, [])

  // Story operations
  const addStory = useCallback((story: Omit<Story, 'id' | 'createdAt'>) => {
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setStories(prev => [newStory, ...prev])
    return newStory
  }, [])

  const selectStory = useCallback((story: Story | null) => {
    setSelectedStory(story)
  }, [])

  // Fear operations
  const addFear = useCallback((fear: Omit<Fear, 'createdAt'>) => {
    const newFear: Fear = {
      ...fear,
      createdAt: new Date().toISOString(),
    }
    setFears(prev => {
      // Update if exists, add if new
      const existing = prev.findIndex(f => f.id === fear.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newFear
        return updated
      }
      return [newFear, ...prev]
    })
    return newFear
  }, [])

  const selectFears = useCallback((fears: Fear[]) => {
    setSelectedFears(fears)
  }, [])

  // Calendar operations
  const addToCalendar = useCallback((entry: Omit<CalendarEntry, 'id'>) => {
    const newEntry: CalendarEntry = {
      ...entry,
      id: `cal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setCalendarEntries(prev => [...prev, newEntry].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ))
    return newEntry
  }, [])

  const removeFromCalendar = useCallback((id: string) => {
    setCalendarEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  // Revenue operations
  const addRevenue = useCallback((entry: Omit<RevenueEntry, 'id'>) => {
    const newEntry: RevenueEntry = {
      ...entry,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setRevenueEntries(prev => [...prev, newEntry].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ))
    return newEntry
  }, [])

  const removeRevenue = useCallback((id: string) => {
    setRevenueEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  // Quick actions
  const createScriptFromHook = useCallback((hookId: string) => {
    const hook = hooks.find(h => h.id === hookId)
    if (hook) {
      setSelectedHook(hook)
      setPendingAction({ action: 'use-hook-in-script', data: hook })
    }
  }, [hooks])

  const addContentToCalendar = useCallback((content: {
    title: string
    platform: string
    sourceTools: string[]
  }) => {
    addToCalendar({
      date: new Date().toISOString().split('T')[0],
      title: content.title,
      category: '40% Educate', // Default
      platform: content.platform,
      notes: `Created with: ${content.sourceTools.join(', ')}`,
      sourceTools: content.sourceTools,
    })
  }, [addToCalendar])

  const value: ContentContextType = {
    // Hooks
    hooks,
    addHook,
    selectedHook,
    selectHook,

    // Scripts
    scripts,
    addScript,
    selectedScript,
    selectScript,

    // Stories
    stories,
    addStory,
    selectedStory,
    selectStory,

    // Fears
    fears,
    addFear,
    selectedFears,
    selectFears,

    // Calendar
    calendarEntries,
    addToCalendar,
    removeFromCalendar,

    // Revenue
    revenueEntries,
    addRevenue,
    removeRevenue,

    // Quick actions
    createScriptFromHook,
    addContentToCalendar,

    // Pending actions
    pendingAction,
    setPendingAction,
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

// Export types for use in other components
export type { Hook, Script, Story, Fear, CalendarEntry, RevenueEntry }
