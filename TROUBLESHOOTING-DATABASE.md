# Database Connection Troubleshooting Guide

## Error: "Can't reach database server at aws-1-eu-west-1.pooler.supabase.com"

This error occurs when the application cannot connect to your Supabase database. Here's how to fix it:

---

## 🚀 Quick Fix (Try This First)

### Step 1: Run the Fix Script
```bash
bash scripts/fix-database-connection.sh
```

### Step 2: Restart Your Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Try Your Action Again
The error should now be resolved.

---

## 📋 Manual Fix Steps

If the quick fix doesn't work, follow these steps:

### 1. Regenerate Prisma Client
```bash
npx prisma generate
```

### 2. Verify Environment Variables

Check your `.env` file has the correct values:

```bash
# Should use port 6543 for connection pooling
DATABASE_URL="postgresql://postgres.sknplhjxofqswjnvpnnh:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Should use port 5432 for direct connection (migrations)
DIRECT_URL="postgresql://postgres.sknplhjxofqswjnvpnnh:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

**Important:**
- DATABASE_URL uses **port 6543** (pooler)
- DIRECT_URL uses **port 5432** (direct)
- Replace `YOUR_PASSWORD` with your actual Supabase password

### 3. Check Prisma Schema

Your `prisma/schema.prisma` should have:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 4. Restart Development Server
```bash
npm run dev
```

---

## 🔍 Common Causes & Solutions

### Issue 1: Wrong Port Number
**Symptom:** Error shows port 5432 instead of 6543

**Solution:**
- Ensure DATABASE_URL uses port **6543** (pooler)
- Run `npx prisma generate` to regenerate client
- Restart your dev server

### Issue 2: Supabase Project Paused
**Symptom:** Connection timeout or "can't reach database"

**Solution:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Check if your project status is "Active"
3. If paused, click to resume it
4. Wait 30-60 seconds for it to wake up
5. Try again

### Issue 3: Incorrect Password
**Symptom:** Authentication failed errors

**Solution:**
1. Go to Supabase Dashboard → Settings → Database
2. Get a fresh connection string
3. Update your `.env` file with the correct password
4. Restart your dev server

### Issue 4: Network/Firewall Issues
**Symptom:** Timeout or connection refused

**Solution:**
- Check your internet connection
- Try disabling VPN if you're using one
- Check if your firewall is blocking Supabase (port 6543)
- Try from a different network to isolate the issue

### Issue 5: Cached Prisma Client
**Symptom:** Changes to .env don't take effect

**Solution:**
```bash
# Delete node_modules/.prisma
rm -rf node_modules/.prisma

# Regenerate Prisma client
npx prisma generate

# Restart dev server
npm run dev
```

---

## 🧪 Testing Database Connection

### Test 1: Check Environment Variables
```bash
# In your terminal:
echo $DATABASE_URL
```
Should show your connection string with port 6543.

### Test 2: Test Prisma Connection
```bash
npx prisma db pull --schema=prisma/schema.prisma
```
This should connect without errors.

### Test 3: Check Database Tables
```bash
npx prisma studio
```
Opens Prisma Studio - if this works, your connection is fine.

---

## 🌐 Production (Vercel) Issues

If you're getting this error on Vercel:

### 1. Check Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Ensure you have:
- `DATABASE_URL` (with port 6543)
- `DIRECT_URL` (with port 5432)

### 2. Redeploy
After updating environment variables:
```bash
git push origin your-branch
```
Or trigger a redeploy from Vercel dashboard.

### 3. Check Build Logs
Look for Prisma generation errors in the build logs.

---

## 📞 Still Not Working?

### Verify Supabase Configuration

1. **Get Fresh Connection Strings:**
   - Go to Supabase Dashboard
   - Settings → Database
   - Look for "Connection Pooling" section
   - Copy both:
     - Connection pooling string (port 6543) → DATABASE_URL
     - Direct connection string (port 5432) → DIRECT_URL

2. **Test Direct Connection:**
   Try using the direct connection (without pooling) temporarily:
   ```bash
   # In .env, temporarily use:
   DATABASE_URL="postgresql://postgres.sknplhjxofqswjnvpnnh:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
   ```
   If this works, there might be an issue with connection pooling.

3. **Check Supabase Status:**
   Visit [status.supabase.com](https://status.supabase.com) to check for outages

---

## 🔐 Security Checklist

Before sharing logs or asking for help:
- ✅ Remove your password from connection strings
- ✅ Use environment variable names instead of actual values
- ✅ Don't commit `.env` file to git (it should be in `.gitignore`)

---

## 📚 Related Documentation

- [Supabase Database Setup](./SUPABASE-SETUP.md)
- [Button Fix Guide](./BUTTON-FIX-GUIDE.md)
- [Environment Variables Guide](./ENV-SETUP.md)

---

## 💡 Prevention Tips

1. **Always use environment variables** for database credentials
2. **Test locally** before deploying to production
3. **Keep Prisma client up to date** when changing .env
4. **Use the fix script** whenever you update database configuration
5. **Monitor Supabase usage** to avoid project pausing

---

**Last Updated:** 2026-02-10
**Related Error Codes:** P1001, P1008, P1011
