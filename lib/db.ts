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

  return null
}

// Validate DATABASE_URL before creating Prisma client
const databaseUrl = process.env.DATABASE_URL
const validationError = validateDatabaseUrl(databaseUrl)

if (validationError && process.env.NODE_ENV !== 'test') {
  console.error('⚠️  Database configuration error:', validationError)
  console.error('   Please set DATABASE_URL in your environment variables.')
  console.error('   Example: postgresql://user:password@host:5432/database?sslmode=require')
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
