# 🚨 Fix Database Connection Error on Vercel

If you're seeing errors like `"the URL must start with the protocol postgresql:// or postgres://"` on your Vercel deployment, it means your `DATABASE_URL` environment variable is not configured.

## Quick Fix (5 minutes)

### Step 1: Get a Free PostgreSQL Database

Choose one of these free providers:

#### Option A: Neon (Recommended - Easiest Setup)

1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Click "Create Project"
4. Copy the connection string (starts with `postgresql://`)
5. Save it for Step 2

#### Option B: Supabase

1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the "Connection Pooling" string (Transaction mode)
5. Save it for Step 2

#### Option C: Railway

1. Go to https://railway.app
2. Create a new project → Add PostgreSQL
3. Click on the PostgreSQL service
4. Copy the "Postgres Connection URL"
5. Save it for Step 2

### Step 2: Add DATABASE_URL to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Add a new environment variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Paste your connection string from Step 1
   - **Environments:** Check all three (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **...** (three dots menu)
4. Select **Redeploy**
5. Wait for deployment to complete

### Step 4: Verify

Visit your deployment URL and check if the pages now load:
- `/dashboard/products`
- `/dashboard/hook-bank`
- `/dashboard/content-cards`
- `/dashboard/story-bank`

---

## Additional Environment Variables (Optional)

While you're in Vercel environment variables, you may also want to add:

### NEXTAUTH_SECRET (Required for authentication)
```bash
# Generate a secret key
openssl rand -base64 32
```
Or use: https://generate-secret.vercel.app/32

Add it as:
- **Name:** `NEXTAUTH_SECRET`
- **Value:** Your generated secret
- **Environments:** All

### NEXTAUTH_URL (Required)
- **Name:** `NEXTAUTH_URL`
- **Value:** Your Vercel deployment URL (e.g., `https://full-content-system-ncttkj4we-nochill.vercel.app`)
- **Environments:** Production

### ANTHROPIC_API_KEY (Optional - for AI features)
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** Your API key from https://console.anthropic.com
- **Environments:** Production, Preview

---

## Troubleshooting

### Error: "Can't reach database server"
- Your database might be in sleep mode (free tier)
- Try accessing the database directly to wake it up
- Wait a minute and refresh your Vercel deployment

### Error persists after adding DATABASE_URL
- Make sure the URL starts with `postgresql://` or `postgres://`
- Check there are no extra spaces or quotes around the URL
- Verify you selected all environments (Production, Preview, Development)
- Try redeploying again

### Need to run database migrations?
After first deployment with DATABASE_URL configured:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

---

## Health Check

You can check if your database is connected by visiting:
```
https://your-deployment-url.vercel.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "checks": {
    "environment": { "status": "pass" },
    "database": { "status": "pass" }
  }
}
```

---

## Still Having Issues?

Check the full deployment guide: `/docs/DEPLOYMENT.md`

Or verify your environment variables are correct:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Confirm `DATABASE_URL` is listed for all environments
4. Click "Edit" to verify the value starts with `postgresql://`

---

**After following these steps, your application should work perfectly! 🎉**
