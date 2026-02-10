#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests if the database is properly configured and accessible
 */

const { PrismaClient } = require('@prisma/client');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

async function testDatabaseConnection() {
  log('\n🔍 Testing Database Connection...\n', 'bright');

  // Step 1: Check if DATABASE_URL is set
  logInfo('Step 1: Checking DATABASE_URL environment variable');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    logError('DATABASE_URL is not set');
    logInfo('Please set DATABASE_URL in your .env.local file');
    logInfo('See DATABASE_FIX_README.md for instructions');
    process.exit(1);
  }

  logSuccess('DATABASE_URL is set');
  logInfo(`  Prefix: ${databaseUrl.substring(0, 30)}...`);

  // Step 2: Validate DATABASE_URL format
  logInfo('\nStep 2: Validating DATABASE_URL format');
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    logError('DATABASE_URL must start with postgresql:// or postgres://');
    logInfo(`  Found: ${databaseUrl.substring(0, 20)}...`);
    process.exit(1);
  }

  logSuccess('DATABASE_URL format is valid');

  // Step 3: Create Prisma client
  logInfo('\nStep 3: Creating Prisma client');
  let prisma;
  try {
    prisma = new PrismaClient({
      log: ['error'],
    });
    logSuccess('Prisma client created successfully');
  } catch (error) {
    logError('Failed to create Prisma client');
    console.error(error);
    process.exit(1);
  }

  // Step 4: Test database connection
  logInfo('\nStep 4: Testing database connectivity');
  try {
    await prisma.$connect();
    logSuccess('Connected to database successfully');
  } catch (error) {
    logError('Failed to connect to database');

    if (error.message.includes("Can't reach database server")) {
      logWarning('\n💤 Your Neon database appears to be SUSPENDED');
      logInfo('\nThis is normal for Neon free tier databases after 5 minutes of inactivity.');
      logInfo('\n📋 To fix this:');
      logInfo('   1. Go to https://console.neon.tech');
      logInfo('   2. Log in and click on your project');
      logInfo('   3. Wait 10-30 seconds for the database to wake up');
      logInfo('   4. Run this script again');
      logInfo('\nSee NEON_DATABASE_SUSPENDED.md for more details.');
    } else if (error.message.includes('password authentication failed')) {
      logError('Authentication failed - your password may be incorrect');
      logInfo('Get a fresh connection string from Neon console');
    } else {
      console.error('\nError details:', error.message);
    }

    await prisma.$disconnect();
    process.exit(1);
  }

  // Step 5: Run a simple query
  logInfo('\nStep 5: Running test query');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    logSuccess('Test query executed successfully');
    logInfo(`  Result: ${JSON.stringify(result)}`);
  } catch (error) {
    logError('Test query failed');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }

  // Step 6: Check if tables exist
  logInfo('\nStep 6: Checking database schema');
  try {
    // Try to count users (will fail if table doesn't exist)
    const userCount = await prisma.user.count();
    logSuccess(`Database schema exists (found ${userCount} users)`);
  } catch (error) {
    if (error.message.includes('does not exist') || error.message.includes('Table') || error.message.includes('relation')) {
      logWarning('Database tables not found - you may need to run migrations');
      logInfo('\nRun this command to create tables:');
      logInfo('  npm run db:setup');
      logInfo('  or: npx prisma db push');
    } else {
      logError('Failed to check database schema');
      console.error(error.message);
    }
  }

  // Cleanup
  await prisma.$disconnect();

  // Success!
  log('\n' + '='.repeat(60), 'green');
  logSuccess('✨ All database checks passed!');
  log('='.repeat(60) + '\n', 'green');

  logInfo('Your database is properly configured and accessible.');
  logInfo('You can now run your application with: npm run dev');

  process.exit(0);
}

// Run the test
testDatabaseConnection().catch(async (error) => {
  logError('\nUnexpected error during database test:');
  console.error(error);
  process.exit(1);
});
