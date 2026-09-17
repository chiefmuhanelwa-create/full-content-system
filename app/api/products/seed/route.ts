/**
 * POST /api/products/seed
 *
 * Pulls the REAL product catalogue from chkplt.com into the content system.
 *
 * Source of truth is `public.products` on the CHKPLT database — the same table
 * the live storefront and checkout read. This route READS that table and WRITES
 * only to `content_system.products`, which is Prisma's own isolated schema.
 *
 * It never writes to `public`. `public` holds live orders, payments and grants.
 *
 * Rewritten 2026-09-17. Previously seeded a hardcoded array that had no relationship
 * to anything actually for sale. Previous version: route.ts.pre-chkplt-2026-09-17
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_USER_ID = 'default-user-id'

/** The ruled ladder. Constitution v1.0 (2026-09-01) + R17 (2026-09-17). */
function ladderPosition(cents: number, isFree: boolean): string {
  if (isFree || cents <= 0) return 'free'
  const rand = cents / 100
  if (rand <= 499) return 'entry'     // ENTRY  R350–R499
  if (rand <= 1800) return 'core'     // CORE   R1,500–R1,800
  return 'premium'                    // PREMIUM $499 / R9,000 🔒
}

/** PAIDS stream, inferred from format. Products / Ads / Information / Deals / Services. */
function paidsStream(format: string | null, requiresApplication: boolean): string {
  const f = (format || '').toLowerCase()
  if (requiresApplication || f.includes('cohort') || f.includes('coach') || f.includes('mentor')) return 'services'
  if (f.includes('course') || f.includes('module') || f.includes('lesson')) return 'info'
  return 'products'
}

function audienceLevel(cents: number, isFree: boolean): string {
  if (isFree || cents <= 0) return 'beginner'
  return cents / 100 <= 499 ? 'beginner' : cents / 100 <= 1800 ? 'established' : 'contentpreneur'
}

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (!url || !key) {
      return NextResponse.json(
        { error: 'SUPABASE_URL and a Supabase key are required to read the chkplt.com catalogue.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    const existing = await prisma!.product.count({ where: { userId: DEFAULT_USER_ID } })
    if (existing > 0 && !force) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: `${existing} products already synced. Use ?force=true to re-pull from chkplt.com.`,
      })
    }

    // ── READ from the live store. Read-only. ──────────────────────────────
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data: live, error } = await supabase
      .from('products')
      .select(
        'slug,title,tagline,description,long_description,price_cents,compare_at_price_cents,' +
        'currency,status,garden,format,target_audience,is_free,benefits,requires_application,' +
        'download_path,cover_image_url,sort_order'
      )
      .order('price_cents', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: `Could not read the chkplt.com catalogue: ${error.message}` },
        { status: 502 }
      )
    }
    if (!live?.length) {
      return NextResponse.json(
        { error: 'chkplt.com returned no products. Nothing was changed.' },
        { status: 404 }
      )
    }

    // ── WRITE only to content_system.products ─────────────────────────────
    if (existing > 0 && force) {
      await prisma!.product.deleteMany({ where: { userId: DEFAULT_USER_ID } })
    }

    const rows = live.map((p: any) => {
      const cents = p.price_cents ?? 0
      const benefits = Array.isArray(p.benefits)
        ? p.benefits.join('\n')
        : typeof p.benefits === 'string'
          ? p.benefits
          : ''

      return {
        userId: DEFAULT_USER_ID,
        productName: p.title || p.slug,
        productType: p.requires_application ? 'coaching' : (p.format || 'digital_product'),
        price: cents / 100,                       // rands, as the ladder is ruled in rands
        currency: p.currency || 'ZAR',
        audienceLevel: audienceLevel(cents, !!p.is_free),
        audienceSegment: p.target_audience || null,
        description: p.tagline || p.description || '',
        coreBenefits: benefits,
        painPoints: p.long_description || p.description || '',
        priceAnchor: p.compare_at_price_cents ? `R${(p.compare_at_price_cents / 100).toLocaleString('en-ZA')}` : null,
        paidsStream: paidsStream(p.format, !!p.requires_application),
        ladderPosition: ladderPosition(cents, !!p.is_free),
        status: p.status === 'published' ? 'active' : (p.status || 'archived'),
        salesPageUrl: `https://chkplt.com/products/${p.slug}`,
        checkoutUrl: `https://chkplt.com/checkout/${p.slug}`,
        deliveryMethod: p.download_path ? 'platform' : 'email',
        // Slug is the join key back to the live store. Never lose it.
        tags: { slug: p.slug, garden: p.garden ?? null, source: 'chkplt.com', syncedAt: new Date().toISOString() },
        notes: `Synced from chkplt.com (public.products) on ${new Date().toISOString().slice(0, 10)}. ` +
               `This is a read-only mirror — edit the product on CHKPLT, then re-sync. ` +
               `Editing it here does NOT change what a buyer sees or is charged.`,
      }
    })

    const created = await prisma!.product.createMany({ data: rows })

    const byTier = rows.reduce((acc: Record<string, number>, r) => {
      acc[r.ladderPosition] = (acc[r.ladderPosition] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      source: 'chkplt.com · public.products',
      message: `Synced ${created.count} products from chkplt.com`,
      count: created.count,
      byTier,
      note: 'Read-only mirror. CHKPLT remains the only writer of price and status.',
    })
  } catch (error: any) {
    console.error('Products sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync products from chkplt.com' },
      { status: 500 }
    )
  }
}
