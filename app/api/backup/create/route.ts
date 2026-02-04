import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, backupType = 'user_data' } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const startTime = new Date();

    // Create backup record
    const backup = await db.dataBackup.create({
      data: {
        userId,
        backupType,
        fileName: `backup-${userId}-${Date.now()}.json`,
        status: 'pending'
      }
    });

    try {
      // Gather all user data
      const [hooks, scripts, stories, calendar, revenue, activityLogs, versions] = await Promise.all([
        db.hook.findMany({ where: { userId } }),
        db.script.findMany({ where: { userId } }),
        db.story.findMany({ where: { userId } }),
        db.calendarEntry.findMany({ where: { userId } }),
        db.revenue.findMany({ where: { userId } }),
        db.activityLog.findMany({ where: { userId } }),
        db.contentVersion.findMany({ where: { userId } })
      ]);

      const backupData = {
        userId,
        timestamp: startTime.toISOString(),
        version: '2.0.0',
        data: {
          hooks,
          scripts,
          stories,
          calendar,
          revenue,
          activityLogs,
          versions
        },
        counts: {
          hooks: hooks.length,
          scripts: scripts.length,
          stories: stories.length,
          calendar: calendar.length,
          revenue: revenue.length,
          activityLogs: activityLogs.length,
          versions: versions.length
        }
      };

      // Calculate total records
      const totalRecords = Object.values(backupData.counts).reduce((a, b) => a + b, 0);

      // Update backup record as completed
      const completedBackup = await db.dataBackup.update({
        where: { id: backup.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          recordCount: totalRecords,
          dataTypes: backupData.counts,
          fileSize: BigInt(JSON.stringify(backupData).length)
        }
      });

      // Log the activity
      await db.activityLog.create({
        data: {
          userId,
          action: 'backed_up',
          entityType: 'system',
          entityId: backup.id,
          description: `Created ${backupType} backup with ${totalRecords} records`,
          metadata: backupData.counts
        }
      });

      return NextResponse.json({
        success: true,
        backup: completedBackup,
        data: backupData
      });
    } catch (error) {
      // Update backup record as failed
      await db.dataBackup.update({
        where: { id: backup.id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      });

      throw error;
    }
  } catch (error) {
    console.error('Backup creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
