import Link from 'next/link'

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
          <Link
            href="/auth/signin"
            className="px-5 py-2 rounded-lg bg-[#C9A646] text-[#0A0A0A] font-heading font-bold text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-colors"
          >
            Enter System
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Gold glow orb */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[700px] h-[700px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,166,70,0.12) 0%, rgba(230,200,113,0.05) 40%, transparent 65%)',
          }}
        />
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#F4EFE3] border border-[#E8E1D0]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A646] animate-pulse" />
            <span className="text-[#8C6F1F] font-heading font-bold text-xs tracking-[0.15em] uppercase">Ndivhuwo Muhanelwa · NoChill PTY LTD</span>
          </div>
          <h1 className="font-heading font-black text-6xl md:text-7xl leading-none tracking-tight mb-8">
            The Content<br />
            <span className="text-[#C9A646]">Intelligence</span><br />
            System.
          </h1>
          <p className="text-[#5C5448] text-xl leading-relaxed max-w-2xl mb-12">
            Every tool you need to create, plan, pitch, and scale — built around the NoChill frameworks. This is not a generic AI tool. This is your system.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C9A646] text-[#0A0A0A] font-heading font-black text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-all hover:shadow-[0_4px_24px_rgba(201,166,70,0.35)]"
          >
            Enter the System →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 border-y border-[#E8E1D0] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: 'R600K+', label: 'Annual Income' },
            { number: '50+', label: 'Brand Deals Closed' },
            { number: '100K+', label: 'Email Subscribers' },
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
        <div className="mb-12">
          <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-3">What's inside</p>
          <h2 className="font-heading font-black text-4xl text-[#0A0A0A]">25 tools. One system.</h2>
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
            <div key={tool.title} className="bg-white border border-[#E8E1D0] rounded-xl p-6 group hover:border-[#C9A646]/40 hover:shadow-[0_4px_20px_rgba(201,166,70,0.1)] transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#F4EFE3] border border-[#E8E1D0] text-[#8C6F1F] font-heading font-bold text-[10px] tracking-widest uppercase">{tool.tag}</span>
              </div>
              <h3 className="font-heading font-bold text-[#0A0A0A] text-base mb-2 group-hover:text-[#8C6F1F] transition-colors">
                {tool.title}
              </h3>
              <p className="text-[#8A8071] text-sm leading-relaxed">{tool.desc}</p>
            </div>
          ))}
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
      <section className="py-24 px-6 bg-[#FAF7F0]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white border border-[#E8E1D0] rounded-2xl p-12 shadow-[0_4px_40px_rgba(201,166,70,0.1)]">
            <p className="text-[#C9A646] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4">For children's children</p>
            <h2 className="font-heading font-black text-4xl text-[#0A0A0A] mb-4">
              This is your system.<br />Enter it.
            </h2>
            <p className="text-[#8A8071] text-sm mb-8">Built on the exact frameworks behind R600,000+ in annual income.</p>
            <Link
              href="/auth/signin"
              className="inline-block px-10 py-4 rounded-xl bg-[#C9A646] text-[#0A0A0A] font-heading font-black text-sm tracking-wide hover:bg-[#8C6F1F] hover:text-white transition-all hover:shadow-[0_4px_24px_rgba(201,166,70,0.35)]"
            >
              Enter the System →
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
