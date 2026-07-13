# Persistent Learning & Business Memory

Read this alongside `CLAUDE.md` before every task. Add new entries as they are discovered — never wait until the end of a session.

---

## Kallaway Storytelling Techniques Integrated Into Real Generators (2026-07-11)

A prior pass (in `nochill-knowledge-base/`, outside this repo) studied 16 Kallaway transcripts and produced a storytelling system. This entry is that system reaching the actual product — `lib/knowledge-base.ts` and the hooks/scripts generation routes — not just documentation.

**Added to `lib/knowledge-base.ts`** (as module-level consts, interpolated into the `buildSystemPrompt()` template literal — this file's existing sections are hardcoded inline, NOT sourced from the bottom JSON getters, so new content had to follow that same pattern to actually reach generation):
- `EXODUS_ENGINE` — 4-phase Called-Expert macro arc (Egypt/But/Therefore/Promised Land), inserted after the 7-Stage Story Arc.
- `THE_DANCE` — formalized the "But/Therefore Dance" rule (previously one underspecified line buried in the scripts route) into a checkable law: every beat transition uses BUT or THEREFORE, never "and then." Inserted after Rehooking.
- `ILLUSION_OF_NOVELTY` — added as "Method 3" under the R×A×C×U^B "U — Unique" section, specifically for "boring but real" ICP1 content (tax/compliance).
- `NINE_HOOK_FORMATS` — a content-genre taxonomy, distinct from the existing 4 C-component hook types.
- Pattern 10 ([SHORT]/[LONG] rhythm markup) added to the existing Sentence Architecture section.
- `validateAgainstPrinciples()` extended with a real Dance-connector check (flags 3+ consecutive sentences with no BUT/THEREFORE or equivalent) — confirmed via repo-wide grep this function is called nowhere yet, so the extension is safe but currently inert; a future task could wire it into `app/dashboard/scripts/page.tsx`'s post-stream parse.
- Fixed a second 7-step-vs-9-step contradiction found inside `knowledge-base.ts` itself (the `scripts:` module block referenced the legacy 7-part Script Architecture Table instead of the actual 9-Step Shell).

**Fixed a real bug in `app/api/scripts/generate/route.ts`:** the route sent the model ~168 lines of a dead "7-Act Retention Formula" prompt block (declared dead in `WAT.md` since the 9-Step Shell replaced it) immediately before instructing it to output in the 9-Step Shell format — active, wasted-token contradiction. Removed both dead blocks (the main 7-Act structure and a second "RETENTION DEVICE DEPLOYMENT STRATEGY"/`REMEMBER` block that sandwiched the valid JSON schema between two contradictory instruction sets), relocated the still-valid Ubuntu Principles, and replaced with a condensed 9-Step Shell pointer + Dance/rehook/rhythm instructions. Net prompt length dropped. Also condensed `systemPromptWithStories` (was re-injecting R×A×C×U^B/4E/PAIDS/4-principles in full even though `buildSystemPrompt('scripts', icp)` already supplies all of it) down to just the dynamic story-rotation logic.

**Extended `app/api/hooks/generate/route.ts` schema:** added `onScreenText` per hook (completes the 3-part visual/text/spoken alignment check alongside existing `verbal`/`visual`), `hookFormat` (1 of the 9) and `shockScore` to the `compliance`/`section13` self-graded block, and a matching `warnings[]` check for missing `onScreenText`.

**UI:** `app/dashboard/hooks/page.tsx` — new render block for `onScreenText`, `Hook Format` added to the compliance metadata grid. `app/dashboard/teleprompter/page.tsx` — added `getLineRhythm()`/`stripRhythmTag()` alongside the existing `isRehookLine()` pattern; `[SHORT]` lines render tight/punchy, `[LONG]` lines get more breathing room, lighter weight, and a blue-grey accent bar distinct from the gold REHOOK bar.

**Docs:** `docs/FRAMEWORKS.md` — added Frameworks 19-22 (Exodus Engine, The Dance, Illusion of Novelty, 9 Hook Formats) plus a bundled backfill of Frameworks 23-25 (HOOKS filter, AFRICA Method, LEGACY System — all three already lived in `knowledge-base.ts` but were never documented, a pre-existing gap fixed in the same pass). `WAT.md` framework count updated 18→25, dead-formula note updated to reflect the actual code removal.

**Explicitly deferred (flagged, not silently skipped):** 6 routes with duplicated inline hook science (`captions/generate`, `competitor/analyze`, `trends/suggest`, `trends/fetch`, `analytics/insights`, `formulas/generate`) still don't pull from the updated `knowledge-base.ts`; 3 divergent proof-story banks (`ndivhuwo-stories.json` slug-keyed, the S001-S020 table in `knowledge-base.ts`, `docs/STORY_BANK.md`'s S01-S15) remain unreconciled; a standalone Hook Grader tool (paste-a-hook, get a real numeric score) is confirmed genuinely buildable but is a new dashboard tool, not a prompt edit — natural next project.

**Verification:** `npx tsc --noEmit` clean after every file edit. `grep -n "ACT "` on the scripts route returns zero hits (no leftover dead-structure references). Grepped all touched files for known fact-conflict terms (P20 Pro, 285,000, 207,869) — clean.

## Cross-Project Fact Sweep (2026-07-11)

Fixed live (non-warning) instances of the recurring R285,000 SARS error and the wrong "P20 Pro / 2018 / borrowed" phone story, found while cross-checking this project against the "Ndivhuwo Twin" build in `nochill-knowledge-base`:
- `docs/BRAND_GUIDELINES.md` — "R285K SARS bill" in a proof-point list → corrected to R207K.
- `docs/FRAMEWORKS.md` — 4 live table/list entries treating R285K as real proof → corrected to R207K.
- `docs/STORY_BANK.md` — 4 instances of the wrong phone story → "borrowed" → "from ATNS salary", "Huawei P20 Pro" → "Huawei", "2018" → "2014".
- `lib/knowledge/ndivhuwo-stories.json` — same phone-story fix in a snippet field; re-validated as syntactically correct JSON afterward.
- `CLAUDE.md`, this file's earlier entries, `docs/NOCHILL-CREDIBILITY-REPORT.md`, and `lib/knowledge-base.ts` already had the R285K figure correctly flagged as a banned/unverified figure — left untouched, they were already right.

## Owner Interview — Captured 2026-06-08

Answers that shaped the initial setup of this workspace:

| Question | Answer |
|---|---|
| #1 goal from this system | Sell my own digital products (product-lab ecosystem) |
| Business stage | Building — not yet earning consistently |
| Biggest friction with AI output | Doesn't sound like me — too polished, too corporate, missing rawness |
| 12-month vision | R100K/month from products alone, running without active selling |
| What's wrong with the AI voice | Too safe, watered down, sounds like LinkedIn not Mzansi |

These answers are the foundation for every preference below. Update them if priorities shift.

---

## Core Business Rules

- **Product revenue is the primary objective.** Every feature, tool, and AI output should ultimately serve the goal of selling digital products. Brand deals and audience growth are secondary.
- **R100K/month from products is the 12-month target.** Features that don't contribute to this should be deprioritised. When suggesting improvements, ask: does this help a product sell?
- **Building stage, not scaling stage.** Revenue is not yet consistent. Prioritise getting existing products live and converting over building new features.
- Company is **NOCHILL PTY LTD** — trading as "No Chill in Mzansi Co." Owner: Ndivhuwo Muhanelwa (chiefmuhanelwa@gmail.com). SA-registered. ZAR only.
- This app is a **personal content OS** — it is not a SaaS product for the public. The owner logs in with `OWNER_EMAIL` + `OWNER_PASSWORD`. Everything is scoped to a single authenticated user.
- There are **two ICPs** and every AI output must lock onto one before writing: **ICP 1** (Called Expert, **32–50**, unexploited expertise) or **ICP 2** (Content Creator Inspirer, **18–35**, posting but not earning). Never mix them in one output.
- **Proof numbers are sacred.** Only use real figures from S001–S020 (e.g. R750→R100K, 780K followers, R207,879 SARS debt, R6K phone→R600K). ⚠ NEVER use "R285K SARS" (unverified). Netflix R100K: use with "from published book" attribution only. Never fabricate outcomes.
- The **80/20 framework rule** is non-negotiable for all AI-generated content: 80% must apply NOCHILL protocols (R×A×C×U^B, 4E, PAIDS, Shadow Fears, 7-Act Arc). 20% is contextual adaptation. No generic AI output.
- **WhatsApp is the primary SA commerce channel.** Any feature touching payments, outreach, or selling should account for WhatsApp-first behaviour — not email-first assumptions.
- The **wider product ecosystem** (34 digital products — PDFs, web tools, 1:1 sessions) lives in `/Users/NOCHILLGOD/Desktop/product-lab/`. It is separate from this app and not deployed here. Do not conflate the two.
- Ndivhuwo's **signature voice transitions**: "That's when..." / "But here's the thing..." / "You understand? Because you understand." — use these in AI outputs, not generic connectors.
- Production URL: https://full-content-system-nochill.vercel.app/ — deployed on Vercel, production branch is `claude/nochill-web-app-26Yi8` (not `main`).

---

## Technical & Coding Preferences

- **Type-check before and after every change:** `npx tsc --noEmit`. There are no automated tests — this is the primary correctness gate.
- `checkRateLimit(request)` must be the **first line** of every API route handler. No exceptions.
- Always use `MODELS.SONNET` / `MODELS.HAIKU` / `MODELS.OPUS` from `lib/claude.ts`. **Never hardcode model strings.**
- `max_tokens` split: scripts route = **8000**, batch/generate = **16000** (large structured JSON), all other AI routes = **3500**. Do not raise non-batch/script routes.
- **Batch generator: never use `buildSystemPrompt('scripts')`** — it consumes ~4000-6000 input tokens, leaving insufficient output budget for 30-post JSON. Use a compact inline system prompt (~200 tokens) specific to batch generation.
- **Add brevity rules to any prompt generating large JSON arrays** ("all fields max 20 words") — prevents truncation mid-array that causes `JSON.parse` to throw "Expected ',' or ']' after array element".
- **No `fs.readFileSync` at runtime.** All knowledge files in `lib/knowledge/` must be statically imported at the top of `knowledge-base.ts` — bundled at build time, not read from disk at runtime (Vercel serverless limitation).
- All prompts live in `lib/knowledge-base.ts` (`buildSystemPrompt`). `lib/prompts.ts` is a **stub for import compatibility only** — do not add prompts there.
- DB access in API routes must go through `lib/db-helper.ts` helpers (graceful degradation when Supabase sleeps), not raw `db` calls from `lib/db.ts`.
- All Prisma models are **user-scoped** (`userId` on every record). There are no shared/global records.
- Cross-tool state flows through `contexts/ContentContext.tsx` — not URL params or localStorage. Adding a new tool requires: `app/dashboard/[slug]/page.tsx` + `Navigation.tsx` entry + (if persisting data) Prisma model + `/api/[slug]` routes.
- SA stack defaults: **Supabase** for PostgreSQL, **Vercel** for hosting, **Paystack** for payments. Not AWS, not Stripe, not Firebase.

---

## Voice Calibration Rules
*(Specific to AI-generated content — this is the #1 friction point)*

- The AI output is currently **too polished and corporate.** This is the primary voice failure mode. Before finalising any generated content, ask: would this get past a LinkedIn editor? If yes, it's probably too safe.
- **Raw and direct beats refined and safe every time.** NOCHILL content should make someone feel like Ndivhuwo is talking directly at them — not presenting to them.
- **No motivational speaker energy.** Avoid: "You've got this," "The journey starts with one step," "Believe in yourself." These are banned phrases.
- **Real stories > generic examples.** If the AI reaches for a hypothetical ("imagine a creator who..."), replace it with a real S001–S020 story. Hypotheticals signal the voice is drifting.
- **SA vernacular is natural, not performative.** Don't force slang, but don't scrub it either. "Mzansi," "bra," "heita" — use them where they fit naturally.
- When reviewing AI output for voice compliance, the test is: **would Ndivhuwo send this as-is, or would he rewrite it?** If the answer is rewrite — flag the specific lines and explain why.

---

## Disliked Approaches (Never-Do Rules)

- **Never use AI slop language** — ban list: "delve," "certainly," "I'd be happy to," "absolutely," "of course," "let me know if you need anything else," "feel free to," "leverage," "synergy," "utilize." Write like a human, not a chatbot.
- **Never fabricate proof numbers or outcomes.** If real data doesn't exist for a claim, omit the claim entirely. Don't estimate. Don't say "approximately."
- **Never add unrequested features, abstractions, or cleanup** during a bug fix or targeted change. Do exactly what was asked. Three similar lines are better than a premature abstraction.
- **Never mix the two ICPs** in a single content output. Pick one, stay locked.
- **Never push to `main`** expecting a Vercel production deploy — the production branch is `claude/nochill-web-app-26Yi8`.
- **Never add comments explaining what code does** — only add a comment when the WHY is non-obvious (hidden constraint, workaround for a specific bug, subtle invariant). Well-named functions and variables replace explanation comments.
- **Never add error handling for scenarios that can't happen.** Only validate at real system boundaries (user input, external APIs). Don't add fallbacks for internal code that is guaranteed by the framework.
- **Never hardcode model strings** like `"claude-sonnet-4-6"` in routes — always use `MODELS.*` from `lib/claude.ts` so model updates happen in one place.
- **Never prompt the user to run `/clear` or recaps past context** — keep responses tight and pick up from where work left off without narrating what happened.

---

## Session 2026-06-09 — MASTER-INTELLIGENCE Brain Injection

### What was done
The AI brain received the biggest single upgrade since the system was built. Files changed: `lib/knowledge-base.ts` + `lib/knowledge/creator-dna.json`.

**New in system prompt (knowledge-base.ts):**
1. **Sentence Architecture section** — 9 micro-patterns from the published books. This is what makes the AI write like Ndivhuwo at the SENTENCE level, not just at the framework level. Includes: short declarative → context; repetition for weight; present tense for past scenes; date+amount+event; question as pivot; admission before flex; callback loops; time-chunk closing; scripture closer pattern.
2. **Full signature phrase bank** — "You're too quiet." / "Boom, sanamabish." / "That's why you're broke." etc.
3. **Data section** — Corrected market data: $29.84B by 2032 at 28.7% CAGR (was $17.84B at 25.6%), 36M African creators, SARS R95,750 threshold, SA CPM range.
4. **Pain Priority Matrix** — 7 data-ranked pains with scores and copy angles. Monetisation Confusion 0.84 is #1.
5. **Live subscriber verbatims** — Andiswa Tau + Freedom BORNGREAT + empresstallowah. empresstallowah's "monetization and the fear of being seen" = most common pain combination in entire audience.
6. **ICP 2 sub-segments** — 6 sub-profiles with percentages, language, and hook angles.

**New in creator-dna.json:**
- `pain_priority_matrix` key — full ranked matrix
- `live_subscriber_replies` key — 3 verbatims with context on how to use each
- `sub_segments` key added inside `content_creator_inspirer`
- Market data keys updated/added

### The most impactful change
The sentence architecture patterns. Before this, the AI knew Ndivhuwo's frameworks but wrote in generic AI English. Now it has the micro-patterns to sound like the person. Test: generate a hook and see if the first sentence sounds like it was written by a human who's been through it.

---

## Session 2026-06-09 — Mobile Responsiveness + Generation Speed

### What was done
1. **Hooks API → HAIKU** (`app/api/hooks/generate/route.ts`) — switched from SONNET to HAIKU for 3-4× speed gain. Hook generation was taking 8-12 seconds. HAIKU handles short creative structured JSON output just as well. This is intentional — do not revert to SONNET without a reason.
2. **Mobile layout pattern** — the standard responsive pattern for all result cards is now `flex flex-col gap-3` (NOT `flex items-start justify-between gap-4`). Text on top, action buttons below, all in a horizontal `flex flex-wrap` row. Applied to: hooks result cards, hooks skeleton, scripts output header.
3. **Form field pair grids** — always `grid-cols-1 sm:grid-cols-2 gap-4` (never bare `grid-cols-2`). Applied to hooks form + content-calendar-plus (5 form grids).
4. **Scripts loading skeleton** — added `loading && !script` skeleton block showing before the output Card renders. Shows animate-pulse shaped blocks matching the expected output sections.
5. **Fear analyzer** — result card `flex flex-col sm:flex-row sm:items-start` applied.

### Pages still needing mobile audit
batch-planner, storytelling, pitch, repurpose, formula-writer, analytics, campaigns.

### New components added (session 2026-06-08 — from previous context)
- `components/CommandPalette.tsx` — ⌘K search over all 31 tools, keyboard nav (↑↓ Enter Esc)
- `components/RecentActivity.tsx` — "Continue where you left off" section on dashboard
- `app/api/dashboard/recent/route.ts` — fetches last 3 hooks + 2 scripts for RecentActivity
- Mobile nav: hamburger drawer pattern, backdrop overlay, auto-close on resize to lg+

---

## UX/UI Design Standards — From June 2026 Full System Audit

### Contrast failures to never repeat
- `#D4D4D8` (zinc-300) is near-invisible on white backgrounds. Never use it for display text, hero payoff lines, or any meaningful text. It reads as disabled.
- Active filter/tab buttons with `bg-blue-600` must use `text-white`, not `text-[#18181B]`. Dark text on blue fails WCAG 4.5:1 at normal font sizes.

### Dead interactive elements — the #1 trust killer
- Never ship a `<button>` without an `onClick`. Remove dead buttons (ChevronDown menus with no action, dropdown chevrons that don't open anything).
- Never use `<span>` with `hover:text-*` if the element doesn't do anything — hover signals clickability.
- Never ship a keyboard shortcut badge (⌘F, ⌘K) on a non-functional element. Experienced users try it once, fail, and mark the product as broken.

### Navigation icon uniqueness — non-negotiable
- Every sidebar nav item must have a unique icon. Duplicate icons within the same group or nearby groups create cognitive confusion when scanning.
- Current icon assignments (June 2026): Content Cards→LayoutGrid, Campaigns→Megaphone, Revenue Tracker→Wallet, Analytics→BarChart2. When adding new tools, pick unused icons.

### Auth UX minimums
- Password field must have show/hide toggle (Eye/EyeOff). Table stakes.
- Sign-in page must have a "← Back to home" link.
- Never use a real personal email as placeholder text.
- Outer wrapper div for sign-in page must have `relative` class so dot grid background positions correctly.

### Scroll and anchor nav
- `scroll-behavior: smooth` on `html` element in globals.css — always.
- Landing page nav links must be working scroll anchors with matching section `id` attributes. Dead nav links destroy first impressions.

### User avatar
- A generic `User` icon from lucide in a user avatar looks amateur. Use the first letter of the user's name: `{userName.charAt(0).toUpperCase()}`.

### Hero design law
- The payoff/climax line of a hero headline must be the most high-contrast element — NOT the softest. If the second line of your headline is the value delivery ("Sell more."), make it the most prominent visually (blue, bold) not the least (grey).
- The eye should naturally flow: headline payoff → CTA button. If they share a color (both blue), the connection is immediate.

---

## Session 2026-06-09 — Script Generator Fix + Loading Progress UI

### Script parse error — root cause and fix
The "Failed to parse script response" error had THREE causes:

1. **Prompt template had literal newlines inside a JSON string.** The `fullScript` field in the output format example (line ~655 of the scripts API route) showed the multiline script format WITH actual newlines inside the JSON string. The AI copied this format, producing invalid JSON that breaks `JSON.parse`. Fix: rewrote the `fullScript` example to use `\n` escape sequences. Also added explicit "CRITICAL JSON RULES" block at the top of the OUTPUT FORMAT section.

2. **`max_tokens: 6000` was borderline for the full structure.** The 7-act JSON (actStructure × 7 + fullScript + bRoll + compliance with 15 section13 sub-fields) was hitting or exceeding 6000 tokens on longer content. Fix: raised to 8000 for the content mode. **Note: CLAUDE.md says 6000 for script routes — this is now 8000. Update CLAUDE.md if you rewrite it.** ⚠️ STALE: actStructure/7-act REPLACED by stepStructure (9 steps) — see 2026-06-14 session. max_tokens remains 8000.

3. **Client had no fallback for literal-newline JSON.** Fix: added two-pass parsing — first try clean JSON, then escape literal newlines inside string values using `/("(?:[^"\\]|\\.)*")/g` regex and `.replace(/\n/g, '\\n')`.

### Loading progress card — how it works
- `streamingText` state: each chunk from the reader is appended AND the last 400 chars are kept in state for display
- `loadingStep` state: advances on a `setInterval` of 4500ms while `loading === true`, reset to 0 when loading ends
- `LOADING_STEPS` array: 8 steps with icon, label, and detail text describing what the AI is doing in that phase
- The `useEffect` that drives the timer depends on `[loading]` — it starts when loading begins and clears the interval when loading ends
- The live output dark terminal box only renders when `streamingText.length > 20` — avoids showing an empty box on first tick
- The `[animation-delay:Xms]` pattern for the bouncing dots requires Tailwind's arbitrary value support — works in this codebase

---

## Session 2026-06-14 — 9-Step Shell, Clean Script, ICP Gate, Full Integration

- **7-Act Retention Formula REPLACED by 9-Step NOCHILL Signature Shell.** `actStructure`/7-act dead. `stepStructure` (9 steps) is the live output schema in `app/api/scripts/generate/route.ts`.
- **9-Step sequence (non-negotiable):** Hook → Introduce Myself → Problem → Rehook → Personal Story → Rehook → Solution → Cost of Not Acting → CTA.
- **`cleanScript` field added** to scripts API output — same as `fullScript` but `[DIRECTION]` lines removed, `[YOU]:` stripped, `[STEP N: NAME]` → `STEP N — NAME`. AI generates both; UI lets user toggle.
- **WORDS ONLY is the default view** on scripts page. FULL SCRIPT available as director view. Send to Teleprompter always sends clean version.
- **Teleprompter `processScriptWithMarkers`** now strips `[DIRECTION]` lines and `[YOU]:` prefix before adding breathing markers. Scripts pasted manually also get cleaned.
- **120-hook bank active as few-shot training** — 12 examples (2 per category × 6 categories) injected into hooks system prompt before the 52 template section. Pattern recognition, not template copying.
- **R×A×C×U^B is now pre-generative reasoning** — AI reasons through R→A→C→U→B BEFORE writing each hook. Replaced the old post-validation checklist. Quality impact: hooks are argument-first, not rule-checked.
- **ICP gate at TOP of both forms** (hooks + scripts) — gold border, "Lock Your ICP First" label, auto-warning. First form element, above Topic/Idea.
- **Batch → Scripts data transfer complete** — `openScriptWriter()` passes `icp`, `shadowFear`, `villain` + topic + platform. Scripts `pendingAction` consumer applies all 5 fields.
- **Batch system prompt upgraded** — R×A×C×U^B Hook Quality Law, Proof Story Citation Law, all 10 shadow fears (was first 5 only), 9-step shell reference.
- **Content Idea Engine deployed** — `nochill-content-ideas.vercel.app`. Separate Vercel project. 9-step formula in API prompt + all 10 fallback ideas in `index.html`.
- ⚠️ STALE IN SCRIPTS PAGE: `LOADING_STEPS` array still uses 7-Act language ("Writing Act 1: The Negative Hook..."). Cosmetic only — not a logic issue. Fix next time `app/dashboard/scripts/page.tsx` is touched.

---

## Session 2026-06-13 — Batch Fix, DB Persistence, Pipeline Push

### JSON truncation root cause (SOLVED)
- Error: `Expected ',' or ']' after array element in JSON at position 11425`
- Root cause: `buildSystemPrompt('scripts')` consumed ~5000 input tokens, leaving only ~11000 tokens for 30-post output needing ~14000+
- Fix: replaced with 200-token compact inline system prompt. Added "max 20 words per field" brevity rule. Added graceful recovery: extract partial plan array from truncated output using regex

### BatchPlan DB model added to prisma/schema.prisma
- Fields: `name`, `seriesName`, `leadMagnet`, `niche`, `goals`, `platform`, `targetICP`, `plan` (Json), `weeklyArcs` (Json), `compliance` (Json)
- User relation: `batchPlans BatchPlan[]` added to User model
- API routes: `POST /api/batch-plans` (save), `GET /api/batch-plans` (list), `DELETE /api/batch-plans/[id]`
- After adding new Prisma models: always run `npx prisma generate` before `tsc --noEmit` to avoid "Property X does not exist on PrismaClient" type errors

### DB push to Supabase
- Supabase project sleeping (free tier): direct port 5432 unreachable — `ECONNREFUSED`
- Fix: go to supabase.com → project → (if paused, click Restore) → then locally run: `set -a && source .env.local && set +a && npx prisma db push --accept-data-loss`
- `batch_plans` table and `content_pipeline` table are NOT yet created in Supabase — must do manual restore + push
- Both API routes degrade gracefully (return empty array / 503) until DB is restored

### One-click Pipeline push
- Batch Planner: `pushAllToPipeline()` — loops contentPlan, POSTs each to `/api/pipeline` with title/platform/hook/cta
- Calendar Plus: `pushEntryToPipeline(entry)` — single-entry push, then navigates to `/dashboard/pipeline`
- Button: Heritage Gold for batch bulk push, emerald for calendar single-entry

### Deployment verification pattern
When a user says "I can't see the changes":
1. Check Vercel MCP `list_deployments` to confirm latest commit is `state: "READY"` on production
2. If READY: the issue is browser cache — tell user to hard refresh (Cmd+Shift+R Mac / Ctrl+Shift+R Windows)
3. Also check: is the feature state-conditional? (loading card only shows during generation, not on page load) — user may be looking at the page in the wrong state

---

## Session 2026-06-14 — Full Integration, Persistence & Bridge Layer

### What was completed
1. **BackButton on all tool pages** — shared `components/BackButton.tsx` (ArrowLeft, "All Tools", routes to /dashboard). Added to: hooks, scripts, storytelling, batch-planner, content-calendar-plus, pipeline, teleprompter, content-studio, fears, repurpose.
2. **Calendar grid/list toggle fix** — replaced single toggle with two-button group. Active = `bg-[#EFF6FF] text-[#2563EB]`, Inactive = `bg-white text-[#A1A1AA]`.
3. **API update routes** — `PUT /api/hooks/update` and `PUT /api/stories/update` for in-place editing of saved content.
4. **Storytelling session restore + edit mode** — on generate: saves to `sessionStorage('storytelling_last_output')`. On mount: restores from sessionStorage. Edit Story button → editable Textarea → Save Edits (calls PUT /api/stories/update if DB-saved) / Cancel.
5. **Hook Bank → Scripts bridge** — hook-bank writes `localStorage('pendingAction')` action `'use-hook-in-script'`. Scripts page now reads this on mount (new `useEffect`) since ContentContext.pendingAction is in-memory only and doesn't survive navigation.
6. **Hook Bank → Hooks Generator bridge** — new `useInHooksGenerator()` function + Sparkles button. Sets `localStorage('hookBankPreload')` → hooks page reads on mount and populates topic + hookType.
7. **Story Bank → Scripts bridge** — story-bank writes `localStorage('pendingAction')` action `'use-story-in-script'`. Same scripts mount reader picks it up.
8. **ICP Pain Library → Hooks bridge** — new `generateHookFromPain()` writes `localStorage('painToHookPreload')`. Hooks page reads on mount, sets topic + shadowFear + icp.
9. **ICP Pain Library → Scripts bridge** — new `generateScriptFromPain()` writes `localStorage('pendingAction')` action `'use-story-in-script'`. Scripts page picks it up via the same mount reader.
10. **LOADING_STEPS updated** — scripts page loading steps now reference 9-Step Shell language (Hook, Introduce, Problem, Rehook, Story, Solution, Cost, CTA) instead of stale 7-Act language.

### Critical architecture insight: ContentContext vs localStorage bridges
- `ContentContext.pendingAction` is **in-memory only** — it resets on page navigation. Using `setPendingAction()` before `router.push()` from a different page will NOT work because the context re-mounts.
- The correct cross-page bridge pattern: write to `localStorage`, then `router.push()`. The destination page reads from localStorage in a `useEffect` on mount and immediately removes the key.
- Hook Bank, Story Bank, ICP Pain Library all correctly use this localStorage-then-navigate pattern.
- ContentContext `pendingAction` DOES work for in-page actions (e.g., Fears → Hooks on the same session without full navigation) — do not replace those with localStorage.

### Content Studio — not migrated (scope decision)
- Content Studio still uses localStorage for its Planned/Shot/Published Kanban boards.
- The `ContentCard` DB model requires too many fields (`contentTitle`, `platform`, `contentType`, `contentPillar` mandatory) to map cleanly to the simple studio data model.
- This is not a bug — it's a scoped-out migration. Do NOT attempt to auto-migrate unless the user explicitly asks and is ready for a full rewrite of the page.
- Data persists fine within a browser session; only lost if localStorage is cleared manually.

### Vercel CLI authentication note
- Use the authenticated CLI at `/Users/NOCHILLGOD/.npm-global/bin/vercel` (version 54.9.1, user `chiefmuhanelwa-1497`).
- Newer system CLI at 54.12.2+ fails with "Not authorized" — do NOT use the system path for production deploys.
- Command: `/Users/NOCHILLGOD/.npm-global/bin/vercel --prod`

---

## Session 2026-06-15 — ICP 1 DECISION LOCKED + Full System Realignment

### ⚡ DEFINITIVE ICP DECISION: ICP 1 (Called Expert) is the PRIMARY REVENUE ENGINE

This is a permanent strategic decision — not a campaign decision, not a quarterly focus. All future AI generation, content planning, product positioning, and system defaults must reflect this.

**Why ICP 1 is primary (the math that closed the argument):**
- ICP 1 revenue math: 6–10 cohort sales at R9,997–R18,000 = R100K/month (one cohort. One month.)
- ICP 2 revenue math to match: 400 sales at R250 = R100K. That's 40–67× more transactions.
- Ndivhuwo IS ICP 1. He is a currently-employed professional (ATNS, Air Traffic Services) who built R600K/year from content in 4-hour shift windows. He is the proof. No competitor can replicate this.
- The Called Expert Programme (CHKPLT) is the highest-margin product at R18,000 PIF / R6,500×3.
- The 30-day Kingdom Business Fast Plan allocates 84% of revenue to ICP 1 products.
- Survey data re-interpreted: "Monetisation Confusion" (71%) is not ICP 2-only — it IS the Called Expert's problem. They don't know how to monetise their expertise outside their employer. The pain matrix serves both ICPs. Only the LANGUAGE differs.

**ICP 2 role going forward:**
- ICP 2 = TRAFFIC ENGINE. Builds audience, fills email list, grows reach.
- Low-ticket ICP 2 buyers (R250–R1,500) are the warmest ICP 1 leads. A creator who buys a R250 product and sees the system works is primed to invest R18K in the Called Expert cohort.
- Never abandon ICP 2 content entirely — it feeds the pipeline.

**The monopoly position (no competitor can replicate this combination):**
1. Still employed at ATNS (OR Tambo) while earning R600K+ from content
2. Shift worker testimony — built in 4-hour night shift windows
3. Faith-integrated business model (CHKPLT = Christ's Kingdom Platform)
4. Paid R207,879 SARS from professional + content dual income
5. No degree — dropped out twice — yet SAMA31 judge, Meta speaker

**The primary proof hook for all ICP 1 content (use this to open every series):**
"I still work at ATNS. I built R600K in 4-hour shift windows between night shifts at OR Tambo. I never quit first. I built first. You don't have to quit either."

**Kingdom revelation decoded (John 21 → content strategy):**
- Jesus appeared at the place of WORK, not a church. The miracle happened when they cast on the RIGHT side.
- Left side = rented platforms (Instagram suspended 780K followers, AdSense disabled December 2024)
- Right side = CHKPLT (owned platform), products, email list, Called Expert cohort
- The 153 fish = the Called Experts already in the water, waiting for someone to show them where to cast
- Deuteronomy 1:6: "You have dwelt long enough at this mountain." = The shift worker, the teacher, the corporate trapped — they've been at the same mountain (job, salary, employer's building) long enough

**The 6 Called Expert Sub-Segments (ICP 1 targeting):**
1. The Shift Worker (Ndivhuwo's primary) — healthcare, aviation, security, transport, mining
2. The Corporate Trapped (largest segment) — manager, analyst, accountant, HR
3. The Teacher/Lecturer — deep expertise, chronically undervalued salary
4. The Healthcare Worker — knowledge people Google at midnight (premium buyer)
5. The Faith Professional — spiritual assignment without income structure
6. The Freelancer at Capacity — fully booked, trading hours for money, no leverage

### What was updated in this session
- `lib/knowledge-base.ts`: ICP 1 = ⚡ PRIMARY REVENUE ENGINE label, monopoly position, ATNS primary proof hook, John 21 framing added to CREATOR IDENTITY, 6 sub-segments with hook angles, ICP 2 = 🔄 TRAFFIC ENGINE, feeler triggers split into ICP 1 (revenue) and ICP 2 (traffic), `icpDirective` default now leans toward ICP 1
- `lib/knowledge/creator-dna.json`: `strategic_priority` block added at top level, `called_expert.sub_segments` (6 types), `buying_trigger`, `monopoly_position`, `primary_proof_hook` added to called_expert, `three_feeler_triggers` restructured with ICP 1 triggers first, `creator.positioning` updated to lead with Called Expert
- `Learnings.md`: this entry
- `CLAUDE.md` (project): ICP section updated to reflect ICP 1 = Revenue Engine, ICP 2 = Traffic Engine

---

## Teleprompter 100x: Recording-Mode Architecture (2026-07-14)

### What broke / what was wrong
- Recording mode was a `70vh` Card inside a 3-column grid — NOT full-screen. Phone recording was clipped/boxed.
- Two steps to start: "Hide Controls" → "Play" → then wait for countdown. Too slow.
- `wordsPerMinute` state existed at line 59 but was **never wired to anything** — scroll speed was in arbitrary px-per-50ms units with no relationship to how fast you actually speak.
- Countdown default was 15s — way too long.
- No touch gestures — essential for phone recording.
- No floating controls during recording — the button row below the display was distracting during filming.

### What was built
**Full-viewport recording mode** — when `!showControls`, the component returns EARLY with a completely separate JSX tree: `position: fixed; inset: 0; z-index: 50`. NOT a modified grid layout — a full replacement. The grid layout (settings view) is now only rendered when `showControls = true`. Pattern: conditional early return before the main `return (`.

**Touch/click tap zones on the display** (`handleDisplayTap`):
- Top 33% of display → speed +0.5
- Middle 33% → pause/play toggle
- Bottom 33% → speed -0.5
- Click events bubble up from the scroll container; `e.stopPropagation()` on floating pill buttons prevents them from triggering the tap handler.

**WPM speed calibration** (`calibrateSpeed`):
```
pxPerTick = (scrollRef.scrollHeight - scrollRef.clientHeight) / (wordCount / wpm * 60) / 20
```
20 ticks/sec because the scroll interval fires every 50ms. This converts a reading pace (words/min) into the exact px-per-tick that will complete the full script in that time at that pace.

**Auto-hide floating pill**: `floatingTimerRef` timeout resets on any `mousemove` or `touchstart` on the recording overlay. Pill uses `opacity: 0; pointerEvents: none` rather than `display: none` so the transition is smooth.

**Auto-launch from generator**: localStorage useEffect now sets a `setTimeout(() => setShowControls(false), 1500)` when a script is loaded — stored in a local variable and cleaned up in the effect's return. Pattern: cleanup function at the end of the effect, not in the `if` block.

**"Start Recording" button** — directly calls countdown + `setShowControls(false)` inline (avoids depending on `togglePlay` which checks `!isPlaying && !showControls` with stale closures).

### Defaults changed
- `countdown` / `countdownDuration`: 15 → 5
- `wordsPerMinute`: 150 → 130 (deliberate SA paced delivery)
- Font: `Arial` → `'Inter', system-ui, -apple-system, sans-serif`
- `estimatedMinutes`: divided by 150 → 130 to match WPM default

### TypeScript: zero errors (confirmed with `npx tsc --noEmit` after all changes)

---

## Scripts Page: Kallaway Display + Inline Edit (2026-07-14)

### What changed

Replaced the raw `<pre>` green card (lines 1756–1862) with a Kallaway rhythm renderer and inline edit mode. Zero logic changes to generation, save, or teleprompter bridge.

**`renderFullScriptKallaway(text)`** — renders `fullScript` line by line:
- `[STEP N: NAME]` → coloured numbered circle + horizontal divider rule. Colours: step 1=blue, 2-3=purple, 4=gold, 5=purple, 6=gold, 7=green, 8=red, 9=amber.
- `[DIRECTION]` → grey italic note (not spoken aloud).
- `[TEXT OVERLAY: ...]` → amber badge with 📱.
- `[PAUSE]` → centre-aligned `· · ·` breath indicator.
- Spoken lines: strip `[YOU]:`, `[SHORT]`, `[LONG]` prefixes. Word count proxy: ≤6 words = bold/tight (isShortLine), >18 words = light/spaced (isLongLine). Rehook phrases (REHOOK_PHRASES array) get Heritage Gold `#C9A84C` left border + warm brown text.
- 7-Act legacy scripts (`script.actStructure` but no `[STEP 1:`) still get their act map and retention devices panel, not the 9-step map.

**Inline fullScript edit** — three new state vars (`isEditingFullScript`, `editableFullScript`) and three functions (`startEditingFullScript`, `applyFullScriptEdit`, `cancelFullScriptEdit`). "Apply Changes" updates `script.fullScript` in state. The existing `saveScriptToLibrary` then correctly persists the edited `fullScript` in the JSON blob to Prisma DB — no route changes needed.

**Step 7 label** corrected from "Solution" to "Education (WHAT+WHY)" in the 9-step map.

### Patterns to reuse
- **TypeScript gotcha in JSX style objects**: `textTransform: 'uppercase' as const` — TypeScript needs the `as const` cast when setting CSS string union properties inside inline style objects or it flags a type error.
- **Conditional renderer pattern**: do the early-return parsing FIRST (stepMatch, DIRECTION, TEXT OVERLAY, PAUSE), THEN fall through to the spoken-line rendering. Order matters — a line can match multiple patterns.
- **`renderFullScriptKallaway` defined as a `const` inside the component** — this means it's a fresh function on every render. Fine for a display function; if perf becomes a concern, wrap in `useCallback`.
- **Edit-then-save flow for AI output**: state = `script`, edit = `editableFullScript` → `applyFullScriptEdit` updates `script.fullScript` in place → existing save route picks it up with no changes. No need for a separate "edited" state or a separate save API.

### TypeScript: zero errors confirmed
