#!/usr/bin/env node

/**
 * NOCHILL Database Setup and Fix Script
 * Helps diagnose and fix database connection issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 NOCHILL Database Setup Script');
console.log('================================\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ Error: .env.local file not found');
  console.log('   Please create .env.local and add your DATABASE_URL\n');
  process.exit(1);
}

// Check DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL is not set in .env.local\n');
  console.log('To fix this:');
  console.log('1. Go to https://neon.tech and create a free database');
  console.log('2. Copy the connection string');
  console.log('3. Add it to .env.local as: DATABASE_URL="your-connection-string"');
  console.log('4. Run this script again\n');
  process.exit(1);
}

// Validate DATABASE_URL format
if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  console.error('❌ Error: DATABASE_URL must start with "postgresql://" or "postgres://"\n');
  console.log(`   Current value starts with: ${databaseUrl.substring(0, 20)}...\n`);
  console.log('To fix this:');
  console.log('1. Check your .env.local file');
  console.log('2. Make sure DATABASE_URL starts with postgresql://');
  console.log('3. Example: DATABASE_URL="postgresql://user:pass@host:5432/db"\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set correctly\n');

// Generate Prisma client
try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: databaseUrl } });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client');
  console.error(error.message);
  process.exit(1);
}

// Push database schema
try {
  console.log('🗄️  Pushing database schema to Neon...');
  console.log('   (This may take a moment if the database is suspended)\n');
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
    timeout: 60000
  });
  console.log('\n✅ Database schema pushed successfully\n');

  console.log('🎉 All done! Your database is ready.\n');
  console.log('Next steps:');
  console.log('1. Stop your development server if it\'s running (Ctrl+C)');
  console.log('2. Restart it with: npm run dev');
  console.log('3. All new features should now work!\n');
} catch (error) {
  console.error('\n⚠️  Failed to push database schema\n');
  console.log('This usually means:');
  console.log('1. Neon database is suspended (free tier) - it will auto-wake on connection');
  console.log('2. Network connectivity issues');
  console.log('3. Invalid database credentials\n');
  console.log('To fix:');
  console.log('1. Go to https://console.neon.tech');
  console.log('2. Check if your project is active');
  console.log('3. If suspended, try accessing it to wake it up');
  console.log('4. Get a fresh connection string and update .env.local');
  console.log('5. Run: npm run db:setup\n');

  // Even if push fails, the client is generated, so partial success
  console.log('Note: Prisma client was generated successfully.');
  console.log('If your database is already set up, you can try running your app.\n');
}
