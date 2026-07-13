# NoChill Content System — Full SOP
**Version:** June 2026 | **Owner:** Ndivhuwo Muhanelwa (NOCHILL PTY LTD) | **Production:** https://full-content-system-nochill.vercel.app/

---

## What This System Is

A personal AI-powered content operating system built for one person: Ndivhuwo Muhanelwa (NoChill). It is NOT a SaaS tool for the public. It is a private production environment that generates, stores, plans, and deploys content using Ndivhuwo's proprietary frameworks, proof stories, and brand DNA.

**The system does one job:** turn a topic or idea into a fully compliant NOCHILL piece of content — hook, script, story, batch plan — that sounds exactly like Ndivhuwo wrote it and follows all 15 content protocols from Section 13.

**Stack:** Next.js 14 App Router · TypeScript · Prisma + Supabase (PostgreSQL) · NextAuth v4 (JWT) · Anthropic Claude API (Sonnet + Haiku) · TailwindCSS + shadcn/ui · Deployed on Vercel

---

## How to Log In

1. Go to https://full-content-system-nochill.vercel.app/
2. Click **Get Started** or go to `/auth/signin`
3. Enter: `OWNER_EMAIL` + `OWNER_PASSWORD` (from `.env.local`)
4. You land on the Dashboard

There is one account. No public registration. No Google OAuth. The auth is owner-bypass — it works even if the database is sleeping.

---

## The Dashboard

After login, you see the main dashboard at `/dashboard`. It shows:
- **Command Palette** (⌘K) — instant search across all tools
- **Recent Activity** — last 3 hooks and 2 scripts you generated
- **Tool grid** — every tool as a clickable card

The **sidebar navigation** is always visible on desktop. On mobile, tap the hamburger menu (top-left). All tools are accessible from both.

---

## The AI Brain — How It Works

Every AI output runs through the same knowledge stack, in this order:

1. **Identity layer** — who Ndivhuwo is, NOCHILL PTY LTD, brand voice, proof numbers
2. **ICP lock** — which audience is being targeted (ICP 1: Called Expert / ICP 2: Content Creator Inspirer)
3. **Framework injection** — R×A×C×U^B, 7-Act arc, SEEDS, PAIDS, 4E, 10 Shadow Fears
4. **Sentence architecture** — 9 micro-patterns from the published books (short declarative, repetition, present tense for past scenes, date+amount+event, etc.)
5. **120-hook training bank** — few-shot examples that teach pattern, not template copying
6. **Pain Priority Matrix** — 7 ranked audience pains (Monetisation Confusion #1 at 0.84)
7. **Proof story bank** — S001–S020, real numbers only (R750 first deal, R207,879 SARS debt, R23K affiliate day, etc.)
8. **Section 13 compliance** — 15-point checklist run on every output before delivery

The AI NEVER fabricates numbers. If it reaches for a hypothetical, it violates the system prompt rules. If output sounds like a LinkedIn post, it has drifted — that is the #1 failure mode to catch.

**ICP Rule (non-negotiable):** Every piece of content must lock onto ONE ICP before writing. The ICP gate appears at the top of every form — set it first, always.

---

## Tool-by-Tool Reference

### 1. Hook Generator (`/dashboard/hooks`)
**What it does:** Generates 6–10 hooks for any topic using R×A×C×U^B formula + 120-hook pattern bank.

**How to use:**
1. Set ICP (Called Expert or Content Creator Inspirer) — gold border field at the top
2. Enter topic (what the content is about)
3. Select platform, duration, shadow fear, awareness level, hook type
4. Click Generate
5. Rate hooks, copy to clipboard, save to Hook Bank, or send to Batch Planner

**What the AI does:** Runs R×A×C×U^B reasoning BEFORE writing each hook (Relevance → Awareness → Clarity → Unique → Broadened). This is pre-generative reasoning — the hook is an argument, not a template.

**Powered by:** Claude Haiku (3–4× faster than Sonnet for short structured JSON)

**Saves to:** `Hook` table in Supabase

**Cross-tool bridges:**
- "Save to Hook Bank" → stores in `HookBank` table
- "Use in Script" → pre-fills Script Writer with the hook text

---

### 2. Script Writer (`/dashboard/scripts`)
**What it does:** Generates full 9-Step NOCHILL Signature Shell scripts for Instagram Reels, TikTok, YouTube Shorts, and long-form content. Also has a 10-Step Sales Framework mode for product selling scripts.

**9-Step Shell sequence (non-negotiable order):**
1. Hook — R×A×C×U^B, 70%+ emotional intensity
2. Introduce Myself — who I am, one credibility number
3. Problem — [style template applies here]
4. Rehook — pull them back in
5. Personal Story — real proof from the bank
6. Rehook — second pattern interrupt
7. Solution — the named system
8. Cost of Not Acting — the consequence
9. CTA — single clear action

**7 script templates:**
- Never Ever (contrast authority)
- Important vs (priority reframe)
- Don't Do This (warning + rescue)
- Pure Story (emotional anchor)
- Revelation (mindshift)
- How-To (educational value)
- Social Proof (proof cascade)

**How to use:**
1. Set ICP first (gold border selector)
2. Enter your idea/topic
3. Choose script template
4. Select platform, shadow fear, story type, villain (optional), product (optional)
5. Click Generate
6. View in **Words Only** mode (default — clean teleprompter text) or **Full Script** mode (director notes included)
7. Copy, send to Teleprompter, send to Repurpose, save to library

**What the AI does:** Runs Section 13 compliance check internally. Generates `fullScript` (with direction notes) AND `cleanScript` (teleprompter-ready) simultaneously.

**Powered by:** Claude Sonnet (max_tokens: 8000 — scripts are large JSON)

**Saves to:** `Script` table in Supabase

**Cross-tool bridges:**
- "Send to Teleprompter" → pre-fills teleprompter with clean script
- "Repurpose" → sends script to Repurpose tool for multi-format breakdown
- "Send to Calendar" → adds to Content Calendar Plus
- Hook Bank "Use in Script" → pre-fills the idea field with a saved hook

---

### 3. Storytelling Engine (`/dashboard/storytelling`)
**What it does:** Generates structured proof stories using NOCHILL's Before/After transformation arc. The AI produces a complete story with hook, before state, turning point, after state, lesson, and CTA.

**How to use:**
1. Enter the core message or topic
2. Select story duration (60s / 90s / 3min / 5min)
3. Click Generate
4. Edit the story in-place using the Edit Story button
5. Save to Story Library, Save to Story Bank, or Use in Script

**Session restore:** The last generated story is saved to sessionStorage and restored on page reload. You never lose your last output.

**Edit mode:** Click "Edit Story" → full textarea appears with the story content → edit freely → "Save Edits" (updates DB if already saved) or "Cancel".

**Powered by:** Claude Sonnet

**Saves to:** `Story` table in Supabase

**Cross-tool bridges:**
- "Use in Script" → sends story to Script Writer as context
- "Save to Story Bank" → stores in `StoryBank` table for the story bank tool

---

### 4. Batch Planner (`/dashboard/batch-planner`)
**What it does:** Generates a 30-day content plan (or custom length) in one shot. Each day gets a topic, hook, platform, SEEDS stage, ICP angle, shadow fear, and CTA. The plan follows the NOCHILL weekly arc structure.

**SEEDS stage mapping:**
- Day 1 (Signal) — identity hook, prove you exist
- Days 2–5 (Engagement) — entertainment + relatability, no selling
- Days 6–8 (Education) — system/framework reveal, authority
- Days 9–10 (Decision) — social proof + offer introduction
- Days 11+ (Success) — testimonials, transformation, close

**How to use:**
1. Enter niche, series name, lead magnet, goal, platform
2. Click Generate Plan
3. View the 30-day plan (each day is an expandable card)
4. Click any day → "Open Script Writer" to immediately write that day's script
5. "Push All to Pipeline" — sends entire plan to the Pipeline Board for production tracking
6. Save the plan for later

**Powered by:** Claude Sonnet (max_tokens: 16000 — large JSON array)

**Saves to:** `BatchPlan` table in Supabase

**Cross-tool bridges:**
- "Open Script Writer" per day → passes ICP, shadow fear, villain, platform, template to Script Writer
- "Push All to Pipeline" → creates Pipeline entries for every post

---

### 5. Content Calendar Plus (`/dashboard/content-calendar-plus`)
**What it does:** A scheduling calendar where you plan which posts go out on which dates. Has both calendar grid view and list view.

**How to use:**
1. Toggle between Grid and List view (two-button group, top-right)
2. Click a date (grid) or "+ Add Entry" (list) to create a post slot
3. Fill in: title, platform, hook, SEEDS stage, ICP, shadow fear, template
4. Save entry
5. "Push to Pipeline" — single-entry push to Pipeline Board
6. "Write Script" — opens Script Writer pre-filled with entry details

**Saves to:** `ContentCalendarPlus` table in Supabase

---

### 6. Teleprompter (`/dashboard/teleprompter`)
**What it does:** A full-screen scrolling teleprompter for recording scripts. Converts any script into breathing-marked, clean reading text.

**How to use:**
1. Paste your script OR use "Send to Teleprompter" from Script Writer (auto-fills)
2. Set scroll speed (1–10)
3. Set font size (16px–48px)
4. Click Start — full screen scrolls the script
5. Breathing markers (`|`) are added automatically at natural pause points
6. Direction notes `[DIRECTION]` and `[YOU]:` prefixes are stripped automatically

**Note:** Always uses the clean script version (no director notes).

---

### 7. Repurpose / Resheet (`/dashboard/repurpose`)
**What it does:** Takes a full script and breaks it into multiple content formats: short clips, carousel posts, Twitter/X thread, LinkedIn post, and email sequence.

**How to use:**
1. Paste your script OR use "Repurpose" from Script Writer (auto-fills)
2. Select which formats you want (checkboxes)
3. Click Repurpose
4. Copy each format individually

**Powered by:** Claude Sonnet via `/api/repurpose/generate`

---

### 8. Content Studio (`/dashboard/content-studio`)
**What it does:** A three-stage Kanban board tracking your content through production: Planned → Shot → Published.

**Three tabs:**
- **Planned** — ideas and scripts queued for filming
- **Shot** — footage recorded, in editing
- **Published** — live content with performance metrics (views, likes, comments, shares, engagement rate)

**How to use:**
1. Add items to Planned as you generate hooks/scripts
2. Move to Shot when you film
3. Move to Published when content goes live, then track metrics

**Storage note:** Content Studio uses browser localStorage. Data persists across sessions in the same browser but does not sync across devices. This is intentional for the current build — a full DB migration is scoped for a future release.

---

### 9. Pipeline Board (`/dashboard/pipeline`)
**What it does:** A Kanban production board for tracking content from ideation through publishing. Columns: Idea → Hook Ready → Script Ready → Filmed → Edited → Scheduled → Published.

**How to use:**
1. Cards are created automatically when you "Push to Pipeline" from Batch Planner or Calendar
2. Drag cards between columns as content progresses
3. Click a card to edit details, add notes, or delete
4. "Send to Teleprompter" from Pipeline → pre-fills teleprompter with the script

**Saves to:** `ContentPipeline` table in Supabase

---

### 10. Hook Bank (`/dashboard/hook-bank`)
**What it does:** A searchable library of all saved hooks. Filter by hook type, platform, audience level, shadow fear, favorite status.

**Actions per hook:**
- **Sparkles (purple)** — Remix in Hooks Generator: pre-fills the hooks tool with this hook for variation generation
- **Arrow (blue)** — Use in Script Writer: sends hook to Script Writer as the script's opening hook
- **Heart** — mark as favorite
- **Edit** — edit hook details inline
- **Trash** — delete

**Saves to:** `HookBank` table in Supabase

---

### 11. Story Bank (`/dashboard/story-bank`)
**What it does:** A library of Ndivhuwo's proof stories from S001–S020 and any new entries added. Each story has a before state, after state, timeframe, metrics, and use cases.

**Actions per story:**
- **Use in Script** — sends story content to Script Writer as context
- **Heart** — mark as favorite
- **Edit** — edit story details
- **Trash** — delete

**Saves to:** `StoryBank` table in Supabase

---

### 12. ICP Pain Library (`/dashboard/icp-pain-library`)
**What it does:** A database of audience pain points mapped to shadow fears, emotional triggers, objections, product matches, and hook angles. Built from the Pain Priority Matrix data (1,643 respondents).

**Actions per pain point:**
- **TrendingUp (purple)** — Generate Hook: opens Hooks Generator pre-filled with this pain as the topic + shadow fear
- **Target (blue)** — Generate Script: opens Script Writer pre-filled with this pain as context
- **Heart** — mark as favorite
- **Edit** — edit pain point details
- **Trash** — delete

**Filter by:** Audience level, pain category, shadow fear, favorite status

**Saves to:** `ICPPainLibrary` table in Supabase

---

### 13. Fear Analyzer (`/dashboard/fears`)
**What it does:** Analyzes content for which of the 10 NOCHILL Shadow Fears it activates. Scores each fear's presence and gives an overall fear activation percentage.

**10 Shadow Fears:**
1. SF1 — Wasted Life (irrelevance)
2. SF2 — Generational Poverty Trap
3. SF3 — Wrong Path Terror (sunk cost)
4. SF4 — Spiritual Crisis (disobedience)
5. SF5 — Invisible Labour (unseen work)
6. SF6 — Time Anxiety (running out)
7. SF7 — Relationship Loss (isolation)
8. SF8 — Imposter Syndrome (fraud feeling)
9. SF9 — Platform Dependency (algorithm control)
10. SF10 — Legacy Void (no inheritance)

**How to use:**
1. Paste any content (hook, script, caption)
2. Click Analyze
3. See fear scores + which fears are activated
4. "Generate Hook Targeting This Fear" → sends to Hooks Generator

**Powered by:** Claude Sonnet

---

### 14. Products (`/dashboard/products`)
**What it does:** Library of all digital products from the NOCHILL ecosystem. Track product details, pricing, status, and which scripts/hooks should promote them.

**Saves to:** `Product` table in Supabase

---

### 15. My Algorithm (`/dashboard/my-algorithm`)
**What it does:** Analyzes your audience, content pillars, and posting patterns. Produces a personalized algorithm score and content strategy recommendations.

---

### 16. Campaigns (`/dashboard/campaigns`)
**What it does:** Track brand deal campaigns — deliverables, rates, timelines, brand contacts. Essential for managing the deals side of the business.

---

### 17. Analytics (`/dashboard/analytics`)
**What it does:** Cross-platform content performance overview. Import metrics from Instagram, TikTok, YouTube, Facebook. Spot top-performing content by engagement rate.

---

### 18. Content Progress (`/dashboard/content-progress`)
**What it does:** Tracks individual content pieces from idea to published with milestone checkpoints.

---

### 19. Revenue Tracker (`/dashboard/revenue`)
**What it does:** Log income by PAIDS stream (Products, Ads & Affiliates, Information, Deals, Services). Track monthly totals toward the R100K/month target.

---

### 20. Vault (`/dashboard/vault`)
**What it does:** A master content archive. Stores every generated hook, script, story with tags and search. The long-term memory of what's been created.

---

## Cross-Tool Integration Map

The tools are connected. Here's the full flow:

```
ICP Pain Library ──────► Hooks Generator ──────► Hook Bank
                    │                        │
                    ▼                        ▼
                Scripts ◄────── Batch ◄── Story Bank
                    │           Planner
                    ▼
               Storytelling ──► Story Bank ──► Script Writer
                    │
                    ▼
              Teleprompter ◄── Pipeline ◄── Calendar Plus
                    │               │
                    ▼               ▼
               Repurpose    Content Progress
```

**Key bridge patterns (how data moves between tools):**
- Hook Generator → Script Writer: ContentContext pendingAction (same session) or localStorage('pendingAction')
- Hook Bank → Hooks Generator: localStorage('hookBankPreload')
- Hook Bank → Script Writer: localStorage('pendingAction')
- Story Bank → Script Writer: localStorage('pendingAction')
- ICP Pain Library → Hooks Generator: localStorage('painToHookPreload')
- ICP Pain Library → Script Writer: localStorage('pendingAction')
- Script Writer → Teleprompter: localStorage('teleprompterScript')
- Script Writer → Repurpose: localStorage('repurposeScript')
- Batch Planner → Script Writer: ContentContext pendingAction (in-session)
- Batch Planner → Pipeline: direct API POST per batch item
- Calendar Plus → Pipeline: direct API POST single entry
- Calendar Plus → Script Writer: ContentContext pendingAction

---

## The NOCHILL Frameworks (Embedded in Every Output)

### R×A×C×U^B — Hook Formula
Every hook must be:
- **R**elevant — speaks to a real, felt pain in the audience's life right now
- **A**wareness-matched — meets them at their current level of knowledge
- **C**lear — no jargon, no vagueness, no "tips and tricks"
- **U**nique — angle they haven't seen before
- **B**roadened — widens the appeal beyond a niche subset

The AI reasons through each letter BEFORE writing. The hook is an argument, not a template.

### 9-Step NOCHILL Signature Shell — Script Structure
Hook → Introduce Myself → Problem → Rehook → Personal Story → Rehook → Solution → Cost of Not Acting → CTA

Every script follows this in order. No skipping steps. No reordering.

### SEEDS — Sales Pipeline
Signal → Engagement → Education → Decision → Success

Each piece of content belongs to a SEEDS stage. The Batch Planner maps this explicitly by day.

### 4E — Content Mix
Educate : Entertain : Encourage : Earn = 3:3:3:1

For every 9 pieces of free value content, 1 is an offer/sales post. Never reverse this ratio.

### PAIDS — Income Streams
Products · Ads & Affiliates · Information · Deals · Services

The system is designed to build content that feeds all 5 streams, with Products as the primary target.

### Section 13 — 15-Point Compliance Checklist
Every AI output is internally checked against all 15 points before delivery. If the output violates any point, the AI is expected to self-correct. Points include: ICP lock, proof story cited, framework applied, villain named, emotional arc present, CTA exists, SA context preserved, voice compliance (no LinkedIn energy), and more.

### Pain Priority Matrix (from 1,643 SA creator survey respondents)
1. Monetisation Confusion — 0.84 (LEAD WITH THIS unless topic dictates otherwise)
2. Niche & Content Clarity — 0.76
3. Audience Growth Stagnation — 0.73
4. Fear & Imposter Syndrome — 0.72
5. Mentorship & Isolation — 0.70
6. Tech & Tools Confusion — 0.67
7. Consistency & Systems — 0.67

When a topic could address multiple pains, the highest-ranked pain gets prioritised.

---

## Data Persistence Model

| Tool | Storage | Persists Across Logins? |
|------|---------|------------------------|
| Hooks | Supabase DB | Yes |
| Scripts | Supabase DB | Yes |
| Storytelling (last output) | sessionStorage | Browser session only |
| Storytelling (saved) | Supabase DB | Yes |
| Batch Plans | Supabase DB | Yes |
| Pipeline | Supabase DB | Yes |
| Hook Bank | Supabase DB | Yes |
| Story Bank | Supabase DB | Yes |
| ICP Pain Library | Supabase DB | Yes |
| Content Calendar Plus | Supabase DB | Yes |
| Content Studio | localStorage | Browser only |
| Products | Supabase DB | Yes |
| Revenue | Supabase DB | Yes |

**Note on Supabase:** The free-tier Supabase project sleeps after inactivity. If the DB is unavailable, all tools degrade gracefully (they show empty states, not error crashes). Wake it at supabase.com → your project → click Restore. After waking, run `npm run db:wake` locally to confirm connection.

---

## Deployment

**Production URL:** https://full-content-system-nochill.vercel.app/
**Production branch:** `claude/nochill-web-app-26Yi8` (NOT main)
**Platform:** Vercel (region: iad1, timeout: 300s, memory: 1024MB)

**To deploy:**
```bash
/Users/NOCHILLGOD/.npm-global/bin/vercel --prod
```
(Use the authenticated CLI at this exact path — the system CLI at a newer version fails auth)

**Required environment variables:**
```
ANTHROPIC_API_KEY
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
OWNER_EMAIL
OWNER_PASSWORD
```

**Before every deploy:** Run `npx tsc --noEmit` — zero errors required. There are no automated tests; TypeScript is the correctness gate.

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Failed to parse script response" | AI returned literal newlines inside JSON string | repairJSON() function in scripts/page.tsx handles this with stateful character parser |
| Supabase connection refused | Free tier DB is sleeping | Go to supabase.com, restore project, then retry |
| "Not authorized" on vercel --prod | Using wrong CLI version | Use `/Users/NOCHILLGOD/.npm-global/bin/vercel --prod` |
| Changes not visible after deploy | Browser cache | Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows) |
| Batch plan JSON truncated | Output too long for token budget | Already fixed: compact inline system prompt + graceful partial-array recovery |
| Cross-tool data not transferring | ContentContext is in-memory only | All cross-page bridges use localStorage — check the correct key name |

---

## Voice Compliance Test

Before publishing ANY AI-generated output, run it through this checklist:

- [ ] Does it sound like a LinkedIn post? → REJECT. Too polished.
- [ ] Does it start with "I want to..." or "Today I'm going to..."? → REJECT. Too soft.
- [ ] Does it end with "I hope this helps"? → REJECT. Too passive.
- [ ] Does it contain "delve", "certainly", "leverage", "synergy"? → REJECT. AI slop.
- [ ] Does it use a hypothetical ("imagine a creator who...")? → REJECT. Use a real S001–S020 story.
- [ ] Does it have a specific rand amount + specific date + specific outcome? → MUST HAVE.
- [ ] Does it make someone uncomfortable to read? → GOOD. That's NOCHILL energy.
- [ ] Would Ndivhuwo send this as-is, or would he rewrite it? → Only send if the answer is "send as-is."

---

## The Two ICPs — Quick Reference

**ICP 1 — Called Expert**
- Age: 32–50
- Profile: SA professional, specialist, academic with unexploited expertise
- Pain: Knowledge worth more than salary but trapped in employment
- Language: "your knowledge is worth more than your salary"
- WTP: R9,000–R45,000
- Framework: POSSESS (7-step GPS, Deuteronomy 1:6–46), 3Cs, 7-Stage Transformation
- Product: Called Expert Accelerator PRO (R18,000 PIF / R6,500×3)

**ICP 2 — Content Creator Inspirer**
- Age: 18–35
- Profile: Aspiring SA creator, posting daily but not earning
- Pain: Working hard with nothing to show financially
- Language: "you're posting every day and still broke"
- WTP: R49–R1,500
- Framework: 4E, SEEDS, PAIDS
- Product: Entry PDFs (R250–R1,997), digital product bundle

**Rule:** Pick ONE ICP before generating ANY content. Set it in the ICP gate at the top of every form. Never mix both in a single output.

---

## Who Built This & Why

Built by Ndivhuwo Muhanelwa (NoChill) — founder of NOCHILL PTY LTD, Contentpreneur personal brand, CHKPLT coaching platform, and Content Creator Hub digital store.

The system exists because generic AI tools produce generic content. This one is wired with 8 years of real SA creator data: proof stories with exact rand amounts, real audience research from 1,643 respondents, a published book's worth of voice patterns, and 120 hook examples trained from actual content that built a 3M+ audience.

The goal is R100K/month from digital products alone. This system is how that happens without spending all day writing manually.

---

*Last updated: June 2026 | For technical architecture details see `docs/ARCHITECTURE.md` | For all 42+ tools with routes and I/O see `docs/FEATURES.md`*
