'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  List,
  Download,
  Edit,
  Star,
  Filter,
  X,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { useContent } from '@/contexts/ContentContext'
import { Zap, FileText, ArrowRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface ContentCalendarEntry {
  id: string
  scheduledDate: string
  publishTime?: string
  title: string
  description?: string
  contentPillar: string
  fourETag: string
  platform: string
  contentType: string
  status: string
  completionPct: number
  campaignName?: string
  targetViews?: number
  targetEngagement?: number
  isPriority: boolean
  color?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

type ViewMode = 'grid' | 'list'

const STATUS_OPTIONS = [
  'planned',
  'drafted',
  'scripting',
  'shooting',
  'editing',
  'scheduled',
  'published'
]

const CONTENT_PILLAR_OPTIONS = [
  'authority',
  'education',
  'monetization',
  'story',
  'conversion'
]

const FOUR_E_OPTIONS = [
  'educate',
  'entertain',
  'encourage',
  'earn'
]

const PLATFORM_OPTIONS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'Twitter'
]

const CONTENT_TYPE_OPTIONS = [
  'reel',
  'tiktok',
  'youtube_short',
  'youtube_long',
  'story',
  'carousel',
  'thread'
]

export default function ContentCalendarPlusPage() {
  const router = useRouter()
  const { setPendingAction } = useContent()

  const openHookGenerator = (entry: ContentCalendarEntry) => {
    setPendingAction({
      action: 'generate-hooks-from-calendar',
      data: { title: entry.title, notes: entry.notes || entry.description || '', platform: entry.platform },
    })
    router.push('/dashboard/hooks')
  }

  const openScriptWriter = (entry: ContentCalendarEntry) => {
    setPendingAction({
      action: 'generate-script-from-calendar',
      data: { title: entry.title, notes: entry.notes || entry.description || '', platform: entry.platform },
    })
    router.push('/dashboard/scripts')
  }
  const [entries, setEntries] = useState<ContentCalendarEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    contentPillar: '',
    fourETag: '',
    platform: '',
    isPriority: '',
    startDate: '',
    endDate: ''
  })

  const [newEntry, setNewEntry] = useState<Partial<ContentCalendarEntry>>({
    scheduledDate: new Date().toISOString().split('T')[0],
    publishTime: '09:00',
    title: '',
    description: '',
    contentPillar: 'education',
    fourETag: 'educate',
    platform: 'Instagram',
    contentType: 'reel',
    status: 'planned',
    completionPct: 0,
    campaignName: '',
    targetViews: undefined,
    targetEngagement: undefined,
    isPriority: false,
    notes: ''
  })

  // Fetch entries from API
  const fetchEntries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.contentPillar) params.append('contentPillar', filters.contentPillar)
      if (filters.fourETag) params.append('fourETag', filters.fourETag)
      if (filters.platform) params.append('platform', filters.platform)
      if (filters.isPriority) params.append('isPriority', filters.isPriority)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/content-calendar-plus/list?${params}`)
      const data = await response.json()

      if (data.success) {
        setEntries(data.calendarEntries)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [filters])

  // Create or update entry
  const saveEntry = async () => {
    if (!newEntry.title?.trim()) return

    try {
      const url = editingId
        ? '/api/content-calendar-plus/update'
        : '/api/content-calendar-plus/create'

      const body = editingId
        ? { id: editingId, ...newEntry }
        : newEntry

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (data.success) {
        await fetchEntries()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save entry:', error)
    }
  }

  // Delete entry
  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this calendar entry?')) return

    try {
      const response = await fetch(`/api/content-calendar-plus/delete?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchEntries()
      }
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  // Start editing
  const startEditing = (entry: ContentCalendarEntry) => {
    setEditingId(entry.id)
    setNewEntry({
      scheduledDate: entry.scheduledDate.split('T')[0],
      publishTime: entry.publishTime || '09:00',
      title: entry.title,
      description: entry.description,
      contentPillar: entry.contentPillar,
      fourETag: entry.fourETag,
      platform: entry.platform,
      contentType: entry.contentType,
      status: entry.status,
      completionPct: entry.completionPct,
      campaignName: entry.campaignName,
      targetViews: entry.targetViews,
      targetEngagement: entry.targetEngagement,
      isPriority: entry.isPriority,
      notes: entry.notes
    })
  }

  // Reset form
  const resetForm = () => {
    setEditingId(null)
    setNewEntry({
      scheduledDate: new Date().toISOString().split('T')[0],
      publishTime: '09:00',
      title: '',
      description: '',
      contentPillar: 'education',
      fourETag: 'educate',
      platform: 'Instagram',
      contentType: 'reel',
      status: 'planned',
      completionPct: 0,
      campaignName: '',
      targetViews: undefined,
      targetEngagement: undefined,
      isPriority: false,
      notes: ''
    })
  }

  // Toggle priority
  const togglePriority = async (id: string, currentPriority: boolean) => {
    try {
      const response = await fetch('/api/content-calendar-plus/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPriority: !currentPriority })
      })

      const data = await response.json()

      if (data.success) {
        await fetchEntries()
      }
    } catch (error) {
      console.error('Failed to toggle priority:', error)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    if (entries.length === 0) return

    const headers = [
      'Date',
      'Time',
      'Title',
      'Description',
      'Content Pillar',
      '4E Tag',
      'Platform',
      'Content Type',
      'Status',
      'Completion %',
      'Campaign',
      'Target Views',
      'Target Engagement',
      'Priority',
      'Notes'
    ]

    const rows = entries.map(entry => [
      new Date(entry.scheduledDate).toLocaleDateString(),
      entry.publishTime || '',
      entry.title,
      entry.description || '',
      entry.contentPillar,
      entry.fourETag,
      entry.platform,
      entry.contentType,
      entry.status,
      entry.completionPct,
      entry.campaignName || '',
      entry.targetViews || '',
      entry.targetEngagement || '',
      entry.isPriority ? 'Yes' : 'No',
      entry.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-calendar-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'drafted':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'scripting':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'shooting':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'editing':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'scheduled':
        return 'bg-cyan-100 text-cyan-700 border-cyan-300'
      case 'published':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // Get 4E color
  const getFourEColor = (tag: string) => {
    switch (tag) {
      case 'educate':
        return 'bg-blue-500 text-white'
      case 'entertain':
        return 'bg-purple-500 text-white'
      case 'encourage':
        return 'bg-green-500 text-white'
      case 'earn':
        return 'bg-orange-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  // Get pillar color
  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'authority':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'education':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'monetization':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'story':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'conversion':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // Calendar grid functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return entries.filter(entry => entry.scheduledDate.split('T')[0] === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEntries = getEntriesForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isToday ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-50'
          } cursor-pointer transition-colors`}
          onClick={() => {
            setNewEntry({ ...newEntry, scheduledDate: date.toISOString().split('T')[0] })
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayEntries.length > 0 && (
              <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                {dayEntries.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {dayEntries.slice(0, 2).map(entry => (
              <div
                key={entry.id}
                className={`text-xs p-1.5 rounded border ${getStatusColor(entry.status)} truncate group relative`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1 truncate">
                  {entry.isPriority && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
                  <span className="truncate">{entry.title}</span>
                </div>
              </div>
            ))}
            {dayEntries.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayEntries.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  // Get stats
  const getStats = () => {
    const total = entries.length
    const byStatus = STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = entries.filter(e => e.status === status).length
      return acc
    }, {} as Record<string, number>)

    const by4E = FOUR_E_OPTIONS.reduce((acc, tag) => {
      acc[tag] = entries.filter(e => e.fourETag === tag).length
      return acc
    }, {} as Record<string, number>)

    const priority = entries.filter(e => e.isPriority).length

    return { total, byStatus, by4E, priority }
  }

  const stats = getStats()

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  )

  const clearFilters = () => {
    setFilters({
      status: '',
      contentPillar: '',
      fourETag: '',
      platform: '',
      isPriority: '',
      startDate: '',
      endDate: ''
    })
  }

  // Show loading state while checking authentication
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={CalendarIcon}
        iconColor="text-purple-600"
        eyebrow="Plan"
        title="Content Calendar Plus"
        description="Advanced content planning with production tracking and performance goals"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-300"
            disabled={entries.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
            {viewMode === 'grid' ? 'List View' : 'Calendar View'}
          </Button>
        </div>
      </ToolPageHeader>
      <div className="px-6 py-8">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.priority}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Educate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.by4E.educate || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Entertain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.by4E.entertain || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Encourage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.by4E.encourage || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Earn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.by4E.earn || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add/Edit Content Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Content' : 'Add Content'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update your calendar entry' : 'Schedule new content to your calendar'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newEntry.scheduledDate}
                  onChange={(e) => setNewEntry({ ...newEntry, scheduledDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishTime">Time</Label>
                <Input
                  id="publishTime"
                  type="time"
                  value={newEntry.publishTime}
                  onChange={(e) => setNewEntry({ ...newEntry, publishTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Content title"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the content"
                rows={2}
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentPillar">Content Pillar *</Label>
                <Select
                  value={newEntry.contentPillar}
                  onValueChange={(value) => setNewEntry({ ...newEntry, contentPillar: value })}
                >
                  <SelectTrigger id="contentPillar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_PILLAR_OPTIONS.map(pillar => (
                      <SelectItem key={pillar} value={pillar}>
                        {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fourETag">4E Tag *</Label>
                <Select
                  value={newEntry.fourETag}
                  onValueChange={(value) => setNewEntry({ ...newEntry, fourETag: value })}
                >
                  <SelectTrigger id="fourETag">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FOUR_E_OPTIONS.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={newEntry.platform}
                  onValueChange={(value) => setNewEntry({ ...newEntry, platform: value })}
                >
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type *</Label>
                <Select
                  value={newEntry.contentType}
                  onValueChange={(value) => setNewEntry({ ...newEntry, contentType: value })}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPE_OPTIONS.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newEntry.status}
                  onValueChange={(value) => setNewEntry({ ...newEntry, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionPct">Completion %</Label>
                <Input
                  id="completionPct"
                  type="number"
                  min="0"
                  max="100"
                  value={newEntry.completionPct}
                  onChange={(e) => setNewEntry({ ...newEntry, completionPct: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="Campaign or series name"
                value={newEntry.campaignName}
                onChange={(e) => setNewEntry({ ...newEntry, campaignName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetViews">Target Views</Label>
                <Input
                  id="targetViews"
                  type="number"
                  placeholder="10000"
                  value={newEntry.targetViews || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, targetViews: parseInt(e.target.value) || undefined })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetEngagement">Target Engagement %</Label>
                <Input
                  id="targetEngagement"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={newEntry.targetEngagement || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, targetEngagement: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Production notes, ideas, etc."
                rows={3}
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPriority"
                checked={newEntry.isPriority}
                onCheckedChange={(checked) => setNewEntry({ ...newEntry, isPriority: checked as boolean })}
              />
              <Label htmlFor="isPriority" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mark as Priority
              </Label>
            </div>

            {editingId ? (
              <div className="flex gap-2">
                <Button onClick={saveEntry} disabled={!newEntry.title?.trim()} className="flex-1">
                  Save Changes
                </Button>
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={saveEntry} disabled={!newEntry.title?.trim()} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Calendar/List View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="filterStatus" className="text-xs">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger id="filterStatus" className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filterPillar" className="text-xs">Content Pillar</Label>
                  <Select
                    value={filters.contentPillar}
                    onValueChange={(value) => setFilters({ ...filters, contentPillar: value })}
                  >
                    <SelectTrigger id="filterPillar" className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {CONTENT_PILLAR_OPTIONS.map(pillar => (
                        <SelectItem key={pillar} value={pillar}>
                          {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter4E" className="text-xs">4E Tag</Label>
                  <Select
                    value={filters.fourETag}
                    onValueChange={(value) => setFilters({ ...filters, fourETag: value })}
                  >
                    <SelectTrigger id="filter4E" className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {FOUR_E_OPTIONS.map(tag => (
                        <SelectItem key={tag} value={tag}>
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filterPlatform" className="text-xs">Platform</Label>
                  <Select
                    value={filters.platform}
                    onValueChange={(value) => setFilters({ ...filters, platform: value })}
                  >
                    <SelectTrigger id="filterPlatform" className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {PLATFORM_OPTIONS.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filterPriority" className="text-xs">Priority</Label>
                  <Select
                    value={filters.isPriority}
                    onValueChange={(value) => setFilters({ ...filters, isPriority: value })}
                  >
                    <SelectTrigger id="filterPriority" className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      <SelectItem value="true">Priority Only</SelectItem>
                      <SelectItem value="false">Non-Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filterDateRange" className="text-xs">Date Range</Label>
                  <div className="flex gap-1">
                    <Input
                      type="date"
                      className="h-9 text-xs"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <Input
                      type="date"
                      className="h-9 text-xs"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {viewMode === 'grid' ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <CardDescription>{entries.length} items scheduled</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0 border-t border-l">
                  {renderCalendarGrid()}
                </div>

                {/* Status Legend */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-3">Status Progression:</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(status => (
                      <Badge key={status} className={`${getStatusColor(status)} border`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Content List ({entries.length})</CardTitle>
                <CardDescription>Your scheduled content with detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3 animate-spin" />
                    <p className="text-gray-500 text-sm">Loading content...</p>
                  </div>
                ) : sortedEntries.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {sortedEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {entry.isPriority && (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                              )}
                              <p className="font-semibold">{entry.title}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(entry.scheduledDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              {entry.publishTime && ` at ${entry.publishTime}`}
                            </p>
                            {entry.description && (
                              <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePriority(entry.id, entry.isPriority)}
                              title={entry.isPriority ? 'Remove priority' : 'Mark as priority'}
                            >
                              <Star className={`h-4 w-4 ${entry.isPriority ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(entry)}
                              title="Edit entry"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEntry(entry.id)}
                              title="Delete entry"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Badge className={`${getStatusColor(entry.status)} border text-xs`}>
                            {entry.status}
                          </Badge>
                          <Badge className={`${getPillarColor(entry.contentPillar)} border text-xs`}>
                            {entry.contentPillar}
                          </Badge>
                          <Badge className={`${getFourEColor(entry.fourETag)} text-xs`}>
                            {entry.fourETag}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {entry.platform}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {entry.contentType.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Completion</span>
                            <span className="text-xs font-semibold text-gray-700">{entry.completionPct}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${entry.completionPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {entry.campaignName && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Target className="h-3 w-3" />
                              <span>Campaign: {entry.campaignName}</span>
                            </div>
                          )}
                          {entry.targetViews && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <TrendingUp className="h-3 w-3" />
                              <span>Target: {entry.targetViews.toLocaleString()} views</span>
                            </div>
                          )}
                          {entry.targetEngagement && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <TrendingUp className="h-3 w-3" />
                              <span>Engagement: {entry.targetEngagement}%</span>
                            </div>
                          )}
                        </div>

                        {entry.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-600 italic">{entry.notes}</p>
                          </div>
                        )}

                        {/* Integration actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F4F4F5]">
                          <button
                            onClick={() => openHookGenerator(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#1D4ED8] rounded-lg text-[11px] font-display font-bold transition-colors"
                          >
                            <Zap className="w-3 h-3" />
                            Generate Hook
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openScriptWriter(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-display font-bold transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            Write Script
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No content scheduled yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Add your first content entry to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Guide */}
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Production Pipeline Guide</CardTitle>
              <CardDescription>Track your content through each stage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Planned</p>
                    <p className="text-xs text-gray-700">Content idea scheduled</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-blue-900">Drafted</p>
                    <p className="text-xs text-blue-700">Initial draft created</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-purple-900">Scripting</p>
                    <p className="text-xs text-purple-700">Writing the script</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-yellow-900">Shooting</p>
                    <p className="text-xs text-yellow-700">Recording content</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-orange-900">Editing</p>
                    <p className="text-xs text-orange-700">Post-production</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-cyan-900">Scheduled</p>
                    <p className="text-xs text-cyan-700">Ready to publish</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm text-green-900">Published</p>
                    <p className="text-xs text-green-700">Live on platform</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
