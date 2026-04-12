# SmartVoiceX (static index)

Repo: `/data/.openclaw/workspace/SmartVoiceX`

## Entrypoints
- Firebase Hosting serves static files from `site/` (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- Firebase Cloud Functions source folder: `functions/` (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)

## Major folders
- `site/` (Hosting public root) (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- `functions/` (Cloud Functions code + deps) (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)

## Deploy / runtime
- Functions runtime: Node.js 20 (cite: /data/.openclaw/workspace/SmartVoiceX:functions/package.json)
- Functions dependencies: `firebase-admin`, `firebase-functions` (cite: /data/.openclaw/workspace/SmartVoiceX:functions/package.json)
- Hosting target: `prod` (Firebase CLI hosting target) (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)

## Routes / endpoints
- Hosting rewrite: requests to `/api/**` are routed to a Cloud Function named `api` (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)

## Firestore security (high level)
- `/usernames/{username}`
  - create: only authenticated user, must set `uid` == auth uid
  - read: any authenticated user
  - update/delete: never allowed (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- `/users/{uid}`
  - read/write: only authenticated user matching `{uid}` (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- `/{doc=**}/svxAgents/{agentId}`
  - read/write: only authenticated user where existing `resource.data.uid` equals auth uid (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)

## Env / secrets
- Not evidenced in provided excerpts (no `.env`, config, or secret references included).
