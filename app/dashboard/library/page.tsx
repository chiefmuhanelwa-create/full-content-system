'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, Zap, FileText, BookOpen, Trash2, Eye, Download, Search, Filter } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface SavedHook {
  id: string
  content: string
  type: string
  platform: string
  createdAt: string
}

interface SavedScript {
  id: string
  title: string
  hook: string
  fullScript?: string
  content?: string
  platform?: string
  duration?: string
  createdAt: string
}

interface SavedStory {
  id: string
  title: string
  content: string
  metrics: {
    before: string
    after: string
    timeframe: string
  }
  createdAt: string
}

export default function LibraryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'hooks' | 'scripts' | 'stories'>('scripts')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')

  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([])
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([])
  const [savedStories, setSavedStories] = useState<SavedStory[]>([])

  // Load saved content from localStorage
  useEffect(() => {
    loadSavedContent()
  }, [])

  const loadSavedContent = () => {
    // Load hooks
    const hooksData = localStorage.getItem('savedHooks')
    if (hooksData) {
      try {
        setSavedHooks(JSON.parse(hooksData))
      } catch (error) {
        console.error('Error loading hooks:', error)
      }
    }

    // Load scripts
    const scriptsData = localStorage.getItem('savedScripts')
    if (scriptsData) {
      try {
        setSavedScripts(JSON.parse(scriptsData))
      } catch (error) {
        console.error('Error loading scripts:', error)
      }
    }

    // Load stories
    const storiesData = localStorage.getItem('savedStories')
    if (storiesData) {
      try {
        setSavedStories(JSON.parse(storiesData))
      } catch (error) {
        console.error('Error loading stories:', error)
      }
    }
  }

  const deleteHook = (id: string) => {
    if (confirm('Delete this hook?')) {
      const updated = savedHooks.filter(h => h.id !== id)
      setSavedHooks(updated)
      localStorage.setItem('savedHooks', JSON.stringify(updated))
    }
  }

  const deleteScript = (id: string) => {
    if (confirm('Delete this script?')) {
      const updated = savedScripts.filter(s => s.id !== id)
      setSavedScripts(updated)
      localStorage.setItem('savedScripts', JSON.stringify(updated))
    }
  }

  const deleteStory = (id: string) => {
    if (confirm('Delete this story?')) {
      const updated = savedStories.filter(s => s.id !== id)
      setSavedStories(updated)
      localStorage.setItem('savedStories', JSON.stringify(updated))
    }
  }

  const viewScript = (script: SavedScript) => {
    localStorage.setItem('loadScript', JSON.stringify({
      script: script,
      title: script.title,
      mode: 'content'
    }))
    router.push('/dashboard/scripts')
  }

  const openTeleprompter = (script: SavedScript) => {
    const teleprompterData = {
      title: script.title,
      fullScript: script.fullScript || script.content || script.hook || '',
      content: script.fullScript || script.content || script.hook || '',
      hook: script.hook
    }
    localStorage.setItem('teleprompterScript', JSON.stringify(teleprompterData))
    router.push('/dashboard/teleprompter')
  }

  const exportScriptToPDF = (script: SavedScript) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const scriptContent = script.fullScript || script.content || script.hook || 'No script content available'
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${script.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
              color: #2d3748;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
              color: white;
              border-radius: 15px;
            }
            .framework-badge {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin-bottom: 30px;
              border-radius: 5px;
            }
            .framework-title {
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Arial, sans-serif;
              font-size: 13px;
              line-height: 1.6;
              background: #f7fafc;
              padding: 30px;
              border-radius: 10px;
              border: 2px solid #e2e8f0;
            }
            @media print {
              body { padding: 20px; }
              pre { font-size: 11px; padding: 20px; }
              .header { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎬 ${script.title}</h1>
            <p>${script.platform || 'Platform'} • ${script.duration || 'Duration'}</p>
            <p>Generated: ${new Date(script.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="framework-badge">
            <div class="framework-title">THE 10-STEP STORYTELLING FRAMEWORK</div>
            <div style="font-size: 11px; color: #1e40af;">
              1. Call Out → 2. Demand Attention → 3. Back Up Problem → 4. Create Intrigue → 5. Floodlight →
              6. Provide Solution → 7. Show Credentials → 8. Detail Benefits → 9. Social Proof → 10. Godfather Offer
            </div>
          </div>
          <pre>${scriptContent}</pre>
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

  // Filter content based on search and platform
  const filteredScripts = savedScripts.filter(script => {
    const fullScriptText = script.fullScript || script.content || ''
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fullScriptText.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || script.platform?.toLowerCase() === filterPlatform.toLowerCase()
    return matchesSearch && matchesPlatform
  })

  const filteredHooks = savedHooks.filter(hook => {
    const matchesSearch = hook.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || hook.platform.toLowerCase() === filterPlatform.toLowerCase()
    return matchesSearch && matchesPlatform
  })

  const filteredStories = savedStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={Save}
        iconColor="text-blue-500"
        eyebrow="Library"
        title="Saved Library"
        description="All your saved hooks, scripts, and stories in one place"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saved Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{savedScripts.length}</p>
            <p className="text-xs text-gray-500 mt-1">Production ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saved Hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{savedHooks.length}</p>
            <p className="text-xs text-gray-500 mt-1">Attention grabbers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saved Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{savedStories.length}</p>
            <p className="text-xs text-gray-500 mt-1">Proof stories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your saved content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'scripts' ? 'default' : 'outline'}
          onClick={() => setActiveTab('scripts')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Scripts ({filteredScripts.length})
        </Button>
        <Button
          variant={activeTab === 'hooks' ? 'default' : 'outline'}
          onClick={() => setActiveTab('hooks')}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Hooks ({filteredHooks.length})
        </Button>
        <Button
          variant={activeTab === 'stories' ? 'default' : 'outline'}
          onClick={() => setActiveTab('stories')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Stories ({filteredStories.length})
        </Button>
      </div>

      {/* Content Display */}
      <div className="space-y-4">
        {activeTab === 'scripts' && (
          filteredScripts.length > 0 ? (
            filteredScripts.map((script) => (
              <Card key={script.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{script.title}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{script.platform}</Badge>
                        <Badge variant="outline">{script.duration}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(script.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Hook:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{script.hook}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => viewScript(script)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openTeleprompter(script)} className="bg-green-50">
                      <FileText className="mr-2 h-4 w-4" />
                      Teleprompter
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportScriptToPDF(script)}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteScript(script.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">No saved scripts found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'Start creating scripts to build your library'}
                </p>
              </CardContent>
            </Card>
          )
        )}

        {activeTab === 'hooks' && (
          filteredHooks.length > 0 ? (
            filteredHooks.map((hook) => (
              <Card key={hook.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base mb-2">{hook.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-purple-50">{hook.type}</Badge>
                        <Badge variant="outline">{hook.platform}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(hook.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteHook(hook.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Zap className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">No saved hooks found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'Generate hooks to build your library'}
                </p>
              </CardContent>
            </Card>
          )
        )}

        {activeTab === 'stories' && (
          filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{story.content}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="font-semibold">Before:</span> {story.metrics.before}
                        </div>
                        <div>
                          <span className="font-semibold">After:</span> {story.metrics.after}
                        </div>
                        <div>
                          <span className="font-semibold">Time:</span> {story.metrics.timeframe}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteStory(story.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">No saved stories found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'Extract stories to build your library'}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
      </div>
    </div>
  )
}
