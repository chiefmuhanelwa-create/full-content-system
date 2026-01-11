'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Settings, Monitor } from 'lucide-react'

export default function TeleprompterPage() {
  const [script, setScript] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(32)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load script from localStorage if available
  useEffect(() => {
    const savedScript = localStorage.getItem('teleprompterScript')
    if (savedScript) {
      setScript(savedScript)
      localStorage.removeItem('teleprompterScript')
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setScrollPosition(prev => prev + 1)
        if (containerRef.current) {
          containerRef.current.scrollTop += speed
        }
      }, 50)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed])

  const handleReset = () => {
    setIsPlaying(false)
    setScrollPosition(0)
    if (containerRef.current) containerRef.current.scrollTop = 0
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Monitor className="h-10 w-10 text-cyan-600" />
          Script Teleprompter
        </h1>
        <p className="text-gray-600">Professional filming tool for smooth content delivery</p>
      </div>

      {!script && (
        <Card>
          <CardHeader><CardTitle>Paste Your Script</CardTitle></CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[400px] p-4 border rounded-lg font-mono"
              placeholder="Paste your script here to start..."
              onChange={(e) => setScript(e.target.value)}
            />
            <Button onClick={() => setScript(script)} className="mt-4">Load Script</Button>
          </CardContent>
        </Card>
      )}

      {script && (
        <div className="space-y-4">
          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <Button onClick={() => setIsPlaying(!isPlaying)} size="lg">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-6 items-center">
                  <div>
                    <label className="text-sm font-medium mr-2">Speed:</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="ml-2 text-sm">{speed}x</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium mr-2">Font Size:</label>
                    <input
                      type="range"
                      min="24"
                      max="64"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="ml-2 text-sm">{fontSize}px</span>
                  </div>
                </div>

                <Button variant="ghost" onClick={() => setScript('')}>
                  <Settings className="h-5 w-5 mr-2" />
                  New Script
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teleprompter Display */}
          <div
            ref={containerRef}
            className="bg-black rounded-lg overflow-y-auto h-[600px] p-12 relative"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div
              className="text-white text-center leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px`, fontFamily: 'sans-serif', fontWeight: 600 }}
            >
              {script}
            </div>
            <div className="h-[600px]"></div>
          </div>
        </div>
      )}
    </div>
  )
}
