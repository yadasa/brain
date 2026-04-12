# Layer 3: Change playbooks (safe edits, what can break)

> Constraint: many app/extension details are unknown because key files are truncated/unavailable. These playbooks focus on the concrete, evidenced integration points.

## 1) Change Hosting public directory
- What to change: Where Firebase Hosting serves static files from.
- Files to edit:
  - `firebase.json` (`hosting.public`) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- What can break:
  - Entire website serving, including `/r/**` rewrite destinations, if the new directory does not contain required files like `/r/index.html`. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## 2) Add or modify an API route under `/api/...`
- What to change: Hosting rewrites that map paths to Cloud Functions.
- Files to edit:
  - `firebase.json` (`hosting.rewrites`) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
  - Likely `functions/index.js` to export/implement the referenced function name (implementation/export details unknown due to truncation). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- What can break:
  - Route conflicts: `/api/**` is a catch-all to `api`, so more-specific rewrites must be ordered/defined correctly or they may never be reached. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
  - 404/500 at runtime if the rewrite points to a function name that is not deployed/defined. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## 3) Change the `/r/**` redirect/landing behavior
- What to change: Static rewrite destination for referral/redirect-like paths.
- Files to edit:
  - `firebase.json` (rewrite `{ "source": "/r/**", "destination": "/r/index.html" }`) (cite: /data/.openclaw/workspace/exempliphai:firebase.json)
- What can break:
  - Any links relying on `/r/...` will stop resolving or will serve the wrong HTML if the destination changes or is missing in the hosted output. (cite: /data/.openclaw/workspace/exempliphai:firebase.json)

## 4) Change default Cloud Functions region
- What to change: Default region used by function definitions (as coded).
- Files to edit:
  - `functions/index.js` (`process.env.FUNCTION_REGION || "us-central1"`) (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- What can break:
  - Latency and data residency expectations.
  - If different functions are deployed to different regions unexpectedly, endpoints may move or cross-region access may increase costs (exact deployment config unknown). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)

## 5) Change Node runtime version for Cloud Functions
- What to change: Node engine target for the functions package.
- Files to edit:
  - `functions/package.json` (`engines.node`) (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- What can break:
  - Deployment/runtime incompatibility if the platform does not support the chosen Node version.
  - Dependency behavior changes under a different Node major version. (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)

## 6) Add a new dependency (or upgrade Stripe/Express/etc.)
- What to change: Functions dependencies.
- Files to edit:
  - `functions/package.json` (`dependencies` / `devDependencies`) (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)
- What can break:
  - Breaking API changes when upgrading `stripe`, `express`, `firebase-admin`, or `firebase-functions`.
  - Lint/build failures if eslint or rules change (lint script exists). (cite: /data/.openclaw/workspace/exempliphai:functions/package.json)

## 7) Modify Firestore trigger behavior
- What to change: Firestore triggers imported in `functions/index.js`.
- Files to edit:
  - `functions/index.js` (uses `onDocumentUpdated`, `onDocumentWritten`) (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)
- What can break:
  - Trigger handlers may not fire, may fire too often, or may fail on permissions if the document paths/filters change (exact triggers unknown due to truncation). (cite: /data/.openclaw/workspace/exempliphai:functions/index.js)

> Note: This layer is incomplete due to truncated upstream output. Next pass should be rerun with more evidence excerpts to produce richer playbooks.
