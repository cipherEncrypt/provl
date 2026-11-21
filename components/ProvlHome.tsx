"use client";

import { useState } from "react";

import type { RunApiResponse } from "@/lib/api-types";

import { DemoPresets } from "./DemoPresets";
import { PillTag } from "./PillTag";
import { ResultCard } from "./ResultCard";
import { RunForm } from "./RunForm";
import { RunLoading } from "./RunLoading";
import { SiteHeader } from "./SiteHeader";

export function ProvlHome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunApiResponse | null>(null);
  const [task, setTask] = useState("");
  const [url, setUrl] = useState("");

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
    } catch {
      setError("Could not reach the server. Is npm run dev running?");
    } finally {
      setLoading(false);
    }
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
        <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-10 pt-6 text-center sm:px-6 sm:pt-12">
          <PillTag label="Verified by Kane CLI" />

          <h1 className="mt-5 text-balance text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-ink sm:mt-6 sm:text-5xl sm:leading-[1.08]">
            Get proof it was actually done.
          </h1>

          <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-steel sm:mt-4 sm:text-lg">
            Tell Provl a web task in plain English. It runs in a real browser and
            returns a verdict you can replay - not an unverified “done.”
          </p>

          <div className="mt-7 w-full text-left sm:mt-10">
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
