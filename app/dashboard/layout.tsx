import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Zap,
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  DollarSign,
  Target,
  Video,
  Settings,
  LogOut,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">NOCHILL</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/hooks">
              <Button variant="ghost" className="w-full justify-start">
                <Zap className="mr-2 h-4 w-4" />
                Hook Generator
              </Button>
            </Link>
            <Link href="/dashboard/scripts">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Script Writer
              </Button>
            </Link>
            <Link href="/dashboard/stories">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Story Extractor
              </Button>
            </Link>
            <Link href="/dashboard/pitch">
              <Button variant="ghost" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Pitch Builder
              </Button>
            </Link>
            <Link href="/dashboard/fears">
              <Button variant="ghost" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Fear Analyzer
              </Button>
            </Link>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Content Calendar
              </Button>
            </Link>
            <Link href="/dashboard/revenue">
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Revenue Tracker
              </Button>
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-1">
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
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
  )
}
