import { NextResponse } from "next/server";

import { runKaneWithRetry } from "@/lib/kane/runWithRetry";
import {
  addSessionCredits,
  getKaneAccount,
} from "@/lib/provl/kaneAccountStore";
import { ensureSessionId, getSessionId } from "@/lib/provl/session";
import { saveProof } from "@/lib/proof/store";

export const maxDuration = 600;

export async function POST(req: Request) {
  let body: { task?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const task = body.task?.trim();
  const url = body.url?.trim() || undefined;

  if (!task) {
    return NextResponse.json({ error: "task is required" }, { status: 400 });
  }

  const sessionId = await ensureSessionId();
  const connected = await getKaneAccount(sessionId);

  const result = await runKaneWithRetry({
    task,
    url,
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

  const proof = await saveProof({
    sessionId,
    task,
    url,
    done: result.done,
    exitCode: result.exitCode,
    replayUrl: result.replayUrl,
    oneLiner: result.oneLiner,
    summary: result.summary,
    finalState: result.finalState,
    duration: result.duration,
    creditsConsumed: result.creditsConsumed,
    honestStop: result.honestStop,
    attempts: result.attempts,
  });

  const proofUrl = `/proof/${proof.id}`;

  return NextResponse.json(
    {
      done: result.done,
      exitCode: result.exitCode,
      replayUrl: result.replayUrl,
      oneLiner: result.oneLiner,
      summary: result.summary,
      finalState: result.finalState,
      duration: result.duration,
      creditsConsumed: result.creditsConsumed,
      honestStop: result.honestStop,
      attempts: result.attempts,
      proofId: proof.id,
      proofUrl,
    },
    { status: result.done ? 200 : 422 },
  );
}