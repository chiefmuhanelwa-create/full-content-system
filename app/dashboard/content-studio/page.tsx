'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Lightbulb,
  Video,
  CheckCircle,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  BarChart,
  Zap,
  FileText,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface PlannedContent {
  id: string
  title: string
  platform: string
  status: 'idea' | 'hook_selected' | 'script_ready' | 'scheduled'
  hookId?: string
  hookText?: string
  scriptId?: string
  scriptText?: string
  scheduledDate?: string
  notes: string
  createdAt: string
}

interface ShotContent {
  id: string
  title: string
  platform: string
  shotDate: string
  duration: string
  status: 'raw_footage' | 'in_editing' | 'final_review'
  notes: string
  createdAt: string
}

interface PublishedContent {
  id: string
  title: string
  platform: string
  publishDate: string
  views: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  notes: string
  url?: string
}

export default function ContentStudioPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'planned' | 'shot' | 'published'>('planned')

  // Planned Content
  const [plannedContent, setPlannedContent] = useState<PlannedContent[]>([])
  const [showAddPlanned, setShowAddPlanned] = useState(false)
  const [newPlanned, setNewPlanned] = useState<Partial<PlannedContent>>({
    title: '',
    platform: 'Instagram',
    status: 'idea',
    notes: '',
  })

  // Shot Content
  const [shotContent, setShotContent] = useState<ShotContent[]>([])
  const [showAddShot, setShowAddShot] = useState(false)
  const [newShot, setNewShot] = useState<Partial<ShotContent>>({
    title: '',
    platform: 'Instagram',
    shotDate: new Date().toISOString().split('T')[0],
    duration: '',
    status: 'raw_footage',
    notes: '',
  })

  // Published Content
  const [publishedContent, setPublishedContent] = useState<PublishedContent[]>([])
  const [showAddPublished, setShowAddPublished] = useState(false)
  const [newPublished, setNewPublished] = useState<Partial<PublishedContent>>({
    title: '',
    platform: 'Instagram',
    publishDate: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    notes: '',
    url: '',
  })

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const planned = localStorage.getItem('plannedContent')
      if (planned) setPlannedContent(JSON.parse(planned))

      const shot = localStorage.getItem('shotContent')
      if (shot) setShotContent(JSON.parse(shot))

      const published = localStorage.getItem('publishedContent')
      if (published) setPublishedContent(JSON.parse(published))
    }
    loadData()
  }, [])

  // Save planned content
  const savePlannedContent = (content: PlannedContent[]) => {
    setPlannedContent(content)
    localStorage.setItem('plannedContent', JSON.stringify(content))
  }

  // Save shot content
  const saveShotContent = (content: ShotContent[]) => {
    setShotContent(content)
    localStorage.setItem('shotContent', JSON.stringify(content))
  }

  // Save published content
  const savePublishedContent = (content: PublishedContent[]) => {
    setPublishedContent(content)
    localStorage.setItem('publishedContent', JSON.stringify(content))
  }

  // Add planned content
  const addPlannedContent = () => {
    if (!newPlanned.title?.trim()) return

    const content: PlannedContent = {
      id: Date.now().toString(),
      title: newPlanned.title!,
      platform: newPlanned.platform || 'Instagram',
      status: newPlanned.status || 'idea',
      notes: newPlanned.notes || '',
      createdAt: new Date().toISOString(),
    }

    savePlannedContent([content, ...plannedContent])
    setNewPlanned({
      title: '',
      platform: 'Instagram',
      status: 'idea',
      notes: '',
    })
    setShowAddPlanned(false)
  }

  // Add shot content
  const addShotContent = () => {
    if (!newShot.title?.trim()) return

    const content: ShotContent = {
      id: Date.now().toString(),
      title: newShot.title!,
      platform: newShot.platform || 'Instagram',
      shotDate: newShot.shotDate || new Date().toISOString().split('T')[0],
      duration: newShot.duration || '',
      status: newShot.status || 'raw_footage',
      notes: newShot.notes || '',
      createdAt: new Date().toISOString(),
    }

    saveShotContent([content, ...shotContent])
    setNewShot({
      title: '',
      platform: 'Instagram',
      shotDate: new Date().toISOString().split('T')[0],
      duration: '',
      status: 'raw_footage',
      notes: '',
    })
    setShowAddShot(false)
  }

  // Add published content
  const addPublishedContent = () => {
    if (!newPublished.title?.trim()) return

    const views = newPublished.views || 0
    const likes = newPublished.likes || 0
    const comments = newPublished.comments || 0
    const shares = newPublished.shares || 0
    const totalEngagement = likes + comments + shares
    const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0

    const content: PublishedContent = {
      id: Date.now().toString(),
      title: newPublished.title!,
      platform: newPublished.platform || 'Instagram',
      publishDate: newPublished.publishDate || new Date().toISOString().split('T')[0],
      views,
      likes,
      comments,
      shares,
      engagementRate,
      notes: newPublished.notes || '',
      url: newPublished.url || '',
    }

    savePublishedContent([content, ...publishedContent])
    setNewPublished({
      title: '',
      platform: 'Instagram',
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      notes: '',
      url: '',
    })
    setShowAddPublished(false)
  }

  // Delete functions
  const deletePlanned = (id: string) => {
    if (confirm('Delete this planned content?')) {
      savePlannedContent(plannedContent.filter(c => c.id !== id))
    }
  }

  const deleteShot = (id: string) => {
    if (confirm('Delete this shot content?')) {
      saveShotContent(shotContent.filter(c => c.id !== id))
    }
  }

  const deletePublished = (id: string) => {
    if (confirm('Delete this published content?')) {
      savePublishedContent(publishedContent.filter(c => c.id !== id))
    }
  }

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea':
        return 'bg-gray-100 text-gray-700'
      case 'hook_selected':
        return 'bg-purple-100 text-purple-700'
      case 'script_ready':
        return 'bg-blue-100 text-blue-700'
      case 'scheduled':
        return 'bg-green-100 text-green-700'
      case 'raw_footage':
        return 'bg-orange-100 text-orange-700'
      case 'in_editing':
        return 'bg-yellow-100 text-yellow-700'
      case 'final_review':
        return 'bg-cyan-100 text-cyan-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Get stats
  const stats = {
    planned: plannedContent.length,
    shot: shotContent.length,
    published: publishedContent.length,
    totalViews: publishedContent.reduce((sum, c) => sum + c.views, 0),
    totalEngagement: publishedContent.reduce((sum, c) => sum + c.likes + c.comments + c.shares, 0),
    avgEngagementRate: publishedContent.length > 0
      ? publishedContent.reduce((sum, c) => sum + c.engagementRate, 0) / publishedContent.length
      : 0,
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Video}
        iconColor="text-purple-600"
        eyebrow="Create"
        title="Content Studio"
        description="Plan, track, and analyze your content from idea to performance"
      />
      <div className="px-6 py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Planned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{stats.planned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Shot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{stats.shot}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600">{stats.totalEngagement.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-600">{stats.avgEngagementRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'planned' ? 'default' : 'outline'}
          onClick={() => setActiveTab('planned')}
          className="flex items-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Planned ({plannedContent.length})
        </Button>
        <Button
          variant={activeTab === 'shot' ? 'default' : 'outline'}
          onClick={() => setActiveTab('shot')}
          className="flex items-center gap-2"
        >
          <Video className="h-4 w-4" />
          Shot ({shotContent.length})
        </Button>
        <Button
          variant={activeTab === 'published' ? 'default' : 'outline'}
          onClick={() => setActiveTab('published')}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Published ({publishedContent.length})
        </Button>
      </div>

      {/* Content Display */}
      <div className="space-y-4">
        {/* Planned Content Tab */}
        {activeTab === 'planned' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Planned Content</h2>
              <Button onClick={() => setShowAddPlanned(!showAddPlanned)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Planned Content
              </Button>
            </div>

            {showAddPlanned && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>New Planned Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={newPlanned.title}
                        onChange={(e) => setNewPlanned({ ...newPlanned, title: e.target.value })}
                        placeholder="Content title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={newPlanned.platform}
                        onValueChange={(value) => setNewPlanned({ ...newPlanned, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={newPlanned.status}
                        onValueChange={(value: any) => setNewPlanned({ ...newPlanned, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idea">💡 Idea</SelectItem>
                          <SelectItem value="hook_selected">⚡ Hook Selected</SelectItem>
                          <SelectItem value="script_ready">📝 Script Ready</SelectItem>
                          <SelectItem value="scheduled">📅 Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Scheduled Date (Optional)</Label>
                      <Input
                        type="date"
                        value={newPlanned.scheduledDate || ''}
                        onChange={(e) => setNewPlanned({ ...newPlanned, scheduledDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={newPlanned.notes}
                      onChange={(e) => setNewPlanned({ ...newPlanned, notes: e.target.value })}
                      placeholder="Additional notes, hook ideas, script references..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addPlannedContent}>Add Content</Button>
                    <Button variant="outline" onClick={() => setShowAddPlanned(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {plannedContent.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {plannedContent.map((content) => (
                  <Card key={content.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{content.title}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(content.status)}>
                              {content.status === 'idea' && '💡 Idea'}
                              {content.status === 'hook_selected' && '⚡ Hook Selected'}
                              {content.status === 'script_ready' && '📝 Script Ready'}
                              {content.status === 'scheduled' && '📅 Scheduled'}
                            </Badge>
                            <Badge variant="outline">{content.platform}</Badge>
                            {content.scheduledDate && (
                              <Badge variant="outline" className="bg-blue-50">
                                📅 {new Date(content.scheduledDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePlanned(content.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {content.notes && (
                      <CardContent>
                        <p className="text-sm text-gray-600">{content.notes}</p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push('/dashboard/hooks')}
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            Generate Hook
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push('/dashboard/scripts')}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Write Script
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Lightbulb className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No planned content yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start planning your next piece of content</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Shot Content Tab */}
        {activeTab === 'shot' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Shot but Not Edited</h2>
              <Button onClick={() => setShowAddShot(!showAddShot)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Shot Content
              </Button>
            </div>

            {showAddShot && (
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle>New Shot Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={newShot.title}
                        onChange={(e) => setNewShot({ ...newShot, title: e.target.value })}
                        placeholder="Content title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={newShot.platform}
                        onValueChange={(value) => setNewShot({ ...newShot, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shot Date</Label>
                      <Input
                        type="date"
                        value={newShot.shotDate}
                        onChange={(e) => setNewShot({ ...newShot, shotDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={newShot.duration}
                        onChange={(e) => setNewShot({ ...newShot, duration: e.target.value })}
                        placeholder="e.g., 60s, 3min"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={newShot.status}
                        onValueChange={(value: any) => setNewShot({ ...newShot, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw_footage">🎬 Raw Footage</SelectItem>
                          <SelectItem value="in_editing">✂️ In Editing</SelectItem>
                          <SelectItem value="final_review">👀 Final Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={newShot.notes}
                      onChange={(e) => setNewShot({ ...newShot, notes: e.target.value })}
                      placeholder="Editing notes, b-roll needed, issues to fix..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addShotContent}>Add Content</Button>
                    <Button variant="outline" onClick={() => setShowAddShot(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {shotContent.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {shotContent.map((content) => (
                  <Card key={content.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{content.title}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(content.status)}>
                              {content.status === 'raw_footage' && '🎬 Raw Footage'}
                              {content.status === 'in_editing' && '✂️ In Editing'}
                              {content.status === 'final_review' && '👀 Final Review'}
                            </Badge>
                            <Badge variant="outline">{content.platform}</Badge>
                            <Badge variant="outline">{content.duration}</Badge>
                            <span className="text-xs text-gray-500">
                              Shot: {new Date(content.shotDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteShot(content.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {content.notes && (
                      <CardContent>
                        <p className="text-sm text-gray-600">{content.notes}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Video className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No shot content yet</p>
                  <p className="text-gray-400 text-sm mt-1">Track your footage waiting to be edited</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Published Content Tab */}
        {activeTab === 'published' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Published Content</h2>
              <Button onClick={() => setShowAddPublished(!showAddPublished)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Published Content
              </Button>
            </div>

            {showAddPublished && (
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle>New Published Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={newPublished.title}
                        onChange={(e) => setNewPublished({ ...newPublished, title: e.target.value })}
                        placeholder="Content title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={newPublished.platform}
                        onValueChange={(value) => setNewPublished({ ...newPublished, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Publish Date</Label>
                      <Input
                        type="date"
                        value={newPublished.publishDate}
                        onChange={(e) => setNewPublished({ ...newPublished, publishDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL (Optional)</Label>
                      <Input
                        value={newPublished.url}
                        onChange={(e) => setNewPublished({ ...newPublished, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Views</Label>
                      <Input
                        type="number"
                        value={newPublished.views}
                        onChange={(e) => setNewPublished({ ...newPublished, views: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Likes</Label>
                      <Input
                        type="number"
                        value={newPublished.likes}
                        onChange={(e) => setNewPublished({ ...newPublished, likes: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Comments</Label>
                      <Input
                        type="number"
                        value={newPublished.comments}
                        onChange={(e) => setNewPublished({ ...newPublished, comments: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Shares</Label>
                      <Input
                        type="number"
                        value={newPublished.shares}
                        onChange={(e) => setNewPublished({ ...newPublished, shares: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={newPublished.notes}
                      onChange={(e) => setNewPublished({ ...newPublished, notes: e.target.value })}
                      placeholder="Performance insights, what worked, what didn't..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addPublishedContent}>Add Content</Button>
                    <Button variant="outline" onClick={() => setShowAddPublished(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {publishedContent.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {publishedContent.map((content) => (
                  <Card key={content.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{content.title}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <Badge variant="outline">{content.platform}</Badge>
                            <span className="text-xs text-gray-500">
                              Published: {new Date(content.publishDate).toLocaleDateString()}
                            </span>
                            {content.url && (
                              <a
                                href={content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Post →
                              </a>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500 text-xs">Views</div>
                              <div className="font-semibold text-blue-600">{content.views.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Likes</div>
                              <div className="font-semibold text-pink-600">{content.likes.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Comments</div>
                              <div className="font-semibold text-green-600">{content.comments.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Shares</div>
                              <div className="font-semibold text-purple-600">{content.shares.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Eng. Rate</div>
                              <div className="font-semibold text-cyan-600">{content.engagementRate.toFixed(2)}%</div>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePublished(content.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {content.notes && (
                      <CardContent>
                        <p className="text-sm text-gray-600">{content.notes}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <TrendingUp className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No published content yet</p>
                  <p className="text-gray-400 text-sm mt-1">Track your published content performance</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  )
}
