import { db } from './db';

/**
 * Activity Logger
 * Centralized logging for all user actions
 */

export interface LogActivityParams {
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'generated' | 'exported' | 'backed_up' | 'restored' | 'versioned';
  entityType: 'hook' | 'script' | 'story' | 'calendar' | 'revenue' | 'user_setting' | 'system';
  entityId?: string;
  description?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface CreateVersionParams {
  userId: string;
  entityType: 'hook' | 'script' | 'story';
  entityId: string;
  content: any;
  changeType: 'create' | 'edit' | 'refine' | 'optimize';
  changes?: any;
  changeReason?: string;
}

/**
 * Log an activity
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const activityLog = await db.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        description: params.description || null,
        metadata: params.metadata || {},
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        sessionId: params.sessionId || null,
      },
    });

    return { success: true, activityLog };
  } catch (error) {
    console.error('Failed to log activity:', error);
    return { success: false, error };
  }
}

/**
 * Create a new version of content
 */
export async function createVersion(params: CreateVersionParams) {
  try {
    // Get current version number
    const latestVersion = await db.contentVersion.findFirst({
      where: {
        userId: params.userId,
        entityType: params.entityType,
        entityId: params.entityId,
      },
      orderBy: {
        version: 'desc',
      },
      select: {
        version: true,
      },
    });

    const newVersion = (latestVersion?.version || 0) + 1;

    // Mark all previous versions as inactive
    if (latestVersion) {
      await db.contentVersion.updateMany({
        where: {
          userId: params.userId,
          entityType: params.entityType,
          entityId: params.entityId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create new version
    const contentVersion = await db.contentVersion.create({
      data: {
        userId: params.userId,
        entityType: params.entityType,
        entityId: params.entityId,
        version: newVersion,
        content: params.content || {},
        changeType: params.changeType,
        changes: params.changes || {},
        changeReason: params.changeReason || null,
        isActive: true,
      },
    });

    // Log the versioning activity
    await logActivity({
      userId: params.userId,
      action: 'versioned',
      entityType: params.entityType,
      entityId: params.entityId,
      description: `Created version ${newVersion} (${params.changeType})`,
      metadata: {
        version: newVersion,
        changeType: params.changeType,
        changeReason: params.changeReason,
      },
    });

    return { success: true, version: contentVersion };
  } catch (error) {
    console.error('Failed to create version:', error);
    return { success: false, error };
  }
}

/**
 * Batch log multiple activities
 */
export async function logActivities(activities: LogActivityParams[]) {
  try {
    const results = await Promise.allSettled(
      activities.map(activity => logActivity(activity))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      success: true,
      total: activities.length,
      successful,
      failed,
      results,
    };
  } catch (error) {
    console.error('Failed to batch log activities:', error);
    return { success: false, error };
  }
}

/**
 * Get activity summary for a user
 */
export async function getActivitySummary(userId: string, days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalCount, byType, byAction] = await Promise.all([
      db.activityLog.count({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
      }),
      db.activityLog.groupBy({
        by: ['entityType'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: true,
      }),
      db.activityLog.groupBy({
        by: ['action'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: true,
      }),
    ]);

    return {
      success: true,
      summary: {
        totalActivities: totalCount,
        days,
        startDate,
      },
      byType,
      byAction,
    };
  } catch (error) {
    console.error('Failed to get activity summary:', error);
    return { success: false, error };
  }
}

/**
 * Save content with automatic versioning and logging
 */
export async function saveWithHistory(params: {
  userId: string;
  entityType: 'hook' | 'script' | 'story';
  entityId: string;
  content: any;
  changeType: 'create' | 'edit' | 'refine' | 'optimize';
  changeReason?: string;
  description?: string;
}) {
  try {
    // Create version
    const versionResult = await createVersion({
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
      content: params.content,
      changeType: params.changeType,
      changes: {},
      changeReason: params.changeReason,
    });

    if (!versionResult.success) {
      throw new Error('Failed to create version');
    }

    // Log the save action
    const action = params.changeType === 'create' ? 'created' : 'updated';
    await logActivity({
      userId: params.userId,
      action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description || `${action} ${params.entityType}`,
      metadata: {
        changeType: params.changeType,
        version: versionResult.version?.version,
      },
    });

    return {
      success: true,
      version: versionResult.version,
    };
  } catch (error) {
    console.error('Failed to save with history:', error);
    return { success: false, error };
  }
}

/**
 * Track content generation
 */
export async function trackGeneration(params: {
  userId: string;
  entityType: 'hook' | 'script' | 'story';
  count: number;
  metadata?: any;
}) {
  return logActivity({
    userId: params.userId,
    action: 'generated',
    entityType: params.entityType,
    description: `Generated ${params.count} ${params.entityType}${params.count !== 1 ? 's' : ''}`,
    metadata: {
      count: params.count,
      ...params.metadata,
    },
  });
}

/**
 * Track exports
 */
export async function trackExport(params: {
  userId: string;
  entityType: string;
  entityId?: string;
  format: 'pdf' | 'json' | 'csv';
  metadata?: any;
}) {
  return logActivity({
    userId: params.userId,
    action: 'exported',
    entityType: params.entityType as any,
    entityId: params.entityId,
    description: `Exported ${params.entityType} to ${params.format.toUpperCase()}`,
    metadata: {
      format: params.format,
      ...params.metadata,
    },
  });
}
