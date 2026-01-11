'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ContentEntry {
  id: string
  date: string
  title: string
  category: '40% Educate' | '30% Entertain' | '20% Encourage' | '10% Earn'
  platform: string
  notes: string
}

export default function ContentCalendarPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<ContentEntry>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    category: '40% Educate',
    platform: 'Instagram',
    notes: '',
  })

  const addEntry = () => {
    if (!newEntry.title?.trim()) return

    const entry: ContentEntry = {
      id: Date.now().toString(),
      date: newEntry.date!,
      title: newEntry.title!,
      category: newEntry.category as ContentEntry['category'],
      platform: newEntry.platform!,
      notes: newEntry.notes!,
    }

    setEntries([...entries, entry])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      title: '',
      category: '40% Educate',
      platform: 'Instagram',
      notes: '',
    })
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '40% Educate':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case '30% Entertain':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case '20% Encourage':
        return 'bg-green-100 text-green-700 border-green-200'
      case '10% Earn':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStats = () => {
    const total = entries.length
    const educate = entries.filter((e) => e.category === '40% Educate').length
    const entertain = entries.filter((e) => e.category === '30% Entertain').length
    const encourage = entries.filter((e) => e.category === '20% Encourage').length
    const earn = entries.filter((e) => e.category === '10% Earn').length

    return {
      total,
      educate: total > 0 ? Math.round((educate / total) * 100) : 0,
      entertain: total > 0 ? Math.round((entertain / total) * 100) : 0,
      encourage: total > 0 ? Math.round((encourage / total) * 100) : 0,
      earn: total > 0 ? Math.round((earn / total) * 100) : 0,
    }
  }

  const stats = getStats()

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-green-600" />
          Content Calendar
        </h1>
        <p className="text-gray-600">
          Plan your content using the 4E framework: 40% Educate, 30% Entertain, 20% Encourage, 10% Earn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Educate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.educate}%</p>
            <p className="text-xs text-gray-500">Target: 40%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Entertain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.entertain}%</p>
            <p className="text-xs text-gray-500">Target: 30%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Encourage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.encourage}%</p>
            <p className="text-xs text-gray-500">Target: 20%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Earn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.earn}%</p>
            <p className="text-xs text-gray-500">Target: 10%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Content</CardTitle>
            <CardDescription>Schedule new content using the 4E framework</CardDescription>
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
              <Label htmlFor="title">Content Title</Label>
              <Input
                id="title"
                placeholder="e.g., How to price your first brand deal"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">4E Category</Label>
              <Select
                value={newEntry.category}
                onValueChange={(value) =>
                  setNewEntry({ ...newEntry, category: value as ContentEntry['category'] })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="40% Educate">40% Educate (Teach frameworks)</SelectItem>
                  <SelectItem value="30% Entertain">30% Entertain (Stories & humor)</SelectItem>
                  <SelectItem value="20% Encourage">20% Encourage (Motivation)</SelectItem>
                  <SelectItem value="10% Earn">10% Earn (Monetization)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={newEntry.platform}
                onValueChange={(value) => setNewEntry({ ...newEntry, platform: value })}
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes, hook ideas, or script outlines..."
                rows={3}
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              />
            </div>

            <Button onClick={addEntry} disabled={!newEntry.title?.trim()} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Content ({entries.length})</CardTitle>
              <CardDescription>Your content schedule</CardDescription>
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
                          <p className="font-medium text-sm">{entry.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
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

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-1 rounded border ${getCategoryColor(
                            entry.category
                          )}`}
                        >
                          {entry.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {entry.platform}
                        </span>
                      </div>

                      {entry.notes && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No content scheduled yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Add your first content entry to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4E Framework Guide */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">4E Content Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">40%</span>
                <p className="text-blue-700">
                  <strong>Educate:</strong> Teach frameworks, strategies, systems
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-600">30%</span>
                <p className="text-purple-700">
                  <strong>Entertain:</strong> Stories, humor, relatable content
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-600">20%</span>
                <p className="text-green-700">
                  <strong>Encourage:</strong> Motivation, inspiration, possibility
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-orange-600">10%</span>
                <p className="text-orange-700">
                  <strong>Earn:</strong> Monetization, offers, CTAs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
