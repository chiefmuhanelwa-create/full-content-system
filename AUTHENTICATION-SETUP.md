# Authentication & Persistent Data Setup Guide

## Overview

Your content creation system now has **persistent authentication** with Google OAuth and database storage. All your hooks, scripts, and stories are saved to a PostgreSQL database and will persist across sessions!

## What's New

### 1. User Authentication
- **Login Page**: `/auth/signin` - Sign in with Google or email/password
- **Signup Page**: `/auth/signup` - Create a new account
- **Protected Routes**: All dashboard pages require authentication
- **Session Persistence**: Your session stays active across browser sessions

### 2. Database Persistence
All your data is now saved to a PostgreSQL database:
- **Hooks**: All generated hooks are saved to the database
- **Scripts**: All scripts are saved with full metadata
- **Stories**: All extracted stories are persisted
- **Calendar Entries**: Schedule content to your calendar

### 3. No More Data Loss
- Data is tied to your user account
- Access your content from any device
- Never lose your work when clearing browser cache
- Automatic backup in the database

## Setup Instructions

### Step 1: Set Up PostgreSQL Database

You need a PostgreSQL database. Choose one of these options:

#### Option A: Vercel Postgres (Recommended for Vercel deployment)
1. Go to your Vercel project dashboard
2. Go to the "Storage" tab
3. Create a new Postgres database
4. Copy the `DATABASE_URL` connection string

#### Option B: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

#### Option C: Railway (Free tier available)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Copy the `DATABASE_URL` from the database settings

#### Option D: Local PostgreSQL
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Linux

# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo service postgresql start  # Linux

# Create database
createdb nochill_content_system

# Your DATABASE_URL will be:
# postgresql://localhost:5432/nochill_content_system
```

### Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing one)
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
7. Copy your Client ID and Client Secret

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Required: Claude AI API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required: Database URL
DATABASE_URL=postgresql://user:password@host:5432/database

# Required: NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_generated_secret_here

# Required: NextAuth URL
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL

# Required: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Step 4: Initialize the Database

Run these commands to set up your database:

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### Step 5: Start the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Step 6: Create Your First Account

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign Up" or navigate to `/auth/signup`
3. Choose either:
   - **Google OAuth**: Click "Continue with Google"
   - **Email/Password**: Fill in the form and create an account

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add authentication and database persistence"
git push origin your-branch-name
```

### 2. Configure Vercel Environment Variables

In your Vercel project dashboard:

1. Go to "Settings" > "Environment Variables"
2. Add all the variables from your `.env.local`:
   - `ANTHROPIC_API_KEY`
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

3. Make sure to set variables for all environments:
   - Production
   - Preview
   - Development

### 3. Deploy

Vercel will automatically deploy your changes. After deployment:

1. Update Google OAuth redirect URIs with your production URL
2. Update `NEXTAUTH_URL` environment variable in Vercel
3. Test the login flow on your production site

## Features Overview

### Login System
- **Google OAuth**: One-click login with your Google account
- **Email/Password**: Traditional signup and login
- **Session Management**: Secure JWT-based sessions
- **Route Protection**: Dashboard pages require authentication

### Data Persistence
All generated content is automatically saved:

| Feature | Storage Location | API Endpoint |
|---------|-----------------|--------------|
| Hooks | PostgreSQL | `/api/hooks/save`, `/api/hooks/list` |
| Scripts | PostgreSQL | `/api/scripts/save`, `/api/scripts/list` |
| Stories | PostgreSQL | `/api/stories/save`, `/api/stories/list` |
| Calendar | PostgreSQL | `/api/calendar/save` |

### Saved Content Pages
- **Saved Hooks**: `/dashboard/saved-hooks` - View all your saved hooks
- **Saved Scripts**: `/dashboard/saved-scripts` - Access all your scripts
- **Saved Stories**: `/dashboard/saved-stories` - Browse your story library

### Cross-Feature Integration
- Save hooks and use them in scripts
- Schedule content to your calendar
- Export and share your content
- All features communicate with the database

## Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Check that your session hasn't expired
- Try logging out and back in

### Database Connection Error
- Verify your `DATABASE_URL` is correct
- Make sure the database is accessible
- Run `npx prisma db push` to sync the schema

### Google OAuth Not Working
- Check your Google OAuth credentials
- Verify redirect URIs match your domain
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### Data Not Saving
- Check browser console for errors
- Verify you're logged in
- Check that API endpoints are accessible
- Verify database connection

### Lost Data After Login
- This was the old localStorage issue - now fixed!
- All data is in the database
- Check the saved pages: `/dashboard/saved-hooks`, `/dashboard/saved-scripts`, `/dashboard/saved-stories`

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new user account
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Hooks
- `POST /api/hooks/save` - Save a hook to database
- `GET /api/hooks/list` - Get all user's hooks (supports filtering)
- `DELETE /api/hooks/delete?id={id}` - Delete a hook

### Scripts
- `POST /api/scripts/save` - Save a script to database
- `GET /api/scripts/list` - Get all user's scripts (supports filtering)
- `PUT /api/scripts/update?id={id}` - Update a script
- `DELETE /api/scripts/delete?id={id}` - Delete a script

### Stories
- `POST /api/stories/save` - Save a story to database
- `GET /api/stories/list` - Get all user's stories (supports filtering)
- `DELETE /api/stories/delete?id={id}` - Delete a story

### Calendar
- `POST /api/calendar/save` - Save calendar entry to database

## Database Schema

Your database includes the following tables:

- **users** - User accounts
- **accounts** - OAuth provider accounts
- **sessions** - Active user sessions
- **hooks** - Generated hooks with metadata
- **scripts** - Full scripts with SEEDS breakdown
- **stories** - Extracted stories with 4-criteria test
- **calendar_entries** - Scheduled content
- **revenue** - Revenue tracking (PAIDS)
- **activity_logs** - User action audit trail
- **content_versions** - Version history

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Sessions**: Secure token-based authentication
- **Route Protection**: Middleware guards all dashboard routes
- **User Isolation**: Users can only access their own data
- **CSRF Protection**: Built-in with NextAuth.js

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Run database migrations: `npx prisma db push`
4. Check the Vercel deployment logs
5. Restart your development server

## Next Steps

1. Create your account
2. Generate some hooks, scripts, and stories
3. Verify they appear in your saved libraries
4. Test logging out and back in - your data should persist!
5. Try accessing from a different device with the same account

Enjoy your fully persistent content creation system!
