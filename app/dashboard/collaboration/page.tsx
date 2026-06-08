'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ContentItem {
  id: string
  title: string
  type: string
  status: 'draft' | 'review' | 'approved' | 'rejected'
  author: string
  createdAt: string
  comments: Array<{ author: string; text: string; timestamp: string }>
}

export default function CollaborationPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('collaborationContent')
    if (saved) setContentItems(JSON.parse(saved))
  }, [])

  const updateStatus = (id: string, status: ContentItem['status']) => {
    const updated = contentItems.map(item =>
      item.id === id ? { ...item, status } : item
    )
    setContentItems(updated)
    localStorage.setItem('collaborationContent', JSON.stringify(updated))
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status })
    }
  }

  const addComment = () => {
    if (!selectedItem || !newComment.trim()) return

    const updatedItem = {
      ...selectedItem,
      comments: [
        ...selectedItem.comments,
        {
          author: 'You',
          text: newComment,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    const updated = contentItems.map(item =>
      item.id === selectedItem.id ? updatedItem : item
    )

    setContentItems(updated)
    setSelectedItem(updatedItem)
    localStorage.setItem('collaborationContent', JSON.stringify(updated))
    setNewComment('')
  }

  const addNewContent = () => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: 'New Content Draft',
      type: 'Script',
      status: 'draft',
      author: 'You',
      createdAt: new Date().toISOString(),
      comments: [],
    }
    const updated = [newItem, ...contentItems]
    setContentItems(updated)
    localStorage.setItem('collaborationContent', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Users}
        iconColor="text-emerald-600"
        eyebrow="Manage"
        title="Collaboration Hub"
        description="Team workflow & content approval system"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Queue</CardTitle>
            <Button onClick={addNewContent} size="sm" className="mt-2">+ New Content</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contentItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedItem?.id === item.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm">{item.title}</p>
                    {item.status === 'draft' && <Clock className="h-4 w-4 text-gray-400" />}
                    {item.status === 'review' && <Clock className="h-4 w-4 text-orange-500" />}
                    {item.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {item.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                  </div>
                  <p className="text-xs text-gray-600">{item.type} • {item.author}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                    item.status === 'draft' ? 'bg-gray-200' :
                    item.status === 'review' ? 'bg-orange-200' :
                    item.status === 'approved' ? 'bg-green-200' : 'bg-red-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Detail & Comments */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItem ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedItem.title}</CardTitle>
                  <CardDescription>
                    {selectedItem.type} by {selectedItem.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedItem.status === 'review' ? 'default' : 'outline'}
                      onClick={() => updateStatus(selectedItem.id, 'review')}
                    >
                      Submit for Review
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedItem.status === 'approved' ? 'default' : 'outline'}
                      onClick={() => updateStatus(selectedItem.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedItem.status === 'rejected' ? 'default' : 'outline'}
                      onClick={() => updateStatus(selectedItem.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {selectedItem.comments.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                    )}
                    {selectedItem.comments.map((comment, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-2 border rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    />
                    <Button onClick={addComment}>Post</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select content to view details and collaborate</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
