> ⛔ **FACT-LOCK 2026-09-17.** This file contained figures that are disproven or banned.
> Never copy a number out of here without checking
> `~/Desktop/NOCHILL-OS/02-INFORMATION/PROOF_BANK.csv`.
> **Never name the employer, workplace or industry.** Governing ICP:
> `~/Desktop/NOCHILL-OS/02-UNDERSTANDING/audience/U-A-007-icp-by-tier.md`

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
- **12-month target:** [⛔ REDACTED 2026-09-17]/month from products alone — ecosystem fully live, running without active selling.
- **Critical voice problem:** AI output is too polished and corporate. Missing rawness. Sounds like a LinkedIn post, not Ndivhuwo. The system must generate content that is direct, unfiltered, real-talk SA energy — not motivational speaker, not TED Talk, not watered down. If it wouldn't make someone uncomfortable to read, it's probably not NOCHILL enough.

### 🔴 THE CUSTOMER — ruled 2026-09-17. This replaces every earlier ICP.

**The creator whose income is decided by somebody else, and who finds out afterwards.**

**Two tests, both run on one sentence:**
1. **Money has moved, or money is visibly blocked.** Not follower count, not niche.
   1.2M views and R0 **qualifies**. 400 followers asking how to go viral **does not**.
2. **Does another human being appear in their fear?**
   *"Provide for my kids"* → **customer.** *"To get 0 likes"* → **traffic.**

**Four tiers:**

| Tier | Who | Their line | Pillar |
|---|---|---|---|
| **FREE R0** ⛔ | **The Beginner Aspirant** — 18–24, R0 revenue. **Content only, never sold to** | *"To get 0 likes"* | — |
| **ENTRY R350–R499** | **The Blocked** — money exists, a system holds it | *"Millions of views but I am not earning"* | OWN IT · KEEP IT |
| **CORE R1,500–R1,800** | **The Underpriced & Unreserved** — money arrives and leaks | *"I'm not sure about rates"* | PRICE IT · KEEP IT · BUILD IT ANYWAY |
| **PREMIUM $499/R9,000** 🔒 | **The Asset-Backed Contentpreneur** — had it, lost it | *"There was nobody to phone"* | OWN IT · PROVE IT |

**Pillars:** KEEP IT 30 · PRICE IT 25 · OWN IT 20 · BUILD IT ANYWAY 15 · PROVE IT 10.
One per week, five-week rotation. **PAIDS is an income model, not a pillar set.**

**The mechanism, true of all four:** *somebody else decides what they earn, and they find out
afterwards.* Meta decides eligibility, country and "originality". The agency sets the budget
before it makes contact. **That is what "Famous is not paid" means.**

> ⛔ **RETIRED:** ICP1 "Called Expert" 32–50 at R9,000–R45,000 · the ICP1/ICP2 split · the
> Sipho/Lerato personas. The Called Expert was never measured; when it was — **median age 21,
> two people over 32 out of 70, zero purchasers.**

**Governing document:** `~/Desktop/NOCHILL-OS/02-UNDERSTANDING/audience/U-A-007-icp-by-tier.md`
**Skill reference:** `~/.claude/skills/nochill-brain/references/ICP-TIERS.md`

> ⛔ **What was here, and why it was removed — 2026-09-17.**
> A two-ICP block naming **ICP 1 "Called Expert", 32–50**, with cohort pricing at
> **[⛔ REDACTED 2026-09-17]–[⛔ REDACTED 2026-09-17]** (dead — the ruled tier is **$499 / R9,000** 🔒), and a "primary proof hook"
> that **named the employer** and claimed **"[⛔ REDACTED 2026-09-17]"**.
> **Three breaches in one line:** the employer is banned in all public content (Article IV),
> [⛔ REDACTED 2026-09-17] is not in the ledger (bank-confirmed lifetime is **R453,710.37**), and the pricing was
> superseded on 2026-09-01. **Write "a full time job" or "night shifts". State no lifetime total.**

### Tone & Voice (Non-Negotiable)
- Direct. No filler. No AI slop ("delve," "certainly," "I'd be happy to").
- SA/African context first — ZAR pricing, Supabase/Vercel not AWS, WhatsApp as primary commerce channel.
- Framework-first: 80% of every AI output must apply NOCHILL protocols (R×A×C×U^B, 4E, PAIDS, Shadow Fears, 9-Step Shell). 20% is contextual adaptation.
- Proof is sacred: only use real numbers from the story bank (the S001–S020 codes are RETIRED numbering — the canonical bank is the 15-story registry in `nochill-knowledge-base/W/stories/story-bank.md`; codes are kept only so old references resolve) (R750→R100K, 780K followers, R207,879 SARS debt, R6K phone→R600K, R132,500 lost undercharging 50 brand deals, R23K affiliate day, R100K Savanna). Never fabricate outcomes. ⚠ Do NOT use "R285K SARS" — unverified. Netflix R100K: use with "from published book" attribution only.
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
    max_tokens: 3500,      // 8000 for /api/scripts (content mode); 16000 for /api/batch/generate
    // ...
  })
}
```

**Rules (non-negotiable):**
- `checkRateLimit(request)` must be the first call in every API route
- Always use `MODELS.SONNET` / `MODELS.HAIKU` / `MODELS.OPUS` from `lib/claude.ts` — never hardcode model strings
- `max_tokens` split: **8000** for content script route · **16000** for batch/generate (large JSON) · **3500** for all other routes
- No `fs.readFileSync` at runtime — knowledge files use static `import` at build time

### Knowledge base (the AI's "brain")

`lib/knowledge-base.ts` exports `buildSystemPrompt(module)` and `buildUserContextPrompt(context)`. All JSON knowledge files are statically imported at the top of that file — they are never read from disk at runtime.

```
lib/knowledge/
├── frameworks.json          # R×A×C×U^B, SEEDS, 4E, PAIDS, 9-Step Shell
├── shadow-fears.json        # 10 Shadow Fear categories
├── power-words.json         # 500+ categorised words
├── platform-rules.json      # Per-platform constraints (timing, format)
├── nochill-frameworks.json  # NOCHILL-specific ICP/framework overlays
├── nochill-120-hooks.json   # 120 example hook structures (patterns, not templates)
├── creator-dna.json         # Ndivhuwo's voice and story DNA
├── ndivhuwo-stories.json    # S001–S020 proof stories (real numbers only)
└── example-patterns.json    # Structural patterns for AI to learn from
```

`lib/prompts.ts` is a stub kept for import compatibility — do not add prompts there. All prompts live in `knowledge-base.ts`.

### Database

Prisma schema at `prisma/schema.prisma`. All models are scoped to `userId` — there are no shared/global records. Key models: `User`, `Hook`, `Script`, `Story`, `Product`, `StoryBankEntry`, `ContentCalendarPlus`, `HookBank`, `ICPPainLibrary`, `BatchPlan`, `ContentPipeline`, `ContentCard`, `ContentProgress`.

`lib/db.ts` exports `db` (the Prisma client singleton). `lib/db-helper.ts` wraps queries with graceful error handling for when the database is unavailable. API routes that touch the DB should use `db-helper.ts` helpers, not raw `db` calls, so the app degrades gracefully when Supabase is sleeping.

### Dashboard tools

Each route under `app/dashboard/` is an independent tool. They share state through `contexts/ContentContext.tsx`, which is mounted in `app/dashboard/layout.tsx`. **Important:** `ContentContext` is in-memory only — it resets on page navigation between tools. Cross-PAGE bridges (Hook Bank → Hooks, Pain Library → Scripts, etc.) use `localStorage` as the pass-through: the source writes a key, `router.push()` fires, and the destination reads + clears the key in a `useEffect`. See localStorage bridge keys below.

**Known localStorage bridge keys (all consumed on mount and immediately removed):**
- `hookBankPreload` → Hooks page (remix a saved hook)
- `painToHookPreload` → Hooks page (pain point from ICP Pain Library)
- `pendingAction` (JSON `{action, data}`) → Scripts page (hook-bank, story-bank, pain library → scripts)
- `algorithmAudiencePreload` → Hooks page
- `algorithmStoryPreload` → Scripts page
- `algorithmProductPreload` → Scripts page
- `vaultToHookGenerator` → Hooks page
- `vaultToScriptWriter` → Scripts page
- `repurposeScript` → Repurpose page
- `teleprompterScript` → Teleprompter page

ContentContext `pendingAction` state DOES work for within-session cross-tool actions (Calendar → Scripts, Fears → Hooks) where no full navigation happens.

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
| `docs/FEATURES.md` | All 45+ tools with routes and I/O |
| `docs/ARCHITECTURE.md` | Deep architecture reference |
| `docs/SOP.md` | Full system operating manual — tool-by-tool guide, frameworks, integration map, voice checklist |

---

## Teachable Knowledge Capture (Called Expert Accelerator)
We're building NOCHILL to TEACH Called Experts (ICP 1) how to do it. Capture in two layers, every session:
- **Raw receipt → `Learnings.md`** in this folder (what broke / what worked).
- **Teachable asset → the MASTER Called Expert Curriculum:** `~/Desktop/VS code/nochill-knowledge-base/CALLED-EXPERT-CURRICULUM.md`. Tag each: Stage (7-Stage) · MS/TS/SS · Framework (4E/SEEDS/PAIDS/DARES/3Cs/POSSESS) · Lesson · Steps (SOP) · Proof.
- Rule: if a Called Expert would need it to do this themselves → it's a teachable asset (Curriculum), not just a receipt (Learnings).
- Also enforced in global `~/.claude/CLAUDE.md`.
