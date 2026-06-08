'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, Zap, FileText, BookOpen, Trash2, Eye, Download, Search, Filter, Loader2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import { useDatabase } from '@/hooks/useDatabase'

export default function LibraryPage() {
  const router = useRouter()
  const { listHooks, deleteHook: deleteHookDb, listScripts, deleteScript: deleteScriptDb } = useDatabase()

  const [activeTab, setActiveTab] = useState<'scripts' | 'hooks' | 'stories'>('scripts')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')

  const [savedHooks, setSavedHooks] = useState<any[]>([])
  const [savedScripts, setSavedScripts] = useState<any[]>([])
  const [savedStories, setSavedStories] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoadingData(true)
    try {
      const [hooks, scripts, storiesRes] = await Promise.all([
        listHooks(),
        listScripts(),
        fetch('/api/story-bank/list').then(r => r.json()),
      ])
      setSavedHooks(hooks || [])
      setSavedScripts(scripts || [])
      setSavedStories(storiesRes.storyBankEntries || storiesRes.stories || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  const deleteHook = async (id: string) => {
    await deleteHookDb(id)
    setSavedHooks(prev => prev.filter(h => h.id !== id))
  }

  const deleteScript = async (id: string) => {
    await deleteScriptDb(id)
    setSavedScripts(prev => prev.filter(s => s.id !== id))
  }

  const openTeleprompter = (script: any) => {
    const content = script.content || script.fullScript || script.hook || ''
    localStorage.setItem('teleprompterScript', JSON.stringify({
      title: script.title,
      fullScript: content,
      content,
      hook: script.hook,
    }))
    router.push('/dashboard/teleprompter')
  }

  const exportScriptToPDF = (script: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const scriptContent = script.content || script.fullScript || script.hook || 'No script content'
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${script.title}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;line-height:1.8;max-width:800px;margin:0 auto;color:#2d3748}
      h1{font-size:22px;margin-bottom:8px}pre{white-space:pre-wrap;word-wrap:break-word;font-family:Arial,sans-serif;
      font-size:13px;line-height:1.6;background:#f7fafc;padding:24px;border-radius:8px;border:1px solid #e2e8f0}
      @media print{pre{font-size:11px;padding:16px}}</style></head>
      <body><h1>${script.title}</h1><p style="color:#6b7280;margin-bottom:24px">${script.platform || ''} · ${new Date(script.createdAt).toLocaleDateString()}</p>
      <pre>${scriptContent}</pre><script>window.onload=function(){window.print();setTimeout(()=>window.close(),100)}<\/script></body></html>`)
    printWindow.document.close()
  }

  const filteredScripts = savedScripts.filter(s => {
    const text = (s.title + ' ' + (s.content || s.fullScript || '')).toLowerCase()
    const matchSearch = !searchQuery || text.includes(searchQuery.toLowerCase())
    const matchPlatform = filterPlatform === 'all' || (s.platform || '').toLowerCase() === filterPlatform
    return matchSearch && matchPlatform
  })

  const filteredHooks = savedHooks.filter(h => {
    const text = (h.content || h.hook || '').toLowerCase()
    const matchSearch = !searchQuery || text.includes(searchQuery.toLowerCase())
    const matchPlatform = filterPlatform === 'all' || (h.platform || '').toLowerCase() === filterPlatform
    return matchSearch && matchPlatform
  })

  const filteredStories = savedStories.filter(s => {
    const text = (s.title + ' ' + (s.snippet || s.fullVersion || '')).toLowerCase()
    return !searchQuery || text.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Save}
        iconColor="text-blue-500"
        eyebrow="Library"
        title="Saved Library"
        description="All your saved hooks, scripts, and stories — synced to your account"
      />
      <div className="px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Scripts', count: savedScripts.length, color: 'text-blue-600' },
            { label: 'Hooks', count: savedHooks.length, color: 'text-purple-600' },
            { label: 'Stories', count: savedStories.length, color: 'text-emerald-600' },
          ].map(({ label, count, color }) => (
            <Card key={label}>
              <CardContent className="pt-5 pb-4">
                <p className={`text-3xl font-bold ${color}`}>{loadingData ? '—' : count}</p>
                <p className="text-xs text-gray-500 mt-1">{label} saved</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-44">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E4E4E7] rounded-xl p-1 mb-6 w-fit">
          {([
            { key: 'scripts', label: 'Scripts', icon: FileText, count: filteredScripts.length },
            { key: 'hooks', label: 'Hooks', icon: Zap, count: filteredHooks.length },
            { key: 'stories', label: 'Story Bank', icon: BookOpen, count: filteredStories.length },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-display font-bold transition-all ${
                activeTab === key ? 'bg-[#2563EB] text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loadingData && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
          </div>
        )}

        {/* Scripts */}
        {!loadingData && activeTab === 'scripts' && (
          <div className="space-y-4">
            {filteredScripts.length === 0 ? (
              <Card><CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No scripts saved yet</p>
                <p className="text-gray-400 text-sm mt-1">Generate a script and click Save to Library</p>
                <Button onClick={() => router.push('/dashboard/scripts')} className="mt-4" variant="outline">Go to Script Writer</Button>
              </CardContent></Card>
            ) : filteredScripts.map(script => (
              <Card key={script.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base mb-2">{script.title}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {script.platform && <Badge variant="outline">{script.platform}</Badge>}
                        {script.goal && <Badge variant="outline">{script.goal}</Badge>}
                        <span className="text-xs text-gray-400">{new Date(script.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteScript(script.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {script.content && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{script.content.slice(0, 200)}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openTeleprompter(script)}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Teleprompter
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportScriptToPDF(script)}>
                      <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Hooks */}
        {!loadingData && activeTab === 'hooks' && (
          <div className="space-y-3">
            {filteredHooks.length === 0 ? (
              <Card><CardContent className="flex flex-col items-center justify-center py-16">
                <Zap className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No hooks saved yet</p>
                <p className="text-gray-400 text-sm mt-1">Generate hooks and save them to your bank</p>
                <Button onClick={() => router.push('/dashboard/hooks')} className="mt-4" variant="outline">Go to Hook Generator</Button>
              </CardContent></Card>
            ) : filteredHooks.map(hook => (
              <Card key={hook.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-relaxed">{hook.content}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {hook.hookType && <Badge variant="outline" className="bg-purple-50 text-[10px]">{hook.hookType}</Badge>}
                        {hook.platform && <Badge variant="outline" className="text-[10px]">{hook.platform}</Badge>}
                        <span className="text-[10px] text-gray-400">{new Date(hook.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteHook(hook.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stories */}
        {!loadingData && activeTab === 'stories' && (
          <div className="space-y-3">
            {filteredStories.length === 0 ? (
              <Card><CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No stories saved yet</p>
                <p className="text-gray-400 text-sm mt-1">Extract stories and bank them for reuse</p>
                <Button onClick={() => router.push('/dashboard/stories')} className="mt-4" variant="outline">Go to Story Extractor</Button>
              </CardContent></Card>
            ) : filteredStories.map(story => (
              <Card key={story.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <p className="font-semibold text-sm text-gray-800 mb-1">{story.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-2">{story.snippet || story.fullVersion}</p>
                  {(story.beforeState || story.afterState) && (
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      {story.beforeState && <span><b>Before:</b> {story.beforeState}</span>}
                      {story.afterState && <span><b>After:</b> {story.afterState}</span>}
                      {story.timeframe && <span><b>Time:</b> {story.timeframe}</span>}
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 mt-1 block">{new Date(story.createdAt).toLocaleDateString()}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
