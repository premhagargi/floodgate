import type { NextRequest } from 'next/server'
import { stats } from '@/lib/limiter'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const flush = () => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(stats.snapshot())}\n\n`))
        } catch {
          closed = true
        }
      }

      flush()
      const timer = setInterval(flush, 400)

      req.signal.addEventListener('abort', () => {
        closed = true
        clearInterval(timer)
        try { controller.close() } catch { /* already closed */ }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
