import type { Metadata } from 'next'
import { Montserrat, Lato } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/session-provider'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'NoChill — Content Intelligence System',
  description: 'Ndivhuwo Muhanelwa\'s personal content operating system. Built for the NoChill brand.',
  robots: 'noindex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable}`}>
      <body className="font-body antialiased bg-[#111111] text-[#F8F8F8]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
