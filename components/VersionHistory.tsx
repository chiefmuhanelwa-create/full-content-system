'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  History,
  RefreshCw,
  Check,
  Clock,
  Eye,
  GitBranch
} from 'lucide-react';

interface ContentVersion {
  id: string;
  version: number;
  content: any;
  changeType: string;
  changes: any;
  changeReason: string | null;
  isActive: boolean;
  createdAt: string;
}

interface VersionHistoryProps {
  userId: string;
  entityType: string;
  entityId: string;
  onRestore?: (version: ContentVersion) => void;
}

export function VersionHistory({
  userId,
  entityType,
  entityId,
  onRestore
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);

  // Load version history
  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/versions/history?userId=${userId}&entityType=${entityType}&entityId=${entityId}`
      );
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersions();
  }, [userId, entityType, entityId]);

  // Restore version
  const handleRestore = async (version: ContentVersion) => {
    try {
      setRestoring(version.id);
      const response = await fetch('/api/versions/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          entityType,
          entityId,
          versionId: version.id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Reload versions
        await loadVersions();

        // Notify parent
        if (onRestore) {
          onRestore(data.version);
        }
      }
    } catch (error) {
      console.error('Failed to restore version:', error);
    } finally {
      setRestoring(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get change type color
  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'bg-green-500/10 text-green-500';
      case 'edit': return 'bg-blue-500/10 text-blue-500';
      case 'refine': return 'bg-purple-500/10 text-purple-500';
      case 'optimize': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-4">Loading version history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No version history</p>
            <p className="text-sm text-muted-foreground">
              Versions will appear here as you edit this content
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Version History
        </CardTitle>
        <CardDescription>
          {versions.length} version{versions.length !== 1 ? 's' : ''} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg border transition-all ${
                version.isActive
                  ? 'border-primary bg-primary/5'
                  : selectedVersion?.id === version.id
                  ? 'border-primary/50 bg-accent'
                  : 'hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-muted-foreground">
                    v{version.version}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={getChangeTypeColor(version.changeType)}
                      >
                        {version.changeType}
                      </Badge>
                      {version.isActive && (
                        <Badge variant="default" className="gap-1">
                          <Check className="w-3 h-3" />
                          Current
                        </Badge>
                      )}
                      {index === 0 && !version.isActive && (
                        <Badge variant="outline">Latest</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(version.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVersion(
                      selectedVersion?.id === version.id ? null : version
                    )}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedVersion?.id === version.id ? 'Hide' : 'View'}
                  </Button>

                  {!version.isActive && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRestore(version)}
                      disabled={restoring === version.id}
                    >
                      {restoring === version.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Restore
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {version.changeReason && (
                <p className="text-sm mb-3 text-muted-foreground">
                  <strong>Reason:</strong> {version.changeReason}
                </p>
              )}

              {selectedVersion?.id === version.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Content Snapshot</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                    {JSON.stringify(version.content, null, 2)}
                  </pre>

                  {version.changes && Object.keys(version.changes).length > 0 && (
                    <>
                      <h4 className="text-sm font-medium mb-2 mt-4">Changes Made</h4>
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
                        {JSON.stringify(version.changes, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
