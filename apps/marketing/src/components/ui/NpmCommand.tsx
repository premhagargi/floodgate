'use client'

import { useState } from 'react'

interface NpmCommandProps {
  command?: string
  size?: 'sm' | 'md' | 'lg'
}

export function NpmCommand({ command = 'npm install floodgate-rl', size = 'md' }: NpmCommandProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs gap-2 sm:px-4 sm:py-2.5 sm:text-sm sm:gap-3',
    md: 'px-3.5 py-2.5 text-xs gap-2 sm:px-5 sm:py-3.5 sm:text-base sm:gap-4',
    lg: 'px-4 py-2.5 text-xs gap-2 sm:px-6 sm:py-4 sm:text-lg sm:gap-5',
  }

  return (
    <button
      onClick={copy}
      className={`group inline-flex items-center max-w-full ${sizeClasses[size]} rounded-lg border border-wire bg-canvas-card hover:border-wire-bright transition-all duration-200 hover:glow-sky cursor-pointer select-none`}
      title="Click to copy"
    >
      {/* Terminal prompt */}
      <span className="text-brand-sky font-mono font-medium select-none shrink-0">$</span>
      <span className="font-mono text-text-DEFAULT tracking-wide truncate">{command}</span>
      {/* Copy icon / checkmark */}
      <span className="ml-auto pl-3 border-l border-wire text-text-muted group-hover:text-text-secondary transition-colors shrink-0">
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-sky">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  )
}
