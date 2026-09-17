/**
 * Prompt builders — server only. Each pulls its grounding out of live governance and
 * hands the model a narrow filling job. If the data a builder needs is not seeded, it
 * says so instead of letting the model invent a substitute.
 */

import { getGovernance, normalisePillars, normaliseTiers } from '@/lib/governance'

export type Built = {
  prompt: string
  schemaHint: string
  fromData: string
  /** Set when required grounding is missing — the route refuses rather than improvising. */
  missing?: string
}

const safeFigures = (gov: any, n = 8) =>
  (gov.fact_lock?.safe ?? []).slice(0, n).map((s: any) => `- ${s.fig} — ${s.note}`).join('\n')

const liveCta = (gov: any, pillar?: string) =>
  (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live' && k.pillar === pillar)
  ?? (gov.cta_library?.keywords ?? []).find((k: any) => k.status === 'live')

const FIGURE_RULE =
  'If you need a figure that is not on that list, write the line so it does not need one. An empty slot beats a plausible filler. Never estimate, never write "approximately".'

export async function build(key: string, input: Record<string, string>): Promise<Built> {
  const gov = await getGovernance()

  switch (key) {
    case 'captions': {
      const cta = liveCta(gov, input.pillar)
      return {
        fromData: 'the Loss Law, the evidenced figure list, SA English rules and the live CTA',
        prompt: `Write three caption options for one post.

TOPIC: ${input.topic}
PILLAR: ${input.pillar} · TIER: ${input.tier}

THE CAPTION LAW — not optional:
${gov.hook_library?.captionHookLaw ?? 'Open on his own loss with a rand figure that exists in the ledger.'}
Then the teach. Then ONE ask.

VOICE, measured from his own writing: median sentence 5 words, 57.2% are six words or fewer, line breaks carry the punctuation.
SA English: colour, organise, realise. ZAR as R1,800 — never "R 1800" or "R1,800.00".
Never use: ${(gov.voice?.never ?? ['delve', 'leverage', 'synergy']).join(', ')}.

FIGURES YOU MAY USE — and nothing else:
${safeFigures(gov)}
${FIGURE_RULE}

CTA: ${cta ? `"${cta.k}" — resolves to ${cta.destination}` : 'no keyword resolves; ask for a save or a reply'}

Give each option a different angle: one opening on the loss, one opening on the number, one opening on the reader.`,
        schemaHint: '{"options":[{"angle":"...","caption":"...","hashtags":["..."],"why":"one sentence"}],"cta":"..."}',
      }
    }

    case 'repurpose': {
      const cta = liveCta(gov, input.pillar)
      return {
        fromData: 'the four-format chain and the measured format performance',
        prompt: `Turn ONE existing piece into the other three formats. Do not write new material — re-cut what is already here.

SOURCE:
${input.source}

PILLAR: ${input.pillar}

MEASURED, so weight it accordingly: ${gov.algorithm?.formats ?? 'Carousels out-reach reels 2.2x and 2.7x across two independent windows. He posts 137 reels for every 14 feed posts.'}

Produce:
1. CAROUSEL — 6 slides, headline of at most 7 words plus at most 25 words of body each
2. EMAIL — to a list of ${gov.ledger_totals?.email_list ?? 173} people who raised their hand; write to one of them
3. SHORT REEL — a 30-second cut, hook in the second person
4. ONE-LINER — the single screenshot-able sentence

FIGURES YOU MAY USE — and nothing else:
${safeFigures(gov, 6)}
${FIGURE_RULE}

CTA: ${cta ? cta.k : 'none resolves — ask for a save'}`,
        schemaHint: '{"carousel":[{"n":1,"headline":"...","body":"..."}],"email":{"subject":"...","body":"..."},"reel":{"hook":"...","script":"..."},"oneLiner":"..."}',
      }
    }

    case 'storytelling': {
      const fmt = (gov.script_formats?.formats ?? []).find((f: any) => f.key === input.format)
      return {
        fromData: 'the four ruled story shapes and the evidenced figure list',
        prompt: `Write this as a ${fmt?.name ?? input.format}.

THE MOMENT: ${input.topic}
PILLAR: ${input.pillar}

THE SHAPE — follow it exactly: ${fmt?.shape ?? 'Loss → Numbers → What changed → Lesson'}
WHEN TO USE IT: ${fmt?.use ?? ''}
THE LAW: ${gov.script_formats?.law ?? 'A confession without a receipt is a diary. A receipt without a confession is a brag. Every strong piece takes one from each.'}

Never fabricate a story and never merge two. If the moment given is thin, say what is missing rather than padding it.

FIGURES YOU MAY USE — and nothing else:
${safeFigures(gov)}
${FIGURE_RULE}`,
        schemaHint: '{"shape":"...","beats":[{"label":"...","text":"..."}],"full":"the whole piece","confession":"what it admits","receipt":"what proves it","missing":"what you could not source, or null"}',
      }
    }

    case 'fears': {
      const tiers = normaliseTiers(gov)
      if (!tiers.length) return { prompt: '', schemaHint: '', fromData: '', missing: 'icp/tiers' }
      return {
        fromData: 'the ruled gate, the four tiers and their measured evidence',
        prompt: `Classify this person against the ruled gate. Report what their words support — do not flatter them into a tier they do not qualify for.

WHAT THEY SAID:
${input.input}

THE GATE — two tests, both run on the sentence:
${(gov.icp?.gate ?? []).map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}

THE TIERS:
${tiers.map((t) => `- ${t.tier} (${t.price}) — ${t.who}. They say: "${t.line ?? ''}". ${t.sell === false ? 'NEVER SOLD TO.' : ''}`).join('\n')}

THE MECHANISM, true of all of them and never said out loud:
"${gov.icp?.mechanism ?? 'Somebody else decides what they earn, and they find out afterwards.'}"

MEASURED: ${gov.icp?.evidence ?? '~17 of 61 named provision as their deepest fear — the most repeated phrase in any dataset in the estate.'}

If they fail the gate, say so plainly and say they are traffic, not a customer.

DUTY OF CARE: if the words suggest crisis or self-harm, set "crisis" true, return no pitch of any kind, and surface SADAG 0800 567 567 / SMS 31393.`,
        schemaHint: '{"passesGate":true,"tier":"FREE|ENTRY|CORE|PREMIUM|not-served","statedFear":"...","realFear":"...","whoElseAppears":"the other person in their fear, or null","evidence":"which of their words decided it","serve":"what would actually help","crisis":false}',
      }
    }

    case 'runsheet': {
      const cadence = (gov.rehook?.cadence ?? []).find((c: any) => c.duration === input.duration)
      return {
        fromData: `the ${input.duration} beat structure and the measured runtime window`,
        prompt: `Turn this script into a shot list. Physical instructions only — what to point the camera at and what goes on screen.

SCRIPT:
${input.script}

STRUCTURE: ${cadence ? `${cadence.rehooks} rehooks every ${cadence.every} — ${cadence.structure}` : input.duration}
RUNTIME: ${gov.algorithm?.reel_runtime_seconds ?? '90-105'} seconds. Above ~160s completion collapses under 12%.
ON SCREEN: ${gov.script_principles?.advanced?.visuals ?? 'If the hook says a number, show a document, a letter, a figure — not a suit and a smile.'}

For each shot give: what is in frame, the line said over it, the on-screen text, and roughly how long.`,
        schemaHint: '{"shots":[{"n":1,"frame":"...","line":"...","screen":"...","seconds":"0-8"}],"props":["..."],"totalSeconds":0}',
      }
    }

    case 'pitch': {
      const tiers = normaliseTiers(gov)
      const t = tiers.find((x) => x.tier === input.tier)
      if (!t) return { prompt: '', schemaHint: '', fromData: '', missing: `tier ${input.tier}` }
      return {
        fromData: 'the ruled tier, its price, its own words and the trust barrier',
        prompt: `Write sales copy for ONE tier and no other. Never mix two audiences in one output.

WHAT IS BEING SOLD: ${input.offer}

THE BUYER — ${t.tier} at ${t.price}:
${t.who}${t.age ? `, ${t.age}` : ''}. They say: "${t.line ?? ''}".
Evidence behind them: ${t.evidence ?? ''}
${t.limit ? `HARD LIMIT: ${t.limit}` : ''}

THE MECHANISM: ${gov.icp?.mechanism ?? ''}
THE TRUST BARRIER: they have been scammed before, and fake support accounts hunt demonetised creators. Receipts first, offer second.

FIGURES YOU MAY USE — and nothing else:
${safeFigures(gov)}
${FIGURE_RULE}`,
        schemaHint: '{"headline":"...","subhead":"...","problem":"...","proof":"...","offer":"...","objections":[{"objection":"...","answer":"..."}],"cta":"...","price":"..."}',
      }
    }

    case 'offers': {
      const tiers = normaliseTiers(gov)
      const t = tiers.find((x) => x.tier === input.tier)
      return {
        fromData: 'the ruled ladder, its prices and the product naming law',
        prompt: `Design ONE offer for the ${input.tier} tier.

THE PROBLEM: ${input.idea}
THE BUYER: ${t ? `${t.who} — they say "${t.line ?? ''}"` : input.tier}
PRICE BAND: ${t?.price ?? 'per the ruled ladder'}

THE NAMING LAW:
A product is a transformation A→B in a timeframe, one sentence, ending in a tangible OUTPUT.
Name it as a Named Pain — "Stop [painful thing]". The subtitle is NUMBER + TIMEFRAME + "without [feared cost]".
Use: Sprint, Formula, System, Map, Reboot, Launch, Kit, Blueprint.
Avoid: Guide, Handbook, Tips, Secrets, Ultimate, Complete, Master.

${t?.limit ? `HARD LIMIT: ${t.limit}` : ''}
THE ONE RULE in force: nothing new ships until something old has been paid for. If this offer duplicates something that already exists, say so.`,
        schemaHint: '{"name":"...","subtitle":"...","transformation":"A to B in a timeframe","output":"the tangible thing they get","price":"...","modules":["..."],"duplicatesExisting":"what it overlaps with, or null"}',
      }
    }

    case 'visuals': {
      return {
        fromData: 'the brand palette, the box law and the on-screen text rules',
        prompt: `Direct the visuals for this piece.

SCRIPT OR BEAT:
${input.script}

PILLAR: ${input.pillar}

PALETTE — use these and nothing else:
charcoal #1C1C1C · gold #D4A82F · mustard #D9BC45 · paper #F8F8F8 · cream #F1E7C3 · yellow #FFFCE9 · powder blue
BOX LAW: dark = warning or why · gold/mustard = key emphasis · cream = my example · yellow = tip · blue = your-turn fill-in
TYPE: Montserrat headings bold, Lato body.

THE RULE: ${gov.script_principles?.advanced?.visuals ?? 'If the hook says a number, show a document, a letter, a figure — not a suit and a smile.'}

For each beat give the frame, the on-screen text, and which palette colour carries it.`,
        schemaHint: '{"frames":[{"beat":"...","visual":"...","screenText":"...","colour":"...","why":"..."}],"thumbnail":"the one frame that works as a cover"}',
      }
    }

    default:
      return { prompt: '', schemaHint: '', fromData: '', missing: `no builder for "${key}"` }
  }
}
