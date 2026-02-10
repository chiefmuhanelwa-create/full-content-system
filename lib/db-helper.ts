import { db } from './db'
import { NextResponse } from 'next/server'

// Re-export db as prisma for convenience
export const prisma = db

/**
 * Check if database is configured and available
 * Returns an error response if database is not available
 */
export function checkDatabase() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL
    const isDatabaseUrlSet = !!databaseUrl
    const isProduction = process.env.NODE_ENV === 'production'

    return NextResponse.json(
      {
        error: 'Database not configured',
        message: 'This feature requires a database connection. Please configure DATABASE_URL in your environment variables.',
        hint: 'You can use a local PostgreSQL instance or a hosted service like Neon, Supabase, or Railway.',
        debug: {
          isDatabaseUrlSet,
          databaseUrlPrefix: databaseUrl?.substring(0, 20) || 'not set',
          environment: process.env.NODE_ENV,
          deploymentUrl: process.env.VERCEL_URL || 'localhost',
          documentation: isProduction
            ? 'See VERCEL_DEPLOYMENT_FIX.md in the repository for setup instructions'
            : 'See DATABASE_FIX_README.md in the repository for setup instructions'
        }
      },
      { status: 503 } // 503 Service Unavailable
    )
  }
  return null
}

/**
 * Execute a database operation with error handling
 * Returns error response if database is not available
 */
export async function withDatabase<T>(
  operation: () => Promise<T>
): Promise<NextResponse | T> {
  const dbError = checkDatabase()
  if (dbError) return dbError

  try {
    return await operation()
  } catch (error: any) {
    console.error('Database operation error:', error)
    return NextResponse.json(
      {
        error: 'Database operation failed',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
