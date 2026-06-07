'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Zap, FileText, BookOpen, Brain, LayoutDashboard, LogOut, History,
  Cpu, Mic, Layers, Target, TrendingUp, BarChart2,
  Calendar, BookMarked, ShoppingBag, Star, Repeat, PenTool,
  Tv2, Archive, Settings, ChevronDown, ChevronRight, Globe,
  Package, MonitorPlay, User
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
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Command',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & quick launch' },
      { name: 'My Algorithm', href: '/dashboard/my-algorithm', icon: Cpu, description: 'Creator DNA + audiences', badge: 'CORE' },
    ],
  },
  {
    label: 'Create',
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
    items: [
      { name: 'Fear Analyzer', href: '/dashboard/fears', icon: Brain, description: '10 Shadow Fears' },
      { name: 'ICP Pain Library', href: '/dashboard/icp-pain-library', icon: Target, description: 'Audience pain database' },
      { name: 'Competitor Intel', href: '/dashboard/competitor', icon: Globe, description: 'Content gap analysis' },
      { name: 'Trend Scanner', href: '/dashboard/trends', icon: TrendingUp, description: 'What\'s trending now' },
      { name: 'Brand Voice', href: '/dashboard/brand-voice', icon: Mic, description: 'Voice score + rewrite' },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Hook Bank', href: '/dashboard/hook-bank', icon: BookMarked, description: 'All saved hooks' },
      { name: 'Story Bank', href: '/dashboard/story-bank', icon: BookOpen, description: '10 proof stories' },
      { name: 'Saved Scripts', href: '/dashboard/saved-scripts', icon: FileText, description: 'Script library' },
      { name: 'Content Vault', href: '/dashboard/vault', icon: Archive, description: '110+ pre-built ideas' },
      { name: 'History', href: '/dashboard/history', icon: History, description: 'Activity timeline' },
    ],
  },
  {
    label: 'Revenue',
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
    items: [
      { name: 'Content Calendar', href: '/dashboard/content-calendar-plus', icon: Calendar, description: '4E-balanced schedule' },
      { name: 'Batch Planner', href: '/dashboard/batch-planner', icon: Layers, description: '22-day content plan' },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2, description: 'Performance diagnosis' },
      { name: 'Content Cards', href: '/dashboard/content-cards', icon: BarChart2, description: 'Per-post metric cards' },
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: Target, description: 'Launch management' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account settings' },
    ],
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
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

  const userName = session?.user?.name?.split(' ')[0] || 'Ndivhuwo'
  const userHandle = '@nochill_god'

  return (
    <nav className="w-56 bg-[#0F0F0F] h-full flex flex-col flex-shrink-0 border-r border-white/[0.05]">

      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/[0.06] flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#C9A646] flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(201,166,70,0.35)] group-hover:shadow-[0_0_22px_rgba(201,166,70,0.55)] transition-shadow">
            <span className="text-[#0A0A0A] font-heading font-black text-sm leading-none">N</span>
          </div>
          <div>
            <p className="font-heading font-black text-white tracking-[0.18em] text-[11px] uppercase leading-none">NOCHILL</p>
            <p className="text-[10px] text-white/35 font-heading tracking-wide mt-0.5 leading-none">Content Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {navGroups.map((group) => {
          const isOpen = !collapsed[group.label]
          const hasActive = isGroupActive(group)

          return (
            <div key={group.label} className="mb-0.5">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-white/[0.04] transition-colors"
              >
                <span className={cn(
                  'text-[10px] font-heading font-black uppercase tracking-[0.16em]',
                  hasActive ? 'text-[#C9A646]' : 'text-white/30'
                )}>
                  {group.label}
                </span>
                {isOpen
                  ? <ChevronDown className="w-3 h-3 text-white/20" />
                  : <ChevronRight className="w-3 h-3 text-white/20" />
                }
              </button>

              {isOpen && (
                <div className="mt-0.5 space-y-px">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={cn(
                          'flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all',
                          isActive
                            ? 'bg-[#C9A646]/[0.12] border-l-2 border-[#C9A646] pl-[9px]'
                            : 'border-l-2 border-transparent hover:bg-white/[0.05] hover:border-white/10'
                        )}>
                          <Icon className={cn(
                            'h-3.5 w-3.5 flex-shrink-0',
                            isActive ? 'text-[#C9A646]' : 'text-white/40'
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={cn(
                                'text-[12.5px] font-heading font-semibold truncate leading-none',
                                isActive ? 'text-[#C9A646]' : 'text-white/75'
                              )}>
                                {item.name}
                              </p>
                              {item.badge && (
                                <span className="text-[8px] font-heading font-black px-1.5 py-0.5 bg-[#C9A646] text-[#0A0A0A] rounded tracking-widest uppercase flex-shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[10px] text-white/25 truncate mt-0.5 leading-none font-heading">
                                {item.description}
                              </p>
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

      {/* User + logout — always visible at bottom */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3 bg-[#0A0A0A]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E6C871] to-[#8C6F1F] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-heading font-bold text-white/90 truncate leading-none">{userName}</p>
            <p className="text-[10px] text-white/35 truncate mt-0.5 leading-none">{userHandle}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all text-[11px] font-heading font-semibold border border-white/[0.06] hover:border-white/[0.12]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
