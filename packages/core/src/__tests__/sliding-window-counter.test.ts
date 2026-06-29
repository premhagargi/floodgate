import { describe, it, expect } from 'vitest'
import {
  computeSlidingWindowCount,
  isAllowed,
} from '../algorithms/sliding-window-counter.js'

describe('computeSlidingWindowCount', () => {
  const windowMs = 60_000 // 1 minute

  it('fully weights prevCount at the start of a window (elapsed=0 → weight=1)', () => {
    // now=60000, elapsed = 60000 % 60000 = 0, weight = 1.0
    // count = floor(10 * 1.0) + 5 = 15
    const now = 60_000
    expect(computeSlidingWindowCount(10, 5, now, windowMs)).toBe(15)
  })

  it('weights prevCount by remaining fraction', () => {
    // 30s into a 60s window → weight = 0.5
    const now = 90_000
    const count = computeSlidingWindowCount(10, 5, now, windowMs)
    // floor(10 * 0.5) + 5 = 10
    expect(count).toBe(10)
  })

  it('nearly fully weights prevCount 1ms into window', () => {
    // 1ms into window → weight = 1 - 1/60000 ≈ 0.99998
    // floor(10 * 0.99998) = floor(9.9998) = 9, + 1 = 10
    const now = 60_001
    const count = computeSlidingWindowCount(10, 1, now, windowMs)
    expect(count).toBe(10)
  })

  it('ignores prevCount near window end', () => {
    // 59s into window → weight ≈ 0.016
    const now = 119_000
    const count = computeSlidingWindowCount(100, 1, now, windowMs)
    // floor(100 * 0.016) + 1 = 1 + 1 = 2
    expect(count).toBe(2)
  })
})

describe('isAllowed', () => {
  const windowMs = 60_000

  it('allows when count is under limit', () => {
    const now = 90_000
    const { allowed, count } = isAllowed(0, 5, now, windowMs, 100)
    expect(allowed).toBe(true)
    expect(count).toBe(5)
  })

  it('allows when count exactly equals limit (100th request is still within limit)', () => {
    const now = 60_000
    const { allowed } = isAllowed(0, 100, now, windowMs, 100)
    expect(allowed).toBe(true)
  })

  it('denies when count exceeds limit by 1', () => {
    const now = 60_000
    const { allowed } = isAllowed(0, 101, now, windowMs, 100)
    expect(allowed).toBe(false)
  })

  it('denies when weighted count exceeds limit', () => {
    // 30s in, prevCount=100, currentCount=60, limit=100
    // count = floor(100 * 0.5) + 60 = 50 + 60 = 110 → denied
    const now = 90_000
    const { allowed, count } = isAllowed(100, 60, now, windowMs, 100)
    expect(allowed).toBe(false)
    expect(count).toBe(110)
  })
})
