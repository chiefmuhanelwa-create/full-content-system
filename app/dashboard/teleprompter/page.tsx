'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  MonitorPlay,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
} from 'lucide-react'

export default function TeleprompterPage() {
  const router = useRouter()
  const [script, setScript] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(32)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [scriptTitle, setScriptTitle] = useState('Untitled Script')
  const [isMirrored, setIsMirrored] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load script from localStorage if coming from library
  useEffect(() => {
    const teleprompterData = localStorage.getItem('teleprompterScript')
    if (teleprompterData) {
      try {
        const data = JSON.parse(teleprompterData)
        setScript(data.fullScript || data.content || '')
        setScriptTitle(data.title || 'Untitled Script')
        localStorage.removeItem('teleprompterScript')
      } catch (error) {
        console.error('Error loading script:', error)
      }
    }
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      intervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + speed
          if (scrollRef.current) {
            scrollRef.current.scrollTop = newPosition
            // Stop at the end
            if (newPosition >= scrollRef.current.scrollHeight - scrollRef.current.clientHeight) {
              setIsPlaying(false)
              return prev
            }
          }
          return newPosition
        })
      }, 50)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed])

  // Update scroll position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetScroll = () => {
    setScrollPosition(0)
    setIsPlaying(false)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const saveScript = () => {
    const savedScripts = JSON.parse(localStorage.getItem('savedScripts') || '[]')

    const newScript = {
      id: 'script-' + Date.now(),
      title: scriptTitle,
      hook: script.split('\n')[0] || 'No hook',
      fullScript: script,
      platform: 'Teleprompter',
      duration: 'Variable',
      createdAt: new Date().toISOString(),
    }

    savedScripts.unshift(newScript)
    localStorage.setItem('savedScripts', JSON.stringify(savedScripts))

    alert('Script saved to library!')
  }

  const loadFromLibrary = () => {
    router.push('/dashboard/library')
  }

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${scriptTitle}</title>
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
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 15px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.8;
            }
            @media print {
              body { padding: 20px; }
              pre { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${scriptTitle}</h1>
            <p>Teleprompter Script</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          <pre>${script}</pre>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
        </html>
      `
      printWindow.document.write(content)
      printWindow.document.close()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <MonitorPlay className="h-8 w-8 text-green-600" />
          Teleprompter
        </h1>
        <p className="text-gray-600">
          Professional teleprompter for recording your scripts
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Script Settings</CardTitle>
              <CardDescription>Configure your teleprompter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Script Title</Label>
                <Input
                  id="title"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder="Enter script title..."
                />
              </div>

              <div className="space-y-2">
                <Label>Font Size: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={16}
                  max={72}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Scroll Speed: {speed}x</Label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mirror"
                  checked={isMirrored}
                  onChange={(e) => setIsMirrored(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="mirror" className="text-sm">Mirror Mode (for reflective displays)</Label>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button onClick={togglePlay} className="w-full" size="lg">
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Play
                    </>
                  )}
                </Button>

                <Button onClick={resetScroll} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Top
                </Button>

                <Button onClick={toggleFullscreen} variant="outline" className="w-full">
                  {isFullscreen ? (
                    <>
                      <Minimize className="mr-2 h-4 w-4" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize className="mr-2 h-4 w-4" />
                      Fullscreen
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowControls(!showControls)}
                  variant="outline"
                  className="w-full"
                >
                  {showControls ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Controls
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Controls
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={saveScript} variant="outline" className="w-full" disabled={!script.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save to Library
              </Button>

              <Button onClick={loadFromLibrary} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Load from Library
              </Button>

              <Button onClick={exportToPDF} variant="outline" className="w-full" disabled={!script.trim()}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p>💡 <strong>Fullscreen:</strong> Press F11 or use the fullscreen button for distraction-free recording</p>
              <p>💡 <strong>Speed:</strong> Start at 2x and adjust based on your reading pace</p>
              <p>💡 <strong>Mirror:</strong> Enable if using a reflective teleprompter setup</p>
              <p>💡 <strong>Font Size:</strong> Larger fonts work better for camera distance</p>
            </CardContent>
          </Card>
        </div>

        {/* Teleprompter Display */}
        <div className="lg:col-span-2">
          <Card className="h-full" ref={containerRef}>
            <CardHeader>
              <CardTitle>Teleprompter Display</CardTitle>
              <CardDescription>
                {script.trim() ? 'Ready to record' : 'Paste or type your script below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showControls ? (
                <div className="space-y-4">
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Paste your script here or load from library..."
                    rows={20}
                    className="font-mono"
                  />
                </div>
              ) : (
                <div
                  ref={scrollRef}
                  className="bg-black text-white rounded-lg overflow-hidden"
                  style={{
                    height: '70vh',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="p-12 leading-relaxed"
                    style={{
                      fontSize: fontSize + 'px',
                      transform: isMirrored ? 'scaleX(-1)' : 'none',
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    {script || 'No script loaded. Enter text or load from library.'}
                  </div>
                </div>
              )}

              {/* Playback Controls Overlay */}
              {!showControls && (
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Button onClick={togglePlay} size="lg">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button onClick={resetScroll} variant="outline" size="lg">
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                  <Button onClick={() => setShowControls(true)} variant="outline" size="lg">
                    <Settings className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
