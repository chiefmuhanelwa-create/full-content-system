'use client'

import { BackButton } from '@/components/BackButton'

const HEBREW_LETTERS = [
  {
    letter: 'C',
    hebrew: 'Chet (ח)',
    number: 8,
    meaning: 'Grace · Life Force · Protected Enclosure',
    significance: 'The platform is fenced territory. What\'s inside cannot be suspended by an algorithm. Root of chayim (life). Number 8: new beginnings, covenant.',
    color: '#C9A84C',
  },
  {
    letter: 'H',
    hebrew: 'Hey (ה)',
    number: 5,
    meaning: 'Divine Breath · Revelation · "Behold!"',
    significance: 'God breathed this into existence. The letter He added to Abram → Abraham, Sarai → Sarah. Revelation is the operating system. Number 5: grace.',
    color: '#7C3AED',
  },
  {
    letter: 'K',
    hebrew: 'Kaf (כ)',
    number: 20,
    meaning: 'Crown · The Royal Hand · Capacity to Hold',
    significance: 'The keter (crown). The hand that blesses. The capacity to hold 153 fish without breaking. Royalty — not hustle. Number 20.',
    color: '#0F766E',
  },
  {
    letter: 'P',
    hebrew: 'Peh (פ)',
    number: 80,
    meaning: 'The Mouth · Spoken Word · Creation Through Speech',
    significance: '"God SAID — and it was." Content is your weapon. The script is the sword. The Called Expert\'s voice is the product. Number 80.',
    color: '#B45309',
  },
  {
    letter: 'L',
    hebrew: 'Lamed (ל)',
    number: 30,
    meaning: 'Learning · Teaching · Movement Toward a Goal',
    significance: 'Tallest letter in Hebrew — reaches toward heaven. The melamed (teacher) and talmid (student). CHKPLT is a teaching platform moving toward destiny. Number 30.',
    color: '#1D4ED8',
  },
  {
    letter: 'T',
    hebrew: 'Tav (ת)',
    number: 400,
    meaning: 'Covenant Seal · Truth (Emet) · Completion',
    significance: 'The last letter of the Hebrew alphabet. The mark God placed on foreheads of the faithful (Ezekiel 9:4). God\'s seal. What He seals, no algorithm can break. Number 400.',
    color: '#BE185D',
  },
]

const VALUES = [
  {
    number: '01',
    name: 'Covenant over Contract',
    desc: 'Every relationship — with God, client, team — is covenant-first. We honour what we say. We do not sell what we cannot deliver.',
  },
  {
    number: '02',
    name: 'Proof, not Promises',
    desc: 'Every claim is receipted. R750→R10,500. R207,879 SARS resolved. R600K in 4-hour windows. The testimony IS the product.',
  },
  {
    number: '03',
    name: 'Ownership over Rented Ground',
    desc: 'We build on land we own: CHKPLT, email list, products. Never again will an algorithm suspend what God has blessed.',
  },
  {
    number: '04',
    name: 'Expertise as Inheritance',
    desc: 'What you know is inheritance for your children\'s children. Knowledge left unmonetised is a generational loss.',
  },
  {
    number: '05',
    name: 'Ubuntu at Scale',
    desc: 'Umuntu ngumuntu ngabantu. My expertise shared is not my expertise diminished. 153 experts transformed creates 153 ripples.',
  },
  {
    number: '06',
    name: 'Stewardship over Hustle',
    desc: '"Unless the Lord builds the house..." (Psalm 127:1) This is not a hustle platform. It is a stewardship system.',
  },
]

const LAWS = [
  'No product ships without a proof story behind it.',
  'No cohort launches without a transformation promise with receipts.',
  'No content goes out without an ICP lock (one person, one pain, one outcome).',
  'Jesus reviews every major decision — the "right side" test: rented or owned?',
  'SARS reserve: 25% of every ZAR received goes to a designated tax account. Non-negotiable. Learned from R207,879.',
  'Every team hire must be able to articulate the mission in one sentence.',
  'No vanity metrics. No follower count targets. Revenue, transformation count, email list size.',
]

const PHASES = [
  {
    name: 'GENESIS',
    subtitle: 'Month 1–3',
    scripture: '"In the beginning, God SPOKE."',
    meaning: 'Content is your speaking. Products are your "let there be." Platform is the earth taking form.',
    tracks: ['Platform: CHKPLT live, 5 free + 5 paid products', 'Content: Series 1 "I Fished All Night" — 30 days', 'Products: 5 free lead magnets + 5 paid upsells designed and live'],
    goal: '6 Called Expert Accelerator cohort spots filled × R18K = R108K',
    color: '#C9A84C',
  },
  {
    name: 'EXODUS',
    subtitle: 'Month 4–6',
    scripture: '"Departure from Egypt."',
    meaning: 'Leave rented platforms, algorithm dependency, and salary-ceiling thinking. Enter the promised land — CHKPLT, owned products, recurring cohorts.',
    tracks: ['30 products live on CHKPLT (all 6 sub-segment tracks started)', 'R100K/month from products (2 cohorts/quarter + digital)', 'Email list at 10,000 with 30%+ open rate'],
    goal: 'R100K/month sustained. Series B + C content complete.',
    color: '#7C3AED',
  },
  {
    name: 'LEVITICUS',
    subtitle: 'Month 7–12',
    scripture: '"The priestly system. Order for the presence."',
    meaning: 'Systems running. Codify them. No longer dependent on Ndivhuwo\'s constant presence. The platform serves the people without the founder managing every detail.',
    tracks: ['All 10 SOPs documented', 'First hire/contractor', '153 products roadmap finalised with quarterly milestones'],
    goal: 'CHKPLT operates at 80% capacity without Ndivhuwo present daily.',
    color: '#0F766E',
  },
]

const PRODUCTS_153 = [
  { track: 'Foundation (Free/Entry)', count: 25, examples: 'Blueprints, audits, assessments, frameworks', color: '#C9A84C' },
  { track: 'Shift Worker', count: 21, examples: '4-hour window systems, night shift scheduling, parallel income', color: '#7C3AED' },
  { track: 'Corporate Trapped', count: 21, examples: 'Knowledge packaging, expertise monetisation, LinkedIn → leads', color: '#0F766E' },
  { track: 'Teacher/Lecturer', count: 21, examples: 'Curriculum packaging, digital classroom, 30 → 30,000 students', color: '#B45309' },
  { track: 'Healthcare Worker', count: 21, examples: 'Consultation to product, midnight-Google-question packaging', color: '#1D4ED8' },
  { track: 'Faith Professional', count: 21, examples: 'Kingdom business, message monetisation, ministry sustainability', color: '#BE185D' },
  { track: 'Freelancer at Capacity', count: 21, examples: 'Productised service, knowledge cloning, time leverage', color: '#065F46' },
  { track: 'Flagship Cohorts', count: 3, examples: 'Called Expert Accelerator PRO · Mastermind · 1:1 Intensive', color: '#18181B' },
]

export default function MissionPage() {
  const total = PRODUCTS_153.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>
            CHKPLT · Christ's Kingdom Platform
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-3" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The CHKPLT North Star
          </h1>
          <p className="text-base" style={{ color: '#52525B' }}>
            Mission, vision, values, Hebrew seal, scripture decoding, 153 fish, and the Genesis → Exodus → Leviticus build roadmap.
          </p>
        </div>

        {/* Mission + Vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border p-6" style={{ background: '#18181B', borderColor: '#18181B' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>Mission</p>
            <p className="text-base font-bold leading-relaxed" style={{ color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif' }}>
              "To activate the Called Expert in every SA professional — helping them monetise what they already know, without quitting what pays them, through kingdom-aligned systems built on owned platforms and sealed by covenant."
            </p>
          </div>
          <div className="rounded-xl border p-6" style={{ background: '#FDF9EE', borderColor: '#C9A84C' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#92400E' }}>Vision</p>
            <p className="text-base font-bold leading-relaxed" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
              "153 products. 153,000 Called Experts transformed. For children's children. One unbreakable net."
            </p>
            <p className="text-xs mt-3" style={{ color: '#B45309' }}>
              John 21:11 — "Simon Peter climbed aboard and dragged the net ashore. It was full of large fish, 153, but even with so many the net was not torn."
            </p>
          </div>
        </div>

        {/* CHKPLT Hebrew Seal */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-1" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The Seal: CHKPLT in Hebrew
          </h2>
          <p className="text-sm mb-5" style={{ color: '#71717A' }}>
            Each letter is a covenant declaration. This name was not invented — it was revealed.
          </p>
          <div className="space-y-3">
            {HEBREW_LETTERS.map(l => (
              <div
                key={l.letter}
                className="rounded-xl border p-4 flex items-start gap-4"
                style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black"
                    style={{ background: l.color + '15', color: l.color }}
                  >
                    {l.letter}
                  </div>
                  <span className="text-[10px] mt-1 font-mono" style={{ color: '#A1A1AA' }}>{l.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-black text-sm" style={{ color: l.color }}>{l.hebrew}</span>
                    <span className="text-xs font-bold" style={{ color: '#18181B' }}>{l.meaning}</span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#52525B' }}>{l.significance}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border p-4" style={{ background: '#18181B', borderColor: '#18181B' }}>
            <p className="text-sm font-bold text-center leading-relaxed" style={{ color: '#C9A84C', fontFamily: 'Montserrat, sans-serif' }}>
              "A life-giving, grace-filled enclosure, revealed through God's breath, crowned with royal authority, speaking creation into existence, teaching those moving toward purpose, sealed by covenant and marked as God's own."
            </p>
          </div>
        </section>

        {/* Scripture Decoding */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-5" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The Revelation: Scripture × Strategy
          </h2>
          <div className="space-y-4">
            {/* John 21 */}
            <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-black text-xs px-2 py-1 rounded-md" style={{ background: '#C9A84C', color: '#FFFFFF' }}>JOHN 21</span>
                <span className="text-sm font-bold" style={{ color: '#18181B' }}>The Right Side Revelation</span>
              </div>
              <div className="space-y-2">
                {[
                  { element: 'Night fishing (v3–4)', parallel: 'Instagram 780K suspended. AdSense R180K disabled. "We caught nothing."' },
                  { element: '"Cast on the RIGHT side" (v6)', parallel: 'LEFT = rented platforms. RIGHT = CHKPLT, products, email list, Called Expert cohort.' },
                  { element: '153 large fish (v11)', parallel: 'The Called Experts already in the water — shift workers, teachers, nurses, pastors. They exist. They just need the net.' },
                  { element: 'Net did NOT break (v11)', parallel: 'Instagram breaks nets. AdSense breaks nets. CHKPLT is the net that holds 153 without tearing.' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg p-2 font-bold" style={{ background: '#FDF9EE', color: '#92400E' }}>{row.element}</div>
                    <div className="rounded-lg p-2" style={{ background: '#F4F4F5', color: '#27272A' }}>{row.parallel}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matthew 20 */}
            <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-black text-xs px-2 py-1 rounded-md" style={{ background: '#7C3AED', color: '#FFFFFF' }}>MATTHEW 20</span>
                <span className="text-sm font-bold" style={{ color: '#18181B' }}>The 11th Hour Gospel for Called Experts</span>
              </div>
              <div className="rounded-lg p-4 mb-3" style={{ background: '#F5F3FF' }}>
                <p className="text-sm font-bold leading-relaxed" style={{ color: '#4C1D95', fontFamily: 'Montserrat, sans-serif' }}>
                  "You think you're too old to start. You're 44. You've spent 20 years becoming the expert you are. Matthew 20 says: you're the 11th hour worker. And you get the same denarius. Except yours comes with 20 years of proof they don't have."
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { element: 'Workers hired at 6am', parallel: 'Young creators who started at 18-22. They compare. Let them.' },
                  { element: 'Workers hired at 5pm (11th hour)', parallel: 'The Called Expert at 40-50. "I\'m too old. I started too late." THIS is the target.' },
                  { element: 'All receive the SAME denarius', parallel: 'God\'s economy is not first-come-first-served. The 11th hour expert with 20 years hits the same destination — FASTER.' },
                  { element: '"The last will be first" (v16)', parallel: 'The 45-year-old doctor, 42-year-old teacher, 38-year-old engineer — they are FIRST in CHKPLT\'s economy.' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg p-2 font-bold" style={{ background: '#F5F3FF', color: '#7C3AED' }}>{row.element}</div>
                    <div className="rounded-lg p-2" style={{ background: '#F4F4F5', color: '#27272A' }}>{row.parallel}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support scriptures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { ref: 'Deut 1:6', text: '"You have dwelt long enough at this mountain."', note: 'ATNS was the mountain. The salary was the mountain. Time to possess the land.' },
                { ref: 'Psalm 115:12', text: '"He has been mindful of us."', note: 'Present tense. Not after the cohort fills. Now, in the debt and the mess.' },
                { ref: 'Psalm 115:16', text: '"The earth He has given to man."', note: 'CHKPLT is the assigned portion of earth. Products are territory. Possess it.' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ background: '#F4F4F5', borderColor: '#E4E4E7' }}>
                  <span className="text-xs font-black" style={{ color: '#C9A84C' }}>{s.ref}</span>
                  <p className="text-xs font-bold mt-1 leading-relaxed" style={{ color: '#18181B' }}>{s.text}</p>
                  <p className="text-xs mt-1" style={{ color: '#71717A' }}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-5" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The 6 Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VALUES.map(v => (
              <div key={v.number} className="rounded-xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-black flex-shrink-0" style={{ color: '#C9A84C', fontFamily: 'Montserrat, sans-serif' }}>{v.number}</span>
                  <div>
                    <p className="font-black text-sm" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>{v.name}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#52525B' }}>{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7 Laws */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-5" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The 7 Non-Negotiable Laws
          </h2>
          <div className="rounded-xl border divide-y" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
            {LAWS.map((law, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3">
                <span className="font-black text-sm flex-shrink-0 mt-0.5" style={{ color: '#C9A84C', fontFamily: 'Montserrat, sans-serif' }}>{i + 1}</span>
                <p className="text-sm leading-relaxed" style={{ color: '#27272A' }}>{law}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 153 Products */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-1" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The 153 Fish — Product Architecture
          </h2>
          <p className="text-sm mb-5" style={{ color: '#71717A' }}>
            153 products across 6 Called Expert sub-segments + PAIDS streams. Not a fantasy — a factory. Build the factory.
          </p>
          <div className="space-y-2">
            {PRODUCTS_153.map(track => (
              <div key={track.track} className="rounded-xl border p-4 flex items-center gap-4" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{ background: track.color + '15', color: track.color }}
                >
                  {track.count}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: '#18181B' }}>{track.track}</p>
                  <p className="text-xs" style={{ color: '#71717A' }}>{track.examples}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: '#18181B' }}>
              <span className="font-black text-sm" style={{ color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif' }}>Total</span>
              <span className="text-xl font-black" style={{ color: '#C9A84C' }}>{total} fish</span>
            </div>
          </div>
        </section>

        {/* Genesis → Exodus → Leviticus */}
        <section className="mb-10">
          <h2 className="text-lg font-black mb-5" style={{ color: '#18181B', fontFamily: 'Montserrat, sans-serif' }}>
            The Build Roadmap: Genesis → Exodus → Leviticus
          </h2>
          <div className="space-y-4">
            {PHASES.map((phase, i) => (
              <div key={phase.name} className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E4E4E7' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg" style={{ color: phase.color, fontFamily: 'Montserrat, sans-serif' }}>
                        {phase.name}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: phase.color + '20', color: phase.color }}>
                        {phase.subtitle}
                      </span>
                    </div>
                    <p className="text-xs italic mt-1" style={{ color: '#A1A1AA' }}>{phase.scripture}</p>
                    <p className="text-sm mt-1" style={{ color: '#52525B' }}>{phase.meaning}</p>
                  </div>
                  <span className="text-3xl font-black flex-shrink-0" style={{ color: phase.color + '30', fontFamily: 'Montserrat, sans-serif' }}>
                    0{i + 1}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {phase.tracks.map((track, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <span style={{ color: phase.color }}>→</span>
                      <span style={{ color: '#27272A' }}>{track}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-3" style={{ background: phase.color + '10' }}>
                  <p className="text-xs font-bold" style={{ color: phase.color }}>Phase Goal: {phase.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Seal */}
        <div className="rounded-xl p-6 text-center" style={{ background: '#18181B' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>Sealed by Covenant</p>
          <p className="text-base font-bold leading-relaxed mb-3" style={{ color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif' }}>
            "The rented platforms were Egypt. The algorithm was Pharaoh. CHKPLT is Canaan. The Called Expert is the inheritance. 153 products is the full possession of the land."
          </p>
          <p className="text-sm font-black" style={{ color: '#C9A84C' }}>
            You have dwelt long enough at this mountain. — Deuteronomy 1:6
          </p>
          <p className="text-xs mt-3" style={{ color: '#71717A' }}>
            Sealed by covenant. Marked by Tav (ת). For children's children.
          </p>
        </div>
      </div>
    </div>
  )
}
