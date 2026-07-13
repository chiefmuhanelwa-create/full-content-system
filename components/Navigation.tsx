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
  LayoutGrid, Megaphone, Wallet, Hash, ClipboardList, Kanban,
  Users, Compass
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
    label: 'Empire',
    items: [
      { name: 'AI Board of Advisors', href: '/dashboard/advisors', icon: Users, badge: 'NEW' },
      { name: 'CHKPLT North Star', href: '/dashboard/mission', icon: Compass, badge: 'NEW' },
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
    style={{ background: '#FFFFFF', borderRight: '1px solid #E4E4E7' }}
    >

      {/* Brand */}
      <div className="px-4 py-4 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid #E4E4E7' }}>
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#18181B' }}>
            <span className="font-display font-black text-xs leading-none" style={{ color: '#FFFFFF' }}>N</span>
          </div>
          <div>
            <p className="font-display font-black text-[15px] tracking-tight leading-none" style={{ color: '#18181B' }}>NOCHILL</p>
            <p className="text-[10px] font-display mt-0.5 leading-none" style={{ color: '#A1A1AA' }}>Content Intelligence</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: '#71717A' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid #E4E4E7' }}>
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-colors"
          style={{ background: '#F4F4F5', border: '1px solid #E4E4E7' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4D4D8')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#E4E4E7')}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A1A1AA' }} />
          <span className="text-[12px] font-display flex-1" style={{ color: '#A1A1AA' }}>Search tools...</span>
          <kbd className="text-[9px] font-display px-1.5 py-0.5 rounded hidden sm:block"
            style={{ color: '#A1A1AA', background: '#FFFFFF', border: '1px solid #E4E4E7' }}>⌘K</kbd>
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
                onMouseEnter={e => (e.currentTarget.style.background = '#F4F4F5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-[10px] font-display font-semibold uppercase tracking-widest"
                  style={{ color: hasActive ? '#2563EB' : '#A1A1AA' }}>
                  {group.label}
                </span>
                {isGroupOpen
                  ? <ChevronDown className="w-3 h-3" style={{ color: '#A1A1AA' }} />
                  : <ChevronRight className="w-3 h-3" style={{ color: '#A1A1AA' }} />
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
                            background: isActive ? '#EFF6FF' : 'transparent',
                            color: isActive ? '#2563EB' : '#52525B',
                          }}
                          onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.background = '#F4F4F5'
                          }}
                          onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0"
                            style={{ color: isActive ? '#2563EB' : '#A1A1AA' }} />
                          <div className="flex-1 min-w-0 flex items-center gap-1.5">
                            <p className="text-[13px] font-display truncate leading-none"
                              style={{
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#2563EB' : '#52525B',
                              }}>
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="text-[8px] font-display font-bold px-1.5 py-0.5 rounded tracking-widest uppercase flex-shrink-0"
                                style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
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
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid #E4E4E7' }}>
        <div className="flex items-center gap-2.5 mb-2 px-1 py-1.5 rounded-lg" style={{ background: '#F8F9FA' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#EFF6FF', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
            <span className="font-display font-black text-[11px] leading-none" style={{ color: '#2563EB' }}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-display font-semibold truncate leading-none" style={{ color: '#18181B' }}>{userName}</p>
            <p className="text-[11px] font-display truncate mt-0.5 leading-none" style={{ color: '#A1A1AA' }}>{userHandle}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[12px] font-display font-medium"
          style={{ color: '#71717A', border: '1px solid #E4E4E7' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#EF4444'
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#71717A'
            e.currentTarget.style.borderColor = '#E4E4E7'
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
