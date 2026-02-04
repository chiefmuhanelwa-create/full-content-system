/**
 * Migration Utility
 * Migrate localStorage data to database for permanent persistence
 */

export interface MigrationResult {
  success: boolean;
  migrated: {
    hooks: number;
    scripts: number;
    stories: number;
    calendar: number;
    revenue: number;
  };
  failed: {
    hooks: number;
    scripts: number;
    stories: number;
    calendar: number;
    revenue: number;
  };
  errors: string[];
}

/**
 * Migrate all localStorage data to database
 */
export async function migrateLocalStorageToDatabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: {
      hooks: 0,
      scripts: 0,
      stories: 0,
      calendar: 0,
      revenue: 0,
    },
    failed: {
      hooks: 0,
      scripts: 0,
      stories: 0,
      calendar: 0,
      revenue: 0,
    },
    errors: [],
  };

  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      throw new Error('Migration can only run in browser environment');
    }

    // Migrate hooks
    const hooksData = localStorage.getItem('hooks');
    if (hooksData) {
      try {
        const hooks = JSON.parse(hooksData);
        if (Array.isArray(hooks)) {
          for (const hook of hooks) {
            try {
              const response = await fetch('/api/hooks/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...hook }),
              });

              if (response.ok) {
                result.migrated.hooks++;
              } else {
                result.failed.hooks++;
                result.errors.push(`Failed to migrate hook: ${hook.content?.substring(0, 50)}`);
              }
            } catch (error) {
              result.failed.hooks++;
              result.errors.push(`Error migrating hook: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse hooks data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate scripts
    const scriptsData = localStorage.getItem('scripts');
    if (scriptsData) {
      try {
        const scripts = JSON.parse(scriptsData);
        if (Array.isArray(scripts)) {
          for (const script of scripts) {
            try {
              const response = await fetch('/api/scripts/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...script }),
              });

              if (response.ok) {
                result.migrated.scripts++;
              } else {
                result.failed.scripts++;
                result.errors.push(`Failed to migrate script: ${script.title?.substring(0, 50)}`);
              }
            } catch (error) {
              result.failed.scripts++;
              result.errors.push(`Error migrating script: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse scripts data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate stories
    const storiesData = localStorage.getItem('stories');
    if (storiesData) {
      try {
        const stories = JSON.parse(storiesData);
        if (Array.isArray(stories)) {
          for (const story of stories) {
            try {
              const response = await fetch('/api/stories/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...story }),
              });

              if (response.ok) {
                result.migrated.stories++;
              } else {
                result.failed.stories++;
                result.errors.push(`Failed to migrate story: ${story.title?.substring(0, 50)}`);
              }
            } catch (error) {
              result.failed.stories++;
              result.errors.push(`Error migrating story: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse stories data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate calendar
    const calendarData = localStorage.getItem('calendarEntries');
    if (calendarData) {
      try {
        const entries = JSON.parse(calendarData);
        if (Array.isArray(entries)) {
          for (const entry of entries) {
            try {
              const response = await fetch('/api/calendar/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...entry }),
              });

              if (response.ok) {
                result.migrated.calendar++;
              } else {
                result.failed.calendar++;
                result.errors.push(`Failed to migrate calendar entry: ${entry.title?.substring(0, 50)}`);
              }
            } catch (error) {
              result.failed.calendar++;
              result.errors.push(`Error migrating calendar entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse calendar data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate revenue
    const revenueData = localStorage.getItem('revenueEntries');
    if (revenueData) {
      try {
        const entries = JSON.parse(revenueData);
        if (Array.isArray(entries)) {
          for (const entry of entries) {
            try {
              const response = await fetch('/api/revenue/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...entry }),
              });

              if (response.ok) {
                result.migrated.revenue++;
              } else {
                result.failed.revenue++;
                result.errors.push(`Failed to migrate revenue entry: ${entry.stream}`);
              }
            } catch (error) {
              result.failed.revenue++;
              result.errors.push(`Error migrating revenue entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse revenue data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Check if migration was successful
    const totalMigrated = Object.values(result.migrated).reduce((sum, count) => sum + count, 0);
    const totalFailed = Object.values(result.failed).reduce((sum, count) => sum + count, 0);

    result.success = totalMigrated > 0 || (totalMigrated === 0 && totalFailed === 0);

    return result;
  } catch (error) {
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Check if localStorage has data to migrate
 */
export function hasLocalStorageData(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const keys = ['hooks', 'scripts', 'stories', 'calendarEntries', 'revenueEntries'];

  for (const key of keys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return true;
        }
      } catch {
        // Invalid JSON, skip
      }
    }
  }

  return false;
}

/**
 * Get localStorage data counts
 */
export function getLocalStorageCounts(): {
  hooks: number;
  scripts: number;
  stories: number;
  calendar: number;
  revenue: number;
  total: number;
} {
  const counts = {
    hooks: 0,
    scripts: 0,
    stories: 0,
    calendar: 0,
    revenue: 0,
    total: 0,
  };

  if (typeof window === 'undefined') {
    return counts;
  }

  try {
    const hooks = localStorage.getItem('hooks');
    if (hooks) {
      const parsed = JSON.parse(hooks);
      if (Array.isArray(parsed)) counts.hooks = parsed.length;
    }

    const scripts = localStorage.getItem('scripts');
    if (scripts) {
      const parsed = JSON.parse(scripts);
      if (Array.isArray(parsed)) counts.scripts = parsed.length;
    }

    const stories = localStorage.getItem('stories');
    if (stories) {
      const parsed = JSON.parse(stories);
      if (Array.isArray(parsed)) counts.stories = parsed.length;
    }

    const calendar = localStorage.getItem('calendarEntries');
    if (calendar) {
      const parsed = JSON.parse(calendar);
      if (Array.isArray(parsed)) counts.calendar = parsed.length;
    }

    const revenue = localStorage.getItem('revenueEntries');
    if (revenue) {
      const parsed = JSON.parse(revenue);
      if (Array.isArray(parsed)) counts.revenue = parsed.length;
    }

    counts.total = counts.hooks + counts.scripts + counts.stories + counts.calendar + counts.revenue;
  } catch (error) {
    console.error('Error counting localStorage data:', error);
  }

  return counts;
}

/**
 * Clear localStorage after successful migration
 */
export function clearLocalStorageAfterMigration(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const keys = ['hooks', 'scripts', 'stories', 'calendarEntries', 'revenueEntries'];

  for (const key of keys) {
    // Create a backup before clearing
    const data = localStorage.getItem(key);
    if (data) {
      localStorage.setItem(`${key}_backup_${Date.now()}`, data);
    }

    // Clear the key
    localStorage.removeItem(key);
  }
}
