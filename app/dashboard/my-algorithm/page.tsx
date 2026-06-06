'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, FileText, BookOpen, Brain, Mic, Target, TrendingUp,
  ChevronRight, Play, ArrowRight, Star, Users, ShoppingBag,
  BarChart2, Layers, Heart, Repeat, DollarSign, Video, Tv2,
  Lightbulb, Globe, Lock, BookMarked, Flame
} from 'lucide-react'

const CREATOR = {
  name: 'Ndivhuwo Muhanelwa',
  alias: 'NoChill',
  proof: 'From university bathroom floors → R600K+ annual income, 50+ brand deals, 9 awards',
  signature: '"You understand? Because you understand." "For children\'s children."',
}

const AUDIENCES = [
  {
    id: 'called_expert',
    name: 'The Called Expert',
    tagline: 'You know your field. You just don\'t know how to turn it into content that pays.',
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-800',
    demographics: 'Age 28-42 · Professionals, coaches, consultants',
    painPoints: [
      'Expert but invisible online',
      'Can\'t be "cringe" — I have a reputation',
      'Don\'t know where to start with content',
    ],
    deepGoal: 'Recognized authority that attracts high-value clients',
    topFear: 'Being judged by peers while trying something new',
    bestContent: 'LinkedIn thought leadership · Educational deep-dives · Framework teaching',
    products: ['01', '02', 'paids_course_starter'],
    icon: '🎓',
  },
  {
    id: 'content_creator_inspirer',
    name: 'The Content Creator Inspirer',
    tagline: 'You\'re creating. You\'re just not getting paid for it.',
    color: 'from-purple-500 to-indigo-600',
    badge: 'bg-purple-100 text-purple-800',
    demographics: 'Age 23-28 core · SA primary · 500-50K following',
    painPoints: [
      'Posting but earning nothing',
      'Brands ghost or lowball me',
      'Algorithm keeps changing',
    ],
    deepGoal: 'Income that works while they sleep — a SYSTEM, not more effort',
    topFear: 'The window closing on the African creator economy',
    bestContent: 'Instagram Reels · TikTok · Transformation stories · Brand deal scripts',
    products: ['03', '04', '05', '11', '13', 'tax'],
    icon: '🎬',
  },
]

const FEELER_TRIGGERS = [
  {
    name: 'Fear of Missing the Window',
    hook: 'African creator economy to $17.84B by 2032 — the window is open NOW',
    use: 'Growth, monetisation, urgency products',
    color: 'border-red-400 bg-red-50',
  },
  {
    name: 'Shame of Stagnation',
    hook: "You've been saying you're a creator for 2 years. Your family is starting to wonder.",
    use: 'Motivation, transformation, action-triggering products',
    color: 'border-amber-400 bg-amber-50',
  },
  {
    name: 'Hunger for Proof It\'s Possible for Me',
    hook: "Show me someone from where I'm from who did it. Not an American. Me.",
    use: 'Credibility, case studies, origin story content',
    color: 'border-green-400 bg-green-50',
  },
]

const STORIES = [
  { key: 'bathroom_floors', title: 'Bathroom Floors to Boardrooms', time: '5-8s', arc: 'Vulnerability → Triumph', products: ['01', '02', 'paids_course_starter'], icon: '🏠' },
  { key: 'r750_to_r100k', title: 'R750 to R100K Brand Evolution', time: '10-12s', arc: 'Mistake → Mastery', products: ['03', '04', '05', 'paids_course_pro'], icon: '💰' },
  { key: 'huawei_r6000_investment', title: 'R6,000 Huawei Investment', time: '10-15s', arc: 'Risk → Reward', products: ['01', 'paids_course_starter'], icon: '📱' },
  { key: 'instagram_780k_loss', title: '780K Followers Lost Overnight', time: '12-15s', arc: 'Devastation → Liberation', products: ['02', 'paids_course_pro'], icon: '📉' },
  { key: 'sars_r285k_debt', title: 'SARS R285K Tax Debt', time: '15-18s', arc: 'Ignorance → Wisdom', products: ['tax'], icon: '🧾' },
  { key: 'family_shame_dropout', title: 'University Dropout Family Shame', time: '12-15s', arc: 'Shame → Pride', products: ['01', '02'], icon: '🎓' },
  { key: 'first_netflix_deal', title: 'First Netflix R100K Deal', time: '15-18s', arc: 'Doubt → Confidence', products: ['03', '05', '13', 'paids_course_pro'], icon: '🎬' },
  { key: 'content_burnout', title: 'Daily Posting Nearly Killed Me', time: '18-20s', arc: 'Exhaustion → Liberation', products: ['01', '02', 'paids_course_starter'], icon: '🔥' },
  { key: 'samsung_partnership', title: 'Samsung Long-term Partnership', time: '12-15s', arc: 'Transactional → Partnership', products: ['04', 'paids_course_pro'], icon: '🤝' },
  { key: 'ubuntu_principle', title: 'Ubuntu: I Am Because We Are', time: '15-18s', arc: 'Scarcity → Abundance', products: ['02', 'paids_course_pro'], icon: '🌍' },
]

const PRODUCTS = [
  { id: '01', title: 'Stop Posting Random Content', price: '—', status: 'live', type: '📗 Guide' },
  { id: '02', title: 'Stop Being Broke With a Big Following', price: '—', status: 'live', type: '📗 Guide' },
  { id: '03', title: 'Stop Freezing When a Brand Messages You', price: 'R99', status: 'live', type: '📄 Scripts' },
  { id: '04', title: 'Stop Doing One-Off Deals', price: 'R99', status: 'planned', type: '📄 Scripts' },
  { id: '05', title: 'Stop Saying Yes to Low Offers', price: '—', status: 'live', type: '📄 Scripts' },
  { id: '11', title: 'Stop Signing Contracts That Cost You', price: 'R149', status: 'planned', type: '📗 Guide' },
  { id: '13', title: 'Stop Losing Deals Because You\'re Not Ready', price: 'R197', status: 'planned', type: '📦 Kit' },
  { id: 'tax', title: 'Stop Being Scared of SARS', price: '—', status: 'live', type: '📗 Guide' },
  { id: 'paids_course_starter', title: 'PAIDS Starter Course', price: 'R997', status: 'planned', type: '🎓 Course' },
  { id: 'paids_course_pro', title: 'PAIDS Pro Course', price: 'R1,997', status: 'planned', type: '🎓 Course' },
]

const WORKFLOWS = [
  {
    title: 'Create a Hook',
    description: 'R×A×C×U^B formula with your audience data pre-loaded',
    href: '/dashboard/hooks',
    icon: Zap,
    color: 'bg-yellow-500',
    steps: ['Pick topic + platform', 'AI generates 5 hooks', 'Save to Hook Bank', 'Use in Script Writer'],
  },
  {
    title: 'Write a Script',
    description: '7-Act Retention or 10-Step Sales — with your stories & products',
    href: '/dashboard/scripts',
    icon: FileText,
    color: 'bg-blue-500',
    steps: ['Pick content idea or product', 'AI writes full script', 'Edit & refine', 'Send to Teleprompter'],
  },
  {
    title: 'Extract a Story',
    description: '4-Criteria Test — turn your experiences into proof points',
    href: '/dashboard/stories',
    icon: BookOpen,
    color: 'bg-green-500',
    steps: ['Answer story questions', 'AI extracts + structures', 'Save to Story Bank', 'Use in scripts'],
  },
  {
    title: 'Analyze Fears',
    description: 'Identify audience shadow fears → generate targeted hooks',
    href: '/dashboard/fears',
    icon: Brain,
    color: 'bg-red-500',
    steps: ['Describe target audience', 'AI finds top 3 fears', 'Get fear-targeted hooks', 'Build content strategy'],
  },
  {
    title: 'Record to Camera',
    description: 'Teleprompter with auto-scroll, voice markers, mirror mode',
    href: '/dashboard/teleprompter',
    icon: Video,
    color: 'bg-purple-500',
    steps: ['Load script from Writer', 'Set speed & markers', 'Record your content', 'Save to library'],
  },
  {
    title: 'Build Your Story',
    description: 'Genesis Framework + 7-Stage Story Arc',
    href: '/dashboard/storytelling',
    icon: Tv2,
    color: 'bg-indigo-500',
    steps: ['Input raw story', 'Choose framework', 'AI structures narrative', 'Get hooks + application tips'],
  },
]

const PLATFORM_QUICK = [
  { platform: 'Instagram Reels', format: '15-60s', hook: '1st second', stories: ['bathroom_floors', 'content_burnout', 'r750_to_r100k'], icon: '📸' },
  { platform: 'TikTok', format: '15-45s', hook: '2nd second', stories: ['sars_r285k_debt', 'instagram_780k_loss', 'family_shame_dropout'], icon: '🎵' },
  { platform: 'YouTube Shorts', format: '30-60s', hook: '3rd second', stories: ['huawei_r6000_investment', 'samsung_partnership', 'first_netflix_deal'], icon: '▶️' },
  { platform: 'LinkedIn', format: '300-1,500 chars', hook: 'First line', stories: ['samsung_partnership', 'first_netflix_deal', 'sars_r285k_debt'], icon: '💼' },
]

const CONTENT_FORMULA = [
  { label: 'Educate', percent: 35, desc: 'Teach the system, framework, how-to', color: 'bg-blue-500' },
  { label: 'Entertain', percent: 30, desc: 'Story, personality, relatability', color: 'bg-yellow-500' },
  { label: 'Encourage', percent: 20, desc: 'Proof it\'s possible, Ubuntu moments', color: 'bg-green-500' },
  { label: 'Earn', percent: 15, desc: 'Product mentions, CTAs, offers', color: 'bg-purple-500' },
]

export default function MyAlgorithmPage() {
  const router = useRouter()
  const [activeStory, setActiveStory] = useState<string | null>(null)

  const handleWorkflow = (href: string) => router.push(href)

  const handleScriptForStory = (storyKey: string) => {
    localStorage.setItem('algorithmStoryPreload', storyKey)
    router.push('/dashboard/scripts')
  }

  const handleHookForAudience = (audienceId: string) => {
    localStorage.setItem('algorithmAudiencePreload', audienceId)
    router.push('/dashboard/hooks')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Algorithm Active</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                My Algorithm<span className="text-amber-400">.</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl">
                Your content creation intelligence — audiences, stories, products, and frameworks all connected.
              </p>
            </div>
            <div className="text-right hidden lg:block">
              <p className="text-xs text-gray-500 mb-1">{CREATOR.alias} · NOCHILL PTY LTD</p>
              <p className="text-sm text-amber-400 font-medium max-w-xs">{CREATOR.proof}</p>
            </div>
          </div>

          {/* Creator DNA Bar */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: '10 Proof Stories', icon: BookMarked },
              { label: '10 Official Products', icon: ShoppingBag },
              { label: '2 Target Audiences', icon: Users },
              { label: 'R×A×C×U^B Hook Science', icon: Zap },
              { label: '7 Original Frameworks', icon: Layers },
              { label: '$17.84B Market Opportunity', icon: TrendingUp },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">
                <Icon className="w-3 h-3 text-amber-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">

        {/* Quick Workflows */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Play className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Quick Start Workflows</h2>
            <span className="text-xs text-gray-500">— click to go straight in</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOWS.map((wf) => {
              const Icon = wf.icon
              return (
                <button
                  key={wf.title}
                  onClick={() => handleWorkflow(wf.href)}
                  className="group text-left p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-amber-400/50 hover:bg-gray-800/80 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${wf.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{wf.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{wf.description}</p>
                  <div className="space-y-1">
                    {wf.steps.map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0 text-[10px]">{i + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-medium">
                    Open tool <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Target Audiences */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Your Two Audiences</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {AUDIENCES.map((audience) => (
              <div key={audience.id} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-2xl mb-2 block">{audience.icon}</span>
                    <h3 className={`text-lg font-black bg-gradient-to-r ${audience.color} bg-clip-text text-transparent`}>
                      {audience.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{audience.tagline}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3 font-mono">{audience.demographics}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Surface Pains</p>
                    <div className="flex flex-wrap gap-1.5">
                      {audience.painPoints.map((pain) => (
                        <span key={pain} className="px-2 py-1 bg-red-950/50 border border-red-900/50 rounded-lg text-xs text-red-300">{pain}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deep Goal</p>
                    <p className="text-sm text-green-400">→ {audience.deepGoal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Top Fear</p>
                    <p className="text-sm text-amber-400">⚡ {audience.topFear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best Content Format</p>
                    <p className="text-xs text-gray-300">{audience.bestContent}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleHookForAudience(audience.id)}
                  className="w-full mt-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-400/50 rounded-xl text-sm font-medium text-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Generate Hooks for {audience.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Three Feeler Triggers */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Three Feeler Triggers</h2>
            <span className="text-xs text-gray-500">— use at least one in every product hook</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {FEELER_TRIGGERS.map((trigger) => (
              <div key={trigger.name} className={`p-5 border-l-4 rounded-r-2xl ${trigger.color}`}>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{trigger.name}</h3>
                <p className="text-gray-700 text-sm italic mb-3">"{trigger.hook}"</p>
                <p className="text-xs text-gray-500">Use for: {trigger.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story → Product → Script Pipeline */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <ArrowRight className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Story → Product → Script Pipeline</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {STORIES.map((story) => (
              <div
                key={story.key}
                className={`p-4 bg-gray-900 border rounded-xl transition-all cursor-pointer ${activeStory === story.key ? 'border-amber-400 bg-amber-950/10' : 'border-gray-800 hover:border-gray-700'}`}
                onClick={() => setActiveStory(activeStory === story.key ? null : story.key)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{story.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-white">{story.title}</h3>
                      <p className="text-xs text-gray-500">{story.time} · {story.arc}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleScriptForStory(story.key) }}
                    className="flex-shrink-0 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
                  >
                    Write Script →
                  </button>
                </div>

                {activeStory === story.key && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Maps to products</p>
                    <div className="flex flex-wrap gap-2">
                      {story.products.map((productId) => {
                        const product = PRODUCTS.find((p) => p.id === productId)
                        return product ? (
                          <span key={productId} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300">
                            {product.type} {product.title.replace('Stop ', '')}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Products Overview */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">10 Official Products</h2>
            <span className="text-xs text-gray-500">— click to generate content for each</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  localStorage.setItem('algorithmProductPreload', product.id)
                  router.push('/dashboard/scripts')
                }}
                className="text-left p-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-amber-400/50 hover:bg-gray-800/80 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${product.status === 'live' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                    {product.status === 'live' ? 'LIVE' : 'SOON'}
                  </span>
                  {product.price && product.price !== '—' && (
                    <span className="text-xs text-amber-400 font-bold">{product.price}</span>
                  )}
                </div>
                <p className="text-xs text-gray-300 font-medium leading-tight group-hover:text-white transition-colors">
                  {product.title.replace('Stop ', 'Stop\n')}
                </p>
                <p className="text-[10px] text-gray-600 mt-1">{product.type}</p>
                <div className="mt-2 text-[10px] text-amber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FileText className="w-3 h-3" /> Write script
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Content Formula Engine */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Content Formula Engine</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 4E Balance */}
            <div className="lg:col-span-1 p-5 bg-gray-900 border border-gray-800 rounded-2xl">
              <h3 className="font-bold text-white mb-4">4E Content Balance</h3>
              <div className="space-y-3">
                {CONTENT_FORMULA.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                      <span className="text-xs text-gray-400">{item.percent}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hook Science Priority */}
            <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Hook Science Priority</h3>
              <div className="space-y-2">
                {[
                  { rank: 1, type: 'Curiosity Gap', views: '101M avg views', color: 'text-yellow-400' },
                  { rank: 2, type: 'Comparison', views: '58.6M avg views', color: 'text-orange-400' },
                  { rank: 3, type: 'FOMO', views: '51.2M avg views', color: 'text-red-400' },
                  { rank: 4, type: 'Pattern Interrupt', views: '33M+ avg views', color: 'text-pink-400' },
                  { rank: 5, type: 'Shock Factor / Relatability', views: 'Platform dependent', color: 'text-purple-400' },
                ].map((hook) => (
                  <div key={hook.rank} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold ${hook.color}`}>
                      {hook.rank}
                    </span>
                    <div>
                      <p className="text-sm text-gray-300 font-medium">{hook.type}</p>
                      <p className="text-xs text-gray-500">{hook.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SA-Specific Hooks */}
            <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Mzansi Hook Angles</h3>
              <div className="space-y-3">
                {[
                  { angle: 'Load Shedding', hook: '"I built this income stream during load shedding"' },
                  { angle: 'SARS', hook: '"SARS is watching your Instagram..."' },
                  { angle: 'Matric-to-Millions', hook: '"I never finished university. Here\'s what I built."' },
                  { angle: 'Ubuntu', hook: '"This strategy made R1M. I\'m giving it away."' },
                  { angle: 'Anti-American Advice', hook: '"Stop following American creator advice in Mzansi."' },
                ].map((item) => (
                  <div key={item.angle} className="border-l-2 border-amber-500/40 pl-3">
                    <p className="text-xs text-amber-400 font-bold uppercase">{item.angle}</p>
                    <p className="text-xs text-gray-400 italic">{item.hook}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Quick Reference */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Globe className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Platform Quick Reference</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_QUICK.map((p) => (
              <div key={p.platform} className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="text-xl mb-2">{p.icon}</div>
                <h3 className="font-bold text-sm text-white mb-1">{p.platform}</h3>
                <p className="text-xs text-gray-400 mb-1">Format: {p.format}</p>
                <p className="text-xs text-amber-400 mb-3">Hook window: {p.hook}</p>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Best Stories</p>
                  <div className="flex flex-col gap-1">
                    {p.stories.map((s) => {
                      const story = STORIES.find((st) => st.key === s)
                      return story ? (
                        <span key={s} className="text-[10px] text-gray-400">{story.icon} {story.title}</span>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Coil — Buyer Journey */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Repeat className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">The Coil — Full Buyer Journey</h2>
            <span className="text-xs text-gray-500">— every piece of content feeds this</span>
          </div>
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {[
                { label: 'Reel', sub: 'Cold content', color: 'bg-gray-700' },
                { label: 'Bio Link', sub: 'contentcreatorhub.online', color: 'bg-gray-700' },
                { label: 'Email Opt-in', sub: 'Lead magnet', color: 'bg-blue-900' },
                { label: '7-Day Nurture', sub: 'Email sequence', color: 'bg-blue-800' },
                { label: 'Tripwire', sub: 'The Influencer\'s Code R299', color: 'bg-green-900' },
                { label: 'Upsell', sub: 'SARS Guide', color: 'bg-green-800' },
                { label: 'Core Offer', sub: 'PAIDS Course R997', color: 'bg-amber-800' },
                { label: 'Upsell', sub: 'PAIDS Pro R1,997', color: 'bg-amber-700' },
                { label: 'Subscription', sub: 'Hub R497/mo', color: 'bg-orange-800' },
                { label: '1:1 Coaching', sub: 'R9,997', color: 'bg-red-900' },
                { label: 'Mastermind', sub: 'R25,000+', color: 'bg-red-800' },
              ].map((stage, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`${stage.color} rounded-xl px-3 py-2 text-center min-w-[100px]`}>
                    <p className="text-xs font-bold text-white">{stage.label}</p>
                    <p className="text-[10px] text-gray-300">{stage.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ethos Pathos Logos */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Master Pitch Formula</h2>
            <span className="text-xs text-gray-500">— use this structure for every sales piece</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                type: 'ETHOS', label: 'Credibility',
                text: "I went from sleeping in a university bathroom to R300,000+ a month partnering with Netflix, Samsung, Red Bull.",
                color: 'border-blue-400 bg-blue-950/30', badge: 'bg-blue-900 text-blue-300'
              },
              {
                type: 'PATHOS', label: 'Connection',
                text: "I know exactly what it feels like to have 500,000 followers and R0. I've been you.",
                color: 'border-purple-400 bg-purple-950/30', badge: 'bg-purple-900 text-purple-300'
              },
              {
                type: 'LOGOS', label: 'Logic',
                text: "96% of creators earn under $100K/year. The 4% who don't have one thing in common: a system.",
                color: 'border-green-400 bg-green-950/30', badge: 'bg-green-900 text-green-300'
              },
            ].map((item) => (
              <div key={item.type} className={`p-5 border rounded-2xl ${item.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.badge}`}>{item.type}</span>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">"{item.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Signature */}
        <div className="border-t border-gray-800 pt-8 pb-4 text-center">
          <p className="text-gray-600 text-sm italic">{CREATOR.signature}</p>
          <p className="text-gray-700 text-xs mt-1">NOCHILL PTY LTD · 2016/507839/07 · contentcreatorhub.online</p>
        </div>
      </div>
    </div>
  )
}
