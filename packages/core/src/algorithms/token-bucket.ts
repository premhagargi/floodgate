export interface TokenBucketState {
  tokens: number
  lastRefill: number
}

export function refillTokens(
  state: TokenBucketState,
  now: number,
  limit: number,
  windowMs: number,
): TokenBucketState {
  const refillRate = limit / windowMs
  const elapsed = now - state.lastRefill
  const newTokens = Math.min(limit, state.tokens + elapsed * refillRate)
  return { tokens: newTokens, lastRefill: now }
}

export function consumeToken(
  state: TokenBucketState,
  now: number,
  limit: number,
  windowMs: number,
): { allowed: boolean; state: TokenBucketState; remaining: number } {
  const refilled = refillTokens(state, now, limit, windowMs)
  if (refilled.tokens < 1) {
    return { allowed: false, state: refilled, remaining: 0 }
  }
  const next = { ...refilled, tokens: refilled.tokens - 1 }
  return { allowed: true, state: next, remaining: Math.floor(next.tokens) }
}
