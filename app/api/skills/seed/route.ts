/**
 * POST /api/skills/seed — read the nochill-* skills off disk into skill_docs
 * GET  /api/skills/seed — what is seeded, and which generator consumes it
 *
 * Why: the CLI skills and this app were teaching different things. nochill-script knows the
 * hook architecture, VOICE-EVIDENCE has the measured mechanics, nochill-week has the cadence
 * — and lib/knowledge-base.ts, which the generators actually read, had none of it and carried
 * the retired ICP instead. Seeding makes one rulebook, readable by both.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { OWNER } from '@/lib/governance'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills')

/** Only the NoChill skills. The rest of the directory is unrelated tooling. */
const WANTED = [
  'nochill-brain', 'nochill-script', 'nochill-storytelling', 'nochill-edit',
  'nochill-week', 'nochill-email', 'nochill-brand', 'nochill-carousel',
  'nochill-product-kit', 'nochill-claim-check', 'nochill-ops', 'nochill-curriculum',
]

/** Which generator reads which skill. Drives the prompt composition in lib/skills.ts. */
const CONSUMERS: Record<string, string[]> = {
  'nochill-script': ['hooks', 'scripts', 'batch', 'teleprompter', 'repurpose'],
  'nochill-storytelling': ['stories', 'storytelling', 'scripts'],
  'nochill-brain': ['*'],
  'nochill-week': ['the-week', 'batch-planner', 'content-calendar-plus', 'pipeline'],
  'nochill-edit': ['runsheet', 'captions', 'visuals'],
  'nochill-email': ['campaigns', 'email'],
  'nochill-brand': ['visuals', 'carousel'],
  'nochill-carousel': ['carousel', 'visuals'],
  'nochill-product-kit': ['products', 'offers', 'pitch'],
  'nochill-claim-check': ['fact-lock', '*'],
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  let entries: any[] = []
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

export async function POST(request: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  let body: any = {}; try { body = await request.json() } catch {}
  const only: string[] = Array.isArray(body?.skills) && body.skills.length ? body.skills : WANTED

  const seeded: any[] = []
  const missing: string[] = []

  for (const skill of only) {
    const base = path.join(SKILLS_DIR, skill)
    const files = await walk(base)
    if (!files.length) { missing.push(skill); continue }

    for (const f of files) {
      const rel = path.relative(base, f)
      const body = await fs.readFile(f, 'utf8')
      const slug = `${skill}/${rel}`.replace(/\.md$/, '')
      const title = (body.match(/^#\s+(.+)$/m) || [])[1] || rel
      const section = rel.toUpperCase().startsWith('SKILL') ? 'SKILL' : 'reference'

      await prisma!.skillDoc.upsert({
        where: { userId_slug: { userId: OWNER, slug } },
        create: { userId: OWNER, slug, title, path: f, body, section, tokens: Math.ceil(body.length / 4) },
        update: { title, path: f, body, section, tokens: Math.ceil(body.length / 4) },
      })
      seeded.push({ slug, section, chars: body.length })
    }
  }

  // The global CLAUDE.md is the brain this app derives its doctrine from, so it lives in the
  // system rather than only on disk. It is deliberately NOT added to any module's skill
  // bundle — at ~35k chars it would crowd out the references. The laws inside it are already
  // extracted into governance keys; this is the readable, versioned source of record.
  try {
    const brainPath = path.join(os.homedir(), '.claude', 'CLAUDE.md')
    const brain = await fs.readFile(brainPath, 'utf8')
    await prisma!.skillDoc.upsert({
      where: { userId_slug: { userId: OWNER, slug: 'global/CLAUDE' } },
      create: { userId: OWNER, slug: 'global/CLAUDE', title: 'Global CLAUDE.md — the brain', path: brainPath, body: brain, section: 'SKILL', tokens: Math.ceil(brain.length / 4) },
      update: { title: 'Global CLAUDE.md — the brain', path: brainPath, body: brain, tokens: Math.ceil(brain.length / 4) },
    })
    seeded.push({ slug: 'global/CLAUDE', section: 'SKILL', chars: brain.length })
  } catch { /* the app still works without it */ }

  await prisma!.ingestLog.create({
    data: {
      userId: OWNER, source: 'skills', target: 'skill_docs', rows: seeded.length,
      summary: `Seeded ${seeded.length} skill documents from ~/.claude/skills. Missing: ${missing.join(', ') || 'none'}`,
    },
  })

  return NextResponse.json({
    success: true,
    seeded: seeded.length,
    totalChars: seeded.reduce((a, s) => a + s.chars, 0),
    skills: only.filter((s) => !missing.includes(s)),
    missing,
    consumers: CONSUMERS,
  })
}

export async function GET() {
  const dbError = checkDatabase(); if (dbError) return dbError
  const rows = await prisma!.skillDoc.findMany({
    where: { userId: OWNER }, orderBy: { slug: 'asc' },
    select: { slug: true, title: true, section: true, tokens: true, updatedAt: true },
  })
  const bySkill: Record<string, number> = {}
  for (const r of rows) { const k = r.slug.split('/')[0]; bySkill[k] = (bySkill[k] || 0) + 1 }
  return NextResponse.json({ count: rows.length, bySkill, consumers: CONSUMERS, docs: rows })
}
