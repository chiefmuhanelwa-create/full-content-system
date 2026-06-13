'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ClipboardList, Sparkles, Copy, Check, Plus, Trash2, Clock, Camera, Download } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ContentPiece {
  topic: string
  hookIdea: string
  platform: string
  contentType: string
}

interface ScheduleBlock {
  timeSlot: string
  activity: string
  type: string
  duration: string
  notes: string
}

interface ContentBlock {
  order: number
  timeSlot: string
  contentTitle: string
  platform: string
  hook: string
  keyPoints: string[]
  estimatedTakes: number
  bRoll: string[]
  wardrobeNote: string
  energyLevel: string
}

interface Runsheet {
  runsheetTitle: string
  preShootChecklist: string[]
  schedule: ScheduleBlock[]
  contentBlocks: ContentBlock[]
  batchingStrategy: string
  postShootActions: string[]
  proTips: string[]
}

export default function RunsheetPage() {
  const [pieces, setPieces] = useState<ContentPiece[]>([
    { topic: '', hookIdea: '', platform: 'instagram', contentType: 'Educational' },
  ])
  const [shootDate, setShootDate] = useState('')
  const [location, setLocation] = useState('home studio')
  const [totalDuration, setTotalDuration] = useState('4 hours')
  const [loading, setLoading] = useState(false)
  const [runsheet, setRunsheet] = useState<Runsheet | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Load from batch planner if redirected
  useEffect(() => {
    const preload = localStorage.getItem('runsheetPreload')
    if (preload) {
      try {
        const data = JSON.parse(preload)
        if (Array.isArray(data) && data.length > 0) {
          setPieces(data.map((d: any) => ({
            topic: d.topic || '',
            hookIdea: d.hookIdea || '',
            platform: d.platform || 'instagram',
            contentType: d.contentType || 'Educational',
          })))
        }
        localStorage.removeItem('runsheetPreload')
      } catch {}
    }
  }, [])

  const addPiece = () => {
    setPieces(prev => [...prev, { topic: '', hookIdea: '', platform: 'instagram', contentType: 'Educational' }])
  }

  const removePiece = (i: number) => {
    setPieces(prev => prev.filter((_, idx) => idx !== i))
  }

  const updatePiece = (i: number, field: keyof ContentPiece, value: string) => {
    setPieces(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  const generate = async () => {
    const validPieces = pieces.filter(p => p.topic.trim())
    if (validPieces.length === 0) {
      setError('Add at least one content piece with a topic')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/runsheet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shootDate,
          contentPieces: validPieces,
          location,
          totalDuration,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }
      const data = await res.json()
      setRunsheet(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyAll = () => {
    if (!runsheet) return
    const text = [
      runsheet.runsheetTitle,
      '',
      '═══ PRE-SHOOT CHECKLIST ═══',
      ...runsheet.preShootChecklist.map((c, i) => `☐ ${i + 1}. ${c}`),
      '',
      '═══ SCHEDULE ═══',
      ...runsheet.schedule.map(s => `${s.timeSlot} — ${s.activity} (${s.duration})\n   ${s.notes}`),
      '',
      '═══ CONTENT BLOCKS ═══',
      ...runsheet.contentBlocks.map(b => [
        `\n[${b.order}] ${b.contentTitle} — ${b.timeSlot}`,
        `Platform: ${b.platform} | Energy: ${b.energyLevel}`,
        `HOOK: "${b.hook}"`,
        `Key points: ${b.keyPoints.join(' → ')}`,
        `Takes: ~${b.estimatedTakes} | B-Roll: ${b.bRoll.join(', ')}`,
        b.wardrobeNote ? `Wardrobe: ${b.wardrobeNote}` : '',
      ].filter(Boolean).join('\n')),
      '',
      '═══ BATCHING STRATEGY ═══',
      runsheet.batchingStrategy,
      '',
      '═══ POST-SHOOT ACTIONS ═══',
      ...runsheet.postShootActions.map((a, i) => `${i + 1}. ${a}`),
      '',
      '═══ PRO TIPS ═══',
      ...runsheet.proTips.map((t, i) => `${i + 1}. ${t}`),
    ].join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const energyColors: Record<string, string> = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-gray-100 text-gray-700 border-gray-300',
  }

  return (
    <div className="min-h-full bg-[#F9FAFB]">
      <ToolPageHeader
        icon={ClipboardList}
        iconColor="text-purple-600"
        iconBg="bg-purple-500/10"
        eyebrow="Planning"
        title="Shoot Day Runsheet"
        description="Turn your batch content plan into a minute-by-minute shoot schedule. Never waste time on shoot day again."
      />

      <div className="px-6 py-8 space-y-8">

        {/* Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Shoot Setup</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shootDate">Shoot Date</Label>
              <Input
                id="shootDate"
                type="date"
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Home studio, office..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Session Length</Label>
              <Select value={totalDuration} onValueChange={setTotalDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                  <SelectItem value="4 hours">4 hours</SelectItem>
                  <SelectItem value="6 hours">6 hours (full day)</SelectItem>
                  <SelectItem value="8 hours">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Pieces */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Content to Shoot ({pieces.length} pieces)</CardTitle>
                <CardDescription>Add each video or piece you plan to record. Topics from your Batch Planner auto-load here.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addPiece}>
                <Plus className="h-4 w-4 mr-1" />
                Add Piece
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pieces.map((piece, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Piece #{i + 1}</span>
                  {pieces.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removePiece(i)} className="text-red-400 hover:text-red-600 h-6 w-6 p-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Topic *</Label>
                    <Input
                      placeholder="What's this video about?"
                      value={piece.topic}
                      onChange={(e) => updatePiece(i, 'topic', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hook Idea</Label>
                    <Input
                      placeholder="Opening line or hook concept"
                      value={piece.hookIdea}
                      onChange={(e) => updatePiece(i, 'hookIdea', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Platform</Label>
                    <Select value={piece.platform} onValueChange={(v) => updatePiece(i, 'platform', v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram Reels</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube Shorts</SelectItem>
                        <SelectItem value="facebook">Facebook Reels</SelectItem>
                        <SelectItem value="linkedin">LinkedIn Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Content Type</Label>
                    <Select value={piece.contentType} onValueChange={(v) => updatePiece(i, 'contentType', v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Story">Story / Personal</SelectItem>
                        <SelectItem value="Sales">Sales / Promo</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Building your shoot runsheet...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Shoot Runsheet
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        {runsheet && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{runsheet.runsheetTitle}</h2>
              <Button variant="outline" onClick={copyAll}>
                {copied ? <><Check className="h-4 w-4 mr-2" />Copied!</> : <><Copy className="h-4 w-4 mr-2" />Copy All</>}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              {/* Pre-shoot checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>☐</span> Pre-Shoot Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {runsheet.preShootChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Day Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {runsheet.schedule.map((slot, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-sm ${
                          slot.type === 'setup' ? 'bg-blue-50 border-blue-200' :
                          slot.type === 'break' ? 'bg-gray-50 border-gray-200' :
                          'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs">{slot.timeSlot}</span>
                          <span className="text-xs text-gray-500">{slot.duration}</span>
                        </div>
                        <p className="font-medium">{slot.activity}</p>
                        {slot.notes && <p className="text-xs text-gray-600 mt-1">{slot.notes}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Blocks */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4" /> Content Blocks
              </h3>
              <div className="grid lg:grid-cols-2 gap-4">
                {runsheet.contentBlocks.map((block, i) => (
                  <Card key={i} className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              #{block.order}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${energyColors[block.energyLevel] || energyColors.medium}`}>
                              {block.energyLevel} energy
                            </span>
                          </div>
                          <CardTitle className="text-sm leading-tight">{block.contentTitle}</CardTitle>
                          <CardDescription className="text-xs">{block.timeSlot} · {block.platform}</CardDescription>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">~{block.estimatedTakes} takes</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                        <span className="font-semibold text-amber-800">HOOK: </span>
                        <span className="text-amber-900">"{block.hook}"</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Key points:</p>
                        <ol className="space-y-0.5">
                          {block.keyPoints.map((pt, j) => (
                            <li key={j} className="text-xs text-gray-700 flex items-start gap-1">
                              <span className="font-semibold text-purple-600 flex-shrink-0">{j + 1}.</span>
                              {pt}
                            </li>
                          ))}
                        </ol>
                      </div>
                      {block.bRoll.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">B-Roll needed:</p>
                          <div className="flex flex-wrap gap-1">
                            {block.bRoll.map((br, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{br}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {block.wardrobeNote && (
                        <p className="text-xs text-blue-600 italic">👔 {block.wardrobeNote}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Batching Strategy */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-900">Batching Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">{runsheet.batchingStrategy}</p>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Post-shoot */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">After You Shoot</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {runsheet.postShootActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Pro Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {runsheet.proTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500 flex-shrink-0">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
