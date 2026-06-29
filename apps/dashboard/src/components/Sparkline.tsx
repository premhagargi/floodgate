'use client'

interface Point { ts: number; rate: number }

interface SparklineProps {
  data: Point[]
  height?: number
}

export function Sparkline({ data, height = 72 }: SparklineProps) {
  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-ink-faint text-xs font-mono border border-dashed border-edge rounded"
        style={{ height }}
      >
        no data — run a simulation to populate the chart
      </div>
    )
  }

  const W = 900
  const PAD = 4
  const H = height - PAD * 2
  const rates = data.map((d) => d.rate)
  const maxRate = Math.max(...rates, 0.001)

  const points = rates
    .map((r, i) => {
      const x = (i / (rates.length - 1)) * W
      const y = PAD + H - (r / maxRate) * H
      return `${x},${y}`
    })
    .join(' ')

  const fill = `0,${height} ${points} ${W},${height}`
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length
  const stroke = avg > 0.3 ? '#E5383B' : avg > 0.1 ? '#F59E0B' : '#22C55E'

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        aria-label="Block rate over time"
      >
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Zero baseline */}
        <line x1="0" y1={height - PAD} x2={W} y2={height - PAD} stroke="#1C1F30" strokeWidth="1" />
        {/* Fill */}
        <polygon points={fill} fill="url(#sg)" />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Latest value dot */}
        {(() => {
          const last = rates[rates.length - 1]
          const x = W
          const y = PAD + H - (last / maxRate) * H
          return <circle cx={x} cy={y} r="3.5" fill={stroke} />
        })()}
      </svg>
      {/* Y-axis labels */}
      <div className="absolute top-0 right-0 flex flex-col justify-between h-full text-right pointer-events-none pr-1 py-1">
        <span className="text-[9px] font-mono text-ink-faint">{(maxRate * 100).toFixed(0)}%</span>
        <span className="text-[9px] font-mono text-ink-faint">0%</span>
      </div>
    </div>
  )
}
