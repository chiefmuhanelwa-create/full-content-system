import Link from 'next/link'
import { Zap, BarChart2, Layers, Brain, ArrowRight, FileText, BookOpen, Target, Repeat, Mic, Globe, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen font-display" style={{ background: '#0a0a0a' }}>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: 'rgba(10,10,10,0.85)', borderBottom: '1px solid #1e1e1e' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <span className="font-display font-black text-xs" style={{ color: '#0a0a0a' }}>N</span>
            </div>
            <span className="font-display font-black text-[15px] tracking-tight" style={{ color: '#FAF7F0' }}>NOCHILL</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Tools', 'Frameworks', 'Proof'].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`} className="text-sm font-display font-medium transition-colors" style={{ color: '#5a5a6a' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5a5a6a')}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-display font-semibold transition-colors hidden sm:block" style={{ color: '#5a5a6a' }}>
              Sign in
            </Link>
            <Link href="/auth/signin" className="px-4 py-2 rounded-xl text-sm font-display font-bold transition-all" style={{ background: '#C9A84C', color: '#0a0a0a' }}>
              Enter System
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-6 px-4 max-w-5xl mx-auto">
        <div className="relative py-16">

          {/* Floating card — Hook Generator */}
          <div className="absolute top-4 left-0 w-52 rounded-2xl p-4 -rotate-2 z-20 hidden lg:block hover:-rotate-1 transition-transform duration-300"
            style={{ background: '#141414', border: '1px solid #2b2b2b', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,168,76,0.12)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#5a5a6a' }}>Hook Generator</span>
            </div>
            <p className="text-[13px] font-display font-semibold leading-snug" style={{ color: '#FAF7F0' }}>
              "You're posting every day and still broke."
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider" style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>R×A×C×U^B</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>SF3</span>
            </div>
          </div>

          {/* Floating card — Proof Story */}
          <div className="absolute top-2 right-0 w-56 rounded-2xl p-4 rotate-2 z-20 hidden lg:block hover:rotate-1 transition-transform duration-300"
            style={{ background: '#141414', border: '1px solid #2b2b2b', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,168,76,0.12)' }}>
                <BarChart2 className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#5a5a6a' }}>Proof Story · S004</span>
            </div>
            <div className="text-2xl font-display font-black leading-none" style={{ color: '#FAF7F0' }}>R50,000</div>
            <p className="text-[11px] mt-1 font-display leading-relaxed" style={{ color: '#5a5a6a' }}>March 2021 — first R50K month. Crashed to R8K two months later.</p>
            <div className="mt-2.5 h-1.5 rounded-full" style={{ background: '#1e1e1e' }}>
              <div className="h-full w-4/5 rounded-full" style={{ background: '#C9A84C' }} />
            </div>
          </div>

          {/* Floating card — Pipeline */}
          <div className="absolute bottom-4 left-2 w-60 rounded-2xl p-4 rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300"
            style={{ background: '#141414', border: '1px solid #2b2b2b', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <Layers className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#5a5a6a' }}>Today's Pipeline</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Write 3 hooks', color: '#C9A84C' },
                { label: 'Draft a script', color: '#3b82f6' },
                { label: 'Schedule 7 days', color: '#22c55e' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[12px] font-display" style={{ color: '#8a8a96' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card — Shadow Fears */}
          <div className="absolute bottom-6 right-2 w-52 rounded-2xl p-4 -rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300"
            style={{ background: '#141414', border: '1px solid #2b2b2b', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <Brain className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#5a5a6a' }}>Shadow Fears</span>
            </div>
            <div className="space-y-1.5">
              {['Invisible Labour', 'Platform Dependency', 'Time Anxiety'].map((fear) => (
                <div key={fear} className="flex items-center justify-between">
                  <span className="text-[11px] font-display" style={{ color: '#8a8a96' }}>{fear}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f87171' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Main hero container */}
          <div className="rounded-3xl overflow-hidden relative flex flex-col items-center text-center px-8 py-24 md:py-32"
            style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#2b2b2b 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />
            {/* Gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }} />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full" style={{ background: '#1a1a1a', border: '1px solid #2b2b2b' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
                <span className="font-display font-medium text-xs" style={{ color: '#8a8a96' }}>AI-powered · NoChill frameworks · Built for SA creators</span>
              </div>

              <h1 className="font-display font-black leading-[0.92] tracking-tight mb-6">
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#FAF7F0' }}>Create. Plan.</span>
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#C9A84C' }}>Sell more.</span>
              </h1>

              <p className="text-lg font-display font-normal mb-9 leading-relaxed max-w-lg mx-auto" style={{ color: '#5a5a6a' }}>
                45 AI tools built on the NoChill frameworks. The exact system behind R600K+ in annual income.
              </p>

              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all"
                style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 4px 24px rgba(201,168,76,0.25)' }}
              >
                Enter the System
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section id="proof" className="py-10 px-6" style={{ borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', background: '#111' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 'R600K+', label: 'Annual income' },
            { value: '50+', label: 'Brand deals closed' },
            { value: '3M+', label: 'Total followers' },
            { value: '45', label: 'AI tools in system' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-display font-black leading-none" style={{ color: '#C9A84C' }}>{stat.value}</div>
              <div className="text-[13px] font-display mt-1.5" style={{ color: '#5a5a6a' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="font-display font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>What's inside</p>
          <h2 className="text-[32px] font-display font-black leading-tight" style={{ color: '#FAF7F0' }}>45 tools. One system.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Hook Generator', desc: 'R×A×C×U^B Formula — verbal + visual hook pairs. Interest Peak targeting.', tag: 'CREATE', accent: '#C9A84C' },
            { title: 'Script Writer', desc: '7-Act structure + 3 NOCHILL templates. R50 quality gate.', tag: 'CREATE', accent: '#3b82f6' },
            { title: 'Pipeline Board', desc: '6-column Kanban — Idea → Posted. R50 gate per card.', tag: 'PLAN', accent: '#a855f7' },
            { title: 'Fear Analyzer', desc: '10 Shadow Fears profiled — hooks, angles, objection handlers', tag: 'AUDIENCE', accent: '#f87171' },
            { title: 'Pitch Builder', desc: '5 Pillars pitch + Ethos-Pathos-Logos for DM, email, VSL', tag: 'REVENUE', accent: '#f97316' },
            { title: 'Batch Planner', desc: '22-day content plan built around your launch goals', tag: 'PLAN', accent: '#6366f1' },
            { title: 'Storytelling Studio', desc: '5 Story Types + 7-Stage Arc mapped to emotional triggers', tag: 'CREATE', accent: '#8b5cf6' },
            { title: 'Caption + Hashtags', desc: 'Platform-optimised captions + hashtag tiers from any script', tag: 'CREATE', accent: '#22c55e' },
            { title: 'Repurpose', desc: 'One script → LinkedIn, TikTok, X, Instagram native formats', tag: 'CREATE', accent: '#06b6d4' },
            { title: 'Story Extractor', desc: 'Raw notes → structured proof story with product links', tag: 'CREATE', accent: '#10b981' },
            { title: 'Shoot Runsheet', desc: 'Timed production schedule for batch recording sessions', tag: 'PLAN', accent: '#f59e0b' },
            { title: 'Analytics Insights', desc: 'Paste platform metrics → AI diagnosis + next-30-days plan', tag: 'PLAN', accent: '#0ea5e9' },
          ].map((tool) => (
            <div key={tool.title} className="rounded-xl p-5 transition-all cursor-default group"
              style={{ background: '#111', border: '1px solid #1e1e1e' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2b2b2b'; (e.currentTarget as HTMLDivElement).style.background = '#161616' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLDivElement).style.background = '#111' }}
            >
              <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-display font-bold uppercase tracking-wider mb-3"
                style={{ background: `${tool.accent}14`, color: tool.accent, border: `1px solid ${tool.accent}25` }}>
                {tool.tag}
              </div>
              <h3 className="font-display font-semibold text-[14px] mb-1.5" style={{ color: '#FAF7F0' }}>
                {tool.title}
              </h3>
              <p className="text-[13px] leading-relaxed font-display" style={{ color: '#5a5a6a' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAIDS */}
      <section id="frameworks" className="py-20 px-6" style={{ borderTop: '1px solid #1e1e1e', background: '#0d0d0d' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-display font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Revenue model</p>
            <h2 className="text-[28px] font-display font-black" style={{ color: '#FAF7F0' }}>PAIDS — 5 income streams</h2>
            <p className="font-display text-sm mt-2" style={{ color: '#5a5a6a' }}>Every rand you earn runs through one of these five channels.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { letter: 'P', label: 'Products', desc: 'Digital products built around your frameworks' },
              { letter: 'A', label: 'Affiliates', desc: 'Partner commissions tracked and attributed' },
              { letter: 'I', label: 'Information', desc: 'Courses, guides, workshops' },
              { letter: 'D', label: 'Deals', desc: 'Brand partnerships managed end-to-end' },
              { letter: 'S', label: 'Services', desc: 'Consulting, coaching, speaking' },
            ].map((stream) => (
              <div key={stream.letter} className="rounded-xl p-5 text-center transition-all"
                style={{ background: '#111', border: '1px solid #1e1e1e' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e'}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#C9A84C' }}>
                  <span className="font-display font-black text-sm" style={{ color: '#0a0a0a' }}>{stream.letter}</span>
                </div>
                <h3 className="font-display font-semibold mb-1 text-[13px]" style={{ color: '#FAF7F0' }}>{stream.label}</h3>
                <p className="text-xs leading-relaxed font-display" style={{ color: '#5a5a6a' }}>{stream.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6 font-display" style={{ color: '#3a3a4a' }}>
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }} />
        <div className="max-w-xl mx-auto text-center relative">
          <div className="rounded-2xl p-12" style={{ background: '#111', border: '1px solid #2b2b2b', boxShadow: '0 0 60px rgba(201,168,76,0.04)' }}>
            <p className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>For children's children</p>
            <h2 className="text-[32px] font-display font-black leading-tight mb-3" style={{ color: '#FAF7F0' }}>
              This is your system.
            </h2>
            <p className="font-display text-sm mb-8 leading-relaxed" style={{ color: '#5a5a6a' }}>
              Built on the exact frameworks behind R600,000+ in annual income.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 4px 24px rgba(201,168,76,0.25)' }}
            >
              Enter the System
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid #1e1e1e', background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <span className="font-display font-black text-[10px]" style={{ color: '#0a0a0a' }}>N</span>
            </div>
            <span className="font-display font-semibold text-sm" style={{ color: '#3a3a4a' }}>NOCHILL</span>
          </div>
          <p className="text-xs font-display" style={{ color: '#3a3a4a' }}>© 2026 NOCHILL PTY LTD (2016/507839/07)</p>
        </div>
      </footer>
    </div>
  )
}
