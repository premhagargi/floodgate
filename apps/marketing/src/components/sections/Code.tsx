'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const TABS = [
  {
    id: 'basic',
    label: 'Basic',
    file: 'server.ts',
    code: [
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ createLimiter } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'floodgate-rl'\n" },
      { t: 'default', v: '\n' },
      { t: 'comment', v: '// In-memory — zero infra, perfect for single-process or tests\n' },
      { t: 'keyword', v: 'const ' }, { t: 'fn', v: 'limiter' }, { t: 'default', v: ' = ' }, { t: 'fn', v: 'createLimiter' }, { t: 'default', v: '({ backend: ' }, { t: 'string', v: "'memory'" }, { t: 'default', v: ' })\n' },
      { t: 'default', v: '\n' },
      { t: 'keyword', v: 'const ' }, { t: 'fn', v: 'result' }, { t: 'default', v: ' = ' }, { t: 'keyword', v: 'await ' }, { t: 'fn', v: 'limiter' }, { t: 'op', v: '.' }, { t: 'fn', v: 'check' }, { t: 'default', v: '({\n' },
      { t: 'default', v: '  key: ' }, { t: 'string', v: "'user:42'" }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  limit: ' }, { t: 'number', v: '100' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  windowMs: ' }, { t: 'number', v: '60_000' }, { t: 'default', v: ',  ' }, { t: 'comment', v: '// 1 minute\n' },
      { t: 'default', v: '})\n\n' },
      { t: 'comment', v: '// { allowed: true, remaining: 99, resetAt: 1700000060000 }\n' },
      { t: 'fn', v: 'console' }, { t: 'op', v: '.' }, { t: 'fn', v: 'log' }, { t: 'default', v: '(' }, { t: 'fn', v: 'result' }, { t: 'default', v: '.' }, { t: 'prop', v: 'allowed' }, { t: 'default', v: ', ' }, { t: 'fn', v: 'result' }, { t: 'default', v: '.' }, { t: 'prop', v: 'remaining' }, { t: 'default', v: ')\n' },
    ],
  },
  {
    id: 'redis',
    label: 'Redis',
    file: 'limiter.ts',
    code: [
      { t: 'keyword', v: 'import ' }, { t: 'type', v: 'Redis ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'ioredis'\n" },
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ createLimiter } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'floodgate-rl'\n\n" },
      { t: 'keyword', v: 'const ' }, { t: 'fn', v: 'redisClient' }, { t: 'default', v: ' = ' }, { t: 'keyword', v: 'new ' }, { t: 'type', v: 'Redis' }, { t: 'default', v: '({ host: ' }, { t: 'string', v: "'localhost'" }, { t: 'default', v: ', port: ' }, { t: 'number', v: '6379' }, { t: 'default', v: ' })\n\n' },
      { t: 'keyword', v: 'export const ' }, { t: 'fn', v: 'limiter' }, { t: 'default', v: ' = ' }, { t: 'fn', v: 'createLimiter' }, { t: 'default', v: '({\n' },
      { t: 'default', v: '  backend: ' }, { t: 'string', v: "'redis'" }, { t: 'default', v: ',\n' },
      { t: 'prop', v: '  redisClient' }, { t: 'default', v: ',                    ' }, { t: 'comment', v: '// your ioredis instance\n' },
      { t: 'default', v: '  algorithm: ' }, { t: 'string', v: "'sliding-window-counter'" }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  fallback: ' }, { t: 'string', v: "'memory'" }, { t: 'default', v: ',  ' }, { t: 'comment', v: '// use memory on Redis error\n' },
      { t: 'default', v: '})\n\n' },
      { t: 'comment', v: '// NOSCRIPT is handled automatically — scripts reload on restart\n' },
      { t: 'fn', v: 'limiter' }, { t: 'op', v: '.' }, { t: 'fn', v: 'on' }, { t: 'default', v: '(' }, { t: 'string', v: "'redis:fallback'" }, { t: 'default', v: ', (err) => ' }, { t: 'fn', v: 'logger' }, { t: 'op', v: '.' }, { t: 'fn', v: 'warn' }, { t: 'default', v: '(err))\n' },
    ],
  },
  {
    id: 'express',
    label: 'Express',
    file: 'app.ts',
    code: [
      { t: 'keyword', v: 'import ' }, { t: 'fn', v: 'express ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'express'\n" },
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ rateLimit } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'floodgate-express'\n" },
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ limiter } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'./limiter'\n\n" },
      { t: 'keyword', v: 'const ' }, { t: 'fn', v: 'app' }, { t: 'default', v: ' = ' }, { t: 'fn', v: 'express' }, { t: 'default', v: '()\n\n' },
      { t: 'fn', v: 'app' }, { t: 'op', v: '.' }, { t: 'fn', v: 'use' }, { t: 'default', v: '(' }, { t: 'string', v: "'/api'" }, { t: 'default', v: ', ' }, { t: 'fn', v: 'rateLimit' }, { t: 'default', v: '({\n' },
      { t: 'prop', v: '  limiter' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  limit: ' }, { t: 'number', v: '100' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  windowMs: ' }, { t: 'number', v: '60_000' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  key: (req) => req.headers[' }, { t: 'string', v: "'x-api-key'" }, { t: 'default', v: '] ' }, { t: 'keyword', v: 'as ' }, { t: 'type', v: 'string ' }, { t: 'default', v: '??\n' },
      { t: 'default', v: '         req.ip ?? ' }, { t: 'string', v: "'anon'" }, { t: 'default', v: ',\n' },
      { t: 'default', v: '}))\n\n' },
      { t: 'comment', v: '// Sets RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset headers\n' },
      { t: 'comment', v: '// Returns 429 with Retry-After when blocked\n' },
    ],
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    file: 'app/api/search/route.ts',
    code: [
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ withRateLimit } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'floodgate-nextjs'\n" },
      { t: 'keyword', v: 'import ' }, { t: 'default', v: '{ limiter } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'@/lib/limiter'\n" },
      { t: 'keyword', v: 'import ' }, { t: 'keyword', v: 'type ' }, { t: 'default', v: '{ NextRequest } ' }, { t: 'keyword', v: 'from ' }, { t: 'string', v: "'next/server'\n\n" },
      { t: 'keyword', v: 'async function ' }, { t: 'fn', v: 'handler' }, { t: 'default', v: '(req: ' }, { t: 'type', v: 'NextRequest' }, { t: 'default', v: ') {\n' },
      { t: 'default', v: '  ' }, { t: 'keyword', v: 'return ' }, { t: 'type', v: 'Response' }, { t: 'op', v: '.' }, { t: 'fn', v: 'json' }, { t: 'default', v: '({ results: [] })\n' },
      { t: 'default', v: '}\n\n' },
      { t: 'keyword', v: 'export const ' }, { t: 'fn', v: 'GET' }, { t: 'default', v: ' = ' }, { t: 'fn', v: 'withRateLimit' }, { t: 'default', v: '(' }, { t: 'fn', v: 'handler' }, { t: 'default', v: ', {\n' },
      { t: 'prop', v: '  limiter' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  limit: ' }, { t: 'number', v: '30' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  windowMs: ' }, { t: 'number', v: '60_000' }, { t: 'default', v: ',\n' },
      { t: 'default', v: '  key: (req) => req.ip ?? ' }, { t: 'string', v: "'anon'" }, { t: 'default', v: ',\n' },
      { t: 'default', v: '})\n' },
    ],
  },
]

const typeClass: Record<string, string> = {
  keyword: 'code-keyword',
  string: 'code-string',
  comment: 'code-comment',
  fn: 'code-fn',
  type: 'code-type',
  number: 'code-number',
  prop: 'code-prop',
  op: 'code-op',
  default: 'code-default',
}

export function Code() {
  const [active, setActive] = useState(TABS[0].id)
  const tab = TABS.find((t) => t.id === active)!

  return (
    <section className="py-28 relative overflow-hidden bg-canvas-surface border-y border-wire">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 40% 60% at 100% 30%, rgba(99,102,241,0.07), transparent)' }}
      />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-12 text-center"
        >
          <SectionLabel color="indigo">Examples</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-brand">
            Start in two minutes.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-wire overflow-hidden shadow-2xl"
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-wire bg-canvas-card px-4 pt-3 pb-0 gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-4 py-2.5 text-sm font-mono rounded-t-md border border-transparent border-b-0 transition-all duration-150 whitespace-nowrap ${
                  active === t.id
                    ? 'bg-canvas-base text-text-DEFAULT border-wire'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
            {/* Window file path */}
            <div className="ml-auto pr-2 pb-2.5 text-[11px] font-mono text-text-muted hidden sm:block">
              {tab.file}
            </div>
          </div>

          {/* Code */}
          <div className="bg-canvas-base p-6 overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.pre
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-sm leading-relaxed"
              >
                {tab.code.map((token, i) => (
                  <span key={i} className={typeClass[token.t] ?? 'code-default'}>
                    {token.v}
                  </span>
                ))}
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
