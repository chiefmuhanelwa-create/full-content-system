import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
for (const f of ['.env','.env.local']) { if(!fs.existsSync(f))continue
  for (const l of fs.readFileSync(f,'utf8').split('\n')) { const s=l.trim()
    if(!s||s.startsWith('#')||!s.includes('='))continue
    const [k,...r]=s.split('='); const v=r.join('=').trim().replace(/^["']|["']$/g,'')
    if(!process.env[k.trim()])process.env[k.trim()]=v } }

const a = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = process.env.AI_MODEL_FAST || 'claude-haiku-4-5-20251001'
const doctrine = ('You are a governed content system for a South African creator business. '
  + 'Never fabricate a figure. Prefer evidenced numbers. Write in SA English. ').repeat(90)

async function run(label, system) {
  try {
    const r = await a.messages.stream({
      model: MODEL, max_tokens: 16, system,
      messages: [{ role:'user', content:'Reply with the single word: ok' }],
    }).finalMessage()
    const u = r.usage
    console.log(`${label}: ok  input=${u.input_tokens} created=${u.cache_creation_input_tokens ?? 0} read=${u.cache_read_input_tokens ?? 0}`)
    return u
  } catch (e) {
    console.log(`${label}: FAILED  ${e?.constructor?.name} ${String(e?.message).slice(0,90)}`)
    return null
  }
}

console.log('model:', MODEL)
await run('A plain-string system  ', doctrine)
const b1 = await run('B cached block  (1st)', [{type:'text',text:doctrine,cache_control:{type:'ephemeral'}}])
const b2 = await run('B cached block  (2nd)', [{type:'text',text:doctrine,cache_control:{type:'ephemeral'}}])
if (b2?.cache_read_input_tokens > 0) console.log(`\n✅ caching WORKS — ${b2.cache_read_input_tokens} tokens read from cache`)
else if (b1) console.log('\n⚠️ blocks accepted but no cache read')
