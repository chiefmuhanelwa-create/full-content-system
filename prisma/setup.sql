-- NOCHILL Viral Script Generator - Database Setup
-- Run this SQL in Neon's SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMP,
    image TEXT,
    password TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    plan TEXT DEFAULT 'free',
    "planExpiry" TIMESTAMP,
    credits INTEGER DEFAULT 10
);

-- Accounts table (for OAuth)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, "providerAccountId"),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table (for NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    UNIQUE(identifier, token)
);

-- Hooks table
CREATE TABLE IF NOT EXISTS hooks (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT NOT NULL,
    platform TEXT NOT NULL,
    duration TEXT,
    tone TEXT,
    "hookType" TEXT,
    category TEXT,
    "isFavorite" BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    engagement FLOAT DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Scripts table
CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hookId" TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    platform TEXT NOT NULL,
    duration TEXT NOT NULL,
    goal TEXT NOT NULL,
    breakdown JSONB,
    visuals JSONB,
    overlays JSONB,
    category TEXT,
    "isFavorite" BOOLEAN DEFAULT false,
    "isPublished" BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    engagement FLOAT DEFAULT 0,
    revenue FLOAT DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("hookId") REFERENCES hooks(id)
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "storyType" TEXT NOT NULL,
    "isSpecial" BOOLEAN DEFAULT false,
    "isRelevant" BOOLEAN DEFAULT false,
    "isQuantifiable" BOOLEAN DEFAULT false,
    "hasNames" BOOLEAN DEFAULT false,
    "beforeState" TEXT,
    "afterState" TEXT,
    timeframe TEXT,
    metrics JSONB,
    category TEXT,
    "isFavorite" BOOLEAN DEFAULT false,
    "timesUsed" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Revenue table
CREATE TABLE IF NOT EXISTS revenue (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    amount FLOAT NOT NULL,
    stream TEXT NOT NULL,
    description TEXT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Calendar entries table
CREATE TABLE IF NOT EXISTS calendar_entries (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    platform TEXT NOT NULL,
    "scriptId" TEXT,
    "hookId" TEXT,
    status TEXT DEFAULT 'planned',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hooks_userId ON hooks("userId");
CREATE INDEX IF NOT EXISTS idx_hooks_platform ON hooks(platform);
CREATE INDEX IF NOT EXISTS idx_hooks_category ON hooks(category);

CREATE INDEX IF NOT EXISTS idx_scripts_userId ON scripts("userId");
CREATE INDEX IF NOT EXISTS idx_scripts_platform ON scripts(platform);
CREATE INDEX IF NOT EXISTS idx_scripts_category ON scripts(category);

CREATE INDEX IF NOT EXISTS idx_stories_userId ON stories("userId");
CREATE INDEX IF NOT EXISTS idx_stories_storyType ON stories("storyType");

CREATE INDEX IF NOT EXISTS idx_revenue_userId ON revenue("userId");
CREATE INDEX IF NOT EXISTS idx_revenue_stream ON revenue(stream);
CREATE INDEX IF NOT EXISTS idx_revenue_year_month ON revenue(year, month);

CREATE INDEX IF NOT EXISTS idx_calendar_userId ON calendar_entries("userId");
CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar_entries(date);
CREATE INDEX IF NOT EXISTS idx_calendar_category ON calendar_entries(category);
