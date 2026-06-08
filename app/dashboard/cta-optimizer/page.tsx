'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Copy, Sparkles } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

const CTA_LIBRARY = {
  engagement: [
    "Drop a 🔥 if you're doing this",
    "Comment 'YES' if this resonates",
    "Which one are YOU guilty of? Tell me below 👇",
    "Save this. You'll need it later.",
    "Share this with someone who needs to hear it"
  ],
  conversion: [
    "Link in bio to get started today",
    "DM me 'READY' to learn more",
    "Click the link below—let's fix this together",
    "Want this? Comment 'INFO' for details",
    "Join 10,000+ creators inside [product name]"
  ],
  community: [
    "We're building something different here. Join us.",
    "This is for us, not them. Let's rise together.",
    "Drop your biggest win this week below 👇",
    "Who else is tired of [problem]? Let's change it.",
    "The system wants us divided. We won't let them."
  ]
}

interface CTASuggestions {
  customCTAs: string[]
  testingAdvice: string
  platformSpecific: Record<string, string>
}

export default function CTAOptimizerPage() {
  const [contentContext, setContentContext] = useState('')
  const [goal, setGoal] = useState('engagement')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<CTASuggestions | null>(null)

  const handleGenerate = async () => {
    if (!contentContext.trim()) {
      alert('Please describe your content')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cta/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentContext, goal }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied!')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Target}
        iconColor="text-rose-600"
        eyebrow="Optimize"
        title="CTA Library & Optimizer"
        description="High-converting CTAs for every situation"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CTA Library */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>CTA Library</CardTitle>
            <CardDescription>Proven templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-2">Engagement CTAs</p>
                {CTA_LIBRARY.engagement.map((cta, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-blue-50 rounded mb-2 text-xs">
                    <span>{cta}</span>
                    <Button variant="ghost" size="sm" onClick={() => copy(cta)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Conversion CTAs</p>
                {CTA_LIBRARY.conversion.map((cta, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-green-50 rounded mb-2 text-xs">
                    <span>{cta}</span>
                    <Button variant="ghost" size="sm" onClick={() => copy(cta)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Community CTAs</p>
                {CTA_LIBRARY.community.map((cta, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg mb-2 text-xs">
                    <span>{cta}</span>
                    <Button variant="ghost" size="sm" onClick={() => copy(cta)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom CTA Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Custom CTA Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content Context</label>
                <textarea
                  className="w-full min-h-[120px] p-3 border rounded-lg mt-2"
                  value={contentContext}
                  onChange={(e) => setContentContext(e.target.value)}
                  placeholder="What's your content about?"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Goal</label>
                <select className="w-full p-2 border rounded-lg mt-2" value={goal} onChange={(e) => setGoal(e.target.value)}>
                  <option value="engagement">Engagement</option>
                  <option value="conversion">Conversion</option>
                  <option value="community">Community Building</option>
                </select>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Custom CTAs'}
              </Button>
            </CardContent>
          </Card>

          {suggestions && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Custom CTAs for Your Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.customCTAs.map((cta, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-rose-50 border border-rose-200 rounded-lg">
                        <span className="text-sm font-medium">{cta}</span>
                        <Button variant="ghost" size="sm" onClick={() => copy(cta)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform-Specific CTAs</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(suggestions.platformSpecific).map(([platform, cta]) => (
                    <div key={platform} className="mb-3 p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-lg">
                      <p className="font-display font-bold text-xs text-[#71717A] mb-1">{platform.toUpperCase()}</p>
                      <p className="text-sm">{cta}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>A/B Testing Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm p-3 bg-yellow-50 border border-yellow-200 rounded-lg">{suggestions.testingAdvice}</p>
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
