# exempliphai (repo index)

## High-level shape (from sampled tree)
- `functions/` (Firebase Cloud Functions)
  - `functions/index.js` (functions entrypoint) (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
  - `functions/package.json` (functions runtime/deps) (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- `src/`
  - `src/public/manifest.json` (browser extension manifest file exists, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:src/public/manifest.json)
  - `src/public/contentScripts/`
    - `autofill.js` (exists, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
    - `policy.js` (exists, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)
  - `src/vue_src/App.vue` (exists, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/App.vue)
- `website/LandingPage/exempliphai/out` (Firebase Hosting public dir) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- `firebase.json` (Firebase project config for functions/hosting/firestore/storage) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- `PLAN.md`, `PLAN_v2.md` (planning docs exist, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:PLAN.md) (cite: /data/.openclaw/workspace/exempliphai:PLAN_v2.md)
- `AUTH_LOGIN_BROKEN_PROFILE_TROUBLESHOOTING_2026-04-07.md` (troubleshooting doc exists, contents unknown) (cite: /data/.openclaw/workspace/exempliphai:AUTH_LOGIN_BROKEN_PROFILE_TROUBLESHOOTING_2026-04-07.md)

## Build / deploy (evidence-based)
- Firebase Functions source directory is `functions` (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- Firebase Hosting serves static output from `website/LandingPage/exempliphai/out` (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## Runtime components (evidence-based)
### Firebase Hosting routing
- `/api/__ping` is rewritten to the `api` function (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- `/api/createAttribution` is rewritten to the `createAttribution` function (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- `/api/**` is rewritten to the `api` function (catch-all) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- `/r/**` is rewritten to the static destination `/r/index.html` (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

### Cloud Functions (Node)
- Functions are CommonJS (`type: commonjs`) and entrypoint is `index.js` (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- Node engine target is `node: 22` (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- Dependencies include `express`, `cors`, `firebase-admin`, `firebase-functions`, `stripe` (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- Admin SDK is initialized with `admin.initializeApp()` guarded by try/catch, and Firestore is used via `admin.firestore()` (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Functions code imports v2 HTTPS triggers (`onCall`, `onRequest`) and Firestore triggers (`onDocumentUpdated`, `onDocumentWritten`) (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Region selection uses `process.env.FUNCTION_REGION || "us-central1"` (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- There is a referral constants object with point values and redemption parameters (exact usage unknown due to truncation) (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)

### Firestore/Storage
- Firestore rules file is `firestore.rules` and indexes file is `firestore.indexes.json` (existence implied by config only) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- Storage rules file is `storage.rules` (existence implied by config only) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## Extension/UI entrypoints (existence only)
- Browser extension manifest exists at `src/public/manifest.json` (contents unknown) (cite: /data/.openclaw/workspace/exempliphai:src/public/manifest.json)
- Content scripts exist: `autofill.js`, `policy.js` (behavior unknown) (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js) (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)
- Vue app root file `src/vue_src/App.vue` exists (role unknown) (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/App.vue)
