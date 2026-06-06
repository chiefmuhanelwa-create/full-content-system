'use client'

import Link from 'next/link'
import {
  Zap, FileText, BookOpen, Brain, Target, Calendar,
  TrendingUp, MonitorPlay, Repeat, BarChart2, Package,
  Layers, Globe, Mic, BookMarked, Heart,
  ArrowRight, Tv2, PenTool, Star
} from 'lucide-react'

function ToolCard({
  href,
  icon: Icon,
  name,
  desc,
  color = 'text-[#C9A646]',
  badge,
}: {
  href: string
  icon: any
  name: string
  desc: string
  color?: string
  badge?: string
}) {
  return (
    <Link href={href}>
      <div className="nc-card p-5 group h-full cursor-pointer flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2 rounded-lg bg-[#FAF7F0] group-hover:bg-[#F4EFE3] transition-colors', color)}>
            <Icon className="w-4 h-4" />
          </div>
          {badge && <span className="nc-badge">{badge}</span>}
        </div>
        <h3 className="font-heading font-bold text-[#0A0A0A] text-sm mb-1 group-hover:text-[#8C6F1F] transition-colors leading-snug">
          {name}
        </h3>
        <p className="text-[10px] text-[#8A8071] leading-relaxed flex-1">{desc}</p>
      </div>
    </Link>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5 flex items-end gap-3">
      <div>
        <h2 className="font-heading font-black text-[#0A0A0A] text-lg leading-none">{title}</h2>
        {sub && <p className="text-[#8A8071] text-xs mt-1 font-heading">{sub}</p>}
      </div>
      <div className="flex-1 nc-divider mb-1" />
    </div>
  )
}

export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-1">
            {greeting}, Ndivhuwo
          </p>
          <h1 className="font-heading font-black text-4xl text-[#0A0A0A] leading-none">
            NoChill Command
          </h1>
          <p className="text-[#8A8071] text-sm mt-2 font-heading">
            What are we building today?
          </p>
        </div>

        {/* Quick launch strip */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[
            { href: '/dashboard/hooks', icon: Zap, label: 'Write a Hook', color: 'text-[#C9A646]' },
            { href: '/dashboard/scripts', icon: FileText, label: 'Write a Script', color: 'text-blue-500' },
            { href: '/dashboard/pitch', icon: Target, label: 'Build a Pitch', color: 'text-orange-500' },
            { href: '/dashboard/batch-planner', icon: Layers, label: 'Plan 22 Days', color: 'text-indigo-500' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white border border-[#E8E1D0] rounded-xl p-4 flex items-center gap-3 group cursor-pointer hover:border-[#C9A646]/40 hover:shadow-sm transition-all">
                <item.icon className={cn('w-4 h-4 flex-shrink-0', item.color)} />
                <span className="font-heading font-bold text-xs text-[#5C5448] group-hover:text-[#0A0A0A] transition-colors">{item.label}</span>
                <ArrowRight className="w-3 h-3 text-[#C9C0B0] group-hover:text-[#C9A646] ml-auto transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Create Content */}
        <div className="mb-10">
          <SectionHeader title="Create Content" sub="AI-powered writing tools" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hooks" icon={Zap} name="Hook Generator" desc="R×A×C×U^B formula — fear, curiosity, data, contrast" color="text-[#C9A646]" />
            <ToolCard href="/dashboard/scripts" icon={FileText} name="Script Writer" desc="7-Act structure + 10-Step Sales Framework" color="text-blue-500" />
            <ToolCard href="/dashboard/storytelling" icon={Tv2} name="Storytelling Studio" desc="5 Story Types + 7-Stage Arc mapped to emotion" color="text-purple-500" />
            <ToolCard href="/dashboard/stories" icon={BookOpen} name="Story Extractor" desc="Raw notes → structured proof story + product links" color="text-emerald-600" />
            <ToolCard href="/dashboard/repurpose" icon={Repeat} name="Repurpose" desc="One script → IG caption, LinkedIn post, X thread" color="text-cyan-600" />
            <ToolCard href="/dashboard/formulas" icon={Layers} name="Formula Writer" desc="PAS, AIDA, DRIP, BAB — structured content formats" color="text-pink-500" />
            <ToolCard href="/dashboard/teleprompter" icon={MonitorPlay} name="Teleprompter" desc="Fullscreen scroll — record to camera without freezing" color="text-amber-600" />
            <ToolCard href="/dashboard/content-studio" icon={PenTool} name="Content Studio" desc="Compose and edit any content format" color="text-[#8A8071]" />
          </div>
        </div>

        {/* Audience Intelligence */}
        <div className="mb-10">
          <SectionHeader title="Audience Intelligence" sub="Know exactly who you are speaking to" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/fears" icon={Brain} name="Fear Analyzer" desc="10 Shadow Fears — hooks, angles, CTAs per fear" color="text-red-500" />
            <ToolCard href="/dashboard/icp-pain-library" icon={Target} name="ICP Pain Library" desc="Called Expert + DNA audience pain database" color="text-orange-500" />
            <ToolCard href="/dashboard/competitor" icon={Globe} name="Competitor Intel" desc="Content gaps + positioning angles they missed" color="text-blue-500" />
            <ToolCard href="/dashboard/trends" icon={TrendingUp} name="Trend Scanner" desc="SA creator space trends with content angles" color="text-green-600" />
            <ToolCard href="/dashboard/brand-voice" icon={Mic} name="Brand Voice" desc="Score content — rewrite it in your voice" color="text-purple-500" />
          </div>
        </div>

        {/* Products & Revenue */}
        <div className="mb-10">
          <SectionHeader title="Products & Revenue" sub="PAIDS — 5 income streams" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/products" icon={Package} name="Products" desc="Full product catalogue — 10 NoChill products" color="text-[#C9A646]" />
            <ToolCard href="/dashboard/pitch" icon={Target} name="Pitch Builder" desc="5 Pillars + Ethos-Pathos-Logos by format" color="text-orange-500" />
            <ToolCard href="/dashboard/offers" icon={Star} name="Godfather Offers" desc="Core + bonuses + guarantee + urgency stacked" color="text-amber-600" />
            <ToolCard href="/dashboard/cta-optimizer" icon={Zap} name="CTA Optimizer" desc="5 CTA variants with trigger breakdown" color="text-yellow-600" />
            <ToolCard href="/dashboard/revenue" icon={TrendingUp} name="Revenue Tracker" desc="PAIDS stream income over time" color="text-green-600" />
          </div>
        </div>

        {/* Planning */}
        <div className="mb-10">
          <SectionHeader title="Planning & Scale" sub="Build the system that runs without you" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <ToolCard href="/dashboard/batch-planner" icon={Layers} name="Batch Planner" desc="22-day content plan around your launch goals" color="text-indigo-500" />
            <ToolCard href="/dashboard/content-calendar-plus" icon={Calendar} name="Content Calendar" desc="4E-balanced — Educate 35 / Entertain 30 / Earn 15" color="text-blue-500" />
            <ToolCard href="/dashboard/analytics" icon={BarChart2} name="Analytics" desc="Paste metrics → AI diagnosis + next-30-days plan" color="text-cyan-600" />
            <ToolCard href="/dashboard/content-cards" icon={BarChart2} name="Content Cards" desc="Per-post metric tracking + formula recognition" color="text-teal-600" />
            <ToolCard href="/dashboard/campaigns" icon={Target} name="Campaigns" desc="Group content + offers + emails into one launch" color="text-pink-500" />
          </div>
        </div>

        {/* Library */}
        <div className="mb-10">
          <SectionHeader title="My Library" sub="Everything you have saved" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ToolCard href="/dashboard/hook-bank" icon={BookMarked} name="Hook Bank" desc="All saved hooks — filterable by type + platform" color="text-[#C9A646]" />
            <ToolCard href="/dashboard/story-bank" icon={Heart} name="Story Bank" desc="10 proof stories — mapped to products" color="text-red-500" />
            <ToolCard href="/dashboard/vault" icon={Star} name="Content Vault" desc="110+ pre-built ideas across 4E categories" color="text-purple-500" />
            <ToolCard href="/dashboard/adapter" icon={Repeat} name="Platform Adapter" desc="LinkedIn, TikTok, X, Instagram native formats" color="text-emerald-600" />
          </div>
        </div>

        {/* Footer */}
        <div className="nc-divider mb-6" />
        <div className="flex items-center justify-between">
          <p className="text-[#C9C0B0] text-xs font-heading">
            Built on PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
          <p className="text-[#C9C0B0] text-xs font-heading">
            NOCHILL PTY LTD · 2016/507839/07
          </p>
        </div>

      </div>
    </div>
  )
}
