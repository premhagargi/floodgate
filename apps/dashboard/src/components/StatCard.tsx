'use client'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  accent?: 'red' | 'green' | 'amber' | 'blue' | 'neutral'
}

const accentMap = {
  red: { dot: 'bg-accent-red', value: 'text-accent-red' },
  green: { dot: 'bg-accent-green', value: 'text-accent-green' },
  amber: { dot: 'bg-accent-amber', value: 'text-accent-amber' },
  blue: { dot: 'bg-accent-blue', value: 'text-accent-blue' },
  neutral: { dot: 'bg-ink-muted', value: 'text-ink' },
}

export function StatCard({ label, value, subtext, accent = 'neutral' }: StatCardProps) {
  const colors = accentMap[accent]
  return (
    <div className="rounded-md border border-edge bg-surface-panel p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase text-ink-muted">
          {label}
        </span>
      </div>
      <span className={`text-4xl font-mono font-semibold tabular ${colors.value}`}>
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-ink-faint font-mono">{subtext}</span>
      )}
    </div>
  )
}
