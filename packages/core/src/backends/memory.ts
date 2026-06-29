import { EventEmitter } from 'node:events'
import type { Backend, LimitOptions, LimitResult, Algorithm } from '../types.js'
import { computeSlidingWindowCount } from '../algorithms/sliding-window-counter.js'
import { consumeToken, type TokenBucketState } from '../algorithms/token-bucket.js'

interface WindowEntry {
  currentCount: number
  prevCount: number
  windowStart: number
  expiresAt: number
}

interface LogEntry {
  timestamps: number[]
  expiresAt: number
}

interface BucketEntry {
  state: TokenBucketState
  expiresAt: number
}

const GC_INTERVAL_MS = 30_000

export class MemoryBackend implements Backend {
  private windows = new Map<string, WindowEntry>()
  private logs = new Map<string, LogEntry>()
  private buckets = new Map<string, BucketEntry>()
  private gcTimer: ReturnType<typeof setInterval> | null = null
  readonly events: EventEmitter

  constructor(events: EventEmitter) {
    this.events = events
    this.gcTimer = setInterval(() => this.gc(), GC_INTERVAL_MS).unref()
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

  private checkSlidingWindowCounter(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): LimitResult {
    const windowStart = Math.floor(now / windowMs) * windowMs
    const entry = this.windows.get(key)

    let prevCount = 0
    let currentCount = 0

    if (entry) {
      if (entry.windowStart === windowStart) {
        prevCount = entry.prevCount
        currentCount = entry.currentCount
      } else if (entry.windowStart === windowStart - windowMs) {
        prevCount = entry.currentCount
        currentCount = 0
      }
    }

    currentCount += 1
    const count = computeSlidingWindowCount(prevCount, currentCount, now, windowMs)
    const allowed = count <= limit
    const remaining = Math.max(0, limit - count)
    const resetAt = windowStart + windowMs

    this.windows.set(key, {
      currentCount,
      prevCount,
      windowStart,
      expiresAt: resetAt + windowMs,
    })

    return { allowed, remaining, resetAt, retryAfter: allowed ? undefined : resetAt - now }
  }

  private checkSlidingWindowLog(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): LimitResult {
    const cutoff = now - windowMs
    const entry = this.logs.get(key) ?? { timestamps: [], expiresAt: 0 }

    const timestamps = entry.timestamps.filter(t => t > cutoff)
    timestamps.push(now)

    this.logs.set(key, { timestamps, expiresAt: now + windowMs })

    const count = timestamps.length
    const allowed = count <= limit
    const remaining = Math.max(0, limit - count)
    const oldestInWindow = timestamps[0] ?? now
    const resetAt = oldestInWindow + windowMs

    return { allowed, remaining, resetAt, retryAfter: allowed ? undefined : resetAt - now }
  }

  private checkTokenBucket(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): LimitResult {
    const entry = this.buckets.get(key)
    const state = entry?.state ?? { tokens: limit, lastRefill: now }
    const { allowed, state: next, remaining } = consumeToken(state, now, limit, windowMs)

    this.buckets.set(key, { state: next, expiresAt: now + windowMs * 2 })

    const msPerToken = windowMs / limit
    const resetAt = allowed ? now + msPerToken : now + Math.ceil((1 - next.tokens) * msPerToken)

    return { allowed, remaining, resetAt, retryAfter: allowed ? undefined : resetAt - now }
  }

  private gc() {
    const now = Date.now()
    for (const [k, v] of this.windows) if (v.expiresAt < now) this.windows.delete(k)
    for (const [k, v] of this.logs) if (v.expiresAt < now) this.logs.delete(k)
    for (const [k, v] of this.buckets) if (v.expiresAt < now) this.buckets.delete(k)
  }

  async close(): Promise<void> {
    if (this.gcTimer) {
      clearInterval(this.gcTimer)
      this.gcTimer = null
    }
  }
}
