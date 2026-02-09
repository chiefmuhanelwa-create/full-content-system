'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Upload, Save, AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function SettingsPage() {
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [lastBackup, setLastBackup] = useState<string | null>(null)
  const [daysSinceBackup, setDaysSinceBackup] = useState<number | null>(null)

  // Load last backup date on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastBackupStr = localStorage.getItem('lastBackup')
      if (lastBackupStr) {
        setLastBackup(lastBackupStr)
        const lastBackupDate = new Date(lastBackupStr)
        const days = Math.floor((new Date().getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24))
        setDaysSinceBackup(days)
      }
    }
  }, [])

  // Export all localStorage data
  const exportData = () => {
    if (typeof window === 'undefined') return

    try {
      const data: Record<string, any> = {}
      const keys = [
        'products',
        'savedScripts',
        'savedHooks',
        'savedStories',
        'plannedContent',
        'shotContent',
        'publishedContent',
        'calendarEntries',
        'recentStories',
      ]

      keys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            data[key] = JSON.parse(value)
          } catch {
            data[key] = value
          }
        }
      })

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `nochill-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      setExportStatus('success')
      setLastBackup(new Date().toISOString())
      localStorage.setItem('lastBackup', new Date().toISOString())

      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  // Import localStorage data
  const importData = () => {
    if (typeof window === 'undefined') return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result)

          Object.keys(data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(data[key]))
          })

          setImportStatus('success')
          setTimeout(() => {
            setImportStatus('idle')
            window.location.reload()
          }, 2000)
        } catch (error) {
          console.error('Import error:', error)
          setImportStatus('error')
          setTimeout(() => setImportStatus('idle'), 3000)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          Data Management
        </h1>
        <p className="text-gray-600">
          Backup and restore your content data
        </p>
      </div>

      {/* Backup Reminder */}
      {daysSinceBackup !== null && daysSinceBackup > 7 && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">Backup Reminder</AlertTitle>
          <AlertDescription className="text-amber-700">
            It's been {daysSinceBackup} days since your last backup. We recommend backing up your data regularly to prevent data loss.
          </AlertDescription>
        </Alert>
      )}

      {/* Export Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download a backup of all your content, scripts, hooks, and tracked data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">
              <strong>What gets exported:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Products database</li>
              <li>• Saved scripts, hooks, and stories</li>
              <li>• Planned, shot, and published content</li>
              <li>• Calendar entries</li>
              <li>• All other saved data</li>
            </ul>
          </div>

          {exportStatus === 'success' && (
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Export Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your data has been downloaded successfully!
              </AlertDescription>
            </Alert>
          )}

          {exportStatus === 'error' && (
            <Alert className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Export Failed</AlertTitle>
              <AlertDescription className="text-red-700">
                There was an error exporting your data. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={exportData} size="lg" className="w-full">
            <Download className="mr-2 h-5 w-5" />
            Export All Data
          </Button>

          {lastBackup && (
            <p className="text-xs text-gray-500 text-center">
              Last backup: {new Date(lastBackup).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore your content from a previous backup file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900 mb-2">
              <strong>⚠️ Important:</strong>
            </p>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• This will overwrite your current data</li>
              <li>• The page will refresh after import</li>
              <li>• Make sure you have a backup before importing</li>
            </ul>
          </div>

          {importStatus === 'success' && (
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Import Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your data has been restored. Page will refresh...
              </AlertDescription>
            </Alert>
          )}

          {importStatus === 'error' && (
            <Alert className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Import Failed</AlertTitle>
              <AlertDescription className="text-red-700">
                There was an error importing your data. Please check the file and try again.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={importData} variant="outline" size="lg" className="w-full">
            <Upload className="mr-2 h-5 w-5" />
            Import Data from File
          </Button>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-purple-600" />
            Data Protection Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span><strong>Backup Regularly:</strong> Export your data at least once a week, especially before major updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span><strong>Store Safely:</strong> Keep backup files in a safe location (cloud storage, external drive)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span><strong>Version Control:</strong> Name your backups with dates to track different versions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span><strong>Test Imports:</strong> Occasionally test importing a backup to ensure it works</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">✓</span>
              <span><strong>Before Deployments:</strong> Always export data before major deployments or updates</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
