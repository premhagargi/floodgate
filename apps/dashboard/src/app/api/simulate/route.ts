import { NextRequest, NextResponse } from 'next/server'
import { limiter, stats } from '@/lib/limiter'

export const dynamic = 'force-dynamic'

const DEFAULT_KEYS = ['user:alice', 'user:bob', 'user:carol', 'user:dave', 'bot:scraper']

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({})) as Record<string, unknown>

  const count = Math.min(Math.max(Number(body.count) || 60, 1), 300)
  const limit = Math.max(Number(body.limit) || 15, 1)
  const windowMs = Math.max(Number(body.windowMs) || 8_000, 1000)
  const rawKeys = body.keys
  const keys: string[] = Array.isArray(rawKeys) && rawKeys.length > 0
    ? (rawKeys as unknown[]).map(String)
    : DEFAULT_KEYS

  let allowed = 0
  let blocked = 0

  await Promise.all(
    Array.from({ length: count }, (_, i) =>
      limiter.check({ key: keys[i % keys.length], limit, windowMs }).then((r) => {
        if (r.allowed) allowed++
        else blocked++
      }),
    ),
  )

  return NextResponse.json({ sent: count, allowed, blocked })
}

export async function DELETE(): Promise<NextResponse> {
  stats.reset()
  return NextResponse.json({ ok: true })
}
