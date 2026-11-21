import { taskSuggestsLogin } from "@/lib/run/loginHints";

import type { WatchSchedule } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseWatchSchedule(value: unknown): WatchSchedule | null {
  if (value === "hourly" || value === "daily") return value;
  return null;
}

export function validateWatchCreate(body: {
  task?: string;
  url?: string;
  schedule?: unknown;
  alertEmail?: string;
}): { ok: true; data: { task: string; url?: string; schedule: WatchSchedule; alertEmail: string } } | { ok: false; error: string } {
  const task = body.task?.trim();
  if (!task) return { ok: false, error: "task is required" };

  if (taskSuggestsLogin(task)) {
    return {
      ok: false,
      error:
        "Scheduled tasks don't support logins yet. Remove login wording and {{placeholders}} from the task.",
    };
  }

  const schedule = parseWatchSchedule(body.schedule);
  if (!schedule) {
    return { ok: false, error: "schedule must be hourly or daily" };
  }

  const alertEmail = body.alertEmail?.trim();
  if (!alertEmail || !EMAIL_RE.test(alertEmail)) {
    return { ok: false, error: "A valid alert email is required" };
  }

  const url = body.url?.trim() || undefined;
  return { ok: true, data: { task, url, schedule, alertEmail } };
}