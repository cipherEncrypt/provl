"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus } from "@/lib/api-types";

import { KaneConnectForm } from "./KaneConnectForm";
import { SiteHeader } from "./SiteHeader";

export function ConnectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/kane/account", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as KaneAccountStatus;
        if (cancelled) return;
        if (data.connected) {
          router.replace("/dashboard");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader variant="workbench" />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        {checking ? (
          <p className="text-center text-sm text-steel">Checking session…</p>
        ) : (
          <KaneConnectForm />
        )}
      </main>
    </div>
  );
}