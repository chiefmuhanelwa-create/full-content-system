'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Plus, Trash2, TrendingUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface RevenueEntry {
  id: string
  date: string
  amount: number
  stream: 'Products' | 'Ads/Affiliates' | 'Information' | 'Deals' | 'Services'
  description: string
}

export default function RevenueTrackerPage() {
  const [entries, setEntries] = useState<RevenueEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<RevenueEntry>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    stream: 'Products',
    description: '',
  })

  const addEntry = () => {
    if (!newEntry.amount || newEntry.amount <= 0) return

    const entry: RevenueEntry = {
      id: Date.now().toString(),
      date: newEntry.date!,
      amount: newEntry.amount!,
      stream: newEntry.stream as RevenueEntry['stream'],
      description: newEntry.description!,
    }

    setEntries([...entries, entry])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      stream: 'Products',
      description: '',
    })
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const getStreamColor = (stream: string) => {
    switch (stream) {
      case 'Products':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Ads/Affiliates':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Information':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Deals':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Services':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStats = () => {
    const total = entries.reduce((sum, e) => sum + e.amount, 0)
    const products = entries.filter((e) => e.stream === 'Products').reduce((sum, e) => sum + e.amount, 0)
    const ads = entries.filter((e) => e.stream === 'Ads/Affiliates').reduce((sum, e) => sum + e.amount, 0)
    const info = entries.filter((e) => e.stream === 'Information').reduce((sum, e) => sum + e.amount, 0)
    const deals = entries.filter((e) => e.stream === 'Deals').reduce((sum, e) => sum + e.amount, 0)
    const services = entries.filter((e) => e.stream === 'Services').reduce((sum, e) => sum + e.amount, 0)

    return {
      total,
      products: { amount: products, percentage: total > 0 ? Math.round((products / total) * 100) : 0 },
      ads: { amount: ads, percentage: total > 0 ? Math.round((ads / total) * 100) : 0 },
      info: { amount: info, percentage: total > 0 ? Math.round((info / total) * 100) : 0 },
      deals: { amount: deals, percentage: total > 0 ? Math.round((deals / total) * 100) : 0 },
      services: { amount: services, percentage: total > 0 ? Math.round((services / total) * 100) : 0 },
    }
  }

  const stats = getStats()

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={DollarSign}
        iconColor="text-green-600"
        eyebrow="Track"
        title="Revenue Tracker"
        description="Track your income using the PAIDS framework: Products, Ads, Information, Deals, Services"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Total Revenue */}
      <Card className="mb-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-green-600">{formatCurrency(stats.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{entries.length} transactions</p>
            </div>
            <TrendingUp className="h-16 w-16 text-green-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* PAIDS Breakdown */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.products.amount)}</p>
            <p className="text-xs text-gray-500">{stats.products.percentage}% of total</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${stats.products.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Ads/Affiliates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.ads.amount)}</p>
            <p className="text-xs text-gray-500">{stats.ads.percentage}% of total</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-purple-600 h-1.5 rounded-full"
                style={{ width: `${stats.ads.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-green-600">{formatCurrency(stats.info.amount)}</p>
            <p className="text-xs text-gray-500">{stats.info.percentage}% of total</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-green-600 h-1.5 rounded-full"
                style={{ width: `${stats.info.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.deals.amount)}</p>
            <p className="text-xs text-gray-500">{stats.deals.percentage}% of total</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-orange-600 h-1.5 rounded-full"
                style={{ width: `${stats.deals.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-red-600">{formatCurrency(stats.services.amount)}</p>
            <p className="text-xs text-gray-500">{stats.services.percentage}% of total</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-red-600 h-1.5 rounded-full"
                style={{ width: `${stats.services.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Revenue</CardTitle>
            <CardDescription>Record new income entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (R)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="8333"
                value={newEntry.amount || ''}
                onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stream">PAIDS Stream</Label>
              <Select
                value={newEntry.stream}
                onValueChange={(value) =>
                  setNewEntry({ ...newEntry, stream: value as RevenueEntry['stream'] })
                }
              >
                <SelectTrigger id="stream">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Products">Products (Physical/Digital)</SelectItem>
                  <SelectItem value="Ads/Affiliates">Ads/Affiliates (Sponsored)</SelectItem>
                  <SelectItem value="Information">Information (Courses/Coaching)</SelectItem>
                  <SelectItem value="Deals">Deals (Brand Partnerships)</SelectItem>
                  <SelectItem value="Services">Services (Done-for-you)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Brand deal with XYZ, Course sale, etc."
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
            </div>

            <Button
              onClick={addEntry}
              disabled={!newEntry.amount || newEntry.amount <= 0}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Revenue Entry
            </Button>
          </CardContent>
        </Card>

        {/* Revenue List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions ({entries.length})</CardTitle>
              <CardDescription>Your revenue history</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedEntries.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sortedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-green-600">
                            {formatCurrency(entry.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded border ${getStreamColor(
                            entry.stream
                          )}`}
                        >
                          {entry.stream}
                        </span>
                      </div>

                      {entry.description && (
                        <p className="text-sm text-gray-600">{entry.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No revenue tracked yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Add your first revenue entry to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PAIDS Framework Guide */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-sm">PAIDS Revenue Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">P</span>
                <p className="text-blue-700">
                  <strong>Products:</strong> Physical/digital products you sell
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-600">A</span>
                <p className="text-purple-700">
                  <strong>Ads/Affiliates:</strong> Sponsored content, commissions
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-600">I</span>
                <p className="text-green-700">
                  <strong>Information:</strong> Courses, coaching, consulting
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-orange-600">D</span>
                <p className="text-orange-700">
                  <strong>Deals:</strong> Brand partnerships, speaking gigs
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-red-600">S</span>
                <p className="text-red-700">
                  <strong>Services:</strong> Done-for-you, freelancing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
