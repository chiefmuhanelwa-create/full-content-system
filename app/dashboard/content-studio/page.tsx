'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Trash2,
  Zap,
  FileText,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { BackButton } from '@/components/BackButton'

interface PlannedContent {
  id: string
  title: string
  platform: string
  contentType: string
  contentPillar: string
  status: 'idea' | 'hook_selected' | 'script_ready' | 'scheduled'
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
  saves: number
  comments: number
  shares: number
  engagementRate: number
  notes: string
  url: string
}

function tryParseJSON(str: string | null | undefined): Record<string, string> {
  if (!str) return {}
  try { return JSON.parse(str) } catch { return {} }
}

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

const DB_TO_PLANNED: Record<string, PlannedContent['status']> = {
  ideation: 'idea',
  scripting: 'hook_selected',
  scheduled: 'scheduled',
}

const DB_TO_SHOT: Record<string, ShotContent['status']> = {
  shooting: 'raw_footage',
  editing: 'in_editing',
}

const PLANNED_TO_DB: Record<string, string> = {
  idea: 'ideation',
  hook_selected: 'scripting',
  script_ready: 'scripting',
  scheduled: 'scheduled',
}

const SHOT_TO_DB: Record<string, string> = {
  raw_footage: 'shooting',
  in_editing: 'editing',
  final_review: 'editing',
}

export default function ContentStudioPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'planned' | 'shot' | 'published'>('planned')
  const [loading, setLoading] = useState(true)

  const [plannedContent, setPlannedContent] = useState<PlannedContent[]>([])
  const [showAddPlanned, setShowAddPlanned] = useState(false)
  const [newPlanned, setNewPlanned] = useState<Partial<PlannedContent>>({
    title: '', platform: 'Instagram', contentType: 'reel', contentPillar: 'story',
    status: 'idea', notes: '',
  })

  const [shotContent, setShotContent] = useState<ShotContent[]>([])
  const [showAddShot, setShowAddShot] = useState(false)
  const [newShot, setNewShot] = useState<Partial<ShotContent>>({
    title: '', platform: 'Instagram',
    shotDate: new Date().toISOString().split('T')[0],
    duration: '', status: 'raw_footage', notes: '',
  })

  const [publishedContent, setPublishedContent] = useState<PublishedContent[]>([])
  const [showAddPublished, setShowAddPublished] = useState(false)
  const [newPublished, setNewPublished] = useState<Partial<PublishedContent>>({
    title: '', platform: 'Instagram',
    publishDate: new Date().toISOString().split('T')[0],
    views: 0, saves: 0, comments: 0, shares: 0, notes: '', url: '',
  })

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch('/api/content-card/list')
      if (!res.ok) { setLoading(false); return }
      const data = await res.json()
      if (!data.contentCards) { setLoading(false); return }

      const planned: PlannedContent[] = []
      const shot: ShotContent[] = []
      const published: PublishedContent[] = []

      for (const card of data.contentCards) {
        const tags = typeof card.tags === 'object' && card.tags !== null ? card.tags as Record<string, string> : {}
        if (tags?.source !== 'content_studio') continue

        const extras = tryParseJSON(card.whatWorked)

        if (['ideation', 'scripting', 'scheduled'].includes(card.status)) {
          planned.push({
            id: card.id,
            title: card.contentTitle,
            platform: cap(card.platform),
            contentType: card.contentType || 'reel',
            contentPillar: card.contentPillar || 'story',
            status: DB_TO_PLANNED[card.status] ?? 'idea',
            scheduledDate: card.publishDate ? (card.publishDate as string).split('T')[0] : undefined,
            notes: card.lessonLearned || '',
            createdAt: card.createdAt,
          })
        } else if (['shooting', 'editing'].includes(card.status)) {
          shot.push({
            id: card.id,
            title: card.contentTitle,
            platform: cap(card.platform),
            shotDate: card.shootDate ? (card.shootDate as string).split('T')[0] : new Date().toISOString().split('T')[0],
            duration: extras?.duration || '',
            status: DB_TO_SHOT[card.status] ?? 'raw_footage',
            notes: card.lessonLearned || '',
            createdAt: card.createdAt,
          })
        } else if (card.status === 'published') {
          const v = card.views || 0
          const s = card.saves || 0
          const c = card.comments || 0
          const sh = card.shares || 0
          published.push({
            id: card.id,
            title: card.contentTitle,
            platform: cap(card.platform),
            publishDate: card.publishDate ? (card.publishDate as string).split('T')[0] : new Date().toISOString().split('T')[0],
            views: v,
            saves: s,
            comments: c,
            shares: sh,
            engagementRate: v > 0 ? ((s + c + sh) / v) * 100 : 0,
            notes: card.lessonLearned || '',
            url: extras?.url || '',
          })
        }
      }

      setPlannedContent(planned)
      setShotContent(shot)
      setPublishedContent(published)
    } catch { /* graceful degradation — DB may be sleeping */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  const addPlannedContent = async () => {
    if (!newPlanned.title?.trim()) return
    const res = await fetch('/api/content-card/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentTitle: newPlanned.title,
        platform: (newPlanned.platform || 'Instagram').toLowerCase(),
        contentType: newPlanned.contentType || 'reel',
        contentPillar: newPlanned.contentPillar || 'story',
        status: PLANNED_TO_DB[newPlanned.status || 'idea'],
        audienceLevel: 'established_creator',
        icpPainPoint: newPlanned.notes || 'Content Studio entry',
        hookAwareness: 'problem_aware',
        lessonLearned: newPlanned.notes || '',
        publishDate: newPlanned.scheduledDate || null,
        tags: { source: 'content_studio', originalStatus: newPlanned.status },
      }),
    })
    if (res.ok) {
      await fetchCards()
      setNewPlanned({ title: '', platform: 'Instagram', contentType: 'reel', contentPillar: 'story', status: 'idea', notes: '' })
      setShowAddPlanned(false)
    }
  }

  const addShotContent = async () => {
    if (!newShot.title?.trim()) return
    const res = await fetch('/api/content-card/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentTitle: newShot.title,
        platform: (newShot.platform || 'Instagram').toLowerCase(),
        contentType: 'reel',
        contentPillar: 'story',
        status: SHOT_TO_DB[newShot.status || 'raw_footage'],
        audienceLevel: 'established_creator',
        icpPainPoint: newShot.notes || 'Content Studio entry',
        hookAwareness: 'problem_aware',
        lessonLearned: newShot.notes || '',
        shootDate: newShot.shotDate || null,
        whatWorked: JSON.stringify({ duration: newShot.duration || '' }),
        tags: { source: 'content_studio' },
      }),
    })
    if (res.ok) {
      await fetchCards()
      setNewShot({ title: '', platform: 'Instagram', shotDate: new Date().toISOString().split('T')[0], duration: '', status: 'raw_footage', notes: '' })
      setShowAddShot(false)
    }
  }

  const addPublishedContent = async () => {
    if (!newPublished.title?.trim()) return
    const views = newPublished.views || 0
    const saves = newPublished.saves || 0
    const comments = newPublished.comments || 0
    const shares = newPublished.shares || 0
    const res = await fetch('/api/content-card/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentTitle: newPublished.title,
        platform: (newPublished.platform || 'Instagram').toLowerCase(),
        contentType: 'reel',
        contentPillar: 'story',
        status: 'published',
        audienceLevel: 'established_creator',
        icpPainPoint: newPublished.notes || 'Content Studio entry',
        hookAwareness: 'problem_aware',
        lessonLearned: newPublished.notes || '',
        publishDate: newPublished.publishDate || null,
        views,
        saves,
        comments,
        shares,
        whatWorked: JSON.stringify({ url: newPublished.url || '' }),
        tags: { source: 'content_studio' },
      }),
    })
    if (res.ok) {
      await fetchCards()
      setNewPublished({ title: '', platform: 'Instagram', publishDate: new Date().toISOString().split('T')[0], views: 0, saves: 0, comments: 0, shares: 0, notes: '', url: '' })
      setShowAddPublished(false)
    }
  }

  const deleteCard = async (id: string, label: string) => {
    if (!confirm(`Delete this ${label}?`)) return
    await fetch(`/api/content-card/delete?id=${id}`, { method: 'DELETE' })
    await fetchCards()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-gray-100 text-gray-700'
      case 'hook_selected': return 'bg-purple-100 text-purple-700'
      case 'script_ready': return 'bg-blue-100 text-blue-700'
      case 'scheduled': return 'bg-green-100 text-green-700'
      case 'raw_footage': return 'bg-orange-100 text-orange-700'
      case 'in_editing': return 'bg-yellow-100 text-yellow-700'
      case 'final_review': return 'bg-cyan-100 text-cyan-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const stats = {
    planned: plannedContent.length,
    shot: shotContent.length,
    published: publishedContent.length,
    totalViews: publishedContent.reduce((sum, c) => sum + c.views, 0),
    totalEngagement: publishedContent.reduce((sum, c) => sum + c.saves + c.comments + c.shares, 0),
    avgEngagementRate: publishedContent.length > 0
      ? publishedContent.reduce((sum, c) => sum + c.engagementRate, 0) / publishedContent.length
      : 0,
  }

  const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'Facebook']

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="px-6 pt-4"><BackButton /></div>
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

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Loading content...
          </div>
        )}

        {!loading && (
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Content Type</Label>
                        <Select
                          value={newPlanned.contentType}
                          onValueChange={(value) => setNewPlanned({ ...newPlanned, contentType: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reel">Reel</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="youtube_short">YouTube Short</SelectItem>
                            <SelectItem value="youtube_long">YouTube Long</SelectItem>
                            <SelectItem value="thread">Thread</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Content Pillar</Label>
                        <Select
                          value={newPlanned.contentPillar}
                          onValueChange={(value) => setNewPlanned({ ...newPlanned, contentPillar: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="authority">Authority</SelectItem>
                            <SelectItem value="monetization">Monetization</SelectItem>
                            <SelectItem value="conversion">Conversion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newPlanned.status}
                          onValueChange={(value: PlannedContent['status']) => setNewPlanned({ ...newPlanned, status: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
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
                        placeholder="Hook ideas, script references, angle..."
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
                              <Badge variant="outline" className="text-xs">{content.contentType}</Badge>
                              <Badge variant="outline" className="text-xs">{content.contentPillar}</Badge>
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
                            onClick={() => deleteCard(content.id, 'planned content')}
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                          onValueChange={(value: ShotContent['status']) => setNewShot({ ...newShot, status: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
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
                              {content.duration && <Badge variant="outline">{content.duration}</Badge>}
                              <span className="text-xs text-gray-500">
                                Shot: {new Date(content.shotDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCard(content.id, 'shot content')}
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                        <Label>Saves</Label>
                        <Input
                          type="number"
                          value={newPublished.saves}
                          onChange={(e) => setNewPublished({ ...newPublished, saves: Number(e.target.value) })}
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
                      <Label>Notes / Learnings</Label>
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
                                <div className="text-gray-500 text-xs">Saves</div>
                                <div className="font-semibold text-pink-600">{content.saves.toLocaleString()}</div>
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
                            onClick={() => deleteCard(content.id, 'published content')}
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
        )}
      </div>
    </div>
  )
}
