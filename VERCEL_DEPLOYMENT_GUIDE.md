# 🚀 Vercel Deployment Guide - NOCHILL Content OS

## Quick Deploy to Vercel

Since you can't run the app locally, follow these steps to deploy directly to Vercel:

---

## Step 1: Connect Your Repository to Vercel

1. Go to: https://vercel.com/new
2. Sign in with GitHub
3. Import your repository: `full-content-system`
4. Select the branch: `claude/nochill-web-app-26Yi8`
5. **DON'T click Deploy yet!** - We need to add environment variables first

---

## Step 2: Add Environment Variables

In the Vercel import screen, scroll down to **"Environment Variables"** section and add these:

### Required Environment Variables:

**⚠️ IMPORTANT: Use your actual values from your `.env` file. The values below are placeholders.**

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_nextauth_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app

# Supabase Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sknplhjxofqswjnvpnnh.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sknplhjxofqswjnvpnnh.supabase.co:5432/postgres

# Supabase Client
SUPABASE_URL=https://sknplhjxofqswjnvpnnh.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
```

**📝 Where to find your actual values:**
- Check your local `.env` file that was configured earlier
- Or retrieve them from the original sources (Supabase dashboard, Anthropic console, etc.)
- **DO NOT commit your actual API keys to the repository**

### How to Add Each Variable:

1. In the "Environment Variables" section on Vercel
2. For each variable above:
   - **Key**: Enter the variable name (e.g., `NEXTAUTH_SECRET`)
   - **Value**: Enter the value (e.g., `lsoDVAsmT2kGRHqJNj46p5hglQTbEN3gNUa9gS89nck=`)
   - **Environments**: Select all three (Production, Preview, Development)
3. Click **"Add"** after each variable

---

## Step 3: Update NEXTAUTH_URL After First Deploy

⚠️ **Important:** The `NEXTAUTH_URL` needs to be updated after your first deployment.

1. For now, set it to: `https://your-app-name.vercel.app`
2. After deployment, Vercel will give you the actual URL
3. Go to: **Project Settings** → **Environment Variables**
4. Update `NEXTAUTH_URL` with your real Vercel URL (e.g., `https://nochill-content-os.vercel.app`)
5. Redeploy for changes to take effect

---

## Step 4: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Wait 2-5 minutes for the build to complete
3. Vercel will show you the deployment URL

---

## Step 5: Initialize Database (IMPORTANT!)

Your database tables need to be created. After your first deployment:

### Option A: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Generate Prisma Client and push schema
vercel env pull .env.local
npm run db:push
```

### Option B: Use Prisma Studio Online

1. Go to your Supabase dashboard: https://sknplhjxofqswjnvpnnh.supabase.co
2. Navigate to **SQL Editor**
3. Run the SQL commands from your Prisma schema manually

### Option C: Push from GitHub Codespaces (Easiest)

1. Open your repository in GitHub Codespaces
2. Create a `.env` file with your environment variables
3. Run:
   ```bash
   npm install
   npm run db:push
   ```

---

## Step 6: Verify Deployment

Once deployed, test these URLs:

1. **Homepage**: `https://your-app.vercel.app/`
2. **Health Check**: `https://your-app.vercel.app/api/health`
3. **Sign In**: `https://your-app.vercel.app/auth/signin`

---

## 🔧 Troubleshooting

### Build Fails with "DATABASE_URL not found"
- Make sure all environment variables are added in Vercel dashboard
- Check that you selected all three environments (Production, Preview, Development)

### "Can't reach database server"
- Verify your DATABASE_URL is correct
- Check that Supabase database is active (not paused)
- Ensure you've run `npm run db:push` to create tables

### NextAuth Errors
- Update `NEXTAUTH_URL` to match your actual Vercel URL
- Regenerate `NEXTAUTH_SECRET` if needed: `openssl rand -base64 32`

### Prisma Schema Not Applied
- You need to run `npm run db:push` at least once to create database tables
- Use one of the methods in Step 5 above

---

## 🎯 Quick Deploy Checklist

- [ ] Connected GitHub repository to Vercel
- [ ] Added all 7 environment variables
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete
- [ ] Updated `NEXTAUTH_URL` with actual Vercel URL
- [ ] Ran `npm run db:push` to create database tables
- [ ] Tested the deployed app
- [ ] Verified database connection works

---

## 📱 Alternative: GitHub Codespaces

If you want a cloud development environment instead:

1. Go to your GitHub repository
2. Click **Code** → **Codespaces** → **Create codespace on claude/nochill-web-app-26Yi8**
3. Wait for environment to load
4. Create `.env` file with your environment variables
5. Run:
   ```bash
   npm install
   npm run db:push
   npm run dev
   ```
6. Codespaces will forward port 3000 and give you a preview URL

---

## 🔐 Security Notes

- Your environment variables are safely stored in Vercel
- Never commit `.env` files to GitHub
- Rotate your API keys if they've been exposed
- Use different keys for production and development

---

## 🆘 Need Help?

- Check deployment logs in Vercel dashboard
- Review Supabase connection status
- Check Prisma schema applied: https://sknplhjxofqswjnvpnnh.supabase.co

---

**Your Configuration Summary:**
- Database: Supabase PostgreSQL
- Auth: NextAuth with credentials
- AI: Claude (Anthropic)
- Hosting: Vercel
- Branch: `claude/nochill-web-app-26Yi8`
