# WAT — Full Content System

**Framework:** W (Workflows) · A (Agent) · T (Tools)  
**Master hub:** `/Users/NOCHILLGOD/Desktop/nochill-knowledge-base/`

---

## W — Workflows (What to do and how)

| Document | Location | Contents |
|----------|----------|---------|
| Features reference | `docs/FEATURES.md` | All 42 tools, routes, inputs/outputs |
| Frameworks (AI context) | `docs/FRAMEWORKS.md` | All 18 frameworks for AI generation |
| Story bank | `docs/STORY_BANK.md` | All 11 proof stories with scripts |
| System assessment | `docs/SYSTEM-ASSESSMENT.md` | DARES scores, gaps, roadmap |
| Deployment guide | `docs/DEPLOYMENT.md` | How to deploy to Vercel |
| Architecture | `docs/ARCHITECTURE.md` | System architecture overview |
| Action plan | `docs/ACTION-PLAN.md` | Current priorities and roadmap |
| Features (NoChill) | `docs/NOCHILL-FEATURES.md` | NoChill-specific feature notes |
| Operational system | `docs/OPERATIONAL_SYSTEM.md` | How the system runs day-to-day |
| Quick start | `docs/QUICK_START_OPERATIONAL_SYSTEM.md` | Fast onboarding guide |
| Framework update | `docs/10-STEP-FRAMEWORK-UPDATE.md` | 10-step framework changes |
| Archive (old fixes) | `docs/archive/` | Historical deployment/fix guides |
| Master brand + frameworks | `../nochill-knowledge-base/W/` | Global brand, frameworks, SOPs |

---

## A — Agent (How Claude works here)

**Read before working in this project:** `../nochill-knowledge-base/A/content-system.md`

Key rules for this codebase:
- No `fs.readFileSync` at runtime — static imports only
- Always `checkRateLimit(request)` as first line of every API route
- Use `MODELS.SONNET` / `MODELS.HAIKU` from `lib/claude.ts` — never hardcode model strings
- Script route max_tokens: 6000 | Other routes: 3500
- Run `npx tsc --noEmit` before and after every change

---

## T — Tools (What runs this system)

| Tool | Role | Config location |
|------|------|----------------|
| Next.js 14 | App framework | `next.config.js` |
| TypeScript | Language | `tsconfig.json` |
| Prisma | Database ORM | `prisma/schema.prisma` |
| Supabase | PostgreSQL database | `DATABASE_URL` env var |
| Vercel | Hosting + deployment | `vercel.json` + Vercel dashboard |
| Anthropic Claude API | AI generation engine | `lib/claude.ts` + `ANTHROPIC_API_KEY` |
| NextAuth v4 | Authentication | `lib/auth.ts` |
| Paystack | Subscription payments | `PAYSTACK_SECRET_KEY` env var |
| MailerLite | Email tagging | `MAILERLITE_API_KEY` env var |
| TailwindCSS | Styling | `tailwind.config.ts` |

Full tools documentation: `../nochill-knowledge-base/T/by-project/content-system.md`
