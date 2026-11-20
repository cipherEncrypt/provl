"use client";

import Link from "next/link";
import { useState } from "react";

import type { RunApiResponse } from "@/lib/api-types";

import { DemoPresets } from "./DemoPresets";
import { ResultCard } from "./ResultCard";
import { RunForm } from "./RunForm";
import { RunLoading } from "./RunLoading";

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
    <div className="flex w-full flex-col gap-8">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-sm uppercase tracking-wide text-emerald-500/90">Provl</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Proof for web chores
        </h1>
        <p className="text-slate-400">
          Describe a task in plain English. Provl runs it in a real browser and
          returns a pass or fail you can trust.
        </p>
      </header>

      <DemoPresets
        disabled={loading}
        onRunPreset={(t, u) => {
          void runTask(t, u);
        }}
      />

      <RunForm
        disabled={loading}
        task={task}
        url={url}
        onTaskChange={setTask}
        onUrlChange={setUrl}
        onSubmit={runTask}
      />

      {loading && <RunLoading />}

      {error && (
        <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
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

      <p className="text-center text-sm text-slate-500">
        Sandbox cancel demo:{" "}
        <Link href="/demo/subscription" className="text-emerald-400 underline-offset-2 hover:underline">
          /demo/subscription
        </Link>
      </p>
    </div>
  );
}