"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus } from "@/lib/api-types";
import { LT_BILLING, LT_KEY_HELP } from "@/lib/kane/constants";

type KaneAccountSummaryProps = {
  refreshNonce?: number;
};

export function KaneAccountSummary({ refreshNonce = 0 }: KaneAccountSummaryProps) {
  const router = useRouter();
  const [status, setStatus] = useState<KaneAccountStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshAccount = useCallback(async () => {
    try {
      const res = await fetch("/api/kane/account", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as KaneAccountStatus;
      setStatus(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshAccount();
  }, [refreshAccount, refreshNonce]);

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

  return (
    <section className="surface-card w-full text-left" aria-label="Account summary">
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
            <p className="mt-1 text-sm text-steel">—</p>
          )}
        </div>
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
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-steel-line/80 pt-4 text-sm">
        <div>
          <dt className="text-steel-soft">Available credits</dt>
          <dd className="font-medium tabular-nums text-ink">
            {connected && status?.availableCredits != null
              ? status.availableCredits.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : connected
                ? "—"
                : demoMode
                  ? "Uses local account"
                  : "—"}
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

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={LT_BILLING}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm !px-4 !py-2"
        >
          Top up credits
        </a>
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