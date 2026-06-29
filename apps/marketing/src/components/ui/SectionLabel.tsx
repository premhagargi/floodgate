interface SectionLabelProps {
  children: React.ReactNode
  color?: 'sky' | 'violet' | 'indigo'
}

const dotColor = {
  sky: 'bg-brand-sky',
  violet: 'bg-brand-violet',
  indigo: 'bg-[#6366F1]',
}

export function SectionLabel({ children, color = 'sky' }: SectionLabelProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-wire bg-canvas-card">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[color]}`} />
      <span className="text-[11px] font-mono font-medium tracking-[0.15em] uppercase text-text-secondary">
        {children}
      </span>
    </div>
  )
}
