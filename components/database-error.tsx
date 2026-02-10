'use client';

import { AlertCircle, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DatabaseErrorProps {
  error?: string;
  showInstructions?: boolean;
}

export function DatabaseError({ error, showInstructions = true }: DatabaseErrorProps) {
  const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Database Connection Error
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {error || 'Unable to connect to the database. The DATABASE_URL environment variable may not be configured correctly.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {showInstructions && (
            <>
              {isVercel ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-3 flex-1">
                      <h3 className="font-semibold text-blue-900">
                        To fix this issue in Vercel:
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
                        <li>Go to your Vercel project dashboard</li>
                        <li>Navigate to Settings → Environment Variables</li>
                        <li>Add the <code className="bg-blue-100 px-1 py-0.5 rounded">DATABASE_URL</code> variable:</li>
                      </ol>

                      <div className="bg-white border border-blue-200 rounded p-3 mt-2">
                        <p className="text-xs font-mono text-gray-600 mb-2">Required format:</p>
                        <code className="text-xs font-mono text-gray-900 break-all">
                          postgresql://user:password@host:5432/database?sslmode=require
                        </code>
                      </div>

                      <div className="space-y-2 mt-3">
                        <p className="text-sm font-medium text-blue-900">Get a free PostgreSQL database from:</p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="https://neon.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            Neon (Recommended)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href="https://supabase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            Supabase
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href="https://railway.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            Railway
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <ol start={4} className="list-decimal list-inside space-y-2 text-sm text-blue-900 mt-3">
                        <li>Save the environment variable</li>
                        <li>Redeploy your application</li>
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-3 flex-1">
                      <h3 className="font-semibold text-amber-900">
                        To fix this issue locally:
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-amber-900">
                        <li>Create a <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> file in the project root</li>
                        <li>Add the DATABASE_URL variable:</li>
                      </ol>

                      <div className="bg-white border border-amber-200 rounded p-3 mt-2">
                        <code className="text-xs font-mono text-gray-900 break-all">
                          DATABASE_URL=postgresql://user:password@localhost:5432/nochill_db
                        </code>
                      </div>

                      <ol start={3} className="list-decimal list-inside space-y-2 text-sm text-amber-900 mt-3">
                        <li>Restart your development server</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Need more help?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Check out the full deployment guide for step-by-step instructions.
                </p>
                <a
                  href="/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Deployment Guide
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleRefresh}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full" variant="default">
                <Database className="w-4 h-4 mr-2" />
                Check Health Status
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
