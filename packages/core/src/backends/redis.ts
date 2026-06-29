import type { Backend, LimitOptions, LimitResult, Algorithm, RedisClient } from '../types.js'
import { SLIDING_WINDOW_COUNTER } from '../lua/sliding-window-counter.js'
import { SLIDING_WINDOW_LOG } from '../lua/sliding-window-log.js'
import { TOKEN_BUCKET } from '../lua/token-bucket.js'

const LUA: Record<Algorithm, string> = {
  'sliding-window-counter': SLIDING_WINDOW_COUNTER,
  'sliding-window-log': SLIDING_WINDOW_LOG,
  'token-bucket': TOKEN_BUCKET,
}

export class RedisBackend implements Backend {
  private shas = new Map<Algorithm, string>()

  constructor(private readonly redis: RedisClient) {}

  // Load all three scripts eagerly; per-request NOSCRIPT retry is the safety net.
  async loadScripts(): Promise<void> {
    await Promise.all(
      (Object.keys(LUA) as Algorithm[]).map(async (alg) => {
        const sha = (await this.redis.script('LOAD', LUA[alg])) as string
        this.shas.set(alg, sha)
      }),
    )
  }

  // EVALSHA with NOSCRIPT retry (handles Redis restart / SCRIPT FLUSH).
  private async evalsha(
    alg: Algorithm,
    keys: string[],
    args: Array<string | number>,
  ): Promise<[number, number, number, number]> {
    const script = LUA[alg]

    const loadAndEval = async (): Promise<[number, number, number, number]> => {
      const sha = (await this.redis.script('LOAD', script)) as string
      this.shas.set(alg, sha)
      return this.redis.evalsha(sha, keys.length, ...keys, ...args.map(String)) as Promise<
        [number, number, number, number]
      >
    }

    const sha = this.shas.get(alg)
    if (!sha) return loadAndEval()

    try {
      return (await this.redis.evalsha(
        sha,
        keys.length,
        ...keys,
        ...args.map(String),
      )) as [number, number, number, number]
    } catch (err) {
      // NOSCRIPT means the script cache was flushed (Redis restart or SCRIPT FLUSH)
      if (err instanceof Error && err.message.startsWith('NOSCRIPT')) {
        return loadAndEval()
      }
      throw err
    }
  }

  async check(options: LimitOptions, algorithm: Algorithm): Promise<LimitResult> {
    const { key, limit, windowMs } = options
    const now = Date.now()

    switch (algorithm) {
      case 'sliding-window-counter':
        return this.checkSlidingWindowCounter(key, limit, windowMs, now)
      case 'sliding-window-log':
        return this.checkSlidingWindowLog(key, limit, windowMs, now)
      case 'token-bucket':
        return this.checkTokenBucket(key, limit, windowMs, now)
    }
  }

  private async checkSlidingWindowCounter(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): Promise<LimitResult> {
    const windowStart = Math.floor(now / windowMs) * windowMs
    const tag = `{${key}}`
    const curKey = `${tag}:sw:${windowStart}`
    const prevKey = `${tag}:sw:${windowStart - windowMs}`

    const [allowed, remaining, resetAt, retryAfter] = await this.evalsha(
      'sliding-window-counter',
      [curKey, prevKey],
      [limit, windowMs, now, windowStart, windowMs * 2],
    )
    return { allowed: allowed === 1, remaining, resetAt, retryAfter: retryAfter > 0 ? retryAfter : undefined }
  }

  private async checkSlidingWindowLog(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): Promise<LimitResult> {
    const logKey = `{${key}}:log`
    const cutoff = now - windowMs
    const nonce = Math.random().toString(36).slice(2, 9)

    const [allowed, remaining, resetAt, retryAfter] = await this.evalsha(
      'sliding-window-log',
      [logKey],
      [limit, now, windowMs, cutoff, nonce],
    )
    return { allowed: allowed === 1, remaining, resetAt, retryAfter: retryAfter > 0 ? retryAfter : undefined }
  }

  private async checkTokenBucket(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): Promise<LimitResult> {
    const bucketKey = `{${key}}:tb`

    const [allowed, remaining, resetAt, retryAfter] = await this.evalsha(
      'token-bucket',
      [bucketKey],
      [limit, windowMs, now],
    )
    return { allowed: allowed === 1, remaining, resetAt, retryAfter: retryAfter > 0 ? retryAfter : undefined }
  }

  async close(): Promise<void> {
    await this.redis.quit()
  }
}
