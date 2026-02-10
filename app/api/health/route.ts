import { NextResponse } from 'next/server';
import { validateEnvironment, getSetupInstructions } from '@/lib/env-validation';
import prisma from '@/lib/prisma';

/**
 * Health Check Endpoint
 * Validates environment variables and database connection
 * GET /api/health
 */
export async function GET() {
  const validation = validateEnvironment();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isVercel: process.env.VERCEL === '1',
    checks: {
      environment: {
        status: validation.isValid ? 'pass' : 'fail',
        errors: validation.errors,
        warnings: validation.warnings,
      },
      database: {
        status: 'unknown',
        error: null as string | null,
      },
    },
  };

  // Try to connect to database if environment is valid
  if (validation.isValid) {
    if (!prisma) {
      health.checks.database.status = 'fail';
      health.checks.database.error = 'Database client not initialized. DATABASE_URL may be missing.';
      health.status = 'unhealthy';
    } else {
      try {
        await prisma.$queryRaw`SELECT 1`;
        health.checks.database.status = 'pass';
      } catch (error) {
        health.checks.database.status = 'fail';
        health.checks.database.error = error instanceof Error ? error.message : 'Unknown database error';
        health.status = 'unhealthy';
      }
    }
  } else {
    health.status = 'unhealthy';
    health.checks.database.status = 'fail';
    health.checks.database.error = 'Environment validation failed - skipping database check';
  }

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
