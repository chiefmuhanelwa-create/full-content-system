# Removed 2026-09-17 — round 2

Kept on disk, out of the dashboard. Nothing here is referenced by the running app.

## Removed because the output was invented, not read

These called a model with no database, no governance and no live signal. Whatever
they returned was plausible and unsourced — the exact failure the fact-lock exists to
stop, and the opposite of the 80% data / 20% AI rule.

| Removed | Was | Use instead |
|---|---|---|
| `trends` + `api/trends` | AI guessing at search demand | **Knowledge → `search_demand`** — real volumes |
| `competitor` + `api/competitor` | AI describing competitors it cannot see | — nothing real to replace it yet |
| `formulas` + `api/formulas` | AI inventing frameworks | **IP Register** — 20 named IPs |
| `analytics` + `api/analytics` | AI narrating numbers it never read | **Reel Tracker** — live Instagram data |

## Removed as duplicates

| Removed | Superseded by |
|---|---|
| `calendar` (928 lines, no API) | `content-calendar-plus` (1,335 lines, persists) |
| `adapter` + `api/adapter` | `repurpose` |
| `saved-hooks` | `hook-bank` |
| `saved-stories` | `story-bank` |
| `saved-scripts` | `vault` |

## Removed as internal plumbing

| Removed | Note |
|---|---|
| `content-progress` (page) | The API stays — `the-return` and `batch-planner` both read it |
| `operations` | Only called `backup/create`; that belongs in Settings |
