"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus } from "@/lib/api-types";

async function fetchAccount(refreshBalance: boolean): Promise<KaneAccountStatus | null> {
  const url = refreshBalance
    ? "/api/kane/account?refreshBalance=1"
    : "/api/kane/account";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as KaneAccountStatus;
}

export function useDashboardGate() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<KaneAccountStatus | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  const applyGate = useCallback(
    (data: KaneAccountStatus | null) => {
      if (!data) {
        router.replace("/connect");
        return false;
      }
      if (!data.connected && !data.demoMode) {
        router.replace("/connect");
        return false;
      }
      setStatus(data);
      setReady(true);
      return true;
    },
    [router],
  );

  const refreshBalance = useCallback(async () => {
    setCreditsLoading(true);
    try {
      const data = await fetchAccount(true);
      if (data) setStatus(data);
    } finally {
      setCreditsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchAccount(false);
      return applyGate(data) ? data : null;
    } catch {
      router.replace("/connect");
      return null;
    }
  }, [applyGate, router]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchAccount(false);
        if (cancelled) return;
        if (!applyGate(data)) return;
        if (data?.connected) {
          setCreditsLoading(true);
          const fresh = await fetchAccount(true);
          if (!cancelled && fresh) setStatus(fresh);
          if (!cancelled) setCreditsLoading(false);
        }
      } catch {
        if (!cancelled) router.replace("/connect");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyGate, router]);

  useEffect(() => {
    const onRefresh = () => void refreshBalance();
    window.addEventListener("provl:account-refresh", onRefresh);
    return () => window.removeEventListener("provl:account-refresh", onRefresh);
  }, [refreshBalance]);

  const signOut = useCallback(async () => {
    await fetch("/api/kane/connect", { method: "DELETE" });
    await fetch("/api/kane/demo-mode", { method: "DELETE" });
    router.replace("/connect");
    router.refresh();
  }, [router]);

  return { ready, status, creditsLoading, refreshBalance, refresh, signOut };
}