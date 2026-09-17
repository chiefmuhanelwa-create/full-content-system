'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

/**
 * The feature tile, matching the NoChill System inspiration:
 * a dark square with a coloured radial glow, a caps eyebrow, the name below on white,
 * and a small pill carrying the one fact that makes the tool worth opening.
 *
 * The glow colour is not decoration — it encodes the pillar the tool serves, so the grid
 * reads as the content strategy rather than as a menu.
 */

export type Accent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'

/** Pillar -> accent. KEEP IT is the 30% pillar, so it takes the primary blue. */
export const PILLAR_ACCENT: Record<string, Accent> = {
  'KEEP IT': 'blue',
  'PRICE IT': 'emerald',
  'OWN IT': 'violet',
  'BUILD IT ANYWAY': 'amber',
  'PROVE IT': 'rose',
}

const GLOW: Record<Accent, string> = {
  blue:    'radial-gradient(120% 120% at 70% 10%, #2563EB 0%, #1D3A8A 38%, #0B1220 78%)',
  violet:  'radial-gradient(120% 120% at 70% 10%, #7C3AED 0%, #4C1D95 38%, #120B20 78%)',
  emerald: 'radial-gradient(120% 120% at 70% 10%, #059669 0%, #064E3B 38%, #07160F 78%)',
  amber:   'radial-gradient(120% 120% at 70% 10%, #D97706 0%, #7C2D12 38%, #1A0E06 78%)',
  rose:    'radial-gradient(120% 120% at 70% 10%, #E11D48 0%, #881337 38%, #1A0710 78%)',
  slate:   'radial-gradient(120% 120% at 70% 10%, #475569 0%, #1E293B 38%, #0B0F17 78%)',
}

export function FeatureTile({
  href, name, eyebrow, icon: Icon, accent = 'slate', fact, badge,
}: {
  href: string
  name: string
  eyebrow: string
  icon: LucideIcon
  accent?: Accent
  fact?: string
  badge?: string
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] p-4" style={{ background: GLOW[accent] }}>
        <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
          {eyebrow}
        </span>
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-900">
            {badge}
          </span>
        )}
        <Icon
          className="absolute bottom-3 right-3 h-9 w-9 text-white/80 transition group-hover:scale-110"
          strokeWidth={1.5}
        />
        <p className="absolute bottom-3 left-4 max-w-[75%] text-[19px] font-bold leading-[1.1] text-white">
          {name}
        </p>
      </div>
      <div className="p-3">
        {fact && <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{fact}</p>}
      </div>
    </Link>
  )
}
