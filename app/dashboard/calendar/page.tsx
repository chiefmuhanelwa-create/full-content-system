'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Plus, Trash2, Zap, FileText, BookOpen, Brain, Target, ChevronLeft, ChevronRight, List, Download, Edit, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { useContent } from '@/contexts/ContentContext'

interface ContentEntry {
  id: string
  date: string
  title: string
  category: '35% Educate' | '30% Entertain' | '20% Encourage' | '15% Earn'
  platform: string
  notes: string
}

export default function ContentCalendarPage() {
  const { calendarEntries, addToCalendar, updateCalendar, removeFromCalendar, setPendingAction } = useContent()
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newEntry, setNewEntry] = useState<Partial<ContentEntry>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    category: '35% Educate',
    platform: 'Instagram',
    notes: '',
  })

  const addEntry = () => {
    if (!newEntry.title?.trim()) return

    addToCalendar({
      date: newEntry.date!,
      title: newEntry.title!,
      category: newEntry.category as ContentEntry['category'],
      platform: newEntry.platform!,
      notes: newEntry.notes!,
      sourceTools: ['Calendar'], // Manually added
    })

    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      title: '',
      category: '35% Educate',
      platform: 'Instagram',
      notes: '',
    })
  }

  const deleteEntry = (id: string) => {
    if (confirm('Delete this calendar entry?')) {
      removeFromCalendar(id)
    }
  }

  const startEditing = (entry: ContentEntry) => {
    setEditingId(entry.id)
    setNewEntry({
      date: entry.date,
      title: entry.title,
      category: entry.category,
      platform: entry.platform,
      notes: entry.notes,
    })
  }

  const saveEdit = () => {
    if (!editingId || !newEntry.title?.trim()) return

    updateCalendar(editingId, {
      date: newEntry.date!,
      title: newEntry.title!,
      category: newEntry.category as ContentEntry['category'],
      platform: newEntry.platform!,
      notes: newEntry.notes!,
    })

    setEditingId(null)
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      title: '',
      category: '35% Educate',
      platform: 'Instagram',
      notes: '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      title: '',
      category: '35% Educate',
      platform: 'Instagram',
      notes: '',
    })
  }

  const generateHooksFromEntry = (entry: ContentEntry) => {
    setPendingAction({
      action: 'generate-hooks-from-calendar',
      data: entry
    })
    router.push('/dashboard/hooks')
  }

  const generateScriptFromEntry = (entry: ContentEntry) => {
    setPendingAction({
      action: 'generate-script-from-calendar',
      data: entry
    })
    router.push('/dashboard/scripts')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '35% Educate':
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          border: 'border-blue-600',
          lightBg: 'bg-blue-100',
          lightText: 'text-blue-700',
          lightBorder: 'border-blue-200'
        }
      case '30% Entertain':
        return {
          bg: 'bg-purple-500',
          text: 'text-white',
          border: 'border-purple-600',
          lightBg: 'bg-purple-100',
          lightText: 'text-purple-700',
          lightBorder: 'border-purple-200'
        }
      case '20% Encourage':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          border: 'border-green-600',
          lightBg: 'bg-green-100',
          lightText: 'text-green-700',
          lightBorder: 'border-green-200'
        }
      case '15% Earn':
        return {
          bg: 'bg-orange-500',
          text: 'text-white',
          border: 'border-orange-600',
          lightBg: 'bg-orange-100',
          lightText: 'text-orange-700',
          lightBorder: 'border-orange-200'
        }
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          border: 'border-gray-600',
          lightBg: 'bg-gray-100',
          lightText: 'text-gray-700',
          lightBorder: 'border-gray-200'
        }
    }
  }

  const getSourceToolIcon = (tools: string[]) => {
    if (tools.includes('Hook Generator')) return <Zap className="h-3 w-3" />
    if (tools.includes('Script Writer')) return <FileText className="h-3 w-3" />
    if (tools.includes('Story Extractor')) return <BookOpen className="h-3 w-3" />
    if (tools.includes('Fear Analyzer')) return <Brain className="h-3 w-3" />
    if (tools.includes('Pitch Builder')) return <Target className="h-3 w-3" />
    return <CalendarIcon className="h-3 w-3" />
  }

  const getStats = () => {
    const total = calendarEntries.length
    const educate = calendarEntries.filter((e) => e.category === '35% Educate').length
    const entertain = calendarEntries.filter((e) => e.category === '30% Entertain').length
    const encourage = calendarEntries.filter((e) => e.category === '20% Encourage').length
    const earn = calendarEntries.filter((e) => e.category === '15% Earn').length

    return {
      total,
      educate: total > 0 ? Math.round((educate / total) * 100) : 0,
      entertain: total > 0 ? Math.round((entertain / total) * 100) : 0,
      encourage: total > 0 ? Math.round((encourage / total) * 100) : 0,
      earn: total > 0 ? Math.round((earn / total) * 100) : 0,
    }
  }

  const stats = getStats()

  // Export Calendar to PDF
  const exportCalendarToPDF = () => {
    const sortedEntries = [...calendarEntries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const pdfContent = `
═══════════════════════════════════════════════════════════
📅 CONTENT CALENDAR EXPORT
═══════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Total Scheduled Content: ${calendarEntries.length} items

═══════════════════════════════════════════════════════════
📊 4E FRAMEWORK BREAKDOWN
═══════════════════════════════════════════════════════════

The 4E Content Evolution Framework ensures balanced content mix:

📘 35% EDUCATE (Target: ${stats.educate}% Actual)
   → Teach frameworks, strategies, systems
   → Build authority and trust
   → Current: ${calendarEntries.filter(e => e.category === '35% Educate').length} pieces

🎭 30% ENTERTAIN (Target: ${stats.entertain}% Actual)
   → Stories, humor, relatable struggles
   → Increase engagement and shares
   → Current: ${calendarEntries.filter(e => e.category === '30% Entertain').length} pieces

💪 20% ENCOURAGE (Target: ${stats.encourage}% Actual)
   → Motivation, inspiration, possibility
   → Build community and loyalty
   → Current: ${calendarEntries.filter(e => e.category === '20% Encourage').length} pieces

💰 15% EARN (Target: ${stats.earn}% Actual)
   → Monetization, offers, CTAs
   → Drive revenue and conversions
   → Current: ${calendarEntries.filter(e => e.category === '15% Earn').length} pieces

═══════════════════════════════════════════════════════════
📅 COMPLETE CONTENT SCHEDULE
═══════════════════════════════════════════════════════════

${sortedEntries.length === 0 ? 'No content scheduled yet.' : sortedEntries.map((entry, index) => `
──────────────────────────────────────────────────────────
${index + 1}. ${entry.title}
──────────────────────────────────────────────────────────

📅 Date: ${new Date(entry.date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

📁 Category: ${entry.category}
   ${entry.category === '35% Educate' ? '→ Teaching & Educational Content' :
     entry.category === '30% Entertain' ? '→ Entertainment & Storytelling' :
     entry.category === '20% Encourage' ? '→ Motivational & Inspirational' :
     '→ Monetization & Sales Content'}

📱 Platform: ${entry.platform}

${entry.notes ? `📝 Notes:
${entry.notes}
` : ''}
${entry.sourceTools && entry.sourceTools.length > 0 ? `🛠️ Created With: ${entry.sourceTools.join(', ')}
` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════
💡 4E FRAMEWORK BEST PRACTICES
═══════════════════════════════════════════════════════════

✅ IDEAL CONTENT MIX:
   • 35% Educational content (frameworks, how-tos, strategies)
   • 30% Entertainment (stories, behind-the-scenes, relatable moments)
   • 20% Encouragement (motivation, wins, community building)
   • 15% Monetization (offers, products, calls-to-action)

✅ POSTING CONSISTENCY:
   • Maintain regular schedule across platforms
   • Balance content types throughout the week
   • Avoid clustering too much of one category

✅ PLATFORM OPTIMIZATION:
   • Instagram: Visual storytelling + educational carousels
   • TikTok: Quick tips + entertaining hooks
   • YouTube: Deep-dive education + story-driven content
   • LinkedIn: Professional insights + thought leadership
   • Twitter/X: Threads + quick wins

✅ ENGAGEMENT TRIGGERS:
   • Educate: "Save this for later", "Tag someone who needs this"
   • Entertain: "Share if this is you", reactions and comments
   • Encourage: "Drop a 🔥 if you're ready", community building
   • Earn: "Link in bio", "Limited spots", clear CTA

═══════════════════════════════════════════════════════════
📈 CALENDAR MANAGEMENT TIPS
═══════════════════════════════════════════════════════════

1. BATCH CREATE CONTENT
   → Plan 2-4 weeks ahead
   → Create content in batches by type
   → Schedule during your most creative hours

2. TRACK PERFORMANCE
   → Note which content types perform best
   → Double down on what works
   → Adjust 4E mix based on goals

3. STAY FLEXIBLE
   → Leave room for trending topics
   → Allow spontaneous content
   → Adapt to audience feedback

4. REUSE & REPURPOSE
   → One core idea = multiple formats
   → Cross-post across platforms
   → Update and reshare top performers

═══════════════════════════════════════════════════════════
END OF CALENDAR EXPORT
═══════════════════════════════════════════════════════════

Generated by NOCHILL Content Creation System
Built for sustainable content creation and business growth
`.trim()

    // Create printable PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Content Calendar - ${new Date().toLocaleDateString()}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 40px;
              line-height: 1.8;
              max-width: 900px;
              margin: 0 auto;
              color: #2d3748;
            }
            h1 {
              color: #2b6cb0;
              border-bottom: 3px solid #2b6cb0;
              padding-bottom: 10px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Courier New', monospace;
              font-size: 11px;
            }
            @media print {
              body { padding: 20px; font-size: 10px; }
              pre { font-size: 9px; }
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: white; border: none;">📅 Content Calendar</h1>
            <p style="margin: 0;">NOCHILL Content Creation System</p>
          </div>
          <pre>${pdfContent}</pre>
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

  // Calendar grid functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return calendarEntries.filter(entry => entry.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const entries = getEntriesForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isToday ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-50'
          } cursor-pointer transition-colors`}
          onClick={() => {
            setSelectedDate(date)
            setNewEntry({ ...newEntry, date: date.toISOString().split('T')[0] })
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {entries.length > 0 && (
              <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                {entries.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {entries.slice(0, 3).map(entry => {
              const colors = getCategoryColor(entry.category)
              return (
                <div
                  key={entry.id}
                  className={`text-xs p-1.5 rounded ${colors.bg} ${colors.text} truncate group relative`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDate(date)
                  }}
                >
                  <div className="truncate">{entry.title}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteEntry(entry.id)
                    }}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </Button>
                </div>
              )
            })}
            {entries.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{entries.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  // Sort entries by date
  const sortedEntries = [...calendarEntries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              Content Calendar
            </h1>
            <p className="text-gray-600">
              Plan your content using the 4E Engine: 30% Entertain, 35% Educate, 20% Encourage, 15% Earn
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={exportCalendarToPDF}
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-300"
              disabled={calendarEntries.length === 0}
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
              {viewMode === 'grid' ? 'List View' : 'Calendar View'}
            </Button>
          </div>
        </div>
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
            <p className="text-xs text-gray-500">Target: 35%</p>
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
            <p className="text-xs text-gray-500">Target: 15%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add/Edit Content Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Content' : 'Add Content'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update your calendar entry' : 'Schedule new content to your calendar'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Content title or topic"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (4E Framework)</Label>
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
                  <SelectItem value="35% Educate">35% Educate</SelectItem>
                  <SelectItem value="30% Entertain">30% Entertain</SelectItem>
                  <SelectItem value="20% Encourage">20% Encourage</SelectItem>
                  <SelectItem value="15% Earn">15% Earn</SelectItem>
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

            {editingId ? (
              <div className="flex gap-2">
                <Button onClick={saveEdit} disabled={!newEntry.title?.trim()} className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={addEntry} disabled={!newEntry.title?.trim()} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-4">
          {viewMode === 'grid' ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <CardDescription>{calendarEntries.length} items scheduled</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0 border-t border-l">
                  {renderCalendarGrid()}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Color Legend:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-xs">Educate (35%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-xs">Entertain (30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs">Encourage (20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-xs">Earn (15%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Content ({calendarEntries.length})</CardTitle>
                <CardDescription>Your content schedule</CardDescription>
              </CardHeader>
              <CardContent>
                {sortedEntries.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {sortedEntries.map((entry) => {
                      const colors = getCategoryColor(entry.category)
                      return (
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
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(entry)}
                                title="Edit entry"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEntry(entry.id)}
                                title="Delete entry"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded border ${colors.lightBg} ${colors.lightText} ${colors.lightBorder}`}
                            >
                              {entry.category}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {entry.platform}
                            </span>
                            {entry.sourceTools && entry.sourceTools.length > 0 && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                {getSourceToolIcon(entry.sourceTools)}
                                {entry.sourceTools.join(', ')}
                              </span>
                            )}
                          </div>

                          {entry.notes && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{entry.notes}</p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateHooksFromEntry(entry)}
                              className="flex-1 text-xs bg-purple-50 hover:bg-purple-100 border-purple-300"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Generate Hooks
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateScriptFromEntry(entry)}
                              className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 border-blue-300"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Generate Script
                            </Button>
                          </div>
                        </div>
                      )
                    })}
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
          )}

          {/* 4E Framework Guide */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg">4E Content Framework</CardTitle>
              <CardDescription>Balance your content for maximum engagement and revenue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  35%
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Educate</p>
                  <p className="text-sm text-blue-700">
                    Teach frameworks, strategies, and tactics your audience can implement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  30%
                </div>
                <div>
                  <p className="font-semibold text-purple-900">Entertain</p>
                  <p className="text-sm text-purple-700">
                    Share stories, behind-the-scenes, and relatable experiences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  20%
                </div>
                <div>
                  <p className="font-semibold text-green-900">Encourage</p>
                  <p className="text-sm text-green-700">
                    Motivate, inspire, and show what's possible for your community
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  15%
                </div>
                <div>
                  <p className="font-semibold text-orange-900">Earn</p>
                  <p className="text-sm text-orange-700">
                    Promote products, services, and monetization opportunities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
