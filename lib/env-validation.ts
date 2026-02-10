/**
 * Environment Variable Validation Utility
 * Validates required environment variables and provides helpful error messages
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that DATABASE_URL is properly configured
 */
export function validateDatabaseUrl(url: string | undefined): {
  isValid: boolean;
  error?: string;
} {
  if (!url) {
    return {
      isValid: false,
      error: 'DATABASE_URL environment variable is not set',
    };
  }

  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    return {
      isValid: false,
      error: 'DATABASE_URL must start with postgresql:// or postgres://',
    };
  }

  // Check for placeholder values that indicate the URL hasn't been configured
  const placeholders = [
    'YOUR_PROJECT_REF',
    'YOUR-PASSWORD',
    'YOUR_REGION',
    'your_',
    'YOUR-',
    'xxxxxxxxxxxx',
    '[YOUR',
  ];

  const hasPlaceholder = placeholders.some(placeholder =>
    url.toLowerCase().includes(placeholder.toLowerCase())
  );

  if (hasPlaceholder) {
    return {
      isValid: false,
      error: 'DATABASE_URL contains placeholder values. Please replace with your actual Supabase credentials. See SUPABASE_SETUP.md for instructions.',
    };
  }

  // Basic validation for PostgreSQL URL structure
  const urlPattern = /^postgres(?:ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+/;
  if (!urlPattern.test(url)) {
    return {
      isValid: false,
      error: 'DATABASE_URL format is invalid. Expected format: postgresql://user:password@host:port/database',
    };
  }

  return { isValid: true };
}

/**
 * Validates all required environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate DATABASE_URL
  const dbValidation = validateDatabaseUrl(process.env.DATABASE_URL);
  if (!dbValidation.isValid) {
    errors.push(dbValidation.error!);
  }

  // Validate NEXTAUTH_SECRET
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET environment variable is not set');
  } else if (process.env.NEXTAUTH_SECRET.length < 32) {
    warnings.push('NEXTAUTH_SECRET should be at least 32 characters long');
  }

  // Validate NEXTAUTH_URL
  if (!process.env.NEXTAUTH_URL) {
    warnings.push('NEXTAUTH_URL environment variable is not set');
  }

  // Validate ANTHROPIC_API_KEY (optional but recommended)
  if (!process.env.ANTHROPIC_API_KEY) {
    warnings.push(
      'ANTHROPIC_API_KEY is not set - AI features will not work'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets helpful setup instructions based on the current environment
 */
export function getSetupInstructions(): string {
  const isVercel = process.env.VERCEL === '1';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isVercel || isProduction) {
    return `
🚨 Missing Environment Variables in Vercel

To fix this issue:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following required variables:

   DATABASE_URL
   ├─ Get a free PostgreSQL database from:
   ├─ • Neon (https://neon.tech) - Recommended
   ├─ • Supabase (https://supabase.com)
   ├─ • Railway (https://railway.app)
   └─ Format: postgresql://user:password@host:5432/database

   NEXTAUTH_SECRET
   ├─ Generate with: openssl rand -base64 32
   └─ Or use: https://generate-secret.vercel.app/32

   NEXTAUTH_URL
   └─ Your Vercel deployment URL (e.g., https://your-app.vercel.app)

4. Redeploy your application

📚 Full documentation: /docs/DEPLOYMENT.md
`;
  }

  return `
🚨 Missing Environment Variables

To fix this issue:

1. Copy .env.example to .env
2. Fill in the required values:
   - DATABASE_URL: Your PostgreSQL connection string
   - NEXTAUTH_SECRET: Generate with 'openssl rand -base64 32'
   - NEXTAUTH_URL: http://localhost:3000 (for development)

3. Restart your development server

📚 Full documentation: /docs/DEPLOYMENT.md
`;
}
