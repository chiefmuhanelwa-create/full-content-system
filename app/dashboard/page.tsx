'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  FileText,
  LogOut,
  ArrowRight,
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default function DashboardPage() {
  // Mock data - in production, fetch from database
  const stats = {
    hooksGenerated: 0,
    scriptsCreated: 0,
  }

  const recentHooks = [
    'We\'ve all been told content creation is the path to freedom, but platform dependency is keeping you broke',
    'You think posting more will fix it, BUT the algorithm doesn\'t reward volume, THEREFORE you need a system',
    'Stop creating content. Start creating cash flow.',
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header with Sign Out */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to NOCHILL Viral Script Generator</p>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Stats Grid - Only Working Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hooks Generated</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hooksGenerated}</div>
            <p className="text-xs text-muted-foreground">
              R×A×C×U^B Hook Science
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scripts Created</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scriptsCreated}</div>
            <p className="text-xs text-muted-foreground">
              NOCHILL 5-Line Method
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Only Working Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/hooks">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Zap className="h-12 w-12 text-blue-600 mb-3" />
                <span className="font-medium text-lg mb-2">Hook Generator</span>
                <p className="text-sm text-gray-600 text-center">
                  Generate scroll-stopping hooks using R×A×C×U^B formula
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/scripts">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-blue-600 mb-3" />
                <span className="font-medium text-lg mb-2">Script Writer</span>
                <p className="text-sm text-gray-600 text-center">
                  Create viral scripts with NOCHILL 5-Line Method + Ubuntu Story Arc
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Feature Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Hooks Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Hook Science (R×A×C×U^B)</CardTitle>
            <CardDescription>Example hooks using the formula</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHooks.map((hook, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">{hook}</p>
                </div>
              ))}
              <Link href="/dashboard/hooks">
                <Button variant="default" className="w-full">
                  Generate Your Hooks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* NOCHILL 5-Line Method Info */}
        <Card>
          <CardHeader>
            <CardTitle>NOCHILL 5-Line Method</CardTitle>
            <CardDescription>Complete viral scripting framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-sm">Context (0-8s)</p>
                  <p className="text-xs text-gray-600">WE-focused hook with Ubuntu Story Arc</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-sm">Collision (8-18s)</p>
                  <p className="text-xs text-gray-600">Name the SYSTEM villain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-sm">Conversion (18-35s)</p>
                  <p className="text-xs text-gray-600">80% fresh teaching - frameworks & strategy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium text-sm">Calibration (35-48s)</p>
                  <p className="text-xs text-gray-600">20% proof story with numbers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                <div>
                  <p className="font-medium text-sm">Community (48-60s)</p>
                  <p className="text-xs text-gray-600">Collective action CTA</p>
                </div>
              </div>
              <Link href="/dashboard/scripts">
                <Button variant="default" className="w-full mt-4">
                  Create Viral Script
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-8 border-dashed">
        <CardContent className="py-6">
          <p className="text-center text-gray-600">
            <span className="font-semibold">Coming Soon:</span> Story Extractor, Fear Analyzer, Pitch Builder, Content Calendar, Revenue Tracker
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
