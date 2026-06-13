import Link from 'next/link'
import { Zap, BarChart2, Layers, Brain, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen font-display" style={{ background: '#FAFAFA' }}>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E4E4E7' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <span className="font-display font-black text-xs" style={{ color: '#0a0a0a' }}>N</span>
            </div>
            <span className="font-display font-black text-[15px] tracking-tight" style={{ color: '#18181B' }}>NOCHILL</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Tools', 'Frameworks', 'Proof'].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`}
                className="text-sm font-display font-medium transition-colors"
                style={{ color: '#71717A' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#18181B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#71717A')}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin"
              className="text-sm font-display font-semibold transition-colors hidden sm:block"
              style={{ color: '#71717A' }}>
              Sign in
            </Link>
            <Link href="/auth/signin"
              className="px-4 py-2 rounded-xl text-sm font-display font-bold transition-all"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 2px 12px rgba(201,168,76,0.25)' }}>
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
            style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,168,76,0.1)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#A1A1AA' }}>Hook Generator</span>
            </div>
            <p className="text-[13px] font-display font-semibold leading-snug" style={{ color: '#18181B' }}>
              "You're posting every day and still broke."
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>R×A×C×U^B</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider"
                style={{ background: 'rgba(220,38,38,0.06)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}>SF3</span>
            </div>
          </div>

          {/* Floating card — Proof Story */}
          <div className="absolute top-2 right-0 w-56 rounded-2xl p-4 rotate-2 z-20 hidden lg:block hover:rotate-1 transition-transform duration-300"
            style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,168,76,0.1)' }}>
                <BarChart2 className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#A1A1AA' }}>Proof Story · S004</span>
            </div>
            <div className="text-2xl font-display font-black leading-none" style={{ color: '#18181B' }}>R50,000</div>
            <p className="text-[11px] mt-1 font-display leading-relaxed" style={{ color: '#71717A' }}>March 2021 — first R50K month. Crashed to R8K two months later.</p>
            <div className="mt-2.5 h-1.5 rounded-full" style={{ background: '#F4F4F5' }}>
              <div className="h-full w-4/5 rounded-full" style={{ background: '#C9A84C' }} />
            </div>
          </div>

          {/* Floating card — Pipeline */}
          <div className="absolute bottom-4 left-2 w-60 rounded-2xl p-4 rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300"
            style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)' }}>
                <Layers className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#A1A1AA' }}>Today's Pipeline</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Write 3 hooks', color: '#C9A84C' },
                { label: 'Draft a script', color: '#3b82f6' },
                { label: 'Schedule 7 days', color: '#22c55e' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[12px] font-display" style={{ color: '#71717A' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card — Shadow Fears */}
          <div className="absolute bottom-6 right-2 w-52 rounded-2xl p-4 -rotate-1 z-20 hidden lg:block hover:rotate-0 transition-transform duration-300"
            style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(220,38,38,0.06)' }}>
                <Brain className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#A1A1AA' }}>Shadow Fears</span>
            </div>
            <div className="space-y-1.5">
              {['Invisible Labour', 'Platform Dependency', 'Time Anxiety'].map((fear) => (
                <div key={fear} className="flex items-center justify-between">
                  <span className="text-[11px] font-display" style={{ color: '#71717A' }}>{fear}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC2626' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Hero container */}
          <div className="rounded-3xl overflow-hidden relative flex flex-col items-center text-center px-8 py-24 md:py-32"
            style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#E4E4E7 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />
            {/* Gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }} />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full"
                style={{ background: '#F4F4F5', border: '1px solid #E4E4E7' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
                <span className="font-display font-medium text-xs" style={{ color: '#71717A' }}>AI-powered · NoChill frameworks · Built for SA creators</span>
              </div>

              <h1 className="font-display font-black leading-[0.92] tracking-tight mb-6">
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#18181B' }}>Create. Plan.</span>
                <span className="block" style={{ fontSize: 'clamp(52px, 7vw, 84px)', color: '#C9A84C' }}>Sell more.</span>
              </h1>

              <p className="text-lg font-display font-normal mb-9 leading-relaxed max-w-lg mx-auto" style={{ color: '#71717A' }}>
                45 AI tools built on the NoChill frameworks. The exact system behind R600K+ in annual income.
              </p>

              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all"
                style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }}
              >
                Enter the System
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section id="proof" className="py-10 px-6" style={{ borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7', background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 'R600K+', label: 'Annual income' },
            { value: '50+', label: 'Brand deals closed' },
            { value: '3M+', label: 'Total followers' },
            { value: '45', label: 'AI tools in system' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-display font-black leading-none" style={{ color: '#C9A84C' }}>{stat.value}</div>
              <div className="text-[13px] font-display mt-1.5" style={{ color: '#A1A1AA' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="font-display font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>What's inside</p>
          <h2 className="text-[32px] font-display font-black leading-tight" style={{ color: '#18181B' }}>45 tools. One system.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Hook Generator', desc: 'R×A×C×U^B Formula — verbal + visual hook pairs. Interest Peak targeting.', tag: 'CREATE', accent: '#C9A84C' },
            { title: 'Script Writer', desc: '7-Act structure + 3 NOCHILL templates. R50 quality gate.', tag: 'CREATE', accent: '#3b82f6' },
            { title: 'Pipeline Board', desc: '6-column Kanban — Idea → Posted. R50 gate per card.', tag: 'PLAN', accent: '#6366f1' },
            { title: 'Fear Analyzer', desc: '10 Shadow Fears profiled — hooks, angles, objection handlers', tag: 'AUDIENCE', accent: '#DC2626' },
            { title: 'Pitch Builder', desc: '5 Pillars pitch + Ethos-Pathos-Logos for DM, email, VSL', tag: 'REVENUE', accent: '#f97316' },
            { title: 'Batch Planner', desc: '22-day content plan built around your launch goals', tag: 'PLAN', accent: '#4f46e5' },
            { title: 'Storytelling Studio', desc: '5 Story Types + 7-Stage Arc mapped to emotional triggers', tag: 'CREATE', accent: '#8b5cf6' },
            { title: 'Caption + Hashtags', desc: 'Platform-optimised captions + hashtag tiers from any script', tag: 'CREATE', accent: '#22c55e' },
            { title: 'Repurpose', desc: 'One script → LinkedIn, TikTok, X, Instagram native formats', tag: 'CREATE', accent: '#06b6d4' },
            { title: 'Story Extractor', desc: 'Raw notes → structured proof story with product links', tag: 'CREATE', accent: '#10b981' },
            { title: 'Shoot Runsheet', desc: 'Timed production schedule for batch recording sessions', tag: 'PLAN', accent: '#f59e0b' },
            { title: 'Analytics Insights', desc: 'Paste platform metrics → AI diagnosis + next-30-days plan', tag: 'PLAN', accent: '#0ea5e9' },
          ].map((tool) => (
            <div key={tool.title} className="rounded-xl p-5 transition-all cursor-default"
              style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = `${tool.accent}40`
                el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#E4E4E7'
                el.style.boxShadow = 'none'
              }}
            >
              <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-display font-bold uppercase tracking-wider mb-3"
                style={{ background: `${tool.accent}12`, color: tool.accent, border: `1px solid ${tool.accent}20` }}>
                {tool.tag}
              </div>
              <h3 className="font-display font-semibold text-[14px] mb-1.5" style={{ color: '#18181B' }}>{tool.title}</h3>
              <p className="text-[13px] leading-relaxed font-display" style={{ color: '#71717A' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAIDS */}
      <section id="frameworks" className="py-20 px-6" style={{ borderTop: '1px solid #E4E4E7', background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-display font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Revenue model</p>
            <h2 className="text-[28px] font-display font-black" style={{ color: '#18181B' }}>PAIDS — 5 income streams</h2>
            <p className="font-display text-sm mt-2" style={{ color: '#71717A' }}>Every rand you earn runs through one of these five channels.</p>
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
                style={{ background: '#FAFAFA', border: '1px solid #E4E4E7' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(201,168,76,0.4)'
                  el.style.background = '#FFFFFF'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = '#E4E4E7'
                  el.style.background = '#FAFAFA'
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#C9A84C' }}>
                  <span className="font-display font-black text-sm" style={{ color: '#0a0a0a' }}>{stream.letter}</span>
                </div>
                <h3 className="font-display font-semibold mb-1 text-[13px]" style={{ color: '#18181B' }}>{stream.label}</h3>
                <p className="text-xs leading-relaxed font-display" style={{ color: '#71717A' }}>{stream.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6 font-display" style={{ color: '#D4D4D8' }}>
            PAIDS · SEEDS · DARES · POSSESS · Five Books of Moses
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#FAFAFA' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#E4E4E7 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <div className="max-w-xl mx-auto text-center relative">
          <div className="rounded-2xl p-12" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
            <p className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>For children's children</p>
            <h2 className="text-[32px] font-display font-black leading-tight mb-3" style={{ color: '#18181B' }}>
              This is your system.
            </h2>
            <p className="font-display text-sm mb-8 leading-relaxed" style={{ color: '#71717A' }}>
              Built on the exact frameworks behind R600,000+ in annual income.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }}
            >
              Enter the System
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid #E4E4E7', background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <span className="font-display font-black text-[10px]" style={{ color: '#0a0a0a' }}>N</span>
            </div>
            <span className="font-display font-semibold text-sm" style={{ color: '#A1A1AA' }}>NOCHILL</span>
          </div>
          <p className="text-xs font-display" style={{ color: '#D4D4D8' }}>© 2026 NOCHILL PTY LTD (2016/507839/07)</p>
        </div>
      </footer>
    </div>
  )
}
