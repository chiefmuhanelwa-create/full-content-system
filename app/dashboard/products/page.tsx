'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package, Plus, Edit, Trash2, DollarSign, Users, Target } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  audienceLevel: 'Beginner' | 'Established' | 'Contentpreneur'
  productType: 'Digital' | 'Physical' | 'Service' | 'Tool' | 'Community'
  status: 'Live' | 'Development' | 'Future'
  painPoints: string
  coreBenefits: string
  description: string
  bonuses: string
  priceAnchor: string
  guarantee: string
  testimonials: string
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    audienceLevel: 'Beginner',
    productType: 'Digital',
    status: 'Live',
    painPoints: '',
    coreBenefits: '',
    description: '',
    bonuses: '',
    priceAnchor: '',
    guarantee: '',
    testimonials: '',
  })

  // Load products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products')
    if (stored) {
      setProducts(JSON.parse(stored))
    } else {
      // Pre-populate with your known products
      const defaultProducts: Product[] = [
        {
          id: Date.now().toString(),
          name: 'SA Tax Guide',
          price: 197,
          audienceLevel: 'Beginner',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Confused about SARS compliance, afraid of tax penalties, don\'t know what expenses to claim',
          coreBenefits: 'Complete tax clarity, legal protection, peace of mind, R50K+ in deductions',
          description: '115-page comprehensive guide for SA content creators. Every SARS scenario covered.',
          bonuses: 'Free Tax Calculator Access (R299 value), Personal Tax Question Answer (R500 value)',
          priceAnchor: 'Accountant consultation costs R3,500+',
          guarantee: 'Personal review guarantee - get answer within 48 hours if confused',
          testimonials: '500+ creators now tax compliant',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          name: 'Niche Clarity Workbook',
          price: 297,
          audienceLevel: 'Beginner',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Don\'t know what to post about, trying to appeal to everyone, no clear positioning',
          coreBenefits: 'Find your niche in 7 days, clear content strategy, authentic positioning',
          description: 'Step-by-step workbook to discover your profitable niche and positioning.',
          bonuses: 'Niche validation checklist, Competitor analysis template',
          priceAnchor: 'Brand strategist session costs R5,000+ for one hour',
          guarantee: '7-day money-back guarantee if you don\'t find clarity',
          testimonials: '300+ creators found their niche',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 2).toString(),
          name: 'The Influencer\'s Code',
          price: 350,
          audienceLevel: 'Established',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Inconsistent income, don\'t know how to negotiate deals, underpricing services',
          coreBenefits: 'Proven negotiation frameworks, pricing confidence, consistent brand deals',
          description: 'Complete guide to landing and negotiating brand deals. 5,000+ copies sold.',
          bonuses: 'Media kit template, Rate card calculator, Pitch email templates',
          priceAnchor: 'Business coach charges R2,000+/hour for this knowledge',
          guarantee: 'Land one deal or money back',
          testimonials: '5,000+ copies sold, countless brand deals secured',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 3).toString(),
          name: 'Foundation of Content Creation',
          price: 1997,
          audienceLevel: 'Established',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Posting inconsistently, no content strategy, burnout from daily posting, low engagement',
          coreBenefits: 'Complete content system, viral frameworks, sustainable posting rhythm, 10X engagement',
          description: 'Master the NOCHILL framework, Hook Science, and Ubuntu Story Arc. Everything I wish I knew when starting.',
          bonuses: '110+ Content Ideas Vault, 110+ Story Variations, Hook Templates Library, Script breakdown examples',
          priceAnchor: 'Content coaching costs R5,000+/month. This is lifetime access.',
          guarantee: '30-day results or money back - see measurable engagement increase',
          testimonials: 'Helped 2,000+ creators build sustainable content systems',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 4).toString(),
          name: 'Personal Brand Foundations',
          price: 4997,
          audienceLevel: 'Established',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Being seen as "just another creator", no differentiation, copying others, imposter syndrome',
          coreBenefits: 'Unique positioning, authentic brand voice, category of one status, magnetic personal brand',
          description: 'Build a personal brand that stands out. From positioning to voice to visual identity.',
          bonuses: 'Brand Voice Analyzer, Personal Story Mining Framework, Visual Identity Templates, Positioning Workshop Recording',
          priceAnchor: 'Brand consultants charge R50,000+ for this level of transformation',
          guarantee: '60-day implementation guarantee with 1-on-1 feedback session',
          testimonials: 'Helped 500+ creators find their authentic voice and stand out',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 5).toString(),
          name: 'Skool Community',
          price: 997,
          audienceLevel: 'Established',
          productType: 'Community',
          status: 'Live',
          painPoints: 'Learning alone, no accountability, missing connections, slow growth without community',
          coreBenefits: 'Daily support, network of creators, accountability partners, exclusive resources, monthly coaching',
          description: 'Join 500+ creators building together. Daily content reviews, strategy sessions, and community support.',
          bonuses: 'Weekly group coaching calls, Monthly hot seat sessions, Exclusive resource library, Direct access to Ndivhuwo',
          priceAnchor: 'Masterminds charge R10,000+/month. This is comprehensive community for R997/month.',
          guarantee: 'Cancel anytime - no long-term commitment',
          testimonials: '500+ active members, R1M+ in collective deals secured',
          createdAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 6).toString(),
          name: 'Contentpreneur Starter Kit',
          price: 7997,
          audienceLevel: 'Contentpreneur',
          productType: 'Digital',
          status: 'Live',
          painPoints: 'Time-for-money trap, can\'t scale, missing systems for growth, building for yourself not your children',
          coreBenefits: 'Complete business system, scalable frameworks, generational wealth foundation, legacy building',
          description: 'Everything you need to transition from creator to contentpreneur. Full operating system for your children\'s children.',
          bonuses: 'Private community access, Monthly group coaching, All templates and frameworks, Personal onboarding call',
          priceAnchor: 'MBA costs R200,000+ and teaches theory. This is practical business building with proven systems.',
          guarantee: 'Implement for 90 days or full refund - we bet on your success',
          testimonials: 'Transformed 100+ creators into business owners building generational wealth',
          createdAt: new Date().toISOString(),
        },
      ]
      setProducts(defaultProducts)
      localStorage.setItem('products', JSON.stringify(defaultProducts))
    }
  }, [])

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // Update existing product
      const updated = products.map((p) =>
        p.id === editingId ? { ...formData, id: editingId, createdAt: p.createdAt } as Product : p
      )
      saveProducts(updated)
      setEditingId(null)
    } else {
      // Create new product
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      } as Product
      saveProducts([...products, newProduct])
    }

    // Reset form
    setFormData({
      name: '',
      price: 0,
      audienceLevel: 'Beginner',
      productType: 'Digital',
      status: 'Live',
      painPoints: '',
      coreBenefits: '',
      description: '',
      bonuses: '',
      priceAnchor: '',
      guarantee: '',
      testimonials: '',
    })
    setIsEditing(false)
  }

  const editProduct = (product: Product) => {
    setFormData(product)
    setEditingId(product.id)
    setIsEditing(true)
  }

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      saveProducts(products.filter((p) => p.id !== id))
    }
  }

  const getAudienceBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Established':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Contentpreneur':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-700'
      case 'Development':
        return 'bg-yellow-100 text-yellow-700'
      case 'Future':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const stats = {
    total: products.length,
    live: products.filter((p) => p.status === 'Live').length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    byAudience: {
      beginner: products.filter((p) => p.audienceLevel === 'Beginner').length,
      established: products.filter((p) => p.audienceLevel === 'Established').length,
      contentpreneur: products.filter((p) => p.audienceLevel === 'Contentpreneur').length,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Package className="h-8 w-8 text-purple-600" />
              Product Database
            </h1>
            <p className="text-gray-600">
              Manage your products - powers all sales scripts, offers, and campaigns
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Add Product'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Live</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.live}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">R{stats.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">By Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <p>Beginner: {stats.byAudience.beginner}</p>
              <p>Established: {stats.byAudience.established}</p>
              <p>Contentpreneur: {stats.byAudience.contentpreneur}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Form */}
        {isEditing && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>Product details for sales scripts and offers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="SA Tax Guide"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ZAR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="197"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audienceLevel">Audience Level *</Label>
                  <Select
                    value={formData.audienceLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, audienceLevel: value as Product['audienceLevel'] })
                    }
                  >
                    <SelectTrigger id="audienceLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner Creator</SelectItem>
                      <SelectItem value="Established">Established Creator</SelectItem>
                      <SelectItem value="Contentpreneur">Contentpreneur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productType: value as Product['productType'] })
                    }
                  >
                    <SelectTrigger id="productType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital">Digital Product</SelectItem>
                      <SelectItem value="Physical">Physical Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Tool">Tool/Software</SelectItem>
                      <SelectItem value="Community">Community Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as Product['status'] })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Live">Live</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Future">Future</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="115-page comprehensive guide..."
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoints">Pain Points *</Label>
                  <Textarea
                    id="painPoints"
                    value={formData.painPoints}
                    onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                    placeholder="Confused about SARS, afraid of penalties..."
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500">What problems does this solve?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coreBenefits">Core Benefits *</Label>
                  <Textarea
                    id="coreBenefits"
                    value={formData.coreBenefits}
                    onChange={(e) => setFormData({ ...formData, coreBenefits: e.target.value })}
                    placeholder="Complete tax clarity, peace of mind..."
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500">What outcomes do they get?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonuses">Bonuses (Optional)</Label>
                  <Textarea
                    id="bonuses"
                    value={formData.bonuses}
                    onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
                    placeholder="Free calculator access (R299 value)..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceAnchor">Price Anchor (Optional)</Label>
                  <Input
                    id="priceAnchor"
                    value={formData.priceAnchor}
                    onChange={(e) => setFormData({ ...formData, priceAnchor: e.target.value })}
                    placeholder="Accountant costs R3,500+"
                  />
                  <p className="text-xs text-gray-500">What's the expensive alternative?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guarantee">Guarantee (Optional)</Label>
                  <Textarea
                    id="guarantee"
                    value={formData.guarantee}
                    onChange={(e) => setFormData({ ...formData, guarantee: e.target.value })}
                    placeholder="Personal review within 48 hours..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonials">Social Proof (Optional)</Label>
                  <Textarea
                    id="testimonials"
                    value={formData.testimonials}
                    onChange={(e) => setFormData({ ...formData, testimonials: e.target.value })}
                    placeholder="500+ creators now tax compliant..."
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className={isEditing ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {product.name}
                          <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(product.status)}`}>
                            {product.status}
                          </span>
                        </CardTitle>
                        <CardDescription className="mt-2">{product.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => editProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            R{product.price.toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${getAudienceBadgeColor(
                            product.audienceLevel
                          )}`}
                        >
                          <Users className="h-3 w-3 inline mr-1" />
                          {product.audienceLevel}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full border bg-gray-100 text-gray-700">
                          {product.productType}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Pain Points:</p>
                          <p className="text-sm text-gray-700">{product.painPoints}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Core Benefits:</p>
                          <p className="text-sm text-gray-700">{product.coreBenefits}</p>
                        </div>
                      </div>

                      {product.bonuses && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Bonuses:</p>
                          <p className="text-sm text-gray-700">{product.bonuses}</p>
                        </div>
                      )}

                      {product.priceAnchor && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Price Anchor:</p>
                          <p className="text-sm text-gray-700">{product.priceAnchor}</p>
                        </div>
                      )}

                      {product.guarantee && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Guarantee:</p>
                          <p className="text-sm text-gray-700">{product.guarantee}</p>
                        </div>
                      )}

                      {product.testimonials && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Social Proof:</p>
                          <p className="text-sm text-gray-700">{product.testimonials}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm mb-4">No products yet</p>
                  <Button onClick={() => setIsEditing(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
