import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkDatabase } from '@/lib/db-helper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check if database is available
  const dbError = checkDatabase();
  if (dbError) return dbError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!userId || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, entityType, entityId' },
        { status: 400 }
      );
    }

    // Get all versions
    const versions = await db!.contentVersion.findMany({
      where: {
        userId,
        entityType,
        entityId
      },
      orderBy: {
        version: 'desc'
      }
    });

    // Get version count
    const totalVersions = versions.length;

    // Get active version
    type Version = typeof versions[number];
    const activeVersion = versions.find((v: Version) => v.isActive);

    return NextResponse.json({
      versions,
      summary: {
        totalVersions,
        activeVersion: activeVersion?.version || null,
        firstCreated: versions[versions.length - 1]?.createdAt,
        lastUpdated: versions[0]?.createdAt
      }
    });
  } catch (error) {
    console.error('Version history retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve version history' },
      { status: 500 }
    );
  }
}
