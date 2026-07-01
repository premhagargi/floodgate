'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const algorithms = [
  {
    name: 'Sliding Window Counter',
    badge: 'Cloudflare formula',
    accent: 'from-brand-sky to-sky-300',
    borderAccent: 'border-t-brand-sky',
    description:
      'Approximates a true sliding window by weighting the previous window\'s count. Error bounded at ~0.1% at the window boundary.',
    when: 'High throughput APIs, predictable billing, rate card enforcement.',
    formula: 'count = floor(prev × weight) + current',
    details: [
      '2 Redis keys (hash-tagged, same slot)',
      'Single EVALSHA round-trip',
      'Cluster-safe atomic update',
    ],
    code: `const r = await limiter.check({
  key: 'user:42',
  limit: 1000,
  windowMs: 60_000,
})`,
  },
  {
    name: 'Sliding Window Log',
    badge: 'Exact accounting',
    accent: 'from-brand-violet to-purple-300',
    borderAccent: 'border-t-brand-violet',
    description:
      'Stores every request timestamp in a sorted set. Exact count of requests in the last N milliseconds — no approximation.',
    when: 'Billing systems, compliance, low-volume APIs where precision is required.',
    formula: 'count = |{t : now − window ≤ t ≤ now}|',
    details: [
      '1 Redis sorted set per key',
      'ZREMRANGEBYSCORE + ZADD + ZCARD',
      'Unique nonce prevents same-ms dedup',
    ],
    code: `const r = await limiter.check({
  key: 'api:tenant:9',
  limit: 100,
  windowMs: 3_600_000, // 1h
  // algorithm: 'sliding-window-log'
})`,
  },
  {
    name: 'Token Bucket',
    badge: 'Burst-friendly',
    accent: 'from-[#6366F1] to-indigo-300',
    borderAccent: 'border-t-[#6366F1]',
    description:
      'Tokens refill at a fixed rate. Allows short bursts up to the bucket capacity while smoothing long-term throughput.',
    when: 'Webhooks, streaming APIs, any use-case where occasional bursts are acceptable.',
    formula: 'tokens = min(limit, prev + elapsed × rate)',
    details: [
      '1 Redis hash per key (tokens + lastRefill)',
      'Continuous token refill via elapsed time',
      'No burst penalty on cold start',
    ],
    code: `const r = await limiter.check({
  key: 'webhook:sender',
  limit: 50,         // max burst
  windowMs: 60_000,  // refill period
  // algorithm: 'token-bucket'
})`,
  },
]

export function Algorithms() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139,92,246,0.06), transparent)' }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-16 text-center"
        >
          <SectionLabel color="violet">Three algorithms</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-brand">
            Pick the right tool for your traffic.
          </h2>
          <p className="max-w-xl text-text-secondary text-lg">
            All three run as atomic Lua scripts on Redis — one round-trip, no race conditions.
            Switch algorithms with a single option change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {algorithms.map((alg, i) => (
            <motion.div
              key={alg.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`rounded-xl border border-wire bg-canvas-card border-t-2 ${alg.borderAccent} flex flex-col gap-5 p-6 hover:bg-canvas-elevated transition-colors duration-200`}
            >
              {/* Header */}
              <div className="flex flex-col gap-2">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full w-fit bg-gradient-to-r ${alg.accent} bg-opacity-10 text-text-DEFAULT font-medium`}
                  style={{ background: 'rgba(2,6,23,0.05)' }}
                >
                  {alg.badge}
                </span>
                <h3 className="text-lg font-semibold text-text-DEFAULT">{alg.name}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{alg.description}</p>
              </div>

              {/* Formula pill */}
              <div className="rounded-lg border border-wire bg-canvas-surface px-4 py-2.5">
                <span className="font-mono text-xs text-text-muted">{alg.formula}</span>
              </div>

              {/* Details */}
              <ul className="flex flex-col gap-1.5">
                {alg.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="text-brand-sky mt-0.5 shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>

              {/* When to use */}
              <div className="border-t border-wire pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1.5">When to use</p>
                <p className="text-xs text-text-secondary">{alg.when}</p>
              </div>

              {/* Code snippet */}
              <pre className="rounded-lg bg-editor-base border border-editor-border p-4 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed">
                {alg.code}
              </pre>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
