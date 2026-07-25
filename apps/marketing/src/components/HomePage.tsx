'use client'

import { Nav } from './Nav'
import { Hero } from './sections/Hero'
import { Stats } from './sections/Stats'
import { Algorithms } from './sections/Algorithms'
import { Features } from './sections/Features'
import { Code } from './sections/Code'
import { Architecture } from './sections/Architecture'
import { CTA } from './sections/CTA'
import { Contact } from './sections/Contact'
import { Footer } from './Footer'

export function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Algorithms />
      <Features />
      <Code />
      <Architecture />
      <CTA />
      <Contact />
      <Footer />
    </>
  )
}
