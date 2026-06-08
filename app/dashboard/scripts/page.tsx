'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToolPageHeader } from '@/components/ToolPageHeader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Sparkles, Copy, Download, Calendar as CalendarIcon, BookOpen, Monitor, Edit, Save, Layers } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'
import { useRouter } from 'next/navigation'

interface FiveLineSection {
  timestamp: string
  script: string
  visual: string
  ubuntuPrinciple?: string
  shadowFear?: string
  systemVillain?: string
  framework?: string
  storyUsed?: string
  numbers?: string
  collectiveAction?: string
}

interface TenStepSection {
  timestamp: string
  script: string
  visual: string
  audience?: string
  shadowFear?: string
  powerWords?: string[]
  systemVillain?: string
  framework?: string
  storyUsed?: string
  numbers?: string
  collectiveAction?: string
}

interface UbuntuCheck {
  we_over_i: string
  system_villain: string
  collective_result: string
}

interface ScriptingPrinciplesCheck {
  negativity: string
  you_format: string
  short_simple: string
  audible_flow: string
}

interface Hook {
  text: string
  type: 'information_gap' | 'desired_result' | 'undesired_result' | 'a_to_b_transformation'
  racub_breakdown: {
    relevant: string
    awareness: string
    clarity: string
    unique: string
    broadened: string
  }
  shadowFear: string
  powerWords: string[]
}

interface ActStructureSection {
  timing: string
  energy: string
  script: string
  visual: string
  retentionDevice: string
  shadowFear?: string
  newConcept?: string
  emotionalAnchor?: string
  numbers?: string
  crisisPoint?: string
  milestones?: string[]
  framework?: string
  textOverlays?: string[]
  cta?: string
  collectiveAction?: string
}

interface GeneratedScript {
  title: string
  hook?: Hook
  fullScript?: string  // Complete script ready for teleprompter
  actStructure?: {     // NEW: 7-Act Retention Formula structure
    act1_negative_hook: ActStructureSection
    act2_uncomfortable_truth: ActStructureSection
    act3_origin_story: ActStructureSection
    act4_breaking_point: ActStructureSection
    act5_transformation_journey: ActStructureSection
    act6_framework: ActStructureSection
    act7_mission_cta: ActStructureSection
  }
  tenStepScript?: {    // 10-step framework structure for sales mode
    step1_callout: TenStepSection
    step2_attention: TenStepSection
    step3_problem_backup: TenStepSection
    step4_intrigue: TenStepSection
    step5_floodlight: TenStepSection
    step6_solution: TenStepSection
    step7_credentials: TenStepSection
    step8_benefits: TenStepSection
    step9_social_proof: TenStepSection
    step10_godfather_offer: TenStepSection
  }
  fiveLine?: {  // OLD: Keep for backward compatibility
    context: FiveLineSection
    collision: FiveLineSection
    conversion: FiveLineSection
    calibration: FiveLineSection
    community: FiveLineSection
  }
  bRoll?: string[]
  textOverlays?: string[]
  retentionDevicesUsed?: {
    act1?: string
    act2?: string
    act3?: string
    act4?: string
    act5?: string
    act6?: string
    act7?: string
  }
  ubuntu_check?: UbuntuCheck
  scripting_principles_check?: ScriptingPrinciplesCheck
  compliance?: {
    icp?: string
    shadowFear?: string
    proofStory?: string
    villain?: string
    atomicShareLine?: string
    businessOutcome?: string
    paidsCategory?: string
    fourE?: string
    retentionLoop?: string
    section13?: Record<string, string>
    principlesApplied?: string[]
  }
}

export default function ScriptWriterPage() {
  const { pendingAction, setPendingAction, addContentToCalendar, stories, selectedStory, selectStory } = useContent()
  const router = useRouter()

  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('auto')
  const [duration, setDuration] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<GeneratedScript | null>(null)
  const [error, setError] = useState('')
  const [showStorySelector, setShowStorySelector] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedScript, setEditedScript] = useState<GeneratedScript | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [scriptTitle, setScriptTitle] = useState('')

  // Sales Script Mode
  const [scriptMode, setScriptMode] = useState<'content' | 'sales'>('content')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [salesFormat, setSalesFormat] = useState('reel')
  const [products, setProducts] = useState<any[]>([])

  // NOCHILL Framework Selectors
  const [contentType, setContentType] = useState('auto') // 4E: entertain, educate, encourage, earn
  const [paidsStream, setPaidsStream] = useState('auto') // products, ads, information, deals, services
  const [storyType, setStoryType] = useState('auto') // Genesis: origin, struggle, transformation, breakthrough, lesson
  const [hookCategory, setHookCategory] = useState('auto') // 120 hooks: origin, transformation, lesson, social_proof, curiosity, controversy
  const [icp, setIcp] = useState('auto') // ICP 1 Called Expert / ICP 2 Content Creator Inspirer
  const [shadowFear, setShadowFear] = useState('auto') // 10 NOCHILL shadow fears
  const [villain, setVillain] = useState('') // named system/situation villain

  // Load products from DB
  useEffect(() => {
    fetch('/api/products/list')
      .then(r => r.json())
      .then(d => { if (d.products) setProducts(d.products) })
      .catch(() => {
        // Fallback to localStorage if DB unavailable
        try {
          const stored = localStorage.getItem('products')
          if (stored) setProducts(JSON.parse(stored))
        } catch {}
      })
  }, [])

  // Check for vault data integration
  useEffect(() => {
    const vaultData = localStorage.getItem('vaultToScriptWriter')
    if (vaultData) {
      try {
        const data = JSON.parse(vaultData)

        // Pre-fill from content idea
        if (data.idea) {
          setIdea(data.idea)
          if (data.description) {
            setIdea(`${data.idea}\n\n${data.description}`)
          }
          if (data.platform) setPlatform(data.platform)
          if (data.duration) setDuration(data.duration)
        }

        // Pre-fill from story
        if (data.story) {
          setIdea(`Create script about: ${data.story}\n\nLesson: ${data.lesson || ''}\n\nEmotion Arc: ${data.emotion || ''}`)
          if (data.timeframe) {
            setDuration(data.timeframe.includes('60') ? '60s' : 'auto')
          }
        }

        // Clear vault data after loading
        localStorage.removeItem('vaultToScriptWriter')
      } catch (error) {
        console.error('Error loading vault data:', error)
      }
    }
  }, [])

  // Check for pending action (hook from Hook Generator or Calendar)
  useEffect(() => {
    if (pendingAction.action === 'use-hook-in-script' && pendingAction.data) {
      const hook = pendingAction.data
      setIdea(hook.content)
      setPlatform(hook.platform || 'auto')
      // Clear pending action
      setPendingAction(null)
    }
    if (pendingAction.action === 'use-story-in-script' && pendingAction.data) {
      const story = pendingAction.data
      // Append story to idea
      setIdea((prev) => prev + '\n\nProof Story: ' + story.content)
      setPendingAction(null)
    }
    if (pendingAction.action === 'generate-script-from-calendar' && pendingAction.data) {
      const entry = pendingAction.data
      setIdea(entry.notes || entry.title)
      setPlatform(entry.platform.toLowerCase())
      setPendingAction(null)
    }
  }, [pendingAction, setPendingAction])

  // Check for script to load
  useEffect(() => {
    const loadScript = localStorage.getItem('loadScript')
    if (loadScript) {
      try {
        const scriptData = JSON.parse(loadScript)
        setScript(scriptData.script)
        setScriptTitle(scriptData.title)
        setScriptMode(scriptData.mode)
        if (scriptData.productName) {
          const product = products.find(p => p.name === scriptData.productName)
          if (product) setSelectedProductId(product.id)
        }
        localStorage.removeItem('loadScript')
      } catch (error) {
        console.error('Error loading script:', error)
      }
    }
  }, [products])

  const generateScript = async () => {
    // Validation
    if (scriptMode === 'content' && !idea.trim()) {
      setError('Please enter your content idea')
      return
    }

    if (scriptMode === 'sales' && !selectedProductId) {
      setError('Please select a product to sell')
      return
    }

    // Check if product has pre-written 10-step framework
    if (scriptMode === 'sales') {
      const selectedProduct = products.find((p) => p.id === selectedProductId)
      if (selectedProduct && selectedProduct.step1_callout) {
        // Product has pre-written framework - display it directly
        setScript({
          title: `${selectedProduct.name} - 10-Step Sales Script`,
          hook: {
            text: selectedProduct.step2_attention || 'Attention-grabbing hook',
            type: 'desired_result',
            racub_breakdown: {
              relevant: 'Targets specific audience pain',
              awareness: 'Calls out their current situation',
              clarity: 'Clear problem statement',
              unique: 'Unique angle on the problem',
              broadened: 'Universal appeal within niche'
            },
            shadowFear: selectedProduct.painPoints || 'Core fear addressed',
            powerWords: ['you', 'never', 'secret', 'proven']
          },
          fiveLine: {
            context: {
              timestamp: '0-8s',
              script: selectedProduct.step1_callout || '',
              visual: 'Direct to camera, confident energy',
              ubuntuPrinciple: 'Call out the collective struggle'
            },
            collision: {
              timestamp: '8-18s',
              script: selectedProduct.step3_problem || '',
              visual: 'Problem visualization',
              systemVillain: 'The broken system keeping them stuck'
            },
            conversion: {
              timestamp: '18-35s',
              script: `${selectedProduct.step4_intrigue}\n\n${selectedProduct.step5_floodlight}`,
              visual: 'Paint the pain, then hint at hope',
              framework: '10-Step Storytelling Framework'
            },
            calibration: {
              timestamp: '35-50s',
              script: `${selectedProduct.step6_solution}\n\n${selectedProduct.step7_credentials}\n\n${selectedProduct.step8_benefits}`,
              visual: 'Show product, share credentials, stack benefits',
              storyUsed: 'Personal journey with this solution',
              numbers: 'Real results from implementation'
            },
            community: {
              timestamp: '50-60s',
              script: `${selectedProduct.step9_proof}\n\n${selectedProduct.step10_offer}`,
              visual: 'Social proof + Godfather offer reveal',
              collectiveAction: 'Join others who took action'
            }
          },
          bRoll: [
            'Product showcase visuals',
            'Results/testimonials on screen',
            'Before/after scenarios',
            'Value stack breakdown',
            'Call-to-action with link'
          ],
          textOverlays: [
            selectedProduct.step1_callout || 'Hook text',
            'The Problem',
            'The Solution',
            `R${selectedProduct.price} (Worth R${selectedProduct.price * 10}+)`,
            'Click link to get started'
          ]
        })
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError('')

    try {
      // Get recently used stories from localStorage (last 5)
      const recentStoriesData = localStorage.getItem('recentStories')
      const recentStories = recentStoriesData ? JSON.parse(recentStoriesData) : []

      // Prepare request body
      const requestBody: any = {
        idea,
        platform: platform === 'auto' ? undefined : platform,
        duration: duration === 'auto' ? undefined : duration,
        recentStories, // Pass recently used stories for rotation
        // NOCHILL Framework Options
        contentType: contentType === 'auto' ? undefined : contentType,
        paidsStream: paidsStream === 'auto' ? undefined : paidsStream,
        storyType: storyType === 'auto' ? undefined : storyType,
        hookCategory: hookCategory === 'auto' ? undefined : hookCategory,
        icp: icp === 'auto' ? undefined : icp,
        shadowFear: shadowFear === 'auto' ? undefined : shadowFear,
        villain: villain.trim() || undefined,
      }

      // Add sales mode data
      if (scriptMode === 'sales') {
        const selectedProduct = products.find((p) => p.id === selectedProductId)
        if (!selectedProduct) {
          throw new Error('Selected product not found')
        }

        requestBody.salesMode = true
        requestBody.product = selectedProduct
        requestBody.salesFormat = salesFormat
      }

      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to generate script'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Read streaming response
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
      }

      // Parse the accumulated JSON
      let parsedScript: any
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        parsedScript = JSON.parse(jsonMatch ? jsonMatch[0] : fullText)
      } catch {
        throw new Error('Failed to parse script response. Try again.')
      }

      setScript(parsedScript)

      // Track the used story for rotation
      if (parsedScript?.fiveLine?.calibration?.storyUsed) {
        const storyKey = convertStoryTitleToKey(parsedScript.fiveLine.calibration.storyUsed)
        if (storyKey) {
          // Add to recent stories (keep last 5)
          const updatedRecentStories = [storyKey, ...recentStories].slice(0, 5)
          localStorage.setItem('recentStories', JSON.stringify(updatedRecentStories))
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Error generating script:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper to convert story title back to key
  const convertStoryTitleToKey = (title: string): string | null => {
    const storyMapping: Record<string, string> = {
      'Bathroom Floors to Boardrooms': 'bathroom_floors',
      'R750 to R100K Brand Evolution': 'r750_to_r100k',
      'R6,000 Huawei Investment': 'huawei_r6000_investment',
      '780K Instagram Followers Lost Overnight': 'instagram_780k_loss',
      'SARS R207,879 Tax Debt': 'sars_debt',
      'University Dropout Family Shame': 'family_shame_dropout',
      'First Netflix R100K Deal': 'first_netflix_deal',
      'Daily Posting Nearly Killed Me': 'content_burnout',
      'Samsung Long-term Partnership': 'samsung_partnership',
      'Ubuntu: I Am Because We Are': 'ubuntu_principle',
    }
    return storyMapping[title] || null
  }

  const getHookTypeLabel = (type: string) => {
    const labels = {
      information_gap: '🔍 Information Gap',
      desired_result: '🎯 Desired Result',
      undesired_result: '⚠️ Undesired Result',
      a_to_b_transformation: '🔄 A-to-B Transformation',
    }
    return labels[type as keyof typeof labels] || type
  }

  const copyScript = () => {
    if (!script) return

    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)

    // Use fullScript if available (NEW 10-step framework)
    if (script.fullScript) {
      const textToCopy = `${script.title}\n\n${script.fullScript}`
      navigator.clipboard.writeText(textToCopy)
      return
    }

    // Fallback to building from fiveLine structure (old format)
    if (!script.hook || !script.fiveLine) {
      navigator.clipboard.writeText(script.title)
      return
    }

    const fullScript = `
${script.title}

═══════════════════════════════════════
🎣 HOOK SCIENCE (R×A×C×U^B Formula)
═══════════════════════════════════════

${getHookTypeLabel(script.hook.type)}

"${script.hook.text}"

R×A×C×U^B Breakdown:
• R (Relevant): ${script.hook.racub_breakdown.relevant}
• A (Awareness): ${script.hook.racub_breakdown.awareness}
• C (Clarity): ${script.hook.racub_breakdown.clarity}
• U (Unique): ${script.hook.racub_breakdown.unique}
• B (Broadened): ${script.hook.racub_breakdown.broadened}

Shadow Fear Targeted: ${script.hook.shadowFear}
Power Words: ${script.hook.powerWords.join(', ')}

═══════════════════════════════════════
🎯 NOCHILL 5-Line Method
═══════════════════════════════════════

LINE 1: CONTEXT (${script.fiveLine.context.timestamp})
${script.fiveLine.context.script}
Visual: ${script.fiveLine.context.visual}
${script.fiveLine.context.ubuntuPrinciple ? `Ubuntu Principle: ${script.fiveLine.context.ubuntuPrinciple}` : ''}

LINE 2: COLLISION (${script.fiveLine.collision.timestamp})
${script.fiveLine.collision.script}
Visual: ${script.fiveLine.collision.visual}
${script.fiveLine.collision.systemVillain ? `System Villain: ${script.fiveLine.collision.systemVillain}` : ''}

LINE 3: CONVERSION (${script.fiveLine.conversion.timestamp})
${script.fiveLine.conversion.script}
Visual: ${script.fiveLine.conversion.visual}
${script.fiveLine.conversion.framework ? `Framework: ${script.fiveLine.conversion.framework}` : ''}

LINE 4: CALIBRATION (${script.fiveLine.calibration.timestamp})
${script.fiveLine.calibration.script}
Visual: ${script.fiveLine.calibration.visual}
${script.fiveLine.calibration.storyUsed ? `Story: ${script.fiveLine.calibration.storyUsed}` : ''}
${script.fiveLine.calibration.numbers ? `Numbers: ${script.fiveLine.calibration.numbers}` : ''}

LINE 5: COMMUNITY (${script.fiveLine.community.timestamp})
${script.fiveLine.community.script}
Visual: ${script.fiveLine.community.visual}
${script.fiveLine.community.collectiveAction ? `Collective Action: ${script.fiveLine.community.collectiveAction}` : ''}

═══════════════════════════════════════

B-ROLL SUGGESTIONS:
${script.bRoll && script.bRoll.length > 0 ? script.bRoll.map((b, i) => `${i + 1}. ${b}`).join('\n') : 'No B-roll suggestions available'}

TEXT OVERLAYS:
${script.textOverlays && script.textOverlays.length > 0 ? script.textOverlays.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'No text overlays available'}

${script.ubuntu_check ? `
═══════════════════════════════════════
UBUNTU STORY ARC VALIDATION:
- ${script.ubuntu_check.we_over_i}
- ${script.ubuntu_check.system_villain}
- ${script.ubuntu_check.collective_result}
` : ''}
${script.scripting_principles_check ? `
4 VIRAL SCRIPTING PRINCIPLES:
- ${script.scripting_principles_check.negativity}
- ${script.scripting_principles_check.you_format}
- ${script.scripting_principles_check.short_simple}
- ${script.scripting_principles_check.audible_flow}
` : ''}
`.trim()

    navigator.clipboard.writeText(fullScript)
  }

  const downloadPDF = () => {
    if (!script) return

    // Build the fullScript content
    let fullScriptContent = ''

    // Use fullScript if available (NEW 10-step framework)
    if (script.fullScript) {
      fullScriptContent = script.fullScript
    }
    // Fallback to building from fiveLine structure (old format)
    else if (script.hook && script.fiveLine) {
      fullScriptContent = `
═══════════════════════════════════════
🎣 HOOK SCIENCE (R×A×C×U^B Formula)
═══════════════════════════════════════

${getHookTypeLabel(script.hook.type)}

"${script.hook.text}"

R×A×C×U^B Breakdown:
• R (Relevant): ${script.hook.racub_breakdown.relevant}
• A (Awareness): ${script.hook.racub_breakdown.awareness}
• C (Clarity): ${script.hook.racub_breakdown.clarity}
• U (Unique): ${script.hook.racub_breakdown.unique}
• B (Broadened): ${script.hook.racub_breakdown.broadened}

Shadow Fear Targeted: ${script.hook.shadowFear}
Power Words: ${script.hook.powerWords.join(', ')}

═══════════════════════════════════════
🎯 NOCHILL 5-Line Method
═══════════════════════════════════════

LINE 1: CONTEXT (${script.fiveLine.context.timestamp})
${script.fiveLine.context.script}
Visual: ${script.fiveLine.context.visual}
${script.fiveLine.context.ubuntuPrinciple ? `Ubuntu Principle: ${script.fiveLine.context.ubuntuPrinciple}` : ''}

LINE 2: COLLISION (${script.fiveLine.collision.timestamp})
${script.fiveLine.collision.script}
Visual: ${script.fiveLine.collision.visual}
${script.fiveLine.collision.systemVillain ? `System Villain: ${script.fiveLine.collision.systemVillain}` : ''}

LINE 3: CONVERSION (${script.fiveLine.conversion.timestamp})
${script.fiveLine.conversion.script}
Visual: ${script.fiveLine.conversion.visual}
${script.fiveLine.conversion.framework ? `Framework: ${script.fiveLine.conversion.framework}` : ''}

LINE 4: CALIBRATION (${script.fiveLine.calibration.timestamp})
${script.fiveLine.calibration.script}
Visual: ${script.fiveLine.calibration.visual}
${script.fiveLine.calibration.storyUsed ? `Story: ${script.fiveLine.calibration.storyUsed}` : ''}
${script.fiveLine.calibration.numbers ? `Numbers: ${script.fiveLine.calibration.numbers}` : ''}

LINE 5: COMMUNITY (${script.fiveLine.community.timestamp})
${script.fiveLine.community.script}
Visual: ${script.fiveLine.community.visual}
${script.fiveLine.community.collectiveAction ? `Collective Action: ${script.fiveLine.community.collectiveAction}` : ''}

═══════════════════════════════════════

B-ROLL SUGGESTIONS:
${script.bRoll && script.bRoll.length > 0 ? script.bRoll.map((b, i) => `${i + 1}. ${b}`).join('\n') : 'No B-roll suggestions available'}

TEXT OVERLAYS:
${script.textOverlays && script.textOverlays.length > 0 ? script.textOverlays.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'No text overlays available'}

${script.ubuntu_check ? `
═══════════════════════════════════════
UBUNTU STORY ARC VALIDATION:
- ${script.ubuntu_check.we_over_i}
- ${script.ubuntu_check.system_villain}
- ${script.ubuntu_check.collective_result}
` : ''}
${script.scripting_principles_check ? `
4 VIRAL SCRIPTING PRINCIPLES:
- ${script.scripting_principles_check.negativity}
- ${script.scripting_principles_check.you_format}
- ${script.scripting_principles_check.short_simple}
- ${script.scripting_principles_check.audible_flow}
` : ''}
`.trim()
    }

    // Create a printable HTML document
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${script.title}</title>
          <style>
            body { font-family: monospace; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>${script.title}</h1>
          <pre>${fullScriptContent}</pre>
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

  const loadToTeleprompter = () => {
    if (!script) return

    const scriptToUse = isEditing && editedScript ? editedScript : script

    let fullScript = ''

    // Use fullScript field if available (NEW 10-step framework)
    if (scriptToUse.fullScript) {
      fullScript = `${scriptToUse.title}\n\n${scriptToUse.fullScript}`
    }
    // Build from tenStepScript if available
    else if (scriptToUse.tenStepScript) {
      fullScript = `${scriptToUse.title}

${scriptToUse.tenStepScript.step1_callout.script}

${scriptToUse.tenStepScript.step2_attention.script}

${scriptToUse.tenStepScript.step3_problem_backup.script}

${scriptToUse.tenStepScript.step4_intrigue.script}

${scriptToUse.tenStepScript.step5_floodlight.script}

${scriptToUse.tenStepScript.step6_solution.script}

${scriptToUse.tenStepScript.step7_credentials.script}

${scriptToUse.tenStepScript.step8_benefits.script}

${scriptToUse.tenStepScript.step9_social_proof.script}

${scriptToUse.tenStepScript.step10_godfather_offer.script}`
    }
    // Fallback to old fiveLine structure for backward compatibility
    else if (scriptToUse.fiveLine) {
      fullScript = `${scriptToUse.title}

${scriptToUse.fiveLine.context.script}

${scriptToUse.fiveLine.collision.script}

${scriptToUse.fiveLine.conversion.script}

${scriptToUse.fiveLine.calibration.script}

${scriptToUse.fiveLine.community.script}`
    }

    // Store as JSON object for teleprompter
    const teleprompterData = {
      title: scriptToUse.title,
      fullScript: fullScript,
      content: fullScript, // Fallback field
    }

    localStorage.setItem('teleprompterScript', JSON.stringify(teleprompterData))
    router.push('/dashboard/teleprompter')
  }

  const enableEditing = () => {
    setEditedScript(JSON.parse(JSON.stringify(script))) // Deep copy
    setIsEditing(true)
  }

  const saveEdits = () => {
    if (editedScript) {
      setScript(editedScript)
      setIsEditing(false)
    }
  }

  const cancelEdits = () => {
    setEditedScript(null)
    setIsEditing(false)
  }

  const updateHookText = (text: string) => {
    if (editedScript && editedScript.hook) {
      setEditedScript({
        ...editedScript,
        hook: {
          ...editedScript.hook,
          text
        }
      })
    }
  }

  const updateFiveLineSection = (line: 'context' | 'collision' | 'conversion' | 'calibration' | 'community', field: 'script' | 'visual', value: string) => {
    if (editedScript && editedScript.fiveLine) {
      setEditedScript({
        ...editedScript,
        fiveLine: {
          ...editedScript.fiveLine,
          [line]: {
            ...editedScript.fiveLine[line],
            [field]: value
          }
        }
      })
    }
  }

  const updateBRoll = (index: number, value: string) => {
    if (editedScript && editedScript.bRoll) {
      const newBRoll = [...editedScript.bRoll]
      newBRoll[index] = value
      setEditedScript({
        ...editedScript,
        bRoll: newBRoll
      })
    }
  }

  const updateTextOverlay = (index: number, value: string) => {
    if (editedScript && editedScript.textOverlays) {
      const newOverlays = [...editedScript.textOverlays]
      newOverlays[index] = value
      setEditedScript({
        ...editedScript,
        textOverlays: newOverlays
      })
    }
  }

  const saveScriptToLibrary = async () => {
    const scriptToSave = isEditing && editedScript ? editedScript : script
    if (!scriptToSave) return

    const resolvedTitle = scriptTitle.trim() || scriptToSave.title || idea.slice(0, 60).trim() || 'Untitled Script'
    const resolvedPlatform = platform !== 'auto' ? platform : 'instagram'
    const resolvedContent = typeof scriptToSave === 'string' ? scriptToSave : JSON.stringify(scriptToSave)

    try {
      const res = await fetch('/api/scripts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resolvedTitle,
          content: resolvedContent,
          platform: resolvedPlatform,
          duration: duration || '60',
          goal: scriptMode || 'content',
          category: 'generated',
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError('Could not save script: ' + (data.error || res.statusText))
        return
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err: any) {
      setError('Could not save script: ' + err.message)
    }
  }

  const saveToContentCards = async () => {
    const scriptToSave = isEditing && editedScript ? editedScript : script
    if (!scriptToSave) return

    // Auto-generate title from idea if user hasn't typed one
    const resolvedTitle =
      scriptTitle.trim() ||
      scriptToSave.title ||
      idea.slice(0, 60).trim() ||
      'Untitled Script'

    const resolvedPlatform = platform !== 'auto' ? platform : 'instagram'

    try {
      const response = await fetch('/api/content-card/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentTitle: resolvedTitle,
          platform: resolvedPlatform,
          contentType: scriptMode === 'sales' ? 'sales' : 'educational',
          status: 'drafted',
          contentPillar: scriptMode === 'content' ? 'education' : 'promotion',
          frameworkUsed: scriptToSave.actStructure || '7-Act Retention Formula',
          audienceLevel: 'symptom_aware',
          icpPainPoint: idea.slice(0, 120) || 'General audience',
          hookAwareness: 'symptom_aware',
          scriptHook: scriptToSave.hook || '',
          fullScript: scriptToSave.fullScript || '',
          productThatSolvesIt: scriptMode === 'sales' ? products.find(p => p.id === selectedProductId)?.name : undefined,
          views: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          leadsGenerated: 0,
          revenueGenerated: 0,
          isFavorite: false,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to save to Content Cards'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err: any) {
      setError('Could not save to Content Cards: ' + err.message)
      console.error('Error saving to Content Cards:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <ToolPageHeader
        icon={FileText}
        iconColor="text-blue-500"
        eyebrow="Create"
        title="Script Writer"
        description={scriptMode === 'content' ? '7-Act Retention Formula — Negative Hook → Truth → Origin → Breaking Point → Transformation → Framework → Mission + CTA' : '10-Step Sales Framework — Story-driven product selling script'}
      />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Your Idea?</CardTitle>
                <CardDescription>
                  {scriptMode === 'content' ? 'Describe what you want to teach or share. AI creates a complete production-ready script.' : 'Create a sales script using the 10-step storytelling framework.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Script Mode Toggle */}
              <div className="space-y-2">
                <Label htmlFor="scriptMode">Script Mode</Label>
                <Select value={scriptMode} onValueChange={(value: 'content' | 'sales') => setScriptMode(value)}>
                  <SelectTrigger id="scriptMode" className={scriptMode === 'sales' ? 'border-green-500 bg-green-50' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">📚 Content Script (Teaching & Engagement)</SelectItem>
                    <SelectItem value="sales">💰 Sales Script (Product Selling)</SelectItem>
                  </SelectContent>
                </Select>
                {scriptMode === 'sales' && (
                  <p className="text-xs text-green-700 font-medium bg-green-100 p-2 rounded">
                    💰 Sales Mode: Generate scripts designed to sell your products using 10-step storytelling framework
                  </p>
                )}
              </div>

              {/* Sales Mode: Product Selector */}
              {scriptMode === 'sales' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="product">Select Product to Sell *</Label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Choose a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.length === 0 ? (
                          <SelectItem value="none" disabled>No products found - Create products first</SelectItem>
                        ) : (
                          products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.step1_callout ? '✅ ' : ''}
                              {product.name} - R{product.price} ({product.audienceLevel})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {products.length === 0 && (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        ⚠️ No products found. Visit the <a href="/dashboard/products" className="underline font-medium">Product Database</a> to create your first product.
                      </p>
                    )}
                    {selectedProductId && products.find((p) => p.id === selectedProductId)?.step1_callout && (
                      <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        ✅ This product has a pre-written 10-step framework. Will display instantly without AI generation.
                      </p>
                    )}
                    {selectedProductId && !products.find((p) => p.id === selectedProductId)?.step1_callout && (
                      <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                        💡 This product doesn't have a pre-written framework. AI will generate one from product data.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salesFormat">Sales Format</Label>
                    <Select value={salesFormat} onValueChange={setSalesFormat}>
                      <SelectTrigger id="salesFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reel">📱 Short-Form (Reel/TikTok)</SelectItem>
                        <SelectItem value="email">📧 Email Sales Sequence</SelectItem>
                        <SelectItem value="thread">🧵 Twitter/X Thread</SelectItem>
                        <SelectItem value="sales-page">📄 Sales Page Copy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Main Idea Input */}
              <div className="space-y-2">
                <Label htmlFor="idea">{scriptMode === 'sales' ? 'Angle or Hook (Optional)' : 'Your Content Idea *'}</Label>
                <Textarea
                  id="idea"
                  placeholder={
                    scriptMode === 'sales'
                      ? "Optional: Add a specific angle, hook, or context. If blank, AI will create the best sales script based on your product data."
                      : "e.g., 'Teach creators how to price their brand deals' or 'Share my journey from R750 to R100K brand partnerships'"
                  }
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {scriptMode === 'sales'
                      ? 'Sales scripts are built from your product data - idea field is optional'
                      : 'Be specific about what you want to teach or share'}
                  </p>
                  {stories.length > 0 && scriptMode === 'content' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStorySelector(!showStorySelector)}
                      className="gap-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Add Story ({stories.length})
                    </Button>
                  )}
                </div>
              </div>

              {/* Story Selector */}
              {showStorySelector && stories.length > 0 && (
                <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label>Select Proof Story from Story Extractor</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => {
                          setIdea((prev) =>
                            prev + '\n\nProof Story: ' + story.content +
                            `\nMetrics: ${story.metrics.before} → ${story.metrics.after} in ${story.metrics.timeframe}`
                          )
                          setShowStorySelector(false)
                        }}
                        className="w-full text-left p-3 bg-white border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-sm">{story.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {story.metrics.before} → {story.metrics.after} in {story.metrics.timeframe}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStorySelector(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Platform Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform (Optional)</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect best platform</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                    <SelectItem value="youtube-long">YouTube (Long-form)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(platform === 'youtube' || platform === 'youtube-long') ? (
                      <>
                        <SelectItem value="auto">Auto-optimize (5-15 min for YouTube)</SelectItem>
                        <SelectItem value="5min">5 minutes</SelectItem>
                        <SelectItem value="8min">8 minutes</SelectItem>
                        <SelectItem value="10min">10 minutes</SelectItem>
                        <SelectItem value="15min">15 minutes</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="auto">Auto-optimize duration</SelectItem>
                        <SelectItem value="15s">15 seconds</SelectItem>
                        <SelectItem value="30s">30 seconds</SelectItem>
                        <SelectItem value="60s">60 seconds</SelectItem>
                        <SelectItem value="90s">90 seconds</SelectItem>
                        <SelectItem value="3min">3 minutes</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {(platform === 'youtube' || platform === 'youtube-long') && (
                  <p className="text-xs text-purple-600 font-medium">
                    🎬 YouTube long-form: Script will be optimized for 5-15 minute deep-dive content
                  </p>
                )}
              </div>

              {/* NOCHILL Framework Options */}
              {scriptMode === 'content' && (
                <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <Label className="text-purple-900 font-semibold">NOCHILL Framework Options (Optional)</Label>
                  </div>
                  <p className="text-xs text-purple-700 mb-3">
                    Fine-tune your script using the NOCHILL Viral Scripting Master Guide frameworks
                  </p>

                  {/* 4E Content Type */}
                  <div className="space-y-2">
                    <Label htmlFor="contentType" className="text-sm">4E Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger id="contentType" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect (AI chooses best fit)</SelectItem>
                        <SelectItem value="entertain">🎭 Entertain (30%) - Story + Humor + Relatability</SelectItem>
                        <SelectItem value="educate">📚 Educate (35%) - Problem + Framework + Steps</SelectItem>
                        <SelectItem value="encourage">💪 Encourage (20%) - Struggle + Lesson + Hope</SelectItem>
                        <SelectItem value="earn">💰 Earn (15%) - Pain + Solution + CTA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PAIDS Revenue Stream */}
                  <div className="space-y-2">
                    <Label htmlFor="paidsStream" className="text-sm">PAIDS Revenue Stream</Label>
                    <Select value={paidsStream} onValueChange={setPaidsStream}>
                      <SelectTrigger id="paidsStream" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect (AI chooses best stream)</SelectItem>
                        <SelectItem value="products">🛍️ Products - Physical/digital products</SelectItem>
                        <SelectItem value="ads">📺 Ads & Affiliates - Sponsorships/partnerships</SelectItem>
                        <SelectItem value="information">🎓 Information - Courses/workshops</SelectItem>
                        <SelectItem value="deals">🤝 Deals - Brand collaborations</SelectItem>
                        <SelectItem value="services">⚙️ Services - Done-for-you/consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Genesis Framework Story Type */}
                  <div className="space-y-2">
                    <Label htmlFor="storyType" className="text-sm">Genesis Framework (Story Type)</Label>
                    <Select value={storyType} onValueChange={setStoryType}>
                      <SelectTrigger id="storyType" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect (AI chooses best story)</SelectItem>
                        <SelectItem value="origin">🌱 Origin - Build rapport & relatability</SelectItem>
                        <SelectItem value="struggle">💔 Struggle - Create empathy & validate pain</SelectItem>
                        <SelectItem value="transformation">🔄 Transformation - Prove method works</SelectItem>
                        <SelectItem value="breakthrough">💡 Breakthrough - Create 'aha' moments</SelectItem>
                        <SelectItem value="lesson">📖 Lesson - Share wisdom & prevent mistakes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hook Category (120 Hooks Bank) */}
                  <div className="space-y-2">
                    <Label htmlFor="hookCategory" className="text-sm">Hook Category (120 Hooks Bank)</Label>
                    <Select value={hookCategory} onValueChange={setHookCategory}>
                      <SelectTrigger id="hookCategory" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect (AI chooses best category)</SelectItem>
                        <SelectItem value="origin">🌱 Origin & Struggle - Relatability & connection</SelectItem>
                        <SelectItem value="transformation">🔄 Transformation - Social proof & validation</SelectItem>
                        <SelectItem value="lesson">📖 Lesson & Breakthrough - Educational & authority</SelectItem>
                        <SelectItem value="social_proof">⭐ Social Proof & Authority - Credibility</SelectItem>
                        <SelectItem value="curiosity">🔍 Curiosity & Pattern Interrupt - Viral potential</SelectItem>
                        <SelectItem value="controversy">🔥 Controversy & Hot Take - Debate & polarization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ICP Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="icp" className="text-sm">Target ICP</Label>
                    <Select value={icp} onValueChange={setIcp}>
                      <SelectTrigger id="icp" className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect from idea</SelectItem>
                        <SelectItem value="icp1">👔 ICP 1 — Called Expert (32–50, unexploited expertise)</SelectItem>
                        <SelectItem value="icp2">📱 ICP 2 — Content Creator Inspirer (18–35, aspiring)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shadow Fear */}
                  <div className="space-y-2">
                    <Label htmlFor="shadowFear" className="text-sm">Shadow Fear to Activate</Label>
                    <Select value={shadowFear} onValueChange={setShadowFear}>
                      <SelectTrigger id="shadowFear" className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🤖 Auto-detect</SelectItem>
                        <SelectItem value="wasted_life">Wasted Life (#1) — best years on someone else's dream</SelectItem>
                        <SelectItem value="generational_poverty">Generational Poverty Trap (#2) — repeating parents' story</SelectItem>
                        <SelectItem value="imposter_syndrome">Imposter Syndrome (#3) — not qualified enough</SelectItem>
                        <SelectItem value="wrong_path">Wrong Path Terror (#4) — chose wrong career, too late</SelectItem>
                        <SelectItem value="invisible_labor">Invisible Labor (#5) — working hard, nothing to show</SelectItem>
                        <SelectItem value="platform_dependency">Platform Dependency (#6) — algorithm can erase everything</SelectItem>
                        <SelectItem value="time_anxiety">Time Anxiety (#7) — already behind, everyone else is ahead</SelectItem>
                        <SelectItem value="relationship_loss">Relationship Loss (#8) — dream will cost loved ones</SelectItem>
                        <SelectItem value="spiritual_crisis">Spiritual Crisis (#9) — called or just chasing money?</SelectItem>
                        <SelectItem value="legacy_void">Legacy Void (#10) — dying without leaving anything</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Villain */}
                  <div className="space-y-2">
                    <Label htmlFor="villain" className="text-sm">Named Villain (system/situation)</Label>
                    <input
                      id="villain"
                      className="nc-tool-input w-full"
                      placeholder="e.g. the follower count myth, the salary trap, SARS..."
                      value={villain}
                      onChange={(e) => setVillain(e.target.value)}
                    />
                    <p className="text-xs text-purple-600">Attack a system or situation — never a person.</p>
                  </div>

                  <p className="text-xs text-purple-600 italic">
                    💡 Leave as "Auto-detect" for AI to choose optimal frameworks based on your idea
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className={`p-4 border rounded-md ${scriptMode === 'sales' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm font-medium mb-2 ${scriptMode === 'sales' ? 'text-green-800' : 'text-blue-800'}`}>
                  {scriptMode === 'sales' ? '💰 10-Step Sales Framework:' : '🎯 7-Act Retention Formula:'}
                </p>
                {scriptMode === 'sales' ? (
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• <strong>Hook:</strong> Call out specific audience with pain</li>
                    <li>• <strong>Problem Amplification:</strong> Emotional stakes of staying stuck</li>
                    <li>• <strong>Intrigue:</strong> Hint at the transformation</li>
                    <li>• <strong>Solution Intro:</strong> Present your product</li>
                    <li>• <strong>Credentials:</strong> Why you can help them</li>
                    <li>• <strong>Benefits Stack:</strong> What they get</li>
                    <li>• <strong>Social Proof:</strong> Testimonials & results</li>
                    <li>• <strong>Offer:</strong> Godfather value stack</li>
                    <li>• <strong>Scarcity:</strong> Urgency/exclusivity</li>
                    <li>• <strong>CTA:</strong> Clear action to purchase</li>
                  </ul>
                ) : (
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>Act 1: Negative Hook (0-15s):</strong> Stop scroll, open loop, emotional response</li>
                    <li>• <strong>Act 2: Uncomfortable Truth (15s-1min):</strong> Pattern interrupt, challenge beliefs</li>
                    <li>• <strong>Act 3: Origin Story (1-2.5min):</strong> Build credibility through vulnerability</li>
                    <li>• <strong>Act 4: Breaking Point (2.5-4min):</strong> Nuclear story, crisis moment</li>
                    <li>• <strong>Act 5: Transformation (4-5.5min):</strong> Decision point, rapid wins</li>
                    <li>• <strong>Act 6: Framework (5.5-6.5min):</strong> Tactical teaching, screenshot-worthy</li>
                    <li>• <strong>Act 7: Mission + CTA (6.5-7.5min):</strong> Rally cry, collective action</li>
                  </ul>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateScript}
                disabled={loading}
                className={`w-full ${scriptMode === 'sales' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating {scriptMode === 'sales' ? 'Sales' : ''} Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {scriptMode === 'sales' ? '💰 Generate Sales Script' : 'Generate Complete Script'}
                  </>
                )}
              </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
        <div>
          {script ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <Input
                        value={scriptTitle || script.title}
                        onChange={(e) => setScriptTitle(e.target.value)}
                        className="text-lg font-bold mb-1"
                        placeholder="Script title..."
                      />
                    ) : (
                      <CardTitle>{scriptTitle || script.title}</CardTitle>
                    )}
                    <CardDescription>Production-ready script</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={saveEdits} className="bg-green-600 hover:bg-green-700">
                          <FileText className="h-4 w-4 mr-2" />
                          Apply Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdits}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={saveScriptToLibrary}
                          className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}
                        >
                          {saveSuccess ? '✓ Saved!' : 'Save Script'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={enableEditing} className="bg-blue-50 hover:bg-blue-100">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={copyScript} className={copySuccess ? 'bg-green-100 border-green-500' : ''}>
                          <Copy className="h-4 w-4 mr-2" />
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadPDF}>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" onClick={saveToContentCards} className="bg-purple-50 hover:bg-purple-100 border-purple-300">
                          <Layers className="h-4 w-4 mr-2 text-purple-600" />
                          Content Card
                        </Button>
                        <Button size="sm" variant="outline" onClick={loadToTeleprompter} className="bg-cyan-50 hover:bg-cyan-100">
                          <Monitor className="h-4 w-4 mr-2" />
                          Teleprompter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook Science Section - Only show if hook exists */}
                {script.hook && (
                  <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎣</span>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Hook Science (R×A×C×U^B Formula)
                      </h3>
                    </div>

                    <div className="mb-3">
                      <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded">
                        {getHookTypeLabel(script.hook.type)}
                      </span>
                    </div>

                    {isEditing && editedScript && editedScript.hook ? (
                      <Textarea
                        value={editedScript.hook.text}
                        onChange={(e) => updateHookText(e.target.value)}
                        className="text-lg font-bold text-purple-900 mb-4 p-3 border-l-4 border-purple-600 min-h-[80px]"
                      />
                    ) : (
                      <p className="text-lg font-bold text-purple-900 mb-4 p-3 bg-white rounded-md border-l-4 border-purple-600">
                        "{script.hook.text}"
                      </p>
                    )}

                    <details className="mb-3">
                      <summary className="cursor-pointer text-sm font-semibold text-purple-700 hover:text-purple-900 mb-2">
                        📐 R×A×C×U^B Breakdown
                      </summary>
                      <div className="space-y-2 pl-4 text-sm border-l-2 border-purple-300">
                        <p><strong className="text-purple-700">R (Relevant):</strong> {script.hook.racub_breakdown.relevant}</p>
                        <p><strong className="text-purple-700">A (Awareness):</strong> {script.hook.racub_breakdown.awareness}</p>
                        <p><strong className="text-purple-700">C (Clarity):</strong> {script.hook.racub_breakdown.clarity}</p>
                        <p><strong className="text-purple-700">U (Unique):</strong> {script.hook.racub_breakdown.unique}</p>
                        <p><strong className="text-purple-700">B (Broadened):</strong> {script.hook.racub_breakdown.broadened}</p>
                      </div>
                    </details>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <div className="bg-white px-3 py-1.5 rounded-md border border-purple-200">
                        <strong className="text-purple-700">Shadow Fear:</strong> {script.hook.shadowFear}
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-md border border-purple-200">
                        <strong className="text-purple-700">Power Words:</strong> {script.hook.powerWords.join(', ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Script Display (7-Act Retention Formula or 10-Step Framework) */}
                {script.fullScript && (
                  <div className="p-5 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎬</span>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {script.actStructure ? '7-ACT RETENTION FORMULA' : 'THE 10-STEP STORYTELLING FRAMEWORK'}
                      </h3>
                    </div>

                    {/* Framework Overview Badge */}
                    <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-600 rounded text-xs">
                      <p className="font-semibold text-blue-900 mb-2">Framework Structure:</p>
                      {script.actStructure ? (
                        <div className="grid grid-cols-2 gap-1 text-blue-800">
                          <div>Act 1: Negative Hook</div>
                          <div>Act 5: Transformation</div>
                          <div>Act 2: Uncomfortable Truth</div>
                          <div>Act 6: Framework Teaching</div>
                          <div>Act 3: Origin Story</div>
                          <div>Act 7: Mission + CTA</div>
                          <div>Act 4: Breaking Point</div>
                          <div className="text-purple-600 font-semibold">R×A×C×U^B Hook Science</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1 text-blue-800">
                          <div>1. Call Out Audience</div>
                          <div>6. Provide Solution</div>
                          <div>2. Demand Attention</div>
                          <div>7. Show Credentials</div>
                          <div>3. Back Up Problem</div>
                          <div>8. Detail Benefits</div>
                          <div>4. Create Intrigue</div>
                          <div>9. Social Proof</div>
                          <div>5. Floodlight Problem</div>
                          <div>10. Godfather Offer</div>
                        </div>
                      )}
                    </div>

                    {/* Retention Devices Used (if available) */}
                    {script.retentionDevicesUsed && (
                      <div className="mb-4 p-3 bg-purple-100 border-l-4 border-purple-600 rounded text-xs">
                        <p className="font-semibold text-purple-900 mb-2">🎯 Retention Devices Deployed:</p>
                        <div className="grid grid-cols-2 gap-1 text-purple-800">
                          {script.retentionDevicesUsed.act1 && <div>Act 1: {script.retentionDevicesUsed.act1}</div>}
                          {script.retentionDevicesUsed.act2 && <div>Act 2: {script.retentionDevicesUsed.act2}</div>}
                          {script.retentionDevicesUsed.act3 && <div>Act 3: {script.retentionDevicesUsed.act3}</div>}
                          {script.retentionDevicesUsed.act4 && <div>Act 4: {script.retentionDevicesUsed.act4}</div>}
                          {script.retentionDevicesUsed.act5 && <div>Act 5: {script.retentionDevicesUsed.act5}</div>}
                          {script.retentionDevicesUsed.act6 && <div>Act 6: {script.retentionDevicesUsed.act6}</div>}
                          {script.retentionDevicesUsed.act7 && <div>Act 7: {script.retentionDevicesUsed.act7}</div>}
                        </div>
                      </div>
                    )}

                    <div className="bg-white p-4 rounded-md border border-green-200 max-h-[600px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                        {script.fullScript}
                      </pre>
                    </div>
                    <p className="text-xs text-green-700 mt-3">
                      ✅ This script follows the complete {script.actStructure ? '7-Act Retention Formula' : '10-step storytelling framework'} with clear divisions. Click "Teleprompter" above to load it for recording.
                    </p>
                  </div>
                )}

                {/* Divider - Only show if fiveLine exists */}
                {script.fiveLine && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-purple-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-purple-700 font-semibold">
                          ⬇️ Hook flows into 5-Line Method ⬇️
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Line 1: Context - Only show if fiveLine exists */}
                {script.fiveLine && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded">
                        LINE 1
                      </span>
                      <p className="text-xs font-semibold text-blue-600">
                        CONTEXT ({(isEditing && editedScript ? editedScript : script).fiveLine?.context.timestamp})
                      </p>
                    </div>
                    {isEditing && editedScript && editedScript.fiveLine ? (
                      <>
                        <Label className="text-xs text-blue-700 mb-1">Script:</Label>
                        <Textarea
                          value={editedScript.fiveLine.context.script}
                        onChange={(e) => updateFiveLineSection('context', 'script', e.target.value)}
                        className="font-medium text-blue-900 mb-2 min-h-[80px]"
                      />
                      <Label className="text-xs text-blue-700 mb-1 mt-2">Visual:</Label>
                      <Input
                        value={editedScript.fiveLine.context.visual}
                        onChange={(e) => updateFiveLineSection('context', 'visual', e.target.value)}
                        className="text-sm mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-blue-900 mb-2">{script.fiveLine.context.script}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-blue-700"><strong>Visual:</strong> {script.fiveLine.context.visual}</p>
                        {script.fiveLine.context.ubuntuPrinciple && (
                          <p className="text-blue-600"><strong>Ubuntu:</strong> {script.fiveLine.context.ubuntuPrinciple}</p>
                        )}
                        {script.fiveLine.context.shadowFear && (
                          <p className="text-blue-600"><strong>Shadow Fear:</strong> {script.fiveLine.context.shadowFear}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* Line 2: Collision - Only show if fiveLine exists */}
                {script.fiveLine && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-600 bg-red-200 px-2 py-1 rounded">
                      LINE 2
                    </span>
                    <p className="text-xs font-semibold text-red-600">
                      COLLISION ({(isEditing && editedScript ? editedScript : script).fiveLine?.collision.timestamp})
                    </p>
                  </div>
                  {isEditing && editedScript && editedScript.fiveLine ? (
                    <>
                      <Label className="text-xs text-red-700 mb-1">Script:</Label>
                      <Textarea
                        value={editedScript.fiveLine.collision.script}
                        onChange={(e) => updateFiveLineSection('collision', 'script', e.target.value)}
                        className="font-medium text-red-900 mb-2 min-h-[80px]"
                      />
                      <Label className="text-xs text-red-700 mb-1 mt-2">Visual:</Label>
                      <Input
                        value={editedScript.fiveLine.collision.visual}
                        onChange={(e) => updateFiveLineSection('collision', 'visual', e.target.value)}
                        className="text-sm mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-red-900 mb-2">{script.fiveLine.collision.script}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-red-700"><strong>Visual:</strong> {script.fiveLine.collision.visual}</p>
                        {script.fiveLine.collision.systemVillain && (
                          <p className="text-red-600"><strong>System Villain:</strong> {script.fiveLine.collision.systemVillain}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* Line 3: Conversion - Only show if fiveLine exists */}
                {script.fiveLine && (
                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-600 bg-purple-200 px-2 py-1 rounded">
                      LINE 3
                    </span>
                    <p className="text-xs font-semibold text-purple-600">
                      CONVERSION ({(isEditing && editedScript ? editedScript : script).fiveLine?.conversion.timestamp}) - 80% Teaching
                    </p>
                  </div>
                  {isEditing && editedScript && editedScript.fiveLine ? (
                    <>
                      <Label className="text-xs text-purple-700 mb-1">Script:</Label>
                      <Textarea
                        value={editedScript.fiveLine.conversion.script}
                        onChange={(e) => updateFiveLineSection('conversion', 'script', e.target.value)}
                        className="font-medium text-purple-900 mb-2 min-h-[80px]"
                      />
                      <Label className="text-xs text-purple-700 mb-1 mt-2">Visual:</Label>
                      <Input
                        value={editedScript.fiveLine.conversion.visual}
                        onChange={(e) => updateFiveLineSection('conversion', 'visual', e.target.value)}
                        className="text-sm mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-purple-900 mb-2">{script.fiveLine.conversion.script}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-purple-700"><strong>Visual:</strong> {script.fiveLine.conversion.visual}</p>
                        {script.fiveLine.conversion.framework && (
                          <p className="text-purple-600"><strong>Framework:</strong> {script.fiveLine.conversion.framework}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* Line 4: Calibration - Only show if fiveLine exists */}
                {script.fiveLine && (
                <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-200 px-2 py-1 rounded">
                      LINE 4
                    </span>
                    <p className="text-xs font-semibold text-orange-600">
                      CALIBRATION ({(isEditing && editedScript ? editedScript : script).fiveLine?.calibration.timestamp}) - 20% Proof
                    </p>
                  </div>
                  {isEditing && editedScript && editedScript.fiveLine ? (
                    <>
                      <Label className="text-xs text-orange-700 mb-1">Script:</Label>
                      <Textarea
                        value={editedScript.fiveLine.calibration.script}
                        onChange={(e) => updateFiveLineSection('calibration', 'script', e.target.value)}
                        className="font-medium text-orange-900 mb-2 min-h-[80px]"
                      />
                      <Label className="text-xs text-orange-700 mb-1 mt-2">Visual:</Label>
                      <Input
                        value={editedScript.fiveLine.calibration.visual}
                        onChange={(e) => updateFiveLineSection('calibration', 'visual', e.target.value)}
                        className="text-sm mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-orange-900 mb-2">{script.fiveLine.calibration.script}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-orange-700"><strong>Visual:</strong> {script.fiveLine.calibration.visual}</p>
                        {script.fiveLine.calibration.storyUsed && (
                          <p className="text-orange-600"><strong>Story:</strong> {script.fiveLine.calibration.storyUsed}</p>
                        )}
                        {script.fiveLine.calibration.numbers && (
                          <p className="text-orange-600"><strong>Numbers:</strong> {script.fiveLine.calibration.numbers}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* Line 5: Community - Only show if fiveLine exists */}
                {script.fiveLine && (
                <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                      LINE 5
                    </span>
                    <p className="text-xs font-semibold text-green-600">
                      COMMUNITY ({(isEditing && editedScript ? editedScript : script).fiveLine?.community.timestamp}) - Ubuntu CTA
                    </p>
                  </div>
                  {isEditing && editedScript && editedScript.fiveLine ? (
                    <>
                      <Label className="text-xs text-green-700 mb-1">Script:</Label>
                      <Textarea
                        value={editedScript.fiveLine.community.script}
                        onChange={(e) => updateFiveLineSection('community', 'script', e.target.value)}
                        className="font-medium text-green-900 mb-2 min-h-[80px]"
                      />
                      <Label className="text-xs text-green-700 mb-1 mt-2">Visual:</Label>
                      <Input
                        value={editedScript.fiveLine.community.visual}
                        onChange={(e) => updateFiveLineSection('community', 'visual', e.target.value)}
                        className="text-sm mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-green-900 mb-2">{script.fiveLine.community.script}</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-green-700"><strong>Visual:</strong> {script.fiveLine.community.visual}</p>
                        {script.fiveLine.community.collectiveAction && (
                          <p className="text-green-600"><strong>Collective Action:</strong> {script.fiveLine.community.collectiveAction}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* B-Roll Suggestions */}
                {script.bRoll && script.bRoll.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    B-ROLL SUGGESTIONS:
                  </p>
                  {isEditing && editedScript && editedScript.bRoll ? (
                    <div className="space-y-2">
                      {editedScript.bRoll.map((item, index) => (
                        <Input
                          key={index}
                          value={item}
                          onChange={(e) => updateBRoll(index, e.target.value)}
                          className="text-sm"
                          placeholder={`B-Roll ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {script.bRoll.map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {index + 1}. {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                )}

                {/* Text Overlays */}
                {script.textOverlays && script.textOverlays.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    TEXT OVERLAYS:
                  </p>
                  {isEditing && editedScript && editedScript.textOverlays ? (
                    <div className="space-y-2">
                      {editedScript.textOverlays.map((item, index) => (
                        <Input
                          key={index}
                          value={item}
                          onChange={(e) => updateTextOverlay(index, e.target.value)}
                          className="text-sm"
                          placeholder={`Text Overlay ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {script.textOverlays.map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {index + 1}. {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                )}

                {/* Framework Compliance Report */}
                {(script.ubuntu_check || script.scripting_principles_check || script.compliance) && (
                  <div className="pt-6 border-t space-y-4">
                    <p className="text-[11px] font-heading font-black uppercase tracking-wider text-[#0A0A0A]">Framework Compliance Report</p>
                    <p className="text-[11px] text-[#8A8071] -mt-2">What the AI followed to generate this script</p>

                    {/* Key metadata */}
                    {script.compliance && (
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'ICP', value: script.compliance.icp },
                          { label: 'Shadow Fear', value: script.compliance.shadowFear },
                          { label: 'Proof Story', value: script.compliance.proofStory },
                          { label: 'Villain', value: script.compliance.villain },
                          { label: 'Business Outcome', value: script.compliance.businessOutcome },
                          { label: 'PAIDS', value: script.compliance.paidsCategory },
                          { label: '4E', value: script.compliance.fourE },
                        ].filter(i => i.value).map((item) => (
                          <div key={item.label} className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#DED5C2]">
                            <p className="text-[9px] font-heading font-bold uppercase tracking-wider text-[#8A8071] mb-0.5">{item.label}</p>
                            <p className="text-[11px] font-heading font-semibold text-[#1F1B16] leading-snug">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Atomic share line */}
                    {script.compliance?.atomicShareLine && (
                      <div className="p-3.5 bg-[#0A0A0A] rounded-xl">
                        <p className="text-[9px] font-heading font-bold uppercase tracking-wider text-[#C9A646] mb-1.5">Atomic Share Line</p>
                        <p className="text-[12px] font-heading font-semibold text-white leading-relaxed">"{script.compliance.atomicShareLine}"</p>
                      </div>
                    )}

                    {/* Retention loop */}
                    {script.compliance?.retentionLoop && (
                      <div className="p-3 bg-[#FAF7F0] border border-[#C9A646]/30 rounded-xl">
                        <p className="text-[9px] font-heading font-bold uppercase tracking-wider text-[#C9A646] mb-1">Retention Loop Tease</p>
                        <p className="text-[12px] font-heading font-semibold text-[#1F1B16]">"{script.compliance.retentionLoop}"</p>
                      </div>
                    )}

                    {/* Section 13 checklist */}
                    {script.compliance?.section13 && (
                      <div>
                        <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">Section 13 — Master Framework Checklist</p>
                        <div className="space-y-1.5">
                          {Object.entries(script.compliance.section13).map(([key, value]) => {
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                            const val = value as string
                            const passed = val.startsWith('✅')
                            const isNA = val.startsWith('N/A')
                            return (
                              <div key={key} className="flex items-start gap-2 py-1.5 border-b border-[#DED5C2]/50 last:border-0">
                                <span className={`text-[12px] flex-shrink-0 mt-0.5 ${passed ? 'text-green-600' : isNA ? 'text-[#B0A898]' : 'text-red-500'}`}>
                                  {passed ? '✅' : isNA ? '—' : '❌'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] font-heading font-bold text-[#0A0A0A] uppercase tracking-wide">{label}: </span>
                                  <span className="text-[10px] text-[#5C5448]">{val.replace(/^✅\s*|^❌\s*|^N\/A\s*—?\s*/i, '')}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ubuntu Check */}
                    {script.ubuntu_check && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 mb-2">Ubuntu Story Arc</p>
                        <div className="space-y-1 text-[11px] text-amber-700">
                          <p>{script.ubuntu_check.we_over_i}</p>
                          <p>{script.ubuntu_check.system_villain}</p>
                          <p>{script.ubuntu_check.collective_result}</p>
                        </div>
                      </div>
                    )}

                    {/* 4 Principles Check */}
                    {(script.scripting_principles_check || script.compliance?.principlesApplied) && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-emerald-600 mb-2">4 Scripting Principles Applied</p>
                        {script.scripting_principles_check && (
                          <div className="space-y-1 text-[11px] text-emerald-700">
                            <p>{script.scripting_principles_check.negativity}</p>
                            <p>{script.scripting_principles_check.you_format}</p>
                            <p>{script.scripting_principles_check.short_simple}</p>
                            <p>{script.scripting_principles_check.audible_flow}</p>
                          </div>
                        )}
                        {script.compliance?.principlesApplied && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {script.compliance.principlesApplied.map((p: string) => (
                              <span key={p} className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[10px] font-heading font-bold text-emerald-700">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No script generated yet
                </h3>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Enter your content idea and click "Generate Complete Script" to create
                  a production-ready script using the 7-Act Retention Formula with R×A×C×U^B Hook Science.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
