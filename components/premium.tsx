'use client'

/**
 * The Rate Card Pro design system, ported.
 *
 * chkplt.com/rate-card and this system are one product and should look like it. These are
 * the rate card's own values — the aurora ground, the 22px dot grid, frosted panels on
 * white/70 with a violet-cast shadow, the gradient accent, the obsidian summary card.
 *
 * Source of truth: digital-empire-builder/src/components/tools/premium.tsx.
 * If the rate card changes, change it here too — or the two drift apart again.
 */

import { cn } from '@/lib/utils'

export const ACCENT = {
  violet: '#8B5CF6',
  violetDeep: '#7C3AED',
  violetSoft: '#C4B5FD',
  fuchsia: '#EC4899',
  blue: '#3B82F6',
  ink: '#1A1523',
} as const

export const ACCENT_GRADIENT = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 55%, #3B82F6 100%)'

/** The aurora ground. Three blooms over a violet-to-blue wash. */
export const AURORA_BG =
  'radial-gradient(1200px 700px at 12% -8%, rgba(139,92,246,0.20), transparent 55%),' +
  'radial-gradient(1000px 650px at 100% 0%, rgba(236,72,153,0.18), transparent 55%),' +
  'radial-gradient(1100px 800px at 60% 108%, rgba(59,130,246,0.16), transparent 55%),' +
  'linear-gradient(180deg, #F7F5FF 0%, #FBF7FE 45%, #F5F7FF 100%)'

/** Faint dot grid — subtle texture. Violet-tinted on light, white on dark. */
export function DotGrid({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.08)'} 1px, transparent 1px)`,
        backgroundSize: '22px 22px',
      }}
    />
  )
}

/** One soft aurora bloom, for hero corners. */
export function Glow({ className, size = 620, opacity = 0.5 }:
  { className?: string; size?: number; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}
      style={{
        width: size, height: size, opacity,
        background:
          'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(236,72,153,0.35) 40%, rgba(59,130,246,0.15) 65%, transparent 78%)',
      }}
    />
  )
}

/** Small uppercase label — the eyebrow tag. */
export function Eyebrow({ children, className, tone = 'accent' }:
  { children: React.ReactNode; className?: string; tone?: 'accent' | 'muted' }) {
  return (
    <p className={cn(
      'text-[11px] font-bold uppercase leading-none tracking-[0.2em]',
      tone === 'accent' ? 'text-[#7C3AED]' : 'text-neutral-500',
      className,
    )}>{children}</p>
  )
}

/** Outlined / gradient / dark pill. */
export function Pill({ children, className, tone = 'outline' }:
  { children: React.ReactNode; className?: string; tone?: 'outline' | 'gradient' | 'dark' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]',
        tone === 'outline' && 'border border-[#8B5CF6]/25 bg-white/50 text-[#6D28D9] backdrop-blur',
        tone === 'gradient' && 'text-white',
        tone === 'dark' && 'bg-[#1A1523] text-white',
        className,
      )}
      style={tone === 'gradient' ? { backgroundImage: ACCENT_GRADIENT } : undefined}
    >{children}</span>
  )
}

/** Frosted-glass card. The whole UI is these on the aurora ground. */
export function Panel({ children, className, raised = false, id }:
  { children: React.ReactNode; className?: string; raised?: boolean; id?: string }) {
  return (
    <div id={id} className={cn(
      'rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl',
      raised
        ? 'shadow-[0_20px_60px_-24px_rgba(76,29,149,0.35)]'
        : 'shadow-[0_4px_20px_-8px_rgba(76,29,149,0.18)]',
      className,
    )}>{children}</div>
  )
}

/** Numbered section head — the "1 Where do you post?" pattern. */
export function PanelHeader({ title, step, hint }:
  { title: string; step?: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3.5 border-b border-white/50 px-5 py-4 sm:px-6">
      {step && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1523] font-display text-[13px] font-extrabold text-[#8B5CF6]">
          {step}
        </span>
      )}
      <div>
        <h2 className="font-display text-[15px] font-bold tracking-tight text-[#1A1523] sm:text-base">{title}</h2>
        {hint && <p className="mt-1 text-[13px] leading-snug text-neutral-500">{hint}</p>}
      </div>
    </div>
  )
}

/** The page hero — eyebrow, pill, display headline with an accent word, rule. */
export function PageHero({ eyebrow, pill, title, accent, blurb }: {
  eyebrow: string; pill?: string; title: string; accent?: string; blurb?: string
}) {
  const [before, after] = accent && title.includes(accent)
    ? [title.slice(0, title.indexOf(accent)), title.slice(title.indexOf(accent) + accent.length)]
    : [title, '']
  return (
    <header className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        {pill && <Pill className="whitespace-nowrap">{pill}</Pill>}
      </div>
      <h1 className="mt-6 font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-[#1A1523] sm:text-[52px]">
        {before}{accent && <span className="text-[#8B5CF6]">{accent}</span>}{after}
      </h1>
      {blurb && (
        <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.6] text-neutral-600 sm:text-[17px]">{blurb}</p>
      )}
      <div className="mt-6 h-[3px] w-16 rounded-full bg-[#8B5CF6]" />
    </header>
  )
}

/** The obsidian summary card — the dark rail on the rate card. */
export function Obsidian({ children, className }:
  { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl p-5 text-white sm:p-6', className)}
      style={{
        background:
          'radial-gradient(600px 300px at 90% -10%, rgba(139,92,246,0.35), transparent 60%),' +
          'radial-gradient(500px 280px at 0% 110%, rgba(236,72,153,0.22), transparent 60%),' +
          'linear-gradient(160deg, #221B2E 0%, #1A1523 55%, #14101C 100%)',
      }}>
      <DotGrid dark />
      <div className="relative">{children}</div>
    </div>
  )
}

/** Gradient primary button. */
export function AccentButton({ children, className, ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-display text-[14px] font-bold text-white',
        'transition-transform active:scale-[.985] disabled:opacity-50',
        className,
      )}
      style={{ backgroundImage: ACCENT_GRADIENT }}
    >{children}</button>
  )
}
