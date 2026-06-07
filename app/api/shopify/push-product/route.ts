import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const shopUrl = process.env.SHOPIFY_SHOP_URL
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shopUrl || !accessToken) {
    return NextResponse.json(
      {
        error: 'Shopify credentials not configured',
        message: 'Add SHOPIFY_SHOP_URL and SHOPIFY_ACCESS_TOKEN to .env.local',
        setup: [
          'SHOPIFY_SHOP_URL=your-store.myshopify.com',
          'SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxx',
        ],
      },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { title, body_html, vendor, product_type, tags, variants, status = 'draft' } = body

    const shopifyPayload = {
      product: {
        title,
        body_html,
        vendor: vendor || 'NOCHILL',
        product_type,
        tags: Array.isArray(tags) ? tags.join(', ') : tags,
        status,
        variants: variants?.map((v: any) => ({
          price: v.price,
          sku: v.sku,
          inventory_management: null,
          fulfillment_service: 'manual',
          requires_shipping: false,
        })) ?? [{ price: '0.00' }],
      },
    }

    const cleanShopUrl = shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const apiUrl = `https://${cleanShopUrl}/admin/api/2024-01/products.json`

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify(shopifyPayload),
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(
        { error: 'Shopify API error', details: error, message: error.errors ?? 'Unknown error' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ success: true, product: data.product })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Server error', message: err.message },
      { status: 500 }
    )
  }
}
