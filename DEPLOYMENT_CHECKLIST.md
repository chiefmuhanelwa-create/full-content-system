# 🚀 NOCHILL Content OS - Deployment Checklist

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure all these items are completed:

### 1. Environment Variables

#### ✅ Required Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environments | Description |
|----------|-------|--------------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_r8dSqmMYNh7X@ep-lingering-field-ais25y1f.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development | Neon PostgreSQL database connection |
| `NEXTAUTH_SECRET` | `3SkkrAMs/1DS6lSa96AmJqAjVKrIW1lY93LlKlbuh4s=` | Production, Preview, Development | NextAuth.js encryption secret |
| `NEXTAUTH_URL` | `https://full-content-system-nochill.vercel.app` | Production | Production URL for NextAuth |
| `NEXTAUTH_URL` | Auto (Vercel sets this) | Preview | Leave blank for preview deployments |

#### ⚠️ Optional Environment Variables

| Variable | Value | Environments | Description |
|----------|-------|--------------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Production, Preview, Development | Claude AI API key (if using AI features) |
| `GOOGLE_CLIENT_ID` | Your Google Client ID | Production, Preview | Google OAuth (if enabled) |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | Production, Preview | Google OAuth (if enabled) |

### 2. Database Setup

- [ ] Neon database is active (not suspended)
- [ ] Database schema is up to date
- [ ] All migrations have been run
- [ ] Database connection string is correct

```bash
# Verify locally before deploying
npm run db:setup
```

### 3. Build Verification

- [ ] Application builds successfully locally
- [ ] No TypeScript errors
- [ ] No console errors in development
- [ ] All critical pages load without errors

```bash
# Test production build locally
npm run build
npm start
```

### 4. Code Quality

- [ ] All changes committed to git
- [ ] Commit messages are descriptive
- [ ] No sensitive data in code
- [ ] `.env` and `.env.local` not committed

### 5. Vercel Configuration

- [ ] `vercel.json` is properly configured
- [ ] Build command is correct: `npm run build`
- [ ] Output directory is set: `.next`
- [ ] Framework is set to: `nextjs`

---

## 🛠️ Deployment Steps

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/nochill/full-content-system)
2. Navigate to **Settings** → **Environment Variables**
3. Add all required variables from the table above
4. Click **Save** after each variable

**CRITICAL:** Make sure `DATABASE_URL` is set correctly. This is the #1 cause of deployment failures.

### Step 2: Trigger Deployment

#### Option A: Push to GitHub (Recommended)
```bash
git add .
git commit -m "fix: Configure environment variables for Vercel deployment"
git push -u origin claude/nochill-web-app-26Yi8
```

Vercel will automatically deploy when you push to the branch.

#### Option B: Manual Redeploy
1. Go to **Deployments** tab in Vercel
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

### Step 3: Monitor Deployment

1. Watch the build logs in real-time
2. Look for any errors during:
   - Dependency installation
   - Prisma client generation
   - Next.js build
   - API route compilation

### Step 4: Verify Deployment

Once deployed, test these critical endpoints:

#### API Endpoints
- ✅ `/api/auth/session` - Authentication status
- ✅ `/api/hook-bank/list` - Hook Bank API
- ✅ `/api/content-card/list` - Content Cards API
- ✅ `/api/story-bank/list` - Story Bank API
- ✅ `/api/icp-pain/list` - ICP Pain Library API
- ✅ `/api/products/list` - Products API

#### Dashboard Pages
- ✅ `/` - Homepage loads
- ✅ `/dashboard` - Main dashboard loads
- ✅ `/dashboard/content-cards` - Content Cards page
- ✅ `/dashboard/hook-bank` - Hook Bank page
- ✅ `/dashboard/story-bank` - Story Bank page
- ✅ `/dashboard/icp-pain-library` - ICP Pain Library page
- ✅ `/dashboard/products` - Products page

### Step 5: Check Vercel Logs

1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Look for:
   - ❌ Any runtime errors
   - ❌ Database connection errors
   - ❌ Prisma initialization errors
   - ✅ Successful API responses

---

## 🐛 Troubleshooting Guide

### Issue: Database Connection Error

**Error Message:**
```
PrismaClientInitializationError: the URL must start with the protocol `postgresql://` or `postgres://`
```

**Solutions:**
1. ✅ Verify `DATABASE_URL` is set in Vercel environment variables
2. ✅ Check that the value starts with `postgresql://`
3. ✅ Remove any extra quotes or spaces
4. ✅ Ensure all environments are selected (Production, Preview, Development)
5. ✅ Redeploy after adding the variable

**Quick Fix:**
- See: [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md)

### Issue: Build Fails

**Common Causes:**
1. TypeScript errors in code
2. Missing dependencies in `package.json`
3. Incorrect build command
4. Prisma client not generated

**Solutions:**
```bash
# Test build locally first
npm run build

# If Prisma errors, regenerate client
npx prisma generate

# If dependency errors, clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: Runtime Errors (500)

**Causes:**
1. Database not accessible
2. Environment variables missing
3. API route errors

**Solutions:**
1. Check Vercel function logs
2. Verify all environment variables
3. Test API routes individually
4. Check Neon database status

### Issue: Authentication Errors

**Causes:**
1. `NEXTAUTH_SECRET` not set
2. `NEXTAUTH_URL` incorrect
3. Cookie domain issues

**Solutions:**
1. Set `NEXTAUTH_SECRET` in Vercel
2. Update `NEXTAUTH_URL` to match your domain
3. Clear browser cookies and try again

---

## 📊 Post-Deployment Verification

### Automated Tests

Run these tests after deployment:

```bash
# Test all API endpoints
curl https://full-content-system-nochill.vercel.app/api/hook-bank/list
curl https://full-content-system-nochill.vercel.app/api/content-card/list
curl https://full-content-system-nochill.vercel.app/api/story-bank/list
```

Expected response: `{ "success": true, "hooks": [] }` or similar

### Manual Tests

- [ ] Homepage loads without errors
- [ ] Dashboard is accessible
- [ ] All navigation links work
- [ ] Can create/edit content cards
- [ ] Can create/edit hooks
- [ ] Database operations work
- [ ] No console errors in browser

### Performance Checks

- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No serverless function timeouts
- [ ] Database queries are optimized

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you:
- Push to `claude/nochill-web-app-26Yi8` branch
- Create a pull request
- Merge to main branch

### Deployment Environments

| Environment | Trigger | URL Pattern |
|-------------|---------|-------------|
| Production | Push to main | `full-content-system-nochill.vercel.app` |
| Preview | Push to feature branch | `full-content-system-{hash}-nochill.vercel.app` |
| Development | Manual deploy | Custom URL |

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ All environment variables are set
✅ Build completes without errors
✅ All pages load successfully
✅ Database connection works
✅ API endpoints return expected data
✅ No errors in Vercel function logs
✅ Authentication works correctly
✅ Performance is acceptable

---

## 📚 Additional Resources

- [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md) - Database connection fix
- [DATABASE_FIX_README.md](./DATABASE_FIX_README.md) - Local database setup
- [README.md](./README.md) - Main project documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

**Last Updated:** February 10, 2026
**Deployment Status:** Pending environment variable configuration
