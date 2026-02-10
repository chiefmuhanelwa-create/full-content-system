# Supabase Setup Guide for NOCHILL Content OS

## 🔴 URGENT SECURITY ACTIONS FIRST!

Before proceeding, complete these critical security steps:

1. **Revoke the exposed Supabase key** you shared:
   - Go to https://supabase.com/dashboard
   - Navigate to your project
   - Go to Settings → API
   - Rotate your service role key
   - Generate a new anon key

2. **Rotate your Anthropic API key**:
   - Go to https://console.anthropic.com
   - Delete the old key
   - Generate a new one

3. **Generate new NextAuth secret**:
   ```bash
   openssl rand -base64 32
   ```

---

## ✅ Supabase Setup Steps

### Step 1: Get Your Supabase Project Details

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Navigate to **Settings → Database**

### Step 2: Get Database Connection String

From the Database settings page:

1. Scroll to **Connection string** section
2. Copy the **Connection pooling** string (URI format)
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. This will look like:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Step 3: Get Supabase API Credentials (Optional)

From **Settings → API**:

1. Copy your **Project URL** (e.g., `https://xxxxxxxxxxxx.supabase.co`)
2. Copy your **anon/public** key (this is safe for client-side use)
3. **DO NOT share your service_role key** - it has full database access!

### Step 4: Update Your `.env.local` File

Replace the placeholders in your `.env.local` file:

```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:[YOUR-PASSWORD]@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Client Configuration
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_new_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Claude AI API Key
ANTHROPIC_API_KEY=your_new_anthropic_key_here
```

### Step 5: Push Your Database Schema to Supabase

Run these commands in order:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase (creates all tables)
npm run db:push

# OR if you prefer migrations:
npx prisma migrate deploy
```

### Step 6: Verify Connection

Test your database connection:

```bash
npm run db:test
```

---

## 🚀 Running Your App

After setup is complete:

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

Your app should now be connected to Supabase!

---

## 📊 Supabase vs Neon Differences

### Connection Pooling
- **Supabase**: Uses port `6543` with `pgbouncer=true` for pooling
- **Neon**: Uses `sslmode=require`

### Direct Connection
If you need to run migrations or have pooling issues:

1. Get the **direct connection string** (port 5432, no pgbouncer)
2. Add to `.env.local`:
   ```env
   DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"
   ```
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

---

## 🔒 Security Best Practices

### ❌ NEVER commit these files to Git:
- `.env`
- `.env.local`
- Any file with actual credentials

### ✅ ALWAYS:
- Use environment variables for secrets
- Keep `.env.example` updated with placeholder values
- Add `.env*` to `.gitignore` (already configured)
- Rotate keys immediately if exposed
- Use separate keys for development and production

### 🔐 Environment Variables Hierarchy:
1. **Production** (Vercel/hosting platform): Use dashboard to set env vars
2. **Development**: Use `.env.local` (never commit)
3. **Example**: Use `.env.example` (safe to commit with placeholders)

---

## 🎯 Supabase Features You Can Use

Beyond just PostgreSQL, Supabase provides:

1. **Authentication** - Built-in auth (alternative to NextAuth)
2. **Storage** - File uploads (for user avatars, content media)
3. **Realtime** - Subscribe to database changes
4. **Edge Functions** - Serverless functions
5. **Auto-generated APIs** - REST and GraphQL endpoints

To use these features, you'll need the Supabase client (already installed):

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify your database password has no typos
- Ensure IP allowlist is set to "Allow all" in Supabase settings

### Error: "Prepared statements not supported"
- Add `pgbouncer=true` to your connection string
- Or use DIRECT_URL for migrations

### Error: "SSL connection required"
- Supabase requires SSL by default (already configured)
- Connection string should work as-is

### Prisma migrations failing?
- Use direct connection (port 5432) for migrations
- Then switch back to pooled connection for runtime

---

## 📚 Useful Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (no migration files)
npm run db:push

# Create and run migrations
npx prisma migrate dev --name init

# Deploy migrations (production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npx prisma studio

# Test database connection
npm run db:test
```

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- [NOCHILL Content OS Repository](https://github.com/yourusername/full-content-system)

---

## ✅ Setup Checklist

- [ ] Revoked exposed keys (Supabase, Anthropic, NextAuth)
- [ ] Created new Supabase project (or using existing)
- [ ] Copied DATABASE_URL from Supabase dashboard
- [ ] Copied SUPABASE_URL and SUPABASE_ANON_KEY
- [ ] Generated new NEXTAUTH_SECRET
- [ ] Updated `.env.local` with all new values
- [ ] Ran `npm run db:push` successfully
- [ ] Tested connection with `npm run db:test`
- [ ] Verified app runs with `npm run dev`
- [ ] Added Supabase environment variables to Vercel (if deploying)

---

**Need help?** Check the troubleshooting section above or open an issue in the repository.
