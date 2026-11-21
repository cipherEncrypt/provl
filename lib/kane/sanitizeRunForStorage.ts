import type { HonestStop } from "./types";
import { redactSecretsInRecord, redactSecretsInText } from "./secrets";

export function sanitizeStoredTask(
  task: string,
  secrets: Record<string, string>,
): string {
  return redactSecretsInText(task, secrets) ?? task;
}

export function sanitizeRunArtifacts(
  secrets: Record<string, string>,
  parts: {
    summary: string | null;
    oneLiner: string | null;
    finalState: Record<string, string>;
    honestStop: HonestStop | null;
  },
) {
  const honestStop = parts.honestStop
    ? {
        message: redactSecretsInText(parts.honestStop.message, secrets) ?? parts.honestStop.message,
        failedStepRemark: redactSecretsInText(
          parts.honestStop.failedStepRemark,
          secrets,
        ),
        reason: redactSecretsInText(parts.honestStop.reason, secrets),
      }
    : null;

  return {
    summary: redactSecretsInText(parts.summary, secrets),
    oneLiner: redactSecretsInText(parts.oneLiner, secrets),
    finalState: redactSecretsInRecord(parts.finalState, secrets),
    honestStop,
  };
}