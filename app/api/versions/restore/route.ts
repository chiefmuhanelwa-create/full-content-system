import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      entityType,
      entityId,
      versionId
    } = body;

    // Validate required fields
    if (!userId || !entityType || !entityId || !versionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, entityType, entityId, versionId' },
        { status: 400 }
      );
    }

    // Get the version to restore
    const versionToRestore = await db.contentVersion.findUnique({
      where: { id: versionId }
    });

    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Mark all versions as inactive
    await db.contentVersion.updateMany({
      where: {
        userId,
        entityType,
        entityId
      },
      data: {
        isActive: false
      }
    });

    // Mark the selected version as active
    const restoredVersion = await db.contentVersion.update({
      where: { id: versionId },
      data: { isActive: true }
    });

    // Log the activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'restored',
        entityType,
        entityId,
        description: `Restored to version ${restoredVersion.version}`,
        metadata: {
          versionId,
          version: restoredVersion.version
        }
      }
    });

    return NextResponse.json({
      success: true,
      version: restoredVersion,
      content: restoredVersion.content
    });
  } catch (error) {
    console.error('Version restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
