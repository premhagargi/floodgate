export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-wire bg-canvas-base">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/floodgate-logo.png" alt="FloodGate" className="h-8 w-auto" />
          <span className="text-text-muted text-xs">© {year} premhagargi · MIT</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-text-secondary">
          <a
            href="https://github.com/premhagargi/floodgate"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-DEFAULT transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://npmjs.com/package/floodgate-rl"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-DEFAULT transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/premhagargi/floodgate#readme"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-DEFAULT transition-colors"
          >
            Docs
          </a>
        </nav>
      </div>
    </footer>
  )
}
