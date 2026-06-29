'use client'

interface GradientOrbProps {
  color: 'sky' | 'violet' | 'indigo'
  size?: string
  className?: string
  animate?: boolean
}

const colorMap = {
  sky: 'bg-brand-sky',
  violet: 'bg-brand-violet',
  indigo: 'bg-[#6366F1]',
}

export function GradientOrb({ color, size = 'w-[600px] h-[600px]', className = '', animate = true }: GradientOrbProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[120px] opacity-[0.12] ${colorMap[color]} ${size} ${animate ? 'animate-float' : ''} ${className}`}
    />
  )
}
