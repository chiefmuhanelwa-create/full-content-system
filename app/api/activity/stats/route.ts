import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get activity statistics
    const [
      totalActivities,
      activityByType,
      activityByAction,
      recentActivities,
      activityTimeline
    ] = await Promise.all([
      // Total count
      db.activityLog.count({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }),

      // By entity type
      db.activityLog.groupBy({
        by: ['entityType'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: true
      }),

      // By action
      db.activityLog.groupBy({
        by: ['action'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: true
      }),

      // Recent activities
      db.activityLog.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Daily activity count
      db.activityLog.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        select: {
          createdAt: true
        }
      })
    ]);

    // Process timeline data
    const timelineMap = new Map<string, number>();
    activityTimeline.forEach((log: { createdAt: Date }) => {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      timelineMap.set(dateKey, (timelineMap.get(dateKey) || 0) + 1);
    });

    const timeline = Array.from(timelineMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      summary: {
        totalActivities,
        days,
        startDate
      },
      byType: activityByType.map((item: { entityType: string; _count: number }) => ({
        type: item.entityType,
        count: item._count
      })),
      byAction: activityByAction.map((item: { action: string; _count: number }) => ({
        action: item.action,
        count: item._count
      })),
      recent: recentActivities,
      timeline
    });
  } catch (error) {
    console.error('Activity stats error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve activity statistics' },
      { status: 500 }
    );
  }
}
