'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { ContentProvider } from '@/contexts/ContentContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CommandPalette } from '@/components/CommandPalette'
import { Menu, Search } from 'lucide-react'
import { AURORA_BG, DotGrid } from '@/components/premium'

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
        {/* The aurora ground from Rate Card Pro. Every page sits on it, so the system and
            the storefront tool read as one product. DotGrid is a plain absolute backdrop —
            it must not be wrapped in anything that clips, or sticky rails break. */}
        <div className="relative flex h-screen overflow-hidden" style={{ background: AURORA_BG }}>
          <DotGrid />

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

          <main className="relative flex-1 overflow-y-auto min-h-0">

            {/* Mobile top bar — sticky inside scroll container */}
            <div className="lg:hidden sticky top-0 z-30 px-4 h-14 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: '#6B6480' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1523')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B6480')}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#1A1523' }}>
                  <span className="font-display font-black text-[10px] leading-none" style={{ color: '#FFFFFF' }}>N</span>
                </div>
                <span className="font-display font-black text-sm tracking-tight" style={{ color: '#1A1523' }}>NOCHILL</span>
              </div>
              <button
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Search tools"
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: '#6B6480' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1523')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B6480')}
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
