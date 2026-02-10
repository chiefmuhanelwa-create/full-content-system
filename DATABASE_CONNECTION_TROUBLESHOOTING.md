# 🔧 Database Connection Troubleshooting Guide

## Error: "Can't reach database server at `db.sknplhjxofqswjnvpnnh.supabase.co:5432`"

This guide will help you resolve database connectivity issues.

---

## ✅ Quick Fixes (Try These First)

### 1. Check if Supabase Database is Active

Your Supabase database might be paused (common on free tier):

1. Go to: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh
2. Look for any "paused" or "inactive" warnings
3. Click **"Resume"** or **"Restore"** if you see it
4. Wait 30-60 seconds for the database to wake up

### 2. Verify IP Allow List

Supabase might be blocking connections:

1. Go to: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh/settings/database
2. Scroll to **"Network Restrictions"** or **"Connection Pooling"**
3. Make sure **"Restrict access to trusted IP addresses"** is **DISABLED**
4. Or add `0.0.0.0/0` to allow all IPs (for development only)

### 3. Use Connection Pooling URL

You might need the pooled connection instead of direct connection:

**Current:** `postgresql://postgres:tfAvOY6xpG1hO4S0@db.sknplhjxofqswjnvpnnh.supabase.co:5432/postgres`

**Try this instead (Connection Pooling):**

Go to: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh/settings/database

Look for **"Connection string"** → **"Connection pooling"** tab

Copy the URI (should look like):
```
postgresql://postgres.sknplhjxofqswjnvpnnh:tfAvOY6xpG1hO4S0@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Update your `DATABASE_URL` with this new format.

---

## 🔎 Detailed Diagnostics

### Test 1: Check Database Status

Run this command to see if the database is reachable:

```bash
# Test with psql
psql "postgresql://postgres:tfAvOY6xpG1hO4S0@db.sknplhjxofqswjnvpnnh.supabase.co:5432/postgres" -c "SELECT 1;"

# Or test with curl (check if port is open)
nc -zv db.sknplhjxofqswjnvpnnh.supabase.co 5432
```

### Test 2: Verify Environment Variables

Make sure your environment variables are set correctly:

```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test Prisma connection
npx prisma db execute --stdin <<< "SELECT 1 as test;"
```

### Test 3: Check Prisma Connection

```bash
# Generate Prisma Client (if not done)
npx prisma generate

# Try to connect
npx prisma db push --skip-generate
```

---

## 🌐 Environment-Specific Solutions

### If Running on Vercel:

1. **Check Environment Variables**
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify `DATABASE_URL` is set correctly
   - Make sure it's enabled for Production/Preview/Development

2. **Redeploy**
   - After updating environment variables
   - Go to Deployments → Latest → Click "..." → "Redeploy"

3. **Check Build Logs**
   - Go to your deployment
   - Check "Build Logs" for any Prisma errors
   - Look for "Functions" logs for runtime errors

### If Running on GitHub Codespaces:

1. **Check `.env` file exists**
   ```bash
   cat .env
   ```

2. **Reload environment variables**
   ```bash
   source .env
   ```

3. **Test network connectivity**
   ```bash
   curl -v https://sknplhjxofqswjnvpnnh.supabase.co
   ```

### If Running Locally:

1. **Check `.env.local` or `.env` file**
   - Make sure it exists in project root
   - Verify `DATABASE_URL` is set

2. **Restart development server**
   ```bash
   npm run dev
   ```

3. **Check your firewall/antivirus**
   - Make sure it's not blocking outbound connections to Supabase

---

## 🔧 Alternative Connection Strings

Try these different formats:

### Option 1: Direct Connection (IPv6)
```
postgresql://postgres:tfAvOY6xpG1hO4S0@db.sknplhjxofqswjnvpnnh.supabase.co:5432/postgres
```

### Option 2: Connection Pooling (Recommended for Prisma)
```
postgresql://postgres.sknplhjxofqswjnvpnnh:tfAvOY6xpG1hO4S0@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Option 3: Transaction Mode (For migrations)
```
postgresql://postgres.sknplhjxofqswjnvpnnh:tfAvOY6xpG1hO4S0@aws-0-[region].pooler.supabase.com:5432/postgres
```

**To get the exact pooling URL:**
1. Go to: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh/settings/database
2. Find "Connection string" section
3. Click "Connection pooling" tab
4. Select "URI" format
5. Copy the full string

---

## 🚨 Common Mistakes

### ❌ Wrong: Using placeholder password
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@...
```

### ✅ Correct: Using actual password
```
DATABASE_URL=postgresql://postgres:tfAvOY6xpG1hO4S0@...
```

### ❌ Wrong: Missing quotes in .env
```
DATABASE_URL=postgresql://postgres:password with spaces@...
```

### ✅ Correct: Using quotes for special characters
```
DATABASE_URL="postgresql://postgres:password with spaces@..."
```

### ❌ Wrong: Using direct connection with Prisma (can cause pooling issues)
```
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
```

### ✅ Correct: Using connection pooling for Prisma
```
DATABASE_URL=postgresql://...@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 🆘 Still Not Working?

### Check Supabase Service Status
- Go to: https://status.supabase.com
- Check if there are any ongoing incidents

### Verify Your Supabase Plan
- Free tier databases pause after inactivity
- Check: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh/settings/general
- Consider upgrading to Pro if you need 24/7 uptime

### Contact Support
- Supabase Support: https://supabase.com/dashboard/support/new
- Include your project reference: `sknplhjxofqswjnvpnnh`

---

## 📋 Connection Checklist

- [ ] Supabase database is active (not paused)
- [ ] IP restrictions are disabled or allow your IP
- [ ] Using correct connection string format
- [ ] Environment variables are set correctly
- [ ] Tried connection pooling URL
- [ ] Verified password is correct (no placeholders)
- [ ] Checked Supabase service status
- [ ] Restarted application/redeployed
- [ ] Ran `npx prisma generate`
- [ ] Network allows outbound connections to Supabase

---

## ✅ Success Test

Once connected, run this to verify:

```bash
# Test database connection
npm run db:test

# Or run a simple query
npx prisma db execute --stdin <<< "SELECT current_database(), current_user;"
```

---

## 🔐 Security Reminder

- Never commit your actual `DATABASE_URL` to Git
- Use environment variables in production
- Rotate passwords if exposed
- Enable IP restrictions in production

---

**Your Database Details:**
- Project: `sknplhjxofqswjnvpnnh`
- Region: Check in Supabase dashboard
- Host: `db.sknplhjxofqswjnvpnnh.supabase.co`
- Port: `5432` (direct) or `6543` (pooled)
