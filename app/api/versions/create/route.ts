import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkDatabase } from '@/lib/db-helper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const body = await request.json();
    const {
      userId,
      entityType,
      entityId,
      content,
      changeType,
      changes,
      changeReason
    } = body;

    // Validate required fields
    if (!userId || !entityType || !entityId || !content || !changeType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, entityType, entityId, content, changeType' },
        { status: 400 }
      );
    }

    // Get current version number
    const latestVersion = await db!.contentVersion.findFirst({
      where: {
        userId,
        entityType,
        entityId
      },
      orderBy: {
        version: 'desc'
      },
      select: {
        version: true
      }
    });

    const newVersion = (latestVersion?.version || 0) + 1;

    // Mark all previous versions as inactive
    if (latestVersion) {
      await db!.contentVersion.updateMany({
        where: {
          userId,
          entityType,
          entityId,
          isActive: true
        },
        data: {
          isActive: false
        }
      });
    }

    // Create new version
    const contentVersion = await db!.contentVersion.create({
      data: {
        userId,
        entityType,
        entityId,
        version: newVersion,
        content: content || {},
        changeType,
        changes: changes || {},
        changeReason,
        isActive: true
      }
    });

    // Log the activity
    await db!.activityLog.create({
      data: {
        userId,
        action: 'versioned',
        entityType,
        entityId,
        description: `Created version ${newVersion} (${changeType})`,
        metadata: {
          version: newVersion,
          changeType,
          changeReason
        }
      }
    });

    return NextResponse.json({
      success: true,
      version: contentVersion
    });
  } catch (error) {
    console.error('Version creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}
