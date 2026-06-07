# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Business & Context Rules

### About This Business
- **Company:** NOCHILL PTY LTD — trading as "No Chill in Mzansi Co." (SA-registered)
- **Owner:** Ndivhuwo Muhanelwa — alias "NoChill" | chiefmuhanelwa@gmail.com
- **Core product:** This codebase IS the product — a personal AI-powered content operating system for SA creators. 42 tools across hooks, scripts, stories, calendar, teleprompter, campaigns, analytics, and more.
- **Production URL:** https://full-content-system-nochill.vercel.app/
- **Wider ecosystem:** 34 digital products (PDFs, web tools, 1:1 sessions) in `/Users/NOCHILLGOD/Desktop/product-lab/` — separate from this app, not deployed here.
- **Business stage:** Building — products exist but revenue is not yet consistent. Pre-scale. Every feature should serve the goal of getting products live and selling.
- **#1 goal:** Sell digital products. Not brand deals. Not audience growth. Product revenue first — specifically the 34 products in the product-lab ecosystem. Everything built in this system should support that funnel.
- **12-month target:** R100K/month from products alone — ecosystem fully live, running without active selling.
- **Critical voice problem:** AI output is too polished and corporate. Missing rawness. Sounds like a LinkedIn post, not Ndivhuwo. The system must generate content that is direct, unfiltered, real-talk SA energy — not motivational speaker, not TED Talk, not watered down. If it wouldn't make someone uncomfortable to read, it's probably not NOCHILL enough.

### Target Audience (Two ICPs — always choose one)
- **ICP 1 — Called Expert** (32–50, SA professional, has unexploited expertise, wants to monetise knowledge). Language register: "your knowledge is worth more than your salary." Shadow fears: Imposter Syndrome, Generational Poverty Trap, Wrong Path Terror, Spiritual Crisis.
- **ICP 2 — Content Creator Inspirer** (18–35, aspiring creator, Instagram/TikTok/FB-first, posting daily but not earning). Language register: "you're posting every day and still broke." Shadow fears: Invisible Labour, Time Anxiety, Relationship Loss, Platform Dependency.

All AI-generated content must lock onto one ICP before writing. Never mix them in the same output.

### Tone & Voice (Non-Negotiable)
- Direct. No filler. No AI slop ("delve," "certainly," "I'd be happy to").
- SA/African context first — ZAR pricing, Supabase/Vercel not AWS, WhatsApp as primary commerce channel.
- Framework-first: 80% of every AI output must apply NOCHILL protocols (R×A×C×U^B, 4E, PAIDS, Shadow Fears, 7-Act Arc). 20% is contextual adaptation.
- Proof is sacred: only use real numbers from S001–S015 story bank (R750→R100K, 780K followers, R207,869 SARS debt, R6K phone→R600K). Never fabricate outcomes. ⚠ Do NOT use "R285K SARS" or "Netflix R100K" — both unverified.
- Ndivhuwo's signature transitions: "That's when..." / "But here's the thing..." / "You understand? Because you understand." — use these, not generic AI connectors.

### System Memory
- Always read `Learnings.md` in the project root alongside this file before starting any task.
- When a major insight, preference, or business logic constraint is uncovered during work, log it in `Learnings.md` before the session ends.
- `Learnings.md` is the living record of what has worked, what broke, and what Ndivhuwo has explicitly corrected — treat it as authoritative.

---

## Commands

```bash
npm run dev          # Start dev server (Next.js 14)
npm run build        # prisma generate + next build
npm run lint         # ESLint
npx tsc --noEmit     # Type-check only (run before AND after every change)

npm run db:push      # Push schema to Supabase (--accept-data-loss)
npm run db:migrate   # Deploy pending migrations
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:wake      # Wake a sleeping Supabase instance
npm run validate:env # Check all required env vars are set
```

There are no automated tests. Type-checking (`npx tsc --noEmit`) is the primary correctness gate — run it before and after every change.

## Architecture

**Stack:** Next.js 14 App Router · TypeScript · Prisma + Supabase (PostgreSQL) · NextAuth v4 (JWT) · Anthropic Claude API · TailwindCSS + shadcn/ui

### Route structure

- `/` — public landing page
- `/auth/signin`, `/auth/signup` — credential auth (no Google OAuth in practice)
- `/dashboard/*` — all tools, fully authenticated via `middleware.ts`
- `/api/*` — all server-side logic, also authenticated

`middleware.ts` protects every `/dashboard` and `/api` route. Public exceptions: `/`, `/auth/*`, `/api/auth/*`, and seed endpoints when called with header `x-internal-seed: 1`.

### Authentication

`lib/auth.ts` — single `CredentialsProvider`. Two paths:
1. **Owner bypass** — `OWNER_EMAIL` + `OWNER_PASSWORD` env vars, works without a database
2. **DB user** — Prisma lookup with bcrypt comparison

Session is JWT-only (`strategy: 'jwt'`). No OAuth providers active.

### AI generation pattern

Every AI API route follows this exact structure:

```ts
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request)   // MUST be first line
  if (rl) return rl
  // ... parse body, validate required fields ...
  const systemPrompt = buildSystemPrompt('hooks' | 'scripts' | 'stories' | 'pitch' | 'fears')
  const userContext = buildUserContextPrompt({ topic, platform, ... })
  const response = await anthropic.messages.create({
    model: MODELS.SONNET,  // or MODELS.HAIKU for lighter tasks
    max_tokens: 3500,      // 6000 for /api/scripts only
    // ...
  })
}
```

**Rules (non-negotiable):**
- `checkRateLimit(request)` must be the first call in every API route
- Always use `MODELS.SONNET` / `MODELS.HAIKU` / `MODELS.OPUS` from `lib/claude.ts` — never hardcode model strings
- Script routes: `max_tokens: 6000`. All other routes: `max_tokens: 3500`
- No `fs.readFileSync` at runtime — knowledge files use static `import` at build time

### Knowledge base (the AI's "brain")

`lib/knowledge-base.ts` exports `buildSystemPrompt(module)` and `buildUserContextPrompt(context)`. All JSON knowledge files are statically imported at the top of that file — they are never read from disk at runtime.

```
lib/knowledge/
├── frameworks.json          # R×A×C×U^B, SEEDS, 4E, PAIDS, 7-Act Arc
├── shadow-fears.json        # 10 Shadow Fear categories
├── power-words.json         # 500+ categorised words
├── platform-rules.json      # Per-platform constraints (timing, format)
├── nochill-frameworks.json  # NOCHILL-specific ICP/framework overlays
├── nochill-120-hooks.json   # 120 example hook structures (patterns, not templates)
├── creator-dna.json         # Ndivhuwo's voice and story DNA
├── ndivhuwo-stories.json    # S001–S015 proof stories (real numbers only)
└── example-patterns.json    # Structural patterns for AI to learn from
```

`lib/prompts.ts` is a stub kept for import compatibility — do not add prompts there. All prompts live in `knowledge-base.ts`.

### Database

Prisma schema at `prisma/schema.prisma`. All models are scoped to `userId` — there are no shared/global records. Key models: `User`, `Hook`, `Script`, `Story`, `Product`, `StoryBankEntry`, `ContentCalendarPlus`, `HookBank`, `ICPPainLibrary`.

`lib/db.ts` exports `db` (the Prisma client singleton). `lib/db-helper.ts` wraps queries with graceful error handling for when the database is unavailable. API routes that touch the DB should use `db-helper.ts` helpers, not raw `db` calls, so the app degrades gracefully when Supabase is sleeping.

### Dashboard tools

Each route under `app/dashboard/` is an independent tool. They share state through `contexts/ContentContext.tsx`, which is mounted in `app/dashboard/layout.tsx`. Cross-tool data (hooks → scripts → calendar → teleprompter) flows through this context — not through the URL or localStorage directly.

The `Navigation` component (`components/Navigation.tsx`) drives the sidebar. Adding a new tool requires: a new `app/dashboard/[slug]/page.tsx`, an entry in `Navigation.tsx`, and (if it persists data) a new Prisma model + `/api/[slug]` routes.

### Deployment

Deployed on Vercel. Production branch: `claude/nochill-web-app-26Yi8` (set in `vercel.json`). Functions are configured for 300s timeout and 1024MB memory. Region: `iad1`.

Required env vars: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OWNER_EMAIL`, `OWNER_PASSWORD`. Run `npm run validate:env` to check all are set before deploying.

## Key files

| File | Role |
|---|---|
| `WAT.md` | Project operating manual — W/A/T framework |
| `lib/knowledge-base.ts` | Central AI prompt builder — start here for any AI change |
| `lib/claude.ts` | Anthropic client + `MODELS` constants |
| `lib/auth.ts` | NextAuth config + owner bypass logic |
| `lib/rate-limit.ts` | In-memory IP rate limiter (20 req/hr default) |
| `middleware.ts` | Route protection rules |
| `contexts/ContentContext.tsx` | Cross-tool shared state |
| `prisma/schema.prisma` | Database schema |
| `docs/FEATURES.md` | All 42 tools with routes and I/O |
| `docs/ARCHITECTURE.md` | Deep architecture reference |
