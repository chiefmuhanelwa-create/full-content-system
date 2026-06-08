# AUTOMATION — WAT (Workflows · Agent · Tools)
### NOCHILL PTY LTD | Email Marketing + Social Media Automation
*Replacing MailerLite + Make.com with owned infrastructure*

---

## READ ME FIRST

**Current state:** MailerLite + Make.com handles email + social posting.
**Target state:** Resend (email API) + Supabase (subscriber DB) + Vercel Cron Jobs + direct social APIs — all inside the existing `full-content-system` Next.js codebase.

**Why this matters:**
- 13,000+ contacts — MailerLite free plan caps at 1,000 active subscribers
- Make.com scenarios are brittle (token expiry, manual reconnects)
- Zero data ownership — MailerLite owns the list; Supabase gives you SQL-level control
- Direct API posting cuts Make.com entirely (save ~$29/mo)

**What stays (for now):** Shopify store, Paystack, Supabase (already live), the full-content-system codebase on Vercel

**What gets replaced:**
| Old | New |
|-----|-----|
| MailerLite API | Resend API |
| Make.com Scenario 1 (welcome webhook) | Next.js API route + Supabase trigger |
| Make.com Scenario 3 (Facebook daily post) | Vercel Cron → Meta Graph API |
| Make.com Scenario 4 (buyer sync) | Shopify webhook → Supabase → Resend |
| MailerLite subscriber list | Supabase `subscribers` table |

---

## W — WORKFLOWS

### Phase 1: Email Infrastructure (Build First)

#### Step 1.1 — Set up Resend
```
1. Create account at resend.com (free: 3,000 emails/month, 100/day)
2. Verify domain: nochill.co.za → add DNS records Resend gives you
3. Get API key → add to Vercel env: RESEND_API_KEY
4. Install SDK: npm install resend (in full-content-system)
```

#### Step 1.2 — Supabase Subscribers Table
Create via Supabase SQL editor:
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  source TEXT DEFAULT 'unknown',
  status TEXT DEFAULT 'subscribed', -- subscribed | unsubscribed | bounced
  tags TEXT[] DEFAULT '{}',
  shopify_customer_id TEXT,
  purchased BOOLEAN DEFAULT false,
  purchase_product TEXT,
  welcome_sent BOOLEAN DEFAULT false,
  sequence_step INTEGER DEFAULT 0,
  sequence_last_sent_at TIMESTAMPTZ,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  mailerlite_migrated BOOLEAN DEFAULT false
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_tags ON subscribers(tags) USING GIN;
```

#### Step 1.3 — Bulk Import 13,000 Contacts
```
1. Export from MailerLite: Dashboard → Subscribers → Export CSV
2. Clean CSV (remove unsubscribes, bounces)
3. Build import script: /scripts/import-subscribers.ts
   - Reads CSV, inserts via Supabase client in batches of 500
   - Sets mailerlite_migrated: true
   - Skips duplicates (ON CONFLICT DO NOTHING)
4. Run locally: npx ts-node scripts/import-subscribers.ts
5. Verify count in Supabase: SELECT COUNT(*) FROM subscribers;
```

#### Step 1.4 — Welcome Email (replaces Make.com Scenario 1)
File: `app/api/subscribers/route.ts`
```
POST /api/subscribers
Body: { email, name?, source? }
Logic:
  1. Insert into subscribers table
  2. Send welcome email via Resend
  3. Set welcome_sent: true
  4. Return 200
```

Email templates live in: `lib/email-templates/` as React components (Resend supports React Email)

#### Step 1.5 — Sequence Automation (replaces MailerLite welcome sequence)
File: `app/api/cron/email-sequence/route.ts`
```
Vercel Cron: runs daily at 08:00 SAST (06:00 UTC)
Schedule in vercel.json: "0 6 * * *"

Logic per subscriber:
  WHERE status = 'subscribed'
  AND welcome_sent = true
  AND sequence_step < 7 (7-email sequence)
  AND (sequence_last_sent_at IS NULL OR sequence_last_sent_at < NOW() - INTERVAL '2 days')
  
  → Send next sequence email via Resend
  → Increment sequence_step
  → Update sequence_last_sent_at
```

Sequence emails in: `lib/email-templates/sequence/` (Day 0 through Day 14)

#### Step 1.6 — Shopify Buyer Sync (replaces Make.com Scenario 4)
File: `app/api/webhooks/shopify/route.ts`
```
Shopify → Webhook: orders/paid
Logic:
  1. Verify Shopify HMAC signature
  2. Upsert subscriber from order email
  3. Set purchased: true, purchase_product: line_item title
  4. Send purchase confirmation + upsell email via Resend
  5. Tag subscriber: ['buyer', product-slug]
```
Env required: `SHOPIFY_WEBHOOK_SECRET`

---

### Phase 2: Social Media Automation (replaces Make.com Scenario 3)

#### Step 2.1 — Facebook + Instagram (Meta Graph API)
File: `app/api/cron/social-post/route.ts`
```
Vercel Cron: runs daily at 08:00 SAST (06:00 UTC)
Schedule: "0 6 * * *" (same cron, different function)

Content source:
  - Pull from Supabase content_queue table (posts scheduled in full-content-system dashboard)
  OR
  - Claude generates from daily template

Facebook post:
  POST https://graph.facebook.com/v21.0/{PAGE_ID}/feed
  { message: "...", access_token: PAGE_ACCESS_TOKEN }

Instagram post (requires image URL):
  POST https://graph.facebook.com/v21.0/{IG_ACCOUNT_ID}/media
  { image_url: "...", caption: "...", access_token: PAGE_ACCESS_TOKEN }
  → then: POST .../media_publish { creation_id }
```

Env required:
```
META_PAGE_ID=
META_PAGE_ACCESS_TOKEN=           # Long-lived token (never-expiring via Business Manager)
META_IG_ACCOUNT_ID=
```

**Token management:** Use a long-lived Page Access Token (not user token). Refresh via Business Manager → doesn't expire. Avoids the Make.com reconnect problem.

#### Step 2.2 — Twitter/X
File: `app/api/cron/social-post/route.ts` (same cron, add X block)
```
X API v2 — OAuth 2.0 Client Credentials (app-only)
POST https://api.twitter.com/2/tweets
Headers: Authorization: Bearer {ACCESS_TOKEN}
Body: { text: "..." }
```
Env required:
```
X_API_KEY=
X_API_SECRET=
X_ACCESS_TOKEN=
X_ACCESS_TOKEN_SECRET=
X_BEARER_TOKEN=
```

Rate limit: 17 tweets/24h on free tier. 1 post/day is fine.

#### Step 2.3 — LinkedIn
File: `app/api/cron/social-post/route.ts`
```
LinkedIn API v2 — OAuth 2.0
POST https://api.linkedin.com/v2/ugcPosts
Auth: OAuth 2.0 access token (personal account)

Body:
{
  "author": "urn:li:person:{PERSON_ID}",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": { "text": "..." },
      "shareMediaCategory": "NONE"
    }
  },
  "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
}
```
Env required:
```
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=            # Expires every 60 days — see Agent rules below
LINKEDIN_PERSON_ID=
```

**LinkedIn token refresh:** Build a `/api/linkedin/refresh` route that exchanges refresh token before expiry. Cron alert if token is within 7 days of expiry.

---

### Phase 3: Email Dashboard in Full-Content-System

File: `app/dashboard/email/page.tsx`

Features:
- Subscriber list with search, filter by tag/status
- Open rate tracking (Resend webhook → update `opened` boolean in subscribers table)
- Sequence progress per subscriber (sequence_step column)
- Unsubscribe handler: `GET /api/unsubscribe?token={jwt}`
- Manual broadcast: compose → send to filtered segment via Resend batch API

Resend open tracking: Add `tracking: { opens: true }` to send options. Resend fires a webhook to `POST /api/webhooks/resend` on open.

---

### Phase 4: Content Queue (feed the daily social cron)

Table: `content_queue`
```sql
CREATE TABLE content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,   -- facebook | instagram | twitter | linkedin
  content TEXT NOT NULL,
  image_url TEXT,
  scheduled_for TIMESTAMPTZ,
  posted BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

UI in: `app/dashboard/calendar/` — drag-drop queue builder already exists, wire it to this table.

---

## A — AGENT

Rules for Claude when working on this implementation:

**File locations — always check these before creating new:**
- API routes → `app/api/` in full-content-system
- Email templates → `lib/email-templates/`
- Cron handlers → `app/api/cron/`
- Supabase client → `lib/supabase.ts` (already exists — do not create a new one)
- Env vars → check `full-content-system/.env.local` first before asking user

**Never:**
- Touch `app/api/auth/` — auth is handled by NextAuth, do not modify
- Send emails from the wrong domain (must be `@nochill.co.za`, not Gmail)
- Store API tokens in code — always use env vars
- Use MailerLite SDK for new work — only read from it if migrating data

**Always:**
- Verify Shopify webhooks with HMAC before processing
- Add unsubscribe link to every email (POPIA compliance)
- Batch Supabase inserts in chunks of 500 (avoid row limit timeouts)
- Test Resend sends against a dev email first (use chiefmuhanelwa@gmail.com for testing)
- Use `UTC-2` offset for SAST when writing cron schedules (SAST = UTC+2, so 08:00 SAST = 06:00 UTC = "0 6 * * *")

**Vercel Cron format:**
```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/email-sequence", "schedule": "0 6 * * *" },
    { "path": "/api/cron/social-post", "schedule": "0 6 * * *" }
  ]
}
```
Cron routes must return `200` or Vercel marks them failed. Always `return NextResponse.json({ ok: true })`.

**Rate limits to respect:**
| Platform | Limit | Safe daily budget |
|----------|-------|-------------------|
| Resend (free) | 100/day, 3,000/month | Batch sends, not blasts |
| Resend (paid $20/mo) | 50,000/month | Full list sends OK |
| Meta Graph API | 200 calls/hour per token | No issue for 1 post/day |
| X API (free) | 17 tweets/24h | 1/day = fine |
| LinkedIn API | 100 UGC posts/day | 1/day = fine |
| Supabase (free) | 500MB DB, 2GB bandwidth | Monitor at dashboard |

**When token expires (LinkedIn especially):**
1. Read `LINKEDIN_ACCESS_TOKEN` from env
2. Call refresh endpoint with `LINKEDIN_REFRESH_TOKEN`
3. Update Vercel env via dashboard (no automated secret rotation on free plan)
4. Log expiry date in Supabase `config` table so future Claude sessions know

**Environment variables required (full list):**
```
# Already in .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # For server-side inserts (bypasses RLS)
DATABASE_URL=
ANTHROPIC_API_KEY=
PAYSTACK_SECRET_KEY=
MAILERLITE_API_KEY=             # Keep until migration complete

# Add for this implementation
RESEND_API_KEY=
SHOPIFY_WEBHOOK_SECRET=
META_PAGE_ID=
META_PAGE_ACCESS_TOKEN=
META_IG_ACCOUNT_ID=
X_API_KEY=
X_API_SECRET=
X_ACCESS_TOKEN=
X_ACCESS_TOKEN_SECRET=
X_BEARER_TOKEN=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_REFRESH_TOKEN=
LINKEDIN_PERSON_ID=
```

**Migration checkpoint — before shutting down MailerLite:**
- [ ] All 13,000 contacts imported to Supabase (verify: `SELECT COUNT(*) FROM subscribers`)
- [ ] Welcome email sends successfully via Resend (test with chiefmuhanelwa@gmail.com)
- [ ] Sequence cron runs once without error on Vercel
- [ ] Shopify webhook fires on test order and upserts subscriber
- [ ] MailerLite groups snapshot saved as CSV backup

---

## T — TOOLS

### Email: Resend
- **SDK:** `npm install resend`
- **Docs:** resend.com/docs
- **Key endpoint:** `resend.emails.send({ from, to, subject, react })`
- **Batch:** `resend.batch.send([...emails])` — up to 100 per call
- **React Email:** `npm install @react-email/components` — template components
- **Webhook events:** delivered, opened, clicked, bounced, complained → POST to `/api/webhooks/resend`
- **Env:** `RESEND_API_KEY`
- **Cost:** Free (3K/mo) → $20/mo (50K/mo) → $90/mo (unlimited)

### Database: Supabase
- **Client (server):** `createClient(url, SERVICE_ROLE_KEY)` — bypasses RLS for cron jobs
- **Client (browser):** `createClient(url, ANON_KEY)` — respects RLS for user-facing routes
- **Tables:** `subscribers`, `content_queue`, `config`
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Social: Meta Graph API
- **Version:** v21.0 (current as of 2026)
- **Page post:** `POST /v21.0/{PAGE_ID}/feed`
- **IG create container:** `POST /v21.0/{IG_USER_ID}/media`
- **IG publish:** `POST /v21.0/{IG_USER_ID}/media_publish`
- **Token type:** Long-lived Page Access Token (generated via Graph API Explorer, never expires for pages)
- **Env:** `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `META_IG_ACCOUNT_ID`

### Social: X (Twitter) API v2
- **Auth:** OAuth 1.0a (user context) for posting as the account
- **Endpoint:** `POST https://api.twitter.com/2/tweets`
- **SDK option:** `npm install twitter-api-v2`
- **Env:** `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`

### Social: LinkedIn API
- **Version:** REST v2
- **Auth:** OAuth 2.0 — access token expires in 60 days; refresh token lasts 365 days
- **Post endpoint:** `POST https://api.linkedin.com/v2/ugcPosts`
- **Person ID:** `GET https://api.linkedin.com/v2/me` → `.id`
- **Scopes needed:** `w_member_social`, `r_liteprofile`
- **Env:** `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_REFRESH_TOKEN`, `LINKEDIN_PERSON_ID`

### Cron: Vercel Cron Jobs
- **Config:** `vercel.json` → `"crons"` array
- **Route handler:** must respond 200 within 25s (Hobby) or 5min (Pro)
- **Auth:** Vercel sends `Authorization: Bearer {CRON_SECRET}` — verify before executing
- **Env:** `CRON_SECRET` — set in Vercel dashboard, add to vercel.json to pass to function

### Commerce: Shopify Webhooks
- **Register:** Shopify Admin → Settings → Notifications → Webhooks
- **Event:** `orders/paid`
- **Verify:** HMAC-SHA256 of raw request body using `SHOPIFY_WEBHOOK_SECRET`
- **Env:** `SHOPIFY_WEBHOOK_SECRET`

### Existing Infrastructure (already live)
| Tool | Status | Purpose |
|------|--------|---------|
| full-content-system | Live on Vercel | Host for all new API routes and crons |
| Supabase | Live | Add subscribers + content_queue tables |
| Paystack | Live | Subscription payments (untouched) |
| MailerLite | Active | Keep active until migration complete; groups backed up |
| Make.com | Active | Keep Scenario 1 active until Supabase welcome route is tested |

---

## CURRENT MAKE.COM REFERENCE (do not delete until migrated)

| Scenario | ID | Status | Replaces with |
|----------|----|--------|---------------|
| New Customer Welcome | 9163945 | ✅ Active | Supabase trigger + Resend |
| Email Sequence Scheduler | (unknown) | — | Vercel Cron + Resend |
| Daily Facebook Post | 9326620 | ⚠️ Ready, not active | Vercel Cron + Meta Graph API |
| Shopify → MailerLite Buyer Sync | Not built | ❌ | Shopify Webhook → Supabase |

### MailerLite Groups (backup reference)
| Group | ID |
|-------|----|
| TOP 500 | 189160566852421555 |
| NEW SUBSCRIBERS | 189168267230709259 |
| WELCOME SEQUENCE | 189168269143311546 |
| BUYERS — ALL | 189168267774920096 |
| BUYERS — COURSE | 189168268285576936 |
| COLD LEADS — 30 DAYS | 189168268725978913 |

---

*Last updated: June 2026 | NOCHILL PTY LTD | Build inside full-content-system codebase*
