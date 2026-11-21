"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus } from "@/lib/api-types";

export function useDashboardGate() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<KaneAccountStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/kane/account", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/connect");
        return null;
      }
      const data = (await res.json()) as KaneAccountStatus;
      if (!data.connected && !data.demoMode) {
        router.replace("/connect");
        return null;
      }
      setStatus(data);
      setReady(true);
      return data;
    } catch {
      router.replace("/connect");
      return null;
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onRefresh = () => void refresh();
    window.addEventListener("provl:account-refresh", onRefresh);
    return () => window.removeEventListener("provl:account-refresh", onRefresh);
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch("/api/kane/connect", { method: "DELETE" });
    await fetch("/api/kane/demo-mode", { method: "DELETE" });
    router.replace("/connect");
    router.refresh();
  }, [router]);

  return { ready, status, refresh, signOut };
}