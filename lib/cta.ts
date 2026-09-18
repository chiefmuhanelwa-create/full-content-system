/**
 * Which CTA keywords may actually ship.
 *
 * Article XI: no content publishes with a CTA that has no destination. "Has a destination"
 * is not the same as "is automated" — TAX is fulfilled by hand and is the best-converting
 * keyword on the account at 8.68%. Filtering on `status === 'live'` silently refused it.
 *
 * One helper so that rule lives in one place instead of being retyped at four call sites.
 */

export type CtaKeyword = {
  k: string
  status: 'live' | 'manual' | 'orphaned'
  converts?: string | null
  pillar?: string
  destination?: string | null
  note?: string
}

/** Everything with somewhere to land — automated or by hand. */
export function shippableCtas(gov: any): CtaKeyword[] {
  const all: CtaKeyword[] = gov?.cta_library?.keywords ?? []
  const ok: string[] = gov?.cta_library?.shippable ?? ['live', 'manual']
  return all.filter((k) => ok.includes(k.status))
}

/** Best keyword for a pillar: its own first, then any shippable one, else null. */
export function ctaForPillar(gov: any, pillar?: string): CtaKeyword | null {
  const live = shippableCtas(gov)
  return live.find((k) => k.pillar === pillar) ?? live[0] ?? null
}
