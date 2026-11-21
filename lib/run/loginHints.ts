import type { RunApiResponse } from "@/lib/api-types";
import type { HonestStop } from "@/lib/kane/types";

const LOGIN_TASK_PATTERN =
  /\b(log\s*in|login|sign\s*in)\b|\{\{[^}]+\}\}/i;

export function taskSuggestsLogin(task: string): boolean {
  return LOGIN_TASK_PATTERN.test(task);
}

export function taskNeedsStoredSecrets(task: string): boolean {
  return /\{\{[^}]+\}\}/.test(task);
}

function loginRelatedBlob(parts: (string | null | undefined)[]): string {
  return parts
    .filter((p): p is string => Boolean(p))
    .join("\n")
    .toLowerCase();
}

/** True when a failed run’s Kane output points at authentication. */
export function runFailedOnLoginStep(
  honestStop: HonestStop | null | undefined,
  summary: string | null | undefined,
  oneLiner: string | null | undefined,
): boolean {
  const blob = loginRelatedBlob([
    honestStop?.failedStepRemark,
    honestStop?.reason,
    honestStop?.message,
    summary,
    oneLiner,
  ]);
  return /\b(log\s*in|login|sign\s*in|sign-in)\b|password|username|credential|authenticate|authentication/.test(
    blob,
  );
}

export function shouldShowLoginSecretsHint(
  task: string,
  secretsCount: number,
  result: Pick<
    RunApiResponse,
    "done" | "honestStop" | "summary" | "oneLiner"
  >,
): boolean {
  if (result.done || secretsCount > 0) return false;
  if (!taskSuggestsLogin(task)) return false;
  return runFailedOnLoginStep(
    result.honestStop,
    result.summary,
    result.oneLiner,
  );
}

export const LOGIN_SECRETS_HINT =
  "This task needs a sign-in. Enter your email and password under “This task needs me to sign in,” then run again.";