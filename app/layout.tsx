import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'NOCHILL Viral Script Generator',
  description: 'AI-powered viral content creation platform using Claude',
  keywords: ['viral content', 'script generator', 'social media', 'AI', 'Claude'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
