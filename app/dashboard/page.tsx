'use client'

import Link from 'next/link'
import {
  Zap, FileText, BookOpen, Brain, Target, Calendar,
  TrendingUp, MonitorPlay, Repeat, BarChart2, Package,
  Layers, Globe, Mic, BookMarked,
  ArrowRight, Tv2, PenTool, Star, Archive, Plus, Cpu,
  ChevronDown, FlaskConical
} from 'lucide-react'

function ToolCard({
  href,
  icon: Icon,
  name,
  desc,
  accent = '#2563EB',
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
      <div className="h-full bg-white border border-[#E4E4E7] rounded-xl p-4 flex flex-col gap-3 hover:border-[#D4D4D8] hover:shadow-sm transition-all duration-150">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg transition-opacity" style={{ backgroundColor: `${accent}15`, color: accent }}>
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span className="text-[9px] font-display font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded-md tracking-widest uppercase">
              {badge}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-[#18181B] text-[13px] leading-snug mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-[11px] text-[#A1A1AA] leading-relaxed font-display">{desc}</p>
        </div>
        <div className="flex items-center gap-1 text-[#D4D4D8] group-hover:text-blue-500 transition-colors">
          <span className="text-[10px] font-display font-semibold">Open</span>
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
        <h2 className="font-display font-semibold text-[#18181B] text-[15px] leading-none whitespace-nowrap">{title}</h2>
        <div className="flex-1 h-px bg-[#F4F4F5]" />
      </div>
      {sub && <p className="text-[#A1A1AA] text-[11px] mt-1 font-display">{sub}</p>}
    </div>
  )
}

const systemStats = [
  { icon: Cpu, value: '42', label: 'AI Tools', color: '#2563EB', bg: '#EFF6FF' },
  { icon: BookOpen, value: '20', label: 'Proof Stories', color: '#16A34A', bg: '#F0FDF4' },
  { icon: Zap, value: '120', label: 'Hook Patterns', color: '#D97706', bg: '#FFFBEB' },
  { icon: Brain, value: '10', label: 'Shadow Fears', color: '#DC2626', bg: '#FEF2F2' },
]

const pipeline = [
  { tool: 'Hook Generator', href: '/dashboard/hooks', category: 'CREATE', color: '#D97706', icon: Zap, desc: 'R×A×C×U^B formula — write your daily hook' },
  { tool: 'Script Writer', href: '/dashboard/scripts', category: 'SCRIPT', color: '#2563EB', icon: FileText, desc: '7-Act + 10-Step Sales Framework' },
  { tool: 'Storytelling Studio', href: '/dashboard/storytelling', category: 'STORY', color: '#7C3AED', icon: Tv2, desc: '5 Story Types + 7-Stage Arc mapped to emotion' },
  { tool: 'Fear Analyzer', href: '/dashboard/fears', category: 'AUDIENCE', color: '#DC2626', icon: Brain, desc: '10 Shadow Fears — angles and CTAs per fear' },
  { tool: 'Batch Planner', href: '/dashboard/batch-planner', category: 'PLAN', color: '#4F46E5', icon: Layers, desc: '22-day content plan around your launch goals' },
]

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const formattedDate = now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-full bg-[#FAFAFA] font-display">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header — Mondays style */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[#A1A1AA] text-sm font-display mb-1.5">{formattedDate}</p>
            <h1 className="font-display font-bold text-[#18181B] leading-none tracking-tight" style={{ fontSize: '38px' }}>
              {greeting}! Ndivhuwo,
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-2">
            <Link
              href="/dashboard/hooks"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-display font-semibold text-sm hover:bg-blue-700 transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.28)]"
            >
              <Plus className="w-4 h-4" />
              New Content
            </Link>
            <button className="p-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B] transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats pills — Mondays "12hrs Time Saved" row */}
        <div className="flex items-center gap-2.5 mb-8 flex-wrap">
          {systemStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="p-1 rounded-full" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
              </div>
              <span className="font-display font-bold text-[#18181B] text-[13px]">{stat.value}</span>
              <span className="font-display text-[#A1A1AA] text-[11px]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* My Content — Mondays "My Projects" table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-display font-semibold text-[#18181B]">Content Pipeline</span>
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] text-[11px] font-display font-medium text-[#71717A] hover:border-[#D4D4D8] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                This Week <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <Link href="/dashboard/batch-planner" className="text-[12px] font-display font-medium text-[#71717A] hover:text-[#18181B] transition-colors">
              See All
            </Link>
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-[#F4F4F5] bg-[#FAFAFA]">
              <div className="flex items-center gap-1.5 text-[11px] font-display font-semibold text-[#A1A1AA]">
                <span>✏️</span>
                <span>Tool Name</span>
              </div>
              <span className="text-[11px] font-display font-semibold text-[#A1A1AA]">Category</span>
              <span className="text-[11px] font-display font-semibold text-[#A1A1AA] pr-1">Status</span>
            </div>

            {pipeline.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors items-center border-b border-[#F4F4F5] last:border-0 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-medium text-[13px] text-[#18181B] group-hover:text-blue-600 transition-colors truncate">{item.tool}</p>
                    <p className="text-[10px] text-[#A1A1AA] font-display hidden sm:block truncate">{item.desc}</p>
                  </div>
                </div>
                <span
                  className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-display font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ backgroundColor: `${item.color}12`, color: item.color }}
                >
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-[#D4D4D8] group-hover:text-blue-500 transition-colors flex-shrink-0 pr-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Content */}
        <div className="mb-8">
          <SectionHeader title="Create Content" sub="AI-powered writing tools" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hooks" icon={Zap} name="Hook Generator" desc="R×A×C×U^B formula — fear, curiosity, data, contrast" accent="#D97706" />
            <ToolCard href="/dashboard/scripts" icon={FileText} name="Script Writer" desc="7-Act structure + 10-Step Sales Framework" accent="#2563EB" />
            <ToolCard href="/dashboard/storytelling" icon={Tv2} name="Storytelling Studio" desc="5 Story Types + 7-Stage Arc mapped to emotion" accent="#7C3AED" />
            <ToolCard href="/dashboard/stories" icon={BookOpen} name="Story Extractor" desc="Raw notes → structured proof story + product links" accent="#059669" />
            <ToolCard href="/dashboard/repurpose" icon={Repeat} name="Repurpose" desc="One script → IG caption, LinkedIn post, X thread" accent="#0891B2" />
            <ToolCard href="/dashboard/formulas" icon={Layers} name="Formula Writer" desc="PAS, AIDA, DRIP, BAB — structured content formats" accent="#DB2777" />
            <ToolCard href="/dashboard/teleprompter" icon={MonitorPlay} name="Teleprompter" desc="Fullscreen scroll — record to camera without freezing" accent="#D97706" />
            <ToolCard href="/dashboard/content-studio" icon={PenTool} name="Content Studio" desc="Compose and edit any content format" accent="#71717A" />
          </div>
        </div>

        {/* Audience Intelligence */}
        <div className="mb-8">
          <SectionHeader title="Audience Intelligence" sub="Know exactly who you are speaking to" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/fears" icon={Brain} name="Fear Analyzer" desc="10 Shadow Fears — hooks, angles, CTAs per fear" accent="#DC2626" />
            <ToolCard href="/dashboard/icp-pain-library" icon={Target} name="ICP Pain Library" desc="Called Expert + DNA audience pain database" accent="#EA580C" />
            <ToolCard href="/dashboard/competitor" icon={Globe} name="Competitor Intel" desc="Content gaps + positioning angles they missed" accent="#2563EB" />
            <ToolCard href="/dashboard/trends" icon={TrendingUp} name="Trend Scanner" desc="SA creator space trends with content angles" accent="#16A34A" />
            <ToolCard href="/dashboard/brand-voice" icon={Mic} name="Brand Voice" desc="Score content — rewrite it in your voice" accent="#7C3AED" />
          </div>
        </div>

        {/* Products & Revenue */}
        <div className="mb-8">
          <SectionHeader title="Products & Revenue" sub="PAIDS — 5 income streams" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/products" icon={Package} name="Products" desc="Full product catalogue — 10 NoChill products" accent="#D97706" />
            <ToolCard href="/dashboard/product-planning" icon={FlaskConical} name="Product Lab" desc="55 products — draft to live" accent="#2563EB" badge="NEW" />
            <ToolCard href="/dashboard/pitch" icon={Target} name="Pitch Builder" desc="5 Pillars + Ethos-Pathos-Logos by format" accent="#EA580C" />
            <ToolCard href="/dashboard/offers" icon={Star} name="Godfather Offers" desc="Core + bonuses + guarantee + urgency stacked" accent="#D97706" />
            <ToolCard href="/dashboard/cta-optimizer" icon={Zap} name="CTA Optimizer" desc="5 CTA variants with trigger breakdown" accent="#CA8A04" />
          </div>
        </div>

        {/* Planning */}
        <div className="mb-8">
          <SectionHeader title="Planning & Scale" sub="Build the system that runs without you" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/batch-planner" icon={Layers} name="Batch Planner" desc="22-day content plan around your launch goals" accent="#4F46E5" />
            <ToolCard href="/dashboard/content-calendar-plus" icon={Calendar} name="Content Calendar" desc="4E-balanced — Educate 35 / Entertain 30 / Earn 15" accent="#2563EB" />
            <ToolCard href="/dashboard/analytics" icon={BarChart2} name="Analytics" desc="Paste metrics → AI diagnosis + next-30-days plan" accent="#0891B2" />
            <ToolCard href="/dashboard/content-cards" icon={BarChart2} name="Content Cards" desc="Per-post metric tracking + formula recognition" accent="#0D9488" />
            <ToolCard href="/dashboard/campaigns" icon={Target} name="Campaigns" desc="Group content + offers + emails into one launch" accent="#DB2777" />
          </div>
        </div>

        {/* Library */}
        <div className="mb-8">
          <SectionHeader title="My Library" sub="Everything you have saved" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hook-bank" icon={BookMarked} name="Hook Bank" desc="All saved hooks — filterable by type + platform" accent="#D97706" />
            <ToolCard href="/dashboard/story-bank" icon={BookOpen} name="Story Bank" desc="10 proof stories — mapped to products" accent="#DC2626" />
            <ToolCard href="/dashboard/vault" icon={Archive} name="Content Vault" desc="110+ pre-built ideas across 4E categories" accent="#7C3AED" />
            <ToolCard href="/dashboard/adapter" icon={Repeat} name="Platform Adapter" desc="LinkedIn, TikTok, X, Instagram native formats" accent="#059669" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#F4F4F5] pt-5 flex items-center justify-between">
          <p className="text-[#D4D4D8] text-[10px] font-display">
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
          <p className="text-[#D4D4D8] text-[10px] font-display">
            NOCHILL PTY LTD · 2016/507839/07
          </p>
        </div>

      </div>
    </div>
  )
}
