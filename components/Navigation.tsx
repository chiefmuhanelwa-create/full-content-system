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
  LayoutGrid, Megaphone, Wallet, Hash, ClipboardList, Kanban
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
      { name: 'Caption + Hashtags', href: '/dashboard/captions', icon: Hash },
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
      { name: 'Pipeline Board', href: '/dashboard/pipeline', icon: Kanban, badge: 'NEW' },
      { name: 'Content Calendar', href: '/dashboard/content-calendar-plus', icon: Calendar },
      { name: 'Batch Planner', href: '/dashboard/batch-planner', icon: Layers },
      { name: 'Shoot Runsheet', href: '/dashboard/runsheet', icon: ClipboardList },
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
      "w-64 flex flex-col",
      "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
      "lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
    style={{ background: '#0d0d0d', borderRight: '1px solid #222' }}
    >

      {/* Brand */}
      <div className="px-4 py-4 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#C9A84C' }}>
            <span className="font-display font-black text-xs leading-none" style={{ color: '#0d0d0d' }}>N</span>
          </div>
          <div>
            <p className="font-display font-black text-[15px] tracking-tight leading-none" style={{ color: '#FAF7F0' }}>NOCHILL</p>
            <p className="text-[10px] font-display mt-0.5 leading-none" style={{ color: '#5a5a6a' }}>Content Intelligence</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: '#5a5a6a' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-colors"
          style={{ background: '#1a1a1a', border: '1px solid #2b2b2b' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#383838')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2b2b2b')}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5a5a6a' }} />
          <span className="text-[12px] font-display flex-1" style={{ color: '#5a5a6a' }}>Search tools...</span>
          <kbd className="text-[9px] font-display px-1.5 py-0.5 rounded hidden sm:block"
            style={{ color: '#383838', background: '#111', border: '1px solid #2b2b2b' }}>⌘K</kbd>
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {navGroups.map((group) => {
          const isGroupOpen = !collapsed[group.label]
          const hasActive = isGroupActive(group)

          return (
            <div key={group.label} className="mb-0.5">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-[10px] font-display font-semibold uppercase tracking-widest"
                  style={{ color: hasActive ? '#C9A84C' : '#3a3a4a' }}>
                  {group.label}
                </span>
                {isGroupOpen
                  ? <ChevronDown className="w-3 h-3" style={{ color: '#3a3a4a' }} />
                  : <ChevronRight className="w-3 h-3" style={{ color: '#3a3a4a' }} />
                }
              </button>

              {isGroupOpen && (
                <div className="mt-0.5 space-y-px">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                      || (item.href === '/dashboard' && pathname === '/dashboard')

                    return (
                      <Link key={item.href} href={item.href} onClick={onClose}>
                        <div
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all"
                          style={{
                            background: isActive ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                            color: isActive ? '#C9A84C' : '#8a8a96',
                          }}
                          onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.background = '#1a1a1a'
                          }}
                          onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0"
                            style={{ color: isActive ? '#C9A84C' : '#4a4a5a' }} />
                          <div className="flex-1 min-w-0 flex items-center gap-1.5">
                            <p className="text-[13px] font-display truncate leading-none"
                              style={{
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#C9A84C' : '#8a8a96',
                              }}>
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="text-[8px] font-display font-bold px-1.5 py-0.5 rounded tracking-widest uppercase flex-shrink-0"
                                style={{ background: '#C9A84C', color: '#0d0d0d' }}>
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
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid #1e1e1e' }}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201, 168, 76, 0.15)', border: '1px solid rgba(201, 168, 76, 0.3)' }}>
            <span className="font-display font-black text-[11px] leading-none" style={{ color: '#C9A84C' }}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-display font-semibold truncate leading-none" style={{ color: '#FAF7F0' }}>{userName}</p>
            <p className="text-[11px] font-display truncate mt-0.5 leading-none" style={{ color: '#5a5a6a' }}>{userHandle}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[12px] font-display font-medium"
          style={{ color: '#5a5a6a', border: '1px solid #1e1e1e' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f87171'
            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)'
            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#5a5a6a'
            e.currentTarget.style.borderColor = '#1e1e1e'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </nav>
  )
}
