'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Star,
  Download,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Target,
  Sparkles,
  Filter,
  X,
  RefreshCw,
  CalendarCheck,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ContentCard {
  id: string
  contentTitle: string
  platform: string
  contentType: string
  status: string
  contentPillar: string
  frameworkUsed?: string
  audienceLevel: string
  icpPainPoint: string
  shadowFear?: string
  desiredTransformationFrom?: string
  desiredTransformationTo?: string
  hookAwareness: string
  hookVariations?: any
  scriptHook?: string
  fullScript?: string
  personalStoryUsed?: string
  proofMoment?: string
  productThatSolvesIt?: string
  offerLevel?: string
  shootDate?: string
  publishDate?: string
  views: number
  comments: number
  shares: number
  saves: number
  leadsGenerated: number
  revenueGenerated: number
  lessonLearned?: string
  whatWorked?: string
  whatFailed?: string
  isFavorite: boolean
  tags?: any
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  byPlatform: Array<{ platform: string; _count: number }>
  byStatus: Array<{ status: string; _count: number }>
  byPillar: Array<{ contentPillar: string; _count: number }>
}

export default function ContentCardsPage() {
  const router = useRouter()
  const [contentCards, setContentCards] = useState<ContentCard[]>([])
  const [filteredCards, setFilteredCards] = useState<ContentCard[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<ContentCard | null>(null)

  // Filters
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pillarFilter, setPillarFilter] = useState('all')
  const [audienceFilter, setAudienceFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    contentTitle: '',
    platform: 'instagram',
    contentType: 'reel',
    status: 'ideation',
    contentPillar: 'education',
    frameworkUsed: '',
    audienceLevel: 'beginner_creator',
    icpPainPoint: '',
    shadowFear: '',
    desiredTransformationFrom: '',
    desiredTransformationTo: '',
    hookAwareness: 'symptom_aware',
    hookVariations: [],
    scriptHook: '',
    fullScript: '',
    personalStoryUsed: '',
    proofMoment: '',
    productThatSolvesIt: '',
    offerLevel: '',
    shootDate: '',
    publishDate: '',
    lessonLearned: '',
    whatWorked: '',
    whatFailed: '',
    isFavorite: false,
  })

  // Fetch content cards
  const fetchContentCards = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (platformFilter !== 'all') params.append('platform', platformFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (pillarFilter !== 'all') params.append('contentPillar', pillarFilter)
      if (audienceFilter !== 'all') params.append('audienceLevel', audienceFilter)

      const response = await fetch(`/api/content-card/list?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content cards')
      }

      setContentCards(data.contentCards)
      setFilteredCards(data.contentCards)
      setStats(data.stats)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error fetching content cards:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContentCards()
  }, [platformFilter, statusFilter, pillarFilter, audienceFilter])

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = contentCards.filter(
        (card) =>
          card.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.icpPainPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.shadowFear?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCards(filtered)
    } else {
      setFilteredCards(contentCards)
    }
  }, [searchTerm, contentCards])

  // Reset form
  const resetForm = () => {
    setFormData({
      contentTitle: '',
      platform: 'instagram',
      contentType: 'reel',
      status: 'ideation',
      contentPillar: 'education',
      frameworkUsed: '',
      audienceLevel: 'beginner_creator',
      icpPainPoint: '',
      shadowFear: '',
      desiredTransformationFrom: '',
      desiredTransformationTo: '',
      hookAwareness: 'symptom_aware',
      hookVariations: [],
      scriptHook: '',
      fullScript: '',
      personalStoryUsed: '',
      proofMoment: '',
      productThatSolvesIt: '',
      offerLevel: '',
      shootDate: '',
      publishDate: '',
      lessonLearned: '',
      whatWorked: '',
      whatFailed: '',
      isFavorite: false,
    })
    setEditingCard(null)
  }

  // Create or update content card
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingCard ? '/api/content-card/update' : '/api/content-card/create'
      const method = editingCard ? 'PUT' : 'POST'

      const payload = editingCard ? { id: editingCard.id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save content card')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchContentCards()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error saving content card:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete content card
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content card?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/content-card/delete?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete content card')
      }

      fetchContentCards()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error deleting content card:', err)
    } finally {
      setLoading(false)
    }
  }

  // Toggle favorite
  const toggleFavorite = async (card: ContentCard) => {
    try {
      const response = await fetch('/api/content-card/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: card.id,
          isFavorite: !card.isFavorite,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      fetchContentCards()
    } catch (err: any) {
      console.error('Error toggling favorite:', err)
    }
  }

  // Edit content card
  const handleEdit = (card: ContentCard) => {
    setEditingCard(card)
    setFormData({
      contentTitle: card.contentTitle,
      platform: card.platform,
      contentType: card.contentType,
      status: card.status,
      contentPillar: card.contentPillar,
      frameworkUsed: card.frameworkUsed || '',
      audienceLevel: card.audienceLevel,
      icpPainPoint: card.icpPainPoint,
      shadowFear: card.shadowFear || '',
      desiredTransformationFrom: card.desiredTransformationFrom || '',
      desiredTransformationTo: card.desiredTransformationTo || '',
      hookAwareness: card.hookAwareness,
      hookVariations: card.hookVariations || [],
      scriptHook: card.scriptHook || '',
      fullScript: card.fullScript || '',
      personalStoryUsed: card.personalStoryUsed || '',
      proofMoment: card.proofMoment || '',
      productThatSolvesIt: card.productThatSolvesIt || '',
      offerLevel: card.offerLevel || '',
      shootDate: card.shootDate ? card.shootDate.split('T')[0] : '',
      publishDate: card.publishDate ? card.publishDate.split('T')[0] : '',
      lessonLearned: card.lessonLearned || '',
      whatWorked: card.whatWorked || '',
      whatFailed: card.whatFailed || '',
      isFavorite: card.isFavorite,
    })
    setIsDialogOpen(true)
  }

  // Schedule to Calendar Plus
  const scheduleToCalendar = (card: ContentCard) => {
    // Store the content card data in localStorage for Calendar Plus to pick up
    localStorage.setItem('pendingAction', JSON.stringify({
      action: 'schedule-from-content-card',
      data: {
        title: card.contentTitle,
        description: card.icpPainPoint,
        pillar: card.contentPillar,
        platform: card.platform,
        contentType: card.contentType,
        status: card.status,
        scheduledDate: card.publishDate || undefined,
        contentCardId: card.id,
      },
    }))

    // Navigate to Content Calendar Plus
    router.push('/dashboard/content-calendar-plus')
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Content Title',
      'Platform',
      'Status',
      'Content Pillar',
      'Audience Level',
      'Views',
      'Comments',
      'Shares',
      'Saves',
      'Leads',
      'Revenue',
    ]

    const rows = filteredCards.map((card) => [
      card.contentTitle,
      card.platform,
      card.status,
      card.contentPillar,
      card.audienceLevel,
      card.views,
      card.comments,
      card.shares,
      card.saves,
      card.leadsGenerated,
      card.revenueGenerated,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `content-cards-${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ideation: 'bg-purple-100 text-purple-800',
      scripting: 'bg-blue-100 text-blue-800',
      shooting: 'bg-yellow-100 text-yellow-800',
      editing: 'bg-orange-100 text-orange-800',
      scheduled: 'bg-green-100 text-green-800',
      published: 'bg-emerald-100 text-emerald-800',
      archived: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Get platform icon color
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'text-pink-600',
      tiktok: 'text-black',
      youtube: 'text-red-600',
      linkedin: 'text-blue-600',
      twitter: 'text-sky-500',
    }
    return colors[platform] || 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={FileText}
        iconColor="text-blue-500"
        eyebrow="Manage"
        title="Content Cards"
        description="Manage your content creation workflow from ideation to publishing"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cards</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">
                    {filteredCards.reduce((sum, card) => sum + card.views, 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold">
                    {filteredCards.reduce((sum, card) => sum + card.leadsGenerated, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    R{filteredCards.reduce((sum, card) => sum + card.revenueGenerated, 0).toFixed(2)}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by title, pain point, or shadow fear..."
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
                New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCard ? 'Edit Content Card' : 'Create New Content Card'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for your content. Required fields are marked with *
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Identity Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Content Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentTitle">Content Title *</Label>
                      <Input
                        id="contentTitle"
                        value={formData.contentTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, contentTitle: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform *</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value) =>
                          setFormData({ ...formData, platform: value })
                        }
                      >
                        <SelectTrigger id="platform">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type *</Label>
                      <Select
                        value={formData.contentType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, contentType: value })
                        }
                      >
                        <SelectTrigger id="contentType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reel">Reel</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube_short">YouTube Short</SelectItem>
                          <SelectItem value="youtube_long">YouTube Long</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="thread">Thread</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ideation">Ideation</SelectItem>
                          <SelectItem value="scripting">Scripting</SelectItem>
                          <SelectItem value="shooting">Shooting</SelectItem>
                          <SelectItem value="editing">Editing</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentPillar">Content Pillar *</Label>
                      <Select
                        value={formData.contentPillar}
                        onValueChange={(value) =>
                          setFormData({ ...formData, contentPillar: value })
                        }
                      >
                        <SelectTrigger id="contentPillar">
                          <SelectValue />
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
                    <div className="space-y-2">
                      <Label htmlFor="frameworkUsed">Framework Used</Label>
                      <Input
                        id="frameworkUsed"
                        value={formData.frameworkUsed}
                        onChange={(e) =>
                          setFormData({ ...formData, frameworkUsed: e.target.value })
                        }
                        placeholder="e.g., PAIDS, 4E, Hook Science"
                      />
                    </div>
                  </div>
                </div>

                {/* ICP Targeting Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">ICP Targeting</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audienceLevel">Audience Level *</Label>
                      <Select
                        value={formData.audienceLevel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, audienceLevel: value })
                        }
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
                      <Label htmlFor="shadowFear">Shadow Fear</Label>
                      <Input
                        id="shadowFear"
                        value={formData.shadowFear}
                        onChange={(e) =>
                          setFormData({ ...formData, shadowFear: e.target.value })
                        }
                        placeholder="e.g., invisibility, wasted_potential"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="icpPainPoint">ICP Pain Point *</Label>
                      <Textarea
                        id="icpPainPoint"
                        value={formData.icpPainPoint}
                        onChange={(e) =>
                          setFormData({ ...formData, icpPainPoint: e.target.value })
                        }
                        placeholder="What keeps them awake at night?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredTransformationFrom">Transformation From</Label>
                      <Input
                        id="desiredTransformationFrom"
                        value={formData.desiredTransformationFrom}
                        onChange={(e) =>
                          setFormData({ ...formData, desiredTransformationFrom: e.target.value })
                        }
                        placeholder="Where they are now"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredTransformationTo">Transformation To</Label>
                      <Input
                        id="desiredTransformationTo"
                        value={formData.desiredTransformationTo}
                        onChange={(e) =>
                          setFormData({ ...formData, desiredTransformationTo: e.target.value })
                        }
                        placeholder="Where they want to be"
                      />
                    </div>
                  </div>
                </div>

                {/* Hook & Script Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Hook & Script</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hookAwareness">Hook Awareness Level *</Label>
                      <Select
                        value={formData.hookAwareness}
                        onValueChange={(value) =>
                          setFormData({ ...formData, hookAwareness: value })
                        }
                      >
                        <SelectTrigger id="hookAwareness">
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
                    <div className="space-y-2">
                      <Label htmlFor="scriptHook">Script Hook (0-3s)</Label>
                      <Textarea
                        id="scriptHook"
                        value={formData.scriptHook}
                        onChange={(e) =>
                          setFormData({ ...formData, scriptHook: e.target.value })
                        }
                        placeholder="Opening hook for the first 3 seconds"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullScript">Full Script</Label>
                      <Textarea
                        id="fullScript"
                        value={formData.fullScript}
                        onChange={(e) =>
                          setFormData({ ...formData, fullScript: e.target.value })
                        }
                        placeholder="Complete script with all acts"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                {/* Story & Product Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Story & Product Connection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personalStoryUsed">Personal Story Used</Label>
                      <Input
                        id="personalStoryUsed"
                        value={formData.personalStoryUsed}
                        onChange={(e) =>
                          setFormData({ ...formData, personalStoryUsed: e.target.value })
                        }
                        placeholder="e.g., bathroom_floor, brand_deals"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proofMoment">Proof Moment</Label>
                      <Input
                        id="proofMoment"
                        value={formData.proofMoment}
                        onChange={(e) =>
                          setFormData({ ...formData, proofMoment: e.target.value })
                        }
                        placeholder="Receipt, result, screenshot"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productThatSolvesIt">Product That Solves It</Label>
                      <Input
                        id="productThatSolvesIt"
                        value={formData.productThatSolvesIt}
                        onChange={(e) =>
                          setFormData({ ...formData, productThatSolvesIt: e.target.value })
                        }
                        placeholder="e.g., tax_guide, course, coaching"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offerLevel">Offer Level</Label>
                      <Select
                        value={formData.offerLevel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, offerLevel: value })
                        }
                      >
                        <SelectTrigger id="offerLevel">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="established">Established</SelectItem>
                          <SelectItem value="contentpreneur">Contentpreneur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Production Schedule */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Production Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shootDate">Shoot Date</Label>
                      <Input
                        id="shootDate"
                        type="date"
                        value={formData.shootDate}
                        onChange={(e) =>
                          setFormData({ ...formData, shootDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) =>
                          setFormData({ ...formData, publishDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Learnings Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Learnings & Insights</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatWorked">What Worked</Label>
                      <Textarea
                        id="whatWorked"
                        value={formData.whatWorked}
                        onChange={(e) =>
                          setFormData({ ...formData, whatWorked: e.target.value })
                        }
                        placeholder="Document what performed well"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatFailed">What Failed</Label>
                      <Textarea
                        id="whatFailed"
                        value={formData.whatFailed}
                        onChange={(e) =>
                          setFormData({ ...formData, whatFailed: e.target.value })
                        }
                        placeholder="Document what didn't work"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lessonLearned">Lesson Learned</Label>
                      <Textarea
                        id="lessonLearned"
                        value={formData.lessonLearned}
                        onChange={(e) =>
                          setFormData({ ...formData, lessonLearned: e.target.value })
                        }
                        placeholder="Key takeaway from this content"
                        rows={2}
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
                      <>{editingCard ? 'Update' : 'Create'} Card</>
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
                  setPlatformFilter('all')
                  setStatusFilter('all')
                  setPillarFilter('all')
                  setAudienceFilter('all')
                }}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
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
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="ideation">Ideation</SelectItem>
                    <SelectItem value="scripting">Scripting</SelectItem>
                    <SelectItem value="shooting">Shooting</SelectItem>
                    <SelectItem value="editing">Editing</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content Pillar</Label>
                <Select value={pillarFilter} onValueChange={setPillarFilter}>
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
              <div className="space-y-2">
                <Label>Audience Level</Label>
                <Select value={audienceFilter} onValueChange={setAudienceFilter}>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Cards Grid */}
      {loading && filteredCards.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredCards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content cards found</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchTerm || platformFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Create your first content card to start managing your content workflow'}
            </p>
            {!searchTerm &&
              platformFilter === 'all' &&
              statusFilter === 'all' &&
              pillarFilter === 'all' &&
              audienceFilter === 'all' && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Card
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl ${getPlatformColor(card.platform)}`}>
                        {card.platform.charAt(0).toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          card.status
                        )}`}
                      >
                        {card.status}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{card.contentTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {card.contentPillar}
                        </span>
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                          {card.audienceLevel.replace('_', ' ')}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(card)}
                    className="h-8 w-8 p-0"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        card.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ICP Pain Point */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pain Point</p>
                  <p className="text-sm line-clamp-2">{card.icpPainPoint}</p>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{card.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{card.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{card.shares.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{card.saves.toLocaleString()}</span>
                  </div>
                </div>

                {/* Revenue & Leads */}
                {(card.leadsGenerated > 0 || card.revenueGenerated > 0) && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="text-sm font-semibold">{card.leadsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-sm font-semibold">R{card.revenueGenerated.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {/* Dates */}
                {(card.shootDate || card.publishDate) && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    {card.publishDate && (
                      <span>Publish: {new Date(card.publishDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scheduleToCalendar(card)}
                    className="flex-1 border-green-300 hover:bg-green-50"
                  >
                    <CalendarCheck className="h-3 w-3 mr-1 text-green-600" />
                    Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(card)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
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
    </div>
  )
}
