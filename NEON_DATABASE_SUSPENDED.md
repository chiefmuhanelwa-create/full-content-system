# 💤 Neon Database Suspended - Quick Fix Guide

## 🔍 What's Happening?

Your error message shows:
```
Can't reach database server at `ep-lingering-field-ais25y1f.us-east-1.aws.neon.tech:5432`
```

**This means:**
- ✅ DATABASE_URL is correctly configured
- ✅ Prisma client is working properly
- ❌ **Neon database is SUSPENDED** (free tier auto-suspend feature)

## 🚀 Quick Fix (Takes 30 seconds)

### Step 1: Wake Up Your Database

1. Go to [Neon Console](https://console.neon.tech)
2. Log in to your account
3. Click on your project: **neondb**
4. The database will automatically wake up when you access it

**That's it!** The database will activate within 10-30 seconds.

### Step 2: Test the Connection

After waking up the database, test it:

```bash
# Run the database setup script
npm run db:setup

# Or test directly with Prisma
npx prisma db push
```

### Step 3: Restart Your Dev Server

```bash
npm run dev
```

Your application should now connect successfully!

---

## 📚 Understanding Neon Free Tier Suspension

### Why Does This Happen?

Neon's free tier automatically suspends databases after **5 minutes of inactivity** to save resources. This is normal and expected behavior.

### When Will It Suspend?

- After 5 minutes without any database queries
- During periods of no development activity
- Overnight or between work sessions

### How to Wake It Up?

**Option 1: Via Neon Console** (Recommended)
- Visit [console.neon.tech](https://console.neon.tech)
- Click on your project
- Wait 10-30 seconds for activation

**Option 2: Via Database Connection**
- Try to connect to the database
- First connection will fail (wakes up the database)
- Wait 10-30 seconds
- Try again - should work

**Option 3: Automatic Wake-Up**
- Any connection attempt triggers wake-up
- Just retry your request after 30 seconds

---

## 🛠️ Testing Your Connection

### Quick Test Script

We've created a simple test script to verify your database connection:

```bash
npm run db:test
```

This will:
1. Check if DATABASE_URL is configured
2. Validate the connection string format
3. Attempt to connect to the database
4. Run a simple query
5. Report the status

### Manual Test

```bash
# Test Prisma connection
npx prisma db push --skip-generate

# If successful, you'll see:
# ✓ Database connection successful
```

---

## 🔄 Preventing Suspension (Optional)

### For Development

If you're actively developing and don't want interruptions:

**Option 1: Keep-Alive Script**

Create a simple script that pings your database every 4 minutes:

```bash
# Install pm2 globally (optional)
npm install -g pm2

# Create keep-alive script
echo 'setInterval(async () => {
  const { db } = require("./lib/db.ts");
  if (db) {
    await db.$queryRaw\`SELECT 1\`;
    console.log("Database keep-alive ping");
  }
}, 240000);' > db-keep-alive.js

# Run it in background (optional)
pm2 start db-keep-alive.js
```

**Option 2: Upgrade to Paid Tier**

Neon's paid plans don't have auto-suspension:
- **Launch Plan**: $19/month - No auto-suspend
- **Scale Plan**: $69/month - No auto-suspend + more resources

Visit: [https://neon.tech/pricing](https://neon.tech/pricing)

### For Production

**IMPORTANT:** For production deployments (Vercel), you should:

1. **Use Neon's Production Plan** - No auto-suspend
2. **Or use Vercel's Postgres** - Integrated solution
3. **Or use another provider** - Supabase, Railway, PlanetScale

Free tier is fine for development, but NOT recommended for production.

---

## 🐛 Troubleshooting

### Issue: Database won't wake up after 30 seconds

**Solutions:**
1. Hard refresh the Neon console page
2. Check Neon status page: [https://neonstatus.com](https://neonstatus.com)
3. Try accessing a different project, then back to yours
4. Contact Neon support if issue persists

### Issue: "Database not found" error

**This is different from suspension:**
```
Database `neondb` does not exist
```

**Solutions:**
1. Verify your DATABASE_URL is correct
2. Check the database name in Neon console
3. Run migrations: `npx prisma db push`

### Issue: Authentication errors

```
Authentication failed: password authentication failed
```

**Solutions:**
1. Your password may have been rotated
2. Get a fresh connection string from Neon console
3. Update .env.local with new DATABASE_URL
4. Restart your dev server

---

## 📊 Connection Status Check

Run this command to check your current status:

```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL | head -c 30

# Test Prisma connection
npx prisma db pull --preview-feature
```

Expected output for **suspended database:**
```
Error: Can't reach database server
```

Expected output for **active database:**
```
✓ Introspecting database schema
```

---

## 🎯 Summary

**For "Can't reach database server" errors:**

1. ✅ Go to [console.neon.tech](https://console.neon.tech)
2. ✅ Click your project to wake it up
3. ✅ Wait 10-30 seconds
4. ✅ Retry your connection
5. ✅ Continue developing!

**This is NOT a configuration error** - your setup is correct. This is just Neon's free tier behavior.

---

## 📞 Need Help?

- **Neon Support:** [https://neon.tech/docs/introduction](https://neon.tech/docs/introduction)
- **Neon Discord:** [https://discord.gg/neon](https://discord.gg/neon)
- **Project Documentation:** See `DATABASE_FIX_README.md` for setup issues

---

**Last Updated:** February 10, 2026
**Status:** Common issue - database suspension is normal for Neon free tier
