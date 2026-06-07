'use client'

import Link from 'next/link'
import {
  Zap, FileText, BookOpen, Brain, Target, Calendar,
  TrendingUp, MonitorPlay, Repeat, BarChart2, Package,
  Layers, Globe, Mic, BookMarked,
  ArrowRight, Tv2, PenTool, Star, Archive
} from 'lucide-react'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

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

export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-full bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C9A646] font-heading font-bold text-[10px] tracking-[0.25em] uppercase mb-2">
            {greeting}, Ndivhuwo
          </p>
          <h1 className="font-heading font-black text-[#0F0F0F] text-3xl leading-none tracking-tight">
            NoChill Command
          </h1>
          <p className="text-[#6B6059] text-sm mt-2 font-heading">
            Every tool you need. One system.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-10">
          {[
            { href: '/dashboard/hooks', icon: Zap, label: 'Write a Hook', color: '#C9A646' },
            { href: '/dashboard/scripts', icon: FileText, label: 'Write a Script', color: '#3B82F6' },
            { href: '/dashboard/pitch', icon: Target, label: 'Build a Pitch', color: '#F97316' },
            { href: '/dashboard/batch-planner', icon: Layers, label: 'Plan 22 Days', color: '#6366F1' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white border border-[#E8E1D0] rounded-xl p-3.5 flex items-center gap-2.5 group cursor-pointer hover:border-[#C9A646]/40 hover:shadow-[0_2px_12px_rgba(201,166,70,0.08)] transition-all">
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                <span className="font-heading font-bold text-[12px] text-[#3D342A] group-hover:text-[#0F0F0F] transition-colors leading-tight">{item.label}</span>
                <ArrowRight className="w-3 h-3 text-[#C9C0B0] group-hover:text-[#C9A646] ml-auto flex-shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
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
            <ToolCard href="/dashboard/pitch" icon={Target} name="Pitch Builder" desc="5 Pillars + Ethos-Pathos-Logos by format" accent="#F97316" />
            <ToolCard href="/dashboard/offers" icon={Star} name="Godfather Offers" desc="Core + bonuses + guarantee + urgency stacked" accent="#D97706" />
            <ToolCard href="/dashboard/cta-optimizer" icon={Zap} name="CTA Optimizer" desc="5 CTA variants with trigger breakdown" accent="#CA8A04" />
            <ToolCard href="/dashboard/revenue" icon={TrendingUp} name="Revenue Tracker" desc="PAIDS stream income over time" accent="#16A34A" />
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
