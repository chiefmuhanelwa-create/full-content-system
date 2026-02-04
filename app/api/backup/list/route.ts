import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get all backups for user
    const backups = await db.dataBackup.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' }
    });

    // Get summary statistics
    const summary = {
      total: backups.length,
      completed: backups.filter(b => b.status === 'completed').length,
      failed: backups.filter(b => b.status === 'failed').length,
      pending: backups.filter(b => b.status === 'pending').length,
      totalSize: backups.reduce((sum, b) => sum + Number(b.fileSize || 0), 0),
      latestBackup: backups[0]
    };

    return NextResponse.json({
      backups,
      summary
    });
  } catch (error) {
    console.error('Backup list retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve backup list' },
      { status: 500 }
    );
  }
}
