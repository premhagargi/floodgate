'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 40
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 20)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

const items = [
  { value: 3, suffix: '', label: 'Algorithms', desc: 'sliding-window-counter, log, token-bucket' },
  { value: 1, suffix: '', label: 'Redis round-trip', desc: 'EVALSHA for atomic, zero-race execution' },
  { value: 0, suffix: '', label: 'Dependencies', desc: 'ioredis is optional peer dep only' },
  { value: 100, suffix: '%', label: 'TypeScript', desc: 'Strict mode, typed events, full .d.ts' },
]

export function Stats() {
  return (
    <section className="relative py-16 border-y border-wire overflow-hidden">
      <div className="absolute inset-0 bg-canvas-surface" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-wire divide-y lg:divide-y-0"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="px-8 py-6 flex flex-col gap-1.5"
            >
              <span className="text-4xl font-bold font-mono tabular text-gradient-sky">
                <Counter target={item.value} suffix={item.suffix} />
              </span>
              <span className="text-text-DEFAULT font-medium text-sm">{item.label}</span>
              <span className="text-text-muted text-xs leading-relaxed">{item.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
