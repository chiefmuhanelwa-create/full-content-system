'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
  Layers, Download, Zap, FileText, CalendarDays,
  Upload, CheckCircle2, AlertCircle, ArrowRight, Clock, Trash2, History
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { useContent } from '@/contexts/ContentContext'

interface ContentPiece {
  day: number
  date: string
  topic: string
  hookIdea: string
  contentType: string
  fourE?: string
  platform: string
  icp?: string
  shadowFear?: string
  paidsCategory?: string
  villain?: string
  proofStory?: string
  notes: string
}

const FOUR_E_COLORS: Record<string, string> = {
  Educate:   'bg-blue-100 text-blue-800',
  Entertain: 'bg-[#C9A646]/15 text-[#7A5F18]',
  Encourage: 'bg-emerald-100 text-emerald-800',
  Earn:      'bg-amber-100 text-amber-800',
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  Educational:      'bg-blue-100 text-blue-800',
  Story:            'bg-[#C9A646]/15 text-[#7A5F18]',
  'Behind-the-Scenes': 'bg-amber-100 text-amber-800',
  'Myth-Busting':   'bg-red-100 text-red-800',
  'Case Study':     'bg-emerald-100 text-emerald-800',
  'Trending Topic': 'bg-cyan-100 text-cyan-800',
  Promotional:      'bg-orange-100 text-orange-800',
}

function mapContentTypeTo4E(type: string): string {
  if (type === 'Promotional') return '10% Earn'
  if (type === 'Story' || type === 'Behind-the-Scenes' || type === 'Trending Topic') return '30% Entertain'
  if (type === 'Myth-Busting' || type === 'Case Study' || type === 'Educational') return '40% Educate'
  return '20% Encourage'
}

function parseCSV(raw: string): ContentPiece[] {
  const lines = raw.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''))
  return lines.slice(1).map((line, i) => {
    // Handle quoted fields
    const cols: string[] = []
    let cur = ''
    let inQuotes = false
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"') { inQuotes = !inQuotes; continue }
      if (line[c] === ',' && !inQuotes) { cols.push(cur.trim()); cur = ''; continue }
      cur += line[c]
    }
    cols.push(cur.trim())
    const get = (key: string) => cols[header.indexOf(key)] || ''
    return {
      day: parseInt(get('day')) || i + 1,
      date: get('date'),
      topic: get('topic'),
      hookIdea: get('hookidea'),
      contentType: get('type'),
      platform: get('platform') || 'instagram',
      notes: get('notes'),
    }
  }).filter(p => p.topic)
}

export default function BatchPlannerPage() {
  const router = useRouter()
  const { setPendingAction } = useContent()

  const [tab, setTab] = useState<'generate' | 'import' | 'history'>('generate')
  const [niche, setNiche] = useState('')
  const [goals, setGoals] = useState('')
  const [postingFrequency, setPostingFrequency] = useState('daily')
  const [platforms, setPlatforms] = useState('instagram')
  const [targetICP, setTargetICP] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [contentPlan, setContentPlan] = useState<ContentPiece[]>([])
  const [planCompliance, setPlanCompliance] = useState<any>(null)

  // Import tab
  const [csvText, setCsvText] = useState('')
  const [importError, setImportError] = useState('')

  // Push to calendar
  const [pushing, setPushing] = useState(false)
  const [pushResult, setPushResult] = useState<{ success: number; failed: number } | null>(null)

  // Plan history
  interface SavedPlan { id: string; name: string; createdAt: string; plan: ContentPiece[] }
  const loadHistory = (): SavedPlan[] => {
    try { return JSON.parse(localStorage.getItem('batchPlanHistory') || '[]') } catch { return [] }
  }
  const [planHistory, setPlanHistory] = useState<SavedPlan[]>(loadHistory)

  const savePlanToHistory = (plan: ContentPiece[], name: string) => {
    const entry: SavedPlan = { id: Date.now().toString(), name, createdAt: new Date().toISOString(), plan }
    const updated = [entry, ...loadHistory()].slice(0, 20)
    localStorage.setItem('batchPlanHistory', JSON.stringify(updated))
    setPlanHistory(updated)
  }

  const deletePlanFromHistory = (id: string) => {
    const updated = loadHistory().filter(p => p.id !== id)
    localStorage.setItem('batchPlanHistory', JSON.stringify(updated))
    setPlanHistory(updated)
  }

  const handleGenerate = async () => {
    if (!niche.trim() || !goals.trim()) return
    setLoading(true)
    setPushResult(null)
    try {
      const response = await fetch('/api/batch/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, postingFrequency, platforms, targetICP }),
      })
      if (response.ok) {
        const data = await response.json()
        setContentPlan(data.plan)
        if (data.compliance) setPlanCompliance(data.compliance)
        savePlanToHistory(data.plan, `${niche} — ${new Date().toLocaleDateString()}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImportCSV = () => {
    setImportError('')
    if (!csvText.trim()) { setImportError('Paste your CSV content above first.'); return }
    const parsed = parseCSV(csvText)
    if (!parsed.length) { setImportError('Could not parse CSV. Check the format: Day, Date, Topic, Hook Idea, Type, Platform, Notes'); return }
    setContentPlan(parsed)
    setPushResult(null)
    savePlanToHistory(parsed, `Imported CSV — ${new Date().toLocaleDateString()}`)
  }

  const exportAsCSV = () => {
    const headers = ['Day', 'Date', 'Topic', 'Hook Idea', 'Type', 'Platform', 'Notes']
    const rows = contentPlan.map(item => [
      item.day, item.date, `"${item.topic}"`, `"${item.hookIdea}"`,
      item.contentType, item.platform, `"${item.notes}"`
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = '30-day-content-plan.csv'; a.click()
  }

  const pushAllToCalendar = async () => {
    if (!contentPlan.length) return
    setPushing(true)
    setPushResult(null)
    let success = 0, failed = 0

    // Base date: today, increment by item.day offset
    const baseDate = new Date()
    baseDate.setHours(9, 0, 0, 0)

    for (const item of contentPlan) {
      try {
        // Compute scheduled date: use item.date if provided, else base + day offset
        let scheduledDate: string
        if (item.date && item.date.trim()) {
          // Try to parse the date string from CSV (e.g. "2026-06-10" or "June 10")
          const parsed = new Date(item.date)
          scheduledDate = isNaN(parsed.getTime())
            ? new Date(baseDate.getTime() + ((item.day || 1) - 1) * 86400000).toISOString()
            : parsed.toISOString()
        } else {
          scheduledDate = new Date(baseDate.getTime() + ((item.day || 1) - 1) * 86400000).toISOString()
        }

        const res = await fetch('/api/content-calendar-plus/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scheduledDate,
            title: item.topic,
            notes: item.hookIdea,
            contentPillar: item.contentType || 'Educational',
            fourETag: mapContentTypeTo4E(item.contentType),
            platform: item.platform || 'instagram',
            contentType: item.contentType || 'Educational',
            status: 'planned',
          }),
        })
        if (res.ok) success++; else failed++
      } catch { failed++ }
    }
    setPushResult({ success, failed })
    setPushing(false)
  }

  const openHookGenerator = (item: ContentPiece) => {
    setPendingAction({
      action: 'generate-hooks-from-calendar',
      data: { title: item.topic, notes: item.hookIdea, platform: item.platform },
    })
    router.push('/dashboard/hooks')
  }

  const openScriptWriter = (item: ContentPiece) => {
    setPendingAction({
      action: 'generate-script-from-calendar',
      data: { title: item.topic, notes: item.notes || item.hookIdea, platform: item.platform },
    })
    router.push('/dashboard/scripts')
  }

  const weeks = [1, 2, 3, 4, 5].map(w => ({
    week: w,
    items: contentPlan.filter(i => i.day >= (w - 1) * 7 + 1 && i.day <= w * 7),
  })).filter(w => w.items.length > 0)

  return (
    <div className="min-h-full bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Layers}
        iconColor="text-indigo-600"
        iconBg="bg-indigo-500/10"
        eyebrow="Plan"
        title="Batch Content Planner"
        description="Generate or import a 30-day content plan, then push it directly to your Calendar, Hook Generator, and Script Writer."
      />

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E8E1D0] rounded-xl p-1 mb-6 w-fit">
          {(['generate', 'import', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t !== 'history') { setContentPlan([]); setPushResult(null) } }}
              className={`px-4 py-2 rounded-lg text-[12px] font-heading font-bold transition-all ${
                tab === t
                  ? 'bg-[#C9A646] text-[#0A0A0A] shadow-sm'
                  : 'text-[#8A8071] hover:text-[#0A0A0A]'
              }`}
            >
              {t === 'generate' ? 'Generate Plan' : t === 'import' ? 'Import CSV' : `My Plans (${planHistory.length})`}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-[#E8E1D0] rounded-xl p-5">
              {tab === 'generate' ? (
                <div className="space-y-4">
                  <div>
                    <Label className="nc-label text-[11px]">Your Niche</Label>
                    <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Contentpreneur" className="mt-1" />
                  </div>
                  <div>
                    <Label className="nc-label text-[11px]">Content Goals</Label>
                    <Textarea
                      value={goals}
                      onChange={e => setGoals(e.target.value)}
                      placeholder="Grow audience, drive digital product sales, establish authority..."
                      className="mt-1 min-h-[90px]"
                    />
                  </div>
                  <div>
                    <Label className="nc-label text-[11px]">Posting Frequency</Label>
                    <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (30 posts)</SelectItem>
                        <SelectItem value="weekdays">Weekdays (20-22 posts)</SelectItem>
                        <SelectItem value="3x-week">3× per Week (12-13 posts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="nc-label text-[11px]">Primary Platform</Label>
                    <Select value={platforms} onValueChange={setPlatforms}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="multi">Multi-Platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="nc-label text-[11px]">Target ICP</Label>
                    <Select value={targetICP} onValueChange={setTargetICP}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect from niche</SelectItem>
                        <SelectItem value="icp1">ICP 1 — The Called Expert (28–42, professional)</SelectItem>
                        <SelectItem value="icp2">ICP 2 — The Content Creator Inspirer (23–28)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-[#8A8071] mt-1">Called Expert: unexploited professional expertise. Creator: aspiring, no system yet.</p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !niche.trim() || !goals.trim()}
                    className="w-full bg-[#C9A646] hover:bg-[#8C6F1F] text-[#0A0A0A] font-heading font-bold"
                  >
                    {loading ? 'Generating...' : 'Generate 30-Day Plan'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="nc-label text-[11px]">Paste CSV Content</Label>
                    <Textarea
                      value={csvText}
                      onChange={e => setCsvText(e.target.value)}
                      placeholder={`Day,Date,Topic,Hook Idea,Type,Platform,Notes\n1,Jan 11 2026,What is a Contentpreneur?,...`}
                      className="mt-1 min-h-[180px] font-mono text-xs"
                    />
                  </div>
                  {importError && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />{importError}
                    </p>
                  )}
                  <Button
                    onClick={handleImportCSV}
                    disabled={!csvText.trim()}
                    className="w-full bg-[#C9A646] hover:bg-[#8C6F1F] text-[#0A0A0A] font-heading font-bold"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Plan
                  </Button>
                </div>
              )}
            </div>

            {/* Actions after plan loads */}
            {contentPlan.length > 0 && (
              <div className="bg-white border border-[#E8E1D0] rounded-xl p-4 space-y-2">
                <p className="text-[11px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-3">
                  Push to System
                </p>
                <Button
                  onClick={pushAllToCalendar}
                  disabled={pushing}
                  className="w-full bg-[#0F0F0F] hover:bg-[#1A1A1A] text-white font-heading font-bold text-[12px] flex items-center gap-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  {pushing ? 'Pushing...' : `Push All ${contentPlan.length} Days to Calendar`}
                </Button>
                {pushResult && (
                  <div className={`flex items-center gap-2 text-[12px] font-heading font-semibold px-3 py-2 rounded-lg ${
                    pushResult.failed === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {pushResult.success} added to Calendar{pushResult.failed > 0 ? ` · ${pushResult.failed} failed` : ''}
                  </div>
                )}
                <Button onClick={exportAsCSV} variant="outline" className="w-full text-[12px] font-heading font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            )}
          </div>

          {/* Plan output */}
          <div className="lg:col-span-2 space-y-4">
            {loading && (
              <div className="bg-white border border-[#E8E1D0] rounded-xl p-12 text-center">
                <div className="w-10 h-10 border-2 border-[#C9A646] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#8A8071] font-heading font-semibold text-sm">Generating 30-day plan...</p>
              </div>
            )}

            {contentPlan.length > 0 && !loading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-black text-[#0F0F0F] text-sm">
                    {contentPlan.length} content pieces
                    {pushResult && pushResult.failed === 0 && (
                      <span className="ml-2 text-emerald-600 font-semibold">· Pushed to Calendar ✓</span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#8A8071] font-heading">Click any row to generate its hook or script</p>
                </div>

                {/* NOCHILL DNA Compliance Panel */}
                {planCompliance && (
                  <div className="bg-[#0F0F0F] rounded-xl p-5 text-white space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#C9A646]">NOCHILL DNA — Plan Compliance Report</span>
                    </div>

                    {/* ICP + Principles row */}
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-1">Target ICP</p>
                        <p className="font-heading font-bold text-white/90">{planCompliance.icp || '—'}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-1">Africa Context</p>
                        <p className="font-heading font-bold text-white/90">{planCompliance.africaContext || '✅ ZAR, SA context'}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-1">Villains</p>
                        <p className="font-heading font-bold text-white/90">{planCompliance.villainsDefined || '✅ System/situation'}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-1">Voice Principles</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(planCompliance.principlesApplied || ['You Format', 'Negativity (indirect)']).map((p: string, i: number) => (
                            <span key={i} className="text-[9px] bg-[#C9A646]/20 text-[#C9A646] rounded px-1.5 py-0.5 font-heading font-bold">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 4E Distribution */}
                    {planCompliance.fourEBreakdown && (
                      <div>
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-2">4E Engine Distribution</p>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(planCompliance.fourEBreakdown).map(([key, val]) => (
                            <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
                              <p className="text-[18px] font-heading font-black text-white">{String(val)}</p>
                              <p className="text-[9px] font-heading font-bold uppercase tracking-wide text-[#8A8071] capitalize">{key}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PAIDS Distribution */}
                    {planCompliance.paidsDistribution && (
                      <div>
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-2">PAIDS Category Coverage</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(planCompliance.paidsDistribution).map(([key, val]) => (
                            Number(val) > 0 && (
                              <div key={key} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
                                <span className="text-[12px] font-heading font-black text-white">{String(val)}</span>
                                <span className="text-[9px] font-heading font-bold uppercase tracking-wide text-[#8A8071] capitalize">{key}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shadow Fears Used */}
                    {planCompliance.shadowFearsUsed && planCompliance.shadowFearsUsed.length > 0 && (
                      <div>
                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-[#8A8071] mb-2">Shadow Fears Activated</p>
                        <div className="flex flex-wrap gap-1.5">
                          {planCompliance.shadowFearsUsed.map((fear: string, i: number) => (
                            <span key={i} className="text-[9px] bg-red-900/40 text-red-300 rounded px-2 py-1 font-heading font-bold">{fear}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {weeks.map(({ week, items }) => (
                  <div key={week} className="bg-white border border-[#E8E1D0] rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#FAF7F0] border-b border-[#E8E1D0]">
                      <p className="text-[11px] font-heading font-black uppercase tracking-widest text-[#8A8071]">Week {week}</p>
                    </div>
                    <div className="divide-y divide-[#F4EFE3]">
                      {items.map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-[#FAF7F0] transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Day badge */}
                            <div className="w-10 h-10 bg-[#0F0F0F] text-white rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                              <span className="text-[8px] font-heading font-black uppercase tracking-wide leading-none text-white/50">DAY</span>
                              <span className="text-[15px] font-heading font-black leading-none">{item.day}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 flex-wrap mb-1">
                                <p className="font-heading font-bold text-[#0F0F0F] text-[13px] leading-snug flex-1">{item.topic}</p>
                                {item.fourE && (
                                  <span className={`text-[9px] font-heading font-black px-2 py-0.5 rounded-full flex-shrink-0 ${FOUR_E_COLORS[item.fourE] || 'bg-[#E8E1D0] text-[#4A3F35]'}`}>
                                    {item.fourE}
                                  </span>
                                )}
                                <span className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${CONTENT_TYPE_COLORS[item.contentType] || 'bg-[#E8E1D0] text-[#4A3F35]'}`}>
                                  {item.contentType}
                                </span>
                              </div>
                              {/* ICP + PAIDS + ShadowFear tags */}
                              {(item.icp || item.paidsCategory || item.shadowFear) && (
                                <div className="flex flex-wrap gap-1 mb-1.5">
                                  {item.icp && (
                                    <span className="text-[9px] bg-[#C9A646]/10 text-[#8C6F1F] font-heading font-bold px-1.5 py-0.5 rounded">
                                      {item.icp.includes('1') ? 'ICP1 · Expert' : 'ICP2 · Creator'}
                                    </span>
                                  )}
                                  {item.paidsCategory && (
                                    <span className="text-[9px] bg-blue-50 text-blue-700 font-heading font-bold px-1.5 py-0.5 rounded">
                                      {item.paidsCategory}
                                    </span>
                                  )}
                                  {item.shadowFear && (
                                    <span className="text-[9px] bg-red-50 text-red-700 font-heading font-bold px-1.5 py-0.5 rounded">
                                      {item.shadowFear}
                                    </span>
                                  )}
                                  {item.villain && (
                                    <span className="text-[9px] bg-[#0F0F0F]/5 text-[#0F0F0F] font-heading font-bold px-1.5 py-0.5 rounded truncate max-w-[140px]" title={item.villain}>
                                      ⚔ {item.villain}
                                    </span>
                                  )}
                                </div>
                              )}
                              {item.date && (
                                <div className="flex items-center gap-1 text-[10px] text-[#8A8071] mb-1.5">
                                  <Clock className="w-3 h-3" />{item.date} · {item.platform}
                                </div>
                              )}
                              <p className="text-[11px] text-[#6B6059] leading-relaxed line-clamp-2">
                                <span className="font-semibold text-[#8A8071]">Hook:</span> "{item.hookIdea}"
                              </p>
                            </div>
                          </div>

                          {/* Action row */}
                          <div className="flex items-center gap-2 mt-3 ml-13 pl-0">
                            <button
                              onClick={() => openHookGenerator(item)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A646]/10 hover:bg-[#C9A646]/20 text-[#8C6F1F] rounded-lg text-[11px] font-heading font-bold transition-colors"
                            >
                              <Zap className="w-3 h-3" />
                              Generate Hook
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => openScriptWriter(item)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-heading font-bold transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Write Script
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {contentPlan.length === 0 && !loading && tab !== 'history' && (
              <div className="bg-white border border-[#E8E1D0] rounded-xl p-12 text-center">
                <Layers className="h-12 w-12 mx-auto mb-4 text-[#DED5C2]" />
                <p className="font-heading font-bold text-[#8A8071] text-sm">
                  {tab === 'generate' ? 'Fill in your niche and goals, then generate your plan' : 'Paste your CSV and click Import Plan'}
                </p>
              </div>
            )}

            {tab === 'history' && (
              <div className="space-y-3">
                {planHistory.length === 0 ? (
                  <div className="bg-white border border-[#E8E1D0] rounded-xl p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 text-[#DED5C2]" />
                    <p className="font-heading font-bold text-[#8A8071] text-sm">No saved plans yet. Generate or import a plan first.</p>
                  </div>
                ) : (
                  planHistory.map(saved => (
                    <div key={saved.id} className="bg-white border border-[#E8E1D0] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-[#0F0F0F] text-[13px] truncate">{saved.name}</p>
                          <p className="text-[11px] text-[#8A8071] mt-0.5">{saved.plan.length} days · {new Date(saved.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setContentPlan(saved.plan); setTab('generate'); setPushResult(null) }}
                            className="px-3 py-1.5 bg-[#C9A646]/10 hover:bg-[#C9A646]/20 text-[#8C6F1F] rounded-lg text-[11px] font-heading font-bold transition-colors"
                          >
                            Load Plan
                          </button>
                          <button
                            onClick={() => deletePlanFromHistory(saved.id)}
                            className="p-1.5 hover:bg-red-50 text-[#8A8071] hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
