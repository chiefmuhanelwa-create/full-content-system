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
