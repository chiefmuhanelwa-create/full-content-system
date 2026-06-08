Deploy the NoChill Content System to Vercel.

## Pre-deploy checklist (run before every deploy)

### 1. TypeScript check — MUST PASS
```bash
cd /Users/NOCHILLGOD/Desktop/full-content-system
npx tsc --noEmit
```
Fix all errors before continuing. Do not deploy with TypeScript errors.

### 2. Check API route rules
Every API route must:
- Have `checkRateLimit(request)` as the FIRST line
- Use `MODELS.SONNET` or `MODELS.HAIKU` from `lib/claude.ts` — never hardcode model strings
- Use `max_tokens: 6000` for script routes, `3500` for all others
- Use static imports only — no `fs.readFileSync` at runtime

### 3. Check environment variables
Confirm all required env vars are set in Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `DATABASE_URL` (Supabase)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`
- `MAILERLITE_API_KEY`

### 4. Deploy
```bash
git add .
git commit -m "deploy: [describe what changed]"
git push origin main
```
Vercel auto-deploys on push to main.

### 5. Verify deployment
Check Vercel dashboard for build success. Test the golden path:
- Login works
- At least one tool generates output
- Paystack subscription gate works
- No console errors

## If deploy fails
Check Vercel build logs at: Vercel dashboard → Project → Deployments → [latest] → Build Logs

Common issues:
- TypeScript errors caught at build time → fix and redeploy
- Missing env var → add in Vercel dashboard → redeploy
- Database connection → check Supabase is not paused (free tier suspends after 1 week inactive)
