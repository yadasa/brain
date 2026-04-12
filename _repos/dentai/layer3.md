# Detailed Component Analysis

## Build & Configuration
- **Widget Bundling:** The widget uses Rollup for bundling, configured via `widget/rollup.config.mjs` (cite: /data/.openclaw/workspace/dentai/widget/rollup.config.mjs).
- **Dependency Management:** Uses `package.json` for Electron app scripts and dependencies (cite: /data/.openclaw/workspace/dentai/package.json) and `functions/package.json` for backend dependencies (cite: /data/.openclaw/workspace/dentai/functions/package.json).
- **Firebase Setup:** `firebase.json` handles the routing logic for the web interface (cite: /data/.openclaw/workspace/dentai/firebase.json).

## Authentication & Data
- **Web Auth:** The host application handles Firebase authentication through `public/host-auth-firebase.js` (cite: /data/.openclaw/workspace/dentai/public/host-auth-firebase.js).
- **Token Management:** `get-drive-token.js` is present in the root, likely for managing Google Drive access (cite: /data/.openclaw/workspace/dentai/get-drive-token.js).

## Documentation & Planning
- **Feature Planning:** `PLAN_WIDGET_TEXT_VOICE.md` contains specific plans for widget functionality (cite: /data/.openclaw/workspace/dentai/PLAN_WIDGET_TEXT_VOICE.md).
- **Project Overview:** `README.md` provides the foundational description of DentAI and its service integrations (cite: /data/.openclaw/workspace/dentai/README.md).

> Note: This layer is a placeholder draft. Next pass will produce "How to change X safely" checklists with citations.
