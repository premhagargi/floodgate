import type { Request, Response, NextFunction } from 'express'
import type { LimitResult, RateLimiter } from 'floodgate-rl'

export interface ExpressRateLimitOptions {
  limiter: RateLimiter
  limit: number
  windowMs: number
  key?: (req: Request) => string
  /** Return true to skip rate limiting for this request (e.g. health checks, internal IPs). */
  skip?: (req: Request) => boolean | Promise<boolean>
  onBlocked?: (req: Request, res: Response, retryAfterMs: number) => void
  onAllowed?: (req: Request, res: Response, result: LimitResult) => void
}

export function rateLimit(options: ExpressRateLimitOptions) {
  const { limiter, limit, windowMs, key = defaultKey, skip, onBlocked = defaultBlocked, onAllowed } = options

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (skip && (await skip(req))) return next()

      const result = await limiter.check({ key: key(req), limit, windowMs })

      res.setHeader('RateLimit-Limit', limit)
      res.setHeader('RateLimit-Remaining', result.remaining)
      res.setHeader('RateLimit-Reset', Math.ceil(result.resetAt / 1000))

      if (!result.allowed) {
        const retryAfter = result.retryAfter ?? 0
        res.setHeader('Retry-After', Math.ceil(retryAfter / 1000))
        onBlocked(req, res, retryAfter)
        return
      }

      onAllowed?.(req, res, result)
      next()
    } catch (err) {
      next(err)
    }
  }
}

function defaultKey(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]
  return ip ?? req.socket.remoteAddress ?? 'unknown'
}

function defaultBlocked(_req: Request, res: Response, retryAfterMs: number): void {
  res.status(429).json({
    error: 'Too Many Requests',
    retryAfter: Math.ceil(retryAfterMs / 1000),
  })
}
