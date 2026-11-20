import { buildProvlResult } from "./parseNdjson";
import { shouldRetryKaneRun } from "./retryPolicy";
import { runKane } from "./runKane";
import type { ProvlRunResult, RunKaneOptions } from "./types";

const MAX_ATTEMPTS = 3;

function buildRetryTask(originalTask: string, previous: ProvlRunResult): string {
  const parts = [
    originalTask,
    "",
    "Previous Kane attempt failed. Use this feedback and try again:",
    previous.summary ? `Summary: ${previous.summary}` : null,
    previous.honestStop?.failedStepRemark
      ? `Failed step: ${previous.honestStop.failedStepRemark}`
      : null,
    previous.honestStop?.reason ? `Reason: ${previous.honestStop.reason}` : null,
    previous.oneLiner ? `One-liner: ${previous.oneLiner}` : null,
  ].filter(Boolean);

  return parts.join("\n");
}

/**
 * Closed loop: on failure, re-prompt Kane with its own output (up to MAX_ATTEMPTS).
 */
export async function runKaneWithRetry(
  options: RunKaneOptions,
): Promise<ProvlRunResult> {
  let task = options.task;
  let lastResult: ProvlRunResult | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { exitCode, stdout, stderr } = await runKane({
      ...options,
      task,
    });

    const result = buildProvlResult(exitCode, stdout, stderr, attempt);
    lastResult = result;

    if (result.done) return result;

    if (!shouldRetryKaneRun(exitCode, result.runEnd)) {
      return result;
    }

    if (attempt < MAX_ATTEMPTS) {
      task = buildRetryTask(options.task, result);
    }
  }

  return lastResult!;
}