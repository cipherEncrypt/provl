import type { ExecuteRunResult } from "@/lib/provl/executeRunAndSaveProof";
import type { WatchRecord } from "@/lib/watches/types";

import {
  sendWatchFailureEmail,
  type WatchAlertSendResult,
} from "./sendWatchFailureEmail";

export async function notifyWatchFailureIfNeeded(
  watch: WatchRecord,
  result: Pick<ExecuteRunResult, "done" | "proofId" | "oneLiner">,
): Promise<WatchAlertSendResult | null> {
  if (result.done) return null;
  return sendWatchFailureEmail(watch, result.proofId, result.oneLiner);
}