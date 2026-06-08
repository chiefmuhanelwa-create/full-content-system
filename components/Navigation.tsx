'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Zap, FileText, BookOpen, Brain, LayoutDashboard, LogOut, History,
  Cpu, Mic, Layers, Target, TrendingUp, BarChart2,
  Calendar, BookMarked, ShoppingBag, Star, Repeat, PenTool,
  Tv2, Archive, Settings, ChevronDown, ChevronRight, Globe,
  Package, MonitorPlay, FlaskConical, Search, X,
  LayoutGrid, Megaphone, Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type NavItem = {
  name: string
  href: string
  icon: any
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
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Algorithm', href: '/dashboard/my-algorithm', icon: Cpu, badge: 'CORE' },
    ],
  },
  {
    label: 'Create',
    items: [
      { name: 'Hook Generator', href: '/dashboard/hooks', icon: Zap },
      { name: 'Script Writer', href: '/dashboard/scripts', icon: FileText },
      { name: 'Storytelling Studio', href: '/dashboard/storytelling', icon: Tv2 },
      { name: 'Story Extractor', href: '/dashboard/stories', icon: BookOpen },
      { name: 'Teleprompter', href: '/dashboard/teleprompter', icon: MonitorPlay },
      { name: 'Repurpose', href: '/dashboard/repurpose', icon: Repeat },
      { name: 'Content Studio', href: '/dashboard/content-studio', icon: PenTool },
    ],
  },
  {
    label: 'Audience',
    items: [
      { name: 'Fear Analyzer', href: '/dashboard/fears', icon: Brain },
      { name: 'ICP Pain Library', href: '/dashboard/icp-pain-library', icon: Target },
      { name: 'Competitor Intel', href: '/dashboard/competitor', icon: Globe },
      { name: 'Trend Scanner', href: '/dashboard/trends', icon: TrendingUp },
      { name: 'Brand Voice', href: '/dashboard/brand-voice', icon: Mic },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Hook Bank', href: '/dashboard/hook-bank', icon: BookMarked },
      { name: 'Story Bank', href: '/dashboard/story-bank', icon: BookOpen },
      { name: 'Saved Scripts', href: '/dashboard/saved-scripts', icon: FileText },
      { name: 'Content Vault', href: '/dashboard/vault', icon: Archive },
      { name: 'History', href: '/dashboard/history', icon: History },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Product Lab', href: '/dashboard/product-planning', icon: FlaskConical, badge: 'NEW' },
      { name: 'Godfather Offers', href: '/dashboard/offers', icon: Star },
      { name: 'Pitch Builder', href: '/dashboard/pitch', icon: Target },
      { name: 'CTA Optimizer', href: '/dashboard/cta-optimizer', icon: Zap },
      { name: 'Revenue Tracker', href: '/dashboard/revenue', icon: Wallet },
    ],
  },
  {
    label: 'Planning',
    items: [
      { name: 'Content Calendar', href: '/dashboard/content-calendar-plus', icon: Calendar },
      { name: 'Batch Planner', href: '/dashboard/batch-planner', icon: Layers },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
      { name: 'Content Cards', href: '/dashboard/content-cards', icon: LayoutGrid },
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

interface NavigationProps {
  isOpen?: boolean
  onClose?: () => void
  onSearchOpen?: () => void
}

export function Navigation({ isOpen = false, onClose, onSearchOpen }: NavigationProps) {
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
    <nav className={cn(
      "w-64 bg-white flex flex-col border-r border-[#E4E4E7]",
      "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
      "lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>

      {/* Brand */}
      <div className="px-5 py-4 border-b border-[#F4F4F5] flex-shrink-0 flex items-center justify-between">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-black text-xs leading-none">N</span>
          </div>
          <div>
            <p className="font-display font-black text-[#18181B] text-[15px] tracking-tight leading-none">NOCHILL</p>
            <p className="text-[10px] text-[#A1A1AA] font-display mt-0.5 leading-none">Content Intelligence</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#71717A] hover:bg-[#F4F4F8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-[#F4F4F5] flex-shrink-0">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F4F4F8] border border-[#E4E4E7] w-full text-left hover:border-[#D4D4D8] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] flex-shrink-0" />
          <span className="text-[12px] font-display text-[#A1A1AA] flex-1">Search tools...</span>
          <kbd className="text-[9px] font-display text-[#D4D4D8] bg-white border border-[#E4E4E7] px-1.5 py-0.5 rounded hidden sm:block">⌘K</kbd>
        </button>
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
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#F4F4F8] transition-colors"
              >
                <span className={cn(
                  'text-[10px] font-display font-semibold uppercase tracking-widest',
                  hasActive ? 'text-[#71717A]' : 'text-[#A1A1AA]'
                )}>
                  {group.label}
                </span>
                {isOpen
                  ? <ChevronDown className="w-3 h-3 text-[#D4D4D8]" />
                  : <ChevronRight className="w-3 h-3 text-[#D4D4D8]" />
                }
              </button>

              {isOpen && (
                <div className="mt-0.5 space-y-px">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                      || (item.href === '/dashboard' && pathname === '/dashboard')

                    return (
                      <Link key={item.href} href={item.href} onClick={onClose}>
                        <div className={cn(
                          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all',
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-[#71717A] hover:bg-[#F4F4F8] hover:text-[#18181B]'
                        )}>
                          <Icon className={cn(
                            'h-4 w-4 flex-shrink-0',
                            isActive ? 'text-blue-600' : 'text-[#A1A1AA]'
                          )} />
                          <div className="flex-1 min-w-0 flex items-center gap-1.5">
                            <p className={cn(
                              'text-[14px] font-display truncate leading-none',
                              isActive ? 'font-semibold text-blue-600' : 'font-medium text-[#52525B]'
                            )}>
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="text-[8px] font-display font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded tracking-widest uppercase flex-shrink-0">
                                {item.badge}
                              </span>
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

      {/* User + logout */}
      <div className="flex-shrink-0 border-t border-[#F4F4F5] p-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#18181B] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-black text-[11px] leading-none">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-display font-semibold text-[#18181B] truncate leading-none">{userName}</p>
            <p className="text-[11px] font-display text-[#A1A1AA] truncate mt-0.5 leading-none">{userHandle}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#A1A1AA] hover:text-[#71717A] hover:bg-[#F4F4F8] transition-all text-[12px] font-display font-medium"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </nav>
  )
}
