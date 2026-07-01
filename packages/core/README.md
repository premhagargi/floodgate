# floodgate-rl

Production-grade distributed rate limiter for Node.js. Redis-backed, atomic Lua scripts, Redis Cluster-safe, with an in-memory backend for dev/test/single-process use.

This is the core engine of [FloodGate](https://github.com/premhagargi/floodgate). It has no framework dependency — pair it with [`floodgate-express`](https://www.npmjs.com/package/floodgate-express) or [`floodgate-nextjs`](https://www.npmjs.com/package/floodgate-nextjs) for drop-in middleware, or call `.check()` directly from any Node.js code.

## Install

```bash
npm install floodgate-rl
```

Using the Redis backend also requires `ioredis` (peer dependency, optional):

```bash
npm install ioredis
```

## Quick start

```ts
import Redis from 'ioredis'
import { createLimiter } from 'floodgate-rl'

// In-memory — no Redis needed, good for dev/test/single-process
const limiter = createLimiter({ backend: 'memory' })

// Redis-backed — atomic, distributed, survives restarts
const limiter = createLimiter({
  backend: 'redis',
  redisClient: new Redis({ host: 'localhost', port: 6379 }),
  algorithm: 'sliding-window-counter', // default
  fallback: 'memory',                  // fall back to memory if Redis errors
})

const result = await limiter.check({ key: 'user:42', limit: 100, windowMs: 60_000 })
// { allowed: true, remaining: 99, resetAt: 1700000060000 }

if (!result.allowed) {
  // result.retryAfter is set (ms) whenever allowed is false
}
```

## Why FloodGate

- **Atomic Lua scripts** — all state mutations happen in a single `EVALSHA` call, one Redis round-trip, no race condition between `INCR` and `EXPIRE`.
- **Redis Cluster safe** — multi-key scripts use hash-tagged keys (`{user:42}:sw:...`) so every key involved in a check lands on the same cluster slot.
- **Automatic NOSCRIPT recovery** — if Redis restarts or `SCRIPT FLUSH` runs, FloodGate catches the `NOSCRIPT` error, reloads the script with `SCRIPT LOAD`, and retries transparently.
- **Three algorithms** — pick the accuracy/cost trade-off that fits each route.
- **Automatic memory fallback** — keep serving traffic (in-process, best-effort) if Redis becomes unreachable.
- **TypeScript strict**, dual ESM + CJS build, typed `EventEmitter` for observability.
- **`ioredis` is an optional peer dependency** — the memory backend has zero runtime dependencies.

## Algorithms

| Algorithm | Accuracy | Redis keys | Use when |
|---|---|---|---|
| `sliding-window-counter` (default) | ~0.1% error at window boundary | 2 (hash-tagged) | High throughput, predictable cost |
| `sliding-window-log` | Exact | 1 sorted set | Low volume, exact accounting |
| `token-bucket` | Burst-permissive | 1 hash | Allow short bursts, smooth long-term rate |

Set the algorithm per limiter via `createLimiter({ algorithm: '...' })`. Both the memory and Redis backends implement all three.

## API

### `createLimiter(options): RateLimiter`

The main entry point. Builds the appropriate `Backend` and returns a ready-to-use `RateLimiter`.

| Option | Type | Required | Description |
|---|---|---|---|
| `backend` | `'redis' \| 'memory'` | yes | Storage backend. |
| `algorithm` | `'sliding-window-counter' \| 'sliding-window-log' \| 'token-bucket'` | no | Defaults to `'sliding-window-counter'`. |
| `redisClient` | `RedisClient` (ioredis-compatible instance) | when `backend: 'redis'` | An `ioredis` client (or anything implementing `evalsha`, `script('LOAD', ...)`, `quit`). |
| `fallback` | `'memory'` | no | Only applies when `backend: 'redis'`. On any error from the Redis backend, the limiter transparently falls back to an in-process memory backend and emits `redis:error` / `redis:fallback`. |
| `keyPrefix` | `string` | no | Prepended to every key as `` `${keyPrefix}:${key}` ``. Use to namespace a shared Redis instance across apps/environments. |

Throws if `backend: 'redis'` is passed without `redisClient`, or if `backend` is not `'redis' \| 'memory'`.

### `RateLimiter`

Returned by `createLimiter`, or construct one directly with your own `Backend` implementation: `new RateLimiter(backend, { algorithm?, fallback?, keyPrefix? })`.

#### `limiter.check(options: LimitOptions): Promise<LimitResult>`

| `LimitOptions` field | Type | Description |
|---|---|---|
| `key` | `string` | Identity being limited (user id, IP, API key, route, etc). |
| `limit` | `number` | Max allowed requests in the window. |
| `windowMs` | `number` | Window size in milliseconds. |

| `LimitResult` field | Type | Description |
|---|---|---|
| `allowed` | `boolean` | Whether this request is allowed. |
| `remaining` | `number` | Requests remaining in the current window. |
| `resetAt` | `number` | Epoch ms when the window/limit resets. |
| `retryAfter` | `number \| undefined` | Milliseconds to wait before retrying — only set when `allowed` is `false`. |

#### `limiter.close(): Promise<void>`

Closes the primary backend (and the fallback backend, if one was configured). For the Redis backend this calls `redisClient.quit()`; for the memory backend it clears the internal GC timer.

### `RedisBackend`

Exported for advanced use (e.g. constructing a `RateLimiter` manually, or reusing a single loaded backend across multiple limiters):

```ts
import { RedisBackend, RateLimiter } from 'floodgate-rl'
import Redis from 'ioredis'

const backend = new RedisBackend(new Redis())
await backend.loadScripts() // optional — scripts also lazy-load on first NOSCRIPT
const limiter = new RateLimiter(backend, { algorithm: 'token-bucket' })
```

## Events

`RateLimiter` extends Node's `EventEmitter` with a typed event map:

```ts
limiter.on('check', (key, result) => {
  // fired on every check(), allowed or not
})

limiter.on('blocked', (key, result) => {
  // fired only when a request is denied
})

limiter.on('redis:error', (err) => {
  // the Redis backend threw — only fires when `fallback: 'memory'` is set
})

limiter.on('redis:fallback', (err) => {
  // this check() is being served from the in-memory fallback instead of Redis
})
```

| Event | Args | When |
|---|---|---|
| `check` | `(key: string, result: LimitResult)` | Every call to `check()`, regardless of outcome. |
| `blocked` | `(key: string, result: LimitResult)` | Only when `result.allowed === false`. |
| `redis:error` | `(error: Error)` | The primary backend threw and a `fallback` is configured (the error is swallowed and the fallback serves the request). Without `fallback` set, the error is thrown from `check()` instead. |
| `redis:fallback` | `(error: Error)` | Emitted alongside `redis:error` — use this if you only care about the fallback path. |

## Redis internals

### Why Lua?
Every check is one `EVALSHA` call — increment, compare against the limit, and set expiry all happen atomically on the Redis server, so there's no window for a race between separate `INCR`/`EXPIRE` round-trips.

### NOSCRIPT recovery
```
EVALSHA <sha> ...  →  NOSCRIPT error
  └─ SCRIPT LOAD <lua>  →  new SHA
     └─ EVALSHA <new-sha> ...  →  success
```
Scripts are loaded eagerly when the Redis backend is created; if the SHA cache is ever invalidated (Redis restart, `SCRIPT FLUSH`), FloodGate reloads and retries automatically — no dropped requests, no manual intervention.

### Redis Cluster safety
Multi-key scripts use hash tags so all keys for a given rate-limit key land on the same cluster slot:
```
{user:42}:sw:1700000060000   ← current window
{user:42}:sw:1700000000000   ← previous window
```
Only the `{user:42}` portion is used for slot assignment.

## Related packages

- [`floodgate-express`](https://www.npmjs.com/package/floodgate-express) — Express middleware built on top of this package (`floodgate-rl` is a peer dependency).
- [`floodgate-nextjs`](https://www.npmjs.com/package/floodgate-nextjs) — Next.js App Router / edge middleware helpers built on top of this package (`floodgate-rl` is a peer dependency).

Both adapters just call `limiter.check(...)` under the hood — you construct the `RateLimiter` with `createLimiter()` from this package and hand it to them.

## Requirements

Node.js >= 20. `ioredis` >= 5 if using `backend: 'redis'`.

## License

MIT © [premhagargi](https://github.com/premhagargi) — see the [repository](https://github.com/premhagargi/floodgate) for source, issues, and the full monorepo (including `floodgate-express`, `floodgate-nextjs`, and a real-time dashboard app).
