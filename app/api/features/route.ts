/**
 * The feature register. Reads the ACTUAL dashboard directory and joins it to metadata, so it
 * can never advertise a tool that does not exist — the same failure that left three dead
 * links in the nav. Anything on disk without metadata is reported as unclassified rather
 * than hidden.
 */

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

type Meta = { name: string; cat: string; pillar?: string; solves: string; stage?: string }

/** cat = the working category. pillar = which content pillar it serves, where it serves one. */
const META: Record<string, Meta> = {
  // ── CONTENT CREATION ──
  'batch-shoot':   { name: 'Batch Shoot', cat: 'Content', solves: 'Idea in, full reel + long-form script, text hook and caption out. The whole batch day in one screen.', stage: 'Ideation → Scripting' },
  'hooks':         { name: 'Hook Generator', cat: 'Content', solves: '52 proven templates across 6 psychology triggers, scored on R×A×C×U^B.', stage: 'Scripting' },
  'scripts':       { name: 'Script Writer', cat: 'Content', solves: 'Rehooks placed on the measured cadence — the technique behind 80–95% watch time.', stage: 'Scripting' },
  'storytelling':  { name: 'Storytelling Studio', cat: 'Content', solves: 'Personal story, case study and explainer as distinct shapes. Never blended.', stage: 'Scripting' },
  'stories':       { name: 'Story Extractor', cat: 'Content', solves: 'Pulls deployable stories out of the 109-row bank.', stage: 'Ideation' },
  'teleprompter':  { name: 'Teleprompter', cat: 'Content', solves: 'Recording without memorising. The one step that stays permanently his.', stage: 'Recording' },
  'captions':      { name: 'Caption + Hashtags', cat: 'Content', solves: 'The Loss Law — caption opens on his loss with a ledger figure.', stage: 'Packaging' },
  'repurpose':     { name: 'Repurpose', cat: 'Content', solves: 'One record, four formats. Reel → carousel → email → long form.', stage: 'Packaging' },
  'content-studio':{ name: 'Content Studio', cat: 'Content', solves: 'Freeform drafting against the ruled voice.', stage: 'Scripting' },
  'carousel':      { name: 'Carousel Generator', cat: 'Content', solves: 'The format that out-reaches reels 2.2× and needs no camera.', stage: 'Packaging' },
  'visuals':       { name: 'Visuals', cat: 'Content', solves: 'Brand-consistent frames per beat.', stage: 'Packaging' },
  'runsheet':      { name: 'Shoot Runsheet', cat: 'Content', solves: 'What to physically record, in order.', stage: 'Recording' },

  // ── AUDIENCE & INTELLIGENCE ──
  'reels':         { name: 'Reel Tracker', cat: 'Tracking', solves: 'Live performance per post, classified by pillar, captions fact-checked on the way in.', stage: 'Tracking' },
  'scorecard':     { name: 'Scorecard', cat: 'Tracking', solves: 'Every post carries a KPI set before it ships. Pass/fail feeds the next batch.', stage: 'Tracking' },
  'analytics':     { name: 'Analytics', cat: 'Tracking', solves: 'Account-level movement over time.', stage: 'Tracking' },
  'icp-pain-library': { name: 'ICP Pain Library', cat: 'Audience', solves: 'The four tiers in their own words.', stage: 'Research' },
  'fears':         { name: 'Fear Analyzer', cat: 'Audience', solves: '~17 of 61 named provision as their deepest fear — the gate question.', stage: 'Research' },
  'competitor':    { name: 'Competitor Intel', cat: 'Audience', solves: 'What the room is already saying.', stage: 'Research' },
  'trends':        { name: 'Trend Scanner', cat: 'Audience', solves: 'Search demand against what he actually posts.', stage: 'Research' },
  'brand-voice':   { name: 'Brand Voice', cat: 'Audience', solves: 'Median sentence 5 words, 57.2% six or fewer — measured, not described.', stage: 'Research' },

  // ── MARKETING ──
  'email':         { name: 'Email', cat: 'Marketing', pillar: 'OWN IT', solves: 'The weekly send, drafted governed and pushed to MailerLite as a draft. Blocks a banned claim before it can reach the list.', stage: 'Marketing' },
  'campaigns':     { name: 'Launch Campaigns', cat: 'Marketing', solves: 'Product launch sequences.', stage: 'Marketing' },
  'cta-optimizer': { name: 'CTA Optimizer', cat: 'Marketing', solves: 'Which keyword to use and what it is worth.', stage: 'Marketing' },
  'cta-check':     { name: 'CTA Check', cat: 'Marketing', solves: 'Blocks a CTA with no destination — an orphan keyword loses the comment too.', stage: 'Marketing' },
  'pitch':         { name: 'Pitch Builder', cat: 'Marketing', solves: 'Sales copy against the ruled tier.', stage: 'Marketing' },
  'offers':        { name: 'Godfather Offers', cat: 'Marketing', solves: 'Offer construction, named pain first.', stage: 'Marketing' },

  // ── BRAND COLLABS ──
  'brand':         { name: 'Brand Collab Engine', cat: 'Brand', pillar: 'PRICE IT', solves: 'Rate card from live ER, media kit, accept/reject on values, agency email replies, invoice.', stage: 'Brand deals' },
  'deals':         { name: 'Brand Deals', cat: 'Brand', pillar: 'PRICE IT', solves: 'Keeps quoted, contracted, invoiced and received apart. Chase log included.', stage: 'Brand deals' },

  // ── FINANCIAL ──
  'revenue':       { name: 'Revenue Tracker', cat: 'Financial', pillar: 'KEEP IT', solves: 'What actually arrived, never what was promised.', stage: 'Money' },
  'products':      { name: 'Products', cat: 'Building', solves: 'Live chkplt.com catalogue, read-only mirror.', stage: 'Building' },

  // ── PLANNING ──
  'the-week':      { name: 'The Week', cat: 'Planning', solves: 'One pillar per week, five-week rotation. Decides which job, when.', stage: 'Planning' },
  'the-return':    { name: 'The Return', cat: 'Planning', solves: 'The only mechanic that makes you come back. Every artifact carries a decay date.', stage: 'Planning' },
  'pipeline':      { name: 'Pipeline Board', cat: 'Planning', solves: 'What is in flight.', stage: 'Planning' },
  'content-calendar-plus': { name: 'Content Calendar', cat: 'Planning', solves: '4 posts a week, 18:00–22:00, never Friday.', stage: 'Planning' },
  'batch-planner': { name: 'Batch Planner', cat: 'Planning', solves: 'The Monday two hours that carry the week.', stage: 'Planning' },
  'advisors':      { name: 'AI Board of Advisors', cat: 'Planning', solves: 'Pressure-tests a decision before it becomes a build.', stage: 'Planning' },

  // ── LIBRARY ──
  'hook-bank':     { name: 'Hook Bank', cat: 'Library', solves: 'Saved hooks, scored.', stage: 'Library' },
  'story-bank':    { name: 'Story Bank', cat: 'Library', solves: '109 rows, 39 E1. Most have never shipped.', stage: 'Library' },
  'saved-scripts': { name: 'Saved Scripts', cat: 'Library', solves: 'Everything written, kept.', stage: 'Library' },
  'saved-hooks':   { name: 'Saved Hooks', cat: 'Library', solves: 'Kept hooks.', stage: 'Library' },
  'saved-stories': { name: 'Saved Stories', cat: 'Library', solves: 'Kept stories.', stage: 'Library' },
  'vault':         { name: 'Content Vault', cat: 'Library', solves: 'Everything produced, searchable.', stage: 'Library' },
  'history':       { name: 'History', cat: 'Library', solves: 'What changed and when.', stage: 'Library' },
  'ip-register':   { name: 'IP Register', cat: 'Library', pillar: 'PROVE IT', solves: '20 named, ownable methods — plus mission, vision and values.', stage: 'IP' },

  // ── GOVERNANCE ──
  'fact-lock':     { name: 'Fact-Lock', cat: 'Governance', solves: '24 rules. A number without a receipt does not ship. Every rule carries its replacement.', stage: 'Governance' },
  'knowledge':     { name: 'Knowledge', cat: 'Governance', solves: 'Doctrine is data. Edit or import and every tool reads the change on its next call.', stage: 'Governance' },
  'integrations':  { name: 'Integrations', cat: 'Governance', solves: 'What is connected and when it last spoke.', stage: 'Governance' },
  'my-algorithm':  { name: 'My Algorithm', cat: 'Governance', solves: 'The measured rules this account actually runs on.', stage: 'Governance' },
  'features':      { name: 'Features', cat: 'Governance', solves: 'This register. Reads the filesystem, so it cannot advertise a tool that is gone.', stage: 'Governance' },
  'settings':      { name: 'Settings', cat: 'Governance', solves: 'Account and keys.', stage: 'Governance' },
}

const ORDER = ['Content', 'Tracking', 'Audience', 'Planning', 'Marketing', 'Brand', 'Financial', 'Building', 'Library', 'Governance']

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
