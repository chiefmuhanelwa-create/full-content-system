'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wand2, Video, Youtube, Copy, Save, FileText, Download, Loader2, PlayCircle, MonitorPlay } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface FormulaOutput {
  title: string
  formula: string
  platform: string
  fullScript: string
  structure: {
    section: string
    duration: string
    content: string
    deliveryNotes: string
  }[]
  visualSuggestions: string[]
  thumbnailIdeas?: string[]
  retentionTips: string[]
}

const talkingHeadFormulas = [
  { value: 'hook-teach-cta', label: 'Hook-Teach-CTA', duration: '30-60s', bestFor: 'Quick tips, framework teaching' },
  { value: 'story-lesson-action', label: 'Story-Lesson-Action', duration: '60-90s', bestFor: 'Personal stories, relatable content' },
  { value: 'pas-video', label: 'Problem-Agitate-Solve', duration: '45-75s', bestFor: 'Urgent problems, sales content' },
  { value: 'myth-bust-truth', label: 'Myth-Bust-Truth', duration: '30-60s', bestFor: 'Thought leadership, contrarian takes' },
  { value: 'before-after-how', label: 'Before-After-How', duration: '45-60s', bestFor: 'Transformation stories, social proof' },
]

const youtubeFormulas = [
  { value: 'tutorial', label: 'Tutorial/How-To', duration: '8-15 min', bestFor: 'Skill teaching, software tutorials' },
  { value: 'documentary', label: 'Storytelling Documentary', duration: '12-25 min', bestFor: 'Origin stories, transformations' },
  { value: 'listicle', label: 'Ultimate Guide/Listicle', duration: '10-20 min', bestFor: 'Comprehensive guides, lists' },
  { value: 'results-reveal', label: 'Results Reveal/Vlog', duration: '8-15 min', bestFor: 'Challenges, experiments, income reports' },
  { value: 'deep-dive', label: 'Deep Dive Analysis', duration: '15-30 min', bestFor: 'Thought leadership, strategy' },
]

const platforms = [
  { value: 'instagram', label: 'Instagram Reels', idealLength: '45-90s' },
  { value: 'tiktok', label: 'TikTok', idealLength: '15-60s' },
  { value: 'youtube-shorts', label: 'YouTube Shorts', idealLength: '30-60s' },
  { value: 'youtube', label: 'YouTube (Long-form)', idealLength: '8-20 min' },
  { value: 'linkedin', label: 'LinkedIn', idealLength: '60-90s' },
  { value: 'facebook', label: 'Facebook Reels', idealLength: '30-90s' },
]

export default function ContentFormulas() {
  const [contentType, setContentType] = useState<'talking-head' | 'youtube'>('talking-head')
  const [selectedFormula, setSelectedFormula] = useState('')
  const [platform, setPlatform] = useState('')
  const [topic, setTopic] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [personalStory, setPersonalStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<FormulaOutput | null>(null)
  const { addScript, setPendingAction } = useContent()

  const generateFormula = async () => {
    if (!selectedFormula || !platform || !topic) {
      alert('Please fill in all required fields')
      return
    }

    // Load voice profile if available
    let voiceProfile = null
    try {
      const savedProfile = localStorage.getItem('voiceProfile')
      if (savedProfile) {
        voiceProfile = JSON.parse(savedProfile)
      }
    } catch (e) {
      console.error('Failed to load voice profile:', e)
    }

    setLoading(true)
    try {
      const response = await fetch('/api/formulas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          formula: selectedFormula,
          platform,
          topic,
          keyPoints,
          personalStory,
          voiceProfile,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate formula')
      }

      const data = await response.json()
      setOutput(data)
    } catch (error: any) {
      alert(error.message || 'Failed to generate content formula. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const saveScript = () => {
    if (!output) return

    const scripts = JSON.parse(localStorage.getItem('scripts') || '[]')
    scripts.push({
      id: Date.now(),
      title: output.title,
      formula: output.formula,
      platform: output.platform,
      content: output.fullScript,
      structure: output.structure,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('scripts', JSON.stringify(scripts))
    alert('Script saved to library!')
  }

  const openInTeleprompter = () => {
    if (!output) return

    localStorage.setItem('teleprompterScript', JSON.stringify({
      title: output.title,
      fullScript: output.fullScript,
      platform: output.platform,
    }))

    window.location.href = '/dashboard/teleprompter'
  }

  const exportPDF = () => {
    if (!output) return

    const content = `
CONTENT FORMULA OUTPUT
${new Date().toLocaleDateString()}

TITLE: ${output.title}
FORMULA: ${output.formula}
PLATFORM: ${output.platform}

═══════════════════════════════════════

FULL SCRIPT:
${output.fullScript}

═══════════════════════════════════════

SCRIPT STRUCTURE:
${output.structure.map(s => `
${s.section} (${s.duration})
${s.content}

Delivery Notes: ${s.deliveryNotes}
`).join('\n')}

═══════════════════════════════════════

VISUAL SUGGESTIONS:
${output.visualSuggestions.map((v, i) => `${i + 1}. ${v}`).join('\n')}

${output.thumbnailIdeas ? `
═══════════════════════════════════════

THUMBNAIL IDEAS:
${output.thumbnailIdeas.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}

═══════════════════════════════════════

RETENTION TIPS:
${output.retentionTips.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formula-${Date.now()}.txt`
    a.click()
  }

  const currentFormulas = contentType === 'talking-head' ? talkingHeadFormulas : youtubeFormulas

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Wand2}
        eyebrow="Create"
        title="Content Formulas"
        description="Proven formulas built on 4 Foundational Principles: Negativity Always Wins, You Format, Short & Simple, Audible Flow"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 border-l-4 border-[#C9A646]">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-[#C9A646] mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">5 Talking Head Formulas</h3>
                <p className="text-xs text-[#8A8071] mt-1">
                  Perfect for Reels, TikTok, Shorts (15-90 seconds)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-[#C9A646]">
            <div className="flex items-start gap-3">
              <Youtube className="h-5 w-5 text-[#C9A646] mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">5 YouTube Formulas</h3>
                <p className="text-xs text-[#8A8071] mt-1">
                  Long-form content (8-30 minutes)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-[#C9A646]">
            <div className="flex items-start gap-3">
              <PlayCircle className="h-5 w-5 text-[#C9A646] mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">4 Foundational Principles</h3>
                <p className="text-xs text-[#8A8071] mt-1">
                  Every formula applies: Negativity, You Format, Short & Simple, Audible Flow
                </p>
              </div>
            </div>
          </Card>
        </div>

      {/* Content Type Tabs */}
      <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)} className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="talking-head" className="gap-2">
            <Video className="h-4 w-4" />
            Talking Head (Short-form)
          </TabsTrigger>
          <TabsTrigger value="youtube" className="gap-2">
            <Youtube className="h-4 w-4" />
            YouTube (Long-form)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-heading font-black text-lg mb-4 text-[#0A0A0A]">Formula Configuration</h2>

            {/* Formula Selection */}
            <div className="space-y-2 mb-4">
              <Label>Content Formula</Label>
              <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a formula..." />
                </SelectTrigger>
                <SelectContent>
                  {currentFormulas.map((formula) => (
                    <SelectItem key={formula.value} value={formula.value}>
                      <div>
                        <div className="font-medium">{formula.label}</div>
                        <div className="text-xs text-[#8A8071]">
                          {formula.duration} • {formula.bestFor}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Selection */}
            <div className="space-y-2 mb-4">
              <Label>Target Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform..." />
                </SelectTrigger>
                <SelectContent>
                  {platforms
                    .filter(p =>
                      contentType === 'youtube'
                        ? p.value === 'youtube'
                        : p.value !== 'youtube'
                    )
                    .map((plat) => (
                      <SelectItem key={plat.value} value={plat.value}>
                        <div>
                          <div className="font-medium">{plat.label}</div>
                          <div className="text-xs text-[#8A8071]">Ideal: {plat.idealLength}</div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div className="space-y-2 mb-4">
              <Label>Content Topic/Title</Label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is this content about?

Examples:
- How to grow on Instagram without posting daily
- The productivity system that 10X'd my output
- Why most content strategies fail (and what works instead)"
                rows={4}
                className="text-sm"
              />
            </div>

            {/* Key Points */}
            <div className="space-y-2 mb-4">
              <Label>Key Points to Cover</Label>
              <Textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="List the main points you want to teach or share:

Example:
- The 3-post-per-week strategy
- Quality over quantity principle
- How to batch content in 2 hours
- Why consistency beats frequency"
                rows={6}
                className="text-sm"
              />
            </div>

            {/* Personal Story (Optional) */}
            <div className="space-y-2 mb-4">
              <Label>Personal Story (Optional)</Label>
              <Textarea
                value={personalStory}
                onChange={(e) => setPersonalStory(e.target.value)}
                placeholder="Add a personal story to make it more engaging:

Example: I used to post 3x daily, burnt out completely, hit rock bottom. Then I discovered this approach and everything changed..."
                rows={4}
                className="text-sm"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateFormula}
              disabled={loading || !selectedFormula || !platform || !topic}
              className="w-full bg-[#C9A646] hover:bg-[#B8933A] text-[#0A0A0A] font-heading font-black uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Formula...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate {contentType === 'talking-head' ? 'Talking Head' : 'YouTube'} Script
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {output ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-black text-lg text-[#0A0A0A]">{output.title}</h2>
                  <span className="text-xs bg-[#C9A646]/15 text-[#7A5F18] px-2 py-1 rounded font-heading font-bold">
                    {output.formula}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(output.fullScript)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={saveScript}>
                    <Save className="h-3 w-3 mr-1" />
                    Save to Library
                  </Button>
                  <Button size="sm" variant="outline" onClick={openInTeleprompter}>
                    <MonitorPlay className="h-3 w-3 mr-1" />
                    Open in Teleprompter
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportPDF}>
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>

                {/* Full Script */}
                <div className="mb-6">
                  <h3 className="text-sm font-heading font-bold text-[#4A3F35] mb-2">Full Script</h3>
                  <div className="bg-[#FAF7F0] p-4 rounded-lg border border-[#E8E1D0] max-h-96 overflow-y-auto">
                    <p className="text-sm text-[#3D342A] whitespace-pre-wrap leading-relaxed font-mono">
                      {output.fullScript}
                    </p>
                  </div>
                </div>

                {/* Script Structure */}
                <div className="mb-6">
                  <h3 className="text-sm font-heading font-bold text-[#4A3F35] mb-2">Script Breakdown</h3>
                  <div className="space-y-3">
                    {output.structure.map((section, index) => (
                      <div key={index} className="bg-[#FAF7F0] p-4 rounded-lg border border-[#DED5C2]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-heading font-bold text-[#7A5F18]">{section.section}</span>
                          <span className="text-xs text-[#8A8071]">{section.duration}</span>
                        </div>
                        <p className="text-sm text-[#3D342A] mb-2">{section.content}</p>
                        <div className="text-xs text-[#8A8071] bg-[#FAF7F0]/80 p-2 rounded">
                          <strong>Delivery:</strong> {section.deliveryNotes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Suggestions */}
                <div className="mb-6">
                  <h3 className="text-sm font-heading font-bold text-[#4A3F35] mb-2">Visual Suggestions</h3>
                  <ul className="space-y-2">
                    {output.visualSuggestions.map((visual, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#3D342A]">
                        <span className="text-[#C9A646] mt-0.5">▸</span>
                        {visual}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Thumbnail Ideas (YouTube only) */}
                {output.thumbnailIdeas && output.thumbnailIdeas.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-heading font-bold text-[#4A3F35] mb-2">Thumbnail Ideas</h3>
                    <div className="space-y-2">
                      {output.thumbnailIdeas.map((thumbnail, index) => (
                        <div key={index} className="bg-[#FAF7F0] p-3 rounded-lg border border-[#DED5C2]">
                          <p className="text-sm text-[#3D342A]">{thumbnail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retention Tips */}
                <div>
                  <h3 className="text-sm font-heading font-bold text-[#4A3F35] mb-2">Retention Tips</h3>
                  <ul className="space-y-2">
                    {output.retentionTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs font-medium text-[#C9A646] mt-0.5">✓</span>
                        <p className="text-sm text-[#3D342A]">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </>
          ) : (
            <div className="nc-tool-section flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#DED5C2] flex items-center justify-center mb-5">
                <Wand2 className="h-6 w-6 text-[#C9A646]" />
              </div>
              <h3 className="font-heading font-black text-[#0A0A0A] text-lg mb-2">No script generated yet</h3>
              <p className="text-[#8A8071] text-sm max-w-xs">Select a formula, platform, and topic — then hit Generate Script.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
