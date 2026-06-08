Add a new AI tool to the NoChill Content System.

## Usage
/add-tool [tool name]

Example: `/add-tool brand-deal-pitcher`

## Rules (non-negotiable)
- No `fs.readFileSync` at runtime — use static imports only
- Always `checkRateLimit(request)` as first line of every API route
- Use `MODELS.SONNET` or `MODELS.HAIKU` from `lib/claude.ts` — never hardcode model strings
- Script routes: `max_tokens: 6000` | All other routes: `max_tokens: 3500`
- Run `npx tsc --noEmit` before AND after every change
- Read `docs/FEATURES.md` before building — confirm the tool doesn't already exist

## Steps

### 1. Check it doesn't exist
```bash
grep -r "$ARGUMENTS" /Users/NOCHILLGOD/Desktop/full-content-system/app/api/
```

### 2. Create the API route
```
app/api/[tool-slug]/generate/route.ts
```

Follow this pattern:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateContent } from '@/lib/claude'
import { MODELS } from '@/lib/claude'

export async function POST(request: NextRequest) {
  const rateLimitResult = checkRateLimit(request) // ALWAYS FIRST
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  // ... rest of route
}
```

### 3. Create the UI component
```
components/tools/[ToolName].tsx
```

### 4. Add to the tools registry
Update `lib/tools-registry.ts` (or equivalent) to include the new tool.

### 5. Add to navigation
Update the sidebar/nav to include the new tool.

### 6. TypeScript check
```bash
npx tsc --noEmit
```

### 7. Update docs
Add the tool to `docs/FEATURES.md` with:
- Tool name
- Route
- Input fields
- Output format
- Which framework it uses
- Which PAIDS stream it serves

### 8. Test
Start dev server and test the full flow:
```bash
npm run dev
```
