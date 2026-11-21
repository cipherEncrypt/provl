"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#get-started", label: "How to use" },
  { href: "#demo", label: "Demo" },
  { href: "#proof", label: "Proof" },
  {
    href: "https://www.testmuai.com/support/docs/kane-cli-introduction/",
    label: "Docs",
    external: true,
  },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-paper/80 backdrop-blur-md supports-[backdrop-filter]:bg-paper/60 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-btn text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          translate="no"
          onClick={() => setOpen(false)}
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

        <nav
          className="hidden items-center gap-5 text-sm text-steel-mute lg:flex xl:gap-6"
          aria-label="Primary"
        >
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="btn-primary !px-3.5 !py-2 text-xs sm:!px-4 sm:text-sm"
          >
            Open app
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-steel-line bg-paper text-ink lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-steel-line bg-paper px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
          style={{ overscrollBehavior: "contain" }}
        >
          <nav className="flex flex-col gap-1 py-2" aria-label="Mobile">
            {LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-btn px-3 py-3 text-left text-base font-medium text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-btn px-3 py-3 text-left text-base font-medium text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <Link
              href="/dashboard"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Open app
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
