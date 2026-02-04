import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata
    } = body;

    // Validate required fields
    if (!userId || !action || !entityType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, action, entityType' },
        { status: 400 }
      );
    }

    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create activity log entry
    const activityLog = await db.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        description,
        metadata: metadata || {},
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      activityLog
    });
  } catch (error) {
    console.error('Activity log error:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

// Get activity logs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = { userId };
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    // Get logs
    const [logs, totalCount] = await Promise.all([
      db.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.activityLog.count({ where })
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Activity log retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve activity logs' },
      { status: 500 }
    );
  }
}
