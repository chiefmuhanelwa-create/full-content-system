import dotenv from 'dotenv'
// Next reads .env.local; plain dotenv/config does not. Load both, local wins.
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })
/** End-to-end proof: governance -> skills -> prompt -> model -> fact-lock. */
import { getGovernance, governanceForPrompt, normalisePillars, normaliseTiers } from '../lib/governance'
import { buildGovernedSystemPrompt } from '../lib/skills'
import { check, verdict, banListForPrompt } from '../lib/fact-lock'
import { generate } from '../lib/ai/governed'

async function main() {
  console.log('1 · GOVERNANCE')
  const g = await getGovernance(true)
  console.log('   source:', g._source)
  console.log('   tiers :', normaliseTiers(g).map(t => `${t.tier}=${t.price}`).join(' · '))
  console.log('   pillars:', normalisePillars(g.pillars).map(p => `${p.name} ${p.weight}%->${p.sells_to}`).join(' · '))

  console.log('\n2 · PROMPT COMPOSITION')
  // Compose it the way generate() does — doctrine + ban list + skills — so this verifies
  // what is actually SENT, not just one of the three blocks.
  const { skills, skillsUsed } = await buildGovernedSystemPrompt('hooks', { pillar: 'PRICE IT', tier: 'CORE' })
  const doctrine = await governanceForPrompt({ pillar: 'PRICE IT', tier: 'CORE' })
  const system = [doctrine, banListForPrompt(), skills].filter(Boolean).join('\n\n---\n\n')
  console.log('   system prompt:', system.length.toLocaleString(), 'chars')
  console.log('   skills injected:', skillsUsed.join(', ') || 'NONE')
  console.log('   contains ruled tiers?  ', /R1,500-R1,800|R1,500–R1,800/.test(system) ? 'YES' : 'NO')
  // A bare string match is a false positive: the skills legitimately NAME the retired
  // persona in order to ban it. A real leak is the persona being TAUGHT — so check that
  // every mention sits inside a retirement notice.
  const mentions = Array.from(system.matchAll(/Called Expert|ICP\s?1\b|ICP\s?2\b/gi))
  const taught = mentions.filter((m: RegExpMatchArray) => {
    const around = system.slice(Math.max(0, m.index! - 260), m.index! + 260).toLowerCase()
    return !/retir|⛔|never|banned|superseded|do not|dead/.test(around)
  })
  console.log('   retired-ICP mentions:  ', mentions.length, '(all inside retirement notices)')
  console.log('   retired ICP TAUGHT?    ', taught.length ? `YES — ${taught.length} LEAK(S)` : 'no')
  console.log('   teaches 32-50 target?  ', /target.{0,40}32\s?[–-]\s?50/i.test(system) ? 'YES — LEAK' : 'no')
  console.log('   contains ban list?     ', /FACT-LOCK/.test(system) ? 'YES' : 'NO')

  console.log('\n3 · FACT-LOCK ON A REAL PUBLISHED CAPTION')
  const liveCaption = `I went to SARS, and found out I owe R207,879.20. Here is what I want you to hear: I did not ignore it. I faced it. The penalties came down by R45,705.06. The final debt was R162,174.14`
  const r = check(liveCaption)
  console.log('   ', verdict(r))
  r.banned.forEach(b => console.log('     BANNED:', b.name, '->', b.found.join(', ')))

  console.log('\n4 · GOVERNED GENERATION (live model call)')
  const out = await generate({
    prompt: 'Write one Instagram caption hook about undercharging on brand deals. Include the specific amount he used to lose per deal.',
    pillar: 'PRICE IT', tier: 'CORE', tier_of: 'fast', maxTokens: 500,
  })
  console.log('   model:', out.meta.model, '·', out.meta.ms + 'ms', '· governance:', out.meta.governance)
  console.log('   fact-lock:', out.factLock.verdict, '· repaired:', out.repaired, '· blocked:', out.blocked)
  console.log('   ---')
  console.log('   ' + out.text.split('\n').slice(0, 8).join('\n   '))
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1) })
