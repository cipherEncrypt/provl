import type { WatchSchedule } from "./types";
import { validateWatchSecretsForTask } from "./watchSecrets";

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
  secrets?: { key: string; value: string }[];
}):
  | {
      ok: true;
      data: {
        task: string;
        url?: string;
        schedule: WatchSchedule;
        alertEmail: string;
        secrets?: { key: string; value: string }[];
      };
    }
  | { ok: false; error: string } {
  const task = body.task?.trim();
  if (!task) return { ok: false, error: "task is required" };

  const schedule = parseWatchSchedule(body.schedule);
  if (!schedule) {
    return { ok: false, error: "schedule must be hourly or daily" };
  }

  const alertEmail = body.alertEmail?.trim() ?? "";
  if (alertEmail && !EMAIL_RE.test(alertEmail)) {
    return { ok: false, error: "Alert email must be valid when provided" };
  }

  const secretsCheck = validateWatchSecretsForTask(task, body.secrets);
  if (!secretsCheck.ok) return secretsCheck;

  const url = body.url?.trim() || undefined;
  const secrets = body.secrets?.filter((r) => r.key?.trim() && r.value);
  return {
    ok: true,
    data: {
      task,
      url,
      schedule,
      alertEmail,
      ...(secrets?.length ? { secrets } : {}),
    },
  };
}