'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Sparkles, Copy, Download, Calendar as CalendarIcon, BookOpen } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

interface FiveLineSection {
  timestamp: string
  script: string
  visual: string
  ubuntuPrinciple?: string
  shadowFear?: string
  systemVillain?: string
  framework?: string
  storyUsed?: string
  numbers?: string
  collectiveAction?: string
}

interface UbuntuCheck {
  we_over_i: string
  system_villain: string
  collective_result: string
}

interface ScriptingPrinciplesCheck {
  negativity: string
  you_format: string
  short_simple: string
  audible_flow: string
}

interface Hook {
  text: string
  type: 'information_gap' | 'desired_result' | 'undesired_result' | 'a_to_b_transformation'
  racub_breakdown: {
    relevant: string
    awareness: string
    clarity: string
    unique: string
    broadened: string
  }
  shadowFear: string
  powerWords: string[]
}

interface GeneratedScript {
  title: string
  hook: Hook
  fiveLine: {
    context: FiveLineSection
    collision: FiveLineSection
    conversion: FiveLineSection
    calibration: FiveLineSection
    community: FiveLineSection
  }
  bRoll: string[]
  textOverlays: string[]
  ubuntu_check?: UbuntuCheck
  scripting_principles_check?: ScriptingPrinciplesCheck
}

export default function ScriptWriterPage() {
  const { pendingAction, setPendingAction, addContentToCalendar, stories, selectedStory, selectStory } = useContent()

  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('auto')
  const [duration, setDuration] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<GeneratedScript | null>(null)
  const [error, setError] = useState('')
  const [showStorySelector, setShowStorySelector] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Check for pending action (hook from Hook Generator)
  useEffect(() => {
    if (pendingAction.action === 'use-hook-in-script' && pendingAction.data) {
      const hook = pendingAction.data
      setIdea(hook.content)
      setPlatform(hook.platform || 'auto')
      // Clear pending action
      setPendingAction(null)
    }
    if (pendingAction.action === 'use-story-in-script' && pendingAction.data) {
      const story = pendingAction.data
      // Append story to idea
      setIdea((prev) => prev + '\n\nProof Story: ' + story.content)
      setPendingAction(null)
    }
  }, [pendingAction, setPendingAction])

  const generateScript = async () => {
    if (!idea.trim()) {
      setError('Please enter your content idea')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          platform: platform === 'auto' ? undefined : platform,
          duration: duration === 'auto' ? undefined : duration,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script')
      }

      setScript(data.script)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error generating script:', err)
    } finally {
      setLoading(false)
    }
  }

  const getHookTypeLabel = (type: string) => {
    const labels = {
      information_gap: '🔍 Information Gap',
      desired_result: '🎯 Desired Result',
      undesired_result: '⚠️ Undesired Result',
      a_to_b_transformation: '🔄 A-to-B Transformation',
    }
    return labels[type as keyof typeof labels] || type
  }

  const copyScript = () => {
    if (!script) return

    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)

    const fullScript = `
${script.title}

═══════════════════════════════════════
🎣 HOOK SCIENCE (R×A×C×U^B Formula)
═══════════════════════════════════════

${getHookTypeLabel(script.hook.type)}

"${script.hook.text}"

R×A×C×U^B Breakdown:
• R (Relevant): ${script.hook.racub_breakdown.relevant}
• A (Awareness): ${script.hook.racub_breakdown.awareness}
• C (Clarity): ${script.hook.racub_breakdown.clarity}
• U (Unique): ${script.hook.racub_breakdown.unique}
• B (Broadened): ${script.hook.racub_breakdown.broadened}

Shadow Fear Targeted: ${script.hook.shadowFear}
Power Words: ${script.hook.powerWords.join(', ')}

═══════════════════════════════════════
🎯 NOCHILL 5-Line Method
═══════════════════════════════════════

LINE 1: CONTEXT (${script.fiveLine.context.timestamp})
${script.fiveLine.context.script}
Visual: ${script.fiveLine.context.visual}
${script.fiveLine.context.ubuntuPrinciple ? `Ubuntu Principle: ${script.fiveLine.context.ubuntuPrinciple}` : ''}

LINE 2: COLLISION (${script.fiveLine.collision.timestamp})
${script.fiveLine.collision.script}
Visual: ${script.fiveLine.collision.visual}
${script.fiveLine.collision.systemVillain ? `System Villain: ${script.fiveLine.collision.systemVillain}` : ''}

LINE 3: CONVERSION (${script.fiveLine.conversion.timestamp})
${script.fiveLine.conversion.script}
Visual: ${script.fiveLine.conversion.visual}
${script.fiveLine.conversion.framework ? `Framework: ${script.fiveLine.conversion.framework}` : ''}

LINE 4: CALIBRATION (${script.fiveLine.calibration.timestamp})
${script.fiveLine.calibration.script}
Visual: ${script.fiveLine.calibration.visual}
${script.fiveLine.calibration.storyUsed ? `Story: ${script.fiveLine.calibration.storyUsed}` : ''}
${script.fiveLine.calibration.numbers ? `Numbers: ${script.fiveLine.calibration.numbers}` : ''}

LINE 5: COMMUNITY (${script.fiveLine.community.timestamp})
${script.fiveLine.community.script}
Visual: ${script.fiveLine.community.visual}
${script.fiveLine.community.collectiveAction ? `Collective Action: ${script.fiveLine.community.collectiveAction}` : ''}

═══════════════════════════════════════

B-ROLL SUGGESTIONS:
${script.bRoll.map((b, i) => `${i + 1}. ${b}`).join('\n')}

TEXT OVERLAYS:
${script.textOverlays.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${script.ubuntu_check ? `
═══════════════════════════════════════
UBUNTU STORY ARC VALIDATION:
- ${script.ubuntu_check.we_over_i}
- ${script.ubuntu_check.system_villain}
- ${script.ubuntu_check.collective_result}
` : ''}
${script.scripting_principles_check ? `
4 VIRAL SCRIPTING PRINCIPLES:
- ${script.scripting_principles_check.negativity}
- ${script.scripting_principles_check.you_format}
- ${script.scripting_principles_check.short_simple}
- ${script.scripting_principles_check.audible_flow}
` : ''}
`.trim()

    navigator.clipboard.writeText(fullScript)
  }

  const downloadPDF = () => {
    if (!script) return

    const fullScript = `
${script.title}

═══════════════════════════════════════
🎣 HOOK SCIENCE (R×A×C×U^B Formula)
═══════════════════════════════════════

${getHookTypeLabel(script.hook.type)}

"${script.hook.text}"

R×A×C×U^B Breakdown:
• R (Relevant): ${script.hook.racub_breakdown.relevant}
• A (Awareness): ${script.hook.racub_breakdown.awareness}
• C (Clarity): ${script.hook.racub_breakdown.clarity}
• U (Unique): ${script.hook.racub_breakdown.unique}
• B (Broadened): ${script.hook.racub_breakdown.broadened}

Shadow Fear Targeted: ${script.hook.shadowFear}
Power Words: ${script.hook.powerWords.join(', ')}

═══════════════════════════════════════
🎯 NOCHILL 5-Line Method
═══════════════════════════════════════

LINE 1: CONTEXT (${script.fiveLine.context.timestamp})
${script.fiveLine.context.script}
Visual: ${script.fiveLine.context.visual}
${script.fiveLine.context.ubuntuPrinciple ? `Ubuntu Principle: ${script.fiveLine.context.ubuntuPrinciple}` : ''}

LINE 2: COLLISION (${script.fiveLine.collision.timestamp})
${script.fiveLine.collision.script}
Visual: ${script.fiveLine.collision.visual}
${script.fiveLine.collision.systemVillain ? `System Villain: ${script.fiveLine.collision.systemVillain}` : ''}

LINE 3: CONVERSION (${script.fiveLine.conversion.timestamp})
${script.fiveLine.conversion.script}
Visual: ${script.fiveLine.conversion.visual}
${script.fiveLine.conversion.framework ? `Framework: ${script.fiveLine.conversion.framework}` : ''}

LINE 4: CALIBRATION (${script.fiveLine.calibration.timestamp})
${script.fiveLine.calibration.script}
Visual: ${script.fiveLine.calibration.visual}
${script.fiveLine.calibration.storyUsed ? `Story: ${script.fiveLine.calibration.storyUsed}` : ''}
${script.fiveLine.calibration.numbers ? `Numbers: ${script.fiveLine.calibration.numbers}` : ''}

LINE 5: COMMUNITY (${script.fiveLine.community.timestamp})
${script.fiveLine.community.script}
Visual: ${script.fiveLine.community.visual}
${script.fiveLine.community.collectiveAction ? `Collective Action: ${script.fiveLine.community.collectiveAction}` : ''}

═══════════════════════════════════════

B-ROLL SUGGESTIONS:
${script.bRoll.map((b, i) => `${i + 1}. ${b}`).join('\n')}

TEXT OVERLAYS:
${script.textOverlays.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${script.ubuntu_check ? `
═══════════════════════════════════════
UBUNTU STORY ARC VALIDATION:
- ${script.ubuntu_check.we_over_i}
- ${script.ubuntu_check.system_villain}
- ${script.ubuntu_check.collective_result}
` : ''}
${script.scripting_principles_check ? `
4 VIRAL SCRIPTING PRINCIPLES:
- ${script.scripting_principles_check.negativity}
- ${script.scripting_principles_check.you_format}
- ${script.scripting_principles_check.short_simple}
- ${script.scripting_principles_check.audible_flow}
` : ''}
`.trim()

    // Create a printable HTML document
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${script.title}</title>
          <style>
            body { font-family: monospace; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre>${fullScript}</pre>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Script Writer
        </h1>
        <p className="text-gray-600">
          NOCHILL 5-Line Method: Context → Collision → Conversion → Calibration → Community
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>What's Your Idea?</CardTitle>
              <CardDescription>
                Describe what you want to teach or share. AI will create a complete production-ready script.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Idea Input */}
              <div className="space-y-2">
                <Label htmlFor="idea">Your Content Idea *</Label>
                <Textarea
                  id="idea"
                  placeholder="e.g., 'Teach creators how to price their brand deals' or 'Share my journey from R750 to R100K brand partnerships'"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Be specific about what you want to teach or share
                  </p>
                  {stories.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStorySelector(!showStorySelector)}
                      className="gap-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Add Story ({stories.length})
                    </Button>
                  )}
                </div>
              </div>

              {/* Story Selector */}
              {showStorySelector && stories.length > 0 && (
                <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label>Select Proof Story from Story Extractor</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => {
                          setIdea((prev) =>
                            prev + '\n\nProof Story: ' + story.content +
                            `\nMetrics: ${story.metrics.before} → ${story.metrics.after} in ${story.metrics.timeframe}`
                          )
                          setShowStorySelector(false)
                        }}
                        className="w-full text-left p-3 bg-white border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-sm">{story.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {story.metrics.before} → {story.metrics.after} in {story.metrics.timeframe}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStorySelector(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Platform Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform (Optional)</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect best platform</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                    <SelectItem value="youtube-long">YouTube (Long-form)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-optimize duration</SelectItem>
                    <SelectItem value="15s">15 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">60 seconds</SelectItem>
                    <SelectItem value="90s">90 seconds</SelectItem>
                    <SelectItem value="3min">3 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  🎯 NOCHILL 5-Line Method:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Context (0-8s):</strong> WE-focused hook (Ubuntu Story Arc)</li>
                  <li>• <strong>Collision (8-18s):</strong> Name the system villain</li>
                  <li>• <strong>Conversion (18-35s):</strong> 80% fresh teaching</li>
                  <li>• <strong>Calibration (35-48s):</strong> 20% Ndivhuwo proof story</li>
                  <li>• <strong>Community (48-60s):</strong> Collective action CTA</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateScript}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Complete Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div>
          {script ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{script.title}</CardTitle>
                    <CardDescription>Production-ready script</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyScript} className={copySuccess ? 'bg-green-100 border-green-500' : ''}>
                      <Copy className="h-4 w-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook Science Section */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎣</span>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Hook Science (R×A×C×U^B Formula)
                    </h3>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded">
                      {getHookTypeLabel(script.hook.type)}
                    </span>
                  </div>

                  <p className="text-lg font-bold text-purple-900 mb-4 p-3 bg-white rounded-md border-l-4 border-purple-600">
                    "{script.hook.text}"
                  </p>

                  <details className="mb-3">
                    <summary className="cursor-pointer text-sm font-semibold text-purple-700 hover:text-purple-900 mb-2">
                      📐 R×A×C×U^B Breakdown
                    </summary>
                    <div className="space-y-2 pl-4 text-sm border-l-2 border-purple-300">
                      <p><strong className="text-purple-700">R (Relevant):</strong> {script.hook.racub_breakdown.relevant}</p>
                      <p><strong className="text-purple-700">A (Awareness):</strong> {script.hook.racub_breakdown.awareness}</p>
                      <p><strong className="text-purple-700">C (Clarity):</strong> {script.hook.racub_breakdown.clarity}</p>
                      <p><strong className="text-purple-700">U (Unique):</strong> {script.hook.racub_breakdown.unique}</p>
                      <p><strong className="text-purple-700">B (Broadened):</strong> {script.hook.racub_breakdown.broadened}</p>
                    </div>
                  </details>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="bg-white px-3 py-1.5 rounded-md border border-purple-200">
                      <strong className="text-purple-700">Shadow Fear:</strong> {script.hook.shadowFear}
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-md border border-purple-200">
                      <strong className="text-purple-700">Power Words:</strong> {script.hook.powerWords.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-purple-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-purple-700 font-semibold">
                      ⬇️ Hook flows into 5-Line Method ⬇️
                    </span>
                  </div>
                </div>

                {/* Line 1: Context */}
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded">
                      LINE 1
                    </span>
                    <p className="text-xs font-semibold text-blue-600">
                      CONTEXT ({script.fiveLine.context.timestamp})
                    </p>
                  </div>
                  <p className="font-medium text-blue-900 mb-2">{script.fiveLine.context.script}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-blue-700"><strong>Visual:</strong> {script.fiveLine.context.visual}</p>
                    {script.fiveLine.context.ubuntuPrinciple && (
                      <p className="text-blue-600"><strong>Ubuntu:</strong> {script.fiveLine.context.ubuntuPrinciple}</p>
                    )}
                    {script.fiveLine.context.shadowFear && (
                      <p className="text-blue-600"><strong>Shadow Fear:</strong> {script.fiveLine.context.shadowFear}</p>
                    )}
                  </div>
                </div>

                {/* Line 2: Collision */}
                <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-600 bg-red-200 px-2 py-1 rounded">
                      LINE 2
                    </span>
                    <p className="text-xs font-semibold text-red-600">
                      COLLISION ({script.fiveLine.collision.timestamp})
                    </p>
                  </div>
                  <p className="font-medium text-red-900 mb-2">{script.fiveLine.collision.script}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-red-700"><strong>Visual:</strong> {script.fiveLine.collision.visual}</p>
                    {script.fiveLine.collision.systemVillain && (
                      <p className="text-red-600"><strong>System Villain:</strong> {script.fiveLine.collision.systemVillain}</p>
                    )}
                  </div>
                </div>

                {/* Line 3: Conversion */}
                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-600 bg-purple-200 px-2 py-1 rounded">
                      LINE 3
                    </span>
                    <p className="text-xs font-semibold text-purple-600">
                      CONVERSION ({script.fiveLine.conversion.timestamp}) - 80% Teaching
                    </p>
                  </div>
                  <p className="font-medium text-purple-900 mb-2">{script.fiveLine.conversion.script}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-purple-700"><strong>Visual:</strong> {script.fiveLine.conversion.visual}</p>
                    {script.fiveLine.conversion.framework && (
                      <p className="text-purple-600"><strong>Framework:</strong> {script.fiveLine.conversion.framework}</p>
                    )}
                  </div>
                </div>

                {/* Line 4: Calibration */}
                <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-200 px-2 py-1 rounded">
                      LINE 4
                    </span>
                    <p className="text-xs font-semibold text-orange-600">
                      CALIBRATION ({script.fiveLine.calibration.timestamp}) - 20% Proof
                    </p>
                  </div>
                  <p className="font-medium text-orange-900 mb-2">{script.fiveLine.calibration.script}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-orange-700"><strong>Visual:</strong> {script.fiveLine.calibration.visual}</p>
                    {script.fiveLine.calibration.storyUsed && (
                      <p className="text-orange-600"><strong>Story:</strong> {script.fiveLine.calibration.storyUsed}</p>
                    )}
                    {script.fiveLine.calibration.numbers && (
                      <p className="text-orange-600"><strong>Numbers:</strong> {script.fiveLine.calibration.numbers}</p>
                    )}
                  </div>
                </div>

                {/* Line 5: Community */}
                <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                      LINE 5
                    </span>
                    <p className="text-xs font-semibold text-green-600">
                      COMMUNITY ({script.fiveLine.community.timestamp}) - Ubuntu CTA
                    </p>
                  </div>
                  <p className="font-medium text-green-900 mb-2">{script.fiveLine.community.script}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-green-700"><strong>Visual:</strong> {script.fiveLine.community.visual}</p>
                    {script.fiveLine.community.collectiveAction && (
                      <p className="text-green-600"><strong>Collective Action:</strong> {script.fiveLine.community.collectiveAction}</p>
                    )}
                  </div>
                </div>

                {/* B-Roll Suggestions */}
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    B-ROLL SUGGESTIONS:
                  </p>
                  <ul className="text-sm space-y-1">
                    {script.bRoll.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Text Overlays */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    TEXT OVERLAYS:
                  </p>
                  <ul className="text-sm space-y-1">
                    {script.textOverlays.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Analysis Sections */}
                {(script.ubuntu_check || script.scripting_principles_check) && (
                  <div className="pt-6 border-t space-y-4">
                    <p className="text-sm font-bold text-gray-800 mb-3">📊 QUALITY ANALYSIS</p>

                    {/* Ubuntu Check */}
                    {script.ubuntu_check && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-xs font-semibold text-amber-600 mb-2">
                          Ubuntu Story Arc Validation
                        </p>
                        <div className="space-y-1 text-xs text-amber-700">
                          <p>{script.ubuntu_check.we_over_i}</p>
                          <p>{script.ubuntu_check.system_villain}</p>
                          <p>{script.ubuntu_check.collective_result}</p>
                        </div>
                      </div>
                    )}

                    {/* 4 Scripting Principles Check */}
                    {script.scripting_principles_check && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                        <p className="text-xs font-semibold text-emerald-600 mb-2">
                          4 Viral Scripting Principles
                        </p>
                        <div className="space-y-1 text-xs text-emerald-700">
                          <p>{script.scripting_principles_check.negativity}</p>
                          <p>{script.scripting_principles_check.you_format}</p>
                          <p>{script.scripting_principles_check.short_simple}</p>
                          <p>{script.scripting_principles_check.audible_flow}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No script generated yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Enter your content idea and click "Generate Complete Script" to create
                  a production-ready script using the NOCHILL 5-Line Method with Ubuntu Story Arc.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
