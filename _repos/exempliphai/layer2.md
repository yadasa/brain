# exempliphai (connections and processes)

## Pure AI mode toggle (what it does, where implemented)
- UI: the setting is a checkbox bound to `pureAiModeEnabled` with `@change="togglePureAiMode"`, and is disabled unless AI mapping is enabled. (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/components/SettingsTab.vue)
- Storage: `togglePureAiMode()` writes `{ pureAiModeEnabled, aiMappingEnabled }` to `chrome.storage.sync`; it also forces `aiMappingEnabled=true` when Pure AI mode is turned on. (cite: /data/.openclaw/workspace/exempliphai:src/vue_src/components/SettingsTab.vue)
- Execution: content script reads sync storage into `res` (via `getStorageDataSync()` in `autofill()`), and Phase 2 chooses between:
  - Pure AI mapping when `res?.pureAiModeEnabled === true`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
  - Hybrid AI mapping otherwise. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

## AI FillPlan pipeline (hybrid vs pure-ai)

### Shared stack (both modes)
- Both modes require globals present on `globalThis.__SmartApply`: `formSnapshot`, `policy`, `aiFillPlan`, and `fillExecutor`, and both call `aiFillPlan.generateTier1(...)` to produce a plan, then `fillExecutor.execute(plan, { root, profile, confidenceThreshold, force })` to apply it. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Both modes only send “allowed profile KEY NAMES (never values)” by building `allowedProfileKeys` from the keys of `res` while blocking sensitive settings keys such as `API Key`, `aiMappingEnabled`, and `cloudSyncEnabled` (and `pureAiModeEnabled` additionally in pure mode). (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Policy gates run before sending fields to the AI layer: both modes skip consent-like fields and skip sensitive fields entirely when constructing `unresolved_fields` (they `continue` if `policy.isConsentCheckbox({label})` or `policy.isSensitiveField({label, section})`). (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

### Hybrid mapping (additive, smaller candidate set)
- Hybrid mapping is “additive” after deterministic autofill and only considers a limited set of unresolved controls whose labels pass `shouldConsiderLabelForAi(label)` (a hint-based filter) and are empty/unfilled. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Hybrid limits candidates to 10 unresolved fields and enforces a 15s cooldown via `_smartApplyHybridLastRunAt`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Hybrid executes with `confidenceThreshold: 0.75`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

### Pure AI mapping (broader candidate set, batched)
- Pure AI mapping “considers ALL empty, non-sensitive controls (not just label-hinted ones)” by scanning controls and only filtering by emptiness, visibility/enabled checks, and policy gates. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)
- Pure AI mapping runs multiple batches (`maxBatches=4`, `batchSize=14`) and for each batch calls `generateTier1` then executes with `confidenceThreshold: 0.70`, adding a delay between batches. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

## Billing (extokens wallet, MARKUP=3.33, AI proxy deductions)

### Server-side AI proxy (no client keys)
- The backend is explicitly designed so there are “No client-side Gemini keys”; AI calls are sent to the server with a Firebase ID token, the server forwards to Gemini with `GEMINI_API_KEY`, and the server deducts a prepaid token balance in Firestore. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- The content script’s AI Answer flow calls the extension background via `chrome.runtime.sendMessage({ action:'AI_PROXY', aiAction:'aiAnswer', model:'gemini-3-flash-preview', input })`, expecting the proxy to return `usage` and `result.text`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

### Wallet + markup mechanics
- Wallet location: extension prepaid tokens live in Firestore doc `users/{uid}/wallet/extokens` (field `tokens`). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Markup: `MARKUP = 3.33` and token conversion is `TOKENS_PER_USD = 333`; billed USD is `providerUsd * MARKUP`, then deduct tokens as `ceil(bill_usd * TOKENS_PER_USD)`. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Deduction happens in a Firestore transaction in `deductWalletUsd()`, which throws `insufficient_balance` if current tokens are below the computed deduction, else writes the new balance plus lifetime counters and optional `lastCharge` metadata. (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- Low-balance gating happens before provider calls for both SerpAPI and Gemini, with thresholds `LOW_BALANCE_THRESHOLD=30` and a lower threshold for specific custom-question actions (`LOW_BALANCE_THRESHOLD_CUSTOM_Q=3`). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)

## Safety policy (consent + sensitive fields)

### Client-side policy module
- `policy.js` flags consent-like checkboxes by label substrings such as “agree/consent/terms/privacy/gdpr/ccpa/waiver/release/attest/certify/signature”. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)
- `policy.js` flags sensitive fields using EEO hints (race/ethnicity/gender/veteran/disability/sexual orientation/eeo/self-identify) and other sensitive hints (visa/work authorization/citizenship/age/dob), based on label + section text. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)
- `applyPolicy(action, {domainConsent})` enforces: consent-like fields are forced to `{ source:'skip' }` and marked `policy.blocked=true`, and sensitive fields are marked `requires_review=true` unless explicit domain consent exists. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/policy.js)

### Mapping-time enforcement in autofill.js
- Hybrid and pure mapping skip consent-like fields and skip sensitive fields before sending anything to AI by checking `policy.isConsentCheckbox` and `policy.isSensitiveField` while collecting `unresolved_fields`. (cite: /data/.openclaw/workspace/exempliphai:src/public/contentScripts/autofill.js)

### Server-side prompt guardrails for FillPlan
- The server action `mapFieldsToFillPlan` builds a system prompt that instructs: “Never propose checking consent/terms/acknowledgement checkboxes” and “If the field is sensitive (EEO/disability/veteran/visa), set policy.requires_review=true unless explicitly allowed.” (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
