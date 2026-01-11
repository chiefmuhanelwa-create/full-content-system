'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Zap,
  LayoutDashboard,
  FileText,
  BookOpen,
  Brain,
  LogOut,
  Target,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentProvider } from '@/contexts/ContentContext'

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Hook Generator',
    href: '/dashboard/hooks',
    icon: Zap,
    description: 'R×A×C×U^B Formula',
  },
  {
    name: 'Script Writer',
    href: '/dashboard/scripts',
    icon: FileText,
    description: '5-Line Method',
  },
  {
    name: 'Story Extractor',
    href: '/dashboard/stories',
    icon: BookOpen,
    description: '4-Criteria Test',
  },
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
    name: 'Content Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    description: '4E Framework',
  },
  {
    name: 'Revenue Tracker',
    href: '/dashboard/revenue',
    icon: DollarSign,
    description: 'PAIDS Streams',
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <ContentProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/dashboard" className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">NOCHILL</span>
                <span className="text-xs text-gray-500 mt-1">Viral Script Generator</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-blue-600')} />
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium', isActive && 'text-blue-600')}>
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </ContentProvider>
  )
}
