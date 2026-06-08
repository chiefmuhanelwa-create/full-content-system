# Available Skills — Quick Reference
### NOCHILL PTY LTD | Claude Code Slash Commands
*All skills callable with /skill-name in Claude Code*

---

## NOCHILL Custom Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| WAT Brief | `/wat-brief` | Load full NoChill operating context — reads WAT.md + master brief. Use at session start. |
| Write Hooks | `/write-hooks [topic]` | Write scroll-stopping hooks using R×A×C×U^B formula. Pass topic or product name. |
| Write Story | `/write-story [topic]` | Write NoChill proof story from verified story bank. Hook → Story → Insight → Framework → Steps → CTA. |

**Custom skill files:** `~/.claude/commands/`

---

## Code Quality Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Code Review | `/code-review [level]` | Review current diff. Levels: low / medium / high / ultra. Add `--comment` to post inline PR comments, `--fix` to auto-apply. |
| Security Review | `/security-review` | Security-focused code review — OWASP top 10, auth, input validation. |
| Simplify | `/simplify` | Find reuse, simplification, efficiency cleanups in changed code. Does not hunt bugs. |
| Verify | `/verify` | Run the app and confirm a change works by observing real behavior. |
| Run | `/run` | Launch and drive this project's app. Finds start command automatically. |
| Init | `/init` | Initialise a new project with sensible defaults. |
| Review | `/review` | General code review. |

---

## Configuration & Setup Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Update Config | `/update-config` | Configure Claude Code settings.json — permissions, hooks, env vars, automated behaviors. Use for "from now on when X" type rules. |
| Keybindings Help | `/keybindings-help` | Customize keyboard shortcuts in ~/.claude/keybindings.json. |
| Fewer Permission Prompts | `/fewer-permission-prompts` | Scan transcripts and add an allowlist to reduce repetitive permission prompts. |
| Loop | `/loop [interval] [command]` | Run a command on a recurring interval. Omit interval for model self-pacing. |
| Schedule | `/schedule` | Create/manage scheduled remote agents on a cron schedule. |

---

## Vercel Platform Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Vercel Status | `/vercel:status` | Recent deployments, linked project info, environment overview. |
| Vercel Deploy | `/vercel:deploy [prod]` | Deploy to Vercel. Pass "prod" for production. Default is preview. |
| Vercel Env | `/vercel:env [list/pull/add/remove/diff]` | Manage Vercel environment variables. Sync between Vercel and local. |
| Vercel Bootstrap | `/vercel:bootstrap` | Set up a repo with Vercel-linked resources — preflight, integrations, env keys, DB startup. |
| Vercel Marketplace | `/vercel:marketplace` | Discover and install Vercel Marketplace integrations (databases, auth, CMS). |

---

## Vercel AI Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Vercel AI SDK | `/vercel:ai-sdk` | Build AI features — chat, text gen, structured output, tool calling, agents, MCP, streaming, embeddings. |
| Vercel AI Gateway | `/vercel:ai-gateway` | Configure model routing, provider failover, cost tracking, multiple AI providers. |
| Claude API | `/claude-api` | Claude API / Anthropic SDK reference — model IDs, pricing, params, streaming, tool use, MCP, caching. |

---

## Vercel Next.js Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Next.js | `/vercel:nextjs` | Next.js App Router patterns, server components, data fetching. |
| Next Cache & Components | `/vercel:next-cache-components` | Caching strategies, ISR, server vs client component decisions. |
| Next Upgrade | `/vercel:next-upgrade` | Upgrade Next.js version with migration guidance. |
| React Best Practices | `/vercel:react-best-practices` | React patterns, hooks, performance. |
| Shadcn | `/vercel:shadcn` | shadcn/ui component setup and usage. |
| Turbopack | `/vercel:turbopack` | Turbopack configuration and troubleshooting. |
| Next Forge | `/vercel:next-forge` | next-forge Turborepo monorepo SaaS starter guidance. |

---

## Vercel Infrastructure Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Vercel Functions | `/vercel:vercel-functions` | Serverless/Fluid Compute functions — timeouts, runtime, pricing. |
| Vercel Storage | `/vercel:vercel-storage` | Blob, databases via Marketplace. |
| Vercel Sandbox | `/vercel:vercel-sandbox` | Sandboxed code execution environment. |
| Vercel CLI | `/vercel:vercel-cli` | CLI commands — deploy, env, logs, domains, metrics. |
| Deployments & CI/CD | `/vercel:deployments-cicd` | Deploy, promote, rollback, prebuilt, CI workflow files. |
| Env Vars | `/vercel:env-vars` | .env files, vercel env commands, OIDC tokens, environment-specific config. |
| Routing & Middleware | `/vercel:routing-middleware` | Middleware patterns, rewrites, redirects, headers. |
| Runtime Cache | `/vercel:runtime-cache` | Cache-Control, CDN caching, stale-while-revalidate. |
| Vercel Firewall | `/vercel:vercel-firewall` | WAF rules, bot protection, BotID, IP blocking. |
| Verification | `/vercel:verification` | Domain verification, DNS, SSL. |
| Workflow | `/vercel:workflow` | Vercel Workflow/Queues — durable event streaming, at-least-once delivery. |
| Vercel Agent | `/vercel:vercel-agent` | AI code reviews and production investigations via Vercel Agent. |
| Auth | `/vercel:auth` | Clerk, Descope, Auth0 setup for Next.js — middleware auth, sign-in/sign-up. |
| Chat SDK | `/vercel:chat-sdk` | Multi-platform chatbots — Slack, Telegram, Teams, Discord, GitHub, Linear. |

---

## Useful Combos for NOCHILL Projects

| Task | Skills to chain |
|------|----------------|
| Start new session | `/wat-brief` → work |
| Write content | `/write-hooks` → `/write-story` |
| Before pushing code | `/code-review` → `/security-review` |
| Deploy to prod | `/vercel:status` → `/vercel:deploy prod` |
| New env var needed | `/vercel:env add` |
| Automate something | `/update-config` (hooks) |
| AI feature work | `/claude-api` → `/vercel:ai-sdk` |

---

*Updated June 2026 | Run `/wat-brief` to load session context*
