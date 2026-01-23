'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Trash2, Edit, Copy, Download, Eye, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface SavedScript {
  id: string
  title: string
  mode: 'content' | 'sales'
  productName?: string
  platform?: string
  createdAt: string
  script: any
}

export default function SavedScriptsPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState<SavedScript[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('savedScripts')
    if (stored) {
      setScripts(JSON.parse(stored))
    }
  }, [])

  const deleteScript = (id: string) => {
    if (confirm('Delete this script?')) {
      const updated = scripts.filter(s => s.id !== id)
      setScripts(updated)
      localStorage.setItem('savedScripts', JSON.stringify(updated))
    }
  }

  const loadScript = (script: SavedScript) => {
    localStorage.setItem('loadScript', JSON.stringify(script))
    router.push('/dashboard/scripts')
  }

  const copyScript = (script: SavedScript) => {
    const fullScript = JSON.stringify(script.script, null, 2)
    navigator.clipboard.writeText(fullScript)
  }

  const filteredScripts = scripts.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Saved Scripts
        </h1>
        <p className="text-gray-600">
          Your library of generated scripts - {scripts.length} saved
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="grid gap-4">
        {filteredScripts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No saved scripts yet
              </h3>
              <p className="text-gray-500 text-center max-w-md text-sm mb-4">
                Generate scripts in the Script Writer and they'll be automatically saved here
              </p>
              <Button asChild>
                <a href="/dashboard/scripts">Go to Script Writer</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredScripts.map(script => (
            <Card key={script.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{script.title}</CardTitle>
                      <Badge variant={script.mode === 'sales' ? 'default' : 'secondary'}>
                        {script.mode === 'sales' ? '💰 Sales' : '📚 Content'}
                      </Badge>
                      {script.platform && (
                        <Badge variant="outline">{script.platform}</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {script.productName && <span>Product: {script.productName} • </span>}
                      Created {new Date(script.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => loadScript(script)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Script
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyScript(script)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteScript(script.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
