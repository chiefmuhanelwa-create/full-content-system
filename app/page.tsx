import Link from 'next/link'
import { Zap, Calendar, BookOpen, ArrowRight, Brain, FileText, BarChart2, Layers } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] font-display">

      {/* Nav — clean minimal like ChronoTask */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F4F4F8]/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#18181B] flex items-center justify-center">
              <span className="text-white font-black text-xs font-display">N</span>
            </div>
            <span className="font-display font-black text-[#18181B] text-[15px] tracking-tight">NOCHILL</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Tools', 'Frameworks', 'Proof', 'Pricing'].map((link) => (
              <span key={link} className="text-[#71717A] text-sm font-display font-medium hover:text-[#18181B] transition-colors cursor-default">{link}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-display font-semibold text-[#71717A] hover:text-[#18181B] transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/auth/signin" className="px-4 py-2 rounded-xl bg-[#18181B] text-white text-sm font-display font-semibold hover:bg-[#27272A] transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — ChronoTask rounded container with floating cards */}
      <section className="pt-24 pb-6 px-4 max-w-5xl mx-auto">
        <div className="relative py-16">

          {/* Floating card — top left */}
          <div className="absolute top-4 left-0 w-52 bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#E4E4E7] -rotate-2 z-20 hidden lg:block hover:-rotate-1 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] font-display font-bold text-[#A1A1AA] uppercase tracking-wider">Hook Generator</span>
            </div>
            <p className="text-[13px] font-display font-semibold text-[#18181B] leading-snug">
              "You're posting every day and still broke."
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="px-1.5 py-0.5 rounded bg-amber-50 text-[9px] font-display font-bold text-amber-600 uppercase tracking-wider">R×A×C×U^B</div>
              <div className="px-1.5 py-0.5 rounded bg-red-50 text-[9px] font-display font-bold text-red-400 uppercase tracking-wider">SF3</div>
            </div>
          </div>

          {/* Floating card — top right */}
          <div className="absolute top-2 right-0 w-56 bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#E4E4E7] rotate-2 z-20 hidden lg:block hover:rotate-1 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-[10px] font-display font-bold text-[#A1A1AA] uppercase tracking-wider">Proof Story · S004</span>
            </div>
            <div className="text-2xl font-display font-black text-[#18181B] leading-none">R50,000</div>
            <p className="text-[11px] text-[#A1A1AA] mt-1 font-display leading-relaxed">March 2021 — first R50K month. Crashed to R8K two months later.</p>
            <div className="mt-2.5 h-1.5 rounded-full bg-[#F4F4F8]">
              <div className="h-full w-4/5 rounded-full bg-blue-500" />
            </div>
          </div>

          {/* Floating card — bottom left */}
          <div className="absolute bottom-4 left-2 w-60 bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#E4E4E7] rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-violet-50">
                <Layers className="w-3.5 h-3.5 text-violet-500" />
              </div>
              <span className="text-[10px] font-display font-bold text-[#A1A1AA] uppercase tracking-wider">Today's Pipeline</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Write 3 hooks', color: 'bg-amber-400' },
                { label: 'Draft a script', color: 'bg-blue-400' },
                { label: 'Schedule 7 days', color: 'bg-green-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                  <span className="text-[12px] font-display text-[#52525B]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card — bottom right (dark like Codename CRM) */}
          <div className="absolute bottom-6 right-2 w-52 bg-[#18181B] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-[#27272A] -rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-white/10">
                <Brain className="w-3.5 h-3.5 text-white/60" />
              </div>
              <span className="text-[10px] font-display font-bold text-white/40 uppercase tracking-wider">Shadow Fears</span>
            </div>
            <div className="space-y-1.5">
              {['Invisible Labour', 'Platform Dependency', 'Time Anxiety'].map((fear) => (
                <div key={fear} className="flex items-center justify-between">
                  <span className="text-[11px] font-display text-white/60">{fear}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Main hero container — ChronoTask rounded frame */}
          <div className="rounded-3xl bg-white border border-[#E4E4E7] shadow-sm overflow-hidden relative flex flex-col items-center text-center px-8 py-24 md:py-32">
            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                opacity: 0.55,
              }}
            />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-[#F4F4F8] border border-[#E4E4E7]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[#71717A] font-display font-medium text-xs">AI-powered · NoChill frameworks · Built for SA creators</span>
              </div>

              <h1 className="font-display font-black leading-[0.92] tracking-tight mb-6">
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#18181B' }}>Create. Plan.</span>
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#D4D4D8' }}>Sell more.</span>
              </h1>

              <p className="text-[#71717A] text-lg font-display font-normal mb-9 leading-relaxed max-w-lg mx-auto">
                42 AI tools built on the NoChill frameworks. The exact system behind R600K+ in annual income.
              </p>

              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-display font-semibold text-sm hover:bg-blue-700 transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
              >
                Enter the System
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 px-6 bg-white border-y border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 'R600K+', label: 'Annual income' },
            { value: '50+', label: 'Brand deals closed' },
            { value: '3M+', label: 'Total followers' },
            { value: '42', label: 'AI tools in system' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-display font-black text-[#18181B] leading-none">{stat.value}</div>
              <div className="text-[13px] font-display text-[#A1A1AA] mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-blue-600 font-display font-semibold text-xs uppercase tracking-widest mb-2">What's inside</p>
          <h2 className="text-[32px] font-display font-black text-[#18181B] leading-tight">42 tools. One system.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Hook Generator', desc: 'R×A×C×U^B Formula — fear, curiosity, contrast, data hooks', tag: 'CREATE', tc: 'text-amber-700', bg: 'bg-amber-50' },
            { title: 'Script Writer', desc: '7-Act structure + 10-Step Sales Framework for any duration', tag: 'CREATE', tc: 'text-blue-700', bg: 'bg-blue-50' },
            { title: 'Storytelling Studio', desc: '5 Story Types + 7-Stage Arc mapped to emotional triggers', tag: 'CREATE', tc: 'text-violet-700', bg: 'bg-violet-50' },
            { title: 'Fear Analyzer', desc: '10 Shadow Fears profiled — hooks, angles, objection handlers', tag: 'AUDIENCE', tc: 'text-red-700', bg: 'bg-red-50' },
            { title: 'Pitch Builder', desc: '5 Pillars pitch + Ethos-Pathos-Logos for DM, email, VSL', tag: 'REVENUE', tc: 'text-orange-700', bg: 'bg-orange-50' },
            { title: 'Batch Planner', desc: '22-day content plan built around your launch goals', tag: 'PLAN', tc: 'text-indigo-700', bg: 'bg-indigo-50' },
            { title: 'Brand Voice', desc: 'Analyse and score content against your documented voice', tag: 'AUDIENCE', tc: 'text-purple-700', bg: 'bg-purple-50' },
            { title: 'Competitor Intel', desc: 'Gap analysis, positioning angles, content they are missing', tag: 'AUDIENCE', tc: 'text-cyan-700', bg: 'bg-cyan-50' },
            { title: 'Platform Adapter', desc: 'One script → LinkedIn, TikTok, X, Instagram native formats', tag: 'CREATE', tc: 'text-green-700', bg: 'bg-green-50' },
            { title: 'Story Extractor', desc: 'Raw notes → structured proof story with product links', tag: 'CREATE', tc: 'text-emerald-700', bg: 'bg-emerald-50' },
            { title: 'CTA Optimizer', desc: '5 CTA variants with psychological trigger breakdown', tag: 'REVENUE', tc: 'text-yellow-700', bg: 'bg-yellow-50' },
            { title: 'Analytics Insights', desc: 'Paste platform metrics → AI diagnosis + next-30-days plan', tag: 'PLAN', tc: 'text-sky-700', bg: 'bg-sky-50' },
          ].map((tool) => (
            <div key={tool.title} className="bg-white border border-[#E4E4E7] rounded-xl p-5 group hover:border-[#D4D4D8] hover:shadow-sm transition-all cursor-default">
              <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-display font-bold uppercase tracking-wider mb-3 ${tool.tc} ${tool.bg}`}>
                {tool.tag}
              </div>
              <h3 className="font-display font-semibold text-[#18181B] text-[14px] mb-1.5 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-[13px] text-[#71717A] leading-relaxed font-display">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAIDS */}
      <section className="py-20 px-6 bg-white border-t border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-display font-semibold text-xs uppercase tracking-widest mb-2">Revenue model</p>
            <h2 className="text-[28px] font-display font-black text-[#18181B]">PAIDS — 5 income streams</h2>
            <p className="text-[#71717A] font-display text-sm mt-2">Every rand you earn runs through one of these five channels.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { letter: 'P', label: 'Products', desc: 'Digital products built around your frameworks' },
              { letter: 'A', label: 'Affiliates', desc: 'Partner commissions tracked and attributed' },
              { letter: 'I', label: 'Information', desc: 'Courses, guides, workshops' },
              { letter: 'D', label: 'Deals', desc: 'Brand partnerships managed end-to-end' },
              { letter: 'S', label: 'Services', desc: 'Consulting, coaching, speaking' },
            ].map((stream) => (
              <div key={stream.letter} className="bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl p-5 text-center hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-black text-white text-sm">{stream.letter}</span>
                </div>
                <h3 className="font-display font-semibold text-[#18181B] mb-1 text-[13px]">{stream.label}</h3>
                <p className="text-[#71717A] text-xs leading-relaxed font-display">{stream.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#A1A1AA] text-xs mt-6 font-display">
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#F4F4F8] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            opacity: 0.4,
          }}
        />
        <div className="max-w-xl mx-auto text-center relative">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-12 shadow-sm">
            <p className="text-blue-600 font-display font-semibold text-xs uppercase tracking-widest mb-4">For children's children</p>
            <h2 className="text-[32px] font-display font-black text-[#18181B] leading-tight mb-3">
              This is your system.
            </h2>
            <p className="text-[#71717A] font-display text-sm mb-8 leading-relaxed">
              Built on the exact frameworks behind R600,000+ in annual income.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-display font-semibold text-sm hover:bg-blue-700 transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
            >
              Enter the System
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7] py-6 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#18181B] flex items-center justify-center">
              <span className="text-white font-black text-[10px] font-display">N</span>
            </div>
            <span className="font-display font-semibold text-[#A1A1AA] text-sm">NOCHILL</span>
          </div>
          <p className="text-[#A1A1AA] text-xs font-display">© 2026 NOCHILL PTY LTD (2016/507839/07)</p>
        </div>
      </footer>
    </div>
  )
}
