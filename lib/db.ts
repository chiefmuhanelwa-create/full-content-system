import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Validates the DATABASE_URL environment variable
 * Returns an error message if invalid, or null if valid
 */
function validateDatabaseUrl(url: string | undefined): string | null {
  if (!url) {
    return 'DATABASE_URL is not set'
  }

  if (url.trim() === '') {
    return 'DATABASE_URL is empty'
  }

  const validProtocols = ['postgresql://', 'postgres://']
  const hasValidProtocol = validProtocols.some(protocol => url.startsWith(protocol))

  if (!hasValidProtocol) {
    return `DATABASE_URL must start with ${validProtocols.join(' or ')}, got: ${url.substring(0, 20)}...`
  }

  // Check for placeholder values
  const placeholders = [
    'YOUR_PROJECT_REF',
    'YOUR-PASSWORD',
    'YOUR_REGION',
    'your_',
    'YOUR-',
    'xxxxxxxxxxxx',
    '[YOUR',
  ]

  const foundPlaceholder = placeholders.find(placeholder =>
    url.toLowerCase().includes(placeholder.toLowerCase())
  )

  if (foundPlaceholder) {
    return `DATABASE_URL contains placeholder value "${foundPlaceholder}". Please configure your actual Supabase credentials. See SUPABASE_SETUP.md for help.`
  }

  // Basic structure validation
  const urlPattern = /^postgres(?:ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+/
  if (!urlPattern.test(url)) {
    return 'DATABASE_URL format is invalid. Expected: postgresql://user:password@host:port/database'
  }

  return null
}

// Validate DATABASE_URL before creating Prisma client
const databaseUrl = process.env.DATABASE_URL
const validationError = validateDatabaseUrl(databaseUrl)

// Log validation status in development
if (process.env.NODE_ENV === 'development') {
  if (validationError) {
    console.error('⚠️  Database configuration error:', validationError)
    console.error('   Please set DATABASE_URL in your environment variables.')
    console.error('   Example: postgresql://user:password@host:5432/database?sslmode=require')
    console.error('   See DATABASE_FIX_README.md for instructions.')
  } else {
    console.log('✅ Database configuration validated')
  }
} else if (validationError && process.env.NODE_ENV === 'production') {
  console.error('⚠️  Database configuration error:', validationError)
  console.error('   See VERCEL_DEPLOYMENT_FIX.md for instructions.')
}

// Only create Prisma client if DATABASE_URL is configured and valid
export const db = databaseUrl && !validationError
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }))
  : null

if (process.env.NODE_ENV !== 'production' && db) {
  globalForPrisma.prisma = db
}
