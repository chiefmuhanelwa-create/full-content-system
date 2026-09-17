# Archived 2026-09-17 — not deleted

Moved out of `app/dashboard/` during the revamp. Restore with `mv` if any is needed.

| Route | Why |
|---|---|
| `migrate` | One-time browser-storage → database migration. **That job is done** — the app is on Postgres |
| `collaboration` | "Team workflow & content approval". **Single user.** No backend at all (api:0) |
| `workflow` | "Track your content from idea to published post". No backend. **Third duplicate of the same tracker** |
| `product-planning` | "Track all 55 NOCHILL products from draft to live **Shopify** listing". Shopify is gone; `products` does this against chkplt.com |
| `content-cards` | Same job as `content-progress` and `pipeline`. **Three trackers, one job** |
| `library` | "All your saved hooks, scripts and stories". Duplicates `vault` + `saved-hooks` / `saved-scripts` / `saved-stories` |
| `mission` | Empty. No description, no backend |
| `voice` | "Define your unique voice". Duplicates `brand-voice`, which has an API and analysis |

**Kept despite overlap, deliberately:**
`adapter` (platform-specific rewrites) and `repurpose` (one script → many) do different jobs.
`competitor` and `trends` are external research — unused today, but the search-demand data now
seeded in `settings.search_demand` may make them useful.
