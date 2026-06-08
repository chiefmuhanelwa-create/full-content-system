import Link from 'next/link'
import { Zap, Calendar, BookOpen, ArrowRight, Brain } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#0A0A0A] overflow-x-hidden">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#E8E1D0] bg-[#FAF7F0]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A646] flex items-center justify-center shadow-[0_0_16px_rgba(201,166,70,0.3)]">
              <span className="text-[#0A0A0A] font-black text-sm font-heading">N</span>
            </div>
            <span className="font-heading font-black text-[#0A0A0A] tracking-widest text-sm uppercase">NOCHILL</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-[#8A8071] text-sm font-heading font-semibold hover:text-[#0A0A0A] transition-colors cursor-default">Tools</span>
            <span className="text-[#8A8071] text-sm font-heading font-semibold hover:text-[#0A0A0A] transition-colors cursor-default">Frameworks</span>
            <span className="text-[#8A8071] text-sm font-heading font-semibold hover:text-[#0A0A0A] transition-colors cursor-default">Proof</span>
          </nav>
          <Link
            href="/auth/signin"
            className="px-5 py-2 rounded-lg bg-[#C9A646] text-[#0A0A0A] font-heading font-bold text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-colors"
          >
            Enter System
          </Link>
        </div>
      </header>

      {/* Hero — two column with floating cards */}
      <section className="relative pt-36 pb-24 px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#C9A646 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.07,
          }}
        />
        {/* Gold glow orb */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,166,70,0.10) 0%, rgba(230,200,113,0.04) 40%, transparent 65%)',
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column — content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#F4EFE3] border border-[#E8E1D0]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A646] animate-pulse" />
              <span className="text-[#8C6F1F] font-heading font-bold text-xs tracking-[0.15em] uppercase">Ndivhuwo Muhanelwa · NoChill PTY LTD</span>
            </div>
            <h1 className="font-heading font-black text-6xl md:text-7xl leading-none tracking-tight mb-6">
              The Content<br />
              <span className="text-[#C9A646]">Intelligence</span><br />
              <span className="text-[#8A8071]">System.</span>
            </h1>
            <p className="text-[#5C5448] text-lg leading-relaxed max-w-xl mb-10">
              Every tool you need to create, plan, pitch, and scale — built around the NoChill frameworks. 42 tools. One system.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C9A646] text-[#0A0A0A] font-heading font-black text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-all hover:shadow-[0_4px_24px_rgba(201,166,70,0.35)]"
              >
                Enter the System
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[#8A8071] text-xs font-heading">Built on PAIDS · SEEDS · DARES</span>
            </div>
          </div>

          {/* Right column — floating cards */}
          <div className="relative h-[420px] hidden lg:block">
            {/* Card 1 — Hook preview */}
            <div className="absolute top-0 right-4 w-64 bg-white border border-[#E8E1D0] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.07)] rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-[#FEF9EC]">
                  <Zap className="w-3.5 h-3.5 text-[#C9A646]" />
                </div>
                <span className="text-[10px] font-heading font-black text-[#8C6F1F] uppercase tracking-widest">Hook Generator</span>
              </div>
              <p className="text-[13px] font-heading font-semibold text-[#1C1C1C] leading-snug mb-2">
                "You're posting every day and still broke."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-1.5 py-0.5 rounded bg-[#FEF9EC] text-[9px] font-heading font-black text-[#8C6F1F] uppercase tracking-widest">Shadow Fear SF3</span>
                <span className="px-1.5 py-0.5 rounded bg-[#F0FDF4] text-[9px] font-heading font-black text-[#059669] uppercase tracking-widest">R×A×C×U^B</span>
              </div>
            </div>

            {/* Card 2 — Dark story card */}
            <div className="absolute top-40 -right-2 w-52 bg-[#0F0F0F] border border-white/10 rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.18)] -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="text-[10px] font-heading font-bold text-[#C9A646] uppercase tracking-widest mb-2">Proof Story · S004</div>
              <div className="text-2xl font-heading font-black text-white mb-1">R50,000</div>
              <div className="text-[11px] text-white/45 leading-relaxed">March 2021 — first R50K month. Crashed to R8K two months later.</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/10">
                  <div className="h-full w-[80%] rounded-full bg-[#C9A646]" />
                </div>
                <span className="text-[9px] text-white/30 font-heading">verified</span>
              </div>
            </div>

            {/* Card 3 — Calendar preview */}
            <div className="absolute bottom-10 right-8 w-56 bg-white border border-[#E8E1D0] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.07)] rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-[#EFF6FF]">
                  <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                </div>
                <span className="text-[10px] font-heading font-black text-[#3B82F6] uppercase tracking-widest">22-Day Batch Plan</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Week 1 — 6 hooks', color: '#C9A646', pct: '100%' },
                  { label: 'Week 2 — 4 scripts', color: '#3B82F6', pct: '60%' },
                  { label: 'Week 3 — 2 pitches', color: '#6366F1', pct: '30%' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-[#6B6059] font-heading">{item.label}</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#F0EBE0]">
                      <div className="h-full rounded-full transition-all" style={{ width: item.pct, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4 — mini stat chip, floating */}
            <div className="absolute top-16 left-0 bg-white border border-[#E8E1D0] rounded-xl px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#FEF2F2]">
                <Brain className="w-3 h-3 text-[#EF4444]" />
              </div>
              <span className="text-[11px] font-heading font-bold text-[#0F0F0F]">10 Shadow Fears</span>
            </div>

            <div className="absolute bottom-28 left-2 bg-white border border-[#E8E1D0] rounded-xl px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#F0FDF4]">
                <BookOpen className="w-3 h-3 text-[#059669]" />
              </div>
              <span className="text-[11px] font-heading font-bold text-[#0F0F0F]">20 Proof Stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-[#E8E1D0] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: 'R600K+', label: 'Annual Income' },
            { number: '50+', label: 'Brand Deals Closed' },
            { number: '3M+', label: 'Cross-Platform Followers' },
            { number: '9', label: 'Industry Awards' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-black text-4xl text-[#C9A646] mb-1">{stat.number}</div>
              <div className="text-[#8A8071] text-xs font-heading tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        {/* Dot grid subtle background */}
        <div className="relative">
          <div className="mb-12">
            <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-3">What's inside</p>
            <h2 className="font-heading font-black text-4xl text-[#0A0A0A]">42 tools. One system.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Hook Generator', desc: 'R×A×C×U^B Formula — fear, curiosity, contrast, data hooks', tag: 'CREATE', tagColor: '#C9A646', tagBg: '#FEF9EC' },
              { title: 'Script Writer', desc: '7-Act structure + 10-Step Sales Framework for any duration', tag: 'CREATE', tagColor: '#3B82F6', tagBg: '#EFF6FF' },
              { title: 'Storytelling Studio', desc: '5 Story Types + 7-Stage Arc mapped to emotional triggers', tag: 'CREATE', tagColor: '#8B5CF6', tagBg: '#F5F3FF' },
              { title: 'Fear Analyzer', desc: '10 Shadow Fears profiled — hooks, angles, objection handlers', tag: 'AUDIENCE', tagColor: '#EF4444', tagBg: '#FEF2F2' },
              { title: 'Pitch Builder', desc: '5 Pillars pitch + Ethos-Pathos-Logos for DM, email, VSL', tag: 'REVENUE', tagColor: '#F97316', tagBg: '#FFF7ED' },
              { title: 'Batch Planner', desc: '22-day content plan built around your launch goals', tag: 'PLAN', tagColor: '#6366F1', tagBg: '#EEF2FF' },
              { title: 'Brand Voice', desc: 'Analyse and score content against your documented voice', tag: 'AUDIENCE', tagColor: '#7C3AED', tagBg: '#F5F3FF' },
              { title: 'Competitor Intel', desc: 'Gap analysis, positioning angles, content they are missing', tag: 'AUDIENCE', tagColor: '#0891B2', tagBg: '#ECFEFF' },
              { title: 'Platform Adapter', desc: 'One script → LinkedIn, TikTok, X, Instagram native formats', tag: 'CREATE', tagColor: '#059669', tagBg: '#F0FDF4' },
              { title: 'Story Extractor', desc: 'Raw notes → structured proof story with product links', tag: 'CREATE', tagColor: '#059669', tagBg: '#F0FDF4' },
              { title: 'CTA Optimizer', desc: '5 CTA variants with psychological trigger breakdown', tag: 'REVENUE', tagColor: '#CA8A04', tagBg: '#FEFCE8' },
              { title: 'Analytics Insights', desc: 'Paste platform metrics → AI diagnosis + next-30-days plan', tag: 'PLAN', tagColor: '#0891B2', tagBg: '#ECFEFF' },
            ].map((tool) => (
              <div key={tool.title} className="bg-white border border-[#E8E1D0] rounded-xl p-6 group hover:border-[#C9A646]/40 hover:shadow-[0_4px_20px_rgba(201,166,70,0.1)] transition-all cursor-default">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded-md font-heading font-bold text-[10px] tracking-widest uppercase"
                    style={{ backgroundColor: tool.tagBg, color: tool.tagColor }}
                  >
                    {tool.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-[#0A0A0A] text-base mb-2 group-hover:text-[#8C6F1F] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[#8A8071] text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIDS section */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-3">The Revenue Model</p>
            <h2 className="font-heading font-black text-3xl text-white">PAIDS — 5 Income Streams</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { letter: 'P', label: 'Products', desc: 'Digital products built around your frameworks' },
              { letter: 'A', label: 'Affiliates', desc: 'Partner commissions tracked and attributed' },
              { letter: 'I', label: 'Information', desc: 'Courses, guides, workshops' },
              { letter: 'D', label: 'Deals', desc: 'Brand partnerships managed end-to-end' },
              { letter: 'S', label: 'Services', desc: 'Consulting, coaching, speaking' },
            ].map((stream) => (
              <div key={stream.letter} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 text-center hover:border-[#C9A646]/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#C9A646] flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-black text-[#0A0A0A] text-lg">{stream.letter}</span>
                </div>
                <h3 className="font-heading font-bold text-white mb-1 text-sm">{stream.label}</h3>
                <p className="text-[#666] text-xs leading-relaxed">{stream.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#444] text-xs mt-6 font-heading tracking-wide">
            Built on PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#FAF7F0] relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#C9A646 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.05,
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="bg-white border border-[#E8E1D0] rounded-2xl p-12 shadow-[0_4px_40px_rgba(201,166,70,0.1)]">
            <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4">For children's children</p>
            <h2 className="font-heading font-black text-4xl text-[#0A0A0A] mb-4">
              This is your system.<br />Enter it.
            </h2>
            <p className="text-[#8A8071] text-sm mb-8">Built on the exact frameworks behind R600,000+ in annual income.</p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[#C9A646] text-[#0A0A0A] font-heading font-black text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-all hover:shadow-[0_4px_24px_rgba(201,166,70,0.35)]"
            >
              Enter the System
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E1D0] py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C9A646] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-xs font-heading">N</span>
            </div>
            <span className="font-heading font-black text-[#8A8071] tracking-widest text-xs uppercase">NOCHILL</span>
          </div>
          <p className="text-[#C9C0B0] text-xs">© 2026 NOCHILL PTY LTD (2016/507839/07)</p>
        </div>
      </footer>
    </div>
  )
}
