import type { WatchRecord } from "./types";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function isWatchDue(watch: WatchRecord, now = Date.now()): boolean {
  if (!watch.active) return false;
  if (!watch.lastRunAt) return true;
  const last = new Date(watch.lastRunAt).getTime();
  if (Number.isNaN(last)) return true;
  const interval = watch.schedule === "hourly" ? HOUR_MS : DAY_MS;
  return now - last >= interval;
}