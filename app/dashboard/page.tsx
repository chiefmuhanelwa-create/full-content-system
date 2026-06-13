'use client'

import Link from 'next/link'
import { RecentActivity } from '@/components/RecentActivity'
import {
  Zap, FileText, BookOpen, Brain, Target, Calendar,
  TrendingUp, MonitorPlay, Repeat, BarChart2, Package,
  Layers, Globe, Mic, BookMarked,
  ArrowRight, Tv2, PenTool, Star, Archive, Plus, Cpu,
  FlaskConical
} from 'lucide-react'

function ToolCard({
  href,
  icon: Icon,
  name,
  desc,
  accent = '#C9A84C',
  badge,
}: {
  href: string
  icon: any
  name: string
  desc: string
  accent?: string
  badge?: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className="h-full rounded-xl p-5 flex flex-col gap-3 transition-all duration-150"
        style={{ background: '#111', border: '1px solid #1e1e1e' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = `${accent}40`
          el.style.background = '#161616'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#1e1e1e'
          el.style.background = '#111'
        }}>
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl transition-opacity" style={{ backgroundColor: `${accent}14`, color: accent }}>
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-md tracking-widest uppercase"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-[14px] leading-snug mb-1.5 transition-colors" style={{ color: '#FAF7F0' }}>
            {name}
          </h3>
          <p className="text-[12px] leading-relaxed font-display" style={{ color: '#5a5a6a' }}>{desc}</p>
        </div>
        <div className="flex items-center gap-1.5 transition-colors" style={{ color: '#3a3a4a' }}>
          <span className="text-[11px] font-display font-semibold">Open</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display font-semibold text-[16px] leading-none whitespace-nowrap" style={{ color: '#FAF7F0' }}>{title}</h2>
        <div className="flex-1 h-px" style={{ background: '#1e1e1e' }} />
      </div>
      {sub && <p className="text-[12px] mt-1 font-display" style={{ color: '#5a5a6a' }}>{sub}</p>}
    </div>
  )
}

const systemStats = [
  { icon: Cpu, value: '45', label: 'AI Tools', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)' },
  { icon: BookOpen, value: '20', label: 'Proof Stories', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { icon: Zap, value: '120', label: 'Hook Patterns', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { icon: Brain, value: '10', label: 'Shadow Fears', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
]

const pipeline = [
  { tool: 'Hook Generator', href: '/dashboard/hooks', category: 'CREATE', color: '#C9A84C', icon: Zap, desc: 'R×A×C×U^B formula — verbal + visual hook pairs' },
  { tool: 'Script Writer', href: '/dashboard/scripts', category: 'SCRIPT', color: '#3b82f6', icon: FileText, desc: '7-Act + NOCHILL templates + R50 quality gate' },
  { tool: 'Storytelling Studio', href: '/dashboard/storytelling', category: 'STORY', color: '#a855f7', icon: Tv2, desc: '5 Story Types + 7-Stage Arc mapped to emotion' },
  { tool: 'Fear Analyzer', href: '/dashboard/fears', category: 'AUDIENCE', color: '#f87171', icon: Brain, desc: '10 Shadow Fears — angles and CTAs per fear' },
  { tool: 'Pipeline Board', href: '/dashboard/pipeline', category: 'PLAN', color: '#6366f1', icon: Layers, desc: '6-column Kanban — Idea → Posted with R50 gate' },
]

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const formattedDate = now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-full font-display" style={{ background: '#0a0a0a' }}>
      <div className="px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[14px] font-display mb-1.5" style={{ color: '#3a3a4a' }}>{formattedDate}</p>
            <h1 className="font-display font-bold leading-none tracking-tight" style={{ fontSize: '38px', color: '#FAF7F0' }}>
              {greeting}! Ndivhuwo,
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-2">
            <Link
              href="/dashboard/hooks"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-display font-semibold text-sm transition-colors"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 2px 12px rgba(201,168,76,0.25)' }}
            >
              <Plus className="w-4 h-4" />
              New Content
            </Link>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2.5 mb-8 flex-wrap">
          {systemStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
              <div className="p-1 rounded-full" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
              </div>
              <span className="font-display font-bold text-[14px]" style={{ color: '#FAF7F0' }}>{stat.value}</span>
              <span className="font-display text-[12px]" style={{ color: '#5a5a6a' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <RecentActivity />

        {/* Content Pipeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-display font-semibold" style={{ color: '#FAF7F0' }}>Content Pipeline</span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-display font-medium" style={{ background: '#111', border: '1px solid #1e1e1e', color: '#5a5a6a' }}>
                This Week
              </span>
            </div>
            <Link href="/dashboard/pipeline" className="text-[12px] font-display font-medium transition-colors" style={{ color: '#3a3a4a' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a3a4a')}>
              See All
            </Link>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5" style={{ borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}>
              <span className="text-[12px] font-display font-semibold" style={{ color: '#3a3a4a' }}>Tool</span>
              <span className="text-[12px] font-display font-semibold" style={{ color: '#3a3a4a' }}>Category</span>
              <span className="text-[12px] font-display font-semibold pr-1" style={{ color: '#3a3a4a' }}> </span>
            </div>

            {pipeline.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 items-center group transition-colors"
                style={{ borderBottom: i < pipeline.length - 1 ? '1px solid #141414' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#161616')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${item.color}14` }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-medium text-[13px] truncate" style={{ color: '#FAF7F0' }}>{item.tool}</p>
                    <p className="text-[11px] font-display hidden sm:block truncate" style={{ color: '#3a3a4a' }}>{item.desc}</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-display font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ backgroundColor: `${item.color}12`, color: item.color }}>
                  {item.category}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 pr-1" style={{ color: '#2b2b2b' }}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Content */}
        <div className="mb-8">
          <SectionHeader title="Create Content" sub="AI-powered writing tools" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/hooks" icon={Zap} name="Hook Generator" desc="R×A×C×U^B formula — verbal + visual hook pairs" accent="#C9A84C" />
            <ToolCard href="/dashboard/scripts" icon={FileText} name="Script Writer" desc="7-Act structure + NOCHILL templates + R50 gate" accent="#3b82f6" />
            <ToolCard href="/dashboard/storytelling" icon={Tv2} name="Storytelling Studio" desc="5 Story Types + 7-Stage Arc mapped to emotion" accent="#a855f7" />
            <ToolCard href="/dashboard/stories" icon={BookOpen} name="Story Extractor" desc="Raw notes → structured proof story + product links" accent="#22c55e" />
            <ToolCard href="/dashboard/repurpose" icon={Repeat} name="Repurpose" desc="One script → IG caption, LinkedIn post, X thread" accent="#06b6d4" />
            <ToolCard href="/dashboard/formulas" icon={Layers} name="Formula Writer" desc="PAS, AIDA, DRIP, BAB — structured content formats" accent="#ec4899" />
            <ToolCard href="/dashboard/teleprompter" icon={MonitorPlay} name="Teleprompter" desc="Fullscreen scroll — record to camera without freezing" accent="#f97316" />
            <ToolCard href="/dashboard/content-studio" icon={PenTool} name="Content Studio" desc="Compose and edit any content format" accent="#8a8a96" />
          </div>
        </div>

        {/* Audience Intelligence */}
        <div className="mb-8">
          <SectionHeader title="Audience Intelligence" sub="Know exactly who you are speaking to" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/fears" icon={Brain} name="Fear Analyzer" desc="10 Shadow Fears — hooks, angles, CTAs per fear" accent="#f87171" />
            <ToolCard href="/dashboard/icp-pain-library" icon={Target} name="ICP Pain Library" desc="Called Expert + DNA audience pain database" accent="#f97316" />
            <ToolCard href="/dashboard/competitor" icon={Globe} name="Competitor Intel" desc="Content gaps + positioning angles they missed" accent="#3b82f6" />
            <ToolCard href="/dashboard/trends" icon={TrendingUp} name="Trend Scanner" desc="SA creator space trends with content angles" accent="#22c55e" />
            <ToolCard href="/dashboard/brand-voice" icon={Mic} name="Brand Voice" desc="Score content — rewrite it in your voice" accent="#a855f7" />
          </div>
        </div>

        {/* Products & Revenue */}
        <div className="mb-8">
          <SectionHeader title="Products & Revenue" sub="PAIDS — 5 income streams" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/products" icon={Package} name="Products" desc="Full product catalogue — 10 NoChill products" accent="#C9A84C" />
            <ToolCard href="/dashboard/product-planning" icon={FlaskConical} name="Product Lab" desc="55 products — draft to live" accent="#3b82f6" badge="NEW" />
            <ToolCard href="/dashboard/pitch" icon={Target} name="Pitch Builder" desc="5 Pillars + Ethos-Pathos-Logos by format" accent="#f97316" />
            <ToolCard href="/dashboard/offers" icon={Star} name="Godfather Offers" desc="Core + bonuses + guarantee + urgency stacked" accent="#C9A84C" />
            <ToolCard href="/dashboard/cta-optimizer" icon={Zap} name="CTA Optimizer" desc="5 CTA variants with trigger breakdown" accent="#eab308" />
          </div>
        </div>

        {/* Planning */}
        <div className="mb-8">
          <SectionHeader title="Planning & Scale" sub="Build the system that runs without you" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/pipeline" icon={Layers} name="Pipeline Board" desc="6-column Kanban — Idea → Posted with R50 gate" accent="#6366f1" badge="NEW" />
            <ToolCard href="/dashboard/batch-planner" icon={Layers} name="Batch Planner" desc="22-day content plan around your launch goals" accent="#4f46e5" />
            <ToolCard href="/dashboard/content-calendar-plus" icon={Calendar} name="Content Calendar" desc="4E-balanced — Educate 35 / Entertain 30 / Earn 15" accent="#3b82f6" />
            <ToolCard href="/dashboard/analytics" icon={BarChart2} name="Analytics" desc="Paste metrics → AI diagnosis + next-30-days plan" accent="#06b6d4" />
            <ToolCard href="/dashboard/campaigns" icon={Target} name="Campaigns" desc="Group content + offers + emails into one launch" accent="#ec4899" />
          </div>
        </div>

        {/* Library */}
        <div className="mb-8">
          <SectionHeader title="My Library" sub="Everything you have saved" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hook-bank" icon={BookMarked} name="Hook Bank" desc="All saved hooks — filterable by type + platform" accent="#C9A84C" />
            <ToolCard href="/dashboard/story-bank" icon={BookOpen} name="Story Bank" desc="10 proof stories — mapped to products" accent="#f87171" />
            <ToolCard href="/dashboard/vault" icon={Archive} name="Content Vault" desc="110+ pre-built ideas across 4E categories" accent="#a855f7" />
            <ToolCard href="/dashboard/adapter" icon={Repeat} name="Platform Adapter" desc="LinkedIn, TikTok, X, Instagram native formats" accent="#22c55e" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 flex items-center justify-between" style={{ borderTop: '1px solid #1a1a1a' }}>
          <p className="text-[10px] font-display" style={{ color: '#2b2b2b' }}>
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
          <p className="text-[10px] font-display" style={{ color: '#2b2b2b' }}>
            NOCHILL PTY LTD · 2016/507839/07
          </p>
        </div>

      </div>
    </div>
  )
}
