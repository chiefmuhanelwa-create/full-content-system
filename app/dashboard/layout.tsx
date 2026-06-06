'use client'

import { Navigation } from '@/components/Navigation'
import { ContentProvider } from '@/contexts/ContentContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ContentProvider>
        <div className="flex min-h-screen bg-[#111111]">
          <Navigation />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </ContentProvider>
    </ErrorBoundary>
  )
}
