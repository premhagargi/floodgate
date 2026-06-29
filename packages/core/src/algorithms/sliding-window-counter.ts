export interface SlidingWindowState {
  currentCount: number
  prevCount: number
  windowStart: number
  windowMs: number
}

export function computeSlidingWindowCount(
  prevCount: number,
  currentCount: number,
  now: number,
  windowMs: number,
): number {
  const elapsed = now % windowMs
  const weight = 1 - elapsed / windowMs
  return Math.floor(prevCount * weight) + currentCount
}

export function isAllowed(
  prevCount: number,
  currentCount: number,
  now: number,
  windowMs: number,
  limit: number,
): { allowed: boolean; count: number } {
  const count = computeSlidingWindowCount(prevCount, currentCount, now, windowMs)
  return { allowed: count <= limit, count }
}
