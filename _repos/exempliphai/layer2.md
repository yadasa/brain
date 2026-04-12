# Layer 2: How the pieces connect (only what is evidenced)

## Firebase Hosting ↔ Cloud Functions
- Requests to `/api/__ping` are routed to a Cloud Function named `api` via Hosting rewrites. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- Requests to `/api/createAttribution` are routed to a Cloud Function named `createAttribution` via Hosting rewrites. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- All other `/api/**` paths are routed to the `api` Cloud Function (catch-all rewrite). (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- Requests under `/r/**` are served as static content from `/r/index.html` (a rewrite destination), which will be resolved within the Hosting `public` directory (`website/LandingPage/exempliphai/out`). (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## Cloud Functions internals (partially visible)
- The functions runtime uses Firebase Functions v2 HTTPS triggers (`onCall`, `onRequest`) and Firestore triggers (`onDocumentUpdated`, `onDocumentWritten`), implying both HTTP endpoints and database-triggered background logic exist, but the specific exported functions are unknown due to truncation. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Firestore is accessed through Admin SDK (`admin.firestore()`), so server-side reads/writes likely happen in these functions/triggers, but collections/doc paths are unknown due to truncation. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- A helper module `./_publicStats` is imported (`bumpPublicAggregate`, `safeNum`), suggesting aggregation/stat logic is shared, but the module contents and how it is used are unknown. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Region is configurable via `FUNCTION_REGION` env var with default `us-central1`, so deploy/runtime behavior can differ by env. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Stripe is included as a dependency, implying some payment/billing logic exists somewhere in `functions/`, but its usage is unknown from available excerpts. (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)

## Extension content scripts ↔ popup/UI ↔ backend (mostly unknown)
- There are content scripts `src/public/contentScripts/autofill.js` and `src/public/contentScripts/policy.js`, but what pages they run on, how they message the extension UI, and whether they call `/api/**` endpoints is unknown (excerpt unavailable). (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js) (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)
- A Vue file `src/vue_src/App.vue` exists, but whether it is the extension popup/options page, a web UI, or something else is unknown (excerpt unavailable). (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/App.vue)
- The extension manifest exists at `src/public/manifest.json`, but the declared content scripts, background/service worker, permissions, and UI pages are unknown (excerpt unavailable). (cite: /data/.openclaw/workspace/exempliphai:src/public/manifest.json)

## What is definitely served where
- Static hosting content is served from `website/LandingPage/exempliphai/out`, so anything under `/r/index.html` must be present in that output for `/r/**` routes to work. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- Anything under `/api/**` will hit Cloud Functions, not the static host, due to the rewrite. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
