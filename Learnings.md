# Persistent Learning & Business Memory

Read this alongside `CLAUDE.md` before every task. Add new entries as they are discovered — never wait until the end of a session.

---

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
- `max_tokens` split: script routes use **6000**, all other AI routes use **3500**. Do not raise non-script routes.
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

2. **`max_tokens: 6000` was borderline for the full structure.** The 7-act JSON (actStructure × 7 + fullScript + bRoll + compliance with 15 section13 sub-fields) was hitting or exceeding 6000 tokens on longer content. Fix: raised to 8000 for the content mode. **Note: CLAUDE.md says 6000 for script routes — this is now 8000. Update CLAUDE.md if you rewrite it.**

3. **Client had no fallback for literal-newline JSON.** Fix: added two-pass parsing — first try clean JSON, then escape literal newlines inside string values using `/("(?:[^"\\]|\\.)*")/g` regex and `.replace(/\n/g, '\\n')`.

### Loading progress card — how it works
- `streamingText` state: each chunk from the reader is appended AND the last 400 chars are kept in state for display
- `loadingStep` state: advances on a `setInterval` of 4500ms while `loading === true`, reset to 0 when loading ends
- `LOADING_STEPS` array: 8 steps with icon, label, and detail text describing what the AI is doing in that phase
- The `useEffect` that drives the timer depends on `[loading]` — it starts when loading begins and clears the interval when loading ends
- The live output dark terminal box only renders when `streamingText.length > 20` — avoids showing an empty box on first tick
- The `[animation-delay:Xms]` pattern for the bouncing dots requires Tailwind's arbitrary value support — works in this codebase

### Deployment verification pattern
When a user says "I can't see the changes":
1. Check Vercel MCP `list_deployments` to confirm latest commit is `state: "READY"` on production
2. If READY: the issue is browser cache — tell user to hard refresh (Cmd+Shift+R Mac / Ctrl+Shift+R Windows)
3. Also check: is the feature state-conditional? (loading card only shows during generation, not on page load) — user may be looking at the page in the wrong state
