'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Filter,
  Search,
  Download,
  History,
  TrendingUp,
  Activity,
  FileText,
  Calendar,
  DollarSign,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  description: string | null;
  metadata: any;
  createdAt: string;
}

interface ActivityStats {
  summary: {
    totalActivities: number;
    days: number;
  };
  byType: Array<{ type: string; count: number }>;
  byAction: Array<{ action: string; count: number }>;
  recent: ActivityLog[];
  timeline: Array<{ date: string; count: number }>;
}

export default function HistoryPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Mock userId - in production, this would come from auth
  const userId = 'demo-user-id';

  // Load activities
  const loadActivities = async (reset = false) => {
    try {
      setLoading(true);
      const offset = reset ? 0 : page * 50;

      const params = new URLSearchParams({
        userId,
        limit: '50',
        offset: offset.toString(),
      });

      if (filterAction && filterAction !== 'all') {
        params.append('action', filterAction);
      }

      if (filterType && filterType !== 'all') {
        params.append('entityType', filterType);
      }

      const response = await fetch(`/api/activity/log?${params}`);
      const data = await response.json();

      if (reset) {
        setActivities(data.logs || []);
      } else {
        setActivities(prev => [...prev, ...(data.logs || [])]);
      }

      setHasMore(data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch(`/api/activity/stats?userId=${userId}&days=30`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadActivities(true);
    loadStats();
  }, [filterAction, filterType]);

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Plus className="w-4 h-4" />;
      case 'updated': return <Edit className="w-4 h-4" />;
      case 'deleted': return <Trash2 className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      case 'generated': return <Sparkles className="w-4 h-4" />;
      case 'exported': return <Download className="w-4 h-4" />;
      case 'backed_up': return <Download className="w-4 h-4" />;
      case 'restored': return <RefreshCw className="w-4 h-4" />;
      case 'versioned': return <History className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Get entity type icon
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'hook': return <Sparkles className="w-4 h-4" />;
      case 'script': return <FileText className="w-4 h-4" />;
      case 'story': return <FileText className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'bg-green-500/10 text-green-500';
      case 'updated': return 'bg-blue-500/10 text-blue-500';
      case 'deleted': return 'bg-red-500/10 text-red-500';
      case 'viewed': return 'bg-purple-500/10 text-purple-500';
      case 'generated': return 'bg-yellow-500/10 text-yellow-500';
      case 'exported': return 'bg-cyan-500/10 text-cyan-500';
      case 'backed_up': return 'bg-indigo-500/10 text-indigo-500';
      case 'restored': return 'bg-pink-500/10 text-pink-500';
      case 'versioned': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Filter activities by search
  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      activity.action.toLowerCase().includes(searchLower) ||
      activity.entityType.toLowerCase().includes(searchLower) ||
      activity.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={History}
        iconColor="text-[#2563EB]"
        eyebrow="History"
        title="Activity History"
        description="Complete record of all your actions and system events"
      />
      <div className="px-6 py-8">

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.summary.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">Last {stats.summary.days} days</p>
                </CardContent>
              </Card>

              {stats.byType.slice(0, 3).map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium capitalize">
                      {item.type}s
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <p className="text-xs text-muted-foreground">Actions logged</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Action Type</label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="updated">Updated</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="exported">Exported</SelectItem>
                      <SelectItem value="backed_up">Backed Up</SelectItem>
                      <SelectItem value="restored">Restored</SelectItem>
                      <SelectItem value="versioned">Versioned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Entity Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hook">Hooks</SelectItem>
                      <SelectItem value="script">Scripts</SelectItem>
                      <SelectItem value="story">Stories</SelectItem>
                      <SelectItem value="calendar">Calendar</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && page === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Loading activities...</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No activities found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterAction !== 'all' || filterType !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Start creating content to see your activity history'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getActionColor(activity.action)}`}>
                        {getActionIcon(activity.action)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {activity.action}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            {getEntityIcon(activity.entityType)}
                            <span className="capitalize">{activity.entityType}</span>
                          </span>
                        </div>

                        <p className="text-sm mb-2">
                          {activity.description || `${activity.action} ${activity.entityType}`}
                        </p>

                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  ))}

                  {hasMore && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPage(p => p + 1);
                        loadActivities(false);
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {stats && (
            <>
              {/* Action Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of actions over the last {stats.summary.days} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byAction.map((item) => (
                      <div key={item.action}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize flex items-center gap-2">
                            {getActionIcon(item.action)}
                            {item.action}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({Math.round((item.count / stats.summary.totalActivities) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{
                              width: `${(item.count / stats.summary.totalActivities) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Entity Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Type Distribution</CardTitle>
                  <CardDescription>
                    Activity by content type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byType.map((item) => (
                      <div key={item.type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize flex items-center gap-2">
                            {getEntityIcon(item.type)}
                            {item.type}s
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({Math.round((item.count / stats.summary.totalActivities) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{
                              width: `${(item.count / stats.summary.totalActivities) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>
                    Daily activity over the last {stats.summary.days} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-1">
                    {stats.timeline.map((item) => {
                      const maxCount = Math.max(...stats.timeline.map(t => t.count));
                      const height = (item.count / maxCount) * 100;

                      return (
                        <div
                          key={item.date}
                          className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-all relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                            <div className="bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString()}: {item.count} activities
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}
