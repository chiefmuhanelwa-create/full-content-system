'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  FileText,
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Calendar,
  DollarSign,
  Save,
  MonitorPlay,
  Sparkles,
  Wand2,
  Share2,
  Mic,
  Library,
  Rocket,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NOCHILL v2.0
          </h1>
          <p className="text-gray-600 text-lg">Professional Content Creation System</p>
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Content Creation Hub</h2>
          <p className="text-gray-700">
            Transform your ideas into viral content with proven frameworks, storytelling techniques, and professional formulas.
            Everything you need to create, optimize, and scale your content is here.
          </p>
        </CardContent>
      </Card>

      {/* New Features Showcase */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">New Features</h2>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">v2.0</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/storytelling">
            <Card className="hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer h-full bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <Sparkles className="h-10 w-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Storytelling Studio</h3>
                <p className="text-sm text-gray-600 mb-3">
                  8 proven frameworks: Hero's Journey, BAB, PAS, and more
                </p>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/formulas">
            <Card className="hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer h-full bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <Wand2 className="h-10 w-10 text-cyan-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Content Formulas</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Talking head & YouTube formulas with delivery notes
                </p>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/adapter">
            <Card className="hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer h-full bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <Share2 className="h-10 w-10 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Content Adapter</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Transform content for LinkedIn, X, Facebook, Newsletter
                </p>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/voice">
            <Card className="hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer h-full bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-6">
                <Mic className="h-10 w-10 text-orange-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Voice Profile</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Define your unique voice for authentic content
                </p>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Core Creation Tools */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Core Creation Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/hooks">
            <Card className="hover:border-blue-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <Zap className="h-10 w-10 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Hook Generator</h3>
                <p className="text-sm text-gray-600">
                  R×A×C×U^B Formula for viral hooks
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/scripts">
            <Card className="hover:border-purple-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Script Writer</h3>
                <p className="text-sm text-gray-600">
                  10-Step Storytelling Framework
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/stories">
            <Card className="hover:border-green-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Story Extractor</h3>
                <p className="text-sm text-gray-600">
                  4-Criteria Test for powerful stories
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/fears">
            <Card className="hover:border-red-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <Brain className="h-10 w-10 text-red-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Fear Analyzer</h3>
                <p className="text-sm text-gray-600">
                  Target 10 Shadow Fears
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/pitch">
            <Card className="hover:border-orange-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <Target className="h-10 w-10 text-orange-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Pitch Builder</h3>
                <p className="text-sm text-gray-600">
                  5-Pillar Framework
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/vault">
            <Card className="hover:border-purple-600 hover:shadow-md transition-all cursor-pointer h-full border-2 border-purple-200">
              <CardContent className="p-6">
                <Library className="h-10 w-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Story Vault</h3>
                <p className="text-sm text-gray-600">
                  110+ Pre-built Content Ideas
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Production & Planning */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Production & Planning</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/teleprompter">
            <Card className="hover:border-cyan-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <MonitorPlay className="h-10 w-10 text-cyan-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Teleprompter</h3>
                <p className="text-sm text-gray-600">
                  Enhanced with timer, progress, shortcuts
                </p>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded mt-2">
                  ENHANCED
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/calendar">
            <Card className="hover:border-teal-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <Calendar className="h-10 w-10 text-teal-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Content Calendar</h3>
                <p className="text-sm text-gray-600">
                  4E Framework planning
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/library">
            <Card className="hover:border-blue-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <Save className="h-10 w-10 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Saved Library</h3>
                <p className="text-sm text-gray-600">
                  All your saved content
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/revenue">
            <Card className="hover:border-green-600 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <DollarSign className="h-10 w-10 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">Revenue Tracker</h3>
                <p className="text-sm text-gray-600">
                  PAIDS Streams tracking
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get started with your content creation workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Set Up Your Voice Profile</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Define your unique voice, cadence, and personality. This ensures all generated content sounds like YOU.
                </p>
                <Link href="/dashboard/voice">
                  <Button size="sm" variant="outline">
                    Create Voice Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Extract Your Proof Stories</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Use Story Extractor to pull out powerful stories from your journey. These become your credibility.
                </p>
                <Link href="/dashboard/stories">
                  <Button size="sm" variant="outline">
                    Extract Stories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Create Your First Content</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Choose a tool: Generate hooks, write full scripts with formulas, or craft stories. Then adapt for all platforms.
                </p>
                <div className="flex gap-2">
                  <Link href="/dashboard/hooks">
                    <Button size="sm" variant="outline">Hooks</Button>
                  </Link>
                  <Link href="/dashboard/formulas">
                    <Button size="sm" variant="outline">Formulas</Button>
                  </Link>
                  <Link href="/dashboard/storytelling">
                    <Button size="sm" variant="outline">Stories</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Record & Publish</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Use Teleprompter for smooth recording, then Content Adapter to repurpose for all platforms.
                </p>
                <div className="flex gap-2">
                  <Link href="/dashboard/teleprompter">
                    <Button size="sm" variant="outline">Teleprompter</Button>
                  </Link>
                  <Link href="/dashboard/adapter">
                    <Button size="sm" variant="outline">Adapter</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
