'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plug, CheckCircle2, XCircle } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

export default function IntegrationsPage() {
  const [d, setD] = useState<any>(null)
  useEffect(() => { fetch('/api/integrations').then(r => r.json()).then(setD).catch(() => {}) }, [])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="SYSTEM"
        title="Integrations"
        description="A station that degrades loudly is diagnosable. One that fails silently is not."
        icon={Plug}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{d?.connected ?? 0} of {d?.total ?? 0} connected</CardTitle>
          <CardDescription>Secrets stay in .env.local — this reports presence and last contact only.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {d?.integrations?.map((i: any) => (
              <div key={i.provider} className="flex items-start gap-3 py-3 text-[13px]">
                {i.configured ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                              : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}
                <div className="flex-1">
                  <p className="font-semibold">{i.provider} <Badge variant="outline" className="ml-2">{i.status}</Badge></p>
                  <p className="text-muted-foreground">{i.does}</p>
                  {i.detail && <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{i.detail}</p>}
                  {i.lastSyncedAt && <p className="mt-0.5 text-[11px] text-muted-foreground">last synced {String(i.lastSyncedAt).slice(0, 16).replace('T', ' ')}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
