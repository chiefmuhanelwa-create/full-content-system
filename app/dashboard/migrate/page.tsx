'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  HardDrive,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  Info
} from 'lucide-react';
import {
  migrateLocalStorageToDatabase,
  hasLocalStorageData,
  getLocalStorageCounts,
  clearLocalStorageAfterMigration,
  MigrationResult
} from '@/lib/migrate-storage';
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function MigratePage() {
  const [hasData, setHasData] = useState(false);
  const [counts, setCounts] = useState({
    hooks: 0,
    scripts: 0,
    stories: 0,
    calendar: 0,
    revenue: 0,
    total: 0,
  });
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [hooksKbStatus, setHooksKbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [storiesKbStatus, setStoriesKbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hooksKbMessage, setHooksKbMessage] = useState('');
  const [storiesKbMessage, setStoriesKbMessage] = useState('');

  // Mock userId - in production, get from auth
  const userId = 'demo-user-id';

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const checkLocalStorage = () => {
    setHasData(hasLocalStorageData());
    setCounts(getLocalStorageCounts());
  };

  const handleMigrate = async () => {
    try {
      setMigrating(true);
      setMigrationResult(null);

      const result = await migrateLocalStorageToDatabase(userId);
      setMigrationResult(result);

      // Refresh counts
      checkLocalStorage();
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResult({
        success: false,
        migrated: { hooks: 0, scripts: 0, stories: 0, calendar: 0, revenue: 0 },
        failed: { hooks: 0, scripts: 0, stories: 0, calendar: 0, revenue: 0 },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setMigrating(false);
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure? This will clear your localStorage data. Make sure you have migrated to the database first!')) {
      clearLocalStorageAfterMigration();
      checkLocalStorage();
      alert('localStorage cleared successfully. Backup files have been created.');
    }
  };

  const handleExportBackup = () => {
    const data = {
      hooks: localStorage.getItem('hooks'),
      scripts: localStorage.getItem('scripts'),
      stories: localStorage.getItem('stories'),
      calendar: localStorage.getItem('calendarEntries'),
      revenue: localStorage.getItem('revenueEntries'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const migrateKnowledgeBaseHooks = async () => {
    setHooksKbStatus('loading');
    setHooksKbMessage('');

    try {
      const response = await fetch('/api/migrate/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setHooksKbStatus('success');
        setHooksKbMessage(data.message || `Migrated ${data.migratedCount} hooks successfully!`);
      } else {
        setHooksKbStatus('error');
        setHooksKbMessage(data.error || 'Failed to migrate hooks');
      }
    } catch (error: any) {
      setHooksKbStatus('error');
      setHooksKbMessage(error.message || 'Failed to migrate hooks');
    }
  };

  const migrateKnowledgeBaseStories = async () => {
    setStoriesKbStatus('loading');
    setStoriesKbMessage('');

    try {
      const response = await fetch('/api/migrate/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setStoriesKbStatus('success');
        setStoriesKbMessage(data.message || `Migrated ${data.migratedCount} stories successfully!`);
      } else {
        setStoriesKbStatus('error');
        setStoriesKbMessage(data.error || 'Failed to migrate stories');
      }
    } catch (error: any) {
      setStoriesKbStatus('error');
      setStoriesKbMessage(error.message || 'Failed to migrate stories');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Info}
        iconColor="text-blue-500"
        eyebrow="Migrate"
        title="Data Migration"
        description="Migrate your data from browser storage to permanent database"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-500">Why Migrate?</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Permanent Storage:</strong> Your data will be saved in a database, not just your browser</li>
                <li>• <strong>No Data Loss:</strong> Won't lose data when clearing browser cache</li>
                <li>• <strong>Cross-Device Access:</strong> Access your content from any device</li>
                <li>• <strong>Better Performance:</strong> Faster loading and more reliable</li>
                <li>• <strong>Version Control:</strong> Track all changes and revisions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Storage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Current Storage Status
          </CardTitle>
          <CardDescription>Data currently in browser localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Hooks', count: counts.hooks, color: 'text-yellow-500' },
                  { label: 'Scripts', count: counts.scripts, color: 'text-blue-500' },
                  { label: 'Stories', count: counts.stories, color: 'text-purple-500' },
                  { label: 'Calendar', count: counts.calendar, color: 'text-green-500' },
                  { label: 'Revenue', count: counts.revenue, color: 'text-red-500' },
                  { label: 'Total', count: counts.total, color: 'text-primary' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-lg border bg-accent/50"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      {item.label}
                    </div>
                    <div className={`text-2xl font-bold ${item.color}`}>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleMigrate}
                  disabled={migrating || counts.total === 0}
                  className="flex-1"
                  size="lg"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5 mr-2" />
                      Migrate to Database
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleExportBackup}
                  variant="outline"
                  disabled={counts.total === 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Backup
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No Data to Migrate</p>
              <p className="text-sm text-muted-foreground">
                Your localStorage is empty or already migrated
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Arrow */}
      {hasData && (
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
        </div>
      )}

      {/* Database Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Storage
          </CardTitle>
          <CardDescription>Permanent, secure, and cross-device accessible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-500 mb-1">
                  Database Ready
                </p>
                <p className="text-muted-foreground">
                  All new content is automatically saved to the database with full version control
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Automatic backups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Version history</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Activity logging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Cross-device sync</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Migration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Knowledge Base Migration
          </CardTitle>
          <CardDescription>Import proven hooks and stories from JSON knowledge base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 120 Hooks Migration */}
          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium mb-1">120 Proven Hooks Bank</h4>
              <p className="text-sm text-muted-foreground">
                Import all 120 battle-tested hooks with R×A×C×U^B components from the knowledge base
              </p>
            </div>
            <Button
              onClick={migrateKnowledgeBaseHooks}
              disabled={hooksKbStatus === 'loading' || hooksKbStatus === 'success'}
              variant="outline"
              className="w-full"
            >
              {hooksKbStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {hooksKbStatus === 'success' && <CheckCircle2 className="w-4 h-4 mr-2" />}
              {hooksKbStatus === 'success' ? 'Hooks Migrated ✓' : 'Import 120 Hooks'}
            </Button>
            {hooksKbMessage && (
              <div className={`text-sm p-2 rounded ${
                hooksKbStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {hooksKbMessage}
              </div>
            )}
          </div>

          {/* Stories Migration */}
          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium mb-1">Ndivhuwo's Stories Bank</h4>
              <p className="text-sm text-muted-foreground">
                Import all personal stories with transformations and proof points from the knowledge base
              </p>
            </div>
            <Button
              onClick={migrateKnowledgeBaseStories}
              disabled={storiesKbStatus === 'loading' || storiesKbStatus === 'success'}
              variant="outline"
              className="w-full"
            >
              {storiesKbStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {storiesKbStatus === 'success' && <CheckCircle2 className="w-4 h-4 mr-2" />}
              {storiesKbStatus === 'success' ? 'Stories Migrated ✓' : 'Import Personal Stories'}
            </Button>
            {storiesKbMessage && (
              <div className={`text-sm p-2 rounded ${
                storiesKbStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {storiesKbMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Migration Results */}
      {migrationResult && (
        <Card className={migrationResult.success ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {migrationResult.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Migration Complete</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Migration Issues</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success counts */}
            <div>
              <h4 className="text-sm font-medium mb-3">Successfully Migrated</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(migrationResult.migrated).map(([key, count]) => (
                  <Badge key={key} variant="outline" className="justify-center">
                    {key}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Failed counts */}
            {Object.values(migrationResult.failed).some(count => count > 0) && (
              <div>
                <h4 className="text-sm font-medium mb-3 text-red-500">Failed</h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(migrationResult.failed)
                    .filter(([_, count]) => count > 0)
                    .map(([key, count]) => (
                      <Badge key={key} variant="destructive" className="justify-center">
                        {key}: {count}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {migrationResult.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-500">Errors</h4>
                <div className="text-xs space-y-1 max-h-32 overflow-auto">
                  {migrationResult.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-muted-foreground">
                      • {error}
                    </div>
                  ))}
                  {migrationResult.errors.length > 10 && (
                    <div className="text-muted-foreground">
                      ... and {migrationResult.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clear localStorage button */}
            {migrationResult.success && hasData && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleClearLocalStorage}
                  variant="outline"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear localStorage (Keep Database)
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Safe to clear after successful migration. Backups will be created.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  );
}
