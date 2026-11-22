"use client";

import { useState } from "react";

import type { RunApiResponse } from "@/lib/api-types";
import { shouldShowLoginSecretsHint } from "@/lib/run/loginHints";

import { DemoPresets } from "../DemoPresets";
import { ResultCard } from "../ResultCard";
import { RunForm } from "../RunForm";
import { RunLoading } from "../RunLoading";
import { DashboardError } from "./DashboardStates";
import { DashboardViewColumn } from "./DashboardViewColumn";

export function DashboardRunView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunApiResponse | null>(null);
  const [task, setTask] = useState("");
  const [url, setUrl] = useState("");
  const [loginSecretsHint, setLoginSecretsHint] = useState(false);

  async function runTask(
    runTaskText: string,
    runUrl: string,
    secrets: { key: string; value: string }[] = [],
  ) {
    setTask(runTaskText);
    setUrl(runUrl);
    setLoading(true);
    setError(null);
    setResult(null);
    setLoginSecretsHint(false);

    try {
      const res = await fetch("/api/kane/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: runTaskText,
          url: runUrl || undefined,
          ...(secrets.length > 0 ? { secrets } : {}),
        }),
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
      setLoginSecretsHint(
        shouldShowLoginSecretsHint(runTaskText, secrets.length, data),
      );
      window.dispatchEvent(new Event("provl:account-refresh"));
    } catch {
      setError("Could not reach the server. Is npm run dev running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardViewColumn>
      <p className="text-sm leading-relaxed text-steel">
        Describe a web task in plain English. Provl runs it in real Chrome and
        returns a DONE or NOT DONE verdict you can share.
      </p>

      <div id="run" className="scroll-mt-8">
        <RunForm
          disabled={loading}
          task={task}
          url={url}
          onTaskChange={setTask}
          onUrlChange={setUrl}
          onSubmit={runTask}
        />
      </div>

      <div className="w-full min-w-0">
        <DemoPresets
          disabled={loading}
          onRunPreset={(t, u) => {
            void runTask(t, u, []);
          }}
        />
      </div>

      {(loading || error || result) && (
        <div className="w-full min-w-0 space-y-4">
          {loading && <RunLoading />}

          {error ? <DashboardError message={error} /> : null}

          {result && !loading && (
            <ResultCard
              result={result}
              proofUrl={result.proofUrl ?? null}
              showShareHint={Boolean(result.proofUrl)}
              loginSecretsHint={loginSecretsHint}
            />
          )}
        </div>
      )}
    </DashboardViewColumn>
  );
}