'use client'

import Link from 'next/link'
import {
  Zap, FileText, BookOpen, Brain, Target, Calendar,
  TrendingUp, MonitorPlay, Repeat, BarChart2, Package,
  Layers, Globe, Mic, BookMarked,
  ArrowRight, Tv2, PenTool, Star, Archive, Plus, Cpu, FlaskConical
} from 'lucide-react'

function ToolCard({
  href,
  icon: Icon,
  name,
  desc,
  accent = '#C9A646',
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
      <div className="h-full bg-white border border-[#E8E1D0] rounded-xl p-4 flex flex-col gap-3 hover:border-[#C9A646]/50 hover:shadow-[0_4px_20px_rgba(201,166,70,0.10)] transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-[#FAF7F0] group-hover:bg-[#F4EFE3] transition-colors" style={{ color: accent }}>
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span className="text-[9px] font-heading font-black px-1.5 py-0.5 bg-[#C9A646] text-[#0A0A0A] rounded tracking-widest uppercase">
              {badge}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-[#0F0F0F] text-[13px] leading-snug mb-1 group-hover:text-[#8C6F1F] transition-colors">
            {name}
          </h3>
          <p className="text-[11px] text-[#8A8071] leading-relaxed">{desc}</p>
        </div>
        <div className="flex items-center gap-1 text-[#C9C0B0] group-hover:text-[#C9A646] transition-colors">
          <span className="text-[10px] font-heading font-semibold">Open</span>
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
        <h2 className="font-heading font-black text-[#0F0F0F] text-base leading-none whitespace-nowrap">{title}</h2>
        <div className="flex-1 h-px bg-[#E8E1D0]" />
      </div>
      {sub && <p className="text-[#8A8071] text-[11px] mt-1 font-heading">{sub}</p>}
    </div>
  )
}

const systemStats = [
  { icon: Cpu, value: '42', label: 'AI Tools', color: '#C9A646', bg: '#FEF9EC' },
  { icon: BookOpen, value: '20', label: 'Proof Stories', color: '#059669', bg: '#F0FDF4' },
  { icon: Zap, value: '120', label: 'Hook Patterns', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: Brain, value: '10', label: 'Shadow Fears', color: '#EF4444', bg: '#FEF2F2' },
]

const pipeline = [
  { tool: 'Hook Generator', href: '/dashboard/hooks', category: 'CREATE', color: '#C9A646', icon: Zap, desc: 'R×A×C×U^B formula — write your daily hook' },
  { tool: 'Script Writer', href: '/dashboard/scripts', category: 'SCRIPT', color: '#3B82F6', icon: FileText, desc: '7-Act + 10-Step Sales Framework' },
  { tool: 'Storytelling Studio', href: '/dashboard/storytelling', category: 'STORY', color: '#8B5CF6', icon: Tv2, desc: '5 Story Types + 7-Stage Arc' },
  { tool: 'Fear Analyzer', href: '/dashboard/fears', category: 'AUDIENCE', color: '#EF4444', icon: Brain, desc: '10 Shadow Fears — angles and CTAs per fear' },
  { tool: 'Batch Planner', href: '/dashboard/batch-planner', category: 'PLAN', color: '#6366F1', icon: Layers, desc: '22-day plan around your launch goals' },
]

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const formattedDate = now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-full bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header — Mondays style with date + action button */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#8A8071] text-sm font-heading mb-1">{formattedDate}</p>
            <h1 className="font-heading font-black text-[#0F0F0F] text-3xl leading-none tracking-tight">
              {greeting}, Ndivhuwo.
            </h1>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              href="/dashboard/hooks"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A646] text-[#0A0A0A] font-heading font-bold text-sm hover:bg-[#8C6F1F] hover:text-white transition-all shadow-[0_2px_8px_rgba(201,166,70,0.25)]"
            >
              <Plus className="w-4 h-4" />
              New Content
            </Link>
          </div>
        </div>

        {/* Stats row — Mondays pill style */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {systemStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E8E1D0] shadow-sm"
            >
              <div className="p-1 rounded-full" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
              </div>
              <span className="font-heading font-black text-[#0F0F0F] text-[13px]">{stat.value}</span>
              <span className="font-heading text-[#8A8071] text-[11px]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Content Pipeline — Mondays-style table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-heading font-black text-[#0F0F0F] text-base leading-none whitespace-nowrap">Content Pipeline</h2>
              <div className="flex-1 h-px bg-[#E8E1D0] w-16" />
            </div>
            <Link href="/dashboard/batch-planner" className="text-[11px] text-[#C9A646] font-heading font-bold hover:underline flex items-center gap-1">
              Plan 22 Days <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white border border-[#E8E1D0] rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-[#F0EBE0] bg-[#FAF7F0]">
              <span className="text-[10px] font-heading font-black text-[#8A8071] uppercase tracking-widest">Tool</span>
              <span className="text-[10px] font-heading font-black text-[#8A8071] uppercase tracking-widest">Category</span>
              <span className="text-[10px] font-heading font-black text-[#8A8071] uppercase tracking-widest pr-2">Action</span>
            </div>

            {pipeline.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 px-4 py-3 hover:bg-[#FDFBF7] transition-colors items-center border-b border-[#F8F5EF] last:border-0 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${item.color}18` }}
                  >
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-[13px] text-[#0F0F0F] group-hover:text-[#8C6F1F] transition-colors truncate">{item.tool}</p>
                    <p className="text-[10px] text-[#8A8071] truncate hidden sm:block">{item.desc}</p>
                  </div>
                </div>
                <span
                  className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-heading font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-[#C9C0B0] group-hover:text-[#C9A646] transition-colors flex-shrink-0">
                  <span className="text-[10px] font-heading font-semibold">Open</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Content */}
        <div className="mb-8">
          <SectionHeader title="Create Content" sub="AI-powered writing tools" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hooks" icon={Zap} name="Hook Generator" desc="R×A×C×U^B formula — fear, curiosity, data, contrast" accent="#C9A646" />
            <ToolCard href="/dashboard/scripts" icon={FileText} name="Script Writer" desc="7-Act structure + 10-Step Sales Framework" accent="#3B82F6" />
            <ToolCard href="/dashboard/storytelling" icon={Tv2} name="Storytelling Studio" desc="5 Story Types + 7-Stage Arc mapped to emotion" accent="#8B5CF6" />
            <ToolCard href="/dashboard/stories" icon={BookOpen} name="Story Extractor" desc="Raw notes → structured proof story + product links" accent="#059669" />
            <ToolCard href="/dashboard/repurpose" icon={Repeat} name="Repurpose" desc="One script → IG caption, LinkedIn post, X thread" accent="#0891B2" />
            <ToolCard href="/dashboard/formulas" icon={Layers} name="Formula Writer" desc="PAS, AIDA, DRIP, BAB — structured content formats" accent="#EC4899" />
            <ToolCard href="/dashboard/teleprompter" icon={MonitorPlay} name="Teleprompter" desc="Fullscreen scroll — record to camera without freezing" accent="#D97706" />
            <ToolCard href="/dashboard/content-studio" icon={PenTool} name="Content Studio" desc="Compose and edit any content format" accent="#6B7280" />
          </div>
        </div>

        {/* Audience Intelligence */}
        <div className="mb-8">
          <SectionHeader title="Audience Intelligence" sub="Know exactly who you are speaking to" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/fears" icon={Brain} name="Fear Analyzer" desc="10 Shadow Fears — hooks, angles, CTAs per fear" accent="#EF4444" />
            <ToolCard href="/dashboard/icp-pain-library" icon={Target} name="ICP Pain Library" desc="Called Expert + DNA audience pain database" accent="#F97316" />
            <ToolCard href="/dashboard/competitor" icon={Globe} name="Competitor Intel" desc="Content gaps + positioning angles they missed" accent="#3B82F6" />
            <ToolCard href="/dashboard/trends" icon={TrendingUp} name="Trend Scanner" desc="SA creator space trends with content angles" accent="#16A34A" />
            <ToolCard href="/dashboard/brand-voice" icon={Mic} name="Brand Voice" desc="Score content — rewrite it in your voice" accent="#7C3AED" />
          </div>
        </div>

        {/* Products & Revenue */}
        <div className="mb-8">
          <SectionHeader title="Products & Revenue" sub="PAIDS — 5 income streams" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/products" icon={Package} name="Products" desc="Full product catalogue — 10 NoChill products" accent="#C9A646" />
            <ToolCard href="/dashboard/product-planning" icon={FlaskConical} name="Product Lab" desc="55 products — draft to live" accent="#C9A646" badge="NEW" />
            <ToolCard href="/dashboard/pitch" icon={Target} name="Pitch Builder" desc="5 Pillars + Ethos-Pathos-Logos by format" accent="#F97316" />
            <ToolCard href="/dashboard/offers" icon={Star} name="Godfather Offers" desc="Core + bonuses + guarantee + urgency stacked" accent="#D97706" />
            <ToolCard href="/dashboard/cta-optimizer" icon={Zap} name="CTA Optimizer" desc="5 CTA variants with trigger breakdown" accent="#CA8A04" />
          </div>
        </div>

        {/* Planning */}
        <div className="mb-8">
          <SectionHeader title="Planning & Scale" sub="Build the system that runs without you" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/batch-planner" icon={Layers} name="Batch Planner" desc="22-day content plan around your launch goals" accent="#6366F1" />
            <ToolCard href="/dashboard/content-calendar-plus" icon={Calendar} name="Content Calendar" desc="4E-balanced — Educate 35 / Entertain 30 / Earn 15" accent="#3B82F6" />
            <ToolCard href="/dashboard/analytics" icon={BarChart2} name="Analytics" desc="Paste metrics → AI diagnosis + next-30-days plan" accent="#0891B2" />
            <ToolCard href="/dashboard/content-cards" icon={BarChart2} name="Content Cards" desc="Per-post metric tracking + formula recognition" accent="#0D9488" />
            <ToolCard href="/dashboard/campaigns" icon={Target} name="Campaigns" desc="Group content + offers + emails into one launch" accent="#DB2777" />
          </div>
        </div>

        {/* Library */}
        <div className="mb-8">
          <SectionHeader title="My Library" sub="Everything you have saved" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hook-bank" icon={BookMarked} name="Hook Bank" desc="All saved hooks — filterable by type + platform" accent="#C9A646" />
            <ToolCard href="/dashboard/story-bank" icon={BookOpen} name="Story Bank" desc="10 proof stories — mapped to products" accent="#EF4444" />
            <ToolCard href="/dashboard/vault" icon={Archive} name="Content Vault" desc="110+ pre-built ideas across 4E categories" accent="#7C3AED" />
            <ToolCard href="/dashboard/adapter" icon={Repeat} name="Platform Adapter" desc="LinkedIn, TikTok, X, Instagram native formats" accent="#059669" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E1D0] pt-5 flex items-center justify-between">
          <p className="text-[#C9C0B0] text-[10px] font-heading">
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
          <p className="text-[#C9C0B0] text-[10px] font-heading">
            NOCHILL PTY LTD · 2016/507839/07
          </p>
        </div>

      </div>
    </div>
  )
}
