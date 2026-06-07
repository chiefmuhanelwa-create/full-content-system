'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Gauge,
  Wind,
  Focus,
  Sparkles,
} from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

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
  const [showTimer, setShowTimer] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPreparing, setIsPreparing] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [countdownDuration, setCountdownDuration] = useState(15)

  // New rhythm and flow features
  const [showFocusLine, setShowFocusLine] = useState(true)
  const [focusLinePosition, setFocusLinePosition] = useState(35) // Percentage from top
  const [highlightCurrentWord, setHighlightCurrentWord] = useState(false)
  const [lineSpacing, setLineSpacing] = useState(1.8)
  const [textOpacity, setTextOpacity] = useState(100)
  const [showBreathingMarkers, setShowBreathingMarkers] = useState(true)
  const [smoothSpeed, setSmoothSpeed] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(2)
  const [targetSpeed, setTargetSpeed] = useState(2)
  const [speedPreset, setSpeedPreset] = useState<'slow' | 'normal' | 'fast' | 'custom'>('normal')
  const [wordsPerMinute, setWordsPerMinute] = useState(150)
  const [highlightColor, setHighlightColor] = useState('#3b82f6') // Blue
  const [backgroundColor, setBackgroundColor] = useState('#000000') // Black

  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load script from localStorage if coming from library or script generator
  useEffect(() => {
    const teleprompterData = localStorage.getItem('teleprompterScript')
    if (teleprompterData) {
      try {
        // Try to parse as JSON first (new format)
        const data = JSON.parse(teleprompterData)
        setScript(data.fullScript || data.content || '')
        setScriptTitle(data.title || 'Untitled Script')
      } catch (error) {
        // If parsing fails, treat as plain string (backward compatibility)
        setScript(teleprompterData)
        setScriptTitle('Imported Script')
      }
      // Clean up after loading
      localStorage.removeItem('teleprompterScript')
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space bar = play/pause
      if (e.code === 'Space' && !showControls) {
        e.preventDefault()
        togglePlay()
      }
      // R = reset
      if (e.code === 'KeyR' && !showControls) {
        e.preventDefault()
        resetScroll()
      }
      // Arrow Up = increase speed (0.1 increments for fine control)
      if (e.code === 'ArrowUp' && !showControls) {
        e.preventDefault()
        setSpeed(prev => {
          const newSpeed = Math.min(10, prev + 0.1)
          setTargetSpeed(newSpeed)
          setSpeedPreset('custom')
          return newSpeed
        })
      }
      // Arrow Down = decrease speed (0.1 increments for fine control)
      if (e.code === 'ArrowDown' && !showControls) {
        e.preventDefault()
        setSpeed(prev => {
          const newSpeed = Math.max(0.1, prev - 0.1)
          setTargetSpeed(newSpeed)
          setSpeedPreset('custom')
          return newSpeed
        })
      }
      // Shift + Arrow Up = increase speed faster (0.5 increments)
      if (e.code === 'ArrowUp' && e.shiftKey && !showControls) {
        e.preventDefault()
        setSpeed(prev => {
          const newSpeed = Math.min(10, prev + 0.5)
          setTargetSpeed(newSpeed)
          setSpeedPreset('custom')
          return newSpeed
        })
      }
      // Shift + Arrow Down = decrease speed faster (0.5 increments)
      if (e.code === 'ArrowDown' && e.shiftKey && !showControls) {
        e.preventDefault()
        setSpeed(prev => {
          const newSpeed = Math.max(0.1, prev - 0.5)
          setTargetSpeed(newSpeed)
          setSpeedPreset('custom')
          return newSpeed
        })
      }
      // ESC = show controls
      if (e.code === 'Escape' && !showControls) {
        setShowControls(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showControls, isPlaying])

  // Timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying])

  // Smooth speed transitions
  useEffect(() => {
    if (smoothSpeed && currentSpeed !== targetSpeed) {
      const speedDiff = targetSpeed - currentSpeed
      const step = speedDiff * 0.05 // 5% of difference per frame

      if (Math.abs(speedDiff) < 0.01) {
        setCurrentSpeed(targetSpeed)
      } else {
        const timer = setTimeout(() => {
          setCurrentSpeed(prev => prev + step)
        }, 50)
        return () => clearTimeout(timer)
      }
    } else if (!smoothSpeed) {
      setCurrentSpeed(speed)
    }
  }, [smoothSpeed, currentSpeed, targetSpeed, speed])

  // Speed preset handler
  useEffect(() => {
    let newSpeed = speed
    switch (speedPreset) {
      case 'slow':
        newSpeed = 1.5
        break
      case 'normal':
        newSpeed = 2.5
        break
      case 'fast':
        newSpeed = 4.5
        break
      default:
        return // Keep current speed for 'custom'
    }
    setSpeed(newSpeed)
    setTargetSpeed(newSpeed)
  }, [speedPreset])

  // Auto-scroll functionality
  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      intervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const effectiveSpeed = smoothSpeed ? currentSpeed : speed
          const newPosition = prev + effectiveSpeed
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
  }, [isPlaying, speed, currentSpeed, smoothSpeed])

  // Update scroll position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition])

  const togglePlay = () => {
    if (!isPlaying && !showControls) {
      // Start countdown before playing
      setIsPreparing(true)
      setCountdown(countdownDuration)

      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setIsPreparing(false)
            setIsPlaying(true)
            return countdownDuration
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const resetScroll = () => {
    setScrollPosition(0)
    setIsPlaying(false)
    setElapsedTime(0)
  }

  // Calculate stats
  const wordCount = script.trim().split(/\s+/).filter(word => word.length > 0).length
  const estimatedMinutes = Math.ceil(wordCount / 150) // Average speaking pace: 150 words/minute
  const progress = scrollRef.current
    ? (scrollPosition / (scrollRef.current.scrollHeight - scrollRef.current.clientHeight)) * 100
    : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Process script with breathing markers and voice modulation
  const processScriptWithMarkers = (text: string) => {
    let processedText = text

    // Add visual pause indicators after punctuation
    if (showBreathingMarkers) {
      processedText = processedText
        .replace(/\.\s/g, '. 🫁 ')
        .replace(/\?\s/g, '? 🫁 ')
        .replace(/!\s/g, '! 🫁 ')
        .replace(/,\s/g, ', · ')
    }

    return processedText
  }

  // Render script with voice modulation styling
  const renderScriptWithModulation = (text: string) => {
    const words = text.split(' ')

    return words.map((word, index) => {
      // Check if word is all uppercase (BOLD/HIGH NOTE)
      if (word.length > 1 && word === word.toUpperCase() && /[A-Z]/.test(word)) {
        return (
          <span
            key={index}
            style={{
              fontSize: `${fontSize * 1.3}px`,
              fontWeight: 'bold',
              color: '#fbbf24', // Amber color for emphasis
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            }}
          >
            {word}{' '}
          </span>
        )
      }

      // Check if word contains special markers
      // [...text...] = softer/lower voice
      if (word.startsWith('[') && word.endsWith(']')) {
        return (
          <span
            key={index}
            style={{
              fontSize: `${fontSize * 0.85}px`,
              opacity: 0.7,
              fontStyle: 'italic',
              color: '#94a3b8', // Gray for softer voice
            }}
          >
            {word.slice(1, -1)}{' '}
          </span>
        )
      }

      // Check if word contains emphasis markers
      // **text** = emphasis/moderate raise
      if (word.startsWith('**') && word.endsWith('**')) {
        return (
          <span
            key={index}
            style={{
              fontSize: `${fontSize * 1.15}px`,
              fontWeight: '600',
              color: '#60a5fa', // Blue for moderate emphasis
            }}
          >
            {word.slice(2, -2)}{' '}
          </span>
        )
      }

      // Regular word
      return <span key={index}>{word} </span>
    })
  }

  // Handle speed preset changes
  const handleSpeedPresetChange = (preset: 'slow' | 'normal' | 'fast' | 'custom') => {
    setSpeedPreset(preset)
  }

  // Handle manual speed change
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    setTargetSpeed(newSpeed)
    setSpeedPreset('custom')
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
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={MonitorPlay}
        iconColor="text-green-600"
        eyebrow="Record"
        title="Teleprompter"
        description="Professional teleprompter for recording your scripts"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

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

              {/* Script Stats */}
              {script.trim() && (
                <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-semibold text-gray-900">{wordCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-semibold text-gray-900">{estimatedMinutes} min</span>
                  </div>
                  {elapsedTime > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Elapsed:</span>
                      <span className="font-semibold text-green-600">{formatTime(elapsedTime)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Speed Presets */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Speed Preset
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['slow', 'normal', 'fast', 'custom'] as const).map((preset) => (
                    <Button
                      key={preset}
                      variant={speedPreset === preset ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSpeedPresetChange(preset)}
                      className="capitalize"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fine Speed Control: {speed.toFixed(1)}x</Label>
                <input
                  type="range"
                  value={speed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.1x (Very Slow)</span>
                  <span>10x (Very Fast)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="smooth-speed"
                  checked={smoothSpeed}
                  onChange={(e) => setSmoothSpeed(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="smooth-speed" className="text-sm flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  Smooth Speed Transitions
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Countdown Duration: {countdownDuration}s</Label>
                <input
                  type="range"
                  value={countdownDuration}
                  onChange={(e) => setCountdownDuration(Number(e.target.value))}
                  min={3}
                  max={30}
                  step={1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>3s</span>
                  <span>30s</span>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Time to prepare before recording starts
                </p>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {fontSize}px</Label>
                <input
                  type="range"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={16}
                  max={72}
                  step={2}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Line Spacing: {lineSpacing.toFixed(1)}</Label>
                <input
                  type="range"
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(Number(e.target.value))}
                  min={1.0}
                  max={3.0}
                  step={0.1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Text Opacity: {textOpacity}%</Label>
                <input
                  type="range"
                  value={textOpacity}
                  onChange={(e) => setTextOpacity(Number(e.target.value))}
                  min={50}
                  max={100}
                  step={5}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Visual Flow Helpers */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Flow & Rhythm Helpers
                </Label>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="focus-line"
                    checked={showFocusLine}
                    onChange={(e) => setShowFocusLine(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="focus-line" className="text-sm flex items-center gap-1">
                    <Focus className="h-3 w-3" />
                    Reading Guide Line
                  </Label>
                </div>

                {showFocusLine && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-xs">Guide Position: {focusLinePosition}%</Label>
                    <input
                      type="range"
                      value={focusLinePosition}
                      onChange={(e) => setFocusLinePosition(Number(e.target.value))}
                      min={20}
                      max={50}
                      step={5}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="breathing-markers"
                    checked={showBreathingMarkers}
                    onChange={(e) => setShowBreathingMarkers(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="breathing-markers" className="text-sm">
                    🫁 Breathing & Pause Markers
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="highlight-word"
                    checked={highlightCurrentWord}
                    onChange={(e) => setHighlightCurrentWord(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="highlight-word" className="text-sm">
                    Highlight Current Position
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="timer"
                    checked={showTimer}
                    onChange={(e) => setShowTimer(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="timer" className="text-sm">Show Timer</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mirror"
                    checked={isMirrored}
                    onChange={(e) => setIsMirrored(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="mirror" className="text-sm">Mirror Mode</Label>
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-semibold">Color Customization</Label>

                <div className="space-y-2">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-8 w-16 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Highlight Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={highlightColor}
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="h-8 w-16 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={highlightColor}
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="flex-1 h-8 text-xs"
                    />
                  </div>
                </div>
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

          {/* Voice Modulation Guide */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-sm">🎤 Voice Modulation Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-amber-900">How to format your script:</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">UPPERCASE</span>
                  <span className="text-amber-700 font-bold">Loud/Bold/High Note</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">**text**</span>
                  <span className="text-blue-600 font-semibold">Moderate Emphasis</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">[text]</span>
                  <span className="text-gray-400 italic">Soft/Lower Voice</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">🫁</span>
                  <span className="text-green-600">Breathing Pause</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">·</span>
                  <span className="text-purple-600">Short Pause</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Play/Pause</span>
                <kbd className="px-2 py-1 bg-white rounded border text-gray-900 font-mono">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reset</span>
                <kbd className="px-2 py-1 bg-white rounded border text-gray-900 font-mono">R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fine Speed ±0.1</span>
                <kbd className="px-2 py-1 bg-white rounded border text-gray-900 font-mono">↑/↓</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fast Speed ±0.5</span>
                <kbd className="px-2 py-1 bg-white rounded border text-gray-900 font-mono">Shift+↑/↓</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Show Controls</span>
                <kbd className="px-2 py-1 bg-white rounded border text-gray-900 font-mono">ESC</kbd>
              </div>
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
                <div className="relative">
                  {/* Progress Bar */}
                  {script.trim() && (
                    <div className="mb-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  )}

                  {/* Timer Display */}
                  {showTimer && elapsedTime > 0 && (
                    <div className="absolute top-4 right-4 z-10 bg-black/80 text-white px-4 py-2 rounded-lg text-2xl font-mono">
                      {formatTime(elapsedTime)}
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {isPreparing && (
                    <div className="absolute inset-0 z-20 bg-black/90 flex items-center justify-center rounded-lg">
                      <div className="text-9xl font-bold text-white animate-pulse">
                        {countdown}
                      </div>
                    </div>
                  )}

                  <div
                    ref={scrollRef}
                    className="rounded-lg overflow-hidden relative"
                    style={{
                      height: '70vh',
                      overflow: 'hidden',
                      backgroundColor: backgroundColor,
                    }}
                  >
                    {/* Focus/Reading Guide Line */}
                    {showFocusLine && (
                      <div
                        className="absolute left-0 right-0 z-10 pointer-events-none"
                        style={{
                          top: `${focusLinePosition}%`,
                        }}
                      >
                        <div
                          className="w-full"
                          style={{
                            height: '3px',
                            background: `linear-gradient(90deg, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
                            boxShadow: `0 0 10px ${highlightColor}`,
                          }}
                        />
                        {/* Highlight zone around the line */}
                        {highlightCurrentWord && (
                          <div
                            className="absolute w-full"
                            style={{
                              top: '-60px',
                              height: '120px',
                              background: `linear-gradient(180deg, transparent 0%, ${highlightColor}15 40%, ${highlightColor}20 50%, ${highlightColor}15 60%, transparent 100%)`,
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                      </div>
                    )}

                    <div
                      className="p-12"
                      style={{
                        fontSize: fontSize + 'px',
                        transform: isMirrored ? 'scaleX(-1)' : 'none',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 500,
                        whiteSpace: 'pre-wrap',
                        lineHeight: lineSpacing.toString(),
                        color: 'white',
                        opacity: textOpacity / 100,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {script ? renderScriptWithModulation(processScriptWithMarkers(script)) : 'No script loaded. Enter text or load from library.'}
                    </div>
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
    </div>
  )
}
