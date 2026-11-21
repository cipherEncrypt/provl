"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { WatchLastStatus, WatchSchedule } from "@/lib/watches/types";

import { DashboardViewColumn } from "./DashboardViewColumn";

type WatchRow = {
  id: string;
  task: string;
  url?: string;
  schedule: WatchSchedule;
  alertEmail: string;
  active: boolean;
  lastStatus: WatchLastStatus;
  lastRunAt: string | null;
  lastProofId: string | null;
  createdAt: string;
};

function statusLabel(status: WatchLastStatus): string {
  if (status === "done") return "DONE";
  if (status === "not_done") return "NOT DONE";
  return "Never run";
}

function truncateTask(task: string, max = 72): string {
  const oneLine = task.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export function DashboardMonitorsView() {
  const [watches, setWatches] = useState<WatchRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/watches", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setWatches([]);
          return;
        }
        const data = (await res.json()) as { watches: WatchRow[] };
        if (!cancelled) setWatches(data.watches);
      } catch {
        if (!cancelled) setWatches([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (watches === null) {
    return (
      <DashboardViewColumn>
        <p className="text-sm text-steel">Loading monitors…</p>
      </DashboardViewColumn>
    );
  }

  return (
    <DashboardViewColumn>
      <p className="text-sm leading-relaxed text-steel">
        Monitors re-run a saved task on a schedule and alert you when verification
        fails.
      </p>
      <p className="mt-3 rounded-card border border-steel-line bg-mist/80 px-4 py-3 text-sm text-steel">
        Scheduled tasks don&apos;t support logins yet.
      </p>

      {watches.length === 0 ? (
        <div className="surface-card mt-8 text-sm text-steel">
          No monitors yet. You&apos;ll be able to create one in the next step.
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-steel-line rounded-card border border-steel-line bg-paper shadow-soft">
          {watches.map((watch) => {
            const when = watch.lastRunAt
              ? new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(watch.lastRunAt))
              : "-";
            const status = statusLabel(watch.lastStatus);
            const done = watch.lastStatus === "done";

            return (
              <li
                key={watch.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide ${
                        watch.lastStatus === "never"
                          ? "border border-steel-line bg-paper text-steel"
                          : done
                            ? "bg-ink text-white"
                            : "border border-steel-line bg-mist text-ink"
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-xs text-steel-soft">
                      {watch.schedule} · {watch.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{truncateTask(watch.task)}</p>
                  <p className="mt-1 text-xs text-steel">
                    Last run: <span className="tabular-nums">{when}</span>
                    {watch.alertEmail ? (
                      <>
                        {" "}
                        · Alerts:{" "}
                        <span className="text-steel-mute">{watch.alertEmail}</span>
                      </>
                    ) : null}
                  </p>
                </div>
                {watch.lastProofId ? (
                  <Link
                    href={`/proof/${watch.lastProofId}`}
                    className="btn-secondary shrink-0 text-sm"
                  >
                    Latest proof
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </DashboardViewColumn>
  );
}