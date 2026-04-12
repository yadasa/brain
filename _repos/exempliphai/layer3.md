# exempliphai playbooks (how to change X safely)

> Rule: keep every change consistent across UI (settings), content script behavior, server proxy/billing, and policy gates.

## 1) Change what “Pure AI mode” does (scope, batches, thresholds)
- Update the pure-mode collection loop in `tryPureAiMapping()` (batch sizes, filters, visibility checks) and keep the policy gates (`isConsentCheckbox`, `isSensitiveField`) intact so you do not send prohibited fields to AI. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- If you change `confidenceThreshold` for pure mode (currently `0.70`), do the same evaluation for hybrid (`0.75`) so behavior differences remain intentional and documented. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

## 2) Change where the Pure AI toggle is stored (or rename the key)
- The UI loads/saves `pureAiModeEnabled` from `chrome.storage.sync` in `loadSettings()` and `togglePureAiMode()`; if you rename the key, update both read and write paths and keep the dependency that Pure AI implies `aiMappingEnabled=true`. (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/components/SettingsTab.vue)
- The content script reads `res` from `getStorageDataSync()` and branches on `res?.pureAiModeEnabled`; update this branch to match any rename. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

## 3) Change hybrid candidate selection without increasing privacy risk
- Hybrid uses `shouldConsiderLabelForAi(label)` to keep AI calls minimal; expanding this list can increase the number of fields sent to AI, so preserve the existing “allowed profile KEY NAMES only (never values)” behavior when building `allowedProfileKeys`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Keep the pre-send policy gates (`isConsentCheckbox`, `isSensitiveField`) in place even if you broaden the hints. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

> Note: The upstream generated playbook list was truncated. If you want, I can rerun generation with a smaller prompt and finish the remaining playbooks.
