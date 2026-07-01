# FloodGate

Production-grade distributed rate limiter for Node.js — atomic Lua scripts, Redis Cluster-safe, three algorithms, Express and Next.js 15 adapters, real-time dashboard.

[![CI](https://github.com/premhagargi/floodgate/actions/workflows/ci.yml/badge.svg)](https://github.com/premhagargi/floodgate/actions)
[![npm](https://img.shields.io/npm/v/floodgate-rl)](https://www.npmjs.com/package/floodgate-rl)

---

## Algorithms

| Algorithm | Accuracy | Redis keys | Use when |
|---|---|---|---|
| `sliding-window-counter` | ~0.1% error at boundary | 2 (hash-tagged) | High throughput, predictable billing |
| `sliding-window-log` | Exact | 1 sorted set | Low volume, exact accounting |
| `token-bucket` | Burst-permissive | 1 hash | Allow short bursts, smooth long-term rate |

---

## Quick start

```bash
npm install floodgate-rl
# With Redis support
npm install floodgate-rl ioredis
```

```ts
import Redis from 'ioredis'
import { createLimiter } from 'floodgate-rl'

// In-memory (no Redis needed — dev/test/single-process)
const limiter = createLimiter({ backend: 'memory' })

// Redis-backed (atomic, distributed, survives restarts)
const limiter = createLimiter({
  backend: 'redis',
  redisClient: new Redis({ host: 'localhost', port: 6379 }),
  algorithm: 'sliding-window-counter',
  fallback: 'memory',               // falls back to memory on Redis error
})

const result = await limiter.check({ key: 'user:42', limit: 100, windowMs: 60_000 })
// { allowed: true, remaining: 99, resetAt: 1700000060000 }
```

### Express

```ts
import express from 'express'
import { rateLimit } from 'floodgate-express'

const app = express()
app.use('/api', rateLimit({
  limiter,
  limit: 100,
  windowMs: 60_000,
  key: (req) => req.headers['x-api-key'] as string ?? req.ip,
}))
```

### Next.js 15 (App Router)

```ts
// app/api/search/route.ts
import { withRateLimit } from 'floodgate-nextjs'

async function handler(req: NextRequest) {
  return Response.json({ results: [] })
}

export const GET = withRateLimit(handler, { limiter, limit: 30, windowMs: 60_000 })
```

### Next.js middleware.ts (edge runtime)

```ts
import { createMiddlewareHandler } from 'floodgate-nextjs'

export const middleware = createMiddlewareHandler({
  limiter,            // use MemoryBackend — ioredis does not run in edge
  limit: 60,
  windowMs: 60_000,
  key: (req) => req.headers.get('x-forwarded-for') ?? 'anon',
})

export const config = { matcher: ['/api/:path*'] }
```

---

## Events

```ts
limiter.on('check',        (key, result) => { /* every request */ })
limiter.on('blocked',      (key, result) => { /* only denied requests */ })
limiter.on('redis:error',  (err)         => { /* primary Redis threw */ })
limiter.on('redis:fallback', (err)       => { /* using memory fallback */ })
```

---

## Redis internals

### Why Lua?
All state mutations are Lua scripts executed via `EVALSHA` — one round-trip, atomically, with no race conditions between `INCR` and `EXPIRE`.

### NOSCRIPT recovery
If Redis restarts or `SCRIPT FLUSH` is called, the SHA cache is invalid. FloodGate catches `NOSCRIPT`, re-loads the script with `SCRIPT LOAD`, and retries transparently:

```
EVALSHA <sha> …  →  NOSCRIPT error
  └─ SCRIPT LOAD <lua>  →  new SHA
     └─ EVALSHA <new-sha> …  →  success
```

### Redis Cluster safety
All multi-key scripts use **hash tags** so both keys land on the same slot:

```
{user:42}:sw:1700000060000   ← current window
{user:42}:sw:1700000000000   ← previous window
```

The `{user:42}` tag is the only part Redis uses for slot assignment.

---

## Dashboard

```bash
cd apps/dashboard
npm install
# Core must be built first (or run in watch mode alongside)
npm run dev           # → http://localhost:3000
```

Fire traffic at the dashboard with the built-in simulation panel. Displays:
- Real-time request/block counts via Server-Sent Events
- Per-key block rates with colour-coded badges
- 60-second block rate sparkline

---

## Monorepo setup

```bash
npm install                # install all workspace deps
npm run build              # build core + middleware packages
npm test                   # vitest — all 22 unit tests
npm run typecheck          # tsc --noEmit across workspaces
```

**Dev workflow (two terminals):**
```bash
# Terminal 1 — rebuild core on change
npm run build -w floodgate-rl -- --watch

# Terminal 2 — Next.js dashboard
npm run dev -w floodgate-dashboard
```

---

## Package structure

```
floodgate/
├── packages/
│   ├── core/          floodgate-rl        — rate limiter + algorithms + backends
│   ├── express/       floodgate-express   — Express middleware
│   └── nextjs/        floodgate-nextjs    — Next.js route handler + edge middleware
└── apps/
    └── dashboard/     floodgate-dashboard — Next.js 15 real-time dashboard
```

---

## Tech stack

- **TypeScript** strict, NodeNext modules
- **ioredis** (optional peer dep) — Redis client
- **Lua** — atomic server-side scripts via `EVALSHA`
- **tsup** — dual CJS + ESM build with `.d.ts`
- **Vitest** — unit + integration tests
- **Next.js 15** + **React 19** — dashboard
- **Tailwind CSS** — dashboard styling
- **Server-Sent Events** — real-time push without WebSocket

---

## License

MIT
