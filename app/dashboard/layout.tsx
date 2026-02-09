'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Zap,
  LayoutDashboard,
  FileText,
  BookOpen,
  Brain,
  Target,
  Calendar,
  DollarSign,
  Save,
  MonitorPlay,
  Sparkles,
  Wand2,
  Share2,
  Mic,
  Library,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentProvider } from '@/contexts/ContentContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  name: string
  href: string
  icon: any
  description?: string
  badge?: string
}

const navSections: NavSection[] = [
  {
    title: 'Core Creation',
    items: [
      {
        name: 'Hook Generator',
        href: '/dashboard/hooks',
        icon: Zap,
        description: 'R×A×C×U^B Formula',
      },
      {
        name: 'Storytelling Studio',
        href: '/dashboard/storytelling',
        icon: Sparkles,
        description: 'Genesis Framework + 7-Stage Arc',
        badge: 'NEW',
      },
      {
        name: 'Script Writer',
        href: '/dashboard/scripts',
        icon: FileText,
        description: '7-Act Retention Formula',
      },
      {
        name: 'Content Formulas',
        href: '/dashboard/formulas',
        icon: Wand2,
        description: '4 Foundational Principles',
        badge: 'NEW',
      },
      {
        name: 'Story Extractor',
        href: '/dashboard/stories',
        icon: BookOpen,
        description: 'Genesis: 5 Story Types',
      },
    ],
  },
  {
    title: 'Optimization',
    items: [
      {
        name: 'Fear Analyzer',
        href: '/dashboard/fears',
        icon: Brain,
        description: '10 Shadow Fears',
      },
      {
        name: 'Pitch Builder',
        href: '/dashboard/pitch',
        icon: Target,
        description: '5 Pillars',
      },
      {
        name: 'Content Adapter',
        href: '/dashboard/adapter',
        icon: Share2,
        description: 'Multi-Platform Export',
        badge: 'NEW',
      },
    ],
  },
  {
    title: 'Production',
    items: [
      {
        name: 'Teleprompter',
        href: '/dashboard/teleprompter',
        icon: MonitorPlay,
        description: 'Record Scripts',
      },
      {
        name: 'Voice Profile',
        href: '/dashboard/voice',
        icon: Mic,
        description: 'Your Unique Voice',
        badge: 'NEW',
      },
      {
        name: 'Story Vault',
        href: '/dashboard/vault',
        icon: Library,
        description: '110+ Content Ideas',
      },
    ],
  },
  {
    title: 'Planning & Tracking',
    items: [
      {
        name: 'Content Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
        description: '4E Engine (30-35-20-15)',
      },
      {
        name: 'Revenue Tracker',
        href: '/dashboard/revenue',
        icon: DollarSign,
        description: 'PAIDS Framework',
      },
      {
        name: 'Saved Library',
        href: '/dashboard/library',
        icon: Save,
        description: 'All Saved Content',
      },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <ErrorBoundary>
      <ContentProvider>
        <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/dashboard" className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">NOCHILL</span>
                <span className="text-xs text-gray-500 mt-1">Content Creation System</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
              {/* Dashboard Link */}
              <Link href="/dashboard">
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    pathname === '/dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <LayoutDashboard className={cn('h-5 w-5 flex-shrink-0', pathname === '/dashboard' && 'text-blue-600')} />
                  <p className={cn('text-sm font-medium', pathname === '/dashboard' && 'text-blue-600')}>
                    Dashboard
                  </p>
                </div>
              </Link>

              {/* Sectioned Navigation */}
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative',
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-blue-600')} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={cn('text-sm font-medium', isActive && 'text-blue-600')}>
                                {item.name}
                              </p>
                              {item.badge && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 truncate">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <p className="text-xs text-center text-gray-500">
                NOCHILL v2.0
              </p>
              <p className="text-xs text-center text-gray-400 mt-1">
                Viral Scripting Master Guide
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-screen">
          {children}
        </main>
        </div>
      </ContentProvider>
    </ErrorBoundary>
  )
}
