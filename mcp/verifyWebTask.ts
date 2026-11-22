import { executeRunAndSaveProof } from "../lib/provl/executeRunAndSaveProof";
import { proofPublicUrl } from "../lib/proof/proofPublicUrl";

import { MCP_SESSION_ID } from "./constants";

export type VerifyWebTaskResult = {
  verdict: "DONE" | "NOT_DONE";
  summary: string | null;
  proofUrl: string;
  replayUrl: string | null;
  durationSec: number | null;
  creditsConsumed: number | null;
};

export async function verifyWebTaskForMcp(input: {
  task: string;
  url?: string;
}): Promise<VerifyWebTaskResult> {
  const result = await executeRunAndSaveProof({
    sessionId: MCP_SESSION_ID,
    task: input.task.trim(),
    url: input.url?.trim() || undefined,
  });

  const summary =
    result.oneLiner?.trim() || result.summary?.trim() || null;

  return {
    verdict: result.done ? "DONE" : "NOT_DONE",
    summary,
    proofUrl: proofPublicUrl(result.proofId),
    replayUrl: result.replayUrl,
    durationSec: result.duration,
    creditsConsumed: result.creditsConsumed,
  };
}