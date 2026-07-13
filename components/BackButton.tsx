'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  href?: string
}

export function BackButton({ label = 'All Tools', href = '/dashboard' }: BackButtonProps) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-1.5 text-sm font-display transition-colors"
      style={{ color: '#A1A1AA' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#18181B')}
      onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
