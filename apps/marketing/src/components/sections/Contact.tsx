'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GradientOrb } from '@/components/ui/GradientOrb'
import { CheckIcon } from '@/components/ui/Icons'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('premhagaragi@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setStatus('sending')

    // Simulate sending animation state
    setTimeout(() => {
      setStatus('success')
      const mailtoUrl = `mailto:premhagaragi@gmail.com?subject=${encodeURIComponent(
        `FloodGate Inquiry from ${name}`
      )}&body=${encodeURIComponent(
        `Hi Prem,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
      )}`
      window.location.href = mailtoUrl
    }, 1200)
  }

  return (
    <section id="contact" className="relative py-28 border-t border-wire overflow-hidden bg-canvas-surface">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-dots bg-grid-32 opacity-20 pointer-events-none" aria-hidden />
      
      {/* Gradients */}
      <GradientOrb color="violet" size="w-[500px] h-[500px]" className="-bottom-40 -left-40 opacity-30 animate-pulse-slow" />
      <GradientOrb color="sky" size="w-[450px] h-[450px]" className="top-10 -right-20 opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center flex flex-col items-center mb-16">
          <SectionLabel color="violet">Get In Touch</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mt-6 text-gradient-brand">
            Let&apos;s build something together
          </h2>
          <p className="text-text-secondary text-lg mt-4 max-w-xl">
            Have questions about FloodGate, integrations, or want to collaborate? Reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Card Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Email Contact Card */}
            <div className="p-8 rounded-2xl border border-wire bg-canvas-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-violet/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">Direct Email</h3>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Skip the form and send a message directly. Click below to copy or launch your client.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="mailto:premhagaragi@gmail.com"
                  className="inline-flex items-center justify-between p-3.5 px-4 rounded-xl border border-wire bg-canvas-surface hover:bg-canvas-hover transition-colors font-mono text-sm text-text-DEFAULT"
                >
                  <span className="truncate">premhagaragi@gmail.com</span>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-text-DEFAULT transition-colors shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    copied
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10'
                      : 'bg-text-DEFAULT text-white hover:bg-black/90'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4 animate-scale" />
                      <span>Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="p-8 rounded-2xl border border-wire bg-canvas-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-sky/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-brand-sky/10 text-brand-sky flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">GitHub Project</h3>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Found a bug, want to request a feature, or interested in contributing? Check out our repo.
              </p>

              <a
                href="https://github.com/premhagargi/floodgate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border border-wire bg-canvas-surface hover:bg-canvas-hover text-text-DEFAULT transition-all duration-200"
              >
                <span>Visit Repository</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl border border-wire bg-canvas-card shadow-sm relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {status !== 'success' ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="contact-name" className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-wire bg-canvas-surface text-sm focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/20 transition-all placeholder:text-text-muted"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="contact-email" className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-wire bg-canvas-surface text-sm focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/20 transition-all placeholder:text-text-muted"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-message" className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi Prem, I am interested in FloodGate..."
                        className="w-full px-4 py-3 rounded-xl border border-wire bg-canvas-surface text-sm focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/20 transition-all placeholder:text-text-muted resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-medium bg-brand-violet text-white hover:bg-violet-600 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-brand-violet/10"
                    >
                      {status === 'sending' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Preparing Email...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                      <CheckIcon className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gradient-brand">Email Ready!</h3>
                    
                    <p className="text-text-secondary text-sm max-w-md mb-8 leading-relaxed">
                      We have prepared your message and launched your email client. If it did not open automatically, please click below to send it or email manually to <strong className="text-text-DEFAULT font-medium">premhagaragi@gmail.com</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
                      <button
                        onClick={() => {
                          const mailtoUrl = `mailto:premhagaragi@gmail.com?subject=${encodeURIComponent(
                            `FloodGate Inquiry from ${name}`
                          )}&body=${encodeURIComponent(
                            `Hi Prem,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
                          )}`
                          window.location.href = mailtoUrl
                        }}
                        className="py-3 px-6 rounded-xl text-sm font-medium bg-brand-violet text-white hover:bg-violet-600 transition-colors"
                      >
                        Open Mail Again
                      </button>
                      
                      <button
                        onClick={() => {
                          setName('')
                          setEmail('')
                          setMessage('')
                          setStatus('idle')
                        }}
                        className="py-3 px-6 rounded-xl text-sm font-medium border border-wire hover:bg-canvas-hover text-text-secondary transition-colors"
                      >
                        Send Another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
