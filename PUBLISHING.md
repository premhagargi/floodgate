# FloodGate — Publishing & Deployment Plan

Everything needed to go from this repo to live npm packages, a deployed marketing site, and a hosted dashboard.

---

## Overview

| Artifact | Where | Service | Notes |
|---|---|---|---|
| `floodgate-rl` | npm | npmjs.com | Core library |
| `floodgate-express` | npm | npmjs.com | Peer-depends on core |
| `floodgate-nextjs` | npm | npmjs.com | Peer-depends on core |
| Marketing site | Web | Vercel | `apps/marketing` — static, auto-deploys on push |
| Dashboard | Web | Vercel | `apps/dashboard` — dynamic, needs SSE runtime |

---

## 1. npm Packages

### One-time setup

1. Create an account at [npmjs.com](https://npmjs.com) if you don't have one.
2. Generate an **Automation token** (not Classic — Automation tokens work in CI):
   ```
   npmjs.com → Avatar → Access Tokens → Generate New Token → Automation
   ```
3. Add it to GitHub secrets:
   ```
   github.com/premhagargi/floodgate → Settings → Secrets → Actions
   Name: NPM_TOKEN
   ```

### Publishing order

Always publish in dependency order — core first, then adapters:

```bash
# 1. Build everything
npm run build -w floodgate-rl
npm run build -w floodgate-express
npm run build -w floodgate-nextjs

# 2. Publish (from repo root)
npm publish -w packages/core   --access public
npm publish -w packages/express --access public
npm publish -w packages/nextjs  --access public
```

### Versioning

All three packages track the same version number (they're a suite). Before each publish:

```bash
# Bump all three at once
npm version patch -w packages/core -w packages/express -w packages/nextjs

# Or minor / major for larger releases
npm version minor -w packages/core -w packages/express -w packages/nextjs

git push && git push --tags
```

Pushing a tag starting with `v` triggers the automated release workflow (see section 4).

---

## 2. Marketing Site — Vercel

The marketing site (`apps/marketing`) is a statically generated Next.js 15 app. Vercel is the best fit — zero config, free tier, global CDN.

### Deploy steps

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `premhagargi/floodgate` from GitHub
3. Set the **Root Directory** to `apps/marketing`
4. Framework preset auto-detects as **Next.js** — leave all other settings default
5. Click **Deploy**

Vercel will redeploy automatically on every push to `master` that touches `apps/marketing/**`.

### Custom domain

In Vercel project settings → Domains → Add `floodgate.dev` (or whatever domain you buy). Point DNS:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

### Environment variables needed

None — the marketing site is fully static with no server-side secrets.

---

## 3. Dashboard — Vercel

The dashboard (`apps/dashboard`) uses Server-Sent Events (SSE), which requires a Node.js runtime (not Edge). Vercel handles this with `export const runtime = 'nodejs'` on the SSE route (already set via `force-dynamic`).

### Deploy steps

1. In Vercel → **Add New Project** (separate project from marketing)
2. Import the same repo `premhagargi/floodgate`
3. Root Directory: `apps/dashboard`
4. Framework preset: **Next.js**
5. Deploy

### Optional: Add a real Redis backend

The dashboard currently uses in-memory state (resets on cold start). To persist across serverless function invocations, add Upstash Redis:

1. In Vercel → Storage → Create → Upstash Redis
2. Link it to the dashboard project — Vercel auto-injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
3. Update `apps/dashboard/src/lib/limiter.ts` to use `@upstash/redis` as the `redisClient`:
   ```ts
   import { Redis } from '@upstash/redis'
   const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
   export const limiter = createLimiter({ backend: 'redis', redisClient: redis, algorithm: 'sliding-window-counter' })
   ```

---

## 4. Automated Release (GitHub Actions)

The workflow at `.github/workflows/release.yml` (see file) triggers on any `v*` tag push and:

1. Runs the full test suite on Node 20 + 22
2. Builds all three packages
3. Publishes to npm in order (core → express → nextjs)

### How to cut a release

```bash
# Bump version in all packages
npm version patch -w packages/core -w packages/express -w packages/nextjs

# Push commits + the new tag
git push && git push --tags
```

GitHub Actions picks up the `v*` tag, runs tests, publishes. Done.

---

## 5. Pre-publish checklist

Run this before every publish:

```bash
# All tests green
npm run test -w floodgate-rl

# Types check clean
npm run typecheck -w floodgate-rl
npm run typecheck -w floodgate-express
npm run typecheck -w floodgate-nextjs

# Dist is fresh
npm run build -w floodgate-rl
npm run build -w floodgate-express
npm run build -w floodgate-nextjs

# Verify what will actually go to npm (sanity check)
npm pack -w packages/core --dry-run
npm pack -w packages/express --dry-run
npm pack -w packages/nextjs --dry-run
```

---

## 6. Post-launch checklist

- [ ] Add `"homepage"` and `"repository"` fields to each `package.json` pointing at the GitHub repo
- [ ] Add README badges once npm packages are live (version, downloads, license)
- [ ] Submit marketing site to Google Search Console for indexing
- [ ] Add `floodgate.dev` to the `metadataBase` URL in `apps/marketing/src/app/layout.tsx` once domain is live
- [ ] Create a GitHub Release from the tag (auto-populated by the release workflow)
- [ ] Post on X / HN / Reddit r/node — this is genuinely worth announcing
