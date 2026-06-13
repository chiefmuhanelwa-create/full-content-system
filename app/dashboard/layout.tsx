'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { ContentProvider } from '@/contexts/ContentContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CommandPalette } from '@/components/CommandPalette'
import { Menu, Search } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // ⌘K / Ctrl+K opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close mobile nav when resizing to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileNavOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <ErrorBoundary>
      <ContentProvider>
        <div className="flex h-screen overflow-hidden" style={{ background: '#0f0f0f' }}>

          {/* Mobile backdrop */}
          {mobileNavOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          <Navigation
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            onSearchOpen={() => setCommandPaletteOpen(true)}
          />

          <main className="flex-1 overflow-y-auto min-h-0">

            {/* Mobile top bar — sticky inside scroll container */}
            <div className="lg:hidden sticky top-0 z-30 px-4 h-14 flex items-center gap-3" style={{ background: '#111111', borderBottom: '1px solid #2b2b2b' }}>
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: '#8a8a96' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8a8a96')}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#C9A84C' }}>
                  <span className="font-display font-black text-[10px] leading-none" style={{ color: '#0f0f0f' }}>N</span>
                </div>
                <span className="font-display font-black text-sm tracking-tight" style={{ color: '#FAF7F0' }}>NOCHILL</span>
              </div>
              <button
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Search tools"
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: '#8a8a96' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8a8a96')}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {children}
          </main>

          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
        </div>
      </ContentProvider>
    </ErrorBoundary>
  )
}
