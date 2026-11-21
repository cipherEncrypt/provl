"use client";

import { useState } from "react";

import type { RunApiResponse } from "@/lib/api-types";

import { DemoPresets } from "../DemoPresets";
import { ResultCard } from "../ResultCard";
import { RunForm } from "../RunForm";
import { RunLoading } from "../RunLoading";

export function DashboardRunView() {
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
      window.dispatchEvent(new Event("provl:account-refresh"));
    } catch {
      setError("Could not reach the server. Is npm run dev running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="text-sm text-steel">
        Describe a web task in plain English. Provl runs it in real Chrome and
        returns a verdict you can share.
      </p>

      <div id="run" className="mt-6 scroll-mt-8">
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
        <div className="mt-6 space-y-4">
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
  );
}