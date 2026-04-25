# LT (static mirrors)

Repo: https://github.com/yadasa/LT (private)

## Goal
Migrate ofsih.com + bellairemoderndental.com off WordPress/Squarespace hosting into static mirrors under:
- `LT/ofsih/`
- `LT/bmd/`

No additional top-level buckets (e.g., no `LT/pagecomplete/`). Everything lives in one of those two site folders.

## Key constraints
- Must be Windows-cloneable (no illegal filenames, avoid path-length issues).
- Visual parity should match production as closely as possible.

## Approach so far
- External assets mirrored and rewritten into a Windows-safe hashed store:
  - `LT/<site>/_external/_s/<2-hex>/<sha1>.<ext>`
- For BMD (Squarespace snapshot), used the provided mapping (`LT/bmd/_external/_mapping_shortpaths.jsonl`) to rewrite HTML/CSS references to the shortened paths.

## Current focus (2026-04-16)
OFSIH local rendering mismatch when opened via Live Server at:
- `http://127.0.0.1:5500/LT/ofsih/index.html`

Root cause: many asset URLs in the mirrored HTML are root-relative (e.g. `/wp-content/...`).
When served under `/LT/ofsih/`, those resolve to `http://127.0.0.1:5500/wp-content/...` instead of `.../LT/ofsih/wp-content/...`, so CSS/fonts/JS don’t load.

Fix (starting small): add `<base href="/LT/ofsih/">` to `LT/ofsih/index.html` so root-relative asset paths resolve within the bucket.

Next: generalize this fix across OFSIH pages (or do a systematic rewrite) once homepage parity is confirmed.

## Status update (later on 2026-04-16)
- The `<base>` approach was not sufficient for root-relative URLs that start with `/`.
- Implemented systematic bucket-prefix rewriting so both sites work when served from subpaths:
  - OFSIH prefix: `/LT/ofsih/`
  - BMD prefix: `/LT/bmd/`
- Added missing OFSIH Astra local font assets referenced by the theme.
- Mirrored missing Squarespace universal assets for BMD where referenced.
- Added verifier tooling (`LT/verify_bucket_refs.py`) and both buckets now verify clean (no missing local refs in the bucket-serving mode).

## Forms/admin (Firebase)
- Added a Firebase-backed forms capture + admin UI scaffold:
  - Submit endpoint: `POST /api/forms/submit`
  - Firestore schema:
    - `sites/{siteId}/forms/{formId}`
    - `sites/{siteId}/submissions/{submissionId}`
  - Admin allowlist doc: `config/admins` (array field `emails`)
  - Admin UIs:
    - `LT/ofsih/admin/`
    - `LT/bmd/admin/`

## Security/cutover guardrails
- Added predeploy spam scan script:
  - `LT/scripts/predeploy_spam_check.sh`
- Added Firebase Hosting redirects for compromised/duplicate slugs (OFSIH) and duplicate dropdown slugs (BMD).

## Repo log
- LT repo has a dated work log inside the repo:
  - `LT/2026-04-16.md`

## Status update (end of day 2026-04-16)
- OFSIH: `/contact/` and `/sleep-apnea/` were rebuilt as clean static pages in the mirror (replacing any potentially compromised live-origin content).
- BMD: 5 new intent-layer pages were added:
  - `/all-on-4-dental-implants-houston/`
  - `/same-day-dental-implants-houston/`
  - `/implant-supported-dentures-houston/`
  - `/no-prep-veneers-houston/`
  - `/emergency-dentist-houston/`
  and `bmd/sitemap.xml` was updated.
- Added docs + redirects for BMD URL normalization and the pillar/support internal linking architecture:
  - `LT/bmd-url-normalization.md`
  - `LT/seo-architecture.md`

## Parking lot: implant problem-intent support pages (client text)
Client suggested implant pages targeting:
- broken teeth
- carious teeth
- root canal teeth
- missing tooth
- multiple missing teeth

Assessment (saved for later): these can fit BMD strongly; they can also fit OFSIH if written from an OMFS/surgical angle (non-restorable teeth → extraction/grafting/implant placement, failed root canal tooth → extraction + implant) rather than general-dentistry cavity treatment.

## 2026-04-17
- Added a third site bucket `LT/bfc/` (Wix mirror) and wired it into hosting/build tooling.
  - Key commits: `1770930` (add bfc folder), `2326f50` (initial mirror), `090ba4d` (rewrite + local mirror), `07b93f0` (hosting target + dist build).
- BFC mirror fixes:
  - Removed problematic `srcset` attributes (Wix comma URLs) to restore images (`ff760f1`).
  - Added QA/audit notes around Wix dependencies + bucket references (`9ca9386`).
- Admin/forms scaffolding:
  - Added `bfc/admin/` UI scaffold + `bfc/admin/config.template.js` (`b0906a2`, `cc2db90`).
- OFSIH content cleanup:
  - Replaced unstyled Squarespace “related links / explore more” blocks with the Astra-compatible `ofsih-card` pattern across multiple pages (`9204a7b`, `e45d5e2`).
- Asaday:
  - Added `LT/asaday/` static site export and added it as a hosting target (`9b788a8`, `3cb2296`).

Notes
- `www.ofsih.com` was not connected (domain not pointed/verified during this work).
- A Firebase Functions deploy attempt failed because `firebase-functions` was missing (needed `npm install firebase-functions` in the functions package before deploy).

Next
- Decide whether to keep Asaday assets in-repo long-term (size) or move to a dedicated bucket/repo.
- Finish BFC capture beyond homepage (crawl + rewrite additional routes) if parity is required.
- Confirm a clean Firebase deploy path (functions deps installed, env/config in place) before attempting cutover.

---

## Okeike (central visual editor) — 2026-04-25

Goal: a central web app ("Okeike") to let editors/admins browse a site sitemap, edit mapped fields (and later inline visual edits), preview patches, save drafts, and publish patch-based commits to GitHub with an admin approval workflow.

### Deployed
- Project: `ltjhtx`
- Okeike hosting: https://okeike.web.app
- API health (via hosting rewrite): `GET https://okeike.web.app/api/okeike/health` → `{ ok:true, service:"okeike-api" }`

### Backend (Firebase Functions: `LT/functions/index.js` → `exports.api`)
- Auth: all Okeike routes require `Authorization: Bearer <Firebase ID token>` (except health).
- Access control source: Firestore `config/okeikeAccess`:
  - `admins: [emails...]`
  - `editors: { [siteId]: [emails...] }`
- Core endpoints:
  - `GET /api/okeike/sites`
  - `POST /api/okeike/pages/sync` (GitHub repo tree scan + upsert `sites/{siteId}/pages/{pageId}`)
  - `GET /api/okeike/pages?siteId=...`
  - `GET /api/okeike/page?siteId=...&pageId=...` (returns `page` + `fieldMap`)
  - `POST /api/okeike/preview` (supports `{pagePath}` or `{pagePath, patches}`)
  - `POST /api/okeike/validate` (patch apply + SEO checks, blocks publish on errors)
  - Drafts:
    - `POST /api/okeike/drafts/save` (stores `htmlContent` + `patches`)
    - `POST /api/okeike/drafts/get`
  - Publish (patch-based only):
    - `POST /api/okeike/publish` admin-only
  - Approval workflow:
    - `POST /api/okeike/publish-request/create`
    - `GET /api/okeike/publish-requests?siteId=...`
    - `POST /api/okeike/publish-request/approve` admin-only
    - `POST /api/okeike/publish-request/reject` admin-only

### GitHub integration
- Repo: `yadasa/LT`, branch `main`.
- Token moved to Firebase Secret:
  - `process.env.GITHUB_TOKEN`
  - `secrets: ["GITHUB_TOKEN"]` on the function.

### Field maps
- Single source of truth: `LT/.okeike/field-maps/<siteId>/<pageId>.json`.
- Backend returns `fieldMap` on `/okeike/page`; fallback map when missing:
  - `head > title`
  - `meta[name="description"]@content`
  - `h1`

### Firestore writes
- Pages:
  - `sites/{siteId}/pages/{pageId}`
  - Publish metadata fields: `lastPublishedAt`, `lastPublishedBy`, `lastPublishCommit`, `lastPublishUrl`
- Drafts:
  - `sites/{siteId}/drafts/{pageId}`
  - Draft status/publish metadata: `status`, `publishedAt`, `publishedBy`, `lastPublishCommit`, `lastPublishUrl`
- Activity log:
  - `sites/{siteId}/activity/{activityId}`
  - Types: `draft_saved`, `publish_requested`, `publish_approved`, `publish_rejected`, `publish_completed`

### Frontend (Vite React app: `LT/okeike`)
- Routes:
  - `/login`, `/dashboard`, `/sites/:siteId/pages/:pageId`, `/sites/:siteId/requests`
- UX improvements:
  - Clicking a site card auto-syncs pages (if empty) and opens the home/root page editor directly.
  - Full-viewport editor with overlay top toolbar and collapsible sidebar (Fields/Sitemap).
  - Validation UI (errors/warnings), draft/publish status indicators.

### Inline visual editor (preview iframe)
- Preview HTML is decorated before rendering:
  - asset URL fix via `<base>` + rewrite
  - inline editor runtime injection
- Runtime is externalized to a static file:
  - `okeike/public/okeike-inline-editor.js` loaded via absolute URL to avoid `<base>` interference.
- Inline edits produce patches (text/html/attr) and also persist `data-okeike-id` by emitting an `attr` patch so it can be committed.
- A build-time parse assertion was added so the runtime JS must parse (`new Function(...)`) or build fails.

### Hosting config
- `firebase.json` includes hosting target `okeike`:
  - public: `okeike/dist`
  - rewrites: `/api/**` → function `api`, and SPA fallback to `/index.html`.
- `.firebaserc` target mapping includes `okeike`.
