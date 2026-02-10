# NOCHILL Content OS - Deployment Guide

This guide will help you deploy the NOCHILL Content OS to Vercel and configure all required environment variables.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- A PostgreSQL database (we recommend Neon for free tier)
- Node.js 18+ installed locally

## Step 1: Set Up a PostgreSQL Database

You need a PostgreSQL database for the application. We recommend using **Neon** (free tier available):

### Option A: Neon (Recommended)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string (it should start with `postgresql://`)
4. Save this for later - you'll need it for the `DATABASE_URL` environment variable

### Option B: Supabase

1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (Connection pooling, Transaction mode)
5. Save this for later

### Option C: Railway

1. Go to https://railway.app and sign up
2. Create a new PostgreSQL database
3. Copy the connection string from the database settings
4. Save this for later

## Step 2: Configure Environment Variables in Vercel

### 2.1 Access Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings** > **Environment Variables**

### 2.2 Add Required Variables

Add the following environment variables:

#### DATABASE_URL (Required)

- **Key:** `DATABASE_URL`
- **Value:** Your PostgreSQL connection string from Step 1
- **Example:** `postgresql://user:password@host.region.provider.com:5432/database?sslmode=require`
- **Environment:** Production, Preview, Development (check all)

⚠️ **Important:** The URL MUST start with `postgresql://` or `postgres://`

#### NEXTAUTH_SECRET (Required)

- **Key:** `NEXTAUTH_SECRET`
- **Value:** A random 32+ character string
- **Generate one with:**
  ```bash
  openssl rand -base64 32
  ```
  Or use: https://generate-secret.vercel.app/32
- **Environment:** Production, Preview, Development (check all)

#### NEXTAUTH_URL (Required)

- **Key:** `NEXTAUTH_URL`
- **Value:** Your Vercel deployment URL
- **Production:** `https://your-project-name.vercel.app`
- **Preview:** `https://your-project-name-git-branch.vercel.app`
- **Development:** `http://localhost:3000`

⚠️ **Note:** For Production, use your actual Vercel domain. You can set different values for each environment.

#### ANTHROPIC_API_KEY (Optional but Recommended)

- **Key:** `ANTHROPIC_API_KEY`
- **Value:** Your Anthropic API key from https://console.anthropic.com
- **Environment:** Production, Preview (optional for Development)

⚠️ **Note:** Without this, AI content generation features won't work.

#### GOOGLE_CLIENT_ID (Optional)

- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** Your Google OAuth client ID
- **Get from:** https://console.cloud.google.com

#### GOOGLE_CLIENT_SECRET (Optional)

- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** Your Google OAuth client secret
- **Get from:** https://console.cloud.google.com

## Step 3: Deploy to Vercel

### 3.1 First-Time Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3.2 From GitHub

1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables (as described in Step 2)
6. Deploy

## Step 4: Run Database Migrations

After your first deployment, you need to initialize the database:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npx prisma db seed
```

### Option B: From Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to **Settings** > **Functions**
3. Find the deployment function
4. Run the following command in your local terminal with the production DATABASE_URL:

```bash
DATABASE_URL="your_production_database_url" npx prisma migrate deploy
```

## Step 5: Verify Deployment

### 5.1 Check Health Endpoint

Visit: `https://your-project-name.vercel.app/api/health`

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

### 5.2 Test the Application

1. Visit your deployment URL
2. Try to sign up/login
3. Create a test content card or hook
4. Verify everything works

## Troubleshooting

### Error: "DATABASE_URL must start with postgresql://"

- Check that your `DATABASE_URL` in Vercel starts with `postgresql://` or `postgres://`
- Make sure there are no extra spaces or quotes around the URL
- Verify the URL is set for the correct environment (Production/Preview/Development)

### Error: "Invalid \`prisma.*.findMany()\` invocation"

- This usually means the DATABASE_URL is not set or invalid
- Double-check your environment variables in Vercel
- Make sure you've redeployed after adding the variables

### Error: "Can't reach database server"

- Verify your database is running and accessible
- Check if your database provider requires SSL (add `?sslmode=require` to the URL)
- Make sure your database allows connections from Vercel's IP ranges

### Database Connection Timeout

- Your database might be in sleep mode (common with free tiers)
- Try accessing it directly to wake it up
- Consider upgrading to a paid tier for always-on databases

## Environment Variables Summary

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| DATABASE_URL | ✅ Yes | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| NEXTAUTH_SECRET | ✅ Yes | Auth encryption key | Random 32+ chars |
| NEXTAUTH_URL | ✅ Yes | Your app URL | `https://your-app.vercel.app` |
| ANTHROPIC_API_KEY | ⚠️ Recommended | AI features | `sk-ant-...` |
| GOOGLE_CLIENT_ID | ❌ Optional | Google OAuth | From Google Console |
| GOOGLE_CLIENT_SECRET | ❌ Optional | Google OAuth | From Google Console |

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy to Vercel
3. ✅ Run database migrations
4. ✅ Verify deployment
5. 🎉 Start creating content!

## Support

If you encounter issues:
1. Check the health endpoint: `/api/health`
2. Review Vercel deployment logs
3. Verify all environment variables are set correctly
4. Check database connection and migrations

---

**Happy Creating! 🚀**
