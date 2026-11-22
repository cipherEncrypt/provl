"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DashboardEmpty,
  DashboardError,
  DashboardIntro,
  DashboardLoading,
} from "./DashboardStates";
import { DashboardViewColumn } from "./DashboardViewColumn";

type HistoryRun = {
  id: string;
  createdAt: string;
  task: string;
  done: boolean;
  creditsConsumed: number | null;
};

function truncateTask(task: string, max = 88): string {
  const oneLine = task.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export function DashboardHistoryView() {
  const [runs, setRuns] = useState<HistoryRun[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadError(null);
      try {
        const res = await fetch("/api/provl/history", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setRuns([]);
            setLoadError("Could not load history. Try again in a moment.");
          }
          return;
        }
        const data = (await res.json()) as { runs: HistoryRun[] };
        if (!cancelled) setRuns(data.runs);
      } catch {
        if (!cancelled) {
          setRuns([]);
          setLoadError("Could not reach the server. Is npm run dev running?");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (runs === null) {
    return (
      <DashboardViewColumn>
        <DashboardLoading label="Loading history…" />
      </DashboardViewColumn>
    );
  }

  return (
    <DashboardViewColumn>
      <DashboardIntro>
        Past runs for this browser session. Open any row to view the shareable
        proof page.
      </DashboardIntro>

      {loadError ? <DashboardError message={loadError} /> : null}

      {!loadError && runs.length === 0 ? (
        <DashboardEmpty>
          No runs yet.{" "}
          <Link
            href="/dashboard"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Run your first task
          </Link>{" "}
          on the Run tab.
        </DashboardEmpty>
      ) : null}

      {runs.length > 0 ? (
      <ul className="divide-y divide-steel-line rounded-card border border-steel-line bg-paper shadow-soft">
        {runs.map((run) => {
          const when = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(run.createdAt));
          const credits =
            run.creditsConsumed != null
              ? run.creditsConsumed.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : "-";

          return (
            <li
              key={run.id}
              className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide ${
                      run.done
                        ? "bg-ink text-white"
                        : "border border-steel-line bg-mist text-ink"
                    }`}
                  >
                    {run.done ? "DONE" : "NOT DONE"}
                  </span>
                  <span className="text-xs text-steel-soft">{when}</span>
                </div>
                <p className="mt-1 text-sm text-ink">{truncateTask(run.task)}</p>
                <p className="mt-1 text-xs text-steel">
                  Credits: <span className="tabular-nums">{credits}</span>
                </p>
              </div>
              <Link
                href={`/proof/${run.id}`}
                className="btn-secondary shrink-0 text-sm"
              >
                View proof
              </Link>
            </li>
          );
        })}
      </ul>
      ) : null}
    </DashboardViewColumn>
  );
}