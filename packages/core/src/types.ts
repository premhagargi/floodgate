export type Algorithm =
  | 'sliding-window-counter'
  | 'sliding-window-log'
  | 'token-bucket'

export interface LimitOptions {
  key: string
  limit: number
  windowMs: number
}

export interface LimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

export interface Backend {
  check(options: LimitOptions, algorithm: Algorithm): Promise<LimitResult>
  close?(): Promise<void>
}

// Minimal Redis interface — compatible with ioredis v5.
// Pass an ioredis instance: const client = new Redis(); createLimiter({ backend: 'redis', redisClient: client })
export interface RedisClient {
  evalsha(sha: string, numkeys: number, ...args: Array<string | number>): Promise<unknown>
  script(subcommand: 'LOAD', script: string): Promise<unknown>
  quit(): Promise<unknown>
}

export interface RateLimiterOptions {
  backend: 'redis' | 'memory'
  algorithm?: Algorithm
  fallback?: 'memory'
  redisClient?: RedisClient
  /** Prepended to every key: `${keyPrefix}:${key}`. Use to namespace a shared Redis instance. */
  keyPrefix?: string
}

export type RateLimiterEvents = {
  'check': [key: string, result: LimitResult]
  'blocked': [key: string, result: LimitResult]
  'redis:error': [error: Error]
  'redis:fallback': [error: Error]
}
