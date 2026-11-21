import { sanitizeRunArtifacts, sanitizeStoredTask } from "@/lib/kane/sanitizeRunForStorage";
import { normalizeSecretsInput } from "@/lib/kane/secrets";
import { runKaneWithRetry } from "@/lib/kane/runWithRetry";
import type { HonestStop } from "@/lib/kane/types";
import {
  addSessionCredits,
  getKaneAccount,
} from "@/lib/provl/kaneAccountStore";
import { appendRunHistory } from "@/lib/proof/historyStore";
import { saveProof } from "@/lib/proof/store";

export type ExecuteRunInput = {
  sessionId: string;
  task: string;
  url?: string;
  secrets?: { key: string; value: string }[];
};

export type ExecuteRunResult = {
  done: boolean;
  exitCode: number;
  replayUrl: string | null;
  oneLiner: string | null;
  summary: string | null;
  finalState: Record<string, string>;
  duration: number | null;
  creditsConsumed: number | null;
  honestStop: HonestStop | null;
  attempts: number;
  proofId: string;
  proofUrl: string;
};

export async function executeRunAndSaveProof(
  input: ExecuteRunInput,
): Promise<ExecuteRunResult> {
  const task = input.task.trim();
  const url = input.url?.trim() || undefined;
  const secrets = normalizeSecretsInput(input.secrets);
  const connected = await getKaneAccount(input.sessionId);

  const result = await runKaneWithRetry({
    task,
    url,
    ...(Object.keys(secrets).length > 0 ? { variables: secrets } : {}),
    ...(connected
      ? {
          basicAuth: {
            username: connected.username,
            accessKey: connected.accessKey,
          },
        }
      : {}),
  });

  if (connected && result.creditsConsumed != null) {
    await addSessionCredits(input.sessionId, result.creditsConsumed);
  }

  const storedTask = sanitizeStoredTask(task, secrets);
  const safe = sanitizeRunArtifacts(secrets, {
    summary: result.summary,
    oneLiner: result.oneLiner,
    finalState: result.finalState,
    honestStop: result.honestStop,
  });

  const proof = await saveProof({
    sessionId: input.sessionId,
    task: storedTask,
    url,
    done: result.done,
    exitCode: result.exitCode,
    replayUrl: result.replayUrl,
    oneLiner: safe.oneLiner,
    summary: safe.summary,
    finalState: safe.finalState,
    duration: result.duration,
    creditsConsumed: result.creditsConsumed,
    honestStop: safe.honestStop,
    attempts: result.attempts,
  });

  await appendRunHistory({
    sessionId: input.sessionId,
    userId: connected?.username?.trim() ?? null,
    proofId: proof.id,
    task: storedTask,
    url,
    done: proof.done,
    creditsConsumed: proof.creditsConsumed,
    durationSec: proof.duration,
    createdAt: proof.createdAt,
  });

  return {
    done: result.done,
    exitCode: result.exitCode,
    replayUrl: result.replayUrl,
    oneLiner: safe.oneLiner,
    summary: safe.summary,
    finalState: safe.finalState,
    duration: result.duration,
    creditsConsumed: result.creditsConsumed,
    honestStop: safe.honestStop,
    attempts: result.attempts,
    proofId: proof.id,
    proofUrl: `/proof/${proof.id}`,
  };
}