import { describe, it, expect, beforeEach } from 'vitest'
import { EventEmitter } from 'node:events'
import { MemoryBackend } from '../backends/memory.js'

function makeBackend() {
  return new MemoryBackend(new EventEmitter())
}

describe('MemoryBackend — sliding-window-counter', () => {
  let backend: MemoryBackend

  beforeEach(() => { backend = makeBackend() })

  it('allows requests under the limit', async () => {
    const result = await backend.check(
      { key: 'user:1', limit: 5, windowMs: 60_000 },
      'sliding-window-counter',
    )
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks the request that exceeds the limit', async () => {
    const opts = { key: 'user:2', limit: 3, windowMs: 60_000 }
    for (let i = 0; i < 3; i++) {
      await backend.check(opts, 'sliding-window-counter')
    }
    const result = await backend.check(opts, 'sliding-window-counter')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('allows again after two windows have elapsed', async () => {
    // Sliding window counter carries ~weight of prevCount into the next window,
    // so it does NOT fully clear after exactly one windowMs.
    // With prevCount=3, limit=2: the carry only drops below 1 when elapsed > windowMs/3.
    // Waiting 2×windowMs guarantees the second-to-last window has 0 requests.
    const windowMs = 100
    const opts = { key: 'user:3', limit: 2, windowMs }
    await backend.check(opts, 'sliding-window-counter')
    await backend.check(opts, 'sliding-window-counter')
    const blocked = await backend.check(opts, 'sliding-window-counter')
    expect(blocked.allowed).toBe(false)

    await new Promise(r => setTimeout(r, windowMs * 2 + 20))
    const result = await backend.check(opts, 'sliding-window-counter')
    expect(result.allowed).toBe(true)
  })
})

describe('MemoryBackend — sliding-window-log', () => {
  let backend: MemoryBackend

  beforeEach(() => { backend = makeBackend() })

  it('allows requests under the limit', async () => {
    const result = await backend.check(
      { key: 'log:1', limit: 5, windowMs: 60_000 },
      'sliding-window-log',
    )
    expect(result.allowed).toBe(true)
  })

  it('blocks exactly at limit+1', async () => {
    const opts = { key: 'log:2', limit: 3, windowMs: 60_000 }
    for (let i = 0; i < 3; i++) await backend.check(opts, 'sliding-window-log')
    const result = await backend.check(opts, 'sliding-window-log')
    expect(result.allowed).toBe(false)
  })
})

describe('MemoryBackend — token-bucket', () => {
  let backend: MemoryBackend

  beforeEach(() => { backend = makeBackend() })

  it('allows burst up to limit', async () => {
    const opts = { key: 'bucket:1', limit: 5, windowMs: 60_000 }
    for (let i = 0; i < 5; i++) {
      const r = await backend.check(opts, 'token-bucket')
      expect(r.allowed).toBe(true)
    }
  })

  it('blocks when bucket is empty', async () => {
    const opts = { key: 'bucket:2', limit: 2, windowMs: 60_000 }
    await backend.check(opts, 'token-bucket')
    await backend.check(opts, 'token-bucket')
    const result = await backend.check(opts, 'token-bucket')
    expect(result.allowed).toBe(false)
  })
})

describe('RateLimiter events', () => {
  it('emits check and blocked events', async () => {
    const { createLimiter } = await import('../index.js')
    const limiter = createLimiter({ backend: 'memory', algorithm: 'sliding-window-counter' })

    const checks: string[] = []
    const blocks: string[] = []
    limiter.on('check', (key) => checks.push(key))
    limiter.on('blocked', (key) => blocks.push(key))

    const opts = { key: 'evt:1', limit: 1, windowMs: 60_000 }
    await limiter.check(opts)
    await limiter.check(opts)

    expect(checks).toHaveLength(2)
    expect(blocks).toHaveLength(1)
    await limiter.close()
  })
})
