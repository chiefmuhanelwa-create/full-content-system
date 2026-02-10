/**
 * Supabase Client Configuration
 *
 * This file creates Supabase clients for both server and client-side usage.
 *
 * Usage:
 * - For client-side: import { supabase } from '@/lib/supabase'
 * - For server-side: Use the createServerClient helper
 *
 * Features available:
 * - Authentication (alternative to NextAuth if needed)
 * - Storage (file uploads for user content)
 * - Realtime subscriptions
 * - Auto-generated REST API
 */

import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase environment variables are not set. ' +
    'Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env.local file. ' +
    'See SUPABASE_SETUP.md for instructions.'
  )
}

/**
 * Client-side Supabase client
 * Safe to use in browser - uses anon key which respects Row Level Security
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      // Persist auth state in localStorage
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

/**
 * Server-side Supabase client factory
 * Use this in API routes and server components
 *
 * @example
 * // In an API route
 * import { createServerClient } from '@/lib/supabase'
 *
 * export async function GET(request: Request) {
 *   const supabase = createServerClient()
 *   const { data } = await supabase.from('content_cards').select('*')
 *   return Response.json(data)
 * }
 */
export function createServerClient() {
  return createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

/**
 * Storage helper for uploading files
 *
 * @example
 * import { uploadFile } from '@/lib/supabase'
 *
 * const file = new File(['content'], 'script.pdf')
 * const { url, error } = await uploadFile('scripts', file, userId)
 */
export async function uploadFile(
  bucket: string,
  file: File,
  userId: string,
  path?: string
) {
  const fileName = path || `${userId}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { url: null, error }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { url: publicUrl, error: null }
}

/**
 * Storage helper for deleting files
 */
export async function deleteFile(bucket: string, filePath: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  return { error }
}

/**
 * Realtime subscription helper
 * Subscribe to database changes in real-time
 *
 * @example
 * import { subscribeToTable } from '@/lib/supabase'
 *
 * const subscription = subscribeToTable(
 *   'content_cards',
 *   { event: 'INSERT', userId: 'user_123' },
 *   (payload) => console.log('New content:', payload)
 * )
 *
 * // Cleanup
 * subscription.unsubscribe()
 */
export function subscribeToTable(
  table: string,
  filter: { event: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; userId?: string },
  callback: (payload: any) => void
) {
  let channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: filter.event,
        schema: 'public',
        table: table,
        filter: filter.userId ? `userId=eq.${filter.userId}` : undefined,
      },
      callback
    )
    .subscribe()

  return channel
}

// Export types for TypeScript
export type { SupabaseClient } from '@supabase/supabase-js'
