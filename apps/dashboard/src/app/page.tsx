'use client'

import { useEffect, useRef, useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { Sparkline } from '@/components/Sparkline'
import { KeysTable } from '@/components/KeysTable'
import type { StatsSnapshot } from '@/lib/limiter'

const EMPTY: StatsSnapshot = {
  totals: { requests: 0, blocks: 0, blockRate: 0 },
  topKeys: [],
  history: [],
}

interface SimResult { sent: number; allowed: number; blocked: number }
interface SimConfig {
  count: string
  limit: string
  windowMs: string
  keys: string
}

export default function DashboardPage() {
  const [snap, setSnap] = useState<StatsSnapshot>(EMPTY)
  const [connected, setConnected] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [lastSim, setLastSim] = useState<SimResult | null>(null)
  const [config, setConfig] = useState<SimConfig>({
    count: '60',
    limit: '15',
    windowMs: '8000',
    keys: 'user:alice, user:bob, user:carol, user:dave, bot:scraper',
  })

  // SSE connection
  useEffect(() => {
    let es: EventSource
    let retry: ReturnType<typeof setTimeout>

    const connect = () => {
      es = new EventSource('/api/events')
      es.onopen = () => setConnected(true)
      es.onmessage = (e) => {
        try { setSnap(JSON.parse(e.data as string)) } catch { /* ignore */ }
      }
      es.onerror = () => {
        setConnected(false)
        es.close()
        retry = setTimeout(connect, 3000)
      }
    }

    connect()
    return () => { es?.close(); clearTimeout(retry) }
  }, [])

  const simulate = async () => {
    setSimulating(true)
    try {
      const keys = config.keys.split(',').map((k) => k.trim()).filter(Boolean)
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: Number(config.count),
          limit: Number(config.limit),
          windowMs: Number(config.windowMs),
          keys,
        }),
      })
      setLastSim(await res.json() as SimResult)
    } finally {
      setSimulating(false)
    }
  }

  const reset = async () => {
    await fetch('/api/simulate', { method: 'DELETE' })
    setLastSim(null)
    setSnap(EMPTY)
  }

  const { totals, topKeys, history } = snap
  const blockRateAccent =
    totals.blockRate > 0.3 ? 'red' : totals.blockRate > 0.1 ? 'amber' : 'green'

  return (
    <div className="min-h-screen bg-surface-base text-ink">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-edge bg-surface-base/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Wordmark — Payload-style large mono caps */}
            <span className="text-accent-red font-mono font-bold text-lg tracking-[0.2em] select-none">
              FLOODGATE
            </span>
            <span className="hidden sm:block text-edge-strong border-l border-edge pl-4 text-xs font-mono text-ink-muted tracking-widest uppercase">
              dashboard
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                  connected ? 'bg-accent-green animate-pulse' : 'bg-accent-red'
                }`}
              />
              <span className="text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                {connected ? 'live' : 'offline'}
              </span>
            </div>
            <button
              onClick={reset}
              className="text-[10px] font-mono tracking-widest uppercase text-ink-faint hover:text-ink-muted transition-colors border border-edge px-3 py-1.5 rounded hover:border-edge-strong"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Stat Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Requests"
            value={totals.requests.toLocaleString()}
            accent="neutral"
          />
          <StatCard
            label="Total Blocks"
            value={totals.blocks.toLocaleString()}
            accent={totals.blocks > 0 ? 'red' : 'neutral'}
          />
          <StatCard
            label="Block Rate"
            value={`${(totals.blockRate * 100).toFixed(1)}%`}
            subtext={`${totals.blocks.toLocaleString()} of ${totals.requests.toLocaleString()} requests blocked`}
            accent={blockRateAccent}
          />
        </section>

        {/* ── Block Rate Chart ── */}
        <section className="rounded-md border border-edge bg-surface-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" />
              <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase text-ink-muted">
                Block Rate — last 60s
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-faint">1-second buckets</span>
          </div>
          <Sparkline data={history} height={80} />
        </section>

        {/* ── Simulation Controls ── */}
        <section className="rounded-md border border-edge bg-surface-panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase text-ink-muted">
              Traffic Simulation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Requests', key: 'count', placeholder: '60' },
              { label: 'Limit / key', key: 'limit', placeholder: '15' },
              { label: 'Window (ms)', key: 'windowMs', placeholder: '8000' },
            ].map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase text-ink-faint">
                  {f.label}
                </span>
                <input
                  type="number"
                  value={config[f.key as keyof SimConfig]}
                  onChange={(e) => setConfig((c) => ({ ...c, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="bg-surface-elevated border border-edge rounded px-3 py-2 text-xs font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-accent-blue w-full"
                />
              </label>
            ))}

            <label className="flex flex-col gap-1.5 sm:col-span-1">
              <span className="text-[9px] font-mono tracking-widest uppercase text-ink-faint">
                Keys (comma-sep)
              </span>
              <input
                type="text"
                value={config.keys}
                onChange={(e) => setConfig((c) => ({ ...c, keys: e.target.value }))}
                className="bg-surface-elevated border border-edge rounded px-3 py-2 text-xs font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-accent-blue w-full"
              />
            </label>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => { void simulate() }}
              disabled={simulating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-accent-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-mono font-semibold transition-colors duration-150"
            >
              {simulating ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating…
                </>
              ) : (
                'Run Simulation'
              )}
            </button>

            {lastSim && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-ink-muted">{lastSim.sent} sent</span>
                <span className="text-accent-green">{lastSim.allowed} allowed</span>
                <span className="text-accent-red">{lastSim.blocked} blocked</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Keys Table ── */}
        <section className="rounded-md border border-edge bg-surface-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" />
              <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase text-ink-muted">
                Top Keys
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-faint">
              {topKeys.length} {topKeys.length === 1 ? 'key' : 'keys'}
            </span>
          </div>
          <KeysTable keys={topKeys} />
        </section>

        {/* ── Footer ── */}
        <footer className="pt-4 pb-8 flex items-center justify-between text-[10px] font-mono text-ink-faint">
          <span>floodgate-rl — distributed rate limiting</span>
          <a
            href="https://github.com/mohammedaamir5584/floodgate"
            className="hover:text-ink-muted transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </footer>
      </main>
    </div>
  )
}
