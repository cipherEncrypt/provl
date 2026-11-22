"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus } from "@/lib/api-types";
import { LT_BILLING, LT_KEY_HELP } from "@/lib/kane/constants";

import { AccountCardSkeleton } from "./dashboard/DashboardSkeletons";

async function loadAccount(refreshBalance: boolean): Promise<KaneAccountStatus | null> {
  const url = refreshBalance
    ? "/api/kane/account?refreshBalance=1"
    : "/api/kane/account";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as KaneAccountStatus;
}

type KaneAccountSummaryProps = {
  refreshNonce?: number;
  showSignOut?: boolean;
};

export function KaneAccountSummary({
  refreshNonce = 0,
  showSignOut = true,
}: KaneAccountSummaryProps) {
  const router = useRouter();
  const [status, setStatus] = useState<KaneAccountStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(true);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!status?.connected) return;
    setCreditsLoading(true);
    try {
      const data = await loadAccount(true);
      if (data) setStatus(data);
    } finally {
      setCreditsLoading(false);
    }
  }, [status?.connected]);

  const load = useCallback(async () => {
    setAccountError(null);
    try {
      const data = await loadAccount(false);
      if (!data) {
        setAccountError("Could not load account status.");
        return;
      }
      setStatus(data);
      if (data.connected) {
        setCreditsLoading(true);
        const fresh = await loadAccount(true);
        if (fresh) setStatus(fresh);
        setCreditsLoading(false);
      }
    } catch {
      setAccountError("Could not reach the server.");
    } finally {
      setAccountLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshNonce]);

  useEffect(() => {
    const onRefresh = () => void refreshBalance();
    window.addEventListener("provl:account-refresh", onRefresh);
    return () => window.removeEventListener("provl:account-refresh", onRefresh);
  }, [refreshBalance]);

  async function handleDisconnect() {
    setLoading(true);
    try {
      await fetch("/api/kane/connect", { method: "DELETE" });
      await fetch("/api/kane/demo-mode", { method: "DELETE" });
      router.replace("/connect");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const connected = status?.connected ?? false;
  const demoMode = status?.demoMode ?? false;

  if (accountLoading) {
    return <AccountCardSkeleton />;
  }

  if (accountError) {
    return (
      <p
        className="rounded-card border border-steel-line bg-paper px-4 py-3 text-sm text-ink shadow-soft"
        role="alert"
      >
        {accountError}
      </p>
    );
  }

  return (
    <section className="surface-card w-full min-w-0 text-left" aria-label="Account summary">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-steel-soft">Signed in as</p>
          {connected && status?.username ? (
            <p className="mt-1 text-lg font-semibold text-ink">{status.username}</p>
          ) : demoMode ? (
            <p className="mt-1 text-lg font-semibold text-ink">
              Machine demo{" "}
              <span className="text-sm font-normal text-steel">(local Kane login)</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-steel">-</p>
          )}
        </div>
        {showSignOut && (
          <div className="flex flex-wrap gap-2">
            {connected ? (
              <button
                type="button"
                className="btn-secondary text-sm"
                disabled={loading}
                onClick={() => void handleDisconnect()}
              >
                Sign out
              </button>
            ) : demoMode ? (
              <Link href="/connect" className="btn-secondary text-sm">
                Connect Kane account
              </Link>
            ) : null}
          </div>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-steel-line/80 pt-4 text-sm">
        <div>
          <dt className="text-steel-soft">Available credits</dt>
          <dd className="font-medium tabular-nums text-ink">
            {creditsLoading && connected ? (
              <span className="inline-block h-5 w-20 animate-pulse rounded bg-mist" />
            ) : connected && status?.availableCredits != null ? (
              status.availableCredits.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            ) : connected ? (
              "-"
            ) : demoMode ? (
              "Uses local account"
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-steel-soft">Spent this session</dt>
          <dd className="font-medium tabular-nums text-ink">
            {(status?.creditsSpentSession ?? 0).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={LT_BILLING}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm !px-4 !py-2"
        >
          Top up credits
        </a>
        {connected ? (
          <button
            type="button"
            disabled={creditsLoading}
            onClick={() => void refreshBalance()}
            className="btn-secondary text-sm"
          >
            Refresh balance
          </button>
        ) : null}
        <a
          href={LT_KEY_HELP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-steel underline decoration-steel-line underline-offset-2 hover:text-ink"
        >
          Kane credentials help
        </a>
      </div>
    </section>
  );
}