import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Payload CMS-inspired dark palette
        surface: {
          base: '#0A0B0F',
          panel: '#0F1119',
          elevated: '#141724',
          hover: '#181B27',
        },
        edge: {
          DEFAULT: '#1C1F30',
          strong: '#252A3D',
          glow: '#2A2F47',
        },
        ink: {
          DEFAULT: '#EAEAED',
          muted: '#7B7D8C',
          faint: '#4A4D60',
        },
        accent: {
          red: '#E5383B',
          'red-dim': '#7C1518',
          green: '#22C55E',
          'green-dim': '#14532D',
          amber: '#F59E0B',
          'amber-dim': '#78350F',
          blue: '#6366F1',
          'blue-dim': '#312E81',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
