import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, backupData } = body;

    if (!userId || !backupData) {
      return NextResponse.json(
        { error: 'userId and backupData are required' },
        { status: 400 }
      );
    }

    const { data } = backupData;

    // Restore data in transaction
    const results = {
      hooks: 0,
      scripts: 0,
      stories: 0,
      calendar: 0,
      revenue: 0,
      activityLogs: 0,
      versions: 0
    };

    // Restore hooks
    if (data.hooks && Array.isArray(data.hooks)) {
      for (const hook of data.hooks) {
        try {
          await db.hook.create({
            data: {
              ...hook,
              id: undefined, // Let database generate new ID
              userId
            }
          });
          results.hooks++;
        } catch (error) {
          console.error('Error restoring hook:', error);
        }
      }
    }

    // Restore scripts
    if (data.scripts && Array.isArray(data.scripts)) {
      for (const script of data.scripts) {
        try {
          await db.script.create({
            data: {
              ...script,
              id: undefined,
              userId
            }
          });
          results.scripts++;
        } catch (error) {
          console.error('Error restoring script:', error);
        }
      }
    }

    // Restore stories
    if (data.stories && Array.isArray(data.stories)) {
      for (const story of data.stories) {
        try {
          await db.story.create({
            data: {
              ...story,
              id: undefined,
              userId
            }
          });
          results.stories++;
        } catch (error) {
          console.error('Error restoring story:', error);
        }
      }
    }

    // Restore calendar entries
    if (data.calendar && Array.isArray(data.calendar)) {
      for (const entry of data.calendar) {
        try {
          await db.calendarEntry.create({
            data: {
              ...entry,
              id: undefined,
              userId
            }
          });
          results.calendar++;
        } catch (error) {
          console.error('Error restoring calendar entry:', error);
        }
      }
    }

    // Restore revenue
    if (data.revenue && Array.isArray(data.revenue)) {
      for (const rev of data.revenue) {
        try {
          await db.revenue.create({
            data: {
              ...rev,
              id: undefined,
              userId
            }
          });
          results.revenue++;
        } catch (error) {
          console.error('Error restoring revenue:', error);
        }
      }
    }

    // Log the restore activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'restored',
        entityType: 'system',
        description: `Restored backup with ${Object.values(results).reduce((a, b) => a + b, 0)} records`,
        metadata: results
      }
    });

    return NextResponse.json({
      success: true,
      results,
      totalRestored: Object.values(results).reduce((a, b) => a + b, 0)
    });
  } catch (error) {
    console.error('Backup restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
