# SmartVoiceX (how to change X safely)

Below are playbooks that only rely on evidenced files. For anything involving request handlers, API behavior, or the frontend app logic, the relevant excerpts were not provided here.

## 1) Change the Hosting public directory (site build output)
- Edit: `firebase.json` (`hosting.public`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- What can break:
  - Hosting may serve the wrong files (blank app, 404s) if the directory doesn’t contain your built assets.
  - The `/api/**` rewrite still works, but your frontend may stop loading.

## 2) Add or modify API rewrite paths
- Edit: `firebase.json` (`hosting.rewrites`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- What can break:
  - Changing `source` patterns can route requests incorrectly.
  - Changing the `function` name requires a matching deployed function; otherwise `/api/**` will error.

## 3) Change the Cloud Functions source folder
- Edit: `firebase.json` (`functions[].source`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- What can break:
  - Deploys can fail if the new folder lacks `package.json` or expected entrypoints.
  - Hosting rewrites to `api` will still point to the function name, but the function might not deploy.

## 4) Upgrade or pin the Node runtime for Functions
- Edit: `functions/package.json` (`engines.node`). (cite: /data/.openclaw/workspace/SmartVoiceX:functions/package.json)
- What can break:
  - Runtime incompatibilities (syntax, dependencies) can cause deployment/runtime errors.
  - If Firebase Functions doesn’t support the selected runtime in your environment, deploy may be blocked.

## 5) Upgrade Firebase Admin / Functions SDK versions
- Edit: `functions/package.json` (`dependencies`). (cite: /data/.openclaw/workspace/SmartVoiceX:functions/package.json)
- What can break:
  - Breaking changes in SDK APIs can crash function execution.
  - Transitive dependency updates can change behavior.

## 6) Tighten username registration (create) constraints
- Edit: `firestore.rules` in `match /usernames/{username}` `allow create`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- What can break:
  - Sign-up or “claim username” flows may fail if you add constraints that the client/server doesn’t satisfy (e.g., additional required fields).

## 7) Allow username updates (currently forbidden)
- Edit: `firestore.rules` in `match /usernames/{username}`: change `allow update, delete: if false;`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- What can break:
  - Security risk: allowing updates/deletes can undermine “uniqueness” guarantees and permit takeover unless carefully constrained.
  - Existing code may assume immutability.

## 8) Change who can read usernames
- Edit: `firestore.rules` in `match /usernames/{username}` `allow read`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- What can break:
  - If you restrict reads further, username lookup/availability checks may fail.
  - If you open reads publicly, you may expose the username registry.

## 9) Change user profile access model
- Edit: `firestore.rules` in `match /users/{uid}` `allow read, write`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- What can break:
  - Any change from `request.auth.uid == uid` impacts core user data isolation.
  - Loosening can leak profiles; tightening can block legitimate self-access.

## 10) Fix or adjust `svxAgents` rule behavior (resource vs request)
- Edit: `firestore.rules` in `match /{doc=**}/svxAgents/{agentId}`. (cite: /data/.openclaw/workspace/SmartVoiceX:firestore.rules)
- What can break:
  - Current rule uses `resource.data.uid`, which is about the existing document. If clients create new agent docs, `resource` may not exist, causing denies unless handled explicitly.
  - Changing to `request.resource.data.uid` (or a combined create/update/read split) can change who can create vs modify docs.

## 11) Change Hosting target name
- Edit: `firebase.json` (`hosting.target`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- What can break:
  - Firebase CLI deploys may go to a different configured target or fail if the target isn’t configured.

## 12) Add additional Hosting ignores
- Edit: `firebase.json` (`hosting.ignore`). (cite: /data/.openclaw/workspace/SmartVoiceX:firebase.json)
- What can break:
  - Ignoring built assets (JS/CSS) can produce partial deploys and runtime failures in the browser.
