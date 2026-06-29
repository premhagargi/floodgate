import { EventEmitter } from 'node:events'
import { MemoryBackend } from './backends/memory.js'
import { RedisBackend } from './backends/redis.js'
import type {
  Algorithm,
  Backend,
  LimitOptions,
  LimitResult,
  RedisClient,
  RateLimiterEvents,
  RateLimiterOptions,
} from './types.js'

export type { Algorithm, Backend, LimitOptions, LimitResult, RedisClient, RateLimiterOptions }
export { RedisBackend }

export class RateLimiter extends EventEmitter {
  private primary: Backend
  private fallback: Backend | null = null
  private algorithm: Algorithm

  constructor(primary: Backend, options: { algorithm?: Algorithm; fallback?: Backend } = {}) {
    super()
    this.primary = primary
    this.algorithm = options.algorithm ?? 'sliding-window-counter'
    this.fallback = options.fallback ?? null
  }

  async check(options: LimitOptions): Promise<LimitResult> {
    try {
      const result = await this.primary.check(options, this.algorithm)
      this.emit('check', options.key, result)
      if (!result.allowed) this.emit('blocked', options.key, result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))

      if (this.fallback) {
        this.emit('redis:error', error)
        this.emit('redis:fallback', error)
        const result = await this.fallback.check(options, this.algorithm)
        this.emit('check', options.key, result)
        if (!result.allowed) this.emit('blocked', options.key, result)
        return result
      }

      throw error
    }
  }

  async close(): Promise<void> {
    await this.primary.close?.()
    await this.fallback?.close?.()
  }

  emit<K extends keyof RateLimiterEvents>(event: K, ...args: RateLimiterEvents[K]): boolean {
    return super.emit(event, ...args)
  }

  on<K extends keyof RateLimiterEvents>(
    event: K,
    listener: (...args: RateLimiterEvents[K]) => void,
  ): this {
    return super.on(event, listener as (...args: unknown[]) => void)
  }

  off<K extends keyof RateLimiterEvents>(
    event: K,
    listener: (...args: RateLimiterEvents[K]) => void,
  ): this {
    return super.off(event, listener as (...args: unknown[]) => void)
  }

  once<K extends keyof RateLimiterEvents>(
    event: K,
    listener: (...args: RateLimiterEvents[K]) => void,
  ): this {
    return super.once(event, listener as (...args: unknown[]) => void)
  }
}

export function createLimiter(options: RateLimiterOptions): RateLimiter {
  const fallbackBackend =
    options.fallback === 'memory' ? new MemoryBackend(new EventEmitter()) : undefined

  if (options.backend === 'memory') {
    const backend = new MemoryBackend(new EventEmitter())
    return new RateLimiter(backend, { algorithm: options.algorithm })
  }

  if (options.backend === 'redis') {
    if (!options.redisClient) {
      throw new Error(
        'Pass a redisClient when backend is "redis".\n' +
          'Example: import Redis from "ioredis"; createLimiter({ backend: "redis", redisClient: new Redis() })',
      )
    }
    const backend = new RedisBackend(options.redisClient)
    // Load scripts eagerly for performance; per-request NOSCRIPT retry is the safety net.
    void backend.loadScripts()
    return new RateLimiter(backend, { algorithm: options.algorithm, fallback: fallbackBackend })
  }

  throw new Error(`Unknown backend: ${String(options.backend)}`)
}
