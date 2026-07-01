import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // FloodGate brand palette
        brand: {
          sky: '#0EA5E9',
          'sky-dim': '#0369A1',
          violet: '#8B5CF6',
          'violet-dim': '#5B21B6',
        },
        canvas: {
          base: '#FFFFFF',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#F8FAFC',
          hover: '#F1F5F9',
        },
        wire: {
          DEFAULT: '#E2E8F0',
          bright: '#CBD5E1',
          glow: '#94A3B8',
        },
        text: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          accent: '#0284C7',
        },
        editor: {
          base: '#0B0F1A',
          card: '#111726',
          border: '#232B45',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,165,233,0.25) 0%, transparent 65%)',
        'grid-dots': 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delay': 'float 10s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '33%': { transform: 'translateY(-24px) scale(1.05)' },
          '66%': { transform: 'translateY(12px) scale(0.97)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
