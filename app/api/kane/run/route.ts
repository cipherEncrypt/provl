import { NextResponse } from "next/server";

import { normalizeSecretsInput } from "@/lib/kane/secrets";
import { executeRunAndSaveProof } from "@/lib/provl/executeRunAndSaveProof";
import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";

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
  await getKaneAccount(sessionId);

  const result = await executeRunAndSaveProof({
    sessionId,
    task,
    url,
    secrets:
      Object.keys(secrets).length > 0
        ? Object.entries(secrets).map(([key, value]) => ({ key, value }))
        : undefined,
  });

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
      proofId: result.proofId,
      proofUrl: result.proofUrl,
    },
    { status: result.done ? 200 : 422 },
  );
}