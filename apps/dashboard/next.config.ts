import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  webpack(cfg) {
    // Resolve floodgate-rl directly to TypeScript source for monorepo dev
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      'floodgate-rl': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
    // NodeNext-style imports use .js extensions even for .ts files.
    // Tell webpack to also try .ts/.tsx when it sees .js imports.
    cfg.resolve.extensionAlias = {
      ...cfg.resolve.extensionAlias,
      '.js': ['.js', '.ts', '.tsx'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    }
    return cfg
  },
}

export default config
