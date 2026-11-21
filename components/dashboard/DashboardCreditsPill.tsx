"use client";

import type { KaneAccountStatus } from "@/lib/api-types";
import { LT_BILLING } from "@/lib/kane/constants";

type DashboardCreditsPillProps = {
  status: KaneAccountStatus | null;
};

export function DashboardCreditsPill({ status }: DashboardCreditsPillProps) {
  const connected = status?.connected ?? false;
  const credits = status?.availableCredits;
  const label =
    connected && credits != null
      ? `${credits.toLocaleString(undefined, { maximumFractionDigits: 2 })} credits`
      : status?.demoMode
        ? "Local demo"
        : "— credits";

  return (
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
  );
}