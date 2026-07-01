import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { GeistMono } from 'geist/font/mono'
import { SITE_URL, SITE_NAME, TITLE, DESCRIPTION } from '@/lib/site'
import './globals.css'

const satoshi = localFont({
  src: [
    { path: '../fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
})

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
    siteName: SITE_NAME,
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
    <html lang="en" className={`${satoshi.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: SITE_NAME,
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Node.js',
              description: DESCRIPTION,
              url: SITE_URL,
              softwareVersion: '0.1.1',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: { '@type': 'Person', name: 'premhagargi', url: 'https://github.com/premhagargi' },
              license: 'https://opensource.org/licenses/MIT',
              programmingLanguage: 'TypeScript',
              runtimePlatform: 'Node.js',
              codeRepository: 'https://github.com/premhagargi/floodgate',
            }),
          }}
        />
      </head>
      <body className="bg-canvas-base font-sans min-h-screen antialiased">{children}</body>
    </html>
  )
}
