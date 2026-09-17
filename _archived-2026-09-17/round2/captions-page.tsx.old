'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Hash, Copy, Sparkles, Check, MonitorPlay } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface CaptionResult {
  caption: string
  hashtags: string[]
  altCaption: string
  captionWithHashtags: string
  strategy: string
}

export default function CaptionsPage() {
  const router = useRouter()
  const [script, setScript] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [icp, setIcp] = useState('auto')
  const [tone, setTone] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CaptionResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  // Load from localStorage if Script Writer passed content
  useState(() => {
    if (typeof window !== 'undefined') {
      const preload = localStorage.getItem('captionScriptPreload')
      if (preload) {
        setScript(preload)
        localStorage.removeItem('captionScriptPreload')
      }
    }
  })

  const generate = async () => {
    if (!script.trim()) {
      setError('Paste your script or content idea first')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/captions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, platform, icp, tone }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }
      const data = await res.json()
      setResult(data)
      // Save to teleprompter panel storage
      if (data.caption && data.hashtags) {
        localStorage.setItem('teleprompterCaption', JSON.stringify({ caption: data.caption, hashtags: data.hashtags }))
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <Button
      size="sm"
      variant="outline"
      onClick={() => copy(text, id)}
      className={copied === id ? 'bg-green-50 border-green-400 text-green-700' : ''}
    >
      {copied === id ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
      {copied === id ? 'Copied!' : 'Copy'}
    </Button>
  )

  return (
    <div className="min-h-full bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Hash}
        iconColor="text-orange-500"
        iconBg="bg-orange-500/10"
        eyebrow="Create"
        title="Caption + Hashtag Generator"
        description="Platform-optimised captions with NOCHILL voice. R×A×C×U^B hook in the first line. Hashtag strategy included."
      />

      <div className="px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Input */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Content</CardTitle>
                <CardDescription>Paste your script, key points, or content idea. AI extracts the hook and builds the caption.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="script">Script or Content Idea *</Label>
                  <Textarea
                    id="script"
                    placeholder="Paste your script here, or describe what the content is about..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={8}
                    className="resize-none font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram (2200 chars, 30 hashtags)</SelectItem>
                      <SelectItem value="tiktok">TikTok (minimal hashtags, hook-first)</SelectItem>
                      <SelectItem value="youtube">YouTube (short description, no hashtags)</SelectItem>
                      <SelectItem value="linkedin">LinkedIn (professional, 3–5 hashtags)</SelectItem>
                      <SelectItem value="facebook">Facebook (1–3 hashtags, conversational)</SelectItem>
                      <SelectItem value="twitter">Twitter/X (280 chars, 1–2 hashtags)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icp">Target Audience</Label>
                  <Select value={icp} onValueChange={setIcp}>
                    <SelectTrigger id="icp">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect from content</SelectItem>
                      <SelectItem value="icp1">ICP 1 — Called Expert (32–50, SA professional)</SelectItem>
                      <SelectItem value="icp2">ICP 2 — Content Creator (18–35, posting but not earning)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Caption Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (match Ndivhuwo voice)</SelectItem>
                      <SelectItem value="raw">Raw + confrontational</SelectItem>
                      <SelectItem value="story">Story-led + vulnerable</SelectItem>
                      <SelectItem value="educational">Educational + framework</SelectItem>
                      <SelectItem value="hype">Hype + celebration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button onClick={generate} disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating caption...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Caption + Hashtags
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {!result && !loading && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-gray-400">
                  <Hash className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Caption will appear here</p>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="border-2 border-orange-200 bg-orange-50/50">
                <CardContent className="py-8 text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-orange-500 animate-pulse" />
                  <p className="text-sm text-orange-700 font-medium">Building caption with R×A×C×U^B hook...</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* Strategy */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <span className="font-semibold">Strategy: </span>{result.strategy}
                </div>

                {/* Main Caption */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Main Caption</CardTitle>
                      <CopyBtn text={result.caption} id="caption" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-gray-50 p-3 rounded-lg border">
                      {result.caption}
                    </pre>
                  </CardContent>
                </Card>

                {/* Alt Caption */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Short Version</CardTitle>
                      <CopyBtn text={result.altCaption} id="altCaption" />
                    </div>
                    <CardDescription>Punchy hook-only version for stories or reposts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-gray-50 p-3 rounded-lg border">
                      {result.altCaption}
                    </pre>
                  </CardContent>
                </Card>

                {/* Hashtags */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Hashtags ({result.hashtags?.length || 0})</CardTitle>
                      <CopyBtn
                        text={result.hashtags?.map((h: string) => `#${h}`).join(' ') || ''}
                        id="hashtags"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags?.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="inline-block bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer hover:bg-orange-200"
                          onClick={() => copy(`#${tag}`, `tag-${i}`)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ready-to-post */}
                <Card className="border-2 border-green-300 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base text-green-800">Ready to Post</CardTitle>
                      <div className="flex gap-2">
                        <CopyBtn text={result.captionWithHashtags} id="full" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push('/dashboard/teleprompter')}
                          className="bg-cyan-50 border-cyan-400 text-cyan-800"
                        >
                          <MonitorPlay className="h-3.5 w-3.5 mr-1" />
                          Open Teleprompter
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-green-700">Caption + hashtags — copy and paste directly. Caption panel auto-loaded in Teleprompter.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-white p-3 rounded-lg border border-green-200 max-h-[300px] overflow-y-auto">
                      {result.captionWithHashtags}
                    </pre>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
