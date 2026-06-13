# UPGRADE PLAN — NoChill Content System
**Date:** 2026-06-13  
**Scope:** 3 major upgrades + 5 gap fills  
**Research sources:** ViralFlow Software (Notion), The Creator Kit (Notion), Interest Peak Dictionary, Hooks + Visual Hooks guide, Vidyard Script Timer

---

## WHAT THIS DOCUMENT IS

This is the full implementation plan for the next major upgrade to the NoChill Content System. It covers exactly what's being built, why each piece improves the existing system, how the tools connect to each other, and the technical decisions behind each build.

No feature here is "nice to have." Every one of these closes a gap that exists between what tools like ViralFlow sell for $X/month and what the NoChill system does natively — for free, with NOCHILL voice baked in.

---

## CURRENT STATE vs. TARGET STATE

### What the system does well today
- AI hook generation with R×A×C×U^B formula and 52 proven templates
- Script writing with 7-Act Arc, HSLFCTA, multi-duration output
- Storytelling Studio with 6-stage written story structure
- Caption + Hashtag Generator with platform-specific rules
- Teleprompter with line-per-line mode and REHOOK markers
- Batch Planner → Calendar → Shoot Runsheet pipeline
- One-click repurpose from Script Writer
- Fear Analyzer, ICP Pain Library, Competitor Intel

### What's missing (gap analysis from research)

| Gap | External tool had it | Impact if not fixed |
|---|---|---|
| Content pipeline board | ViralFlow + The Creator Kit | No single view of where every piece is in production |
| Visual hook output | ViralFlow's core teaching | AI generates verbal hooks only — the screen never gets addressed |
| Interest Peak types | ViralFlow's hook taxonomy | Hook type selection is limited to 4 generic categories |
| Viral script templates | The Creator Kit (3 templates) | Script Writer is open-ended — no starting structure for proven formats |
| "$5 quality gate" | ViralFlow's scripting checklist | 15-point Section 13 exists but it's comprehensive, not quick |
| Script card structure | Every content OS researched | No place to store Hook/Value/CTA as a structured card per piece |

---

## BUILD 1 — CONTENT PIPELINE BOARD

**Route:** `/dashboard/pipeline`  
**Navigation:** Planning group (after Shoot Runsheet)  
**Type:** New page + new Prisma model + new API routes

### What it is
A Kanban board that tracks every content piece through its full production lifecycle. Think ViralFlow's Media Tracker — but native to the NoChill system, connected to every other tool, and with NOCHILL-specific metadata on each card.

### Why this matters
Right now there's no answer to: "Where is my content right now?" The Calendar shows WHEN. The Batch Planner shows WHAT sessions. The Runsheet shows today's shoot. But there's no view that shows ALL pieces simultaneously in their current production state. This is the command center that was missing.

### The 6 pipeline stages

| Stage | Color | What it means |
|---|---|---|
| **Idea** | Gray | Concept captured, nothing written yet |
| **Scripting** | Amber/Gold | Hook written, script in progress |
| **Ready to Record** | Blue | Script complete, approved, camera ready |
| **Editing** | Red/Orange | Raw footage done, in post-production |
| **Ready to Post** | Purple | Edited, caption + hashtags done, waiting to schedule |
| **Posted** | Green | Live on platform |

### What's on each card

**Core fields:**
- Title (content piece name)
- Platform (IG / TikTok / YouTube / LinkedIn / Facebook)
- ICP (Called Expert / Content Creator Inspirer / Auto)
- Interest Peak Type (one of 7 — from ViralFlow's dictionary)
- Scheduled Date
- Raw Footage Link (URL)

**Script fields (the "card" inside the card):**
- **Hook** — the verbal hook for this piece
- **Visual Hook** — the on-screen/thumbnail concept that amplifies it
- **Value** — core content, lesson, or framework being taught
- **CTA** — what the viewer should do/DM/save/click

**Quality checklist (ViralFlow's $5 test, NOCHILL-adapted):**
- [ ] Strong Hook — does the first line stop the scroll?
- [ ] Visual Hook — is there a clear opening frame concept?
- [ ] Actionable in 24 Hours — can they apply something from this today?
- [ ] Worth R50 — would someone pay R50 to watch this? (Localised from $5)

**Quick actions (cross-tool bridges):**
- "Write Script" → passes Hook + Value to Script Writer via localStorage
- "Open Teleprompter" → passes script to Teleprompter
- "Generate Caption" → passes script + platform to Caption Generator
- "Move to next stage" → advances status without dragging

### How it improves the current system
The Pipeline Board becomes the starting point for every piece of content. Instead of going directly to the Hook Generator and losing context, you create a Pipeline card first (Idea stage), fill in the Interest Peak type, then use the quick action to open Script Writer with the card's context pre-loaded. Every tool in the system now has a content piece to belong to.

### Database model
```prisma
model ContentPipeline {
  id              String    @id @default(cuid())
  userId          String
  title           String
  platform        String    @default("instagram")
  icp             String    @default("auto")
  status          String    @default("idea")
  interestPeak    String    @default("")
  hook            String    @default("")
  visualHook      String    @default("")
  value           String    @default("")
  cta             String    @default("")
  rawFootageLink  String    @default("")
  scheduledFor    DateTime?
  postedAt        DateTime?
  checkStrong     Boolean   @default(false)
  checkVisual     Boolean   @default(false)
  checkActionable Boolean   @default(false)
  checkWorthy     Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### API routes
- `GET /api/pipeline` — fetch all cards for current user
- `POST /api/pipeline` — create new card
- `PATCH /api/pipeline/[id]` — update card (status change, field edit, checklist toggle)
- `DELETE /api/pipeline/[id]` — delete card

---

## BUILD 2 — VISUAL HOOK OUTPUT

**Files changed:** `lib/knowledge-base.ts`, `app/api/hooks/generate/route.ts`, `app/dashboard/hooks/page.tsx`  
**Type:** Upgrade to existing tool — no new pages

### What it is
Every verbal hook the system generates now comes with a paired **Visual Hook** — the on-screen text, thumbnail concept, or opening frame description that summarises, visualises, and amplifies the verbal hook.

### The concept (from ViralFlow's own definition)
> "A visual opening statement summarizing, visualizing, & amplifying the verbal hook with the purpose of intriguing a viewer's interest."

Verbal hook and visual hook are always a pair. One without the other is half a piece of content.

**Examples from ViralFlow's guide:**
- Verbal: *"Going viral is not luck, it's calculated."*  
  Visual: Bold white text on black, the word CALCULATED highlighted in red, no face on screen
- Verbal: *"This is how the algorithm works on social media"*  
  Visual: Animated diagram revealing platform algorithm flow, creator pointing at it

### What changes in the AI output
Current hook output structure (per hook):
```json
"hooks": ["Hook text 1", "Hook text 2", ...]
```

New hook output structure:
```json
"hooks": [
  {
    "text": "You're posting every day and still broke. Here's the exact reason.",
    "visualHook": "Text overlay on dark background: 'POSTING DAILY ≠ GETTING PAID' — cut to creator holding phone showing zero notifications"
  }
]
```

### Knowledge base addition
A new Visual Hook section gets added to the `hooks` module addon in `knowledge-base.ts`. It covers:
- Definition of visual hook and why it's non-negotiable
- 4 visual hook categories: Text Overlay / Object/Environment / Creator Action / Before-After Split
- Rules: visual hook must match verbal hook energy, must work without sound, must be achievable with a phone
- NOCHILL visual hook examples tied to the SA creator context

### UI change
Hook Generator output card becomes a two-row display per hook:
- Row 1: Verbal hook (existing) with copy button
- Row 2: Visual hook in a soft amber callout box with camera icon — "🎬 Opening frame concept"

### How it improves the current system
The Hook Generator was generating 50% of a hook. The verbal line alone is only what's heard. What's seen in the first frame is what stops the scroll before a single word is processed. Every hook output is now a complete two-part package: say this / show this.

---

## BUILD 3 — INTEREST PEAK TYPES + SCRIPT TEMPLATES

### 3A: Interest Peak types in Hook Generator

**File changed:** `app/dashboard/hooks/page.tsx`  
**Type:** New select field, value passed to existing API

The Hook Generator gets a new "Interest Peak Type" selector replacing or supplementing the current "Hook Type" field.

**The 7 Interest Peak types (from ViralFlow's Interest Peak Dictionary):**

| Type | What it does | NOCHILL mapping |
|---|---|---|
| Risk Reversal | Reassures viewer their time is worth it — nothing to lose, everything to gain | Desired result hooks |
| Authority Endorsement | Borrows credibility from authority in niche | Proof story hooks (S001–S020) |
| Controversial | Validates or challenges a belief — emotional response grabs attention | Shock/harsh truth hooks |
| Personal Story | Teaches from lived experience — social proof validates the content | Story-led hooks |
| Negative Assumption | Addresses viewer's doubts about creator, differentiates from gurus | Information gap hooks |
| Hype Up | Maximum anticipation — "this is the best thing in the world" energy | Curiosity/teaser hooks |
| Call Out | Names exactly what viewer is thinking/doing right now (use carefully) | Comparison/challenge hooks |

Each type gets injected into the user prompt so the AI generates hooks that match the chosen emotional entry point.

### 3B: Script templates in Script Writer

**Files changed:** `app/dashboard/scripts/page.tsx`, `lib/knowledge-base.ts`  
**Type:** New template selector + knowledge base additions

Three viral content frameworks from The Creator Kit, re-voiced in NOCHILL SA energy, added as template starters in Script Writer:

**Template 1: "Never Ever Ever"** (mistake avoidance format)
```
Structure:
Never ever [do common action]
When/After you [do common action], [result of common action]
Next thing you know [specific painful experience]
Instead, you [get desirable outcome] — this is how
[Correct actions: WHAT to do + HOW to do each step]
And like magic, if you [did actions correctly], [desirable experience happens]
Save this [reason] and go [get results]
```
Best for: ICP 2 (Creator Inspirer), platform tutorials, before/after content

**Template 2: "Important V/S Not Important"** (priority ranking format)
```
Arc: Dismiss low-priority → Introduce first priority → Reveal main levers → Round out priorities → Final stack + CTA

Pattern:
[THING 1]. Not important.
[THING 2]. Not important. Wouldn't even recommend it.
[THING 3]. Important. [value about why]
[THING 4]. Not important. Doesn't do a thing.
[THING 5]. Very important. [specific why]
[THING 6]. Very important — but never use [common mistake] when doing it.
[Continue until full priority map is built]
Follow [handle] to learn [outcome 1] and [outcome 2].
Oh — and probably the most important thing is this.
```
Best for: both ICPs, framework breakdowns, "what actually matters" content

**Template 3: "Don't Do This"** (mistake correction format)
```
Pattern (repeat 5–7×):
While [doing an action] — don't do [wrong action].
Instead: [correct solution]. [Quick reason why this matters].
```
Best for: ICP 2, quick tips, contrarian/correction content

### 3C: $5 Quality Gate in Script Writer

**File changed:** `app/dashboard/scripts/page.tsx`  
**Type:** New UI component below script output

After a script is generated, a "Quick Quality Check" card appears with 4 interactive checkboxes. This is the fast gut-check layer — separate from Section 13 (which stays for compliance). The user checks these before hitting "Send to Teleprompter":

- **☐ Strong Hook** — does the first line stop the scroll cold?
- **☐ Visual Hook** — is there a clear opening frame or thumbnail concept?
- **☐ Actionable in 24 Hours** — can the viewer apply something from this today?
- **☐ Worth R50** — would someone pay R50 to watch this? (SA-localised $5 test)

All 4 checked = green card. Any unchecked = amber card with a "What's missing?" prompt.

### How this improves the current system
The Script Writer was generating good scripts but with no template starting point and no quick gut-check. Now: choose a template → AI generates in that structure → NOCHILL voice overlaid → quick 4-point check → send to Teleprompter. The full path from format to performance is in one tool.

---

## CROSS-TOOL INTEGRATION MAP (after all 3 builds)

```
PIPELINE BOARD (new command centre)
  → "Write Script" → Script Writer (hook + value pre-loaded)
  → "Open Teleprompter" → Teleprompter (script loaded)
  → "Generate Caption" → Caption Generator (script + platform loaded)

HOOK GENERATOR (upgraded)
  + Interest Peak type selector
  + Visual hook output (paired with every verbal hook)
  → "Save to Hook Bank" (existing)
  → "Use in Script" → Script Writer

SCRIPT WRITER (upgraded)
  + Template selector (Never Ever Ever / Important V/S Not Important / Don't Do This / Open-ended)
  + $5 Quality Gate checklist
  → "Send to Teleprompter" (existing)
  → "Generate Caption" (existing, last session)
  → "Repurpose" (existing, last session)

KNOWLEDGE BASE (upgraded)
  + Visual Hook science in hooks module
  + Interest Peak type definitions + injection logic
  + 3 NOCHILL-voiced script templates in scripts module
```

---

## MANYCHAT FLOWS — PENDING

The 5 saved ManyChat templates cannot be read from the flowPlayerPage URLs — they're JavaScript-rendered apps with no readable HTML source. To map them and integrate the DM automation logic into the system, share screenshots of each flow diagram. Once received, the plan is:

- Map each flow: trigger keyword → message sequence → buttons → conditions
- Add "ManyChat Copy Generator" output to Caption Generator or Script Writer — generates the exact DM message copy for each keyword trigger, in NOCHILL voice, ready to paste into ManyChat

---

## BUILD ORDER

1. ✅ This document
2. Prisma schema → `ContentPipeline` model + `db:push`
3. API routes → `/api/pipeline` (GET, POST, PATCH, DELETE)
4. Pipeline Board UI → `/dashboard/pipeline`
5. Knowledge base → visual hook science + Interest Peak types + 3 templates
6. Hook Generator API → visual hook in response
7. Hook Generator UI → visual hook display + Interest Peak selector
8. Script Writer → template selector + $5 quality gate
9. Navigation → Pipeline entry
10. `npx tsc --noEmit` — zero errors target

---

## SUCCESS CRITERIA

After all builds are complete:
- Every content piece has a home in the Pipeline Board from idea to posted
- Every hook generated includes what to say AND what to show
- Script Writer offers 4 starting structures (3 templates + open-ended)
- Hook Generator offers 7 emotional entry points via Interest Peak types
- The "$5 / R50 test" is the last thing checked before any script goes to Teleprompter
- All tools bridge into each other via localStorage — zero dead ends
- Zero TypeScript errors
