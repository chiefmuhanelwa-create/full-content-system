'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  AlertTriangle,
  TrendingUp,
  Target,
  Brain,
} from 'lucide-react'

interface ICPPainPoint {
  id: string
  audienceLevel: string
  audienceSegment?: string
  painPoint: string
  painCategory: string
  painIntensity: string
  shadowFear?: string
  emotionalTrigger?: string
  symptoms?: any
  objections?: any
  solutionType?: string
  productMatch?: string
  contentPillar?: string
  hookAngles?: any
  storyMatches?: any
  timesAddressed: number
  avgEngagement: number
  conversionRate: number
  isFavorite: boolean
  tags?: any
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function ICPPainLibraryPage() {
  const [painPoints, setPainPoints] = useState<ICPPainPoint[]>([])
  const [filteredPainPoints, setFilteredPainPoints] = useState<ICPPainPoint[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Filters
  const [filterAudienceLevel, setFilterAudienceLevel] = useState<string>('all')
  const [filterPainCategory, setFilterPainCategory] = useState<string>('all')
  const [filterShadowFear, setFilterShadowFear] = useState<string>('all')
  const [filterFavorite, setFilterFavorite] = useState<boolean | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Form data
  const [formData, setFormData] = useState<Partial<ICPPainPoint>>({
    audienceLevel: 'beginner_creator',
    audienceSegment: '',
    painPoint: '',
    painCategory: 'financial',
    painIntensity: 'medium',
    shadowFear: '',
    emotionalTrigger: '',
    solutionType: '',
    productMatch: '',
    contentPillar: '',
    timesAddressed: 0,
    avgEngagement: 0,
    conversionRate: 0,
    isFavorite: false,
    notes: '',
  })

  // Load pain points
  useEffect(() => {
    fetchPainPoints()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...painPoints]

    if (filterAudienceLevel !== 'all') {
      filtered = filtered.filter((p) => p.audienceLevel === filterAudienceLevel)
    }
    if (filterPainCategory !== 'all') {
      filtered = filtered.filter((p) => p.painCategory === filterPainCategory)
    }
    if (filterShadowFear !== 'all') {
      filtered = filtered.filter((p) => p.shadowFear === filterShadowFear)
    }
    if (filterFavorite !== null) {
      filtered = filtered.filter((p) => p.isFavorite === filterFavorite)
    }

    setFilteredPainPoints(filtered)
  }, [painPoints, filterAudienceLevel, filterPainCategory, filterShadowFear, filterFavorite])

  const fetchPainPoints = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/icp-pain-library/list')
      const data = await response.json()
      if (data.success) {
        setPainPoints(data.painPoints)
      }
    } catch (error) {
      console.error('Error fetching pain points:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const url = editingId ? '/api/icp-pain-library/update' : '/api/icp-pain-library/create'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      })

      const data = await response.json()
      if (data.success) {
        await fetchPainPoints()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving pain point:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const response = await fetch('/api/icp-pain-library/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFavorite: !currentFavorite }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchPainPoints()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const deletePainPoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pain point?')) return

    try {
      const response = await fetch(`/api/icp-pain-library/delete?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        await fetchPainPoints()
      }
    } catch (error) {
      console.error('Error deleting pain point:', error)
    }
  }

  const editPainPoint = (painPoint: ICPPainPoint) => {
    setFormData(painPoint)
    setEditingId(painPoint.id)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setFormData({
      audienceLevel: 'beginner_creator',
      audienceSegment: '',
      painPoint: '',
      painCategory: 'financial',
      painIntensity: 'medium',
      shadowFear: '',
      emotionalTrigger: '',
      solutionType: '',
      productMatch: '',
      contentPillar: '',
      timesAddressed: 0,
      avgEngagement: 0,
      conversionRate: 0,
      isFavorite: false,
      notes: '',
    })
    setEditingId(null)
    setIsEditing(false)
  }

  const clearFilters = () => {
    setFilterAudienceLevel('all')
    setFilterPainCategory('all')
    setFilterShadowFear('all')
    setFilterFavorite(null)
  }

  const exportToCSV = () => {
    const headers = [
      'Audience Level',
      'Audience Segment',
      'Pain Point',
      'Pain Category',
      'Pain Intensity',
      'Shadow Fear',
      'Emotional Trigger',
      'Solution Type',
      'Product Match',
      'Content Pillar',
      'Times Addressed',
      'Avg Engagement',
      'Conversion Rate',
      'Favorite',
    ]

    const rows = filteredPainPoints.map((p) => [
      p.audienceLevel,
      p.audienceSegment || '',
      p.painPoint,
      p.painCategory,
      p.painIntensity,
      p.shadowFear || '',
      p.emotionalTrigger || '',
      p.solutionType || '',
      p.productMatch || '',
      p.contentPillar || '',
      p.timesAddressed,
      p.avgEngagement,
      p.conversionRate,
      p.isFavorite ? 'Yes' : 'No',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `icp-pain-library-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPainIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getAudienceLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner_creator':
        return 'Beginner Creator'
      case 'established_creator':
        return 'Established Creator'
      case 'contentpreneur':
        return 'Contentpreneur'
      default:
        return level
    }
  }

  const stats = {
    total: painPoints.length,
    favorites: painPoints.filter((p) => p.isFavorite).length,
    avgEngagement:
      painPoints.length > 0
        ? (painPoints.reduce((sum, p) => sum + p.avgEngagement, 0) / painPoints.length).toFixed(2)
        : '0.00',
    avgConversion:
      painPoints.length > 0
        ? (painPoints.reduce((sum, p) => sum + p.conversionRate, 0) / painPoints.length).toFixed(2)
        : '0.00',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              ICP Pain Library
            </h1>
            <p className="text-gray-600">
              Deep understanding of your audience&apos;s pain points - what keeps them awake at night
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
              {isEditing ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isEditing ? 'Cancel' : 'Add Pain Point'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pain Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.favorites}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.avgEngagement}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Avg Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.avgConversion}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Audience Level</Label>
                <Select value={filterAudienceLevel} onValueChange={setFilterAudienceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner_creator">Beginner Creator</SelectItem>
                    <SelectItem value="established_creator">Established Creator</SelectItem>
                    <SelectItem value="contentpreneur">Contentpreneur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pain Category</Label>
                <Select value={filterPainCategory} onValueChange={setFilterPainCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="visibility">Visibility</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="knowledge">Knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shadow Fear</Label>
                <Select value={filterShadowFear} onValueChange={setFilterShadowFear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fears</SelectItem>
                    <SelectItem value="invisibility">Invisibility</SelectItem>
                    <SelectItem value="wasted_potential">Wasted Potential</SelectItem>
                    <SelectItem value="left_behind">Left Behind</SelectItem>
                    <SelectItem value="exposure">Exposure</SelectItem>
                    <SelectItem value="poverty_cycle">Poverty Cycle</SelectItem>
                    <SelectItem value="family_shame">Family Shame</SelectItem>
                    <SelectItem value="imposter_syndrome">Imposter Syndrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Favorite Status</Label>
                <Select
                  value={filterFavorite === null ? 'all' : filterFavorite ? 'favorites' : 'not-favorites'}
                  onValueChange={(value) =>
                    setFilterFavorite(value === 'all' ? null : value === 'favorites')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pain Points</SelectItem>
                    <SelectItem value="favorites">Favorites Only</SelectItem>
                    <SelectItem value="not-favorites">Non-Favorites</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        {isEditing && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Pain Point' : 'Add New Pain Point'}</CardTitle>
              <CardDescription>
                Document what keeps your audience awake at night
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audienceLevel">Audience Level *</Label>
                  <Select
                    value={formData.audienceLevel}
                    onValueChange={(value) => setFormData({ ...formData, audienceLevel: value })}
                  >
                    <SelectTrigger id="audienceLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner_creator">Beginner Creator</SelectItem>
                      <SelectItem value="established_creator">Established Creator</SelectItem>
                      <SelectItem value="contentpreneur">Contentpreneur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audienceSegment">Audience Segment</Label>
                  <Input
                    id="audienceSegment"
                    value={formData.audienceSegment}
                    onChange={(e) => setFormData({ ...formData, audienceSegment: e.target.value })}
                    placeholder="e.g., African fashion creators"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoint">Pain Point *</Label>
                  <Textarea
                    id="painPoint"
                    value={formData.painPoint}
                    onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                    placeholder="What keeps them awake at night?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painCategory">Pain Category *</Label>
                  <Select
                    value={formData.painCategory}
                    onValueChange={(value) => setFormData({ ...formData, painCategory: value })}
                  >
                    <SelectTrigger id="painCategory">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="visibility">Visibility</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                      <SelectItem value="time">Time</SelectItem>
                      <SelectItem value="knowledge">Knowledge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painIntensity">Pain Intensity *</Label>
                  <Select
                    value={formData.painIntensity}
                    onValueChange={(value) => setFormData({ ...formData, painIntensity: value })}
                  >
                    <SelectTrigger id="painIntensity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shadowFear">Shadow Fear</Label>
                  <Select
                    value={formData.shadowFear || ''}
                    onValueChange={(value) => setFormData({ ...formData, shadowFear: value })}
                  >
                    <SelectTrigger id="shadowFear">
                      <SelectValue placeholder="Select shadow fear" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invisibility">Invisibility</SelectItem>
                      <SelectItem value="wasted_potential">Wasted Potential</SelectItem>
                      <SelectItem value="left_behind">Left Behind</SelectItem>
                      <SelectItem value="exposure">Exposure</SelectItem>
                      <SelectItem value="poverty_cycle">Poverty Cycle</SelectItem>
                      <SelectItem value="family_shame">Family Shame</SelectItem>
                      <SelectItem value="imposter_syndrome">Imposter Syndrome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotionalTrigger">Emotional Trigger</Label>
                  <Input
                    id="emotionalTrigger"
                    value={formData.emotionalTrigger}
                    onChange={(e) => setFormData({ ...formData, emotionalTrigger: e.target.value })}
                    placeholder="e.g., Family shame, poverty cycle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solutionType">Solution Type</Label>
                  <Select
                    value={formData.solutionType || ''}
                    onValueChange={(value) => setFormData({ ...formData, solutionType: value })}
                  >
                    <SelectTrigger id="solutionType">
                      <SelectValue placeholder="Select solution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                      <SelectItem value="framework">Framework</SelectItem>
                      <SelectItem value="mindset_shift">Mindset Shift</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productMatch">Product Match</Label>
                  <Input
                    id="productMatch"
                    value={formData.productMatch}
                    onChange={(e) => setFormData({ ...formData, productMatch: e.target.value })}
                    placeholder="Which NOCHILL product solves this?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentPillar">Content Pillar</Label>
                  <Select
                    value={formData.contentPillar || ''}
                    onValueChange={(value) => setFormData({ ...formData, contentPillar: value })}
                  >
                    <SelectTrigger id="contentPillar">
                      <SelectValue placeholder="Select content pillar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authority">Authority</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="monetization">Monetization</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3">Performance Metrics</h3>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="timesAddressed">Times Addressed</Label>
                      <Input
                        id="timesAddressed"
                        type="number"
                        value={formData.timesAddressed}
                        onChange={(e) =>
                          setFormData({ ...formData, timesAddressed: Number(e.target.value) })
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avgEngagement">Avg Engagement (%)</Label>
                      <Input
                        id="avgEngagement"
                        type="number"
                        step="0.01"
                        value={formData.avgEngagement}
                        onChange={(e) =>
                          setFormData({ ...formData, avgEngagement: Number(e.target.value) })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                      <Input
                        id="conversionRate"
                        type="number"
                        step="0.01"
                        value={formData.conversionRate}
                        onChange={(e) =>
                          setFormData({ ...formData, conversionRate: Number(e.target.value) })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or insights..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Pain Point' : 'Add Pain Point'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Pain Points List */}
        <div className={isEditing ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="space-y-4">
            {loading && painPoints.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Loading pain points...</p>
                </CardContent>
              </Card>
            ) : filteredPainPoints.length > 0 ? (
              filteredPainPoints.map((painPoint) => (
                <Card key={painPoint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{painPoint.painPoint}</CardTitle>
                          {painPoint.isFavorite && (
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            className={`${getPainIntensityColor(painPoint.painIntensity)} border`}
                          >
                            {painPoint.painIntensity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{getAudienceLevelLabel(painPoint.audienceLevel)}</Badge>
                          <Badge variant="outline">{painPoint.painCategory}</Badge>
                          {painPoint.shadowFear && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 border">
                              {painPoint.shadowFear.replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(painPoint.id, painPoint.isFavorite)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              painPoint.isFavorite
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => editPainPoint(painPoint)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePainPoint(painPoint.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                            <Target className="h-4 w-4" />
                            <span className="text-xs font-semibold">Addressed</span>
                          </div>
                          <p className="text-xl font-bold">{painPoint.timesAddressed}</p>
                        </div>
                        <div className="text-center border-l border-r">
                          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs font-semibold">Engagement</span>
                          </div>
                          <p className="text-xl font-bold text-green-600">
                            {painPoint.avgEngagement.toFixed(2)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs font-semibold">Conversion</span>
                          </div>
                          <p className="text-xl font-bold text-purple-600">
                            {painPoint.conversionRate.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {painPoint.audienceSegment && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Audience Segment:
                            </p>
                            <p className="text-sm text-gray-700">{painPoint.audienceSegment}</p>
                          </div>
                        )}

                        {painPoint.emotionalTrigger && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Emotional Trigger:
                            </p>
                            <p className="text-sm text-gray-700">{painPoint.emotionalTrigger}</p>
                          </div>
                        )}

                        {painPoint.solutionType && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Solution Type:
                            </p>
                            <p className="text-sm text-gray-700 capitalize">
                              {painPoint.solutionType.replace(/_/g, ' ')}
                            </p>
                          </div>
                        )}

                        {painPoint.productMatch && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Product Match:
                            </p>
                            <p className="text-sm text-gray-700">{painPoint.productMatch}</p>
                          </div>
                        )}

                        {painPoint.contentPillar && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Content Pillar:
                            </p>
                            <p className="text-sm text-gray-700 capitalize">
                              {painPoint.contentPillar}
                            </p>
                          </div>
                        )}
                      </div>

                      {painPoint.notes && (
                        <div className="pt-3 border-t">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-700">{painPoint.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm mb-4">
                    {painPoints.length === 0 ? 'No pain points yet' : 'No pain points match your filters'}
                  </p>
                  {painPoints.length === 0 ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Pain Point
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
