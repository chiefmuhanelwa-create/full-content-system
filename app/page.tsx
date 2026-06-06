import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#F8F8F8] overflow-x-hidden">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E1E1E] bg-[#111111]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A82F] flex items-center justify-center">
              <span className="text-[#111111] font-black text-sm">N</span>
            </div>
            <span className="font-heading font-black text-white tracking-widest text-sm uppercase">NOCHILL</span>
          </div>
          <Link
            href="/auth/signin"
            className="px-5 py-2 rounded-lg bg-[#D4A82F] text-[#111111] font-heading font-bold text-sm tracking-wide hover:bg-[#D9BC45] transition-colors"
          >
            Enter System
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <p className="text-[#D4A82F] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-6">
            Ndivhuwo Muhanelwa · NoChill PTY LTD
          </p>
          <h1 className="font-heading font-black text-6xl md:text-7xl leading-none tracking-tight mb-8">
            The Content<br />
            <span className="text-[#D4A82F]">Intelligence</span><br />
            System.
          </h1>
          <p className="text-[#888] text-xl leading-relaxed max-w-2xl mb-12">
            Every tool you need to create, plan, pitch, and scale — built around the NoChill frameworks. This is not a generic AI tool. This is your system.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="px-8 py-4 rounded-xl bg-[#D4A82F] text-[#111111] font-heading font-black text-sm tracking-wide hover:bg-[#D9BC45] transition-all hover:scale-105 hover:shadow-[0_4px_24px_rgba(212,168,47,0.3)]"
            >
              Enter the System →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1E1E1E]">
          {[
            { number: 'R600K+', label: 'Annual Income' },
            { number: '50+', label: 'Brand Deals Closed' },
            { number: '100K+', label: 'Email Subscribers' },
            { number: '9', label: 'Industry Awards' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111111] px-8 py-10 text-center">
              <div className="font-heading font-black text-4xl text-[#D4A82F] mb-2">{stat.number}</div>
              <div className="text-[#555] text-sm font-heading tracking-wide uppercase text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[#D4A82F] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-3">What's inside</p>
          <h2 className="font-heading font-black text-4xl">25 tools. One system.</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Hook Generator', desc: 'R×A×C×U^B Formula — fear, curiosity, contrast, data hooks', tag: 'CREATE' },
            { title: 'Script Writer', desc: '7-Act structure + 10-Step Sales Framework for any duration', tag: 'CREATE' },
            { title: 'Storytelling Studio', desc: '5 Story Types + 7-Stage Arc mapped to emotional triggers', tag: 'CREATE' },
            { title: 'Fear Analyzer', desc: '10 Shadow Fears profiled — hooks, angles, objection handlers', tag: 'AUDIENCE' },
            { title: 'Pitch Builder', desc: '5 Pillars pitch + Ethos-Pathos-Logos for DM, email, VSL', tag: 'REVENUE' },
            { title: 'Batch Planner', desc: '22-day content plan built around your launch goals', tag: 'PLAN' },
            { title: 'Brand Voice', desc: 'Analyse and score content against your documented voice', tag: 'AUDIENCE' },
            { title: 'Competitor Intel', desc: 'Gap analysis, positioning angles, content they are missing', tag: 'AUDIENCE' },
            { title: 'Platform Adapter', desc: 'One script → LinkedIn, TikTok, X, Instagram native formats', tag: 'CREATE' },
            { title: 'Story Extractor', desc: 'Raw notes → structured proof story with product links', tag: 'CREATE' },
            { title: 'CTA Optimizer', desc: '5 CTA variants with psychological trigger breakdown', tag: 'REVENUE' },
            { title: 'Analytics Insights', desc: 'Paste platform metrics → AI diagnosis + next-30-days plan', tag: 'PLAN' },
          ].map((tool) => (
            <div key={tool.title} className="nc-card p-6 group cursor-default">
              <div className="flex items-start justify-between mb-3">
                <span className="nc-badge">{tool.tag}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-2 group-hover:text-[#D4A82F] transition-colors">
                {tool.title}
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAIDS section */}
      <section className="py-20 px-6 border-t border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { letter: 'P', label: 'Products', desc: 'Digital products built around your frameworks' },
              { letter: 'A', label: 'Affiliates', desc: 'Partner commissions tracked and attributed' },
              { letter: 'I', label: 'Information', desc: 'Courses, guides, workshops' },
              { letter: 'D', label: 'Deals', desc: 'Brand partnerships managed end-to-end' },
              { letter: 'S', label: 'Services', desc: 'Consulting, coaching, speaking' },
            ].map((stream) => (
              <div key={stream.letter} className="nc-card p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-[#D4A82F] flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-black text-[#111111] text-lg">{stream.letter}</span>
                </div>
                <h3 className="font-heading font-bold text-white mb-1">{stream.label}</h3>
                <p className="text-[#555] text-xs leading-relaxed">{stream.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#444] text-sm mt-6 font-heading">
            PAIDS — the 5 income streams behind the NoChill revenue model
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="nc-card p-12">
            <p className="text-[#D4A82F] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4">For children's children</p>
            <h2 className="font-heading font-black text-4xl text-white mb-4">
              This is your system.<br />Enter it.
            </h2>
            <p className="text-[#555] mb-8">Built on the exact frameworks behind R600,000+ in annual income.</p>
            <Link
              href="/auth/signin"
              className="inline-block px-10 py-4 rounded-xl bg-[#D4A82F] text-[#111111] font-heading font-black text-sm tracking-wide hover:bg-[#D9BC45] transition-all hover:scale-105 hover:shadow-[0_4px_24px_rgba(212,168,47,0.3)]"
            >
              Enter the System →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E1E] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#D4A82F] flex items-center justify-center">
              <span className="text-[#111111] font-black text-xs">N</span>
            </div>
            <span className="font-heading font-black text-[#555] tracking-widest text-xs uppercase">NOCHILL</span>
          </div>
          <p className="text-[#333] text-xs">© 2026 NOCHILL PTY LTD (2016/507839/07)</p>
        </div>
      </footer>
    </div>
  )
}
