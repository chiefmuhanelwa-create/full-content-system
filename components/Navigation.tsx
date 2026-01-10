'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Zap,
  FileText,
  BookOpen,
  Brain,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
    description: 'NOCHILL 5-Line Method',
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
]

export function Navigation() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold text-gray-900">
            NOCHILL
          </h1>
          <p className="text-xs text-gray-500 mt-1">Viral Script Generator</p>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
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
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
