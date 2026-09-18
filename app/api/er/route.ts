/**
 * GET /api/er?username=xyz — engagement rate for any public Instagram Business/Creator account.
 *
 * ⚠️ THE DENOMINATOR IS THE WHOLE STORY.
 *
 * Instagram gives REACH only for the account that owns the token. For anybody else you get
 * followers, and per-post likes and comments — nothing more. So there are two different
 * numbers here and they must never be confused:
 *
 *   ER (followers) = (likes + comments) / followers   ← works for anyone, the public number
 *   ER (reach)     = (likes + comments) / reach       ← owner only, always much higher
 *
 * The estate already records a median ER of 2.78% computed on REACH. A followers-based figure
 * is typically 10-20x smaller. Shipping them under one label is how a contested figure gets
 * manufactured, so every response here states its denominator and the UI must print it.
 *
 * Personal (non-professional) accounts are not readable at all — business_discovery returns
 * an error, and the honest answer is "that account is personal", not a zero.
 */

import { NextRequest, NextResponse } from 'next/server'

const GV = 'v21.0'

/**
 * This route is PUBLIC so it can be embedded, which means every call spends the founder's
 * own API quota. A naive loop from one browser would burn it in minutes, so each caller gets
 * a small burst. In-memory, so it resets on a cold start — enough to stop casual abuse, not
 * a substitute for a real limiter if this ever gets real traffic.
 */
const HITS = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 12

function overLimit(ip: string) {
  const now = Date.now()
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  HITS.set(ip, recent)
  if (HITS.size > 5000) HITS.clear()   // crude ceiling; this map must never grow unbounded
  return recent.length > MAX_PER_WINDOW
}

type Post = { like_count?: number; comments_count?: number; timestamp?: string; media_product_type?: string }

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  if (!s.length) return 0
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/**
 * Bands, scaled to account size.
 *
 * Follower-based ER falls as an account grows — the same post reaches a smaller SHARE of a
 * bigger list. A flat threshold would tell every large account it is failing, which is both
 * wrong and useless. These are industry ranges for the followers denominator, not his data.
 */
function band(er: number, followers: number) {
  // [strong, healthy, low] thresholds per size bracket
  const t =
    followers >= 1_000_000 ? [0.9, 0.4, 0.15] :
    followers >= 250_000   ? [1.5, 0.7, 0.25] :
    followers >= 50_000    ? [2.5, 1.2, 0.5] :
    followers >= 10_000    ? [4.0, 2.0, 1.0] :
                             [6.0, 3.0, 1.5]

  const size =
    followers >= 1_000_000 ? 'accounts over 1M' :
    followers >= 250_000   ? 'accounts of 250k+' :
    followers >= 50_000    ? 'accounts of 50k-250k' :
    followers >= 10_000    ? 'accounts of 10k-50k' : 'accounts under 10k'

  if (er >= t[0]) return { label: 'Exceptional', note: `Top of the range for ${size}.` }
  if (er >= t[1]) return { label: 'Strong', note: `Above the typical band for ${size}.` }
  if (er >= t[2]) return { label: 'Healthy', note: `Normal working range for ${size}.` }
  return {
    label: 'Below par',
    note: `Under the usual range for ${size}. Either the audience is cold, or the posts are reaching people who do not follow you — which is not a failure, it just means followers is the wrong denominator for you.`,
  }
}

export async function GET(request: NextRequest) {
  const username = (request.nextUrl.searchParams.get('username') ?? '')
    .trim().replace(/^@/, '').toLowerCase()
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') ?? 25), 50)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (overLimit(ip)) {
    return NextResponse.json({ error: 'Too many lookups. Wait a minute and try again.' }, { status: 429 })
  }

  if (!username || !/^[a-z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ error: 'Give me an Instagram username.' }, { status: 400 })
  }

  const token = process.env.FB_PAGE_TOKEN
  const pageIg = process.env.INSTAGRAM_USER_ID
  if (!token || !pageIg) {
    return NextResponse.json({
      error: 'Lookup is not configured.',
      how: 'FB_PAGE_TOKEN and INSTAGRAM_USER_ID must be set. business_discovery only exists on graph.facebook.com and needs a Page token, not the Instagram-login token.',
    }, { status: 503 })
  }

  const fields =
    `business_discovery.username(${username})` +
    `{username,followers_count,media_count,profile_picture_url,` +
    `media.limit(${limit}){like_count,comments_count,timestamp,media_product_type,permalink}}`

  try {
    const url = `https://graph.facebook.com/${GV}/${pageIg}?fields=${encodeURIComponent(fields)}&access_token=${token}`
    const r = await fetch(url, { cache: 'no-store' })
    const j = await r.json()

    if (j.error) {
      const m = String(j.error.message ?? '')
      // Meta returns the same generic shape whether the handle is wrong or the account is
      // personal, so say what is actually actionable instead of guessing which.
      const personal = /cannot be found|does not exist|not a business/i.test(m)
      return NextResponse.json({
        error: personal
          ? `@${username} could not be read.`
          : 'Instagram refused the lookup.',
        how: personal
          ? 'It has to be a public Business or Creator account. Personal accounts are not readable by anyone through the API — that is a platform rule, not a missing setting.'
          : m.slice(0, 200),
      }, { status: 404 })
    }

    const b = j.business_discovery ?? {}
    const posts: Post[] = (b.media?.data ?? [])
    const followers = Number(b.followers_count ?? 0)

    if (!posts.length || !followers) {
      return NextResponse.json({ error: `@${username} has nothing public to measure.` }, { status: 404 })
    }

    const inter = posts.map((p) => (p.like_count ?? 0) + (p.comments_count ?? 0))
    const likes = posts.map((p) => p.like_count ?? 0)
    const comments = posts.map((p) => p.comments_count ?? 0)
    const total = inter.reduce((a, c) => a + c, 0)

    const avg = total / posts.length
    const er = (avg / followers) * 100
    const erMedian = (median(inter) / followers) * 100

    // Comments are the metric the Loss Law moves, so they are reported on their own rather
    // than buried inside a combined figure.
    const commentShare = total ? (comments.reduce((a, c) => a + c, 0) / total) * 100 : 0

    const reels = posts.filter((p) => p.media_product_type === 'REELS').length

    return NextResponse.json({
      username: b.username ?? username,
      profilePicture: b.profile_picture_url ?? null,
      followers,
      mediaCount: b.media_count ?? null,
      postsAnalysed: posts.length,
      reelsInSample: reels,
      denominator: 'followers',
      denominatorNote:
        'Computed on FOLLOWERS. Reach is only available for the account that owns the token, so a reach-based ER is not comparable with this number and is always much higher.',
      engagementRate: Number(er.toFixed(3)),
      engagementRateMedian: Number(erMedian.toFixed(3)),
      avgInteractions: Math.round(avg),
      avgLikes: Math.round(likes.reduce((a, c) => a + c, 0) / posts.length),
      avgComments: Math.round(comments.reduce((a, c) => a + c, 0) / posts.length),
      commentSharePct: Number(commentShare.toFixed(1)),
      band: band(er, followers),
      window: {
        newest: posts[0]?.timestamp ?? null,
        oldest: posts[posts.length - 1]?.timestamp ?? null,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Lookup failed.' }, { status: 500 })
  }
}
