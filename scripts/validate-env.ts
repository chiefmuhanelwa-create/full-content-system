#!/usr/bin/env tsx
/**
 * Environment Validation Script
 * Checks that all required environment variables are properly configured
 * Run with: npm run validate:env or npx tsx scripts/validate-env.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface ValidationResult {
  name: string;
  status: 'valid' | 'invalid' | 'warning' | 'missing';
  message: string;
  required: boolean;
}

const results: ValidationResult[] = [];

console.log('\n🔍 Validating Environment Configuration...\n');
console.log('═'.repeat(60));

// Check if .env or .env.local exists
const hasEnvLocal = fs.existsSync(path.resolve(process.cwd(), '.env.local'));
const hasEnv = fs.existsSync(path.resolve(process.cwd(), '.env'));

if (!hasEnvLocal && !hasEnv) {
  console.log('\n⚠️  No .env or .env.local file found!');
  console.log('   Run: cp .env.example .env');
  console.log('   Then configure your environment variables.\n');
  process.exit(1);
}

console.log(`\n📁 Environment files:`);
console.log(`   .env.local: ${hasEnvLocal ? '✅ Found' : '❌ Not found'}`);
console.log(`   .env: ${hasEnv ? '✅ Found' : '❌ Not found'}`);
console.log();

// Validate DATABASE_URL
function validateDatabaseUrl(): ValidationResult {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return {
      name: 'DATABASE_URL',
      status: 'missing',
      message: 'Not set',
      required: true,
    };
  }

  // Check for placeholders
  const placeholders = [
    'YOUR_PROJECT_REF',
    'YOUR-PASSWORD',
    'YOUR_REGION',
    'your_',
    'xxxxxxxxxxxx',
    '[YOUR',
  ];

  const foundPlaceholder = placeholders.find(p =>
    url.toLowerCase().includes(p.toLowerCase())
  );

  if (foundPlaceholder) {
    return {
      name: 'DATABASE_URL',
      status: 'invalid',
      message: `Contains placeholder "${foundPlaceholder}". Replace with actual Supabase credentials.`,
      required: true,
    };
  }

  // Check protocol
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    return {
      name: 'DATABASE_URL',
      status: 'invalid',
      message: 'Must start with postgresql:// or postgres://',
      required: true,
    };
  }

  // Check structure
  const urlPattern = /^postgres(?:ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+/;
  if (!urlPattern.test(url)) {
    return {
      name: 'DATABASE_URL',
      status: 'invalid',
      message: 'Invalid format. Expected: postgresql://user:password@host:port/database',
      required: true,
    };
  }

  return {
    name: 'DATABASE_URL',
    status: 'valid',
    message: `Configured (${url.split('@')[1]?.split('/')[0] || 'unknown host'})`,
    required: true,
  };
}

// Validate SUPABASE_URL
function validateSupabaseUrl(): ValidationResult {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    return {
      name: 'SUPABASE_URL',
      status: 'warning',
      message: 'Not set (optional - needed for Supabase client features)',
      required: false,
    };
  }

  if (url.includes('YOUR_PROJECT_REF') || url.includes('your_')) {
    return {
      name: 'SUPABASE_URL',
      status: 'invalid',
      message: 'Contains placeholder values',
      required: false,
    };
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return {
      name: 'SUPABASE_URL',
      status: 'invalid',
      message: 'Should be https://*.supabase.co',
      required: false,
    };
  }

  return {
    name: 'SUPABASE_URL',
    status: 'valid',
    message: `Configured (${url})`,
    required: false,
  };
}

// Validate SUPABASE_ANON_KEY
function validateSupabaseAnonKey(): ValidationResult {
  const key = process.env.SUPABASE_ANON_KEY;

  if (!key) {
    return {
      name: 'SUPABASE_ANON_KEY',
      status: 'warning',
      message: 'Not set (optional - needed for Supabase client features)',
      required: false,
    };
  }

  if (key.includes('your_') || key.length < 30) {
    return {
      name: 'SUPABASE_ANON_KEY',
      status: 'invalid',
      message: 'Contains placeholder value or is too short',
      required: false,
    };
  }

  return {
    name: 'SUPABASE_ANON_KEY',
    status: 'valid',
    message: `Configured (${key.substring(0, 20)}...)`,
    required: false,
  };
}

// Validate NEXTAUTH_SECRET
function validateNextAuthSecret(): ValidationResult {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return {
      name: 'NEXTAUTH_SECRET',
      status: 'missing',
      message: 'Not set. Generate with: openssl rand -base64 32',
      required: true,
    };
  }

  if (secret.includes('your_') || secret.length < 32) {
    return {
      name: 'NEXTAUTH_SECRET',
      status: 'invalid',
      message: 'Too short or placeholder. Should be at least 32 characters.',
      required: true,
    };
  }

  return {
    name: 'NEXTAUTH_SECRET',
    status: 'valid',
    message: `Configured (${secret.length} characters)`,
    required: true,
  };
}

// Validate NEXTAUTH_URL
function validateNextAuthUrl(): ValidationResult {
  const url = process.env.NEXTAUTH_URL;

  if (!url) {
    return {
      name: 'NEXTAUTH_URL',
      status: 'warning',
      message: 'Not set. Use http://localhost:3000 for development',
      required: false,
    };
  }

  if (url.includes('your-project-name')) {
    return {
      name: 'NEXTAUTH_URL',
      status: 'invalid',
      message: 'Contains placeholder value',
      required: false,
    };
  }

  return {
    name: 'NEXTAUTH_URL',
    status: 'valid',
    message: `Configured (${url})`,
    required: false,
  };
}

// Validate ANTHROPIC_API_KEY
function validateAnthropicKey(): ValidationResult {
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return {
      name: 'ANTHROPIC_API_KEY',
      status: 'warning',
      message: 'Not set. AI features will not work.',
      required: false,
    };
  }

  if (key.includes('your_') || !key.startsWith('sk-ant-')) {
    return {
      name: 'ANTHROPIC_API_KEY',
      status: 'invalid',
      message: 'Invalid format. Should start with sk-ant-',
      required: false,
    };
  }

  return {
    name: 'ANTHROPIC_API_KEY',
    status: 'valid',
    message: `Configured (${key.substring(0, 20)}...)`,
    required: false,
  };
}

// Run all validations
results.push(validateDatabaseUrl());
results.push(validateSupabaseUrl());
results.push(validateSupabaseAnonKey());
results.push(validateNextAuthSecret());
results.push(validateNextAuthUrl());
results.push(validateAnthropicKey());

// Display results
console.log('📊 Validation Results:\n');

results.forEach(result => {
  const icon =
    result.status === 'valid'
      ? '✅'
      : result.status === 'invalid'
      ? '❌'
      : result.status === 'warning'
      ? '⚠️'
      : '❌';

  const required = result.required ? ' (REQUIRED)' : ' (optional)';
  console.log(`${icon} ${result.name}${required}`);
  console.log(`   ${result.message}\n`);
});

console.log('═'.repeat(60));

// Summary
const hasErrors = results.some(
  r => r.status === 'invalid' || (r.status === 'missing' && r.required)
);
const hasWarnings = results.some(r => r.status === 'warning');

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED - Critical issues found\n');
  console.log('Required actions:');
  console.log('1. Fix the issues marked with ❌');
  console.log('2. See SUPABASE_SETUP.md for detailed setup instructions');
  console.log('3. Run this script again to verify\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  VALIDATION PASSED with warnings\n');
  console.log('Your app will work, but some features may be limited.');
  console.log('Consider configuring the optional variables for full functionality.\n');
  process.exit(0);
} else {
  console.log('\n✅ VALIDATION PASSED - All checks successful!\n');
  console.log('Your environment is properly configured.');
  console.log('You can now run: npm run dev\n');
  process.exit(0);
}
