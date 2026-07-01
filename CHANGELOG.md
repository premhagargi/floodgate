# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1] — 2026-07-01

### Fixed
- NOSCRIPT recovery: reload Lua script and retry on Redis restart or `SCRIPT FLUSH`

### Changed
- Minor internal cleanup across core backend

## [0.1.0] — 2026-06-01

### Added
- `floodgate-rl` — core rate limiter with memory and Redis backends
- Three algorithms: `sliding-window-counter`, `sliding-window-log`, `token-bucket`
- Atomic Lua scripts via `EVALSHA` — no race conditions
- Redis Cluster safety via hash-tagged keys
- Automatic fallback to in-memory backend on Redis error
- Typed `EventEmitter` with `check`, `blocked`, `redis:error`, `redis:fallback` events
- `floodgate-express` — Express middleware adapter
- `floodgate-nextjs` — Next.js App Router route handler + edge middleware helper
- Real-time SSE dashboard (`apps/dashboard`)
- Marketing site (`apps/marketing`)
