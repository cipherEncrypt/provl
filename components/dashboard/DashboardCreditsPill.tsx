"use client";

import type { KaneAccountStatus } from "@/lib/api-types";
import { LT_BILLING } from "@/lib/kane/constants";

import { CreditsPillSkeleton } from "./DashboardSkeletons";

type DashboardCreditsPillProps = {
  status: KaneAccountStatus | null;
  creditsLoading?: boolean;
  onRefreshCredits?: () => void;
};

export function DashboardCreditsPill({
  status,
  creditsLoading = false,
  onRefreshCredits,
}: DashboardCreditsPillProps) {
  const connected = status?.connected ?? false;
  const showCreditSpinner = creditsLoading && connected;

  const credits = status?.availableCredits;
  const label =
    connected && credits != null
      ? `${credits.toLocaleString(undefined, { maximumFractionDigits: 2 })} credits`
      : status?.demoMode
        ? "Local demo"
        : "Credits";

  return (
    <div className="flex items-center gap-1.5">
      {showCreditSpinner ? (
        <CreditsPillSkeleton />
      ) : (
        <a
          href={LT_BILLING}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-steel-line bg-paper px-3 py-1.5 text-xs font-medium text-ink shadow-soft hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <span className="truncate tabular-nums">{label}</span>
          <span className="text-steel" aria-hidden="true">
            ·
          </span>
          <span className="shrink-0 text-steel">Top up</span>
        </a>
      )}
      {connected && onRefreshCredits ? (
        <button
          type="button"
          disabled={showCreditSpinner}
          onClick={onRefreshCredits}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-steel-line bg-paper text-steel hover:bg-mist disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          aria-label="Refresh credit balance"
          title="Refresh balance"
        >
          {showCreditSpinner ? (
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-steel-line border-t-ink"
              aria-hidden="true"
            />
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M13 3v4H9M3 13V9h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  );
}