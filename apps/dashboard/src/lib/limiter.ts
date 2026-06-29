import { createLimiter } from 'floodgate-rl'

export interface KeyEntry {
  key: string
  requests: number
  blocks: number
  remaining: number
  lastSeen: number
}

export interface BlockRatePoint {
  ts: number
  rate: number
}

export interface StatsSnapshot {
  totals: { requests: number; blocks: number; blockRate: number }
  topKeys: KeyEntry[]
  history: BlockRatePoint[]
}

class StatsCollector {
  private keyMap = new Map<string, KeyEntry>()
  private history: BlockRatePoint[] = []
  private wChecks = 0
  private wBlocks = 0
  private wStart = Date.now()
  private readonly WINDOW_MS = 1000
  private readonly MAX_HISTORY = 60

  record(key: string, allowed: boolean, remaining: number): void {
    const now = Date.now()
    const e = this.keyMap.get(key) ?? { key, requests: 0, blocks: 0, remaining: 0, lastSeen: 0 }
    e.requests++
    e.remaining = remaining
    e.lastSeen = now
    if (!allowed) e.blocks++
    this.keyMap.set(key, e)

    this.wChecks++
    if (!allowed) this.wBlocks++

    if (now - this.wStart >= this.WINDOW_MS) {
      const rate = this.wChecks > 0 ? this.wBlocks / this.wChecks : 0
      this.history.push({ ts: this.wStart, rate })
      if (this.history.length > this.MAX_HISTORY) this.history.shift()
      this.wChecks = 0
      this.wBlocks = 0
      this.wStart = now
    }
  }

  snapshot(): StatsSnapshot {
    let requests = 0
    let blocks = 0
    for (const e of this.keyMap.values()) {
      requests += e.requests
      blocks += e.blocks
    }
    return {
      totals: { requests, blocks, blockRate: requests > 0 ? blocks / requests : 0 },
      topKeys: [...this.keyMap.values()].sort((a, b) => b.requests - a.requests).slice(0, 20),
      history: [...this.history],
    }
  }

  reset(): void {
    this.keyMap.clear()
    this.history = []
    this.wChecks = 0
    this.wBlocks = 0
    this.wStart = Date.now()
  }
}

export const stats = new StatsCollector()

export const limiter = createLimiter({ backend: 'memory', algorithm: 'sliding-window-counter' })

limiter.on('check', (key, result) => {
  stats.record(key, result.allowed, result.remaining)
})
