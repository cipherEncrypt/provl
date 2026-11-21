import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-btn"
        translate="no"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-ink text-white"
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
        <span className="text-[17px] font-semibold tracking-tight">Provl</span>
      </Link>

      <nav className="flex items-center gap-3 text-sm text-steel-mute sm:gap-5" aria-label="Primary">
        <a
          href="#how-it-works"
          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
        >
          How it works
        </a>
        <a
          href="#faq"
          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
        >
          FAQ
        </a>
        <Link href="/demo/subscription" className="btn-primary !px-4 !py-2 text-xs sm:text-sm">
          Open sandbox
        </Link>
      </nav>
    </header>
  );
}