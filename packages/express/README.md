# floodgate-express

Express middleware for [FloodGate](https://github.com/premhagargi/floodgate) — wraps a [`floodgate-rl`](https://www.npmjs.com/package/floodgate-rl) `RateLimiter`, sets standard `RateLimit-*` response headers, and returns a `429` with `Retry-After` when a request is blocked.

## Install

```bash
npm install floodgate-express floodgate-rl
```

`express` and `floodgate-rl` are peer dependencies — install both alongside `floodgate-express`.

## Quick start

```ts
import express from 'express'
import { createLimiter } from 'floodgate-rl'
import { rateLimit } from 'floodgate-express'
import Redis from 'ioredis'

const limiter = createLimiter({
  backend: 'redis',
  redisClient: new Redis(),
  fallback: 'memory',
})

const app = express()

app.use('/api', rateLimit({
  limiter,
  limit: 100,
  windowMs: 60_000,
  key: (req) => (req.headers['x-api-key'] as string) ?? req.ip,
}))

app.listen(3000)
```

## Why FloodGate

- **One limiter, any framework** — build a `RateLimiter` once with `floodgate-rl` and reuse it across Express routes, Next.js routes, or plain scripts.
- **Standard headers out of the box** — `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, and `Retry-After` on block.
- **Customizable key, skip, and response behavior** — see options below.
- **Atomic, cluster-safe rate limiting under the hood** via `floodgate-rl`'s Lua-script Redis backend (or the in-memory backend for dev/test).

## API

### `rateLimit(options): RequestHandler`

Returns an Express middleware function `(req, res, next)`.

| Option | Type | Required | Description |
|---|---|---|---|
| `limiter` | `RateLimiter` (from `floodgate-rl`) | yes | The limiter instance to call `.check()` on. |
| `limit` | `number` | yes | Max requests allowed per window. |
| `windowMs` | `number` | yes | Window size in milliseconds. |
| `key` | `(req: Request) => string` | no | Identity to rate-limit by. Defaults to the first `X-Forwarded-For` IP, falling back to `req.socket.remoteAddress`, falling back to `'unknown'`. |
| `skip` | `(req: Request) => boolean \| Promise<boolean>` | no | Return `true` to bypass rate limiting for this request (e.g. health checks, internal IPs). When skipped, `next()` is called immediately and no headers are set. |
| `onBlocked` | `(req: Request, res: Response, retryAfterMs: number) => void` | no | Called instead of `next()` when the request is denied, after headers (including `Retry-After`) are set. Defaults to `res.status(429).json({ error: 'Too Many Requests', retryAfter: <seconds> })`. |
| `onAllowed` | `(req: Request, res: Response, result: LimitResult) => void` | no | Called just before `next()` when the request is allowed. Not called by default — useful for custom logging/metrics. |

### Response headers

Set on every non-skipped request:

| Header | Value |
|---|---|
| `RateLimit-Limit` | `limit` |
| `RateLimit-Remaining` | `result.remaining` |
| `RateLimit-Reset` | `result.resetAt`, in seconds (`Math.ceil(resetAt / 1000)`) |
| `Retry-After` | Only set when blocked — `result.retryAfter` in seconds |

### Errors

If `limiter.check()` throws (e.g. Redis backend with no `fallback` configured and Redis unreachable), the error is passed to `next(err)` so your existing Express error-handling middleware handles it.

## Skipping requests

```ts
app.use(rateLimit({
  limiter,
  limit: 100,
  windowMs: 60_000,
  skip: (req) => req.path === '/healthz',
}))
```

## Custom block response

```ts
app.use(rateLimit({
  limiter,
  limit: 100,
  windowMs: 60_000,
  onBlocked: (req, res, retryAfterMs) => {
    res.status(429).send(`Slow down — try again in ${Math.ceil(retryAfterMs / 1000)}s`)
  },
}))
```

## Related packages

- [`floodgate-rl`](https://www.npmjs.com/package/floodgate-rl) — the core rate limiter. `floodgate-express` requires it as a peer dependency and never talks to Redis directly; it just calls `limiter.check(...)`.
- [`floodgate-nextjs`](https://www.npmjs.com/package/floodgate-nextjs) — the equivalent adapter for Next.js App Router route handlers and edge middleware, built the same way on top of `floodgate-rl`.

## Requirements

Node.js >= 20, Express >= 4, `floodgate-rl`.

## License

MIT © [premhagargi](https://github.com/premhagargi) — see the [repository](https://github.com/premhagargi/floodgate).
