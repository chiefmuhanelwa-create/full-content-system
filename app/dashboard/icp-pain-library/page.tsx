'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Heart, Plus, Edit, Trash2, Download, Filter, X, AlertTriangle, TrendingUp, Target, Brain,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

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
  const router = useRouter()
  const [painPoints, setPainPoints] = useState<ICPPainPoint[]>([])
  const [filteredPainPoints, setFilteredPainPoints] = useState<ICPPainPoint[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [filterAudienceLevel, setFilterAudienceLevel] = useState<string>('all')
  const [filterPainCategory, setFilterPainCategory] = useState<string>('all')
  const [filterShadowFear, setFilterShadowFear] = useState<string>('all')
  const [filterFavorite, setFilterFavorite] = useState<boolean | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [formData, setFormData] = useState<Partial<ICPPainPoint>>({
    audienceLevel: 'beginner_creator', audienceSegment: '', painPoint: '', painCategory: 'financial',
    painIntensity: 'medium', shadowFear: '', emotionalTrigger: '', solutionType: '', productMatch: '',
    contentPillar: '', timesAddressed: 0, avgEngagement: 0, conversionRate: 0, isFavorite: false, notes: '',
  })

  useEffect(() => { fetchPainPoints() }, [])

  useEffect(() => {
    let filtered = [...painPoints]
    if (filterAudienceLevel !== 'all') filtered = filtered.filter((p) => p.audienceLevel === filterAudienceLevel)
    if (filterPainCategory !== 'all') filtered = filtered.filter((p) => p.painCategory === filterPainCategory)
    if (filterShadowFear !== 'all') filtered = filtered.filter((p) => p.shadowFear === filterShadowFear)
    if (filterFavorite !== null) filtered = filtered.filter((p) => p.isFavorite === filterFavorite)
    setFilteredPainPoints(filtered)
  }, [painPoints, filterAudienceLevel, filterPainCategory, filterShadowFear, filterFavorite])

  const fetchPainPoints = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/icp-pain-library/list')
      const data = await response.json()
      if (data.success) setPainPoints(data.painPoints)
    } catch (error) { console.error('Error fetching pain points:', error) } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const url = editingId ? '/api/icp-pain-library/update' : '/api/icp-pain-library/create'
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData) })
      const data = await response.json()
      if (data.success) { await fetchPainPoints(); resetForm() }
    } catch (error) { console.error('Error saving pain point:', error) } finally { setLoading(false) }
  }

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const response = await fetch('/api/icp-pain-library/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isFavorite: !currentFavorite }) })
      const data = await response.json()
      if (data.success) await fetchPainPoints()
    } catch (error) { console.error('Error toggling favorite:', error) }
  }

  const deletePainPoint = async (id: string) => {
    if (!confirm('Delete this pain point?')) return
    try {
      const response = await fetch(`/api/icp-pain-library/delete?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) await fetchPainPoints()
    } catch (error) { console.error('Error deleting pain point:', error) }
  }

  const editPainPoint = (painPoint: ICPPainPoint) => {
    setFormData(painPoint); setEditingId(painPoint.id); setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setFormData({ audienceLevel: 'beginner_creator', audienceSegment: '', painPoint: '', painCategory: 'financial', painIntensity: 'medium', shadowFear: '', emotionalTrigger: '', solutionType: '', productMatch: '', contentPillar: '', timesAddressed: 0, avgEngagement: 0, conversionRate: 0, isFavorite: false, notes: '' })
    setEditingId(null); setIsEditing(false)
  }

  const clearFilters = () => { setFilterAudienceLevel('all'); setFilterPainCategory('all'); setFilterShadowFear('all'); setFilterFavorite(null) }

  const exportToCSV = () => {
    const headers = ['Audience Level','Audience Segment','Pain Point','Pain Category','Pain Intensity','Shadow Fear','Emotional Trigger','Solution Type','Product Match','Content Pillar','Times Addressed','Avg Engagement','Conversion Rate','Favorite']
    const rows = filteredPainPoints.map((p) => [p.audienceLevel,p.audienceSegment||'',p.painPoint,p.painCategory,p.painIntensity,p.shadowFear||'',p.emotionalTrigger||'',p.solutionType||'',p.productMatch||'',p.contentPillar||'',p.timesAddressed,p.avgEngagement,p.conversionRate,p.isFavorite?'Yes':'No'])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `icp-pain-library-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const getPainIntensityClass = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'medium': return 'bg-[#FAF7F0] text-[#8C6F1F] border-[#C9A646]/30'
      case 'high': return 'bg-[#FFF3E8] text-[#9A3A12] border-[#F2701E]/30'
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-[#FAF7F0] text-[#8A8071] border-[#DED5C2]'
    }
  }

  const getAudienceLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner_creator': return 'Beginner Creator'
      case 'established_creator': return 'Established Creator'
      case 'contentpreneur': return 'Contentpreneur'
      default: return level
    }
  }

  const stats = {
    total: painPoints.length,
    favorites: painPoints.filter((p) => p.isFavorite).length,
    avgEngagement: painPoints.length > 0 ? (painPoints.reduce((sum, p) => sum + p.avgEngagement, 0) / painPoints.length).toFixed(2) : '0.00',
    avgConversion: painPoints.length > 0 ? (painPoints.reduce((sum, p) => sum + p.conversionRate, 0) / painPoints.length).toFixed(2) : '0.00',
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Target}
        iconColor="text-[#C9A646]"
        eyebrow="Audience"
        title="ICP Pain Library"
        description="Deep understanding of your audience's pain points — what keeps them awake at night."
      >
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 text-[11px] font-heading font-bold uppercase tracking-wide transition-all">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 text-[11px] font-heading font-bold uppercase tracking-wide transition-all">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-heading font-bold uppercase tracking-wide transition-all ${isEditing ? 'border border-[#DED5C2] bg-white text-[#8A8071]' : 'bg-[#C9A646] text-[#0A0A0A]'}`}>
            {isEditing ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Plus className="h-3.5 w-3.5" /> Add Pain Point</>}
          </button>
        </div>
      </ToolPageHeader>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pain Points', value: stats.total, color: 'text-[#C9A646]' },
            { label: 'Favourites', value: stats.favorites, color: 'text-red-500' },
            { label: 'Avg Engagement', value: `${stats.avgEngagement}%`, color: 'text-[#C9A646]' },
            { label: 'Avg Conversion', value: `${stats.avgConversion}%`, color: 'text-emerald-600' },
          ].map((stat) => (
            <div key={stat.label} className="nc-stat">
              <p className="nc-stat-label">{stat.label}</p>
              <p className={`nc-stat-number ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="nc-tool-section space-y-4">
            <div className="flex items-center justify-between">
              <p className="nc-eyebrow">Filters</p>
              <button onClick={clearFilters} className="text-[11px] font-heading font-bold text-[#8A8071] hover:text-[#C9A646] transition-colors uppercase tracking-wide">Clear All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Audience Level', value: filterAudienceLevel, onChange: setFilterAudienceLevel, options: [['all','All Levels'],['beginner_creator','Beginner Creator'],['established_creator','Established Creator'],['contentpreneur','Contentpreneur']] },
                { label: 'Pain Category', value: filterPainCategory, onChange: setFilterPainCategory, options: [['all','All Categories'],['financial','Financial'],['visibility','Visibility'],['technical','Technical'],['confidence','Confidence'],['time','Time'],['knowledge','Knowledge']] },
                { label: 'Shadow Fear', value: filterShadowFear, onChange: setFilterShadowFear, options: [['all','All Fears'],['invisibility','Invisibility'],['wasted_potential','Wasted Potential'],['left_behind','Left Behind'],['exposure','Exposure'],['poverty_cycle','Poverty Cycle'],['family_shame','Family Shame'],['imposter_syndrome','Imposter Syndrome']] },
                { label: 'Favourite Status', value: filterFavorite === null ? 'all' : filterFavorite ? 'favorites' : 'not-favorites', onChange: (v: string) => setFilterFavorite(v === 'all' ? null : v === 'favorites'), options: [['all','All Pain Points'],['favorites','Favourites Only'],['not-favorites','Non-Favourites']] },
              ].map((filter) => (
                <div key={filter.label} className="nc-form-row">
                  <label>{filter.label}</label>
                  <Select value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {filter.options.map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`grid gap-6 ${isEditing ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Form */}
          {isEditing && (
            <div className="nc-tool-section lg:col-span-1 space-y-4">
              <div>
                <p className="nc-eyebrow mb-0.5">{editingId ? 'Edit' : 'New'}</p>
                <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">{editingId ? 'Edit Pain Point' : 'Add Pain Point'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'audienceLevel', label: 'Audience Level *', value: formData.audienceLevel, key: 'audienceLevel', options: [['beginner_creator','Beginner Creator'],['established_creator','Established Creator'],['contentpreneur','Contentpreneur']] },
                ].map((field) => (
                  <div key={field.id} className="nc-form-row">
                    <label htmlFor={field.id}>{field.label}</label>
                    <Select value={field.value} onValueChange={(v) => setFormData({ ...formData, [field.key]: v })}>
                      <SelectTrigger id={field.id} className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                      <SelectContent>{field.options.map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="nc-form-row">
                  <label htmlFor="audienceSegment">Audience Segment</label>
                  <input id="audienceSegment" className="nc-tool-input" value={formData.audienceSegment} onChange={(e) => setFormData({ ...formData, audienceSegment: e.target.value })} placeholder="e.g. African fashion creators" />
                </div>

                <div className="nc-form-row">
                  <label htmlFor="painPoint">Pain Point *</label>
                  <textarea id="painPoint" className="nc-tool-input min-h-[80px] resize-y" value={formData.painPoint} onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })} placeholder="What keeps them awake at night?" required />
                </div>

                {[
                  { id: 'painCategory', label: 'Pain Category *', key: 'painCategory', value: formData.painCategory, options: [['financial','Financial'],['visibility','Visibility'],['technical','Technical'],['confidence','Confidence'],['time','Time'],['knowledge','Knowledge']] },
                  { id: 'painIntensity', label: 'Pain Intensity *', key: 'painIntensity', value: formData.painIntensity, options: [['low','Low'],['medium','Medium'],['high','High'],['critical','Critical']] },
                  { id: 'shadowFear', label: 'Shadow Fear', key: 'shadowFear', value: formData.shadowFear || '', options: [['invisibility','Invisibility'],['wasted_potential','Wasted Potential'],['left_behind','Left Behind'],['exposure','Exposure'],['poverty_cycle','Poverty Cycle'],['family_shame','Family Shame'],['imposter_syndrome','Imposter Syndrome']] },
                  { id: 'solutionType', label: 'Solution Type', key: 'solutionType', value: formData.solutionType || '', options: [['education','Education'],['tool','Tool'],['framework','Framework'],['mindset_shift','Mindset Shift'],['system','System']] },
                  { id: 'contentPillar', label: 'Content Pillar', key: 'contentPillar', value: formData.contentPillar || '', options: [['authority','Authority'],['education','Education'],['monetization','Monetization'],['story','Story'],['conversion','Conversion']] },
                ].map((field) => (
                  <div key={field.id} className="nc-form-row">
                    <label htmlFor={field.id}>{field.label}</label>
                    <Select value={field.value} onValueChange={(v) => setFormData({ ...formData, [field.key]: v })}>
                      <SelectTrigger id={field.id} className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                      <SelectContent>{field.options.map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="nc-form-row">
                  <label htmlFor="emotionalTrigger">Emotional Trigger</label>
                  <input id="emotionalTrigger" className="nc-tool-input" value={formData.emotionalTrigger} onChange={(e) => setFormData({ ...formData, emotionalTrigger: e.target.value })} placeholder="e.g. Family shame, poverty cycle" />
                </div>

                <div className="nc-form-row">
                  <label htmlFor="productMatch">Product Match</label>
                  <input id="productMatch" className="nc-tool-input" value={formData.productMatch} onChange={(e) => setFormData({ ...formData, productMatch: e.target.value })} placeholder="Which NOCHILL product solves this?" />
                </div>

                <div className="border-t border-[#E8E1D0] pt-4 space-y-3">
                  <p className="label-nc">Performance Metrics</p>
                  {[
                    { id: 'timesAddressed', label: 'Times Addressed', value: formData.timesAddressed, key: 'timesAddressed' },
                    { id: 'avgEngagement', label: 'Avg Engagement (%)', value: formData.avgEngagement, key: 'avgEngagement' },
                    { id: 'conversionRate', label: 'Conversion Rate (%)', value: formData.conversionRate, key: 'conversionRate' },
                  ].map((field) => (
                    <div key={field.id} className="nc-form-row">
                      <label htmlFor={field.id}>{field.label}</label>
                      <input id={field.id} type="number" step="0.01" className="nc-tool-input" value={field.value} onChange={(e) => setFormData({ ...formData, [field.key]: Number(e.target.value) })} placeholder="0" />
                    </div>
                  ))}
                </div>

                <div className="nc-form-row">
                  <label htmlFor="notes">Notes</label>
                  <textarea id="notes" className="nc-tool-input min-h-[80px] resize-y" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes or insights..." />
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="nc-generate-btn flex-1 py-2.5">
                    {loading ? 'Saving...' : editingId ? 'Update Pain Point' : 'Add Pain Point'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] text-[12px] font-heading font-bold uppercase tracking-wide">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Pain Points List */}
          <div className={isEditing ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="space-y-4">
              {loading && painPoints.length === 0 ? (
                <div className="nc-tool-section flex items-center justify-center py-12">
                  <p className="text-[#8A8071] font-heading text-sm">Loading pain points...</p>
                </div>
              ) : filteredPainPoints.length > 0 ? (
                filteredPainPoints.map((painPoint) => (
                  <div key={painPoint.id} className="nc-result-card">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-heading font-bold text-[#0A0A0A] text-sm leading-snug">{painPoint.painPoint}</p>
                          {painPoint.isFavorite && <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 flex-shrink-0" />}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-heading font-black tracking-wide uppercase ${getPainIntensityClass(painPoint.painIntensity)}`}>
                            {painPoint.painIntensity}
                          </span>
                          <span className="px-2 py-0.5 rounded-full border border-[#DED5C2] bg-[#FAF7F0] text-[10px] font-heading font-bold text-[#5C5448] uppercase tracking-wide">
                            {getAudienceLevelLabel(painPoint.audienceLevel)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full border border-[#DED5C2] bg-[#FAF7F0] text-[10px] font-heading font-bold text-[#5C5448] uppercase tracking-wide">
                            {painPoint.painCategory}
                          </span>
                          {painPoint.shadowFear && (
                            <span className="px-2 py-0.5 rounded-full border border-[#C9A646]/30 bg-[#FAF7F0] text-[10px] font-heading font-bold text-[#8C6F1F] uppercase tracking-wide">
                              {painPoint.shadowFear.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => toggleFavorite(painPoint.id, painPoint.isFavorite)} className="p-1.5 rounded-lg text-[#B0A898] hover:text-red-500 hover:bg-[#FAF7F0] transition-colors">
                          <Heart className={`h-3.5 w-3.5 ${painPoint.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button onClick={() => editPainPoint(painPoint)} className="p-1.5 rounded-lg text-[#B0A898] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deletePainPoint(painPoint.id)} className="p-1.5 rounded-lg text-[#B0A898] hover:text-red-500 hover:bg-[#FAF7F0] transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl mb-4">
                      {[
                        { icon: Target, label: 'Addressed', value: painPoint.timesAddressed, color: 'text-[#C9A646]' },
                        { icon: TrendingUp, label: 'Engagement', value: `${painPoint.avgEngagement.toFixed(2)}%`, color: 'text-emerald-600' },
                        { icon: AlertTriangle, label: 'Conversion', value: `${painPoint.conversionRate.toFixed(2)}%`, color: 'text-[#D4541F]' },
                      ].map((metric) => (
                        <div key={metric.label} className="text-center">
                          <div className={`flex items-center justify-center gap-1 mb-1 ${metric.color}`}>
                            <metric.icon className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-heading font-black uppercase tracking-wide">{metric.label}</span>
                          </div>
                          <p className={`font-heading font-black text-lg leading-none ${metric.color}`}>{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {painPoint.audienceSegment && <div><p className="label-nc mb-1">Audience Segment</p><p className="text-[13px] text-[#3D342A]">{painPoint.audienceSegment}</p></div>}
                      {painPoint.emotionalTrigger && <div><p className="label-nc mb-1">Emotional Trigger</p><p className="text-[13px] text-[#3D342A]">{painPoint.emotionalTrigger}</p></div>}
                      {painPoint.solutionType && <div><p className="label-nc mb-1">Solution Type</p><p className="text-[13px] text-[#3D342A] capitalize">{painPoint.solutionType.replace(/_/g, ' ')}</p></div>}
                      {painPoint.productMatch && <div><p className="label-nc mb-1">Product Match</p><p className="text-[13px] text-[#3D342A]">{painPoint.productMatch}</p></div>}
                      {painPoint.contentPillar && <div><p className="label-nc mb-1">Content Pillar</p><p className="text-[13px] text-[#3D342A] capitalize">{painPoint.contentPillar}</p></div>}
                    </div>

                    {painPoint.notes && (
                      <div className="border-t border-[#E8E1D0] pt-3 mt-3">
                        <p className="label-nc mb-1">Notes</p>
                        <p className="text-[13px] text-[#5C5448]">{painPoint.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="nc-tool-section flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#DED5C2] flex items-center justify-center mb-5">
                    <Brain className="h-6 w-6 text-[#C9A646]" />
                  </div>
                  <h3 className="font-heading font-black text-[#0A0A0A] text-lg mb-2">
                    {painPoints.length === 0 ? 'No pain points yet' : 'No pain points match your filters'}
                  </h3>
                  <p className="text-[#8A8071] text-sm max-w-xs mb-5">
                    {painPoints.length === 0 ? 'Start documenting what keeps your audience awake at night.' : 'Try clearing the filters to see all pain points.'}
                  </p>
                  {painPoints.length === 0 ? (
                    <button onClick={() => setIsEditing(true)} className="nc-generate-btn w-auto px-6">
                      <Plus className="h-4 w-4" /> Add Your First Pain Point
                    </button>
                  ) : (
                    <button onClick={clearFilters} className="px-5 py-2.5 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] text-[12px] font-heading font-bold uppercase tracking-wide">
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
