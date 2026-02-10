import { NextResponse } from 'next/server';
import { validateDatabaseUrl } from './env-validation';

/**
 * Database Error Handler
 * Wraps database operations and provides user-friendly error messages
 */

export interface DatabaseError {
  isDatabaseError: boolean;
  message: string;
  suggestEnvSetup: boolean;
}

/**
 * Checks if an error is a database connection error
 */
export function isDatabaseConnectionError(error: any): boolean {
  const errorMessage = error?.message || String(error);

  return (
    errorMessage.includes('the URL must start with the protocol') ||
    errorMessage.includes('Error validating datasource') ||
    errorMessage.includes('DATABASE_URL') ||
    errorMessage.includes('Can\'t reach database server') ||
    errorMessage.includes('Connection refused') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('prisma') && errorMessage.includes('url')
  );
}

/**
 * Creates a standardized database error response
 */
export function createDatabaseErrorResponse(error: any): NextResponse {
  const validation = validateDatabaseUrl(process.env.DATABASE_URL);

  let message = 'Database connection error';
  let details = '';

  if (!validation.isValid) {
    message = 'Database is not configured';
    details = validation.error || 'DATABASE_URL environment variable is missing or invalid';
  } else if (isDatabaseConnectionError(error)) {
    message = 'Cannot connect to database';
    details = error?.message || String(error);
  }

  return NextResponse.json(
    {
      error: message,
      details,
      isDatabaseError: true,
      suggestEnvSetup: !validation.isValid,
    },
    { status: 503 }
  );
}

/**
 * Wraps an async function with database error handling
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: DatabaseError }> {
  // First check if DATABASE_URL is configured
  const validation = validateDatabaseUrl(process.env.DATABASE_URL);

  if (!validation.isValid) {
    return {
      success: false,
      error: {
        isDatabaseError: true,
        message: validation.error || 'Database not configured',
        suggestEnvSetup: true,
      },
    };
  }

  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return {
        success: false,
        error: {
          isDatabaseError: true,
          message: 'Cannot connect to database',
          suggestEnvSetup: true,
        },
      };
    }

    throw error; // Re-throw non-database errors
  }
}
