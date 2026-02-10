#!/usr/bin/env node

/**
 * Neon Database Wake-Up Script
 * Attempts to connect to a suspended Neon database and wake it up
 */

const { PrismaClient } = require('@prisma/client');

const MAX_RETRIES = 5;
const RETRY_DELAY = 6000; // 6 seconds

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wakeDatabase() {
  console.log('🔌 Attempting to wake up Neon database...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  console.log('✓ DATABASE_URL is configured');
  console.log(`✓ Target: ${process.env.DATABASE_URL.split('@')[1]?.split('?')[0] || 'unknown'}\n`);

  const prisma = new PrismaClient({
    log: ['error'],
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${MAX_RETRIES}: Connecting to database...`);

      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1 as wake_up`;

      console.log('✅ Success! Database is awake and responding\n');
      console.log('You can now run your application:');
      console.log('  npm run dev\n');

      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      const errorMsg = error.message || String(error);

      if (errorMsg.includes("Can't reach database server")) {
        console.log(`   ⏳ Database is suspended, waking up...`);

        if (attempt < MAX_RETRIES) {
          console.log(`   Waiting ${RETRY_DELAY / 1000} seconds before retry...\n`);
          await sleep(RETRY_DELAY);
        } else {
          console.error('\n❌ Failed to wake up database after multiple attempts\n');
          console.error('Please try manual wake-up:');
          console.error('1. Go to https://console.neon.tech');
          console.error('2. Click on your project');
          console.error('3. Wait 10-30 seconds');
          console.error('4. Run this script again\n');
          process.exit(1);
        }
      } else {
        console.error(`\n❌ Unexpected error: ${errorMsg}\n`);
        process.exit(1);
      }
    }
  }

  await prisma.$disconnect();
}

wakeDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
