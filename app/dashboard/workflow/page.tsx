'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  FileText,
  Upload,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play
} from 'lucide-react'
import Link from 'next/link'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ContentItem {
  id: string
  title: string
  stage: 'planning' | 'ideation' | 'creation' | 'posting' | 'posted'
  createdAt: string
  updatedAt: string
  platform?: string
  notes?: string
  scriptId?: string
  hookId?: string
  scheduledDate?: string
  postedUrl?: string
}

export default function WorkflowPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [selectedStage, setSelectedStage] = useState<string>('all')

  // Load content items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('contentWorkflow')
    if (stored) {
      setContentItems(JSON.parse(stored))
    }
  }, [])

  // Save to localStorage
  const saveItems = (items: ContentItem[]) => {
    setContentItems(items)
    localStorage.setItem('contentWorkflow', JSON.stringify(items))
  }

  // Add new content item
  const addNewItem = () => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: 'New Content Idea',
      stage: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveItems([...contentItems, newItem])
  }

  // Move to next stage
  const moveToNextStage = (id: string) => {
    const stageFlow = ['planning', 'ideation', 'creation', 'posting', 'posted']
    const updated = contentItems.map(item => {
      if (item.id === id) {
        const currentIndex = stageFlow.indexOf(item.stage)
        const nextStage = stageFlow[Math.min(currentIndex + 1, stageFlow.length - 1)]
        return {
          ...item,
          stage: nextStage as ContentItem['stage'],
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })
    saveItems(updated)
  }

  // Delete item
  const deleteItem = (id: string) => {
    if (confirm('Delete this content item?')) {
      saveItems(contentItems.filter(item => item.id !== id))
    }
  }

  // Get stage counts
  const stageCounts = {
    all: contentItems.length,
    planning: contentItems.filter(i => i.stage === 'planning').length,
    ideation: contentItems.filter(i => i.stage === 'ideation').length,
    creation: contentItems.filter(i => i.stage === 'creation').length,
    posting: contentItems.filter(i => i.stage === 'posting').length,
    posted: contentItems.filter(i => i.stage === 'posted').length,
  }

  // Filter items
  const filteredItems = selectedStage === 'all'
    ? contentItems
    : contentItems.filter(i => i.stage === selectedStage)

  // Get stage color
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'ideation': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'creation': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'posting': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'posted': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // Get stage icon
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'planning': return <Clock className="h-4 w-4" />
      case 'ideation': return <Lightbulb className="h-4 w-4" />
      case 'creation': return <FileText className="h-4 w-4" />
      case 'posting': return <Upload className="h-4 w-4" />
      case 'posted': return <CheckCircle2 className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  // Get next action for stage
  const getNextAction = (stage: string) => {
    switch (stage) {
      case 'planning': return { label: 'Start Ideation', link: '/dashboard/vault' }
      case 'ideation': return { label: 'Create Hook', link: '/dashboard/hooks' }
      case 'creation': return { label: 'Write Script', link: '/dashboard/scripts' }
      case 'posting': return { label: 'Schedule Post', link: '/dashboard/calendar' }
      case 'posted': return { label: 'View Analytics', link: '/dashboard/analytics' }
      default: return { label: 'Continue', link: '/dashboard' }
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Play}
        iconColor="text-[#2563EB]"
        eyebrow="Track"
        title="Content Workflow Tracker"
        description="Track your content from idea to published post"
      >
        <Button onClick={addNewItem} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Content Item
        </Button>
      </ToolPageHeader>
      <div className="px-6 py-8">

      {/* Workflow Stages Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card
          className={`cursor-pointer transition-all ${selectedStage === 'planning' ? 'ring-2 ring-gray-400' : ''}`}
          onClick={() => setSelectedStage('planning')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-gray-600" />
              <Badge variant="secondary">{stageCounts.planning}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Planning</p>
            <p className="text-xs text-gray-500">Concept phase</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStage === 'ideation' ? 'ring-2 ring-yellow-400' : ''}`}
          onClick={() => setSelectedStage('ideation')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <Badge variant="secondary">{stageCounts.ideation}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Ideation</p>
            <p className="text-xs text-gray-500">Brainstorming</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStage === 'creation' ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setSelectedStage('creation')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">{stageCounts.creation}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Creation</p>
            <p className="text-xs text-gray-500">Writing & filming</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStage === 'posting' ? 'ring-2 ring-purple-400' : ''}`}
          onClick={() => setSelectedStage('posting')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Upload className="h-5 w-5 text-purple-600" />
              <Badge variant="secondary">{stageCounts.posting}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Ready to Post</p>
            <p className="text-xs text-gray-500">Ready for upload</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStage === 'posted' ? 'ring-2 ring-green-400' : ''}`}
          onClick={() => setSelectedStage('posted')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Badge variant="secondary">{stageCounts.posted}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Posted</p>
            <p className="text-xs text-gray-500">Live content</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={selectedStage === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('all')}
        >
          All ({stageCounts.all})
        </Button>
        <Button
          variant={selectedStage === 'planning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('planning')}
        >
          Planning ({stageCounts.planning})
        </Button>
        <Button
          variant={selectedStage === 'ideation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('ideation')}
        >
          Ideation ({stageCounts.ideation})
        </Button>
        <Button
          variant={selectedStage === 'creation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('creation')}
        >
          Creation ({stageCounts.creation})
        </Button>
        <Button
          variant={selectedStage === 'posting' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('posting')}
        >
          Ready to Post ({stageCounts.posting})
        </Button>
        <Button
          variant={selectedStage === 'posted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('posted')}
        >
          Posted ({stageCounts.posted})
        </Button>
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content items yet
              </h3>
              <p className="text-gray-500 text-center max-w-md text-sm mb-4">
                Start tracking your content creation process by adding your first item
              </p>
              <Button onClick={addNewItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map(item => {
            const nextAction = getNextAction(item.stage)
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge className={`${getStageColor(item.stage)} border`}>
                          {getStageIcon(item.stage)}
                          <span className="ml-1 capitalize">{item.stage}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Created {new Date(item.createdAt).toLocaleDateString()} •
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.stage !== 'posted' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveToNextStage(item.id)}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Move to Next Stage
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={nextAction.link}>
                              <Play className="h-4 w-4 mr-2" />
                              {nextAction.label}
                            </Link>
                          </Button>
                        </>
                      )}
                      {item.stage === 'posted' && item.postedUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.postedUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Post
                          </a>
                        </Button>
                      )}
                    </div>
                    {item.platform && (
                      <Badge variant="outline">{item.platform}</Badge>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                      {item.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 bg-blue-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">🎯 Quick Actions</CardTitle>
          <CardDescription>Jump to any part of your content creation process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-3 flex-col items-start" asChild>
              <Link href="/dashboard/vault">
                <Lightbulb className="h-5 w-5 mb-1 text-yellow-600" />
                <span className="font-semibold">Browse Ideas</span>
                <span className="text-xs text-gray-500">110+ content ideas</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col items-start" asChild>
              <Link href="/dashboard/hooks">
                <FileText className="h-5 w-5 mb-1 text-purple-600" />
                <span className="font-semibold">Generate Hook</span>
                <span className="text-xs text-gray-500">R×A×C×U^B formula</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col items-start" asChild>
              <Link href="/dashboard/scripts">
                <FileText className="h-5 w-5 mb-1 text-blue-600" />
                <span className="font-semibold">Write Script</span>
                <span className="text-xs text-gray-500">5-Line Method</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col items-start" asChild>
              <Link href="/dashboard/calendar">
                <Upload className="h-5 w-5 mb-1 text-green-600" />
                <span className="font-semibold">Schedule Post</span>
                <span className="text-xs text-gray-500">Content calendar</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
