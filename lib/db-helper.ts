import { db } from './db'
import { NextResponse } from 'next/server'

/**
 * Check if database is configured and available
 * Returns an error response if database is not available
 */
export function checkDatabase() {
  if (!db) {
    return NextResponse.json(
      {
        error: 'Database not configured',
        message: 'This feature requires a database connection. Please configure DATABASE_URL in your environment variables.',
        hint: 'You can use a local PostgreSQL instance or a hosted service like Neon, Supabase, or Railway.'
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
