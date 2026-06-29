'use client'

import { motion } from 'framer-motion'
import { GradientOrb } from '@/components/ui/GradientOrb'
import { NpmCommand } from '@/components/ui/NpmCommand'

const badges = [
  { label: '3 algorithms', icon: '⚡' },
  { label: 'Redis Cluster', icon: '◈' },
  { label: 'Atomic Lua', icon: '◎' },
  { label: 'TypeScript', icon: '◷' },
  { label: 'Express + Next.js', icon: '⬡' },
]

const ease = [0.25, 0.1, 0.25, 1] as const

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background layer */}
      <div className="absolute inset-0 bg-grid-dots bg-grid-32 opacity-40" aria-hidden />
      <GradientOrb color="sky" size="w-[700px] h-[700px]" className="-top-64 -left-64" />
      <GradientOrb color="violet" size="w-[600px] h-[600px]" className="-bottom-32 -right-48" animate={false} />
      <GradientOrb color="indigo" size="w-[400px] h-[400px]" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" animate={false} />

      {/* Radial glow behind text */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-sky/25 bg-brand-sky/5 text-brand-sky text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse-slow" />
            Open Source · MIT License
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight"
        >
          <span className="text-gradient-brand">Rate limiting</span>
          <br />
          <span className="text-gradient-full">that never blinks.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed"
        >
          Production-grade distributed rate limiting for Node.js.{' '}
          <span className="text-text-DEFAULT">Atomic Lua scripts</span>,{' '}
          <span className="text-text-DEFAULT">Redis Cluster-safe</span>, three battle-tested algorithms.
          Express and Next.js adapters included.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <NpmCommand size="lg" />
          <a
            href="https://github.com/premhagargi/floodgate"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-wire bg-canvas-card hover:bg-canvas-elevated text-text-DEFAULT text-base font-medium transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="flex flex-wrap justify-center gap-2"
        >
          {badges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-wire bg-canvas-surface text-text-secondary text-xs font-mono"
            >
              <span className="text-text-muted">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #04050A, transparent)',
        }}
      />
    </section>
  )
}
