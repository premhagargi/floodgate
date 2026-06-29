'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-brand-sky',
    bg: 'bg-brand-sky/8',
    border: 'border-brand-sky/20',
    title: 'Atomic Lua Scripts',
    body: 'All state mutations happen in a single EVALSHA call — one Redis round-trip, zero race conditions between INCR and EXPIRE.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="12" cy="19" r="2" />
        <path d="M7 12h10M12 7v10" strokeLinecap="round" />
      </svg>
    ),
    color: 'text-brand-violet',
    bg: 'bg-brand-violet/8',
    border: 'border-brand-violet/20',
    title: 'Redis Cluster Safe',
    body: 'Hash-tagged keys keep both window slots on the same slot. {user:42}:sw:... — the cluster router never splits a Lua script across nodes.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-[#6366F1]',
    bg: 'bg-[#6366F1]/8',
    border: 'border-[#6366F1]/20',
    title: 'NOSCRIPT Recovery',
    body: 'When Redis restarts and flushes the script cache, FloodGate catches NOSCRIPT, re-loads via SCRIPT LOAD, and retries — completely transparent to callers.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 18l2 2 4-4M6 2v20M2 18h8M2 6h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-sky-400',
    bg: 'bg-sky-500/8',
    border: 'border-sky-500/20',
    title: 'TypeScript First',
    body: 'Strict mode throughout. Typed EventEmitter with discriminated unions for check, blocked, redis:error, and redis:fallback events.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: 'text-purple-400',
    bg: 'bg-purple-500/8',
    border: 'border-purple-500/20',
    title: 'Express & Next.js',
    body: 'Drop-in middleware for Express with RateLimit-* headers. App Router handler wrapper and Next.js middleware.ts helper for edge runtime.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h18v18H3z" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" />
      </svg>
    ),
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/20',
    title: 'Real-time Dashboard',
    body: 'Next.js 15 SSE-powered observability dashboard. Per-key request counts, block rates, a 60-second sparkline, and live traffic simulation.',
  },
]

export function Features() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 60%, rgba(14,165,233,0.05), transparent)' }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-16 text-center"
        >
          <SectionLabel color="sky">Features</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-brand">
            Production-ready out of the box.
          </h2>
          <p className="max-w-xl text-text-secondary text-lg">
            Every detail you'd need to ship reliable rate limiting — from cluster safety to real-time observability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group rounded-xl border border-wire bg-canvas-card p-6 hover:bg-canvas-elevated hover:border-wire-bright transition-all duration-200 flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-lg border ${f.border} ${f.bg} ${f.color} flex items-center justify-center shrink-0`}>
                {f.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-text-DEFAULT">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
