# SmartVoiceX (processes + connections)

## Request flow: browser → Hosting → Functions
1) Client loads static app from Firebase Hosting (`public: site`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
2) Any request matching `/api/**` is rewritten by Hosting to the Cloud Function named `api`. This is the backend HTTP surface exposed via Hosting. (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
3) The `api` function implementation details are not evidenced in the provided excerpts (functions/index.js excerpt not present here).

## Auth model (as enforced by Firestore rules)
- Many reads/writes require `request.auth != null` (authenticated caller). (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- User profile data is scoped to the authenticated user’s UID under `/users/{uid}`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)

## Firestore data model (as implied by rules)
- `usernames` collection: documents keyed by username, with a `uid` field written at creation time; immutable thereafter (no updates/deletes). (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- `users` collection: one document per uid, fully readable/writable by that user. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- `svxAgents` subcollections can exist under any document path; access is restricted by the existing document’s `resource.data.uid` field matching the caller. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)

## Functions runtime + SDKs
- Cloud Functions run on Node 20 and use the Admin SDK (`firebase-admin`) and Functions SDK (`firebase-functions`). This strongly suggests server-side interactions with Firebase services (Firestore, Auth, etc.), but specifics are not evidenced here. (cite: /data/.openclaw/workspace/SmartVoiceX:functions/package.json)

## External APIs / Storage
- Not evidenced in provided excerpts.
