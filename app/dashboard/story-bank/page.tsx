'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BookMarked,
  Plus,
  Edit,
  Trash2,
  Star,
  Download,
  Filter,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ArrowRight,
} from 'lucide-react'

interface StoryBankEntry {
  id: string
  storyKey: string
  title: string
  snippet: string
  fullVersion?: string
  timeframe?: string
  emotion?: string
  lesson?: string
  useFor: any
  contentPillars?: any
  beforeState?: string
  afterState?: string
  specificNumbers?: any
  isSpecial: boolean
  isRelevant: boolean
  isQuantifiable: boolean
  hasNames: boolean
  villain?: string
  shadowFear?: string
  timesUsed: number
  lastUsed?: string
  avgImpact: number
  isFavorite: boolean
  tags?: any
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  favorites: number
  quantifiable: number
  avgImpact: number
}

export default function StoryBankPage() {
  const router = useRouter()
  const [stories, setStories] = useState<StoryBankEntry[]>([])
  const [filteredStories, setFilteredStories] = useState<StoryBankEntry[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, favorites: 0, quantifiable: 0, avgImpact: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<StoryBankEntry | null>(null)

  // Filters
  const [storyKeyFilter, setStoryKeyFilter] = useState('')
  const [quantifiableFilter, setQuantifiableFilter] = useState('all')
  const [favoriteFilter, setFavoriteFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    storyKey: '',
    title: '',
    snippet: '',
    fullVersion: '',
    timeframe: '',
    emotion: '',
    lesson: '',
    useFor: [],
    contentPillars: [],
    beforeState: '',
    afterState: '',
    specificNumbers: {},
    isSpecial: false,
    isRelevant: false,
    isQuantifiable: false,
    hasNames: false,
    villain: '',
    shadowFear: '',
    timesUsed: 0,
    avgImpact: 0,
    isFavorite: false,
    tags: [],
    notes: '',
  })

  // Fetch stories
  const fetchStories = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (storyKeyFilter) params.append('storyKey', storyKeyFilter)
      if (quantifiableFilter !== 'all') params.append('isQuantifiable', quantifiableFilter)
      if (favoriteFilter !== 'all') params.append('isFavorite', favoriteFilter)

      const response = await fetch(`/api/story-bank/list?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stories')
      }

      setStories(data.stories)
      setFilteredStories(data.stories)

      // Calculate stats
      const totalStories = data.stories.length
      const favoriteCount = data.stories.filter((s: StoryBankEntry) => s.isFavorite).length
      const quantifiableCount = data.stories.filter((s: StoryBankEntry) => s.isQuantifiable).length
      const avgImpactValue = totalStories > 0
        ? data.stories.reduce((sum: number, s: StoryBankEntry) => sum + s.avgImpact, 0) / totalStories
        : 0

      setStats({
        total: totalStories,
        favorites: favoriteCount,
        quantifiable: quantifiableCount,
        avgImpact: avgImpactValue,
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error fetching stories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [storyKeyFilter, quantifiableFilter, favoriteFilter])

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.storyKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.lesson?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStories(filtered)
    } else {
      setFilteredStories(stories)
    }
  }, [searchTerm, stories])

  // Reset form
  const resetForm = () => {
    setFormData({
      storyKey: '',
      title: '',
      snippet: '',
      fullVersion: '',
      timeframe: '',
      emotion: '',
      lesson: '',
      useFor: [],
      contentPillars: [],
      beforeState: '',
      afterState: '',
      specificNumbers: {},
      isSpecial: false,
      isRelevant: false,
      isQuantifiable: false,
      hasNames: false,
      villain: '',
      shadowFear: '',
      timesUsed: 0,
      avgImpact: 0,
      isFavorite: false,
      tags: [],
      notes: '',
    })
    setEditingStory(null)
  }

  // Create or update story
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingStory ? '/api/story-bank/update' : '/api/story-bank/create'
      const method = editingStory ? 'PUT' : 'POST'

      const payload = editingStory ? { id: editingStory.id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save story')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchStories()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error saving story:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete story
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/story-bank/delete?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete story')
      }

      fetchStories()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error deleting story:', err)
    } finally {
      setLoading(false)
    }
  }

  // Toggle favorite
  const toggleFavorite = async (story: StoryBankEntry) => {
    try {
      const response = await fetch('/api/story-bank/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: story.id,
          isFavorite: !story.isFavorite,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      fetchStories()
    } catch (err: any) {
      console.error('Error toggling favorite:', err)
    }
  }

  const useInScript = (story: StoryBankEntry) => {
    // Store the story in localStorage for the Script Writer to pick up
    localStorage.setItem('pendingAction', JSON.stringify({
      action: 'use-story-in-script',
      data: {
        title: story.title,
        content: story.fullVersion || story.snippet,
        metrics: {
          before: story.beforeState || '',
          after: story.afterState || '',
          timeframe: story.timeframe || '',
        },
      },
    }))

    // Navigate to Script Writer
    router.push('/dashboard/scripts')
  }

  // Edit story
  const handleEdit = (story: StoryBankEntry) => {
    setEditingStory(story)
    setFormData({
      storyKey: story.storyKey,
      title: story.title,
      snippet: story.snippet,
      fullVersion: story.fullVersion || '',
      timeframe: story.timeframe || '',
      emotion: story.emotion || '',
      lesson: story.lesson || '',
      useFor: story.useFor || [],
      contentPillars: story.contentPillars || [],
      beforeState: story.beforeState || '',
      afterState: story.afterState || '',
      specificNumbers: story.specificNumbers || {},
      isSpecial: story.isSpecial,
      isRelevant: story.isRelevant,
      isQuantifiable: story.isQuantifiable,
      hasNames: story.hasNames,
      villain: story.villain || '',
      shadowFear: story.shadowFear || '',
      timesUsed: story.timesUsed,
      avgImpact: story.avgImpact,
      isFavorite: story.isFavorite,
      tags: story.tags || [],
      notes: story.notes || '',
    })
    setIsDialogOpen(true)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Story Key',
      'Title',
      'Snippet',
      'Before State',
      'After State',
      'Timeframe',
      'Emotion',
      'Lesson',
      'Times Used',
      'Avg Impact',
      'Is Special',
      'Is Relevant',
      'Is Quantifiable',
      'Has Names',
      'Is Favorite',
    ]

    const rows = filteredStories.map((story) => [
      story.storyKey,
      story.title,
      story.snippet,
      story.beforeState || '',
      story.afterState || '',
      story.timeframe || '',
      story.emotion || '',
      story.lesson || '',
      story.timesUsed,
      story.avgImpact,
      story.isSpecial ? 'Yes' : 'No',
      story.isRelevant ? 'Yes' : 'No',
      story.isQuantifiable ? 'Yes' : 'No',
      story.hasNames ? 'Yes' : 'No',
      story.isFavorite ? 'Yes' : 'No',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map(cell => `"${cell}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `story-bank-${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get criteria count
  const getCriteriaCount = (story: StoryBankEntry) => {
    return [story.isSpecial, story.isRelevant, story.isQuantifiable, story.hasNames].filter(Boolean).length
  }

  // Handle array inputs for useFor and contentPillars
  const handleArrayInput = (field: 'useFor' | 'contentPillars', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean)
    setFormData({ ...formData, [field]: array })
  }

  // Handle JSON input for specificNumbers
  const handleSpecificNumbersInput = (field: 'before' | 'after', value: string) => {
    setFormData({
      ...formData,
      specificNumbers: {
        ...formData.specificNumbers,
        [field]: value,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <BookMarked className="h-8 w-8 text-purple-600" />
          Story Bank
        </h1>
        <p className="text-gray-600">
          Manage your personal stories and proof moments for authentic content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stories</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookMarked className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quantifiable</p>
                <p className="text-2xl font-bold">{stats.quantifiable}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Impact</p>
                <p className="text-2xl font-bold">{stats.avgImpact.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by title, snippet, story key, or lesson..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="h-4 w-4" />
                New Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStory ? 'Edit Story' : 'Create New Story'}
                </DialogTitle>
                <DialogDescription>
                  Add a personal story to your bank. Required fields are marked with *
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Story Identity */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Story Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storyKey">Story Key *</Label>
                      <Input
                        id="storyKey"
                        value={formData.storyKey}
                        onChange={(e) => setFormData({ ...formData, storyKey: e.target.value })}
                        placeholder="e.g., bathroom_floor, brand_deals"
                        required
                      />
                      <p className="text-xs text-gray-500">Unique identifier for this story</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Short, memorable title"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="snippet">Snippet (Short Version) *</Label>
                      <Textarea
                        id="snippet"
                        value={formData.snippet}
                        onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
                        placeholder="5-20 second version of your story"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullVersion">Full Version</Label>
                      <Textarea
                        id="fullVersion"
                        value={formData.fullVersion}
                        onChange={(e) => setFormData({ ...formData, fullVersion: e.target.value })}
                        placeholder="Extended version for long-form content"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                {/* Story Structure */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Story Structure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Input
                        id="timeframe"
                        value={formData.timeframe}
                        onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                        placeholder="e.g., 5-8s, 10-12s, 15-18s"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emotion">Emotion Arc</Label>
                      <Input
                        id="emotion"
                        value={formData.emotion}
                        onChange={(e) => setFormData({ ...formData, emotion: e.target.value })}
                        placeholder="e.g., Vulnerability → Triumph"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lesson">Core Lesson</Label>
                      <Textarea
                        id="lesson"
                        value={formData.lesson}
                        onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                        placeholder="What's the key takeaway from this story?"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Use Cases</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="useFor">Use For (comma-separated) *</Label>
                      <Input
                        id="useFor"
                        value={Array.isArray(formData.useFor) ? formData.useFor.join(', ') : ''}
                        onChange={(e) => handleArrayInput('useFor', e.target.value)}
                        placeholder="e.g., Resilience, Transformation, Origin story"
                        required
                      />
                      <p className="text-xs text-gray-500">When should you use this story?</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentPillars">Content Pillars (comma-separated)</Label>
                      <Input
                        id="contentPillars"
                        value={Array.isArray(formData.contentPillars) ? formData.contentPillars.join(', ') : ''}
                        onChange={(e) => handleArrayInput('contentPillars', e.target.value)}
                        placeholder="e.g., authority, education, story"
                      />
                    </div>
                  </div>
                </div>

                {/* Transformation & Numbers */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Transformation & Proof</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beforeState">Before State</Label>
                      <Input
                        id="beforeState"
                        value={formData.beforeState}
                        onChange={(e) => setFormData({ ...formData, beforeState: e.target.value })}
                        placeholder="Where you started"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="afterState">After State</Label>
                      <Input
                        id="afterState"
                        value={formData.afterState}
                        onChange={(e) => setFormData({ ...formData, afterState: e.target.value })}
                        placeholder="Where you ended up"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specificNumbersBefore">Specific Numbers (Before)</Label>
                      <Input
                        id="specificNumbersBefore"
                        value={(formData.specificNumbers as any)?.before || ''}
                        onChange={(e) => handleSpecificNumbersInput('before', e.target.value)}
                        placeholder="e.g., R750 per post"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specificNumbersAfter">Specific Numbers (After)</Label>
                      <Input
                        id="specificNumbersAfter"
                        value={(formData.specificNumbers as any)?.after || ''}
                        onChange={(e) => handleSpecificNumbersInput('after', e.target.value)}
                        placeholder="e.g., R100K per deal"
                      />
                    </div>
                  </div>
                </div>

                {/* 4-Criteria Test */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">4-Criteria Test (Proof Stories)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isSpecial"
                        checked={formData.isSpecial}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isSpecial: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="isSpecial"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is Special - Unique, memorable moment
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isRelevant"
                        checked={formData.isRelevant}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isRelevant: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="isRelevant"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is Relevant - Connects to audience goals
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isQuantifiable"
                        checked={formData.isQuantifiable}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isQuantifiable: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="isQuantifiable"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is Quantifiable - Has specific numbers/metrics
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasNames"
                        checked={formData.hasNames}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, hasNames: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="hasNames"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Has Names - Includes real names/brands/places
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                    Stories should pass 3 of 4 criteria to be effective proof stories
                  </p>
                </div>

                {/* Villain & Shadow Fear */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Context & Targeting</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="villain">Villain</Label>
                      <Input
                        id="villain"
                        value={formData.villain}
                        onChange={(e) => setFormData({ ...formData, villain: e.target.value })}
                        placeholder="e.g., algorithm_myth, platform_dependency"
                      />
                      <p className="text-xs text-gray-500">What/who was the antagonist?</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shadowFear">Shadow Fear</Label>
                      <Input
                        id="shadowFear"
                        value={formData.shadowFear}
                        onChange={(e) => setFormData({ ...formData, shadowFear: e.target.value })}
                        placeholder="e.g., invisibility, wasted_potential"
                      />
                      <p className="text-xs text-gray-500">Which shadow fear does this address?</p>
                    </div>
                  </div>
                </div>

                {/* Usage Tracking */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Usage Tracking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timesUsed">Times Used</Label>
                      <Input
                        id="timesUsed"
                        type="number"
                        value={formData.timesUsed}
                        onChange={(e) =>
                          setFormData({ ...formData, timesUsed: parseInt(e.target.value) || 0 })
                        }
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avgImpact">Average Impact (0-10)</Label>
                      <Input
                        id="avgImpact"
                        type="number"
                        step="0.1"
                        value={formData.avgImpact}
                        onChange={(e) =>
                          setFormData({ ...formData, avgImpact: parseFloat(e.target.value) || 0 })
                        }
                        min="0"
                        max="10"
                      />
                      <p className="text-xs text-gray-500">Average performance when included in content</p>
                    </div>
                  </div>
                </div>

                {/* Favorite & Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Additional Info</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFavorite"
                        checked={formData.isFavorite}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isFavorite: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="isFavorite"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mark as Favorite
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes or context"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingStory ? 'Update' : 'Create'} Story</>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStoryKeyFilter('')
                  setQuantifiableFilter('all')
                  setFavoriteFilter('all')
                }}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Story Key</Label>
                <Input
                  placeholder="Filter by story key"
                  value={storyKeyFilter}
                  onChange={(e) => setStoryKeyFilter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantifiable</Label>
                <Select value={quantifiableFilter} onValueChange={setQuantifiableFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Quantifiable Only</SelectItem>
                    <SelectItem value="false">Non-Quantifiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Favorites</Label>
                <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Favorites Only</SelectItem>
                    <SelectItem value="false">Non-Favorites</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stories Grid */}
      {loading && filteredStories.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : filteredStories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchTerm || storyKeyFilter || quantifiableFilter !== 'all' || favoriteFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Create your first story to start building your story bank'}
            </p>
            {!searchTerm && !storyKeyFilter && quantifiableFilter === 'all' && favoriteFilter === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Story
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {story.storyKey}
                      </span>
                      {getCriteriaCount(story) >= 3 && (
                        <span title="Passes 4-Criteria Test">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(story)}
                    className="h-8 w-8 p-0"
                  >
                    <Star
                      className={`h-4 w-4 ${story.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Snippet */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Snippet</p>
                  <p className="text-sm line-clamp-3">{story.snippet}</p>
                </div>

                {/* Transformation */}
                {(story.beforeState || story.afterState) && (
                  <div className="p-3 bg-gray-50 rounded-md space-y-1">
                    <p className="text-xs font-semibold text-gray-600">Transformation:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {story.beforeState && (
                        <div>
                          <span className="text-gray-500">Before:</span>
                          <p className="font-medium text-gray-900">{story.beforeState}</p>
                        </div>
                      )}
                      {story.afterState && (
                        <div>
                          <span className="text-gray-500">After:</span>
                          <p className="font-medium text-gray-900">{story.afterState}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4-Criteria Test */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    4-Criteria Test ({getCriteriaCount(story)}/4):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {story.isSpecial && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Special
                      </span>
                    )}
                    {story.isRelevant && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Relevant
                      </span>
                    )}
                    {story.isQuantifiable && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Quantifiable
                      </span>
                    )}
                    {story.hasNames && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        Named
                      </span>
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Times Used</p>
                      <p className="text-sm font-semibold">{story.timesUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Avg Impact</p>
                      <p className="text-sm font-semibold">{story.avgImpact.toFixed(1)}</p>
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                {Array.isArray(story.useFor) && story.useFor.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Use For:</p>
                    <div className="flex flex-wrap gap-1">
                      {story.useFor.map((use: string, idx: number) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useInScript(story)}
                    className="flex-1 border-blue-300 hover:bg-blue-50"
                  >
                    <ArrowRight className="h-3 w-3 mr-1 text-blue-600" />
                    Use in Script
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(story)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
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
