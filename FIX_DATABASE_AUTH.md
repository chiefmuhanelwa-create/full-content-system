# 🔧 Fix Database Authentication Error

## The Problem
You're getting: `Authentication failed against database server at aws-1-eu-west-1.pooler.supabase.com`

## Root Cause
The password in your `.env` files may be incorrect or revoked.

## ✅ Solution: Get Fresh Supabase Credentials

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard/project/sknplhjxofqswjnvpnnh
2. Log in if needed

### Step 2: Reset Your Database Password
1. Click **Settings** (⚙️ icon in left sidebar)
2. Click **Database**
3. Scroll to **Database Password**
4. Click **Reset database password**
5. Save the new password somewhere safe

### Step 3: Get Connection Strings
After resetting password, scroll to **Connection String** section:

1. **For DATABASE_URL (with pooling):**
   - Select **URI** tab
   - Switch to **Connection pooling** mode
   - Copy the connection string (uses port **6543**)
   - Format: `postgresql://postgres.sknplhjxofqswjnvpnnh:[NEW-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

2. **For DIRECT_URL (without pooling):**
   - Select **URI** tab
   - Switch to **Session mode** (or **Connection string**)
   - Copy the connection string (uses port **5432**)
   - Format: `postgresql://postgres.sknplhjxofqswjnvpnnh:[NEW-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`

### Step 4: Update Your `.env` File

Replace in `/home/user/full-content-system/.env`:

```env
DATABASE_URL="postgresql://postgres.sknplhjxofqswjnvpnnh:[NEW-PASSWORD-HERE]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.sknplhjxofqswjnvpnnh:[NEW-PASSWORD-HERE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

### Step 5: Update `.env.local` (if you're using it)

Either:
- **Option A:** Delete `.env.local` entirely: `rm .env.local`
- **Option B:** Copy `.env` to `.env.local`: `cp .env .env.local`

### Step 6: Update Vercel Environment Variables

If you're deploying to Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update these variables with your NEW credentials:
   - `DATABASE_URL` (with new password, port 6543)
   - `DIRECT_URL` (with new password, port 5432)
5. Click **Save**
6. Redeploy your app

### Step 7: Test Locally

```bash
# Test the connection
npm run test:db

# Or just try to build
npm run build
```

### Step 8: Regenerate Prisma Client

```bash
npx prisma generate
```

---

## 🔒 Security Note

**NEVER commit your actual passwords to Git!**
- `.env` and `.env.local` are already in `.gitignore`
- Only `.env.example` should be committed (with placeholder values)

---

## ✅ Checklist

- [ ] Reset database password in Supabase
- [ ] Copy new DATABASE_URL with port 6543
- [ ] Copy new DIRECT_URL with port 5432
- [ ] Update `.env` file
- [ ] Delete or update `.env.local`
- [ ] Update Vercel environment variables
- [ ] Test database connection locally
- [ ] Redeploy to Vercel

---

## 🆘 Still Getting Errors?

### Error: "no pg_hba.conf entry"
- Your IP address is blocked
- Go to Supabase → Settings → Database → Network Restrictions
- Add your IP or allow all IPs temporarily

### Error: "database does not exist"
- The database name is wrong
- Should be `postgres` (not `neondb` or anything else)

### Error: "password authentication failed"
- The password is still wrong
- Double-check you copied the full password
- Make sure there are no extra spaces
- Try resetting the password again
