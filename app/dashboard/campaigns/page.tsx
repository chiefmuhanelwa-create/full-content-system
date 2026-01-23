'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Rocket, Calendar as CalendarIcon, Target, TrendingUp, Copy, CheckCircle, Download } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  audienceLevel: string
}

interface CampaignDay {
  day: number
  date: string
  phase: string
  content: {
    platform: string
    type: string
    theme: string
    cta: string
    focus: string
  }[]
}

export default function CampaignsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [campaignDuration, setCampaignDuration] = useState('14')
  const [launchDate, setLaunchDate] = useState(new Date().toISOString().split('T')[0])
  const [campaign, setCampaign] = useState<CampaignDay[]>([])
  const [copySuccess, setCopySuccess] = useState(false)

  // Load products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products')
    if (stored) {
      setProducts(JSON.parse(stored))
    }
  }, [])

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const generateCampaign = () => {
    if (!selectedProduct) {
      alert('Please select a product first')
      return
    }

    const duration = parseInt(campaignDuration)
    const start = new Date(launchDate)
    const days: CampaignDay[] = []

    // 14-Day Campaign Structure (can be adapted for 7 or 30 days)
    const campaignStructure = [
      // PHASE 1: AWARENESS (Days 1-4)
      {
        phase: 'Awareness',
        content: [
          {
            platform: 'Instagram Reel',
            type: 'Hook + Problem',
            theme: 'Call out audience pain',
            cta: 'Save this',
            focus: 'Problem identification - make them feel seen',
          },
          {
            platform: 'Twitter Thread',
            type: 'Story + Struggle',
            theme: 'Your journey through their problem',
            cta: 'Follow for more',
            focus: 'Build authority through vulnerability',
          },
        ],
      },
      {
        phase: 'Awareness',
        content: [
          {
            platform: 'TikTok',
            type: 'Myth-busting',
            theme: 'What they believe vs. reality',
            cta: 'Comment if relatable',
            focus: 'Challenge false beliefs keeping them stuck',
          },
          {
            platform: 'Email',
            type: 'Value delivery',
            theme: 'Free mini-training',
            cta: 'Hit reply with questions',
            focus: 'Build trust through immediate value',
          },
        ],
      },
      {
        phase: 'Awareness',
        content: [
          {
            platform: 'Instagram Carousel',
            type: 'Framework preview',
            theme: 'The system you teach (teaser)',
            cta: 'Share with someone who needs this',
            focus: 'Introduce your unique method',
          },
          {
            platform: 'LinkedIn Post',
            type: 'Case study teaser',
            theme: 'Before/after transformation',
            cta: 'Comment "HOW"',
            focus: 'Social proof - show it works',
          },
        ],
      },
      {
        phase: 'Awareness',
        content: [
          {
            platform: 'YouTube Short',
            type: 'Shadow fear targeting',
            theme: 'What keeps them up at night',
            cta: 'Subscribe for solution',
            focus: 'Emotional connection to pain',
          },
          {
            platform: 'Instagram Story',
            type: 'Poll + Engage',
            theme: 'Ask about their struggle',
            cta: 'DM me your answer',
            focus: 'Audience research + engagement',
          },
        ],
      },

      // PHASE 2: CONSIDERATION (Days 5-9)
      {
        phase: 'Consideration',
        content: [
          {
            platform: 'Instagram Reel',
            type: 'Framework deep-dive',
            theme: 'Your unique system explained',
            cta: 'Something coming soon...',
            focus: 'Introduce complete solution',
          },
          {
            platform: 'Email',
            type: 'Origin story',
            theme: 'Why you created this product',
            cta: 'Reply if this resonates',
            focus: 'Mission + purpose connection',
          },
        ],
      },
      {
        phase: 'Consideration',
        content: [
          {
            platform: 'TikTok',
            type: 'Objection handling',
            theme: '"But what if I..."',
            cta: 'Stay tuned for announcement',
            focus: 'Remove doubts preemptively',
          },
          {
            platform: 'Twitter Thread',
            type: 'Behind-the-scenes',
            theme: 'Creating the solution',
            cta: 'RT if you want this',
            focus: 'Build anticipation',
          },
        ],
      },
      {
        phase: 'Consideration',
        content: [
          {
            platform: 'Instagram Post',
            type: 'Social proof compilation',
            theme: 'Testimonials + results',
            cta: 'This could be you',
            focus: 'FOMO - others are succeeding',
          },
          {
            platform: 'LinkedIn Article',
            type: 'Authority piece',
            theme: 'Industry insight',
            cta: 'Big announcement tomorrow',
            focus: 'Position as thought leader',
          },
        ],
      },
      {
        phase: 'Consideration',
        content: [
          {
            platform: 'YouTube Short',
            type: 'Value stack preview',
            theme: 'What you\'ll get',
            cta: 'Links dropping soon',
            focus: 'Excitement building',
          },
          {
            platform: 'Instagram Story',
            type: 'Countdown',
            theme: '24 hours until launch',
            cta: 'Turn on notifications',
            focus: 'Create urgency',
          },
        ],
      },
      {
        phase: 'Consideration',
        content: [
          {
            platform: 'Email',
            type: 'Pre-launch warning',
            theme: 'Doors open tomorrow',
            cta: 'Set reminder',
            focus: 'Final anticipation build',
          },
          {
            platform: 'Twitter',
            type: 'Teaser',
            theme: 'Sneak peek',
            cta: 'Tomorrow at 9 AM',
            focus: 'Maintain interest',
          },
        ],
      },

      // PHASE 3: CONVERSION (Days 10-12)
      {
        phase: 'Conversion',
        content: [
          {
            platform: 'Instagram Reel',
            type: '🚨 LAUNCH',
            theme: 'Full offer reveal',
            cta: 'Link in bio NOW',
            focus: 'Godfather offer presentation',
          },
          {
            platform: 'Email',
            type: '🚨 LAUNCH EMAIL',
            theme: 'Full sales letter',
            cta: 'Get instant access',
            focus: 'Complete 10-step framework',
          },
          {
            platform: 'Twitter',
            type: 'Launch announcement',
            theme: 'It\'s live',
            cta: 'Grab yours',
            focus: 'Social momentum',
          },
        ],
      },
      {
        phase: 'Conversion',
        content: [
          {
            platform: 'TikTok',
            type: 'FAQ',
            theme: 'Common questions answered',
            cta: 'Link in bio',
            focus: 'Remove buying friction',
          },
          {
            platform: 'Instagram Story',
            type: 'Walkthrough',
            theme: 'Inside look at product',
            cta: 'Swipe up',
            focus: 'Show what they get',
          },
          {
            platform: 'LinkedIn',
            type: 'Professional case',
            theme: 'Why this matters',
            cta: 'Invest in yourself',
            focus: 'Logic + emotion',
          },
        ],
      },
      {
        phase: 'Conversion',
        content: [
          {
            platform: 'Email',
            type: 'Early wins',
            theme: 'People already seeing results',
            cta: 'Don\'t miss out',
            focus: 'Social proof + FOMO',
          },
          {
            platform: 'Instagram Reel',
            type: 'Objection crusher',
            theme: 'Final doubts handled',
            cta: 'Last chance',
            focus: 'Remove final barriers',
          },
        ],
      },

      // PHASE 4: URGENCY (Days 13-14)
      {
        phase: 'Urgency',
        content: [
          {
            platform: 'Email',
            type: '⏰ 48 HOURS',
            theme: 'Doors closing soon',
            cta: 'Act now',
            focus: 'Scarcity emphasis',
          },
          {
            platform: 'Instagram Story',
            type: 'Countdown',
            theme: '48 hours left',
            cta: 'Don\'t regret this',
            focus: 'Visual urgency',
          },
          {
            platform: 'Twitter',
            type: 'Last call',
            theme: 'Bonuses being removed',
            cta: 'Final hours',
            focus: 'Loss aversion',
          },
        ],
      },
      {
        phase: 'Urgency',
        content: [
          {
            platform: 'Email',
            type: '🚨 FINAL CALL',
            theme: 'Last 24 hours',
            cta: 'This is it',
            focus: 'Maximum urgency',
          },
          {
            platform: 'Instagram Reel',
            type: 'Closing message',
            theme: 'Why you created this',
            cta: 'Join us',
            focus: 'Emotional close',
          },
          {
            platform: 'Instagram Story',
            type: 'Final countdown',
            theme: 'Doors closing at midnight',
            cta: 'Last chance',
            focus: 'Deadline enforcement',
          },
        ],
      },
    ]

    // Generate campaign based on duration
    const phaseMultiplier = duration === 7 ? 0.5 : duration === 30 ? 2 : 1
    const selectedDays = duration === 7 ? [0, 2, 4, 6, 8, 10, 12] :
                         duration === 30 ? Array.from({ length: 30 }, (_, i) => Math.floor(i / 2)) :
                         Array.from({ length: 14 }, (_, i) => i)

    selectedDays.forEach((structureIndex, index) => {
      const dayDate = new Date(start)
      dayDate.setDate(dayDate.getDate() + index)

      const structureDay = campaignStructure[structureIndex % campaignStructure.length]

      days.push({
        day: index + 1,
        date: dayDate.toISOString().split('T')[0],
        phase: structureDay.phase,
        content: structureDay.content,
      })
    })

    setCampaign(days)
  }

  const exportCampaign = () => {
    if (campaign.length === 0) return

    const exportText = `
🚀 ${selectedProduct?.name} LAUNCH CAMPAIGN
${campaignDuration}-Day Product Launch Plan

Product: ${selectedProduct?.name} (R${selectedProduct?.price})
Launch Date: ${launchDate}
Duration: ${campaignDuration} days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${campaign.map((day) => `
📅 DAY ${day.day} - ${day.date}
Phase: ${day.phase}

${day.content.map((c, i) => `
${i + 1}. ${c.platform}
   Type: ${c.type}
   Theme: ${c.theme}
   Focus: ${c.focus}
   CTA: "${c.cta}"
`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`).join('\n')}

💡 CAMPAIGN SUCCESS TIPS:

1. Pre-create content for Days 1-5 before launch
2. Batch content creation by platform
3. Use scheduling tools (Buffer, Later)
4. Track engagement daily
5. Adjust messaging based on feedback
6. Prepare customer service for Day 10 spike
7. Have backup content for low-performing posts

You understand? Because you understand.
This is for your children's children.
`.trim()

    navigator.clipboard.writeText(exportText)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const exportCampaignToPDF = () => {
    if (campaign.length === 0) return

    const exportText = `
🚀 ${selectedProduct?.name} LAUNCH CAMPAIGN
${campaignDuration}-Day Product Launch Plan

Product: ${selectedProduct?.name} (R${selectedProduct?.price})
Launch Date: ${launchDate}
Duration: ${campaignDuration} days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${campaign.map((day) => `
📅 DAY ${day.day} - ${day.date}
Phase: ${day.phase}

${day.content.map((c, i) => `
${i + 1}. ${c.platform}
   Type: ${c.type}
   Theme: ${c.theme}
   Focus: ${c.focus}
   CTA: "${c.cta}"
`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`).join('\n')}

💡 CAMPAIGN SUCCESS TIPS:

1. Pre-create content for Days 1-5 before launch
2. Batch content creation by platform
3. Use scheduling tools (Buffer, Later)
4. Track engagement daily
5. Adjust messaging based on feedback
6. Prepare customer service for Day 10 spike
7. Have backup content for low-performing posts

You understand? Because you understand.
This is for your children's children.
`.trim()

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${selectedProduct?.name} - ${campaignDuration}-Day Launch Campaign</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              line-height: 1.8;
              max-width: 900px;
              margin: 0 auto;
              color: #2d3748;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              color: white;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.95;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Courier New', monospace;
              font-size: 11px;
              background: #f7fafc;
              padding: 30px;
              border-radius: 10px;
              border: 2px solid #e2e8f0;
            }
            .footer {
              margin-top: 40px;
              padding: 20px;
              background: #f7fafc;
              border-left: 4px solid #764ba2;
              border-radius: 5px;
            }
            @media print {
              body { padding: 20px; }
              pre { font-size: 10px; padding: 20px; }
              .header { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 PRODUCT LAUNCH CAMPAIGN</h1>
            <p>${selectedProduct?.name}</p>
            <p>${campaignDuration}-Day Strategic Launch Plan</p>
            <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          <pre>${exportText}</pre>
          <div class="footer">
            <h3 style="margin-top: 0; color: #2d3748;">📋 Campaign Execution Checklist:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>Week Before Launch:</strong> Batch create all awareness content</li>
              <li><strong>Launch Day:</strong> Execute Phase 1 (Awareness) content</li>
              <li><strong>Mid Campaign:</strong> Monitor engagement, adjust strategy</li>
              <li><strong>Final Days:</strong> Ramp up urgency and scarcity</li>
              <li><strong>Post-Launch:</strong> Analyze results, collect testimonials</li>
            </ul>
            <h3 style="margin-top: 20px; color: #2d3748;">🎯 Key Success Metrics:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Track engagement rate by phase</li>
              <li>Monitor conversion rates daily</li>
              <li>Measure email open/click rates</li>
              <li>Count DMs and inquiries</li>
              <li>Record total revenue generated</li>
            </ul>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #718096;">
              Created with NOCHILL Business Operating System
            </p>
          </div>
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Awareness':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Consideration':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Conversion':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Urgency':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Rocket className="h-8 w-8 text-orange-600" />
          Campaign Planner
        </h1>
        <p className="text-gray-600">
          Plan your product launch with a proven 14-day campaign structure
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Setup</CardTitle>
              <CardDescription>Configure your product launch campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Product to Launch</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No products found
                      </SelectItem>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (R{product.price})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Campaign Duration */}
              <div>
                <label className="text-sm font-medium mb-2 block">Campaign Duration</label>
                <Select value={campaignDuration} onValueChange={setCampaignDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days (Quick Launch)</SelectItem>
                    <SelectItem value="14">14 Days (Recommended)</SelectItem>
                    <SelectItem value="30">30 Days (Extended)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Launch Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Launch Date (Day 1)</label>
                <input
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateCampaign}
                disabled={!selectedProduct}
                className="w-full"
                size="lg"
              >
                <Target className="mr-2 h-5 w-5" />
                Generate Campaign Plan
              </Button>

              {/* Export Buttons */}
              {campaign.length > 0 && (
                <div className="space-y-2">
                  <Button
                    onClick={exportCampaign}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copySuccess ? 'Copied!' : 'Export Campaign'}
                  </Button>
                  <Button
                    onClick={exportCampaignToPDF}
                    variant="outline"
                    className="w-full bg-green-50 hover:bg-green-100 border-green-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Phases Overview */}
          {campaign.length > 0 && (
            <Card className="bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="text-sm">Campaign Phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">Awareness</Badge>
                  <span className="text-xs">Identify problem, build trust</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-600">Consideration</Badge>
                  <span className="text-xs">Show solution, create desire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Conversion</Badge>
                  <span className="text-xs">Launch offer, drive sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-600">Urgency</Badge>
                  <span className="text-xs">Create FOMO, final push</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Campaign Timeline */}
        <div className="lg:col-span-2">
          {campaign.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your {campaignDuration}-Day Campaign</h2>
                <Badge className="bg-orange-600 text-lg px-4 py-2">
                  {selectedProduct?.name}
                </Badge>
              </div>

              {campaign.map((day) => (
                <Card key={day.day} className={`border-2 ${getPhaseColor(day.phase)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          Day {day.day} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <Badge className={getPhaseColor(day.phase)}>{day.phase} Phase</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.content.map((content, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {content.platform}
                                </Badge>
                                <span className="text-xs font-semibold text-gray-700">
                                  {content.type}
                                </span>
                              </div>
                              <p className="font-semibold text-sm mb-1">{content.theme}</p>
                              <p className="text-xs text-gray-600 mb-2">{content.focus}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-blue-600">CTA:</span>
                                <span className="text-xs italic">"{content.cta}"</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Campaign Success Tips */}
              <Card className="bg-amber-50 border-amber-300">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Campaign Success Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>✅ <strong>Pre-create content</strong> for Days 1-5 before launch</p>
                  <p>✅ <strong>Batch by platform</strong> - all TikToks on one day, etc.</p>
                  <p>✅ <strong>Schedule ahead</strong> using Buffer or Later</p>
                  <p>✅ <strong>Track daily</strong> - adjust messaging based on engagement</p>
                  <p>✅ <strong>Prepare support</strong> - Day 10 will spike questions</p>
                  <p>✅ <strong>Have backup content</strong> ready for low performers</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Rocket className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No campaign generated yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Select a product, choose duration, set launch date, and generate your campaign plan
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
