'use client'

import type { KeyEntry } from '@/lib/limiter'

interface KeysTableProps {
  keys: KeyEntry[]
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 3) return 'now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

function BlockRateBadge({ rate }: { rate: number }) {
  const pct = (rate * 100).toFixed(1)
  if (rate > 0.5)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-accent-red/15 text-accent-red border border-accent-red/20">
        {pct}%
      </span>
    )
  if (rate > 0.1)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-accent-amber/15 text-accent-amber border border-accent-amber/20">
        {pct}%
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-accent-green/10 text-accent-green border border-accent-green/15">
      {pct}%
    </span>
  )
}

export function KeysTable({ keys }: KeysTableProps) {
  if (keys.length === 0) {
    return (
      <div className="py-12 text-center text-ink-faint text-sm font-mono border border-dashed border-edge rounded-md">
        no keys yet — run a simulation
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-edge">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-edge bg-surface-elevated">
            {['key', 'requests', 'blocks', 'block rate', 'last seen'].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[10px] font-mono font-medium tracking-[0.12em] uppercase text-ink-muted whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-edge">
          {keys.map((k) => {
            const blockRate = k.requests > 0 ? k.blocks / k.requests : 0
            return (
              <tr key={k.key} className="hover:bg-surface-hover transition-colors duration-100">
                <td className="px-4 py-3 font-mono text-ink text-xs">{k.key}</td>
                <td className="px-4 py-3 font-mono text-ink tabular text-right text-xs">
                  {k.requests.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono tabular text-right text-xs">
                  <span className={k.blocks > 0 ? 'text-accent-red' : 'text-ink-muted'}>
                    {k.blocks.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <BlockRateBadge rate={blockRate} />
                </td>
                <td className="px-4 py-3 font-mono text-ink-muted text-xs tabular">
                  {timeAgo(k.lastSeen)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
