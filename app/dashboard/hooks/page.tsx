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
import { Zap, Copy, Heart, Trash2, Sparkles, ArrowRight, Calendar as CalendarIcon, Target, X, Save, Download, BookOpen, ChevronDown, ChevronUp, Database } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { get120HooksBank } from '@/lib/knowledge-base'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface Hook {
  id: string
  content: string
  likes: number
}

export default function HookGeneratorPage() {
  const router = useRouter()
  const { addHook, setPendingAction, addContentToCalendar, selectedFears, pendingAction } = useContent()

  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [duration, setDuration] = useState('60s')
  const [icp, setIcp] = useState('auto')
  const [shadowFear, setShadowFear] = useState('auto')
  const [awarenessLevel, setAwarenessLevel] = useState('auto')
  const [hookType, setHookType] = useState('any')
  const [targetAudience, setTargetAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Hook[]>([])
  const [error, setError] = useState('')
  const [targetedFear, setTargetedFear] = useState<{ id: number; name: string; relevance: number } | null>(null)

  const [showHookBank, setShowHookBank] = useState(false)
  const [selectedHookCategory, setSelectedHookCategory] = useState('all')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)
  const [compliance, setCompliance] = useState<any>(null)
  const [showCompliance, setShowCompliance] = useState(false)
  const hookBank = get120HooksBank()

  useEffect(() => {
    if (pendingAction.action === 'target-fear-in-hooks' && pendingAction.data) {
      const fear = pendingAction.data
      setTargetedFear({ id: fear.id, name: fear.name, relevance: fear.relevance })
      setTargetAudience(fear.targetAudience || '')
      setPendingAction(null)
    } else if (pendingAction.action === 'generate-hooks-from-calendar' && pendingAction.data) {
      const entry = pendingAction.data
      setTopic(entry.notes || entry.title)
      setPlatform(entry.platform.toLowerCase())
      setPendingAction(null)
    }
  }, [pendingAction, setPendingAction])

  useEffect(() => {
    const vaultData = localStorage.getItem('vaultToHookGenerator')
    if (vaultData) {
      try {
        const data = JSON.parse(vaultData)
        if (data.contentIdea) {
          setTopic(data.contentIdea)
          if (data.hookType) setHookType(data.hookType)
          if (data.platform) setPlatform(data.platform)
          if (data.shadowFear) setTargetedFear({ id: Date.now(), name: data.shadowFear, relevance: 85 })
        }
        if (data.story) {
          setTopic(`Create hook about: ${data.lesson || data.story}`)
          if (data.hookType) setHookType(data.hookType)
          if (data.shadowFear) setTargetedFear({ id: Date.now(), name: data.shadowFear, relevance: 85 })
        }
        localStorage.removeItem('vaultToHookGenerator')
      } catch (error) {
        console.error('Error loading vault data:', error)
      }
    }
  }, [])

  const generateHooks = async () => {
    if (!topic.trim()) { setError('Enter a topic to generate hooks'); return }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/hooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, duration, hookType, icp: icp === 'auto' ? undefined : icp, shadowFear: shadowFear === 'auto' ? undefined : shadowFear, awarenessLevel: awarenessLevel === 'auto' ? undefined : awarenessLevel, targetAudience: targetAudience.trim() || undefined, targetFear: targetedFear ? { id: targetedFear.id, name: targetedFear.name, relevance: targetedFear.relevance } : undefined, count: 5 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate hooks')
      const generatedHooks: Hook[] = data.hooks.map((content: string, index: number) => ({ id: `${Date.now()}-${index}`, content, likes: 0 }))
      setHooks(generatedHooks)
      if (data.compliance) { setCompliance(data.compliance); setShowCompliance(true) }
      generatedHooks.forEach((hook) => addHook({ content: hook.content, type: hookType !== 'any' ? hookType as any : 'information_gap', platform }))
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyHook = (content: string) => navigator.clipboard.writeText(content)

  const likeHook = (id: string) => setHooks((prev) => prev.map((hook) => hook.id === id ? { ...hook, likes: hook.likes + 1 } : hook))

  const deleteHook = (id: string) => setHooks((prev) => prev.filter((hook) => hook.id !== id))

  const saveHook = async (hook: Hook) => {
    setSavingId(hook.id)
    try {
      // Save to DB (shows in Saved Hooks page after login on any device)
      await fetch('/api/hooks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: hook.content,
          topic: topic || '',
          platform,
          duration,
          hookType: hookType !== 'any' ? hookType : 'general',
          category: 'generated',
        }),
      })
      setSavedIds(prev => new Set(prev).add(hook.id))
    } catch (err) {
      setError('Could not save hook. Try again.')
    } finally {
      setSavingId(null)
    }
  }

  const saveToHookBank = async (hook: Hook) => {
    setSavingId(hook.id + '-bank')
    try {
      const response = await fetch('/api/hook-bank/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookText: hook.content, hookType: hookType !== 'any' ? hookType : 'question', awarenessLevel: 'symptom_aware', broadened: false, topic: topic || '', platform: platform || '', timesUsed: 0, avgPerformance: 0, isFavorite: false }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details ? `${data.error}: ${data.details}` : data.error || 'Failed to save')
      setSavedIds(prev => new Set(prev).add(hook.id + '-bank'))
    } catch (err: any) {
      setError('Error saving to Hook Bank: ' + (err.message || 'Unknown error'))
    } finally {
      setSavingId(null)
    }
  }

  const saveAllToHookBank = async () => {
    if (hooks.length === 0) return
    setLoading(true)
    let successCount = 0; let failCount = 0; const errors: string[] = []
    for (const hook of hooks) {
      try {
        const response = await fetch('/api/hook-bank/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hookText: hook.content, hookType: hookType !== 'any' ? hookType : 'question', awarenessLevel: 'symptom_aware', broadened: false, topic: topic || '', platform: platform || '', timesUsed: 0, avgPerformance: 0, isFavorite: false }) })
        const data = await response.json()
        if (response.ok) { successCount++ } else { failCount++; errors.push(data.details ? `${data.error}: ${data.details}` : data.error || 'Unknown error') }
      } catch (err: any) { failCount++; errors.push(err.message || 'Network error') }
    }
    setLoading(false)
    if (failCount === 0) {
      hooks.forEach(h => setSavedIds(prev => new Set(prev).add(h.id + '-bank')))
    } else {
      setError(failCount === hooks.length ? `Failed to save hooks: ${errors[0] || ''}` : `Saved ${successCount} hooks (${failCount} failed)`)
    }
  }

  const exportHooksToPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>Hooks — ${new Date().toLocaleDateString()}</title><style>body{font-family:'Montserrat',Arial,sans-serif;padding:48px;background:#FAF7F0;color:#1F1B16;max-width:760px;margin:0 auto}.header{margin-bottom:40px;padding:28px 32px;background:linear-gradient(135deg,#E6C871,#C9A646,#8C6F1F);border-radius:12px}.header h1{font-size:22px;font-weight:900;color:#0A0A0A;margin:0 0 6px}.header p{font-size:13px;color:#0A0A0A;opacity:0.7;margin:0}.hook{margin-bottom:24px;padding:20px 24px;background:#fff;border:1px solid #DED5C2;border-left:3px solid #C9A646;border-radius:8px}.hook-num{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#C9A646;margin-bottom:8px}.hook-text{font-size:15px;font-weight:500;line-height:1.65;color:#1F1B16}@media print{body{padding:20px}}</style></head><body><div class="header"><h1>Generated Hooks</h1><p>Topic: ${topic} · ${platform} · ${duration} · ${new Date().toLocaleDateString()}</p></div>${hooks.map((hook, i) => `<div class="hook"><div class="hook-num">Hook ${i + 1}</div><div class="hook-text">${hook.content}</div></div>`).join('')}<script>window.onload=function(){window.print();setTimeout(()=>window.close(),100)}<\/script></body></html>`)
      printWindow.document.close()
    }
  }

  const filteredHooks = selectedHookCategory === 'all'
    ? hookBank.categories.flatMap(cat => cat.hooks)
    : hookBank.categories.find(cat => cat.id.toString() === selectedHookCategory)?.hooks || []

  const copyBankHook = (hookText: string) => {
    navigator.clipboard.writeText(hookText)
    alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">

      {/* Page header */}
      <ToolPageHeader
        icon={Zap}
        iconColor="text-[#C9A646]"
        eyebrow="Create"
        title="Hook Generator"
        description="Generate scroll-stopping hooks using the R×A×C×U^B formula — fear, curiosity, data, contrast."
      />

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Hook Bank — 120 proven hooks */}
        <div className="nc-panel">
          <button
            onClick={() => setShowHookBank(!showHookBank)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FAF7F0] text-[#C9A646]">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-heading font-bold text-[#0A0A0A] text-sm leading-none">NOCHILL 120 Hooks Bank</p>
                <p className="text-[12px] text-[#8A8071] mt-1">Browse 120 proven hooks across 6 categories</p>
              </div>
            </div>
            <div className="text-[#8A8071]">
              {showHookBank ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showHookBank && (
            <div className="px-5 pb-5 space-y-4 border-t border-[#DED5C2] pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedHookCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-heading font-bold uppercase tracking-wide transition-all ${selectedHookCategory === 'all' ? 'bg-[#C9A646] text-[#0A0A0A]' : 'bg-white border border-[#DED5C2] text-[#5C5448] hover:border-[#C9A646]/50'}`}
                >
                  All (120)
                </button>
                {hookBank.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedHookCategory(category.id.toString())}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-heading font-bold uppercase tracking-wide transition-all ${selectedHookCategory === category.id.toString() ? 'bg-[#C9A646] text-[#0A0A0A]' : 'bg-white border border-[#DED5C2] text-[#5C5448] hover:border-[#C9A646]/50'}`}
                  >
                    {category.category.split(' & ')[0]} ({category.count})
                  </button>
                ))}
              </div>

              {selectedHookCategory !== 'all' && (
                <div className="p-3.5 bg-white border border-[#DED5C2] rounded-xl">
                  {hookBank.categories.filter(cat => cat.id.toString() === selectedHookCategory).map(category => (
                    <div key={category.id}>
                      <p className="font-heading font-bold text-[#0A0A0A] text-sm">{category.category}</p>
                      <p className="text-[13px] text-[#5C5448] mt-1">{category.description}</p>
                      <p className="nc-helper mt-2">
                        <span className="font-semibold text-[#4A3F35]">Impact:</span> {category.emotional_impact} ·{' '}
                        <span className="font-semibold text-[#4A3F35]">Best for:</span> {category.best_for.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredHooks.length === 0 ? (
                  <p className="text-center text-[#8A8071] py-6 font-heading text-sm">No hooks found</p>
                ) : filteredHooks.map((hook) => (
                  <div key={hook.id} className="nc-result-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-[13px] font-heading font-semibold text-[#1F1B16] leading-relaxed">{hook.hook}</p>
                        {hook.r_a_c_u_b && (
                          <div className="mt-2 space-y-0.5">
                            <p className="nc-helper"><span className="font-semibold text-[#4A3F35]">Relevant:</span> {hook.r_a_c_u_b.relevant}</p>
                            <p className="nc-helper"><span className="font-semibold text-[#4A3F35]">Unique:</span> {hook.r_a_c_u_b.unique}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => copyBankHook(hook.hook)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors" title="Copy">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setTopic(hook.hook)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors" title="Use as topic">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="nc-helper italic">Use these as patterns — create your own hooks from the same structure.</p>
            </div>
          )}
        </div>

        {/* Generator form */}
        <div className="nc-tool-section space-y-5">
          <div>
            <p className="nc-eyebrow mb-0.5">Generator</p>
            <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">Generate Viral Hooks</h2>
          </div>

          {/* Targeted fear badge */}
          {targetedFear && (
            <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] border border-[#C9A646]/30 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Target className="h-4 w-4 text-[#C9A646] flex-shrink-0" />
                <div>
                  <p className="font-heading font-bold text-[#0A0A0A] text-sm leading-none">Targeting: {targetedFear.name}</p>
                  <p className="nc-helper mt-0.5">Relevance {targetedFear.relevance}% — hooks will target this shadow fear</p>
                </div>
              </div>
              <button onClick={() => setTargetedFear(null)} className="p-1 rounded text-[#8A8071] hover:text-[#0A0A0A] transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="nc-form-row">
            <label htmlFor="topic">Topic *</label>
            <input
              id="topic"
              className="nc-tool-input"
              placeholder="e.g. brand deals for small creators"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* ICP + Shadow Fear — Primary targeting */}
          <div className="grid grid-cols-2 gap-4">
            <div className="nc-form-row">
              <label htmlFor="icp">Target ICP</label>
              <Select value={icp} onValueChange={setIcp}>
                <SelectTrigger id="icp" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect from topic</SelectItem>
                  <SelectItem value="icp1">ICP 1 — Called Expert (28–42)</SelectItem>
                  <SelectItem value="icp2">ICP 2 — Content Creator (23–28)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="nc-form-row">
              <label htmlFor="shadowFear">Shadow Fear</label>
              <Select value={shadowFear} onValueChange={setShadowFear}>
                <SelectTrigger id="shadowFear" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="wasted_life">Wasted Life (#1)</SelectItem>
                  <SelectItem value="generational_poverty">Generational Poverty Trap (#2)</SelectItem>
                  <SelectItem value="imposter_syndrome">Imposter Syndrome (#3)</SelectItem>
                  <SelectItem value="wrong_path">Wrong Path Terror (#4)</SelectItem>
                  <SelectItem value="invisible_labor">Invisible Labor (#5)</SelectItem>
                  <SelectItem value="platform_dependency">Platform Dependency (#6)</SelectItem>
                  <SelectItem value="time_anxiety">Time Anxiety (#7)</SelectItem>
                  <SelectItem value="relationship_loss">Relationship Loss (#8)</SelectItem>
                  <SelectItem value="spiritual_crisis">Spiritual Crisis (#9)</SelectItem>
                  <SelectItem value="legacy_void">Legacy Void (#10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="nc-form-row">
              <label htmlFor="platform">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="nc-form-row">
              <label htmlFor="duration">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="60s">60 seconds</SelectItem>
                  <SelectItem value="90s">90 seconds</SelectItem>
                  <SelectItem value="3min">3 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="nc-form-row">
              <label htmlFor="awarenessLevel">Awareness Level (A in R×A×C×U^B)</label>
              <Select value={awarenessLevel} onValueChange={setAwarenessLevel}>
                <SelectTrigger id="awarenessLevel" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="symptom_aware">Symptom Aware — feels pain, doesn't know cause</SelectItem>
                  <SelectItem value="problem_aware">Problem Aware — knows the problem</SelectItem>
                  <SelectItem value="solution_aware">Solution Aware — knows solutions exist</SelectItem>
                  <SelectItem value="product_aware">Product Aware — knows your offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="nc-form-row">
              <label htmlFor="hookType">Hook Type (C in R×A×C×U^B)</label>
              <Select value={hookType} onValueChange={setHookType}>
                <SelectTrigger id="hookType" className="nc-tool-input h-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="information_gap">Information Gap</SelectItem>
                  <SelectItem value="desired_result">Desired Result</SelectItem>
                  <SelectItem value="undesired_result">Undesired Result</SelectItem>
                  <SelectItem value="a_to_b_transformation">A→B Transformation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <div className="nc-error">{error}</div>}

          <button onClick={generateHooks} disabled={loading} className="nc-generate-btn">
            {loading ? (
              <><Sparkles className="h-4 w-4 animate-spin" /> Generating Hooks...</>
            ) : (
              <><Zap className="h-4 w-4" /> Generate 5 Hooks</>
            )}
          </button>
        </div>

        {/* Generated hooks */}
        {hooks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="nc-eyebrow mb-0.5">Results</p>
                <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">Generated Hooks ({hooks.length})</h2>
              </div>
              <button onClick={exportHooksToPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 hover:text-[#0A0A0A] transition-all text-[12px] font-heading font-bold uppercase tracking-wide">
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </button>
            </div>

            {hooks.map((hook, index) => (
              <div key={hook.id} className="nc-result-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="nc-eyebrow mb-2">Hook {index + 1}</p>
                    <p className="font-heading font-semibold text-[#1F1B16] text-[15px] leading-relaxed">{hook.content}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <div className="flex gap-1">
                      <button onClick={() => likeHook(hook.id)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-red-500 hover:bg-[#FAF7F0] transition-colors" title="Like">
                        <Heart className={`h-3.5 w-3.5 ${hook.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                      <button onClick={() => copyHook(hook.content)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors" title="Copy">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => saveHook(hook)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors" title="Save">
                        <Save className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => saveToHookBank(hook)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-[#C9A646] hover:bg-[#FAF7F0] transition-colors" title="Save to Hook Bank">
                        <Database className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteHook(hook.id)} className="p-1.5 rounded-lg text-[#8A8071] hover:text-red-500 hover:bg-[#FAF7F0] transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const savedHook = addHook({ content: hook.content, type: hookType !== 'any' ? hookType as any : 'information_gap', platform })
                          setPendingAction({ action: 'use-hook-in-script', data: savedHook })
                          router.push('/dashboard/scripts')
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 transition-all text-[11px] font-heading font-bold uppercase tracking-wide"
                      >
                        <ArrowRight className="h-3 w-3" /> Script
                      </button>
                      <button
                        onClick={() => {
                          addContentToCalendar({ title: hook.content.substring(0, 50) + '...', platform, sourceTools: ['Hook Generator'] })
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 transition-all text-[11px] font-heading font-bold uppercase tracking-wide"
                      >
                        <CalendarIcon className="h-3 w-3" /> Calendar
                      </button>
                    </div>
                    {hook.likes > 0 && (
                      <p className="text-[11px] text-[#C9A646] font-heading font-bold text-center">{hook.likes} ♥</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={generateHooks} disabled={loading} className="nc-generate-btn">
                {loading ? <><Sparkles className="h-4 w-4 animate-spin" /> Generating...</> : <><Zap className="h-4 w-4" /> Generate More</>}
              </button>
              <button
                onClick={saveAllToHookBank}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#DED5C2] bg-white text-[#5C5448] hover:border-[#C9A646]/50 hover:bg-[#FAF7F0] transition-all text-[13px] font-heading font-bold uppercase tracking-wide disabled:opacity-50"
              >
                <Database className="h-4 w-4 text-[#C9A646]" />
                Save All to Hook Bank
              </button>
            </div>
          </div>
        )}

        {/* Framework Compliance Panel */}
        {compliance && (
          <div className="nc-panel overflow-hidden">
            <button
              onClick={() => setShowCompliance(!showCompliance)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0A0A0A] text-[#C9A646]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading font-black text-[#0A0A0A] text-sm leading-none">Framework Compliance Report</p>
                  <p className="text-[12px] text-[#8A8071] mt-1">What the AI followed to generate these hooks</p>
                </div>
              </div>
              <div className="text-[#8A8071]">
                {showCompliance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {showCompliance && (
              <div className="px-5 pb-5 border-t border-[#DED5C2] space-y-5 pt-4">
                {/* Top metadata */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ICP Targeted', value: compliance.icp },
                    { label: 'Shadow Fear', value: compliance.shadowFear },
                    { label: 'Hook Type', value: compliance.hookType?.replace(/_/g, ' ') },
                    { label: 'Awareness Level', value: compliance.awarenessLevel?.replace(/_/g, ' ') },
                    { label: 'Business Outcome', value: compliance.businessOutcome },
                    { label: 'PAIDS Category', value: compliance.paidsCategory },
                    { label: '4E Type', value: compliance.fourE },
                    { label: 'Villain Named', value: compliance.villain },
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DED5C2]">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#8A8071] mb-1">{item.label}</p>
                      <p className="text-[12px] font-heading font-semibold text-[#1F1B16] leading-snug">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Atomic share line */}
                {compliance.atomicShareLine && (
                  <div className="p-3.5 bg-[#0A0A0A] rounded-xl">
                    <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#C9A646] mb-2">Atomic Share Line</p>
                    <p className="text-[13px] font-heading font-semibold text-white leading-relaxed">"{compliance.atomicShareLine}"</p>
                  </div>
                )}

                {/* Section 13 checklist */}
                {compliance.section13 && (
                  <div>
                    <p className="text-[11px] font-heading font-black uppercase tracking-wider text-[#0A0A0A] mb-3">Section 13 — Master Framework Checklist</p>
                    <div className="space-y-1.5">
                      {Object.entries(compliance.section13).map(([key, value]) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                        const val = value as string
                        const passed = val.startsWith('✅')
                        const isNA = val.startsWith('N/A')
                        return (
                          <div key={key} className="flex items-start gap-2.5 py-1.5 border-b border-[#DED5C2]/50 last:border-0">
                            <span className={`text-[13px] flex-shrink-0 mt-0.5 ${passed ? 'text-green-600' : isNA ? 'text-[#B0A898]' : 'text-red-500'}`}>
                              {passed ? '✅' : isNA ? '—' : '❌'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-heading font-bold text-[#0A0A0A] uppercase tracking-wide">{label}: </span>
                              <span className="text-[11px] text-[#5C5448]">{val.replace(/^✅\s*|^❌\s*|^N\/A\s*—?\s*/i, '')}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Principles */}
                {compliance.principlesApplied?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {compliance.principlesApplied.map((p: string) => (
                      <span key={p} className="px-2.5 py-1 rounded-full bg-[#C9A646]/10 border border-[#C9A646]/30 text-[11px] font-heading font-bold text-[#7A5F1A] uppercase tracking-wide">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {hooks.length === 0 && !loading && (
          <div className="nc-tool-section flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#DED5C2] flex items-center justify-center mb-5">
              <Zap className="h-6 w-6 text-[#C9A646]" />
            </div>
            <h3 className="font-heading font-black text-[#0A0A0A] text-lg mb-2">No hooks generated yet</h3>
            <p className="text-[#8A8071] text-sm max-w-sm">
              Enter your topic and hit Generate — five scroll-stopping hooks using the NOCHILL R×A×C×U^B formula.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
