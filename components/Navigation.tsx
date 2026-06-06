'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Zap, FileText, BookOpen, Brain, LayoutDashboard, LogOut, History,
  Cpu, Mic, Layers, Target, TrendingUp, Video, BarChart2,
  Calendar, BookMarked, ShoppingBag, Star, Repeat, Users, PenTool,
  Tv2, Archive, Settings, ChevronDown, ChevronRight, Globe, Heart,
  Lightbulb, Package, MonitorPlay
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type NavItem = {
  name: string
  href: string
  icon: any
  description?: string
  badge?: string
}

type NavGroup = {
  label: string
  icon: any
  color: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Command',
    icon: Cpu,
    color: 'text-[#D4A82F]',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & quick launch' },
      { name: 'My Algorithm', href: '/dashboard/my-algorithm', icon: Cpu, description: 'Creator DNA + audiences', badge: 'CORE' },
    ],
  },
  {
    label: 'Create',
    icon: PenTool,
    color: 'text-blue-400',
    items: [
      { name: 'Hook Generator', href: '/dashboard/hooks', icon: Zap, description: 'R×A×C×U^B formula' },
      { name: 'Script Writer', href: '/dashboard/scripts', icon: FileText, description: '7-Act + 10-Step Sales' },
      { name: 'Storytelling Studio', href: '/dashboard/storytelling', icon: Tv2, description: '5 Story Types + Arc' },
      { name: 'Story Extractor', href: '/dashboard/stories', icon: BookOpen, description: 'Raw notes → proof story' },
      { name: 'Teleprompter', href: '/dashboard/teleprompter', icon: MonitorPlay, description: 'Record to camera' },
      { name: 'Repurpose', href: '/dashboard/repurpose', icon: Repeat, description: 'Cross-platform adapt' },
      { name: 'Content Studio', href: '/dashboard/content-studio', icon: PenTool, description: 'Full editing suite' },
    ],
  },
  {
    label: 'Audience',
    icon: Brain,
    color: 'text-purple-400',
    items: [
      { name: 'Fear Analyzer', href: '/dashboard/fears', icon: Brain, description: '10 Shadow Fears mapped' },
      { name: 'ICP Pain Library', href: '/dashboard/icp-pain-library', icon: Target, description: 'Audience pain database' },
      { name: 'Competitor Intel', href: '/dashboard/competitor', icon: Globe, description: 'Content gap analysis' },
      { name: 'Trend Scanner', href: '/dashboard/trends', icon: TrendingUp, description: 'What\'s trending now' },
      { name: 'Brand Voice', href: '/dashboard/brand-voice', icon: Mic, description: 'Voice score + rewrite' },
    ],
  },
  {
    label: 'Library',
    icon: Archive,
    color: 'text-emerald-400',
    items: [
      { name: 'Hook Bank', href: '/dashboard/hook-bank', icon: BookMarked, description: 'All saved hooks' },
      { name: 'Story Bank', href: '/dashboard/story-bank', icon: Heart, description: '10 proof stories' },
      { name: 'Saved Scripts', href: '/dashboard/saved-scripts', icon: FileText, description: 'Script library' },
      { name: 'Content Vault', href: '/dashboard/vault', icon: Archive, description: '110+ pre-built ideas' },
      { name: 'History', href: '/dashboard/history', icon: History, description: 'Activity timeline' },
    ],
  },
  {
    label: 'Revenue',
    icon: ShoppingBag,
    color: 'text-orange-400',
    items: [
      { name: 'Products', href: '/dashboard/products', icon: Package, description: 'Full product catalogue' },
      { name: 'Godfather Offers', href: '/dashboard/offers', icon: Star, description: 'Offer stack builder' },
      { name: 'Pitch Builder', href: '/dashboard/pitch', icon: Target, description: '5 Pillars pitch system' },
      { name: 'CTA Optimizer', href: '/dashboard/cta-optimizer', icon: Zap, description: 'CTA science + variants' },
      { name: 'Revenue Tracker', href: '/dashboard/revenue', icon: TrendingUp, description: 'PAIDS income tracking' },
    ],
  },
  {
    label: 'Planning',
    icon: Calendar,
    color: 'text-indigo-400',
    items: [
      { name: 'Content Calendar', href: '/dashboard/content-calendar-plus', icon: Calendar, description: '4E-balanced schedule' },
      { name: 'Batch Planner', href: '/dashboard/batch-planner', icon: Layers, description: '22-day content plan' },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2, description: 'Performance diagnosis' },
      { name: 'Content Cards', href: '/dashboard/content-cards', icon: BarChart2, description: 'Per-post metric cards' },
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: Target, description: 'Launch management' },
    ],
  },
  {
    label: 'Visuals',
    icon: Lightbulb,
    color: 'text-pink-400',
    items: [
      { name: 'Visual Generator', href: '/dashboard/visuals', icon: Lightbulb, description: 'Thumbnails + b-roll' },
      { name: 'Platform Adapter', href: '/dashboard/adapter', icon: Repeat, description: 'LinkedIn, TikTok, X' },
      { name: 'Formula Writer', href: '/dashboard/formulas', icon: Layers, description: 'PAS, AIDA, DRIP, BAB' },
    ],
  },
  {
    label: 'System',
    icon: Settings,
    color: 'text-[#444]',
    items: [
      { name: 'Operations', href: '/dashboard/operations', icon: Settings, description: 'Seed data + health' },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account settings' },
    ],
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    System: true,
  })

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <nav className="w-56 bg-[#111111] border-r border-[#1E1E1E] h-screen flex flex-col flex-shrink-0">

      {/* Brand header */}
      <div className="px-4 py-4 border-b border-[#1E1E1E]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#D4A82F] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_12px_rgba(212,168,47,0.4)] transition-shadow">
            <span className="text-[#111111] font-heading font-black text-sm">N</span>
          </div>
          <div>
            <p className="font-heading font-black text-white tracking-widest text-xs uppercase leading-none">NOCHILL</p>
            <p className="text-[10px] text-[#333] font-heading tracking-wide mt-0.5">Content Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-0.5 px-2">
          {navGroups.map((group) => {
            const GroupIcon = group.icon
            const isOpen = !collapsed[group.label]
            const hasActive = isGroupActive(group)

            return (
              <div key={group.label} className="mb-0.5">
                {/* Group toggle */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left nav-item-transition',
                    hasActive
                      ? 'bg-[#1C1C1C]'
                      : 'hover:bg-[#161616]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className={cn('w-3 h-3 flex-shrink-0', group.color)} />
                    <span className={cn(
                      'text-[10px] font-heading font-black uppercase tracking-[0.12em]',
                      hasActive ? 'text-[#D4A82F]' : 'text-[#444]'
                    )}>
                      {group.label}
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronDown className="w-2.5 h-2.5 text-[#333]" />
                    : <ChevronRight className="w-2.5 h-2.5 text-[#333]" />
                  }
                </button>

                {/* Group items */}
                {isOpen && (
                  <div className="ml-1.5 mt-0.5 space-y-0.5 border-l border-[#1E1E1E] pl-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                      return (
                        <Link key={item.href} href={item.href}>
                          <div className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded-lg nav-item-transition',
                            isActive
                              ? 'bg-[#D4A82F]/10 border border-[#D4A82F]/20'
                              : 'hover:bg-[#161616] border border-transparent'
                          )}>
                            <Icon className={cn(
                              'h-3 w-3 flex-shrink-0',
                              isActive ? 'text-[#D4A82F]' : 'text-[#3A3A3A]'
                            )} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={cn(
                                  'text-xs font-heading font-semibold truncate leading-none',
                                  isActive ? 'text-[#D4A82F]' : 'text-[#999]'
                                )}>
                                  {item.name}
                                </p>
                                {item.badge && (
                                  <span className="nc-badge flex-shrink-0">{item.badge}</span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-[10px] text-[#333] truncate mt-0.5 leading-none">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* User + sign out */}
      <div className="border-t border-[#1E1E1E] p-3">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
            <span className="text-[#D4A82F] font-heading font-black text-xs">N</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading font-bold text-[#888] truncate">Ndivhuwo</p>
            <p className="text-[10px] text-[#333] truncate">@nochill_god</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#333] hover:text-[#888] hover:bg-[#1C1C1C] nav-item-transition text-[11px] font-heading font-semibold"
        >
          <LogOut className="h-3 w-3" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
