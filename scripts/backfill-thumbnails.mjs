// Pull thumbnail_url / media_url for every stored post. Instagram CDN URLs expire, so this
// is safe to re-run — it overwrites rather than skipping.
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const GV = process.env.INSTAGRAM_GRAPH_VERSION || 'v26.0'
const WHO = process.env.INSTAGRAM_USER_ID || 'me'
if (!TOKEN) { console.error('no INSTAGRAM_ACCESS_TOKEN'); process.exit(1) }

const db = new PrismaClient()
const FIELDS = 'id,thumbnail_url,media_url,media_type,media_product_type,permalink,like_count,comments_count'

let url = `https://graph.instagram.com/${GV}/${WHO}/media?fields=${FIELDS}&limit=50&access_token=${TOKEN}`
let seen = 0, updated = 0
while (url) {
  const j = await (await fetch(url, { cache: 'no-store' })).json()
  if (j.error) { console.error('API:', j.error.message); break }
  const batch = j.data ?? []
  if (!batch.length) break            // an empty page ends it, whatever paging claims
  for (const m of batch) {
    seen++
    const r = await db.instagramMedia.updateMany({
      where: { mediaId: m.id },
      data: {
        thumbnailUrl: m.thumbnail_url ?? null,
        mediaUrl: m.media_url ?? null,
        likeCount: m.like_count ?? undefined,
        commentsCount: m.comments_count ?? undefined,
      },
    })
    updated += r.count
  }
  const next = j.paging?.next ?? null
  // Guard against a cursor that keeps handing back a "next" forever: stop once we have
  // seen at least as many as are stored. Without this the loop never terminates.
  url = next && seen < 500 ? next : null
}

const withThumb = await db.instagramMedia.count({ where: { OR: [{ thumbnailUrl: { not: null } }, { mediaUrl: { not: null } }] } })
const total = await db.instagramMedia.count()
console.log(`fetched ${seen} from API · updated ${updated} rows`)
console.log(`${withThumb} of ${total} stored posts now have an image`)
await db.$disconnect()
