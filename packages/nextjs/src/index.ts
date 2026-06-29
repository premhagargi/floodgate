import { NextResponse } from 'next/server.js'
import type { NextRequest } from 'next/server.js'
import type { RateLimiter } from 'floodgate-rl'

export interface NextRateLimitOptions {
  limiter: RateLimiter
  limit: number
  windowMs: number
  key?: (req: NextRequest) => string
}

// Wraps a Next.js App Router route handler with rate limiting.
// Usage: export const GET = withRateLimit(handler, { limiter, limit: 100, windowMs: 60_000 })
export function withRateLimit(
  handler: (req: NextRequest, ctx?: unknown) => Promise<Response> | Response,
  options: NextRateLimitOptions,
) {
  const { limiter, limit, windowMs, key = defaultKey } = options

  return async (req: NextRequest, ctx?: unknown): Promise<Response> => {
    const result = await limiter.check({ key: key(req), limit, windowMs })

    const headers: Record<string, string> = {
      'RateLimit-Limit': String(limit),
      'RateLimit-Remaining': String(result.remaining),
      'RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    }

    if (!result.allowed) {
      const retryAfter = result.retryAfter ?? 0
      headers['Retry-After'] = String(Math.ceil(retryAfter / 1000))
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers })
    }

    const response = await handler(req, ctx)
    const patched = new Response(response.body, response)
    Object.entries(headers).forEach(([k, v]) => patched.headers.set(k, v))
    return patched
  }
}

// For use in Next.js middleware.ts (edge runtime — use only MemoryBackend here).
export function createMiddlewareHandler(options: NextRateLimitOptions) {
  const { limiter, limit, windowMs, key = defaultKey } = options

  return async (req: NextRequest): Promise<NextResponse> => {
    const result = await limiter.check({ key: key(req), limit, windowMs })
    const res = NextResponse.next()

    res.headers.set('RateLimit-Limit', String(limit))
    res.headers.set('RateLimit-Remaining', String(result.remaining))
    res.headers.set('RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))

    if (!result.allowed) {
      const retryAfter = result.retryAfter ?? 0
      res.headers.set('Retry-After', String(Math.ceil(retryAfter / 1000)))
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
    }

    return res
  }
}

function defaultKey(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
