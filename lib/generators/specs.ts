/**
 * Generator specifications — client-safe metadata only.
 *
 * Every generator in this system is the same shape: pull the grounding data out of
 * governance, hand the model a narrow filling job, fact-check what comes back. Declaring
 * that once means each tool is a config rather than a bespoke page, so they cannot drift
 * apart in look or in rigour.
 *
 * The prompt builders live in ./builders (server only) — they read the database.
 */

export type Field = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
  placeholder?: string
  optional?: boolean
}

export type GenSpec = {
  key: string
  title: string
  eyebrow: string
  description: string
  /** What the model is NOT allowed to decide, shown to the user so the 80/20 is visible. */
  grounding: string
  fields: Field[]
  /** How to render the result. */
  render: 'blocks' | 'list' | 'text'
}

const PILLARS = ['KEEP IT', 'PRICE IT', 'OWN IT', 'BUILD IT ANYWAY', 'PROVE IT']
const TIERS = ['ENTRY', 'CORE', 'PREMIUM']

export const SPECS: Record<string, GenSpec> = {
  captions: {
    key: 'captions',
    title: 'Captions',
    eyebrow: '80% DATA · 20% AI',
    description: 'The caption opens on your own loss with a figure from the ledger. That is the Loss Law, and it measured 25.5 median comments against 3.0.',
    grounding: 'the Loss Law, the evidenced figure list, SA English rules, and the CTA keyword that actually resolves',
    fields: [
      { name: 'topic', label: 'What is the post about?', type: 'textarea', placeholder: 'e.g. the agency asks for your rate card before it names a budget' },
      { name: 'pillar', label: 'Pillar', type: 'select', options: PILLARS },
      { name: 'tier', label: 'Tier served', type: 'select', options: TIERS },
    ],
    render: 'blocks',
  },

  repurpose: {
    key: 'repurpose',
    title: 'Repurpose',
    eyebrow: '80% DATA · 20% AI',
    description: 'One record, four formats. The carousel is not an afterthought — it out-reaches reels 2.2× on this account and needs no camera.',
    grounding: 'the One-Record-Four-Format-Chain, the measured format performance, and the ruled CTA set',
    fields: [
      { name: 'source', label: 'Paste the script, caption or transcript', type: 'textarea', placeholder: 'Paste the piece you already made…' },
      { name: 'pillar', label: 'Pillar', type: 'select', options: PILLARS },
    ],
    render: 'blocks',
  },

  storytelling: {
    key: 'storytelling',
    title: 'Storytelling',
    eyebrow: '80% DATA · 20% AI',
    description: 'Personal story, case study and explainer are different shapes. A confession without a receipt is a diary; a receipt without a confession is a brag.',
    grounding: 'the four ruled story shapes, the evidenced figure list, and the confession-plus-receipt law',
    fields: [
      { name: 'topic', label: 'The moment or lesson', type: 'textarea', placeholder: 'e.g. the first time a brand told me they had budgeted 20x what I asked' },
      { name: 'format', label: 'Shape', type: 'select', options: ['personal', 'case_study', 'explainer', 'storytelling'] },
      { name: 'pillar', label: 'Pillar', type: 'select', options: PILLARS },
    ],
    render: 'blocks',
  },

  fears: {
    key: 'fears',
    title: 'Fear Analyzer',
    eyebrow: '80% DATA · 20% AI',
    description: 'The gate question: does another human being appear in their fear? "Provide for my kids" is a customer. "Get 0 likes" is traffic.',
    grounding: 'the ruled gate, the four tiers with their measured evidence, and the mechanism nobody says out loud',
    fields: [
      { name: 'input', label: 'Paste what they said — a DM, a comment, a survey answer', type: 'textarea', placeholder: 'Paste their words, verbatim…' },
    ],
    render: 'blocks',
  },

  runsheet: {
    key: 'runsheet',
    title: 'Shoot Runsheet',
    eyebrow: '80% DATA · 20% AI',
    description: 'What to physically record, in order. Recording is the one step that stays permanently yours.',
    grounding: 'the measured runtime window, the beat structure, and the on-screen text rules',
    fields: [
      { name: 'script', label: 'Paste the script', type: 'textarea', placeholder: 'Paste the script you are shooting…' },
      { name: 'duration', label: 'Runtime', type: 'select', options: ['15s', '30s', '60s', '90s'] },
    ],
    render: 'list',
  },

  pitch: {
    key: 'pitch',
    title: 'Pitch Builder',
    eyebrow: '80% DATA · 20% AI',
    description: 'Sales copy written to exactly one ruled tier. Never mix two audiences in one output.',
    grounding: 'the four ruled tiers with their prices and their own words, plus the trust barrier',
    fields: [
      { name: 'offer', label: 'What are you selling?', type: 'textarea', placeholder: 'e.g. the SARS for Creators kit' },
      { name: 'tier', label: 'Tier served', type: 'select', options: TIERS },
    ],
    render: 'blocks',
  },

  offers: {
    key: 'offers',
    title: 'Offer Builder',
    eyebrow: '80% DATA · 20% AI',
    description: 'Every product is a transformation A→B in a timeframe, ending in a tangible output. Named Pain first.',
    grounding: 'the ruled ladder and its prices, the naming law, and the tier that the offer must serve',
    fields: [
      { name: 'idea', label: 'The problem it solves', type: 'textarea', placeholder: 'e.g. creators cannot produce a rate card' },
      { name: 'tier', label: 'Tier', type: 'select', options: TIERS },
    ],
    render: 'blocks',
  },

  visuals: {
    key: 'visuals',
    title: 'Visuals',
    eyebrow: '80% DATA · 20% AI',
    description: 'If the hook says a number, the frame shows a document — not a suit and a smile.',
    grounding: 'the brand palette, the box law, and the on-screen text rules from the retention evidence',
    fields: [
      { name: 'script', label: 'The script or beat', type: 'textarea', placeholder: 'Paste the script or a single beat…' },
      { name: 'pillar', label: 'Pillar', type: 'select', options: PILLARS },
    ],
    render: 'list',
  },
}

export const SPEC_KEYS = Object.keys(SPECS)
