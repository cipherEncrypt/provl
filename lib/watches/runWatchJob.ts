import { executeRunAndSaveProof } from "@/lib/provl/executeRunAndSaveProof";

import type { WatchRecord } from "./types";
import { recordWatchRun } from "./watchStore";

export async function runWatchJob(watch: WatchRecord) {
  const result = await executeRunAndSaveProof({
    sessionId: watch.sessionId,
    task: watch.task,
    url: watch.url,
  });

  const ranAt = new Date().toISOString();
  const updated = await recordWatchRun(watch, {
    lastStatus: result.done ? "done" : "not_done",
    lastRunAt: ranAt,
    lastProofId: result.proofId,
  });

  return { watch: updated, result };
}