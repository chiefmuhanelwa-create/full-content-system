'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Save, Download, Sparkles, Copy, CheckCircle2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface VoiceProfile {
  name: string
  cadence: string
  vocabulary: string
  perspective: string
  vulnerabilityLevel: string
  energy: string
  signaturePhrases: string[]
  avoidPhrases: string[]
  exampleContent: string
  updatedAt: string
}

export default function VoiceProfile() {
  const [profile, setProfile] = useState<VoiceProfile>({
    name: '',
    cadence: '',
    vocabulary: '',
    perspective: '',
    vulnerabilityLevel: '',
    energy: '',
    signaturePhrases: [],
    avoidPhrases: [],
    exampleContent: '',
    updatedAt: '',
  })

  const [signaturePhraseInput, setSignaturePhraseInput] = useState('')
  const [avoidPhraseInput, setAvoidPhraseInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [profileCopied, setProfileCopied] = useState(false)

  // Load existing profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('voiceProfile')
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (e) {
        console.error('Failed to load voice profile:', e)
      }
    }
  }, [])

  const addSignaturePhrase = () => {
    if (signaturePhraseInput.trim()) {
      setProfile(prev => ({
        ...prev,
        signaturePhrases: [...prev.signaturePhrases, signaturePhraseInput.trim()]
      }))
      setSignaturePhraseInput('')
    }
  }

  const removeSignaturePhrase = (index: number) => {
    setProfile(prev => ({
      ...prev,
      signaturePhrases: prev.signaturePhrases.filter((_, i) => i !== index)
    }))
  }

  const addAvoidPhrase = () => {
    if (avoidPhraseInput.trim()) {
      setProfile(prev => ({
        ...prev,
        avoidPhrases: [...prev.avoidPhrases, avoidPhraseInput.trim()]
      }))
      setAvoidPhraseInput('')
    }
  }

  const removeAvoidPhrase = (index: number) => {
    setProfile(prev => ({
      ...prev,
      avoidPhrases: prev.avoidPhrases.filter((_, i) => i !== index)
    }))
  }

  const saveProfile = () => {
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem('voiceProfile', JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const exportProfile = () => {
    const content = `
VOICE & PERSONALITY PROFILE
Created: ${new Date(profile.updatedAt).toLocaleDateString()}

CREATOR NAME: ${profile.name}

═══════════════════════════════════════

CADENCE
${profile.cadence}

VOCABULARY
${profile.vocabulary}

PERSPECTIVE
${profile.perspective}

VULNERABILITY LEVEL
${profile.vulnerabilityLevel}

ENERGY
${profile.energy}

═══════════════════════════════════════

SIGNATURE PHRASES:
${profile.signaturePhrases.map((p, i) => `${i + 1}. "${p}"`).join('\n')}

PHRASES TO AVOID:
${profile.avoidPhrases.map((p, i) => `${i + 1}. "${p}"`).join('\n')}

═══════════════════════════════════════

EXAMPLE CONTENT:
${profile.exampleContent}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voice-profile-${Date.now()}.txt`
    a.click()
  }

  const copyProfilePrompt = () => {
    const prompt = `Voice & Personality Guidelines:
- Name: ${profile.name}
- Cadence: ${profile.cadence}
- Vocabulary: ${profile.vocabulary}
- Perspective: ${profile.perspective}
- Vulnerability Level: ${profile.vulnerabilityLevel}
- Energy: ${profile.energy}
- Signature Phrases: ${profile.signaturePhrases.join(', ')}
- Avoid: ${profile.avoidPhrases.join(', ')}`

    navigator.clipboard.writeText(prompt)
    setProfileCopied(true)
    setTimeout(() => setProfileCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Mic}
        iconColor="text-orange-600"
        eyebrow="Profile"
        title="Voice & Personality Profile"
        description="Define your unique voice for authentic content creation"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

        <Card className="p-4 bg-orange-50 border-orange-200 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Why this matters:</strong> Your voice profile ensures all generated content maintains your authentic style, personality, and perspective. Define it once, use it everywhere.
          </p>
        </Card>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>

          <div className="space-y-2 mb-4">
            <Label>Your Name / Brand Name</Label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., John Doe, The Content Lab"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </Card>

        {/* Voice Elements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Voice Elements</h2>

          {/* Cadence */}
          <div className="space-y-2 mb-4">
            <Label>Cadence & Rhythm</Label>
            <Select
              value={profile.cadence}
              onValueChange={(value) => setProfile(prev => ({ ...prev, cadence: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How do you structure sentences?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-punchy">Short, punchy sentences. Quick rhythm. High energy.</SelectItem>
                <SelectItem value="flowing-varied">Flowing, varied sentences. Mix of short and long. Natural rhythm.</SelectItem>
                <SelectItem value="long-thoughtful">Longer, thoughtful sentences. Measured pace. Contemplative.</SelectItem>
                <SelectItem value="conversational">Very conversational. Like talking to a friend. Casual flow.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vocabulary */}
          <div className="space-y-2 mb-4">
            <Label>Vocabulary Style</Label>
            <Select
              value={profile.vocabulary}
              onValueChange={(value) => setProfile(prev => ({ ...prev, vocabulary: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="What language do you use?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain-simple">Plain, simple language. No jargon. 5th grade reading level.</SelectItem>
                <SelectItem value="industry-smart">Industry terms mixed with simple explanations. Educated but accessible.</SelectItem>
                <SelectItem value="elevated-sophisticated">Sophisticated vocabulary. Intellectual. Well-read.</SelectItem>
                <SelectItem value="street-casual">Casual, street-smart. Slang OK. Very relatable.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Perspective */}
          <div className="space-y-2 mb-4">
            <Label>Perspective & Worldview</Label>
            <Textarea
              value={profile.perspective}
              onChange={(e) => setProfile(prev => ({ ...prev, perspective: e.target.value }))}
              placeholder="What do you believe that others don't? What's your unique angle?

Examples:
- I believe most productivity advice is BS. Real productivity is about doing less, not more.
- The algorithm isn't the enemy. Bad content is. Focus on value, not gaming the system.
- Everyone teaches tactics. I teach principles that work across all platforms."
              rows={5}
              className="text-sm"
            />
          </div>

          {/* Vulnerability Level */}
          <div className="space-y-2 mb-4">
            <Label>Vulnerability Level</Label>
            <Select
              value={profile.vulnerabilityLevel}
              onValueChange={(value) => setProfile(prev => ({ ...prev, vulnerabilityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How much do you share?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highly-personal">Highly Personal - Share failures, fears, doubts openly</SelectItem>
                <SelectItem value="selectively-vulnerable">Selectively Vulnerable - Share key moments strategically</SelectItem>
                <SelectItem value="professionally-distant">Professionally Distant - Focus on results and teaching</SelectItem>
                <SelectItem value="mysterious-expert">Mysterious Expert - Rarely share personal details</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Energy */}
          <div className="space-y-2 mb-4">
            <Label>Energy & Tone</Label>
            <Select
              value={profile.energy}
              onValueChange={(value) => setProfile(prev => ({ ...prev, energy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="What's your vibe?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-energy">High Energy - Enthusiastic, exclamatory, motivational!!!</SelectItem>
                <SelectItem value="calm-authority">Calm Authority - Measured, confident, reassuring</SelectItem>
                <SelectItem value="raw-honest">Raw & Honest - Unfiltered, real, conversational</SelectItem>
                <SelectItem value="playful-smart">Playful & Smart - Humorous, clever, entertaining</SelectItem>
                <SelectItem value="serious-direct">Serious & Direct - No-nonsense, straight talk, results-focused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Signature & Avoid Phrases */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Your Language Patterns</h2>

          {/* Signature Phrases */}
          <div className="mb-6">
            <Label>Signature Phrases (Words/phrases you use often)</Label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={signaturePhraseInput}
                onChange={(e) => setSignaturePhraseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSignaturePhrase()}
                placeholder="e.g., 'Here's the thing...', 'Let me break this down...'"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button onClick={addSignaturePhrase} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.signaturePhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>"{phrase}"</span>
                  <button
                    onClick={() => removeSignaturePhrase(index)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid Phrases */}
          <div>
            <Label>Phrases to Avoid (Words/phrases that don't sound like you)</Label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={avoidPhraseInput}
                onChange={(e) => setAvoidPhraseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAvoidPhrase()}
                placeholder="e.g., 'game-changer', 'unlock', 'revolutionary'"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button onClick={addAvoidPhrase} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.avoidPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>"{phrase}"</span>
                  <button
                    onClick={() => removeAvoidPhrase(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Example Content */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Example Content</h2>
          <p className="text-sm text-gray-600 mb-3">
            Paste 2-3 pieces of your best content that represent your authentic voice. This helps AI match your style.
          </p>

          <Textarea
            value={profile.exampleContent}
            onChange={(e) => setProfile(prev => ({ ...prev, exampleContent: e.target.value }))}
            placeholder="Paste your best posts, captions, scripts, or emails that sound like YOU.

The more examples you provide, the better AI can match your unique voice and style."
            rows={12}
            className="text-sm"
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={saveProfile}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Voice Profile
              </>
            )}
          </Button>

          <Button onClick={exportProfile} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button onClick={copyProfilePrompt} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            {profileCopied ? 'Copied!' : 'Copy for AI'}
          </Button>
        </div>

        {profile.updatedAt && (
          <p className="text-xs text-center text-gray-500">
            Last updated: {new Date(profile.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
    </div>
  )
}
