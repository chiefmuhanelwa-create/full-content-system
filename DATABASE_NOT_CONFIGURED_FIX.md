# Fix: "Database is not configured" Error

## 🚨 Problem
You're seeing the error **"Database is not configured"** when trying to use Content OS features (activity logging, version control, content calendar, etc.).

## 🔍 Root Cause
Your `.env` or `.env.local` file contains **placeholder values** instead of actual database credentials:

```env
❌ DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:[YOUR-PASSWORD]@..."
❌ SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
❌ SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## ✅ Solution

### Step 1: Validate Your Current Configuration

Run this command to see what's missing:

```bash
npm run validate:env
```

This will show you exactly which environment variables need to be configured.

### Step 2: Get Supabase Credentials

#### Option A: Use Existing Supabase Project

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings → Database**
4. Scroll to **Connection String** section
5. Select **Connection pooling** (URI format)
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password

#### Option B: Create New Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `nochill-content-os` (or any name)
   - Database password: **Generate a strong password and save it!**
   - Region: Choose closest to you
5. Click "Create new project"
6. Wait for project to be ready (~2 minutes)
7. Follow "Option A" above to get credentials

### Step 3: Update Your `.env` File

1. Open your `.env` or `.env.local` file

2. Replace the placeholder values with your actual credentials:

```env
# ✅ Supabase Database (REQUIRED)
DATABASE_URL="postgresql://postgres.abcdefgh:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# ✅ Supabase Client (Optional but recommended)
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ NextAuth (REQUIRED)
NEXTAUTH_SECRET=your_generated_32_character_secret_here
NEXTAUTH_URL=http://localhost:3000

# ✅ Claude AI (Required for AI features)
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### Step 4: Push Database Schema

Once your `DATABASE_URL` is configured, run:

```bash
npm run db:push
```

This creates all the necessary tables in your Supabase database.

### Step 5: Verify Configuration

Run the validation script again:

```bash
npm run validate:env
```

You should see:

```
✅ VALIDATION PASSED - All checks successful!
```

### Step 6: Restart Your Development Server

Stop your current dev server (Ctrl+C) and restart:

```bash
npm run dev
```

## 🎯 Quick Checklist

- [ ] Created or accessed Supabase project
- [ ] Copied **Connection pooling** string from Supabase dashboard
- [ ] Replaced `[YOUR-PASSWORD]` with actual database password
- [ ] Updated `DATABASE_URL` in `.env` file
- [ ] Generated and set `NEXTAUTH_SECRET`
- [ ] Ran `npm run validate:env` - passed ✅
- [ ] Ran `npm run db:push` - success ✅
- [ ] Restarted development server
- [ ] Tested Content OS features

## 🔒 Security Notes

### ⚠️ NEVER commit these files to Git:
- `.env`
- `.env.local`
- Any file with real credentials

### ✅ Files safe to commit:
- `.env.example` (placeholder values only)

### If you accidentally exposed credentials:
1. **Immediately** go to Supabase dashboard
2. Navigate to Settings → API
3. Click "Regenerate" for exposed keys
4. Update your `.env` file with new keys
5. Never commit the `.env` file

## 🆘 Troubleshooting

### "Can't reach database server"

**Cause:** Database credentials are incorrect or database is paused

**Fix:**
1. Check your database password is correct
2. Go to Supabase dashboard → Database → Connection
3. Verify database is active (not paused)
4. Try copying the connection string again

### "Prepared statements not supported"

**Cause:** Missing `pgbouncer=true` parameter

**Fix:**
Add `?pgbouncer=true` to the end of your `DATABASE_URL`

### "SSL connection required"

**Cause:** Missing SSL configuration

**Fix:**
Supabase requires SSL by default. Make sure you're using the connection string exactly as provided by Supabase.

### Validation still shows placeholders

**Cause:** You edited the wrong `.env` file

**Fix:**
1. Check if you have both `.env` and `.env.local`
2. `.env.local` takes precedence
3. Make sure you edited the correct file
4. Run `cat .env.local` to verify

### "prisma migrate" fails

**Cause:** Connection pooling doesn't support migrations

**Fix:**
1. Get the **direct connection** (port 5432) from Supabase
2. Add as `DIRECT_URL` in your `.env`
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
4. Run migrations again

## 📚 Additional Resources

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete Supabase setup guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Production deployment guide
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)

## 💡 Tips

### For Development
- Use `.env.local` for your local environment variables
- This file is automatically ignored by git

### For Production (Vercel)
- Add environment variables in Vercel dashboard
- Settings → Environment Variables
- Add the same variables as in your `.env.local`
- Redeploy after adding variables

### Testing Database Connection

Create a test file to verify connection:

```javascript
// test-db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    const count = await prisma.user.count();
    console.log(`📊 Found ${count} users in database`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

Run with: `node test-db.js`

## 🎉 Success!

Once configured, you'll have access to:
- ✅ Activity logging and history
- ✅ Version control for all content
- ✅ Data backup and export
- ✅ Content calendar with persistence
- ✅ Cross-device access to your data
- ✅ Real-time sync across sessions

---

**Still having issues?**

1. Run `npm run validate:env` and fix any errors shown
2. Check SUPABASE_SETUP.md for detailed instructions
3. Review your Supabase dashboard for database status
4. Ensure your `.env.local` file is in the root directory

**Need more help?** Open an issue with:
- Output of `npm run validate:env`
- Error messages (remove sensitive data!)
- Steps you've already tried
