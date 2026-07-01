'use client'

import { motion } from 'framer-motion'
import { GradientOrb } from '@/components/ui/GradientOrb'
import { NpmCommand } from '@/components/ui/NpmCommand'
import { NpmIcon } from '@/components/ui/Icons'

export function CTA() {
  return (
    <section className="relative py-36 overflow-hidden">
      <div className="absolute inset-0 bg-canvas-surface" aria-hidden />
      <GradientOrb color="sky" size="w-[500px] h-[500px]" className="top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2" animate={false} />
      <GradientOrb color="violet" size="w-[400px] h-[400px]" className="top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2" animate={false} />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-dots bg-grid-32 opacity-30 pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-gradient-brand">Start in</span>
            <br />
            <span className="text-gradient-full">two minutes.</span>
          </h2>

          <p className="text-text-secondary text-lg max-w-md">
            No setup required for the memory backend. Add Redis when you're ready to distribute.
          </p>

          <NpmCommand size="lg" />

          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://github.com/premhagargi/floodgate"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-text-DEFAULT border border-wire hover:bg-canvas-elevated transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://npmjs.com/package/floodgate-rl"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-brand-sky text-white hover:bg-sky-500 transition-colors"
            >
              <NpmIcon className="w-4 h-4" />
              npm
            </a>
          </div>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-text-muted font-mono"
        >
          MIT licensed · TypeScript · Node.js 20+ · No vendor lock-in
        </motion.p>
      </div>
    </section>
  )
}
