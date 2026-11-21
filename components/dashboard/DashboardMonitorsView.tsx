"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  taskNeedsStoredSecrets,
  taskSuggestsLogin,
} from "@/lib/run/loginHints";
import type { WatchLastStatus, WatchSchedule } from "@/lib/watches/types";

import {
  RunSecretsEditor,
  type SecretRow,
} from "../RunSecretsEditor";
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
  const [error, setError] = useState<string | null>(null);
  const [formTask, setFormTask] = useState(
    'Verify the subscription page shows "Cancel subscription" and is not already canceled.',
  );
  const [formUrl, setFormUrl] = useState("http://localhost:3000/demo/subscription");
  const [formSchedule, setFormSchedule] = useState<WatchSchedule>("daily");
  const [formEmail, setFormEmail] = useState("");
  const [secretRows, setSecretRows] = useState<SecretRow[]>([]);
  const [needsLoginToggle, setNeedsLoginToggle] = useState(false);
  const [creating, setCreating] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runNotice, setRunNotice] = useState<string | null>(null);

  const loadWatches = useCallback(async () => {
    try {
      const res = await fetch("/api/watches", { cache: "no-store" });
      if (!res.ok) {
        setWatches([]);
        return;
      }
      const data = (await res.json()) as { watches: WatchRow[] };
      setWatches(data.watches);
    } catch {
      setWatches([]);
    }
  }, []);

  useEffect(() => {
    void loadWatches();
  }, [loadWatches]);

  const secretsVisible =
    taskSuggestsLogin(formTask) ||
    needsLoginToggle ||
    taskNeedsStoredSecrets(formTask);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: formTask.trim(),
          url: formUrl.trim() || undefined,
          schedule: formSchedule,
          alertEmail: formEmail.trim(),
          secrets: secretRows
            .map((r) => ({ key: r.key.trim(), value: r.value }))
            .filter((r) => r.key && r.value),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not create monitor");
        return;
      }
      await loadWatches();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRunNow(id: string) {
    setRunningId(id);
    setError(null);
    setRunNotice(null);
    try {
      const res = await fetch(`/api/watches/${id}/run`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        run?: { done?: boolean; proofUrl?: string };
        alert?: { sent?: boolean; detail?: string } | null;
      };
      if (data.error && !data.run) {
        setError(data.error);
        return;
      }
      const done = Boolean(data.run?.done);
      if (done) {
        setRunNotice("Run finished: DONE. Proof is ready.");
      } else if (data.alert?.sent) {
        setRunNotice(
          "Run finished: NOT DONE. Proof saved and we sent an alert email.",
        );
      } else if (data.alert?.detail) {
        setRunNotice(
          `Run finished: NOT DONE. Proof saved. Email not sent: ${data.alert.detail}`,
        );
      } else {
        setRunNotice(
          "Run finished: NOT DONE. Proof saved (no alert email configured).",
        );
      }
      await loadWatches();
      window.dispatchEvent(new Event("provl:account-refresh"));
    } catch {
      setError("Run now failed. Is the dev server running?");
    } finally {
      setRunningId(null);
    }
  }

  async function toggleActive(watch: WatchRow) {
    try {
      await fetch(`/api/watches/${watch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !watch.active }),
      });
      await loadWatches();
    } catch {
      setError("Could not update monitor.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this monitor?")) return;
    try {
      await fetch(`/api/watches/${id}`, { method: "DELETE" });
      await loadWatches();
    } catch {
      setError("Could not delete monitor.");
    }
  }

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
        Describe what to check in plain English. If the site needs a sign-in,
        turn on &quot;This task needs me to sign in&quot; and enter your email
        and password below.
      </p>

      <form
        onSubmit={handleCreate}
        className="surface-card mt-8 flex flex-col gap-4"
        autoComplete="off"
      >
        <h2 className="text-sm font-semibold text-ink">New monitor</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-steel">Task</span>
          <textarea
            required
            rows={3}
            disabled={creating}
            value={formTask}
            onChange={(e) => setFormTask(e.target.value)}
            className="field-input min-h-[5rem] resize-y text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-steel">URL (optional)</span>
          <input
            type="url"
            disabled={creating}
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            className="field-input text-sm"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-steel">Schedule</span>
            <select
              disabled={creating}
              value={formSchedule}
              onChange={(e) =>
                setFormSchedule(e.target.value as WatchSchedule)
              }
              className="field-input text-sm"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-steel">Alert email</span>
            <input
              type="email"
              required
              disabled={creating}
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input text-sm"
            />
          </label>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-steel">
          <input
            type="checkbox"
            disabled={creating}
            checked={needsLoginToggle}
            onChange={(e) => setNeedsLoginToggle(e.target.checked)}
            className="size-4 shrink-0 rounded border-steel-line accent-ink"
          />
          <span>This task needs me to sign in</span>
        </label>
        {secretsVisible ? (
          <RunSecretsEditor
            variant="signIn"
            context="monitor"
            disabled={creating}
            rows={secretRows}
            onChange={setSecretRows}
          />
        ) : null}
        <button
          type="submit"
          disabled={creating}
          className="btn-secondary w-full text-sm sm:w-auto"
        >
          {creating ? "Saving…" : "Save monitor"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-card border border-steel-line bg-paper px-4 py-3 text-sm text-ink" role="alert">
          {error}
        </p>
      )}
      {runNotice && (
        <p className="mt-4 rounded-card border border-steel-line bg-mist px-4 py-3 text-sm text-ink" role="status">
          {runNotice}
        </p>
      )}

      {watches.length === 0 ? (
        <div className="surface-card mt-8 text-sm text-steel">
          No monitors yet. Save one above, then use{" "}
          <strong className="font-medium text-ink">Run now</strong> to demo without
          waiting for the schedule.
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
            const isRunning = runningId === watch.id;

            return (
              <li
                key={watch.id}
                className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-start lg:justify-between"
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
                    {" · "}
                    <span className="text-steel-mute">{watch.alertEmail}</span>
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:max-w-md">
                  <button
                    type="button"
                    disabled={isRunning || Boolean(runningId)}
                    onClick={() => void handleRunNow(watch.id)}
                    className="btn-primary w-full text-base shadow-btn sm:min-w-[9.5rem] sm:flex-1"
                  >
                    {isRunning ? "Running in browser…" : "Run now"}
                  </button>
                  {watch.lastProofId ? (
                    <Link
                      href={`/proof/${watch.lastProofId}`}
                      className="btn-secondary w-full text-center text-sm sm:w-auto"
                    >
                      Latest proof
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => void toggleActive(watch)}
                    className="btn-secondary w-full text-sm sm:w-auto"
                  >
                    {watch.active ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => void handleDelete(watch.id)}
                    className="btn-secondary w-full text-sm text-steel sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardViewColumn>
  );
}