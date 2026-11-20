import { NextResponse } from "next/server";

import { runKaneWithRetry } from "@/lib/kane/runWithRetry";
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

  const result = await runKaneWithRetry({ task, url });

  const proof = await saveProof({
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