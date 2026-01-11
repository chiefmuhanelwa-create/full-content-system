'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Repeat, FileText, Image, MessageSquare, Mail, Linkedin, Copy, Download } from 'lucide-react'

interface RepurposedContent {
  shortClips: string[]
  carouselPosts: string[]
  thread: string
  linkedinPost: string
  emailSequence: string[]
}

export default function RepurposePage() {
  const [originalScript, setOriginalScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent | null>(null)

  // Format selection
  const [formats, setFormats] = useState({
    shortClips: true,
    carouselPosts: true,
    thread: true,
    linkedinPost: true,
    emailSequence: false,
  })

  const handleRepurpose = async () => {
    if (!originalScript.trim()) {
      alert('Please enter your script')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/repurpose/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: originalScript, formats }),
      })

      if (response.ok) {
        const data = await response.json()
        setRepurposedContent(data.content)
      } else {
        alert('Failed to repurpose content')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Repeat className="h-10 w-10 text-purple-600" />
          Content Repurposing Engine
        </h1>
        <p className="text-gray-600">Transform one script into 10+ pieces of content</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Original Script</CardTitle>
            <CardDescription>Paste your viral script to repurpose</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="script">Your Script</Label>
              <Textarea
                id="script"
                value={originalScript}
                onChange={(e) => setOriginalScript(e.target.value)}
                placeholder="Paste your NOCHILL script here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="space-y-3">
              <Label>Select Formats to Generate</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shortClips"
                  checked={formats.shortClips}
                  onCheckedChange={(checked) => setFormats({ ...formats, shortClips: !!checked })}
                />
                <label htmlFor="shortClips" className="text-sm cursor-pointer">
                  3 Short Clips (15-30s each)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="carouselPosts"
                  checked={formats.carouselPosts}
                  onCheckedChange={(checked) => setFormats({ ...formats, carouselPosts: !!checked })}
                />
                <label htmlFor="carouselPosts" className="text-sm cursor-pointer">
                  Carousel Posts (Instagram/LinkedIn)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="thread"
                  checked={formats.thread}
                  onCheckedChange={(checked) => setFormats({ ...formats, thread: !!checked })}
                />
                <label htmlFor="thread" className="text-sm cursor-pointer">
                  Twitter/X Thread
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkedinPost"
                  checked={formats.linkedinPost}
                  onCheckedChange={(checked) => setFormats({ ...formats, linkedinPost: !!checked })}
                />
                <label htmlFor="linkedinPost" className="text-sm cursor-pointer">
                  LinkedIn Long-Form Post
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailSequence"
                  checked={formats.emailSequence}
                  onCheckedChange={(checked) => setFormats({ ...formats, emailSequence: !!checked })}
                />
                <label htmlFor="emailSequence" className="text-sm cursor-pointer">
                  5-Part Email Sequence
                </label>
              </div>
            </div>

            <Button onClick={handleRepurpose} disabled={loading} className="w-full">
              {loading ? 'Repurposing...' : 'Repurpose Content'}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Repurposing your content into multiple formats...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {repurposedContent && (
            <>
              {/* Short Clips */}
              {formats.shortClips && repurposedContent.shortClips && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      3 Short Clips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {repurposedContent.shortClips.map((clip, idx) => (
                        <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm text-blue-900">Clip {idx + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(clip)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{clip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Carousel Posts */}
              {formats.carouselPosts && repurposedContent.carouselPosts && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Image className="h-5 w-5 text-pink-600" />
                      Carousel Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {repurposedContent.carouselPosts.map((slide, idx) => (
                        <div key={idx} className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                          <span className="font-semibold text-xs text-pink-900">Slide {idx + 1}</span>
                          <p className="text-sm mt-1">{slide}</p>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => copyToClipboard(repurposedContent.carouselPosts.join('\n\n---\n\n'))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Slides
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Twitter Thread */}
              {formats.thread && repurposedContent.thread && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      Twitter/X Thread
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(repurposedContent.thread)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{repurposedContent.thread}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* LinkedIn Post */}
              {formats.linkedinPost && repurposedContent.linkedinPost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Linkedin className="h-5 w-5 text-blue-700" />
                      LinkedIn Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(repurposedContent.linkedinPost)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{repurposedContent.linkedinPost}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email Sequence */}
              {formats.emailSequence && repurposedContent.emailSequence && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="h-5 w-5 text-green-600" />
                      5-Part Email Sequence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {repurposedContent.emailSequence.map((email, idx) => (
                        <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm text-green-900">Email {idx + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(email)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{email}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!repurposedContent && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-12">
                  <Repeat className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Repurposed content will appear here</p>
                  <p className="text-sm mt-2">Paste your script and click "Repurpose Content"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
