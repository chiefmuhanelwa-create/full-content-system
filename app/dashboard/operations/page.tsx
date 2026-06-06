'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Database,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  BarChart3,
  Shield,
  Server,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';

interface SystemStatus {
  healthy: boolean;
  lastBackup: string | null;
  totalRecords: number;
  diskUsage: number;
  activeUsers: number;
}

interface ActivitySummary {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  topActions: Array<{ action: string; count: number }>;
}

export default function OperationsPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    healthy: true,
    lastBackup: null,
    totalRecords: 0,
    diskUsage: 0,
    activeUsers: 1
  });

  const [activitySummary, setActivitySummary] = useState<ActivitySummary>({
    totalActivities: 0,
    todayActivities: 0,
    weekActivities: 0,
    topActions: []
  });

  const [backupStatus, setBackupStatus] = useState<{
    inProgress: boolean;
    lastBackup: Date | null;
    backupCount: number;
  }>({
    inProgress: false,
    lastBackup: null,
    backupCount: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = 'default-user-id'
  const [seedStatus, setSeedStatus] = useState<Record<string, string>>({})

  const runSeed = async (label: string, url: string, needsInternalHeader = false) => {
    setSeedStatus(prev => ({ ...prev, [label]: 'running' }))
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (needsInternalHeader) headers['x-internal-seed'] = '1'
      const resp = await fetch(url, { method: 'POST', headers })
      const data = await resp.json()
      setSeedStatus(prev => ({ ...prev, [label]: data.success ? 'done' : `error: ${data.error || 'failed'}` }))
    } catch (e: any) {
      setSeedStatus(prev => ({ ...prev, [label]: `error: ${e.message}` }))
    }
  }

  // Load system data
  const loadSystemData = async () => {
    try {
      setLoading(true);

      // Load activity stats
      const statsResponse = await fetch(`/api/activity/stats?userId=${userId}&days=30`);
      const statsData = await statsResponse.json();

      // Load backup list
      const backupResponse = await fetch(`/api/backup/list?userId=${userId}`);
      const backupData = await backupResponse.json();

      // Update state
      setActivitySummary({
        totalActivities: statsData.summary.totalActivities,
        todayActivities: statsData.timeline[statsData.timeline.length - 1]?.count || 0,
        weekActivities: statsData.timeline.slice(-7).reduce((sum: number, day: any) => sum + day.count, 0),
        topActions: statsData.byAction.slice(0, 5)
      });

      setBackupStatus({
        inProgress: false,
        lastBackup: backupData.summary.latestBackup?.completedAt
          ? new Date(backupData.summary.latestBackup.completedAt)
          : null,
        backupCount: backupData.summary.total
      });

      setRecentActivity(statsData.recent || []);

      // Update system status
      setSystemStatus({
        healthy: true,
        lastBackup: backupData.summary.latestBackup?.completedAt || null,
        totalRecords: statsData.summary.totalActivities,
        diskUsage: 45, // Mock data
        activeUsers: 1
      });
    } catch (error) {
      console.error('Failed to load system data:', error);
      setSystemStatus(prev => ({ ...prev, healthy: false }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Create backup
  const handleCreateBackup = async () => {
    try {
      setBackupStatus(prev => ({ ...prev, inProgress: true }));

      const response = await fetch('/api/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, backupType: 'user_data' })
      });

      const data = await response.json();

      if (data.success) {
        setBackupStatus({
          inProgress: false,
          lastBackup: new Date(),
          backupCount: backupStatus.backupCount + 1
        });

        // Show success message
        alert('Backup created successfully!');
        await loadSystemData();
      }
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed. Please try again.');
    } finally {
      setBackupStatus(prev => ({ ...prev, inProgress: false }));
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      const response = await fetch('/api/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, backupType: 'user_data' })
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nochill-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Operations Center</h1>
          <p className="text-muted-foreground">
            Monitor system health, manage backups, and view activity
          </p>
        </div>

        <Button onClick={loadSystemData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className={`w-4 h-4 ${systemStatus.healthy ? 'text-green-500' : 'text-red-500'}`} />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {systemStatus.healthy ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-bold">Healthy</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-bold">Issues</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{activitySummary.totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              {activitySummary.todayActivities} added today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{systemStatus.diskUsage}%</div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${systemStatus.diskUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Last Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold mb-2">
              {backupStatus.lastBackup
                ? backupStatus.lastBackup.toLocaleDateString()
                : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {backupStatus.backupCount} total backups
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Activity Summary
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <span className="text-sm font-medium">Today</span>
                    <Badge variant="default">{activitySummary.todayActivities}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <span className="text-sm font-medium">This Week</span>
                    <Badge variant="outline">{activitySummary.weekActivities}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <span className="text-sm font-medium">Total</span>
                    <Badge variant="outline">{activitySummary.totalActivities}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Actions
                </CardTitle>
                <CardDescription>Most frequent activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activitySummary.topActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{action.action}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{
                              width: `${(action.count / activitySummary.totalActivities) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {action.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common operational tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleCreateBackup}
                  disabled={backupStatus.inProgress}
                  className="h-24 flex flex-col gap-2"
                >
                  {backupStatus.inProgress ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Backup...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-6 h-6" />
                      <span>Create Backup</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Export All Data</span>
                </Button>

                <Link href="/dashboard/history">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Activity className="w-6 h-6" />
                    <span>View Full History</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Seeding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Data Seeding
              </CardTitle>
              <CardDescription>Pre-populate the system with NoChill data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    key: 'stories',
                    label: 'Seed Story Bank',
                    desc: '10 proof stories (Bathroom Floors, R10K Month, 445 Emails…)',
                    url: '/api/story-bank/seed',
                    internalHeader: true,
                  },
                  {
                    key: 'products',
                    label: 'Seed Products',
                    desc: '10 official NoChill products (force reseed)',
                    url: '/api/products/seed?force=true',
                    internalHeader: false,
                  },
                  {
                    key: 'icp',
                    label: 'Seed ICP Pain Library',
                    desc: 'Called Expert + DNA Creator pain maps',
                    url: '/api/icp-pain-library/seed',
                    internalHeader: true,
                  },
                ].map((item) => {
                  const status = seedStatus[item.key]
                  return (
                    <div key={item.key} className="border rounded-lg p-4 space-y-3">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                      {status && (
                        <p className={`text-xs font-mono ${status === 'running' ? 'text-yellow-500' : status === 'done' ? 'text-green-500' : 'text-red-500'}`}>
                          {status === 'running' ? '⏳ Running…' : status === 'done' ? '✅ Done' : `❌ ${status}`}
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled={status === 'running'}
                        onClick={() => runSeed(item.key, item.url, item.internalHeader)}
                      >
                        {status === 'running' ? 'Seeding…' : 'Run Seed'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 10 activities</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Loading...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {activity.action}
                        </Badge>
                        <span className="text-sm">
                          {activity.description || `${activity.action} ${activity.entityType}`}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Management</CardTitle>
              <CardDescription>Create and manage data backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <h3 className="font-medium mb-1">Automatic Backups</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is continuously saved to the database
                    </p>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Last Backup</h3>
                    <p className="text-2xl font-bold mb-1">
                      {backupStatus.lastBackup
                        ? backupStatus.lastBackup.toLocaleDateString()
                        : 'Never'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {backupStatus.lastBackup
                        ? backupStatus.lastBackup.toLocaleTimeString()
                        : 'Create your first backup'}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Total Backups</h3>
                    <p className="text-2xl font-bold mb-1">{backupStatus.backupCount}</p>
                    <p className="text-sm text-muted-foreground">
                      Backup history available
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCreateBackup}
                    disabled={backupStatus.inProgress}
                    className="flex-1"
                  >
                    {backupStatus.inProgress ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Create Backup Now
                      </>
                    )}
                  </Button>

                  <Button onClick={handleExportData} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export to File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
