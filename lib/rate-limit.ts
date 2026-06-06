import { NextRequest, NextResponse } from 'next/server'

const rl = new Map<string, { c: number; r: number }>()

function getIp(req: NextRequest): string {
  return (
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function checkRateLimit(
  req: NextRequest,
  max = 20,
  windowMs = 3_600_000
): NextResponse | null {
  const ip = getIp(req)
  const now = Date.now()

  if (rl.size > 1000) {
    for (const [k, v] of rl) if (now > v.r) rl.delete(k)
  }

  const e = rl.get(ip)
  if (!e || now > e.r) {
    rl.set(ip, { c: 1, r: now + windowMs })
    return null
  }
  if (e.c >= max) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests — try again in an hour.' },
      { status: 429 }
    )
  }
  e.c++
  return null
}
