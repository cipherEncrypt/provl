import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-5">
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-btn"
        translate="no"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-ink text-white"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M7 2v10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </span>
        <span className="truncate text-[17px] font-semibold tracking-tight">Provl</span>
      </Link>

      <nav className="flex shrink-0 items-center gap-2 text-sm text-steel-mute sm:gap-5" aria-label="Primary">
        <Link
          href="/#how-it-works"
          className="hidden hover:text-ink sm:inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
        >
          How it works
        </Link>
        <Link
          href="/demo/subscription"
          className="hidden hover:text-ink md:inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
        >
          Sandbox
        </Link>
        <Link href="/app" className="btn-primary !px-3.5 !py-2 text-xs sm:!px-4 sm:text-sm">
          Open app
        </Link>
      </nav>
    </header>
  );
}