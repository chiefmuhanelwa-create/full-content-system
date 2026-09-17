/**
 * The feature register. Reads the ACTUAL dashboard directory and joins it to metadata, so it
 * can never advertise a tool that does not exist — the same failure that left three dead
 * links in the nav. Anything on disk without metadata is reported as unclassified rather
 * than hidden.
 */

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

type Meta = { name: string; cat: string; pillar?: string; solves: string; stage?: string; icon: string; accent: string }

/** cat = the working category. pillar = which content pillar it serves, where it serves one. */
const META: Record<string, Meta> = {
  // ── CONTENT ──
  'batch-shoot':   { name: 'Batch Shoot', cat: 'Content', pillar: 'PRICE IT', icon: 'Clapperboard', accent: 'emerald', solves: 'One idea to a reel script, the long-form cut, the on-screen text hook and the caption — with a KPI set before it ships.', stage: 'Ideation → Scripting' },
  'hooks':         { name: 'Hook Generator', cat: 'Content', icon: 'Zap', accent: 'blue', solves: '50 proven templates across 6 psychology triggers, scored on R×A×C×U^B.', stage: 'Scripting' },
  'scripts':       { name: 'Script Writer', cat: 'Content', icon: 'FileText', accent: 'blue', solves: 'Rehooks placed on the measured cadence — the technique behind 80–95% watch time.', stage: 'Scripting' },
  'storytelling':  { name: 'Storytelling', cat: 'Content', icon: 'Tv2', accent: 'violet', solves: 'Personal story, case study and explainer as distinct shapes. Never blended.', stage: 'Scripting' },
  'carousel':      { name: 'Carousel', cat: 'Content', pillar: 'OWN IT', icon: 'LayoutGrid', accent: 'violet', solves: 'Out-reaches reels 2.2× on this account, and needs no camera.', stage: 'Packaging' },
  'stories':       { name: 'Story Extractor', cat: 'Content', icon: 'BookOpen', accent: 'violet', solves: 'Pulls deployable stories from the 109-row bank. 39 are E1 and most have never shipped.', stage: 'Ideation' },
  'teleprompter':  { name: 'Teleprompter', cat: 'Content', icon: 'MonitorPlay', accent: 'slate', solves: 'Recording without memorising. The one step that stays permanently yours.', stage: 'Recording' },
  'captions':      { name: 'Captions', cat: 'Content', icon: 'Hash', accent: 'blue', solves: 'The Loss Law — a caption opens on your own loss with a figure from the ledger.', stage: 'Packaging' },
  'repurpose':     { name: 'Repurpose', cat: 'Content', icon: 'Repeat', accent: 'slate', solves: 'One record, four formats. Reel, carousel, email, long form.', stage: 'Packaging' },
  'content-studio':{ name: 'Content Studio', cat: 'Content', icon: 'PenTool', accent: 'slate', solves: 'Freeform drafting against the ruled voice.', stage: 'Scripting' },
  'visuals':       { name: 'Visuals', cat: 'Content', icon: 'Image', accent: 'violet', solves: 'Brand-consistent frames per beat.', stage: 'Packaging' },
  'runsheet':      { name: 'Shoot Runsheet', cat: 'Content', icon: 'ClipboardList', accent: 'slate', solves: 'What to physically record, in order.', stage: 'Recording' },

  // ── TRACKING ──
  'reels':         { name: 'Reel Tracker', cat: 'Tracking', icon: 'Instagram', accent: 'rose', solves: 'Live performance per post, classified by pillar, captions fact-checked as published.', stage: 'Tracking' },
  'scorecard':     { name: 'Scorecard', cat: 'Tracking', pillar: 'PROVE IT', icon: 'Target', accent: 'rose', solves: 'A post with no KPI cannot fail — which means it cannot teach. Three repeats becomes a rule.', stage: 'Tracking' },
  'history':       { name: 'History', cat: 'Tracking', icon: 'History', accent: 'slate', solves: 'What changed, and when.', stage: 'Tracking' },

  // ── AUDIENCE ──
  'icp-pain-library': { name: 'ICP Pain Library', cat: 'Audience', icon: 'Target', accent: 'blue', solves: 'The four ruled tiers in their own words.', stage: 'Research' },
  'fears':         { name: 'Fear Analyzer', cat: 'Audience', icon: 'Brain', accent: 'violet', solves: '~17 of 61 named provision as their deepest fear — the gate question.', stage: 'Research' },
  'brand-voice':   { name: 'Voice Check', cat: 'Governance', icon: 'Mic', accent: 'rose', solves: 'Median sentence length, slop words, SA spelling and ZAR format — all arithmetic, so no model is called.', stage: 'Governance' },

  // ── PLANNING ──
  'the-week':      { name: 'The Week', cat: 'Planning', icon: 'CalendarRange', accent: 'blue', solves: 'One pillar per week, five-week rotation. Decides which job, when.', stage: 'Planning' },
  'the-return':    { name: 'The Return', cat: 'Planning', icon: 'RotateCcw', accent: 'amber', solves: 'The only mechanic that makes you come back. Every artifact carries a decay date.', stage: 'Planning' },
  'pipeline':      { name: 'Pipeline', cat: 'Planning', icon: 'Kanban', accent: 'slate', solves: 'What is in flight.', stage: 'Planning' },
  'content-calendar-plus': { name: 'Calendar', cat: 'Planning', icon: 'Calendar', accent: 'slate', solves: '4 posts a week, 18:00–22:00 SAST, never Friday.', stage: 'Planning' },
  'batch-planner': { name: 'Batch Planner', cat: 'Planning', icon: 'Layers', accent: 'amber', solves: 'The Monday two hours that carry the week.', stage: 'Planning' },
  'advisors':      { name: 'Board of Advisors', cat: 'Planning', icon: 'Users', accent: 'slate', solves: 'Pressure-tests a decision before it becomes a build.', stage: 'Planning' },

  // ── MARKETING ──
  'email':         { name: 'Email', cat: 'Marketing', pillar: 'OWN IT', icon: 'Mail', accent: 'violet', solves: 'The one channel nobody can switch off. Pushes to MailerLite as a draft, and refuses to push a banned claim.', stage: 'Marketing' },
  'campaigns':     { name: 'Launch Campaigns', cat: 'Marketing', icon: 'Megaphone', accent: 'slate', solves: 'Product launch sequences.', stage: 'Marketing' },
  'cta-check':     { name: 'CTA Check', cat: 'Marketing', icon: 'Link2', accent: 'amber', solves: 'A keyword with no destination converts nothing AND loses the comment.', stage: 'Marketing' },
  'cta-optimizer': { name: 'CTA Optimizer', cat: 'Marketing', icon: 'Zap', accent: 'amber', solves: 'Which keyword to use, and what it is worth.', stage: 'Marketing' },
  'pitch':         { name: 'Pitch Builder', cat: 'Marketing', icon: 'Presentation', accent: 'blue', solves: 'Sales copy written to one ruled tier.', stage: 'Marketing' },
  'offers':        { name: 'Offers', cat: 'Marketing', icon: 'Star', accent: 'amber', solves: 'Offer construction, named pain first.', stage: 'Marketing' },

  // ── BRAND & MONEY ──
  'brand':         { name: 'Brand Engine', cat: 'Brand & Money', pillar: 'PRICE IT', icon: 'Briefcase', accent: 'emerald', solves: 'Rate card from live reach, media kit, accept or reject on your values, agency replies, invoice.', stage: 'Brand deals' },
  'deals':         { name: 'Brand Deals', cat: 'Brand & Money', pillar: 'PRICE IT', icon: 'Handshake', accent: 'emerald', solves: 'Quoted, contracted, invoiced and received are four different things. This keeps them apart.', stage: 'Brand deals' },
  'revenue':       { name: 'Revenue', cat: 'Brand & Money', pillar: 'KEEP IT', icon: 'Wallet', accent: 'blue', solves: 'What actually arrived. Never what was promised.', stage: 'Money' },
  'products':      { name: 'Products', cat: 'Brand & Money', icon: 'Package', accent: 'slate', solves: 'The live chkplt.com catalogue, read-only.', stage: 'Building' },

  // ── LIBRARY ──
  'ip-register':   { name: 'IP Register', cat: 'Library', pillar: 'PROVE IT', icon: 'Fingerprint', accent: 'rose', solves: '20 named methods you own — plus mission, vision and values.', stage: 'IP' },
  'hook-bank':     { name: 'Hook Bank', cat: 'Library', icon: 'BookMarked', accent: 'blue', solves: 'Every hook kept and scored.', stage: 'Library' },
  'story-bank':    { name: 'Story Bank', cat: 'Library', icon: 'BookOpen', accent: 'violet', solves: '109 rows, vulnerability-scored.', stage: 'Library' },
  'vault':         { name: 'Vault', cat: 'Library', icon: 'Archive', accent: 'slate', solves: 'Everything produced, searchable.', stage: 'Library' },

  // ── GOVERNANCE ──
  'fact-lock':     { name: 'Fact-Lock', cat: 'Governance', icon: 'ShieldCheck', accent: 'rose', solves: '24 rules. A number without a receipt does not ship, and every rule carries its replacement.', stage: 'Governance' },
  'knowledge':     { name: 'Knowledge', cat: 'Governance', icon: 'Database', accent: 'blue', solves: 'Doctrine is data. Edit it and every tool reads the change on its next call.', stage: 'Governance' },
  'my-algorithm':  { name: 'My Algorithm', cat: 'Governance', icon: 'Cpu', accent: 'blue', solves: 'The measured rules this account actually runs on.', stage: 'Governance' },
  'integrations':  { name: 'Integrations', cat: 'Governance', icon: 'Plug', accent: 'slate', solves: 'What is connected, and when it last spoke.', stage: 'Governance' },
  'features':      { name: 'All Features', cat: 'Governance', icon: 'LayoutGrid', accent: 'slate', solves: 'Reads the filesystem, so it cannot advertise a tool that is gone.', stage: 'Governance' },
  'settings':      { name: 'Settings', cat: 'Governance', icon: 'Settings', accent: 'slate', solves: 'Account and keys.', stage: 'Governance' },
}

const ORDER = ['Content', 'Tracking', 'Planning', 'Brand & Money', 'Marketing', 'Audience', 'Library', 'Governance']

export async function GET() {
  const dir = path.join(process.cwd(), 'app', 'dashboard')
  let slugs: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isDirectory()) continue
      try { await fs.access(path.join(dir, e.name, 'page.tsx')); slugs.push(e.name) } catch {}
    }
  } catch {}

  const known = slugs.filter((s) => META[s]).map((s) => ({ slug: s, href: `/dashboard/${s}`, ...META[s] }))
  const unclassified = slugs.filter((s) => !META[s])
  const advertisedButMissing = Object.keys(META).filter((k) => !slugs.includes(k))

  const byCategory = ORDER.map((cat) => ({
    category: cat,
    items: known.filter((k) => k.cat === cat).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length)

  return NextResponse.json({
    total: known.length,
    onDisk: slugs.length,
    byCategory,
    unclassified,
    advertisedButMissing,
    healthy: advertisedButMissing.length === 0,
  })
}
