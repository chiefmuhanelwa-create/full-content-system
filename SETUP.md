# 🚀 NOCHILL Setup Guide

Complete step-by-step guide to get your NOCHILL web app running with authentication.

## ✅ STEP 1: Configure Environment Variables

Edit your `.env` file with your actual values:

```bash
# Database - Replace with your Neon connection string
DATABASE_URL="postgresql://your-neon-connection-string-here"

# Anthropic Claude API - Get from console.anthropic.com
ANTHROPIC_API_KEY="sk-ant-your-key-here"

# NextAuth.js - Generated secret below
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="NxwpHpNCfUEi1TcuZoR5XYScowZvu6Cg6ujY6RUfWsA="

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="NOCHILL Viral Script Generator"

# Google OAuth (OPTIONAL - Skip if you don't want Google login)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 🔑 Where to Get These Values

**1. DATABASE_URL (Neon)**
1. Go to https://console.neon.tech
2. Click on your project
3. Go to "Dashboard" → "Connection Details"
4. Copy the connection string
5. Should look like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

**2. ANTHROPIC_API_KEY**
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to "API Keys"
4. Create new key
5. Copy the key (starts with `sk-ant-`)

**3. NEXTAUTH_SECRET**
- Already generated for you: `NxwpHpNCfUEi1TcuZoR5XYScowZvu6Cg6ujY6RUfWsA=`
- Or generate a new one: `openssl rand -base64 32`

**4. GOOGLE_CLIENT_ID & SECRET (Optional)**
- Only needed if you want "Sign in with Google"
- Get from https://console.cloud.google.com
- Create OAuth 2.0 credentials
- Leave empty if you don't need it

---

## ✅ STEP 2: Install Dependencies

```bash
npm install
```

This will install all packages including the new authentication dependencies.

---

## ✅ STEP 3: Set Up Database (IMPORTANT!)

### Push Prisma Schema to Neon

```bash
npx prisma db push
```

This creates all the tables in your Neon database:
- ✅ users
- ✅ accounts
- ✅ sessions
- ✅ verification_tokens
- ✅ hooks
- ✅ scripts
- ✅ stories
- ✅ revenue
- ✅ calendar_entries

### Generate Prisma Client

```bash
npx prisma generate
```

---

## ✅ STEP 4: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ STEP 5: Test Authentication

### Create Your First Account

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 8 characters
4. Click "Create Account"
5. You'll be automatically signed in and redirected to the dashboard

### Sign In Again

1. Go to http://localhost:3000/auth/signin
2. Enter your email and password
3. Click "Sign In"
4. Redirected to dashboard

### Generate Your First Hooks

1. In the dashboard, click "Generate Hook"
2. Fill in:
   - Topic: e.g., "brand deals for creators"
   - Platform: Instagram
   - Target Audience: e.g., "creators making R0-5K/month"
   - Tone: Educational
3. Click "Generate 5 Hooks"
4. Watch the AI create custom hooks just for you!

---

## 🔍 Troubleshooting

### Error: "DATABASE_URL not found"
- Make sure you created the `.env` file in the root directory
- Check that DATABASE_URL is on its own line
- No quotes needed around the value

### Error: "Prisma Client not initialized"
```bash
npx prisma generate
```

### Error: "Table does not exist"
```bash
npx prisma db push
```

### Error: "Cannot connect to database"
- Check your Neon connection string is correct
- Make sure your Neon project is active
- Try copying the connection string again from Neon dashboard

### Error: "NEXTAUTH_SECRET is not set"
- Add the secret to your `.env` file
- Restart the dev server: `Ctrl+C` then `npm run dev`

### Error: 404 on /auth/signin
- Make sure you ran `npm install` after pulling the latest code
- Check that `app/api/auth/[...nextauth]/route.ts` exists
- Restart the dev server

---

## 📊 View Your Database

To see your data in Neon:

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 where you can:
- View all users
- See generated hooks
- Check scripts and stories
- Manage data

---

## 🎯 What's Working Now

✅ **Authentication**
- Email/password signup and signin
- Google OAuth signin (if configured)
- Session management
- Protected dashboard routes

✅ **Hook Generator**
- Knowledge-based AI generation
- Custom hooks for each user
- Target audience personalization
- Platform-specific optimization

✅ **Dashboard**
- User stats overview
- Quick action cards
- Recent hooks display
- Revenue breakdown (PAIDS)

✅ **Database**
- Users table with subscription plans
- Hooks storage with performance tracking
- Scripts with SEEDS structure
- Stories with 4-criteria validation
- Revenue tracking (PAIDS model)

---

## 🚀 Next Steps

### 1. Deploy to Production (Vercel)

```bash
# Push to GitHub
git add .
git commit -m "Add authentication system"
git push

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Add environment variables in Vercel dashboard
# 4. Deploy!
```

### 2. Add More Features

The system is ready for:
- ✨ Script Writer UI (API already built)
- ✨ Story Extractor UI (API already built)
- ✨ Pitch Builder module
- ✨ Fear Analyzer
- ✨ Content Calendar
- ✨ Revenue Tracker UI
- ✨ Hook Bank (save/organize)
- ✨ PDF export

### 3. Customize

- Update landing page with your brand
- Add your logo to `public/`
- Customize pricing plans
- Add payment processing (Stripe)

---

## 💡 Pro Tips

1. **Free Tier Limits**
   - Neon: 0.5GB storage (plenty to start)
   - Claude API: $5 free credit (about 500-1000 hook generations)
   - Vercel: Unlimited hobby projects

2. **Database Backups**
   ```bash
   # Export schema
   npx prisma db pull
   ```

3. **Reset Everything**
   ```bash
   # Clear database
   npx prisma db push --force-reset

   # Regenerate client
   npx prisma generate
   ```

4. **Check Logs**
   - Terminal shows all errors
   - Check Neon dashboard for database issues
   - Vercel dashboard shows deployment logs

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Anthropic API**: https://docs.anthropic.com
- **Neon Docs**: https://neon.tech/docs

---

## 🆘 Need Help?

1. Check error messages in terminal
2. Look at browser console (F12)
3. Review this setup guide
4. Check ARCHITECTURE.md for system design
5. Review DEPLOYMENT.md for production setup

---

**You're all set! Start creating viral content with NOCHILL! 🚀**
