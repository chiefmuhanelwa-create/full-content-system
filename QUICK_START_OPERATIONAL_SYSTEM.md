# Quick Start: Operational System

## 🚀 Get Started in 5 Minutes

### Step 1: Update Database (2 minutes)

```bash
# Generate Prisma client with new schema
npx prisma generate

# Run database migration
npx prisma migrate dev --name add_operational_system

# Or if you want to reset (CAUTION: deletes existing data)
npx prisma migrate reset
```

### Step 2: Start the Application (1 minute)

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

### Step 3: Access New Features (2 minutes)

Open your browser and navigate to:

1. **Operations Center:**
   - URL: `http://localhost:3000/dashboard/operations`
   - View system health, create backups, monitor activity

2. **Activity History:**
   - URL: `http://localhost:3000/dashboard/history`
   - See all your actions, filter and search

3. **Data Migration:**
   - URL: `http://localhost:3000/dashboard/migrate`
   - Migrate localStorage data to database

---

## 📋 Quick Feature Overview

### ✅ Automatic Features (No Action Required)

These work automatically as soon as you start using the system:

1. **Activity Logging** - Every action is logged
2. **Data Persistence** - Everything saved to database
3. **Auto-Save** - Continuous saving, no manual saves needed

### 🎯 Manual Features (Use When Needed)

1. **Create Backup:**
   - Go to Operations Center
   - Click "Create Backup"
   - Download as JSON

2. **View History:**
   - Go to History page
   - Filter by type/action
   - Search activities

3. **Migrate Data:**
   - Go to Migration page
   - Click "Migrate to Database"
   - Clear localStorage after success

4. **Version Control:**
   - Available in content edit pages
   - View history
   - Restore versions

---

## 🔧 Integration Examples

### Add Logging to Your API Route

```typescript
import { logActivity } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const { userId, data } = await request.json();

  // Your business logic
  const result = await doSomething(data);

  // Log it (one line!)
  await logActivity({
    userId,
    action: 'created',
    entityType: 'hook',
    entityId: result.id,
    description: 'Created new hook'
  });

  return NextResponse.json({ result });
}
```

### Add Version Control to Your Page

```typescript
import { VersionHistory } from '@/components/VersionHistory';

export default function MyPage() {
  return (
    <div>
      {/* Your content */}

      <VersionHistory
        userId="user-id"
        entityType="script"
        entityId="script-id"
      />
    </div>
  );
}
```

---

## 🎨 Navigation Updates

The navigation now includes:

- **Operations** - System control center
- **History** - Activity log & timeline
- **Data Migration** - Migrate to database

---

## 📊 What's Tracked?

### Actions
- `created` - New content created
- `updated` - Content edited
- `deleted` - Content removed
- `viewed` - Content viewed
- `generated` - AI generated content
- `exported` - Exported to PDF/JSON
- `backed_up` - Backup created
- `restored` - Backup restored
- `versioned` - New version created

### Entity Types
- `hook` - Viral hooks
- `script` - Full scripts
- `story` - Proof stories
- `calendar` - Calendar entries
- `revenue` - Revenue tracking
- `system` - System operations

---

## 🔍 Common Tasks

### Task 1: Create a Backup
1. Navigate to `/dashboard/operations`
2. Click "Backups" tab
3. Click "Create Backup Now"
4. Wait for completion
5. Optionally download JSON file

### Task 2: View Your History
1. Navigate to `/dashboard/history`
2. Use filters to narrow down
3. Search for specific activities
4. View detailed statistics

### Task 3: Migrate from localStorage
1. Navigate to `/dashboard/migrate`
2. Check what data exists
3. Click "Migrate to Database"
4. Wait for completion
5. Optionally clear localStorage

### Task 4: Restore a Version
1. Open content edit page
2. View version history component
3. Click "View" on a version
4. Click "Restore" to revert

---

## 🎯 Success Checklist

After setup, verify these work:

- [ ] Can access `/dashboard/operations`
- [ ] Can access `/dashboard/history`
- [ ] Can access `/dashboard/migrate`
- [ ] Can create a backup
- [ ] Can see activity logs
- [ ] New content is automatically logged
- [ ] Navigation shows new pages

---

## 🐛 Troubleshooting

### Database Migration Fails
```bash
# Check your DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Try resetting (WARNING: deletes data)
npx prisma migrate reset
```

### Can't See New Pages
- Clear browser cache
- Restart dev server
- Check navigation component loaded

### Activity Logs Empty
- Generate some content first
- Check userId is correct
- Verify API routes working

---

## 📚 Learn More

- **Full Documentation:** [OPERATIONAL_SYSTEM.md](./OPERATIONAL_SYSTEM.md)
- **API Reference:** See API routes in `/app/api/`
- **Components:** Check `/components/` for reusable components

---

## 🎉 You're Ready!

Your system now has:
- ✅ Complete data persistence
- ✅ Activity tracking
- ✅ Version control
- ✅ Backup system
- ✅ Migration tools

**Start creating content and watch it all get tracked automatically!**
