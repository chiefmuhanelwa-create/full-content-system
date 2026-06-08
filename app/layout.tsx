import type { Metadata } from 'next'
import { Inter, Montserrat, Lato } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/session-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${lato.variable}`}>
      <body className="font-sans antialiased bg-white text-[#18181B]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
