"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { ProvlMark } from "../ProvlLogo";
import { DashboardCreditsPill } from "./DashboardCreditsPill";
import { useDashboardGate } from "./useDashboardGate";

const NAV = [
  { href: "/dashboard", label: "Run", exact: true },
  { href: "/dashboard/monitors", label: "Monitors" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/account", label: "Account" },
] as const;

const TITLES: Record<string, string> = {
  "/dashboard": "Run",
  "/dashboard/monitors": "Monitors",
  "/dashboard/history": "History",
  "/dashboard/account": "Account",
};

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const { ready, status, refresh, signOut } = useDashboardGate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = TITLES[pathname] ?? "Dashboard";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <p className="text-sm text-steel">Loading dashboard…</p>
      </div>
    );
  }

  const signedInLabel =
    status?.connected && status.username
      ? status.username
      : status?.demoMode
        ? "Machine demo"
        : "-";

  function navClass(href: string, exact?: boolean) {
    const active = exact ? pathname === href : pathname === href;
    return [
      "block rounded-btn px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-ink text-white"
        : "text-steel hover:bg-mist hover:text-ink",
    ].join(" ");
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-btn px-2 py-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        translate="no"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-ink text-white"
          aria-hidden="true"
        >
          <ProvlMark onDark className="h-[18px] w-[18px]" />
        </span>
        <span className="text-[17px] font-semibold tracking-tight">Provl</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Dashboard">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navClass(item.href, "exact" in item ? item.exact : false)}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-steel-line/80 pt-4">
        <p className="text-xs text-steel-soft">Signed in as</p>
        <p className="mt-1 truncate text-sm font-medium text-ink" title={signedInLabel}>
          {signedInLabel}
        </p>
        <button
          type="button"
          className="btn-secondary mt-3 w-full text-sm"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-paper lg:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-steel-line px-4 py-3 lg:hidden">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-steel-line"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            ) : (
              <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <span className="text-sm font-semibold text-ink">{title}</span>
        <DashboardCreditsPill status={status} />
      </header>

      {mobileOpen && (
        <div className="border-b border-steel-line bg-mist px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Dashboard mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(item.href, "exact" in item ? item.exact : false)}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-steel-line/80 pt-4">
            <p className="text-xs text-steel-soft">
              Signed in as <span className="font-medium text-ink">{signedInLabel}</span>
            </p>
            <button
              type="button"
              className="btn-secondary mt-2 w-full text-sm"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-[15.5rem] shrink-0 border-r border-steel-line bg-mist p-5 lg:flex lg:flex-col">
        {sidebar}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="hidden items-center justify-between gap-4 border-b border-steel-line px-6 py-4 lg:flex">
          <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
          <DashboardCreditsPill status={status} />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}