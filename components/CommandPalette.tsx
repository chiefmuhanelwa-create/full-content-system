'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, ArrowRight, Zap, FileText, BookOpen, Brain, Cpu, LayoutDashboard,
  Target, TrendingUp, BarChart2, Calendar, BookMarked, Star, Repeat, PenTool,
  Tv2, Archive, Settings, History, Globe, Mic, MonitorPlay, Package, Layers,
  FlaskConical, LayoutGrid, Megaphone, Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tool {
  name: string
  href: string
  category: string
  icon: any
}

const tools: Tool[] = [
  { name: 'Dashboard', href: '/dashboard', category: 'Command', icon: LayoutDashboard },
  { name: 'My Algorithm', href: '/dashboard/my-algorithm', category: 'Command', icon: Cpu },
  { name: 'Hook Generator', href: '/dashboard/hooks', category: 'Create', icon: Zap },
  { name: 'Script Writer', href: '/dashboard/scripts', category: 'Create', icon: FileText },
  { name: 'Storytelling Studio', href: '/dashboard/storytelling', category: 'Create', icon: Tv2 },
  { name: 'Story Extractor', href: '/dashboard/stories', category: 'Create', icon: BookOpen },
  { name: 'Teleprompter', href: '/dashboard/teleprompter', category: 'Create', icon: MonitorPlay },
  { name: 'Repurpose', href: '/dashboard/repurpose', category: 'Create', icon: Repeat },
  { name: 'Content Studio', href: '/dashboard/content-studio', category: 'Create', icon: PenTool },
  { name: 'Fear Analyzer', href: '/dashboard/fears', category: 'Audience', icon: Brain },
  { name: 'ICP Pain Library', href: '/dashboard/icp-pain-library', category: 'Audience', icon: Target },
  { name: 'Competitor Intel', href: '/dashboard/competitor', category: 'Audience', icon: Globe },
  { name: 'Trend Scanner', href: '/dashboard/trends', category: 'Audience', icon: TrendingUp },
  { name: 'Brand Voice', href: '/dashboard/brand-voice', category: 'Audience', icon: Mic },
  { name: 'Hook Bank', href: '/dashboard/hook-bank', category: 'Library', icon: BookMarked },
  { name: 'Story Bank', href: '/dashboard/story-bank', category: 'Library', icon: BookOpen },
  { name: 'Saved Scripts', href: '/dashboard/saved-scripts', category: 'Library', icon: FileText },
  { name: 'Content Vault', href: '/dashboard/vault', category: 'Library', icon: Archive },
  { name: 'History', href: '/dashboard/history', category: 'Library', icon: History },
  { name: 'Products', href: '/dashboard/products', category: 'Revenue', icon: Package },
  { name: 'Product Lab', href: '/dashboard/product-planning', category: 'Revenue', icon: FlaskConical },
  { name: 'Godfather Offers', href: '/dashboard/offers', category: 'Revenue', icon: Star },
  { name: 'Pitch Builder', href: '/dashboard/pitch', category: 'Revenue', icon: Target },
  { name: 'CTA Optimizer', href: '/dashboard/cta-optimizer', category: 'Revenue', icon: Zap },
  { name: 'Revenue Tracker', href: '/dashboard/revenue', category: 'Revenue', icon: Wallet },
  { name: 'Content Calendar', href: '/dashboard/content-calendar-plus', category: 'Planning', icon: Calendar },
  { name: 'Batch Planner', href: '/dashboard/batch-planner', category: 'Planning', icon: Layers },
  { name: 'Analytics', href: '/dashboard/analytics', category: 'Planning', icon: BarChart2 },
  { name: 'Content Cards', href: '/dashboard/content-cards', category: 'Planning', icon: LayoutGrid },
  { name: 'Campaigns', href: '/dashboard/campaigns', category: 'Planning', icon: Megaphone },
  { name: 'Settings', href: '/dashboard/settings', category: 'System', icon: Settings },
]

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const filtered = query.trim() === ''
    ? tools
    : tools.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = useCallback((href: string) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].href)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, filtered, selectedIndex, handleSelect, onClose])

  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.children[selectedIndex] as HTMLElement
    if (selected) selected.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-[#E4E4E7] overflow-hidden">

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E4E4E7]">
          <Search className="w-4 h-4 text-[#A1A1AA] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-[#18181B] text-sm font-display placeholder-[#A1A1AA] outline-none"
          />
          <kbd className="text-[10px] font-display font-semibold text-[#A1A1AA] bg-[#F4F4F5] border border-[#E4E4E7] px-1.5 py-0.5 rounded hidden sm:block">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-[#71717A] py-8 text-sm font-display">
              No tools match &ldquo;{query}&rdquo;
            </p>
          ) : filtered.map((tool, i) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.href}
                onClick={() => handleSelect(tool.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === selectedIndex ? 'bg-blue-50' : 'hover:bg-[#F9FAFB]'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-lg flex-shrink-0',
                  i === selectedIndex ? 'bg-blue-100' : 'bg-[#F4F4F5]'
                )}>
                  <Icon className={cn('w-3.5 h-3.5', i === selectedIndex ? 'text-blue-600' : 'text-[#71717A]')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-display font-medium truncate', i === selectedIndex ? 'text-blue-600' : 'text-[#18181B]')}>
                    {tool.name}
                  </p>
                  <p className="text-[11px] font-display text-[#A1A1AA]">{tool.category}</p>
                </div>
                {i === selectedIndex && <ArrowRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#F4F4F5] flex items-center gap-5 bg-[#FAFAFA]">
          <span className="text-[10px] font-display text-[#A1A1AA] flex items-center gap-1">
            <kbd className="bg-white border border-[#E4E4E7] px-1 py-0.5 rounded text-[9px]">↑↓</kbd> navigate
          </span>
          <span className="text-[10px] font-display text-[#A1A1AA] flex items-center gap-1">
            <kbd className="bg-white border border-[#E4E4E7] px-1 py-0.5 rounded text-[9px]">↵</kbd> open
          </span>
          <span className="text-[10px] font-display text-[#A1A1AA] flex items-center gap-1">
            <kbd className="bg-white border border-[#E4E4E7] px-1 py-0.5 rounded text-[9px]">ESC</kbd> close
          </span>
          <span className="ml-auto text-[10px] font-display text-[#D4D4D8]">{filtered.length} tools</span>
        </div>
      </div>
    </div>
  )
}
