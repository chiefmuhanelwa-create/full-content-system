'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Filter, Search, Calendar, ExternalLink, Edit, Trash2, CheckCircle2, Loader2 } from 'lucide-react'

interface ContentProgress {
  id: string
  title: string
  description?: string
  contentType: string
  topic?: string
  stage: string
  substage?: string
  platforms: string[]
  fourETag: string
  awarenessLevel: string
  clarityType?: string
  shadowFear?: string
  socialUrls?: Record<string, string>
  performance?: Record<string, any>
  scheduledFor?: string
  postedAt?: string
  notes?: string
  tags?: string[]
  isPriority: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface Stats {
  byStage: Record<string, number>
  byFourE: Record<string, number>
  total: number
}

const STAGES = ['ideation', 'scripting', 'shooting', 'editing', 'ready', 'posted']
const FOUR_E_TAGS = ['entertain', 'educate', 'encourage', 'earn']
const AWARENESS_LEVELS = ['symptom_aware', 'problem_aware', 'solution_aware', 'product_aware']
const CONTENT_TYPES = ['reel', 'tiktok', 'youtube_short', 'youtube_long', 'story', 'carousel', 'thread']
const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook']

export default function ContentProgressPage() {
  const router = useRouter()
  const [contentItems, setContentItems] = useState<ContentProgress[]>([])
  const [stats, setStats] = useState<Stats>({ byStage: {}, byFourE: {}, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filterStage, setFilterStage] = useState<string>('')
  const [filterFourE, setFilterFourE] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContentProgress | null>(null)

  // Form state for creating new content
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'reel',
    topic: '',
    stage: 'ideation',
    platforms: [] as string[],
    fourETag: 'educate',
    awarenessLevel: 'symptom_aware',
    clarityType: '',
    shadowFear: '',
    scheduledFor: '',
    notes: '',
    isPriority: false
  })

  useEffect(() => {
    fetchContentProgress()
  }, [filterStage, filterFourE])

  const fetchContentProgress = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStage) params.append('stage', filterStage)
      if (filterFourE) params.append('fourETag', filterFourE)

      const response = await fetch(`/api/content-progress/list?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setContentItems(data.contentProgress)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching content progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContent = async () => {
    try {
      const response = await fetch('/api/content-progress/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          contentType: 'reel',
          topic: '',
          stage: 'ideation',
          platforms: [],
          fourETag: 'educate',
          awarenessLevel: 'symptom_aware',
          clarityType: '',
          shadowFear: '',
          scheduledFor: '',
          notes: '',
          isPriority: false
        })
        fetchContentProgress()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating content:', error)
      alert('Failed to create content')
    }
  }

  const handleUpdateStage = async (id: string, newStage: string) => {
    try {
      const response = await fetch('/api/content-progress/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage: newStage })
      })

      const data = await response.json()

      if (data.success) {
        fetchContentProgress()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating stage:', error)
      alert('Failed to update stage')
    }
  }

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch('/api/content-progress/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await response.json()

      if (data.success) {
        fetchContentProgress()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Failed to delete content')
    }
  }

  const filteredItems = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      ideation: 'bg-purple-100 text-purple-800',
      scripting: 'bg-blue-100 text-blue-800',
      shooting: 'bg-yellow-100 text-yellow-800',
      editing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      posted: 'bg-gray-100 text-gray-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getFourEColor = (tag: string) => {
    const colors: Record<string, string> = {
      entertain: 'bg-pink-100 text-pink-800',
      educate: 'bg-blue-100 text-blue-800',
      encourage: 'bg-green-100 text-green-800',
      earn: 'bg-yellow-100 text-yellow-800'
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Progress Tracker</h1>
          <p className="text-gray-600">Manage your content pipeline from ideation to posting</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Total Content</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">In Progress</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {(stats.byStage?.scripting || 0) + (stats.byStage?.shooting || 0) + (stats.byStage?.editing || 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Ready to Post</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.byStage?.ready || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Posted</div>
            <div className="text-2xl font-bold text-gray-600 mt-1">{stats.byStage?.posted || 0}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Stage */}
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Stages</option>
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>
              ))}
            </select>

            {/* Filter by 4E Tag */}
            <select
              value={filterFourE}
              onChange={(e) => setFilterFourE(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All 4E Tags</option>
              {FOUR_E_TAGS.map(tag => (
                <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
              ))}
            </select>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Content
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading content...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No content found</p>
            <p className="text-gray-400 mt-1">Create your first content item to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  {item.isPriority && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Priority</span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStageColor(item.stage)}`}>
                    {item.stage}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getFourEColor(item.fourETag)}`}>
                    {item.fourETag}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                    {item.awarenessLevel.replace('_', ' ')}
                  </span>
                </div>

                {/* Platforms */}
                {item.platforms && item.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.platforms.map((platform: string) => (
                      <span key={platform} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}

                {/* Scheduled/Posted Date */}
                {(item.scheduledFor || item.postedAt) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {item.postedAt
                        ? `Posted: ${new Date(item.postedAt).toLocaleDateString()}`
                        : `Scheduled: ${new Date(item.scheduledFor!).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                )}

                {/* Social URLs */}
                {item.socialUrls && Object.keys(item.socialUrls).length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {Object.entries(item.socialUrls).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <select
                    value={item.stage}
                    onChange={(e) => handleUpdateStage(item.id, e.target.value)}
                    className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteContent(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Content Item</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Content title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {CONTENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stage *</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">4E Tag *</label>
                    <select
                      value={formData.fourETag}
                      onChange={(e) => setFormData({ ...formData, fourETag: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {FOUR_E_TAGS.map(tag => (
                        <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Awareness Level *</label>
                    <select
                      value={formData.awarenessLevel}
                      onChange={(e) => setFormData({ ...formData, awarenessLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {AWARENESS_LEVELS.map(level => (
                        <option key={level} value={level}>{level.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(platform => (
                      <label key={platform} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, platforms: [...formData.platforms, platform] })
                            } else {
                              setFormData({ ...formData, platforms: formData.platforms.filter(p => p !== platform) })
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled For</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPriority}
                      onChange={(e) => setFormData({ ...formData, isPriority: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Priority</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateContent}
                  disabled={!formData.title || !formData.contentType || !formData.fourETag || !formData.awarenessLevel}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Content
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
