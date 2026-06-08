'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import StoryVaultBrowser from '@/components/StoryVaultBrowser'
import { Database, Lightbulb, BookOpen, Sparkles } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Database}
        iconColor="text-purple-600"
        eyebrow="Explore"
        title="Story & Content Vault"
        description="110+ content ideas and story variations mapped to Hook Science frameworks"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Pre-Built Content Ideas</div>
                    <div className="text-sm text-gray-700">
                      Browse 110+ content ideas across 7 categories, all mapped to Hook Types, PAIDS, 4E frameworks, and Shadow Fears
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Story Variations</div>
                    <div className="text-sm text-gray-700">
                      110+ personal story variations from origin stories to victories, ready to use as proof points
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">One-Click Integration</div>
                    <div className="text-sm text-gray-700">
                      Generate hooks, create scripts, or schedule to calendar directly from the vault
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Vault Browser */}
        <StoryVaultBrowser />

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use the Vault</CardTitle>
            <CardDescription>
              The vault feeds data TO existing tools WITHOUT changing their internal logic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Browse Categories & Themes
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Explore content ideas by category (Financial, Platform, Strategy, etc.) or browse story variations by theme (Origin, Turning Points, Victories, etc.)
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Filter by Hook Type & Shadow Fear
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Use filters to find content/stories that match specific Hook Types (Information Gap, Desired Result, etc.) or target specific Shadow Fears
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Search by Keyword
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Search across titles, descriptions, lessons, and keywords to quickly find relevant content
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                    Generate Hook
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Click "Generate Hook" to pre-fill the Hook Generator with the selected content idea or story. The Hook Generator processes it using R×A×C×U^B formula
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                    Create Script
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Click "Create Script" to pre-fill the Script Writer with structured data. It uses the 5-Line Method (Hook, Context, Calibration, Payoff, CTA) with your existing frameworks
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
                    Schedule or Copy
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Schedule content directly to your Content Calendar or copy to clipboard for use elsewhere
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="font-semibold text-sm mb-2 text-yellow-900">⚠️ Important: Framework Integrity</div>
              <p className="text-sm text-yellow-800">
                The vault is a <strong>data source only</strong>. It does NOT modify Hook Generator, Script Writer, Story Extractor, or any other tool's internal logic. All content/stories are mapped to your existing Hook Science (R×A×C×U^B), PAIDS, 4E, SEEDS, DARES, and Shadow Fear frameworks. The vault simply feeds pre-structured data TO these tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
