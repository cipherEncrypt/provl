import { NextResponse } from "next/server";

import { sanitizeRunArtifacts, sanitizeStoredTask } from "@/lib/kane/sanitizeRunForStorage";
import { normalizeSecretsInput } from "@/lib/kane/secrets";
import { runKaneWithRetry } from "@/lib/kane/runWithRetry";
import {
  addSessionCredits,
  getKaneAccount,
} from "@/lib/provl/kaneAccountStore";
import { ensureSessionId, getSessionId } from "@/lib/provl/session";
import { appendRunHistory } from "@/lib/proof/historyStore";
import { saveProof } from "@/lib/proof/store";

export const maxDuration = 600;

export async function POST(req: Request) {
  let body: { task?: string; url?: string; secrets?: { key: string; value: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const task = body.task?.trim();
  const url = body.url?.trim() || undefined;
  const secrets = normalizeSecretsInput(body.secrets);

  if (!task) {
    return NextResponse.json({ error: "task is required" }, { status: 400 });
  }

  const sessionId = await ensureSessionId();
  const connected = await getKaneAccount(sessionId);

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

  if (sessionId && connected && result.creditsConsumed != null) {
    await addSessionCredits(sessionId, result.creditsConsumed);
  }

  const storedTask = sanitizeStoredTask(task, secrets);
  const safe = sanitizeRunArtifacts(secrets, {
    summary: result.summary,
    oneLiner: result.oneLiner,
    finalState: result.finalState,
    honestStop: result.honestStop,
  });

  const proof = await saveProof({
    sessionId,
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
    sessionId,
    userId: connected?.username?.trim() ?? null,
    proofId: proof.id,
    task: storedTask,
    url,
    done: proof.done,
    creditsConsumed: proof.creditsConsumed,
    durationSec: proof.duration,
    createdAt: proof.createdAt,
  });

  const proofUrl = `/proof/${proof.id}`;

  return NextResponse.json(
    {
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
      proofUrl,
    },
    { status: result.done ? 200 : 422 },
  );
}