import { ImageResponse } from 'next/og'

export const alt = 'FloodGate — Distributed Rate Limiting for Node.js'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#04050A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sky orb — top left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '560px',
            height: '560px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 68%)',
            borderRadius: '50%',
          }}
        />
        {/* Violet orb — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '480px',
            height: '480px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 68%)',
            borderRadius: '50%',
          }}
        />
        {/* Subtle grid overlay simulation — horizontal rule */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(30,42,66,0.35) 31px, rgba(30,42,66,0.35) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(30,42,66,0.35) 31px, rgba(30,42,66,0.35) 32px)',
          }}
        />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '44px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 800 }}>F</span>
          </div>
          <span
            style={{
              color: '#F0F4FF',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '0.16em',
            }}
          >
            FLOODGATE
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '30px',
          }}
        >
          <span
            style={{
              color: '#0EA5E9',
              fontSize: '62px',
              fontWeight: 800,
              lineHeight: 1.08,
              textAlign: 'center',
            }}
          >
            Distributed Rate Limiting
          </span>
          <span
            style={{
              color: '#F0F4FF',
              fontSize: '62px',
              fontWeight: 800,
              lineHeight: 1.08,
              textAlign: 'center',
            }}
          >
            for Node.js
          </span>
        </div>

        {/* Subline */}
        <div
          style={{
            color: '#94A3B8',
            fontSize: '22px',
            textAlign: 'center',
            maxWidth: '740px',
            lineHeight: 1.55,
            marginBottom: '48px',
          }}
        >
          Atomic Lua scripts · Redis Cluster-safe · Three algorithms · Express &amp; Next.js adapters
        </div>

        {/* Pill badges */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <div
            style={{
              padding: '9px 22px',
              borderRadius: '999px',
              border: '1px solid #1A2035',
              background: '#0B0F1A',
              color: '#94A3B8',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            floodgate-rl
          </div>
          <div
            style={{
              padding: '9px 22px',
              borderRadius: '999px',
              border: '1px solid #1A2035',
              background: '#0B0F1A',
              color: '#94A3B8',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            MIT License
          </div>
          <div
            style={{
              padding: '9px 22px',
              borderRadius: '999px',
              border: '1px solid #1A2035',
              background: '#0B0F1A',
              color: '#94A3B8',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            TypeScript
          </div>
          <div
            style={{
              padding: '9px 22px',
              borderRadius: '999px',
              border: '1px solid rgba(14,165,233,0.35)',
              background: 'rgba(14,165,233,0.08)',
              color: '#38BDF8',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            v0.1.1
          </div>
        </div>
      </div>
    ),
    size,
  )
}
