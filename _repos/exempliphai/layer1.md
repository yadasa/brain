# exempliphai (Obsidian notes)

## Static index (what lives where)

### Extension UI (popup/settings)
- Pure AI mode toggle UI lives in `SettingsTab.vue` as `pureAiModeEnabled` (disabled unless `aiMappingEnabled` is true), persisted to `chrome.storage.sync` via `togglePureAiMode()` and loaded via `loadSettings()` from keys `aiMappingEnabled` and `pureAiModeEnabled`. (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/components/SettingsTab.vue)
- Settings copy explicitly states Pure AI mode “attempts to map and fill all unresolved fields using the AI FillPlan pipeline” and warns of “higher token usage” billed from the prepaid `extokens` wallet with server-side markup. (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/components/SettingsTab.vue)

### Content script (autofill + AI)
- Main autofill logic and AI modes live in `src/public/contentScripts/autofill.js`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Pure AI mode decision point: after deterministic autofill finishes, Phase 2 runs only when `smartApplyLastRunForced` is true, then chooses `tryPureAiMapping(form, res)` if `res?.pureAiModeEnabled === true`, else `tryHybridAiMapping(form, res)`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Hybrid mapping modules are dynamically imported by `ensureAiDepsLoaded()` (`contentScripts/fillPlanValidator.js` and `contentScripts/providers/gemini.js`) and expected to attach globals like `__SmartApplyProviders.gemini`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

### Policy (safety gates)
- Phase-2 policy gates are in `src/public/contentScripts/policy.js` and exported as `window.__SmartApply.policy` with `isConsentCheckbox`, `isSensitiveField`, `checkDomainConsent`, `applyPolicy`, and `filterSnapshot`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)

### Backend (Firebase Functions, AI proxy, billing)
- Firebase Hosting rewrites route `/api/**` to the Cloud Function named `api`. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- The backend entrypoint is `functions/index.js`, which implements an Express app exported as `exports.api = onRequest(...)` and includes:
  - `/ai/:action` AI proxy to Gemini (server holds keys). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
  - Prepaid token wallet billing under Firestore doc `users/{uid}/wallet/extokens`. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
  - `/billing/balance` endpoint returning wallet tokens + low-balance flag. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Functions runtime is Node 22 and depends on `firebase-admin`, `firebase-functions`, `express`, `cors`, and `stripe`. (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
