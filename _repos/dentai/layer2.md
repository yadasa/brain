# Architecture & Structure

The repository is organized into several key functional areas:

## 1. Electron Desktop Client
Core application files for the desktop interface:
- `main.js`: Main process entry point (cite: /data/.openclaw/workspace/dentai/main.js).
- `renderer.js`: Renderer process for UI logic (cite: /data/.openclaw/workspace/dentai/renderer.js).
- `preload.js`: Preload script for secure IPC communication (cite: /data/.openclaw/workspace/dentai/preload.js).

## 2. Firebase Backend
Cloud-side logic and routing:
- **Functions:** Serverless backend logic located in the `functions/` directory, with `functions/index.js` as a primary entry point (cite: /data/.openclaw/workspace/dentai/functions/index.js).
- **Hosting & Rewrites:** Firebase configuration manages rewrites for `/api` and `/rt` endpoints (cite: /data/.openclaw/workspace/dentai/firebase.json).
- **Database Rules:** Firestore security rules defined in `firestore.rules` (cite: /data/.openclaw/workspace/dentai/firestore.rules).

## 3. Web & Widget Ecosystem
Components designed for web integration:
- **Widget System:** A specialized widget found in the `widget/` directory, with deployment details in `widget/DEPLOYMENT.md` (cite: /data/.openclaw/workspace/dentai/widget/DEPLOYMENT.md).
- **Public Web Assets:** Files in the `public/` directory used for web hosting, including `index.html`, `host-app.js`, and `host-auth-firebase.js` (cite: /data/.openclaw/workspace/dentai/public/index.html, /data/.openclaw/workspace/dentai/public/host-app.js, /data/.openclaw/workspace/dentai/public/host-auth-firebase.js).
- **SVX Widget:** Specific widget implementation in `public/svx-widget.js` (cite: /data/.openclaw/workspace/dentai/public/svx-widget.js).
