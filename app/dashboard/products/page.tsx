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
  // 10-Step Storytelling Framework
  step1_callout?: string
  step2_attention?: string
  step3_problem?: string
  step4_intrigue?: string
  step5_floodlight?: string
  step6_solution?: string
  step7_credentials?: string
  step8_benefits?: string
  step9_proof?: string
  step10_offer?: string
  contentHooks?: string[] // Array of content hooks for creating content about this product
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
    step1_callout: '',
    step2_attention: '',
    step3_problem: '',
    step4_intrigue: '',
    step5_floodlight: '',
    step6_solution: '',
    step7_credentials: '',
    step8_benefits: '',
    step9_proof: '',
    step10_offer: '',
    contentHooks: [],
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
          // 10-Step Storytelling Framework
          step1_callout: 'If you made more than R30,000 from content creation last year and haven\'t registered with SARS...',
          step2_attention: 'You\'re probably committing tax fraud right now and don\'t even know it. And SARS? They already know about your income.',
          step3_problem: 'Here\'s what most South African creators don\'t realize: Every brand payment, every platform payout, every sponsorship—it\'s all being reported to SARS automatically. The banks are legally required to flag accounts receiving business income. I learned this the hard way when I owed SARS money I didn\'t have because I thought \'content creation\' wasn\'t a real business. Spoiler: SARS disagreed.',
          step4_intrigue: 'But what if I told you the same tax system that can destroy you can actually save you R50,000+ every year? What if being tax compliant made you MORE profitable, not less?',
          step5_floodlight: 'Picture this: You\'ve just landed your biggest brand deal—R80,000. You\'re celebrating. Then 6 months later, SARS sends you a letter. You owe R45,000 in back taxes. Plus penalties. Plus interest. The money\'s already spent. Your account is frozen. This is happening to creators across Mzansi right now. I\'ve seen creators lose houses, cars, opportunities—all because they didn\'t know the rules of the game.',
          step6_solution: 'That\'s exactly why I created the SA Content Creator Tax Guide—115 pages of everything I wish someone had told me before I made expensive mistakes. This isn\'t generic tax advice. This is specifically for South African content creators, written in plain English, covering every scenario from brand deals to platform payouts to affiliate income.',
          step7_credentials: 'I\'m Ndivhuwo \'NO CHILL in Mzansi\'—I\'ve earned over R600,000 in verified platform revenue. I\'ve worked with Netflix, Samsung, Coca-Cola, DSTV, Savanna, Red Bull. I\'ve made the tax mistakes. Paid the penalties. Owed SARS money I didn\'t have. Then I figured it out, got compliant, and now I\'m sharing everything so you don\'t have to learn the hard way like I did.',
          step8_benefits: 'Inside the 115-page guide you get:\n✅ Complete SARS registration walkthrough (screenshot-by-screenshot)\n✅ Provisional tax explained like you\'re 5 years old\n✅ Every legitimate expense you can claim (I give you the actual list)\n✅ How to handle brand payments, gifts, and barter deals\n✅ What to do if you\'re already behind (there\'s a way out)\n✅ Monthly tax calendar so you never miss deadlines\n✅ Real examples from actual creator scenarios\n✅ Bonus: Access to tax calculators on contentpreneurship.com',
          step9_proof: 'This guide saved me R38,000 in my first year of being tax compliant. I was claiming NOTHING before. Now I track everything.',
          step10_offer: 'Here\'s the deal: Hire an accountant who specializes in content creators, and you\'ll pay R3,000-R5,000 just for a consultation. Or you can get this complete 115-page guide for R197—that\'s less than one meal out.\n\nGUARANTEE: If you read this guide and still feel confused about your taxes, send me a screenshot of your proof of purchase and your specific question. I\'ll answer it personally within 48 hours.\n\nBONUS: Everyone who gets the guide today gets free access to all the tax tools on contentpreneurship.com (Provisional Tax Calculator, Income Tracker, Business Tax Calculator)—normally R299/month.\n\nClick below. Get compliant. Protect your future. You understand? Because you understand.',
          contentHooks: [
            'I owed SARS money I didn\'t have. Here\'s what I learned...',
            '5 expenses South African creators don\'t know they can claim',
            'SARS is watching your Instagram. Here\'s what they see...',
            'How I saved R50,000 in legal tax deductions',
            'The brand deal trap nobody warns creators about',
            'What happens when SARS audits a content creator (real story)',
            'Is your content hobby or business? SARS already decided.'
          ],
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
          // 10-Step Storytelling Framework
          step1_callout: 'If you\'re posting 3-5 times a day across multiple platforms and STILL not growing...',
          step2_attention: 'The problem isn\'t your content. It\'s not the algorithm. It\'s not \'saturation.\' The problem is: nobody knows what you actually stand for.',
          step3_problem: 'I see this every day: talented creators making beautiful content about... everything. Monday it\'s fitness tips. Wednesday it\'s relationship advice. Friday it\'s food reviews. And their followers? Confused. The algorithm? Confused. Brands? They scroll past because they can\'t figure out what you\'re an expert in. Here\'s the truth nobody tells you: The riches are in the niches. Not because you have to be boring—but because clarity creates cash flow.',
          step4_intrigue: 'What if you could walk into any room, virtual or physical, and in 10 seconds people understand EXACTLY what you do and why they should care? What if your content practically created itself because you\'re so clear on your lane?',
          step5_floodlight: 'Right now, you\'re the best-kept secret on the internet. You\'re working 10x harder than creators with half your talent because you\'re trying to be everything to everyone. You see someone blow up with comedy, so you try comedy. Someone else is winning with educational content, so you pivot to that. You\'re exhausted. Your engagement is inconsistent. Brands can\'t figure out how to work with you because your profile looks like a confused Pinterest board. And the worst part? You KNOW you have something valuable to offer—you just can\'t articulate what it is.',
          step6_solution: 'That\'s why I built the Niche Clarity Workbook. This isn\'t theory. It\'s 30+ pages of exercises, frameworks, and questions that force you to get uncomfortably clear about who you serve, what problem you solve, and how you\'re different from the 10,000 other creators in your space.',
          step7_credentials: 'I built \'NO CHILL in Mzansi\' from a meme page to 3 million+ followers across platforms. I\'ve worked with the biggest brands in South Africa. I lost 780,000 followers to copyright strikes and rebuilt. I know what it\'s like to be unclear. And I know exactly what clarity unlocks: money, opportunities, and peace of mind.',
          step8_benefits: 'Inside the Niche Clarity Workbook:\n✅ The 4-Quadrant Clarity Framework (find your unique position)\n✅ Audience Avatar Builder (know your people better than they know themselves)\n✅ Competitor Analysis Template (steal what works, avoid what doesn\'t)\n✅ Content Pillar System (never run out of ideas again)\n✅ 90-Day Content Calendar Generator\n✅ Your One-Sentence Bio Formula\n✅ The Positioning Statement Template\n✅ Monetization Map (how your niche makes money)',
          step9_proof: 'I spent 2 years trying to figure out my niche. This workbook gave me clarity in ONE weekend. My engagement doubled in 30 days just from being more focused.',
          step10_offer: 'Most branding consultants charge R5,000+ for a niche clarity session. You\'re getting the entire framework, self-paced, for R297.\n\nGUARANTEE: Complete the workbook. If you\'re still unclear about your niche, send me your completed exercises and I\'ll personally review them and give you feedback within 5 business days.\n\nBONUS: Get the Niche Clarity Workbook today and unlock the Niche Validation Checklist (R197 value) FREE—this shows you how to test your niche before you go all-in.\n\nStop guessing. Get clear. Start winning. You understand?',
          contentHooks: [
            'I had 780K followers and no niche. Then I lost everything...',
            'Why talented creators stay broke (it\'s not the algorithm)',
            'The one question that changed my entire brand',
            'You\'re not \'multi-passionate\'—you\'re unclear',
            'How to pick a niche when you\'re interested in everything',
            'The biggest lie about finding your niche',
            'I built 3M followers by getting uncomfortably specific'
          ],
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
      step1_callout: '',
      step2_attention: '',
      step3_problem: '',
      step4_intrigue: '',
      step5_floodlight: '',
      step6_solution: '',
      step7_credentials: '',
      step8_benefits: '',
      step9_proof: '',
      step10_offer: '',
      contentHooks: [],
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

                {/* 10-Step Storytelling Framework Section */}
                <div className="pt-4 border-t space-y-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <p className="text-sm font-bold text-green-800 mb-1">💰 10-Step Storytelling Framework (Optional)</p>
                    <p className="text-xs text-green-700">Pre-write complete sales scripts for this product. Used by Script Generator in Sales Mode.</p>
                  </div>

                  <details className="space-y-4">
                    <summary className="cursor-pointer text-sm font-semibold text-blue-700 hover:text-blue-900">
                      + Add 10-Step Sales Framework
                    </summary>
                    <div className="space-y-3 pt-3">
                      <div className="space-y-2">
                        <Label htmlFor="step1_callout" className="text-xs">Step 1: Call Out Audience</Label>
                        <Input
                          id="step1_callout"
                          value={formData.step1_callout}
                          onChange={(e) => setFormData({ ...formData, step1_callout: e.target.value })}
                          placeholder="If you made more than R30,000..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step2_attention" className="text-xs">Step 2: Demand Attention</Label>
                        <Textarea
                          id="step2_attention"
                          value={formData.step2_attention}
                          onChange={(e) => setFormData({ ...formData, step2_attention: e.target.value })}
                          placeholder="Bold statement that stops the scroll..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step3_problem" className="text-xs">Step 3: Back Up The Problem</Label>
                        <Textarea
                          id="step3_problem"
                          value={formData.step3_problem}
                          onChange={(e) => setFormData({ ...formData, step3_problem: e.target.value })}
                          placeholder="Validate why this problem exists..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step4_intrigue" className="text-xs">Step 4: Create Irresistible Intrigue</Label>
                        <Textarea
                          id="step4_intrigue"
                          value={formData.step4_intrigue}
                          onChange={(e) => setFormData({ ...formData, step4_intrigue: e.target.value })}
                          placeholder="Tease the transformation..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step5_floodlight" className="text-xs">Step 5: Floodlight On The Problem</Label>
                        <Textarea
                          id="step5_floodlight"
                          value={formData.step5_floodlight}
                          onChange={(e) => setFormData({ ...formData, step5_floodlight: e.target.value })}
                          placeholder="Paint the vivid picture of pain..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step6_solution" className="text-xs">Step 6: Provide The Solution</Label>
                        <Textarea
                          id="step6_solution"
                          value={formData.step6_solution}
                          onChange={(e) => setFormData({ ...formData, step6_solution: e.target.value })}
                          placeholder="Introduce your product as THE answer..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step7_credentials" className="text-xs">Step 7: Show Credentials</Label>
                        <Textarea
                          id="step7_credentials"
                          value={formData.step7_credentials}
                          onChange={(e) => setFormData({ ...formData, step7_credentials: e.target.value })}
                          placeholder="Why should they trust YOU specifically..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step8_benefits" className="text-xs">Step 8: Detail The Benefits</Label>
                        <Textarea
                          id="step8_benefits"
                          value={formData.step8_benefits}
                          onChange={(e) => setFormData({ ...formData, step8_benefits: e.target.value })}
                          placeholder="What exactly do they get..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step9_proof" className="text-xs">Step 9: Social Proof & Results</Label>
                        <Textarea
                          id="step9_proof"
                          value={formData.step9_proof}
                          onChange={(e) => setFormData({ ...formData, step9_proof: e.target.value })}
                          placeholder="Testimonials, case studies, results..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="step10_offer" className="text-xs">Step 10: The Godfather Offer</Label>
                        <Textarea
                          id="step10_offer"
                          value={formData.step10_offer}
                          onChange={(e) => setFormData({ ...formData, step10_offer: e.target.value })}
                          placeholder="The offer they can't refuse + guarantee/bonus..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </details>

                  {/* Content Hooks Section */}
                  <details className="space-y-4">
                    <summary className="cursor-pointer text-sm font-semibold text-purple-700 hover:text-purple-900">
                      + Add Content Hooks
                    </summary>
                    <div className="space-y-2 pt-3">
                      <Label htmlFor="contentHooks" className="text-xs">Content Hooks (One per line)</Label>
                      <Textarea
                        id="contentHooks"
                        value={formData.contentHooks?.join('\n') || ''}
                        onChange={(e) => setFormData({ ...formData, contentHooks: e.target.value.split('\n').filter(h => h.trim()) })}
                        placeholder="I owed SARS money I didn't have. Here's what I learned...&#10;5 expenses South African creators don't know they can claim&#10;SARS is watching your Instagram. Here's what they see..."
                        rows={5}
                      />
                      <p className="text-xs text-gray-500">Ideas for creating content about this product</p>
                    </div>
                  </details>
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

                      {/* 10-Step Storytelling Framework */}
                      {product.step1_callout && (
                        <details className="pt-4 border-t">
                          <summary className="cursor-pointer text-xs font-semibold text-green-700 hover:text-green-900 mb-2">
                            💰 View 10-Step Sales Framework
                          </summary>
                          <div className="space-y-3 pt-2 pl-3 border-l-2 border-green-300">
                            <div>
                              <p className="text-xs font-semibold text-green-700">1. Call Out Audience:</p>
                              <p className="text-xs text-gray-700">{product.step1_callout}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">2. Demand Attention:</p>
                              <p className="text-xs text-gray-700">{product.step2_attention}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">3. Back Up Problem:</p>
                              <p className="text-xs text-gray-700">{product.step3_problem}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">4. Create Intrigue:</p>
                              <p className="text-xs text-gray-700">{product.step4_intrigue}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">5. Floodlight Problem:</p>
                              <p className="text-xs text-gray-700">{product.step5_floodlight}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">6. Provide Solution:</p>
                              <p className="text-xs text-gray-700">{product.step6_solution}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">7. Show Credentials:</p>
                              <p className="text-xs text-gray-700">{product.step7_credentials}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">8. Detail Benefits:</p>
                              <p className="text-xs text-gray-700 whitespace-pre-line">{product.step8_benefits}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">9. Social Proof:</p>
                              <p className="text-xs text-gray-700">{product.step9_proof}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700">10. Godfather Offer:</p>
                              <p className="text-xs text-gray-700 whitespace-pre-line">{product.step10_offer}</p>
                            </div>
                          </div>
                        </details>
                      )}

                      {/* Content Hooks */}
                      {product.contentHooks && product.contentHooks.length > 0 && (
                        <details className="pt-2 border-t">
                          <summary className="cursor-pointer text-xs font-semibold text-purple-700 hover:text-purple-900 mb-2">
                            🎣 View Content Hooks ({product.contentHooks.length})
                          </summary>
                          <ul className="space-y-1 pt-2 pl-3">
                            {product.contentHooks.map((hook, idx) => (
                              <li key={idx} className="text-xs text-gray-700">• {hook}</li>
                            ))}
                          </ul>
                        </details>
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
