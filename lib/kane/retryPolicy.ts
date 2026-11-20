import type { KaneRunEnd } from "./types";

/**
 * Whether to spend another Kane attempt after a non-passing run.
 *
 * Do NOT retry when Kane emitted run_end with status "failed" (e.g.
 * assertion_error.step_not_achievable) — that is an honest "can't be done."
 *
 * Retry only when the run did not produce a verdict: timeout (exit 3), or
 * no run_end (crash / truncated stream). Exit 2 without run_end is config/auth.
 */
export function shouldRetryKaneRun(
  exitCode: number,
  runEnd: KaneRunEnd | null,
): boolean {
  if (runEnd?.status === "failed") return false;
  if (runEnd) return false;

  if (exitCode === 3) return true;
  if (exitCode === 2) return false;

  return true;
}