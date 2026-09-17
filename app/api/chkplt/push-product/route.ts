/**
 * POST /api/chkplt/push-product
 *
 * Creates a DRAFT product on chkplt.com. Replaces the Shopify push, 2026-09-17.
 *
 * Three guards, deliberately:
 *  1. Status is forced to 'draft'. A draft is not purchasable. Nothing this route
 *     creates can take money until it is published by hand on CHKPLT.
 *  2. It refuses to overwrite an existing slug. CHKPLT is the only writer of price
 *     and status for anything already live — 54 products, 13 orders behind them.
 *  3. It requires the service-role key. Without it, it returns the payload so the
 *     product can be created by hand, rather than failing silently.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const title: string = body.title || ''
    if (!title) return NextResponse.json({ error: 'A title is required.' }, { status: 400 })

    const slug = body.slug ? slugify(body.slug) : slugify(title)
    const priceRand = Number(body.price ?? 0)

    const payload = {
      slug,
      title,
      tagline: body.tagline ?? null,
      description: body.description ?? null,
      long_description: body.long_description ?? body.body_html ?? null,
      price_cents: Math.round(priceRand * 100),
      currency: 'ZAR',
      status: 'draft' as const,          // ⛔ forced. Never publishes.
      format: body.product_type ?? null,
      target_audience: body.target_audience ?? null,
      is_free: priceRand <= 0,
      requires_application: !!body.requires_application,
      show_in_marketplace: false,
    }

    const url = process.env.SUPABASE_URL
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !svc) {
      return NextResponse.json({
        success: false,
        manual: true,
        message:
          'No service-role key is set, so nothing was written. Create this product on CHKPLT by hand ' +
          'using the payload below — it is already shaped for public.products.',
        payload,
      })
    }

    const supabase = createClient(url, svc, { auth: { persistSession: false } })

    const { data: clash } = await supabase
      .from('products').select('slug,status,price_cents').eq('slug', slug).maybeSingle()

    if (clash) {
      return NextResponse.json({
        success: false,
        message:
          `"${slug}" already exists on chkplt.com (status: ${clash.status}, ` +
          `R${(clash.price_cents / 100).toLocaleString('en-ZA')}). ` +
          `This route will not overwrite a live product — edit it on CHKPLT instead.`,
      }, { status: 409 })
    }

    const { data, error } = await supabase.from('products').insert(payload).select('slug,title,status').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 502 })

    return NextResponse.json({
      success: true,
      product: data,
      message: `Created "${data.title}" on chkplt.com as a DRAFT. It is not purchasable until you publish it.`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Push failed' }, { status: 500 })
  }
}
