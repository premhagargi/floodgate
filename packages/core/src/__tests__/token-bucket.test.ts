import { describe, it, expect } from 'vitest'
import { refillTokens, consumeToken } from '../algorithms/token-bucket.js'

describe('refillTokens', () => {
  it('adds tokens proportional to elapsed time', () => {
    const state = { tokens: 0, lastRefill: 0 }
    // limit=10, window=1000ms, rate=0.01 tokens/ms
    // after 500ms → 0 + 500*0.01 = 5 tokens
    const next = refillTokens(state, 500, 10, 1000)
    expect(next.tokens).toBeCloseTo(5)
    expect(next.lastRefill).toBe(500)
  })

  it('caps tokens at limit', () => {
    const state = { tokens: 9, lastRefill: 0 }
    const next = refillTokens(state, 10_000, 10, 1000)
    expect(next.tokens).toBe(10)
  })

  it('does not add tokens with zero elapsed time', () => {
    const state = { tokens: 5, lastRefill: 1000 }
    const next = refillTokens(state, 1000, 10, 1000)
    expect(next.tokens).toBe(5)
  })
})

describe('consumeToken', () => {
  it('allows and decrements when tokens available', () => {
    const state = { tokens: 5, lastRefill: 0 }
    const { allowed, remaining } = consumeToken(state, 0, 10, 1000)
    expect(allowed).toBe(true)
    expect(remaining).toBe(4)
  })

  it('denies when no tokens available', () => {
    const state = { tokens: 0.5, lastRefill: 0 }
    const { allowed, remaining } = consumeToken(state, 0, 10, 1000)
    expect(allowed).toBe(false)
    expect(remaining).toBe(0)
  })

  it('starts full bucket on first request', () => {
    const state = { tokens: 10, lastRefill: 0 }
    const { allowed, remaining } = consumeToken(state, 0, 10, 1000)
    expect(allowed).toBe(true)
    expect(remaining).toBe(9)
  })
})
