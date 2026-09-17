/**
 * POST /api/voice-check — measure a draft against the voice, computed not guessed.
 *
 * This is the most data-heavy tool in the system: the mechanics are arithmetic, so they are
 * arithmetic here. Median sentence length, the six-words-or-fewer share, banned slop words,
 * ZAR formatting and the Loss Law opener are all COMPUTED. No model is called at all.
 *
 * Measured baseline from his own writing: median sentence 5 words, 57.2% six or fewer.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getGovernance } from '@/lib/governance'
import { check } from '@/lib/fact-lock'
import { logActivity } from '@/lib/activity'

const sentences = (t: string) =>
  t.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean)

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

function median(ns: number[]) {
  if (!ns.length) return 0
  const a = [...ns].sort((x, y) => x - y)
  const m = Math.floor(a.length / 2)
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2
}

export async function POST(request: NextRequest) {
  const { text } = await request.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Paste a draft to measure.' }, { status: 400 })

  const gov = await getGovernance()
  const slop: string[] = gov.voice?.never ?? ['delve', 'certainly', 'absolutely', 'leverage', 'synergy', 'utilize', 'utilise']

  const sents = sentences(text)
  const lens = sents.map(words)
  const med = median(lens)
  const shortShare = lens.length ? +((lens.filter((n) => n <= 6).length / lens.length) * 100).toFixed(1) : 0

  const lower = String(text).toLowerCase()
  const slopFound = slop.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))

  // SA money format: R199 and R1,800 are right; "R 199" and "R199.00" are not.
  const badMoney = Array.from(String(text).matchAll(/R\s+\d|R\d+\.\d{2}\b/g)).map((m) => m[0])
  const usSpelling = ['color', 'organize', 'realize', 'analyze', 'optimize']
    .filter((w) => new RegExp(`\\b${w}`, 'i').test(lower))
  const usBodies = ['IRS', 'LLC', 'SEC'].filter((w) => new RegExp(`\\b${w}\\b`).test(String(text)))

  const opener = sents[0] ?? ''
  const opensSecondPerson = /^(you|your)\b/i.test(opener)
  const openerHasFigure = /R\s?\d[\d,]*/.test(opener)

  const fl = check(text)

  const checks = [
    { name: 'Median sentence length', target: '5 words', actual: `${med} words`, pass: med <= 7,
      note: 'Measured from his own writing. Long sentences are the clearest tell that something was not written in his voice.' },
    { name: 'Six words or fewer', target: '57.2%', actual: `${shortShare}%`, pass: shortShare >= 40,
      note: 'Line breaks carry the punctuation.' },
    { name: 'No AI slop', target: 'none', actual: slopFound.length ? slopFound.join(', ') : 'none', pass: !slopFound.length,
      note: 'His own banned list.' },
    { name: 'SA English', target: 'colour, organise, realise', actual: usSpelling.length ? usSpelling.join(', ') : 'clean', pass: !usSpelling.length },
    { name: 'SA bodies', target: 'SARS, CIPC, PTY LTD', actual: usBodies.length ? usBodies.join(', ') : 'clean', pass: !usBodies.length },
    { name: 'ZAR format', target: 'R199 / R1,800', actual: badMoney.length ? badMoney.join(', ') : 'clean', pass: !badMoney.length },
    { name: 'Fact-lock', target: 'no banned claims', actual: fl.clean ? 'clean' : fl.banned.map((b) => b.name).join(', '), pass: fl.clean },
  ]

  const passed = checks.filter((c) => c.pass).length

  await logActivity('governance', 'voice-check', `${passed}/${checks.length} checks passed`, {
    median: med, shortShare, slop: slopFound.length, banned: !fl.clean,
  })

  return NextResponse.json({
    success: true,
    score: Math.round((passed / checks.length) * 100),
    passed, total: checks.length,
    stats: { sentences: sents.length, words: words(text), medianSentence: med, sixOrFewerPct: shortShare },
    checks,
    opener: {
      text: opener,
      secondPerson: opensSecondPerson,
      hasFigure: openerHasFigure,
      guidance: opensSecondPerson
        ? 'Opens in the second person — correct for a SPOKEN hook. A caption should open on his own loss with a figure instead.'
        : openerHasFigure
          ? 'Opens with a figure — correct for a CAPTION under the Loss Law. A spoken hook should accuse the viewer instead.'
          : 'Opens neither in the second person nor on a figure. Spoken hooks accuse the viewer; captions open on his loss with a ledger figure.',
    },
    banned: fl.banned.map((b) => ({ name: b.name, found: b.found, fix: b.fix })),
    computed: 'Every number here is arithmetic on your draft. No model was called.',
  })
}
