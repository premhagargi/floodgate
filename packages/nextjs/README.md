# floodgate-nextjs

Next.js middleware and route handler helpers for [FloodGate](https://github.com/premhagargi/floodgate) — wraps a [`floodgate-rl`](https://www.npmjs.com/package/floodgate-rl) `RateLimiter`, sets standard `RateLimit-*` response headers, and returns a `429` JSON response with `Retry-After` when a request is blocked. Works with App Router route handlers and Next.js `middleware.ts` (edge runtime).

## Install

```bash
npm install floodgate-nextjs floodgate-rl
```

`next` and `floodgate-rl` are peer dependencies — install both alongside `floodgate-nextjs`.

## Quick start

### App Router route handler

```ts
// app/api/search/route.ts
import type { NextRequest } from 'next/server'
import { createLimiter } from 'floodgate-rl'
import { withRateLimit } from 'floodgate-nextjs'

const limiter = createLimiter({ backend: 'memory' }) // or backend: 'redis' in Node.js runtime

async function handler(req: NextRequest) {
  return Response.json({ results: [] })
}

export const GET = withRateLimit(handler, { limiter, limit: 30, windowMs: 60_000 })
```

### `middleware.ts` (edge runtime)

```ts
// middleware.ts
import { createLimiter } from 'floodgate-rl'
import { createMiddlewareHandler } from 'floodgate-nextjs'

// Use the memory backend in middleware — ioredis does not run on the edge runtime.
const limiter = createLimiter({ backend: 'memory' })

export const middleware = createMiddlewareHandler({
  limiter,
  limit: 60,
  windowMs: 60_000,
  key: (req) => req.headers.get('x-forwarded-for') ?? 'anon',
})

export const config = { matcher: ['/api/:path*'] }
```

## Why FloodGate

- **One limiter, any surface** — build a `RateLimiter` once with `floodgate-rl` and reuse it across route handlers, middleware, Express routes, or plain server code.
- **Standard headers out of the box** — `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, and `Retry-After` on block.
- **Edge-runtime aware** — `createMiddlewareHandler` is designed for `middleware.ts`, where you should pair it with the in-memory backend (Redis clients like `ioredis` don't run on the edge runtime); use the Redis backend from route handlers, which run in the Node.js runtime.
- **Atomic, cluster-safe rate limiting under the hood** via `floodgate-rl`'s Lua-script Redis backend (or the in-memory backend for dev/test/edge).

## API

### `withRateLimit(handler, options): RouteHandler`

Wraps an App Router route handler (`GET`/`POST`/etc export). Runs the rate-limit check before your handler; if allowed, calls your handler and copies the rate-limit headers onto its response.

```ts
export const GET = withRateLimit(handler, { limiter, limit: 100, windowMs: 60_000 })
```

### `createMiddlewareHandler(options): (req: NextRequest) => Promise<NextResponse>`

Builds a handler suitable for exporting as `middleware` from `middleware.ts`. On allow, returns `NextResponse.next()` with headers set; on block, returns a `429` JSON `NextResponse`.

```ts
export const middleware = createMiddlewareHandler({ limiter, limit: 60, windowMs: 60_000 })
```

### `NextRateLimitOptions`

Shared option shape for both `withRateLimit` and `createMiddlewareHandler`:

| Option | Type | Required | Description |
|---|---|---|---|
| `limiter` | `RateLimiter` (from `floodgate-rl`) | yes | The limiter instance to call `.check()` on. |
| `limit` | `number` | yes | Max requests allowed per window. |
| `windowMs` | `number` | yes | Window size in milliseconds. |
| `key` | `(req: NextRequest) => string` | no | Identity to rate-limit by. Defaults to the first `X-Forwarded-For` entry, falling back to `X-Real-Ip`, falling back to `'unknown'`. |
| `skip` | `(req: NextRequest) => boolean \| Promise<boolean>` | no | Return `true` to bypass rate limiting for this request. `withRateLimit` calls through to the handler unmodified; `createMiddlewareHandler` returns `NextResponse.next()`. No headers are set when skipped. |

### Response headers

Set on every non-skipped, allowed request/response:

| Header | Value |
|---|---|
| `RateLimit-Limit` | `limit` |
| `RateLimit-Remaining` | `result.remaining` |
| `RateLimit-Reset` | `result.resetAt`, in seconds |
| `Retry-After` | Only set when blocked — `result.retryAfter` in seconds |

### Block response

Both helpers return a `429` with a JSON body when the limiter denies the request:

```json
{ "error": "Too Many Requests" }
```

with the headers above (including `Retry-After`) attached.

## Related packages

- [`floodgate-rl`](https://www.npmjs.com/package/floodgate-rl) — the core rate limiter. `floodgate-nextjs` requires it as a peer dependency and never talks to Redis directly; it just calls `limiter.check(...)`.
- [`floodgate-express`](https://www.npmjs.com/package/floodgate-express) — the equivalent adapter for Express, built the same way on top of `floodgate-rl`.

## Requirements

Node.js >= 20, Next.js >= 15, `floodgate-rl`.

## License

MIT © [premhagargi](https://github.com/premhagargi) — see the [repository](https://github.com/premhagargi/floodgate).
