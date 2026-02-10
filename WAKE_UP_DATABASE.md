# 💤 Wake Up Your Neon Database - Step by Step

## Quick Method: SQL Editor (Recommended)

### Step 1: Open Neon SQL Editor

1. Go to [console.neon.tech](https://console.neon.tech)
2. Log in to your account
3. Select your project: **neondb**
4. Click **"SQL Editor"** in the left sidebar

### Step 2: Run Wake-Up Query

Copy and paste this into the SQL Editor:

```sql
-- Wake up the database
SELECT NOW() as current_time,
       version() as postgres_version,
       current_database() as database_name;
```

Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Expected Output:**
```
current_time          | postgres_version           | database_name
2026-02-10 12:34:56  | PostgreSQL 16.x on x86_64  | neondb
```

✅ **Database is now awake!**

### Step 3: Verify Tables Exist

Run this query to check your database tables:

```sql
-- List all tables
SELECT table_name,
       (SELECT COUNT(*)
        FROM information_schema.columns
        WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output** (if tables exist):
```
table_name              | column_count
accounts                | 11
activity_logs           | 10
calendar_entries        | 11
content_cards           | 45
content_calendar_plus   | 21
...
```

### Step 4: Create Tables (If Missing)

If Step 3 shows NO tables or you get an error, you need to create them.

**In your terminal** (not SQL editor), run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# This will output:
# ✓ Generated Prisma Client
# Your database is now in sync with your Prisma schema
```

### Step 5: Test Connection from Your App

Now test the connection from your application:

```bash
npm run db:test
```

**Expected Output:**
```
✅ DATABASE_URL is set
✅ DATABASE_URL format is valid
✅ Prisma client created successfully
✅ Connected to database successfully
✅ Test query executed successfully
✅ Database schema exists
```

### Step 6: Start Your Dev Server

```bash
npm run dev
```

Visit your app at `http://localhost:3000` - it should now connect to the database!

---

## Alternative: Command Line Wake-Up

If you prefer using the terminal instead of SQL Editor:

```bash
# Install psql (if not already installed)
# For Mac:
# brew install postgresql

# For Ubuntu/Debian:
# sudo apt-get install postgresql-client

# Connect and wake up database
psql "postgresql://neondb_owner:npg_r8dSqmMYNh7X@ep-lingering-field-ais25y1f.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT NOW();"
```

---

## Troubleshooting

### Issue: "Connection timed out"

**Cause:** Database is still waking up

**Solution:**
1. Wait 30 seconds
2. Try the query again
3. Check [neonstatus.com](https://neonstatus.com) for service status

### Issue: "SSL connection error"

**Cause:** Missing `sslmode=require` parameter

**Solution:**
Ensure your DATABASE_URL includes `?sslmode=require` at the end

### Issue: "Authentication failed"

**Cause:** Password may have been rotated

**Solution:**
1. Go to Neon console
2. Click on "Connection Details"
3. Copy the fresh connection string
4. Update `.env.local`
5. Restart your dev server

### Issue: Tables still don't exist after `prisma db push`

**Cause:** Prisma couldn't connect or schema has errors

**Solution:**
```bash
# Check Prisma schema for errors
npx prisma validate

# Force push with data loss (development only!)
npx prisma db push --accept-data-loss

# Check detailed logs
npx prisma db push --skip-generate
```

---

## Keeping Database Awake (Optional)

### For Active Development

If you're developing and don't want interruptions every 5 minutes:

```bash
# Create a keep-alive script
cat > scripts/keep-database-alive.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function keepAlive() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[${new Date().toISOString()}] Database keep-alive ping`);
  } catch (error) {
    console.error('Keep-alive failed:', error.message);
  }
}

// Ping every 4 minutes (before the 5-minute suspension)
setInterval(keepAlive, 4 * 60 * 1000);
keepAlive(); // Initial ping

console.log('Database keep-alive started (pinging every 4 minutes)');
EOF

# Run it in background
node scripts/keep-database-alive.js &
```

**Stop it when done:**
```bash
pkill -f "keep-database-alive"
```

---

## Production Note

⚠️ **Important:** Neon free tier auto-suspension is NOT suitable for production use.

For production, you have these options:

1. **Upgrade to Neon Launch Plan** ($19/month)
   - No auto-suspension
   - Better performance
   - More storage

2. **Use Vercel Postgres**
   - Integrated with Vercel
   - No suspension issues
   - Pay-as-you-go pricing

3. **Use Supabase**
   - Free tier doesn't suspend
   - Includes auth and storage
   - Good for full-stack apps

4. **Use Railway/Render**
   - Generous free tiers
   - No suspension
   - Easy deployment

---

## Quick Reference

| Action | Command |
|--------|---------|
| Wake up database | Visit console.neon.tech or run query |
| Test connection | `npm run db:test` |
| Create tables | `npx prisma db push` |
| Verify tables | SQL Editor → `SELECT * FROM information_schema.tables` |
| Start dev server | `npm run dev` |

---

**Last Updated:** February 10, 2026
**Status:** Use this guide whenever you see "Can't reach database server" errors
