import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const SITE_URL = 'https://floodgate.dev'
const TITLE = 'FloodGate — Distributed Rate Limiting for Node.js'
const DESCRIPTION =
  'Production-grade rate limiting with atomic Lua scripts, Redis Cluster safety, and real-time observability. Three algorithms, Express + Next.js adapters, live dashboard. Open source.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — FloodGate',
  },
  description: DESCRIPTION,
  keywords: [
    'rate limiting',
    'rate limiter',
    'redis rate limiter',
    'nodejs rate limiter',
    'distributed rate limiting',
    'sliding window',
    'token bucket',
    'express middleware',
    'nextjs rate limit',
    'lua scripts redis',
    'floodgate',
    'floodgate-rl',
  ],
  authors: [{ name: 'premhagargi', url: 'https://github.com/premhagargi' }],
  creator: 'premhagargi',
  publisher: 'premhagargi',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'FloodGate',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@premhagargi',
  },
  alternates: { canonical: SITE_URL },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'FloodGate',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Node.js',
              description: DESCRIPTION,
              url: SITE_URL,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: { '@type': 'Person', name: 'premhagargi', url: 'https://github.com/premhagargi' },
              license: 'https://opensource.org/licenses/MIT',
              programmingLanguage: 'TypeScript',
              runtimePlatform: 'Node.js',
            }),
          }}
        />
      </head>
      <body className="bg-canvas-base font-sans min-h-screen antialiased">{children}</body>
    </html>
  )
}
