'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  FlaskConical, ArrowRight, CheckCircle2, Rocket, Package,
  Search, Copy, Check, ChevronDown, ChevronUp,
  ShoppingCart, AlertCircle, Loader2
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import {
  PRODUCT_CATALOG,
  ProductPlanEntry,
  PlanningStatus,
  ProductTrack,
  TRACK_LABELS,
  STATUS_CONFIG,
} from '@/lib/productCatalog'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────

interface StatusMap {
  [code: string]: PlanningStatus
}

interface ToastState {
  message: string
  type: 'success' | 'error'
}

// ─── Constants ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'nochill-product-planning-status'
const STATUS_ORDER: PlanningStatus[] = ['draft', 'building', 'built', 'live']

const STATUS_NEXT: Record<PlanningStatus, PlanningStatus | null> = {
  draft: 'building',
  building: 'built',
  built: 'live',
  live: null,
}

const STATUS_ICON = {
  draft: FlaskConical,
  building: ArrowRight,
  built: CheckCircle2,
  live: Rocket,
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ProductPlanningPage() {
  const [statusMap, setStatusMap] = useState<StatusMap>({})
  const [search, setSearch] = useState('')
  const [filterTrack, setFilterTrack] = useState<string>('all')
  const [filterICP, setFilterICP] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<ProductPlanEntry | null>(null)
  const [showShopifyModal, setShowShopifyModal] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [promoteLoading, setPromoteLoading] = useState(false)
  const [shopifyLoading, setShopifyLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [promotedCodes, setPromotedCodes] = useState<Set<string>>(new Set())

  // Load saved status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setStatusMap(parsed.statuses || {})
        setPromotedCodes(new Set(parsed.promoted || []))
      }
    } catch {
      // ignore
    }
  }, [])

  const saveStatus = useCallback((statuses: StatusMap, promoted: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      statuses,
      promoted: Array.from(promoted),
    }))
  }, [])

  const getStatus = (code: string): PlanningStatus => statusMap[code] ?? 'draft'

  const setStatus = (code: string, status: PlanningStatus) => {
    const updated = { ...statusMap, [code]: status }
    setStatusMap(updated)
    saveStatus(updated, promotedCodes)
  }

  const advanceStatus = (code: string) => {
    const current = getStatus(code)
    const next = STATUS_NEXT[current]
    if (next) setStatus(code, next)
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ─── Filtering ──────────────────────────────────────────────────────────

  const filtered = PRODUCT_CATALOG.filter((p) => {
    const status = getStatus(p.code)
    if (filterStatus !== 'all' && status !== filterStatus) return false
    if (filterTrack !== 'all' && p.track !== filterTrack) return false
    if (filterICP !== 'all') {
      if (filterICP === '1' && p.icp !== '1' && p.icp !== 'both') return false
      if (filterICP === '2' && p.icp !== '2' && p.icp !== 'both') return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.painPoints.some((pp) => pp.toLowerCase().includes(q)) ||
        p.problemSolved.toLowerCase().includes(q)
      )
    }
    return true
  })

  // ─── Stats ──────────────────────────────────────────────────────────────

  const stats = {
    total: PRODUCT_CATALOG.length,
    draft: PRODUCT_CATALOG.filter((p) => getStatus(p.code) === 'draft').length,
    building: PRODUCT_CATALOG.filter((p) => getStatus(p.code) === 'building').length,
    built: PRODUCT_CATALOG.filter((p) => getStatus(p.code) === 'built').length,
    live: PRODUCT_CATALOG.filter((p) => getStatus(p.code) === 'live').length,
    totalValue: PRODUCT_CATALOG.reduce((acc, p) => acc + p.price, 0),
  }

  // ─── Promote to Products DB ─────────────────────────────────────────────

  const promoteToProducts = async (product: ProductPlanEntry) => {
    setPromoteLoading(true)
    try {
      const payload = {
        productName: `${product.code} — ${product.name}`,
        productType: product.productType,
        price: product.price,
        currency: 'ZAR',
        audienceLevel: product.audienceLevel,
        audienceSegment: product.icpLabel,
        description: product.description,
        coreBenefits: product.transformation,
        painPoints: product.painPoints.join('\n• '),
        paidsStream: product.paidsStream,
        ladderPosition: product.ladderPosition,
        status: 'coming_soon',
        notes: product.shopifyCopy,
        tags: JSON.stringify({
          planCode: product.code,
          track: product.track,
          icp: product.icp,
          shadowFears: product.shadowFears,
          problemSolved: product.problemSolved,
          shopifyCopyReady: true,
        }),
      }

      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create product')

      const updated = new Set(promotedCodes)
      updated.add(product.code)
      setPromotedCodes(updated)
      saveStatus(statusMap, updated)
      setStatus(product.code, 'built')
      setShowPromoteModal(false)
      showToast(`${product.code} added to Products DB`, 'success')
    } catch (err) {
      showToast('Failed to add to Products DB', 'error')
    } finally {
      setPromoteLoading(false)
    }
  }

  // ─── Push to Shopify ────────────────────────────────────────────────────

  const pushToShopify = async (product: ProductPlanEntry) => {
    setShopifyLoading(true)
    try {
      const res = await fetch('/api/shopify/push-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.name,
          body_html: product.shopifyCopy.replace(/\n/g, '<br/>'),
          vendor: 'NOCHILL',
          product_type: product.productType,
          tags: [product.code, product.track, `ICP${product.icp}`, ...product.shadowFears],
          variants: [{ price: String(product.price), sku: product.code }],
          status: 'draft',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Shopify push failed')
      }

      const updated = { ...statusMap, [product.code]: 'live' as PlanningStatus }
      setStatusMap(updated)
      saveStatus(updated, promotedCodes)
      setShowShopifyModal(false)
      showToast(`${product.code} pushed to Shopify as draft`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Shopify push failed', 'error')
    } finally {
      setShopifyLoading(false)
    }
  }

  const copyShopifyCopy = async (text: string, code: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={FlaskConical}
        iconColor="text-[#2563EB]"
        eyebrow="Product Lab"
        title="Product Planning"
        description="Track all 55 NOCHILL products from draft to live Shopify listing"
      />

      <div className="px-6 py-8 space-y-6">

        {/* ─── Stats Bar ─── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {([
            { label: 'Total', value: stats.total, status: 'all' },
            { label: 'Draft', value: stats.draft, status: 'draft' },
            { label: 'Building', value: stats.building, status: 'building' },
            { label: 'Built', value: stats.built, status: 'built' },
            { label: 'Live', value: stats.live, status: 'live' },
          ] as const).map(({ label, value, status }) => {
            const cfg = status === 'all'
              ? { bg: 'bg-[#E4E4E7]', color: 'text-[#52525B]', border: 'border-[#E4E4E7]' }
              : STATUS_CONFIG[status]
            return (
              <button
                key={label}
                onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left transition-all hover:ring-2 hover:ring-[#2563EB]/40',
                  cfg.bg, cfg.border,
                  filterStatus === status && 'ring-2 ring-[#2563EB]'
                )}
              >
                <p className={cn('text-[12px] font-display font-bold uppercase tracking-wider', cfg.color)}>{label}</p>
                <p className={cn('text-2xl font-display font-black mt-1', cfg.color)}>{value}</p>
              </button>
            )
          })}
        </div>

        {/* Revenue potential */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#71717A]">Total catalogue value:</span>
          <span className="font-display font-black text-[#2563EB]">
            R{stats.totalValue.toLocaleString()}
          </span>
          <span className="text-[#71717A]">•</span>
          <span className="text-[#71717A]">{stats.live} live</span>
          <span className="text-[#71717A]">•</span>
          <span className="text-[#71717A]">{stats.built} ready to push</span>
        </div>

        {/* ─── Filters ─── */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, pain points..."
              className="pl-9 bg-white border-[#E4E4E7]"
            />
          </div>
          <Select value={filterTrack} onValueChange={setFilterTrack}>
            <SelectTrigger className="w-44 bg-white border-[#E4E4E7]">
              <SelectValue placeholder="Track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tracks</SelectItem>
              {(Object.entries(TRACK_LABELS) as [ProductTrack, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterICP} onValueChange={setFilterICP}>
            <SelectTrigger className="w-36 bg-white border-[#E4E4E7]">
              <SelectValue placeholder="ICP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Both ICPs</SelectItem>
              <SelectItem value="1">ICP 1 — Expert</SelectItem>
              <SelectItem value="2">ICP 2 — Creator</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-[#71717A] whitespace-nowrap">{filtered.length} products</p>
        </div>

        {/* ─── Product List ─── */}
        <div className="space-y-3">
          {filtered.map((product) => {
            const status = getStatus(product.code)
            const cfg = STATUS_CONFIG[status]
            const StatusIcon = STATUS_ICON[status]
            const nextStatus = STATUS_NEXT[status]
            const isExpanded = expandedCards.has(product.code)
            const isPromoted = promotedCodes.has(product.code)

            return (
              <Card
                key={product.code}
                className={cn(
                  'border transition-all',
                  status === 'live' ? 'border-blue-200' :
                  status === 'built' ? 'border-emerald-200' :
                  status === 'building' ? 'border-[#2563EB]/40' :
                  'border-[#E4E4E7]'
                )}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Code + Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-[12px] font-display font-black bg-[#18181B] text-white px-2 py-1 rounded-lg flex-shrink-0">
                        {product.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-black text-[#18181B] text-[15px] leading-tight truncate">
                          {product.name}
                        </h3>
                        <p className="text-[13px] text-[#71717A] truncate mt-0.5">{product.subtitle}</p>
                      </div>
                    </div>

                    {/* Right: Price + Status + Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-display font-black text-[#2563EB] text-sm">
                        {product.priceRange ?? `R${product.price.toLocaleString()}`}
                      </span>
                      <span className={cn(
                        'flex items-center gap-1 text-[12px] font-display font-black px-2 py-1 rounded-full border',
                        cfg.bg, cfg.color, cfg.border
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                      {nextStatus && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[13px] border-[#2563EB]/40 text-[#2563EB] hover:bg-blue-50"
                          onClick={() => advanceStatus(product.code)}
                        >
                          → {STATUS_CONFIG[nextStatus].label}
                        </Button>
                      )}
                      <button
                        onClick={() => setExpandedCards((prev) => {
                          const next = new Set(prev)
                          next.has(product.code) ? next.delete(product.code) : next.add(product.code)
                          return next
                        })}
                        className="p-1 rounded hover:bg-[#E4E4E7] text-[#71717A]"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 mt-2 pb-3">
                    <span className={cn(
                      'text-[11px] font-display font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                      product.icp === '1' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      product.icp === '2' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    )}>
                      {product.icpLabel}
                    </span>
                    <span className="text-[11px] font-display font-bold px-2 py-0.5 rounded-full bg-[#E4E4E7] text-[#52525B] border border-[#E4E4E7] uppercase tracking-wider">
                      {TRACK_LABELS[product.track]}
                    </span>
                    <span className="text-[11px] font-display font-bold px-2 py-0.5 rounded-full bg-[#E4E4E7] text-[#52525B] border border-[#E4E4E7] uppercase tracking-wider">
                      {product.paidsStream.toUpperCase()}
                    </span>
                    {isPromoted && (
                      <span className="text-[9px] font-display font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                        ✓ In Products DB
                      </span>
                    )}
                  </div>
                </CardHeader>

                {/* ─── Expanded Details ─── */}
                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-0 border-t border-[#E4E4E7]">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {/* Pain Points */}
                      <div>
                        <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-2">Pain Points</p>
                        <ul className="space-y-1">
                          {product.painPoints.map((pp, i) => (
                            <li key={i} className="text-sm text-[#18181B] flex gap-2">
                              <span className="text-[#2563EB] flex-shrink-0">•</span>
                              {pp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Problem + Transformation */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-1">Problem Solved</p>
                          <p className="text-sm text-[#18181B]">{product.problemSolved}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-1">Transformation</p>
                          <p className="text-sm text-[#18181B]">{product.transformation}</p>
                        </div>
                      </div>

                      {/* Shadow Fears */}
                      <div>
                        <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-2">Shadow Fears Activated</p>
                        <div className="flex flex-wrap gap-1">
                          {product.shadowFears.map((sf) => (
                            <span key={sf} className="text-[9px] px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-display font-bold">
                              {sf}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-1">What\'s Inside</p>
                        <p className="text-sm text-[#18181B]">{product.description}</p>
                      </div>
                    </div>

                    {/* Shopify Copy Preview */}
                    <div className="mt-4 p-3 bg-[#F0EBE0] border border-[#E4E4E7] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A]">Shopify Copy (Ready)</p>
                        <button
                          onClick={() => copyShopifyCopy(product.shopifyCopy, product.code)}
                          className="flex items-center gap-1 text-[10px] font-display font-bold text-[#7A5F18] hover:text-[#2563EB] transition-colors"
                        >
                          {copiedCode === product.code
                            ? <><Check className="h-3 w-3" /> Copied</>
                            : <><Copy className="h-3 w-3" /> Copy</>
                          }
                        </button>
                      </div>
                      <p className="text-[13px] text-[#52525B] whitespace-pre-wrap line-clamp-4">{product.shopifyCopy}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {!isPromoted && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-[#2563EB]/40 text-[#7A5F18] hover:bg-[#2563EB]/10"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowPromoteModal(true)
                          }}
                        >
                          <Package className="h-3.5 w-3.5" />
                          Add to Products DB
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowShopifyModal(true)
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Push to Shopify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-[#E4E4E7] text-[#71717A] hover:bg-[#E4E4E7]"
                        onClick={() => copyShopifyCopy(product.shopifyCopy, product.code + '-full')}
                      >
                        {copiedCode === product.code + '-full'
                          ? <><Check className="h-3.5 w-3.5" /> Copied</>
                          : <><Copy className="h-3.5 w-3.5" /> Copy Full Copy</>
                        }
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#71717A]">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-display font-bold">No products match this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Promote to Products DB Modal ─── */}
      <Dialog open={showPromoteModal} onOpenChange={setShowPromoteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-[#2D2D2D]">
              Add to Products DB
            </DialogTitle>
            <DialogDescription>
              This will create a <span className="font-bold">coming_soon</span> entry in your Products database with all ICP, pain point, and copy data pre-filled.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl">
                <p className="font-display font-black text-[#2D2D2D]">{selectedProduct.code} — {selectedProduct.name}</p>
                <p className="text-sm text-[#71717A]">{selectedProduct.icpLabel} • R{selectedProduct.price.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPromoteModal(false)}
                  disabled={promoteLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#2563EB] hover:bg-[#B8963D] text-white font-display font-black"
                  onClick={() => promoteToProducts(selectedProduct)}
                  disabled={promoteLoading}
                >
                  {promoteLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding...</>
                  ) : (
                    <><Package className="h-4 w-4 mr-2" /> Add to Products DB</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Push to Shopify Modal ─── */}
      <Dialog open={showShopifyModal} onOpenChange={setShowShopifyModal}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-[#2D2D2D]">
              Push to Shopify
            </DialogTitle>
            <DialogDescription>
              Creates a <span className="font-bold">draft</span> listing on Shopify with the WAT copy pre-filled. Requires Shopify credentials in environment variables.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl">
                <p className="font-display font-black text-[#2D2D2D]">{selectedProduct.code} — {selectedProduct.name}</p>
                <p className="text-sm text-[#71717A]">{selectedProduct.subtitle}</p>
                <p className="text-sm font-bold text-[#2563EB] mt-1">
                  {selectedProduct.priceRange ?? `R${selectedProduct.price.toLocaleString()}`}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-display font-semibold uppercase tracking-wider text-[#71717A] mb-2">Shopify Copy Preview</p>
                <div className="p-3 bg-[#F0EBE0] border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] whitespace-pre-wrap">
                  {selectedProduct.shopifyCopy}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Requires <code className="bg-amber-100 px-1 rounded">SHOPIFY_SHOP_URL</code> and <code className="bg-amber-100 px-1 rounded">SHOPIFY_ACCESS_TOKEN</code> in your <code className="bg-amber-100 px-1 rounded">.env.local</code>. The listing will be created as a draft and needs images added manually in Shopify.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowShopifyModal(false)}
                  disabled={shopifyLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="gap-1.5 border-[#E4E4E7]"
                  onClick={() => copyShopifyCopy(selectedProduct.shopifyCopy, 'modal')}
                  disabled={shopifyLoading}
                >
                  {copiedCode === 'modal' ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy Copy</>}
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-display font-black"
                  onClick={() => pushToShopify(selectedProduct)}
                  disabled={shopifyLoading}
                >
                  {shopifyLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Pushing...</>
                  ) : (
                    <><ShoppingCart className="h-4 w-4 mr-2" /> Push Draft to Shopify</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Toast ─── */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-display font-bold z-50 transition-all',
          toast.type === 'success' ? 'bg-emerald-900 text-emerald-100' : 'bg-red-900 text-red-100'
        )}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
