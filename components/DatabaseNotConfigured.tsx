import { AlertCircle, Database, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DatabaseNotConfiguredProps {
  error?: string;
  showDetails?: boolean;
}

export function DatabaseNotConfigured({
  error = 'Database is not configured',
  showDetails = true
}: DatabaseNotConfiguredProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Icon */}
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
          <Database className="h-16 w-16 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Database Not Configured
          </h1>
          <p className="text-lg text-muted-foreground">
            Your database connection needs to be set up before you can use this feature.
          </p>
        </div>

        {/* Error Alert */}
        <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>

        {/* Setup Instructions */}
        {showDetails && (
          <div className="w-full space-y-4 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Quick Setup Guide
            </h2>

            <ol className="space-y-4 list-decimal list-inside">
              <li className="text-sm">
                <span className="font-medium">Get Supabase Database</span>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Create a free account at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </li>

              <li className="text-sm">
                <span className="font-medium">Get Connection String</span>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Go to Settings → Database → Connection String (use "Connection pooling")
                </p>
              </li>

              <li className="text-sm">
                <span className="font-medium">Configure Environment Variables</span>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Copy <code className="bg-muted px-1 rounded">.env.example</code> to{' '}
                  <code className="bg-muted px-1 rounded">.env</code> and add your database credentials
                </p>
              </li>

              <li className="text-sm">
                <span className="font-medium">Push Database Schema</span>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Run: <code className="bg-muted px-2 py-1 rounded">npm run db:push</code>
                </p>
              </li>

              <li className="text-sm">
                <span className="font-medium">Restart Your App</span>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Stop and restart your development server
                </p>
              </li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button variant="default" asChild className="w-full sm:w-auto">
            <a
              href="https://github.com/yourusername/full-content-system/blob/main/SUPABASE_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Setup Guide
            </a>
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="text-sm text-center text-muted-foreground">
          <p>
            Need help? Check{' '}
            <code className="bg-muted px-2 py-1 rounded text-xs">SUPABASE_SETUP.md</code>{' '}
            in your project root
          </p>
        </div>

        {/* Validation Command */}
        <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium mb-2">💡 Verify Your Configuration</p>
          <p className="text-xs text-muted-foreground mb-2">
            After setting up, run this command to validate:
          </p>
          <code className="block bg-muted px-4 py-2 rounded text-xs font-mono">
            npm run validate:env
          </code>
        </div>
      </div>
    </div>
  );
}
