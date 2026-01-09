import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  FileText,
  BookOpen,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowRight,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function DashboardPage() {
  // Mock data - in production, fetch from database
  const stats = {
    hooksGenerated: 127,
    scriptsCreated: 43,
    storiesExtracted: 8,
    revenueThisMonth: 23400,
  }

  const recentHooks = [
    'Your family thinks you\'re wasting time, but you just made R8,333 this month',
    'I went from R750 to R8,333/month in 90 days doing this',
    'Stop creating content. Start creating cash flow.',
  ]

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hooks Generated</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hooksGenerated}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> this week
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
              <span className="text-green-600">+5</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proof Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storiesExtracted}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenueThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/hooks">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Zap className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Generate Hook</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/scripts">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Write Script</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/stories">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Extract Story</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/calendar">
            <Card className="hover:border-blue-600 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">Plan Calendar</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Hooks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Hooks</CardTitle>
            <CardDescription>Your latest generated hooks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHooks.map((hook, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{hook}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/hooks">
                <Button variant="outline" className="w-full">
                  View All Hooks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown (PAIDS)</CardTitle>
            <CardDescription>Your income streams this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Products (40%)</span>
                  <span className="text-sm">R9,360</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Info (25%)</span>
                  <span className="text-sm">R5,850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Ads (20%)</span>
                  <span className="text-sm">R4,680</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Deals (10%)</span>
                  <span className="text-sm">R2,340</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Services (5%)</span>
                  <span className="text-sm">R1,170</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
              <Link href="/dashboard/revenue">
                <Button variant="outline" className="w-full mt-4">
                  View Revenue Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
