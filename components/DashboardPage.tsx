"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { KaneAccountStatus, RunApiResponse } from "@/lib/api-types";

import { DemoPresets } from "./DemoPresets";
import { KaneAccountSummary } from "./KaneAccountSummary";
import { PillTag } from "./PillTag";
import { ResultCard } from "./ResultCard";
import { RunForm } from "./RunForm";
import { RunLoading } from "./RunLoading";
import { SiteHeader } from "./SiteHeader";

export function DashboardPage() {
  const router = useRouter();
  const [gateReady, setGateReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunApiResponse | null>(null);
  const [task, setTask] = useState("");
  const [url, setUrl] = useState("");
  const [accountRefresh, setAccountRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/kane/account", { cache: "no-store" });
        if (!res.ok) {
          router.replace("/connect");
          return;
        }
        const data = (await res.json()) as KaneAccountStatus;
        if (cancelled) return;
        if (!data.connected && !data.demoMode) {
          router.replace("/connect");
          return;
        }
        setGateReady(true);
      } catch {
        if (!cancelled) router.replace("/connect");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function runTask(runTaskText: string, runUrl: string) {
    setTask(runTaskText);
    setUrl(runUrl);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/kane/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: runTaskText, url: runUrl || undefined }),
      });

      const data = (await res.json().catch(() => ({}))) as RunApiResponse;
      if (data.error && !data.summary && !data.honestStop) {
        setError(data.error);
        return;
      }
      if (!data.summary && !data.honestStop && !data.oneLiner) {
        setError("Run finished without a readable result from Kane.");
        return;
      }
      setResult(data);
      setAccountRefresh((n) => n + 1);
    } catch {
      setError("Could not reach the server. Is npm run dev running?");
    } finally {
      setLoading(false);
    }
  }

  if (!gateReady) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader variant="workbench" />
        <p className="mx-auto mt-24 text-sm text-steel">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#run"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to task
      </a>

      <SiteHeader variant="workbench" />

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-10 pt-6 text-center sm:px-6 sm:pt-10">
          <PillTag label="Verified by Kane CLI" />

          <h1 className="mt-5 text-balance text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Run a task
          </h1>

          <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-steel sm:text-base">
            Plain English in, Kane-run proof out.
          </p>

          <div className="mt-7 w-full text-left sm:mt-8">
            <KaneAccountSummary refreshNonce={accountRefresh} />

            <div className="mt-5">
              <RunForm
                disabled={loading}
                task={task}
                url={url}
                onTaskChange={setTask}
                onUrlChange={setUrl}
                onSubmit={runTask}
              />
            </div>

            <div className="mt-5 w-full">
              <DemoPresets
                disabled={loading}
                onRunPreset={(t, u) => {
                  void runTask(t, u);
                }}
              />
            </div>

            {(loading || error || result) && (
              <div className="mt-6 w-full space-y-4 text-left">
                {loading && <RunLoading />}

                {error && (
                  <p
                    className="rounded-card border border-steel-line bg-paper px-4 py-3 text-sm text-ink shadow-soft"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {result && !loading && (
                  <ResultCard
                    result={result}
                    proofUrl={result.proofUrl ?? null}
                    showShareHint={Boolean(result.proofUrl)}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-steel-line/80 pb-[env(safe-area-inset-bottom)]">
        <p className="mx-auto max-w-xl px-4 py-5 text-center text-xs text-steel-soft sm:px-6">
          Verified by Kane CLI · Runs on real Chrome · runs take 1–3 minutes
        </p>
      </footer>
    </div>
  );
}