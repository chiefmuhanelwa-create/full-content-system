'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, FileText, ArrowRight, Clock } from 'lucide-react'

interface RecentHook {
  id: string
  content: string
  platform: string
  hookType: string | null
  createdAt: string
}

interface RecentScript {
  id: string
  title: string
  platform: string
  goal: string
  createdAt: string
}

type ActivityItem = {
  type: 'hook' | 'script'
  id: string
  title: string
  meta: string
  href: string
  icon: typeof Zap
  accent: string
  bg: string
  createdAt: string
}

export function RecentActivity() {
  const [hooks, setHooks] = useState<RecentHook[]>([])
  const [scripts, setScripts] = useState<RecentScript[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/recent')
      .then(r => r.json())
      .then(data => {
        setHooks(data.hooks || [])
        setScripts(data.scripts || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#A1A1AA]" />
            <h2 className="font-display font-semibold text-[#18181B] text-[17px]">Continue where you left off</h2>
          </div>
          <div className="flex-1 h-px bg-[#F4F4F5]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#F4F4F5]" />
                <div className="h-2.5 w-10 bg-[#F4F4F5] rounded" />
              </div>
              <div className="h-4 bg-[#F4F4F5] rounded w-full mb-2" />
              <div className="h-4 bg-[#F4F4F5] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#F4F4F5] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const allItems: ActivityItem[] = [
    ...hooks.map(h => ({
      type: 'hook' as const,
      id: h.id,
      title: h.content.length > 85 ? h.content.substring(0, 85) + '…' : h.content,
      meta: `${h.platform}${h.hookType ? ` · ${h.hookType.replace(/_/g, ' ')}` : ''}`,
      href: '/dashboard/hooks',
      icon: Zap,
      accent: '#D97706',
      bg: '#FFFBEB',
      createdAt: h.createdAt,
    })),
    ...scripts.map(s => ({
      type: 'script' as const,
      id: s.id,
      title: s.title,
      meta: `${s.platform} · ${s.goal}`,
      href: '/dashboard/scripts',
      icon: FileText,
      accent: '#2563EB',
      bg: '#EFF6FF',
      createdAt: s.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)

  const hasActivity = allItems.length > 0

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#A1A1AA]" />
          <h2 className="font-display font-semibold text-[#18181B] text-[17px]">Continue where you left off</h2>
        </div>
        <div className="flex-1 h-px bg-[#F4F4F5]" />
      </div>

      {!hasActivity ? (
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <p className="font-display font-semibold text-[#18181B] text-sm mb-1">Nothing saved yet.</p>
          <p className="text-[13px] text-[#71717A] font-display mb-4">Generate your first hook and the system starts learning your rhythm.</p>
          <Link
            href="/dashboard/hooks"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-display font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Generate hooks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allItems.map(item => {
            const Icon = item.icon
            return (
              <Link key={`${item.type}-${item.id}`} href={item.href} className="group block h-full">
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all h-full flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: item.bg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.accent }} />
                    </div>
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#A1A1AA]">{item.type}</span>
                  </div>
                  <p className="text-[13px] font-display font-medium text-[#18181B] leading-relaxed line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-display text-[#A1A1AA] capitalize truncate pr-2">{item.meta}</span>
                    <ArrowRight className="w-3 h-3 text-[#D4D4D8] group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
