# Deployment Guide

Complete guide to deploying NOCHILL Viral Script Generator to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Anthropic API key tested
- [ ] Build succeeds locally (`npm run build`)
- [ ] Code pushed to GitHub

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click "Add New Project"
2. Select your GitHub repository
3. Vercel auto-detects Next.js - no config needed

### Step 4: Configure Environment Variables

Add these in Vercel project settings:

```env
# Database (Vercel Postgres or external)
DATABASE_URL=postgresql://...

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=NOCHILL Viral Script Generator
```

### Step 5: Set Up Vercel Postgres

**Option A: Vercel Postgres (Easiest)**

1. In Vercel dashboard → "Storage" → "Create Database"
2. Select "Postgres"
3. Choose your region
4. Vercel auto-populates `DATABASE_URL`
5. Run migrations:
   ```bash
   npx prisma db push
   ```

**Option B: External Database (Supabase)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy connection string
5. Add to Vercel environment variables as `DATABASE_URL`

### Step 6: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Your app is live!

### Step 7: Set Up Custom Domain (Optional)

1. In Vercel → Settings → Domains
2. Add your custom domain (e.g., `nochill-scripts.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

## Alternative: Manual Server Deployment

### Prerequisites

- Ubuntu 22.04 server
- Node.js 18+
- PostgreSQL 14+
- Nginx

### Step 1: Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE nochill;
CREATE USER nochilluser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nochill TO nochilluser;
\q
```

### Step 3: Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/nochill.git
cd nochill

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# Run database migrations
npx prisma db push

# Build for production
npm run build
```

### Step 4: Set Up PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "nochill" -- start

# Set up auto-restart on reboot
pm2 startup
pm2 save
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/nochill
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/nochill /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment

### 1. Test API Endpoints

```bash
# Test hook generation
curl -X POST https://your-domain.com/api/hooks/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "content creation",
    "platform": "instagram",
    "duration": "60s",
    "tone": "educational"
  }'
```

### 2. Monitor Performance

**Vercel:**
- Analytics tab shows traffic, performance
- Logs tab shows errors

**Manual Server:**
```bash
# View PM2 logs
pm2 logs nochill

# Monitor server resources
htop
```

### 3. Set Up Monitoring

**Vercel:** Built-in analytics

**Manual Server:**
```bash
# Install monitoring
npm install -g @vercel/analytics
```

### 4. Database Backups

**Vercel Postgres:**
- Automatic daily backups included

**Manual Setup:**
```bash
# Create backup script
nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U nochilluser nochill > /backups/nochill_$DATE.sql
```

```bash
# Make executable
chmod +x /home/deploy/backup.sh

# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh
```

## Scaling Considerations

### Handling High Traffic

**Vercel (Automatic Scaling):**
- Auto-scales to handle traffic
- No configuration needed
- Pay per usage

**Manual Server:**
```bash
# Increase PM2 instances
pm2 scale nochill 4  # Run 4 instances
```

### Database Optimization

**Connection Pooling:**

```typescript
// In lib/db.ts
export const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling
  log: ['error'],
  errorFormat: 'minimal',
})
```

**Add Index:**

```sql
-- In PostgreSQL
CREATE INDEX idx_hooks_user_id ON hooks(userId);
CREATE INDEX idx_scripts_user_id ON scripts(userId);
```

### API Rate Limiting

Add to API routes:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull
```

### Environment Variables Not Working

- Ensure all variables are in Vercel dashboard
- Redeploy after adding new variables

### Claude API Errors

- Check API key is valid
- Verify billing is active
- Check rate limits

## Security Checklist

- [ ] Environment variables are secret
- [ ] Database uses strong password
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all API routes
- [ ] SQL injection prevention (Prisma handles this)

## Cost Optimization

### Vercel
- Free tier: Hobby ($0/month)
  - 100 GB bandwidth
  - Unlimited requests
  - Perfect for starting out

- Pro tier: $20/month
  - 1 TB bandwidth
  - Advanced analytics

### Claude API
- Monitor usage in Anthropic console
- Use caching to reduce repeat calls
- Implement rate limiting per user

### Database
- Vercel Postgres: Free tier (256 MB)
- Upgrade as needed ($20/month for 512 GB)

## Maintenance

### Weekly Tasks
- [ ] Review error logs
- [ ] Check API usage/costs
- [ ] Monitor user growth

### Monthly Tasks
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize slow queries
- [ ] Backup database

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature roadmap review

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **Anthropic API**: https://docs.anthropic.com

---

Need help? Create an issue on GitHub or email support@nochill.app
