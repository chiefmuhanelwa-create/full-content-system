'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Zap,
  Heart,
  Trash2,
  Edit,
  Download,
  Plus,
  Filter,
  X,
  TrendingUp,
  Sparkles,
  Save
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface HookBankEntry {
  id: string
  hookText: string
  hookType: string
  relevant?: string | null
  awarenessLevel: string
  clarity?: string | null
  unique?: string | null
  broadened: boolean
  topic?: string | null
  contentPillar?: string | null
  platform?: string | null
  shadowFear?: string | null
  timesUsed: number
  avgPerformance: number
  isFavorite: boolean
  tags?: any
  notes?: string | null
  createdAt: string
  updatedAt: string
}

interface FormData {
  hookText: string
  hookType: string
  relevant: string
  awarenessLevel: string
  clarity: string
  unique: string
  broadened: boolean
  topic: string
  contentPillar: string
  platform: string
  shadowFear: string
  timesUsed: number
  avgPerformance: number
  isFavorite: boolean
  notes: string
}

export default function HookBankPage() {
  const [hooks, setHooks] = useState<HookBankEntry[]>([])
  const [filteredHooks, setFilteredHooks] = useState<HookBankEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [filterHookType, setFilterHookType] = useState('all')
  const [filterAwarenessLevel, setFilterAwarenessLevel] = useState('all')
  const [filterContentPillar, setFilterContentPillar] = useState('all')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterFavorite, setFilterFavorite] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHook, setEditingHook] = useState<HookBankEntry | null>(null)
  const [saving, setSaving] = useState(false)

  // Form data
  const [formData, setFormData] = useState<FormData>({
    hookText: '',
    hookType: 'question',
    relevant: '',
    awarenessLevel: 'symptom_aware',
    clarity: '',
    unique: '',
    broadened: false,
    topic: '',
    contentPillar: '',
    platform: '',
    shadowFear: '',
    timesUsed: 0,
    avgPerformance: 0,
    isFavorite: false,
    notes: ''
  })

  // Fetch hooks on mount
  useEffect(() => {
    fetchHooks()
  }, [])

  // Apply filters whenever hooks or filter settings change
  useEffect(() => {
    applyFilters()
  }, [hooks, filterHookType, filterAwarenessLevel, filterContentPillar, filterPlatform, filterFavorite, searchQuery])

  const fetchHooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/hook-bank/list')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hooks')
      }

      setHooks(data.hooks)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error fetching hooks:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...hooks]

    // Apply type filter
    if (filterHookType !== 'all') {
      filtered = filtered.filter(h => h.hookType === filterHookType)
    }

    // Apply awareness level filter
    if (filterAwarenessLevel !== 'all') {
      filtered = filtered.filter(h => h.awarenessLevel === filterAwarenessLevel)
    }

    // Apply content pillar filter
    if (filterContentPillar !== 'all') {
      filtered = filtered.filter(h => h.contentPillar === filterContentPillar)
    }

    // Apply platform filter
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(h => h.platform === filterPlatform)
    }

    // Apply favorite filter
    if (filterFavorite) {
      filtered = filtered.filter(h => h.isFavorite)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(h =>
        h.hookText.toLowerCase().includes(query) ||
        h.topic?.toLowerCase().includes(query) ||
        h.relevant?.toLowerCase().includes(query) ||
        h.shadowFear?.toLowerCase().includes(query)
      )
    }

    setFilteredHooks(filtered)
  }

  const openCreateDialog = () => {
    setEditingHook(null)
    setFormData({
      hookText: '',
      hookType: 'question',
      relevant: '',
      awarenessLevel: 'symptom_aware',
      clarity: '',
      unique: '',
      broadened: false,
      topic: '',
      contentPillar: '',
      platform: '',
      shadowFear: '',
      timesUsed: 0,
      avgPerformance: 0,
      isFavorite: false,
      notes: ''
    })
    setDialogOpen(true)
  }

  const openEditDialog = (hook: HookBankEntry) => {
    setEditingHook(hook)
    setFormData({
      hookText: hook.hookText,
      hookType: hook.hookType,
      relevant: hook.relevant || '',
      awarenessLevel: hook.awarenessLevel,
      clarity: hook.clarity || '',
      unique: hook.unique || '',
      broadened: hook.broadened,
      topic: hook.topic || '',
      contentPillar: hook.contentPillar || '',
      platform: hook.platform || '',
      shadowFear: hook.shadowFear || '',
      timesUsed: hook.timesUsed,
      avgPerformance: hook.avgPerformance,
      isFavorite: hook.isFavorite,
      notes: hook.notes || ''
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.hookText.trim()) {
      alert('Hook text is required')
      return
    }

    try {
      setSaving(true)

      const payload = {
        ...formData,
        relevant: formData.relevant || undefined,
        clarity: formData.clarity || undefined,
        unique: formData.unique || undefined,
        topic: formData.topic || undefined,
        contentPillar: formData.contentPillar || undefined,
        platform: formData.platform || undefined,
        shadowFear: formData.shadowFear || undefined,
        notes: formData.notes || undefined,
      }

      if (editingHook) {
        // Update existing hook
        const response = await fetch('/api/hook-bank/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingHook.id,
            ...payload
          })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update hook')
        }
      } else {
        // Create new hook
        const response = await fetch('/api/hook-bank/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create hook')
        }
      }

      setDialogOpen(false)
      fetchHooks()
    } catch (err: any) {
      alert(err.message || 'An error occurred')
      console.error('Error saving hook:', err)
    } finally {
      setSaving(false)
    }
  }

  const toggleFavorite = async (hook: HookBankEntry) => {
    try {
      const response = await fetch('/api/hook-bank/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: hook.id,
          isFavorite: !hook.isFavorite
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle favorite')
      }

      fetchHooks()
    } catch (err: any) {
      alert(err.message || 'An error occurred')
      console.error('Error toggling favorite:', err)
    }
  }

  const deleteHook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hook? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/hook-bank/delete?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete hook')
      }

      fetchHooks()
    } catch (err: any) {
      alert(err.message || 'An error occurred')
      console.error('Error deleting hook:', err)
    }
  }

  const exportToCSV = () => {
    if (filteredHooks.length === 0) {
      alert('No hooks to export')
      return
    }

    const headers = [
      'Hook Text',
      'Hook Type',
      'Relevant',
      'Awareness Level',
      'Clarity',
      'Unique',
      'Broadened',
      'Topic',
      'Content Pillar',
      'Platform',
      'Shadow Fear',
      'Times Used',
      'Avg Performance',
      'Is Favorite',
      'Notes',
      'Created At'
    ]

    const rows = filteredHooks.map(hook => [
      hook.hookText,
      hook.hookType,
      hook.relevant || '',
      hook.awarenessLevel,
      hook.clarity || '',
      hook.unique || '',
      hook.broadened ? 'Yes' : 'No',
      hook.topic || '',
      hook.contentPillar || '',
      hook.platform || '',
      hook.shadowFear || '',
      hook.timesUsed.toString(),
      hook.avgPerformance.toString(),
      hook.isFavorite ? 'Yes' : 'No',
      hook.notes || '',
      new Date(hook.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `hook-bank-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setFilterHookType('all')
    setFilterAwarenessLevel('all')
    setFilterContentPillar('all')
    setFilterPlatform('all')
    setFilterFavorite(false)
    setSearchQuery('')
  }

  const hasActiveFilters = filterHookType !== 'all' ||
    filterAwarenessLevel !== 'all' ||
    filterContentPillar !== 'all' ||
    filterPlatform !== 'all' ||
    filterFavorite ||
    searchQuery.trim() !== ''

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-8 w-8 text-purple-600" />
          Hook Bank
        </h1>
        <p className="text-gray-600">
          Manage your repository of viral hooks with R×A×C×U^B components
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Button onClick={openCreateDialog} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Hook
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredHooks.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search hooks by text, topic, relevance, or shadow fear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <CardTitle>Filters</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hook Type Filter */}
            <div className="space-y-2">
              <Label>Hook Type</Label>
              <Select value={filterHookType} onValueChange={setFilterHookType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="statement">Statement</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="statistic">Statistic</SelectItem>
                  <SelectItem value="challenge">Challenge</SelectItem>
                  <SelectItem value="pattern_interrupt">Pattern Interrupt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Awareness Level Filter */}
            <div className="space-y-2">
              <Label>Awareness Level</Label>
              <Select value={filterAwarenessLevel} onValueChange={setFilterAwarenessLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="symptom_aware">Symptom Aware</SelectItem>
                  <SelectItem value="problem_aware">Problem Aware</SelectItem>
                  <SelectItem value="solution_aware">Solution Aware</SelectItem>
                  <SelectItem value="product_aware">Product Aware</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Pillar Filter */}
            <div className="space-y-2">
              <Label>Content Pillar</Label>
              <Select value={filterContentPillar} onValueChange={setFilterContentPillar}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pillars</SelectItem>
                  <SelectItem value="authority">Authority</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="monetization">Monetization</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform Filter */}
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Favorite Filter */}
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox
              id="favorite-filter"
              checked={filterFavorite}
              onCheckedChange={(checked) => setFilterFavorite(checked as boolean)}
            />
            <label
              htmlFor="favorite-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Show favorites only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hooks.length}</div>
            <p className="text-xs text-gray-600">Total Hooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredHooks.length}</div>
            <p className="text-xs text-gray-600">Filtered Results</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hooks.filter(h => h.isFavorite).length}</div>
            <p className="text-xs text-gray-600">Favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {hooks.length > 0
                ? Math.round(hooks.reduce((sum, h) => sum + h.avgPerformance, 0) / hooks.length)
                : 0}
            </div>
            <p className="text-xs text-gray-600">Avg Performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Hooks List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading hooks...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : filteredHooks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hooks.length === 0 ? 'No hooks yet' : 'No hooks match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {hooks.length === 0
                ? 'Start building your hook bank by adding your first viral hook.'
                : 'Try adjusting your filters or search query.'}
            </p>
            {hooks.length === 0 && (
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Hook
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHooks.map((hook) => (
            <Card key={hook.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Hook Content */}
                  <div className="flex-1 space-y-3">
                    {/* Hook Text */}
                    <div>
                      <p className="text-lg font-medium leading-relaxed">{hook.hookText}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {hook.hookType.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {hook.awarenessLevel.replace('_', ' ')}
                      </span>
                      {hook.contentPillar && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {hook.contentPillar}
                        </span>
                      )}
                      {hook.platform && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {hook.platform}
                        </span>
                      )}
                      {hook.broadened && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          broadened
                        </span>
                      )}
                    </div>

                    {/* R×A×C×U^B Components */}
                    {(hook.relevant || hook.clarity || hook.unique) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        {hook.relevant && (
                          <div className="text-sm">
                            <span className="font-semibold text-gray-700">Relevant:</span>
                            <p className="text-gray-600 mt-1">{hook.relevant}</p>
                          </div>
                        )}
                        {hook.clarity && (
                          <div className="text-sm">
                            <span className="font-semibold text-gray-700">Clarity:</span>
                            <p className="text-gray-600 mt-1">{hook.clarity}</p>
                          </div>
                        )}
                        {hook.unique && (
                          <div className="text-sm">
                            <span className="font-semibold text-gray-700">Unique:</span>
                            <p className="text-gray-600 mt-1">{hook.unique}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {hook.topic && (
                        <div>
                          <span className="font-semibold">Topic:</span> {hook.topic}
                        </div>
                      )}
                      {hook.shadowFear && (
                        <div>
                          <span className="font-semibold">Shadow Fear:</span> {hook.shadowFear}
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">Used:</span> {hook.timesUsed}x
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-semibold">Avg Performance:</span> {hook.avgPerformance}
                      </div>
                    </div>

                    {/* Notes */}
                    {hook.notes && (
                      <div className="text-sm text-gray-600 italic pt-2 border-t">
                        <span className="font-semibold">Notes:</span> {hook.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(hook)}
                      title={hook.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          hook.isFavorite ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(hook)}
                      title="Edit hook"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHook(hook.id)}
                      title="Delete hook"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHook ? 'Edit Hook' : 'Add New Hook'}
            </DialogTitle>
            <DialogDescription>
              {editingHook
                ? 'Update the hook details and R×A×C×U^B components.'
                : 'Create a new hook with R×A×C×U^B components.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Hook Text */}
            <div className="space-y-2">
              <Label htmlFor="hookText">Hook Text *</Label>
              <Textarea
                id="hookText"
                placeholder="Enter your hook text..."
                value={formData.hookText}
                onChange={(e) => setFormData({ ...formData, hookText: e.target.value })}
                rows={3}
              />
            </div>

            {/* Hook Type and Awareness Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hookType">Hook Type *</Label>
                <Select
                  value={formData.hookType}
                  onValueChange={(value) => setFormData({ ...formData, hookType: value })}
                >
                  <SelectTrigger id="hookType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="statement">Statement</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="statistic">Statistic</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="pattern_interrupt">Pattern Interrupt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awarenessLevel">Awareness Level *</Label>
                <Select
                  value={formData.awarenessLevel}
                  onValueChange={(value) => setFormData({ ...formData, awarenessLevel: value })}
                >
                  <SelectTrigger id="awarenessLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symptom_aware">Symptom Aware</SelectItem>
                    <SelectItem value="problem_aware">Problem Aware</SelectItem>
                    <SelectItem value="solution_aware">Solution Aware</SelectItem>
                    <SelectItem value="product_aware">Product Aware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* R×A×C×U^B Components */}
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900">R×A×C×U^B Components</h4>

              <div className="space-y-2">
                <Label htmlFor="relevant">Relevant (R)</Label>
                <Input
                  id="relevant"
                  placeholder="Why this matters to the target audience..."
                  value={formData.relevant}
                  onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clarity">Clarity (C)</Label>
                <Input
                  id="clarity"
                  placeholder="Clear outcome promise..."
                  value={formData.clarity}
                  onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unique">Unique (U)</Label>
                <Input
                  id="unique"
                  placeholder="Pattern interrupt element..."
                  value={formData.unique}
                  onChange={(e) => setFormData({ ...formData, unique: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="broadened"
                  checked={formData.broadened}
                  onCheckedChange={(checked) => setFormData({ ...formData, broadened: checked as boolean })}
                />
                <label
                  htmlFor="broadened"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Broadened (B) - Accessible to wider audience
                </label>
              </div>
            </div>

            {/* Categorization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Brand Deals, Algorithm..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentPillar">Content Pillar</Label>
                <Select
                  value={formData.contentPillar}
                  onValueChange={(value) => setFormData({ ...formData, contentPillar: value })}
                >
                  <SelectTrigger id="contentPillar">
                    <SelectValue placeholder="Select pillar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="authority">Authority</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="monetization">Monetization</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shadowFear">Shadow Fear</Label>
                <Input
                  id="shadowFear"
                  placeholder="e.g., invisibility, wasted_potential..."
                  value={formData.shadowFear}
                  onChange={(e) => setFormData({ ...formData, shadowFear: e.target.value })}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timesUsed">Times Used</Label>
                <Input
                  id="timesUsed"
                  type="number"
                  min="0"
                  value={formData.timesUsed}
                  onChange={(e) => setFormData({ ...formData, timesUsed: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgPerformance">Average Performance</Label>
                <Input
                  id="avgPerformance"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.avgPerformance}
                  onChange={(e) => setFormData({ ...formData, avgPerformance: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>

            {/* Favorite */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFavorite"
                checked={formData.isFavorite}
                onCheckedChange={(checked) => setFormData({ ...formData, isFavorite: checked as boolean })}
              />
              <label
                htmlFor="isFavorite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Mark as favorite
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingHook ? 'Update Hook' : 'Create Hook'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
