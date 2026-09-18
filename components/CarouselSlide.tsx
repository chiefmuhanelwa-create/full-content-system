'use client'

/**
 * A rendered carousel slide — 1080×1350, the locked gold-and-charcoal product palette.
 *
 * 🔴 THIS FIXES D-50. The old generator set Inter, so every carousel shipped so far is in the
 * wrong typeface. Montserrat and Lato are already loaded in app/layout.tsx as
 * --font-heading and --font-body; this component uses those variables directly and never
 * touches `font-display`, which is Inter.
 *
 * Design rules are from the nochill-carousel skill:
 *   · Headlines  Montserrat 800, sentence case, letter-spacing -.026em
 *   · Body       Lato 400
 *   · Furniture  Montserrat 700, uppercase, letterspaced
 *   · Gradient wash rotated per slide — without rotation an eight-slide deck goes flat
 *   · Alternate dark and light, roughly every second or third
 *   · Accent colour sits ON the word, inline. Never a highlight block behind it
 *   · Dot texture throughout, ~42% opacity on a 34px grid
 *   · Cover carries a ghost anchor: transparent fill, 3px gold stroke at ~32%
 */

const PAPER = '#FAFAF7'
const CHARCOAL = '#1C1C1C'
const GOLD = '#D4A82F'
const CREAM = '#F1E7C3'
const GREY = '#6E6A61'

export const SLIDE_W = 1080
export const SLIDE_H = 1350

export type SlideData = {
  n: number
  headline: string
  body?: string
  kind?: 'cover' | 'quote' | 'stat' | 'list' | 'payoff'
  anchor?: string        // cover only — the ghost element behind the headline
  pill?: string          // cover only — topic pill
  rows?: { title: string; sub?: string }[]
  stat?: string
  cite?: string
  cta?: string
}

/** Wrap *accent* spans in gold, inline on the word. */
function accented(text: string, dark: boolean) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') && part.length > 2
      ? <span key={i} style={{ color: GOLD }}>{part.slice(1, -1)}</span>
      : <span key={i}>{part}</span>
  )
}

/** Three wash corners, cycled, so no two adjacent slides sit the same way. */
const WASH = [
  'circle at 100% 100%', 'circle at 100% 0%', 'circle at 0% 100%',
]

export function CarouselSlide({ s, total, dark }: { s: SlideData; total: number; dark: boolean }) {
  const fg = dark ? PAPER : CHARCOAL
  const bg = dark ? CHARCOAL : PAPER
  const sub = dark ? 'rgba(250,250,247,0.62)' : GREY
  const wash = WASH[(s.n - 1) % WASH.length]
  const isCover = s.kind === 'cover' || s.n === 1
  const isLast = s.n === total

  const head = 'var(--font-heading), Montserrat, sans-serif'
  const body = 'var(--font-body), Lato, sans-serif'

  return (
    <div
      style={{
        width: SLIDE_W, height: SLIDE_H, background: bg, color: fg,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}
    >
      {/* gradient wash — the signature */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(${wash}, ${GOLD}2E 0%, ${CREAM}1A 34%, transparent 62%)`,
      }} />

      {/* dot texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.42,
        backgroundImage: `radial-gradient(${dark ? 'rgba(250,250,247,0.10)' : 'rgba(28,28,28,0.10)'} 1.5px, transparent 1.5px)`,
        backgroundSize: '34px 34px',
      }} />

      {/* ghost anchor — cover only */}
      {isCover && s.anchor && (
        <div style={{
          position: 'absolute', right: -40, top: 150,
          fontFamily: head, fontWeight: 800, fontSize: 420, lineHeight: 0.8,
          color: 'transparent', WebkitTextStroke: `3px ${GOLD}52`,
          letterSpacing: '-.04em', pointerEvents: 'none',
        }}>{s.anchor}</div>
      )}

      {/* furniture */}
      <div style={{ position: 'absolute', top: 64, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 21, letterSpacing: '.22em', textTransform: 'uppercase', color: sub }}>
          Contentpreneur
        </span>
        <span style={{
          fontFamily: head, fontWeight: 700, fontSize: 19, letterSpacing: '.14em',
          padding: '9px 20px', borderRadius: 999,
          border: `1.5px solid ${dark ? 'rgba(250,250,247,0.26)' : 'rgba(28,28,28,0.18)'}`, color: sub,
        }}>
          {String(s.n).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
      </div>

      {/* content, vertically centred, generous margins */}
      <div style={{
        position: 'absolute', inset: '180px 72px 170px 72px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {isCover && s.pill && (
          <span style={{
            alignSelf: 'flex-start', fontFamily: head, fontWeight: 700, fontSize: 20,
            letterSpacing: '.18em', textTransform: 'uppercase',
            padding: '11px 24px', borderRadius: 999, background: GOLD, color: CHARCOAL, marginBottom: 40,
          }}>{s.pill}</span>
        )}

        {s.kind === 'stat' && s.stat && (
          <div style={{ fontFamily: head, fontWeight: 800, fontSize: 200, lineHeight: 1, color: GOLD, letterSpacing: '-.04em', marginBottom: 26 }}>
            {s.stat}
          </div>
        )}

        <h2 style={{
          fontFamily: head, fontWeight: 800,
          fontSize: isCover ? 104 : s.kind === 'quote' ? 66 : 74,
          lineHeight: 1.06, letterSpacing: '-.026em', margin: 0,
        }}>
          {accented(s.headline, dark)}
        </h2>

        {s.body && (
          <p style={{ fontFamily: body, fontWeight: 400, fontSize: 34, lineHeight: 1.45, color: sub, marginTop: 34, maxWidth: 840 }}>
            {accented(s.body, dark)}
          </p>
        )}

        {!!s.rows?.length && (
          <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 30 }}>
            {s.rows.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
                <span style={{ fontFamily: head, fontWeight: 800, fontSize: 40, color: GOLD, minWidth: 54 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p style={{ fontFamily: head, fontWeight: 700, fontSize: 38, margin: 0, lineHeight: 1.2 }}>{r.title}</p>
                  {r.sub && <p style={{ fontFamily: body, fontSize: 29, color: sub, margin: '7px 0 0', lineHeight: 1.4 }}>{r.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {isCover && <div style={{ height: 4, width: 132, background: GOLD, marginTop: 46 }} />}

        {s.cta && (
          <p style={{ fontFamily: head, fontWeight: 800, fontSize: 46, marginTop: 42, lineHeight: 1.2 }}>
            {accented(s.cta, dark)}
          </p>
        )}
        {s.cite && (
          <p style={{ fontFamily: body, fontSize: 24, color: sub, marginTop: 20 }}>{s.cite}</p>
        )}
      </div>

      {/* bottom furniture */}
      <div style={{ position: 'absolute', bottom: 62, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 21, letterSpacing: '.14em', color: sub }}>
          @nochill_god
        </span>
        <span style={{
          fontFamily: head, fontWeight: 700, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase',
          padding: '12px 26px', borderRadius: 999,
          background: isLast ? GOLD : 'transparent',
          color: isLast ? CHARCOAL : sub,
          border: isLast ? 'none' : `1.5px solid ${dark ? 'rgba(250,250,247,0.26)' : 'rgba(28,28,28,0.18)'}`,
        }}>
          {isLast ? 'Save this' : 'Swipe →'}
        </span>
      </div>
    </div>
  )
}

/** Dark on 1, then roughly every third — eight light slides in a row disappear in a feed. */
export const isDark = (n: number) => n === 1 || n % 3 === 0
