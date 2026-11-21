import type { ExecuteRunResult } from "@/lib/provl/executeRunAndSaveProof";
import type { WatchRecord } from "@/lib/watches/types";

import { sendWatchFailureEmail } from "./sendWatchFailureEmail";

export async function notifyWatchFailureIfNeeded(
  watch: WatchRecord,
  result: Pick<ExecuteRunResult, "done" | "proofId" | "oneLiner">,
): Promise<void> {
  if (result.done) return;
  await sendWatchFailureEmail(watch, result.proofId, result.oneLiner);
}