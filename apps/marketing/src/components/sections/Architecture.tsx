'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const steps = [
  { icon: '⬡', label: 'Request', sub: 'Your API receives a request', color: 'text-text-secondary', border: 'border-wire' },
  { icon: '◎', label: 'FloodGate', sub: 'Calls backend.check()', color: 'text-brand-sky', border: 'border-brand-sky/30' },
  { icon: '⚡', label: 'Redis / Lua', sub: 'EVALSHA — atomic, one trip', color: 'text-brand-violet', border: 'border-brand-violet/30' },
  { icon: '✓', label: 'Allow / Block', sub: 'Headers set, retryAfter optional', color: 'text-emerald-400', border: 'border-emerald-500/30' },
]

const internals = [
  { label: 'NOSCRIPT?', action: 'SCRIPT LOAD → EVALSHA retry', color: 'text-[#F59E0B]' },
  { label: 'Redis Error?', action: 'Emit redis:error → fallback to memory', color: 'text-brand-sky' },
  { label: 'Cluster?', action: '{key}:sw:ts on same slot always', color: 'text-brand-violet' },
]

export function Architecture() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-dots bg-grid-32 opacity-20 pointer-events-none"
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-16 text-center"
        >
          <SectionLabel color="violet">Architecture</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-brand">
            One request. One round-trip.
          </h2>
          <p className="max-w-xl text-text-secondary text-lg">
            Every check is a single atomic operation. No multi-step transactions, no lost updates.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 mb-16 flex-wrap"
        >
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:gap-0">
              <div
                className={`flex flex-col items-center gap-2 px-6 py-5 rounded-xl border ${s.border} bg-canvas-card min-w-[140px]`}
              >
                <span className={`text-2xl ${s.color}`}>{s.icon}</span>
                <span className={`font-semibold text-sm ${s.color}`}>{s.label}</span>
                <span className="text-[11px] text-text-muted text-center leading-tight">{s.sub}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:flex items-center px-2">
                  <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden>
                    <path d="M1 8h22M23 8l-6-6M23 8l-6 6" stroke="#2E3A58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Edge cases panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl border border-wire bg-canvas-card p-6"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Edge case handling
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {internals.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <span className={`text-sm font-semibold font-mono ${item.color}`}>{item.label}</span>
                <span className="text-xs text-text-secondary">{item.action}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 rounded-lg border border-wire-bright bg-canvas-base p-5 font-mono text-xs text-text-secondary leading-relaxed"
        >
          <span className="code-comment">{'// EVALSHA with automatic NOSCRIPT retry\n'}</span>
          <span className="code-keyword">try </span>
          <span className="code-default">{'{'} </span>
          <span className="code-keyword">await </span>
          <span className="code-fn">redis</span><span className="code-op">.</span><span className="code-fn">evalsha</span><span className="code-default">(sha, keys, args) {'}'}</span>
          <span className="code-keyword"> catch </span>
          <span className="code-default">{'{'}</span>{'\n'}
          <span className="code-keyword">  if </span>
          <span className="code-default">(err.message.</span><span className="code-fn">startsWith</span><span className="code-default">(</span><span className="code-string">'NOSCRIPT'</span><span className="code-default">)) {'{'}</span>{'\n'}
          <span className="code-default">    </span><span className="code-keyword">const </span><span className="code-fn">sha</span><span className="code-default"> = </span><span className="code-keyword">await </span><span className="code-fn">redis</span><span className="code-op">.</span><span className="code-fn">script</span><span className="code-default">(</span><span className="code-string">'LOAD'</span><span className="code-default">, lua)   </span><span className="code-comment">{'// reload'}</span>{'\n'}
          <span className="code-default">    </span><span className="code-keyword">return </span><span className="code-keyword">await </span><span className="code-fn">redis</span><span className="code-op">.</span><span className="code-fn">evalsha</span><span className="code-default">(sha, keys, args)  </span><span className="code-comment">{'// retry'}</span>{'\n'}
          <span className="code-default">  {'}'}{'\n}'}</span>
        </motion.div>
      </div>
    </section>
  )
}
