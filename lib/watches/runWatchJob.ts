import { notifyWatchFailureIfNeeded } from "@/lib/alerts/notifyWatchFailure";
import { executeRunAndSaveProof } from "@/lib/provl/executeRunAndSaveProof";

import type { WatchRecord } from "./types";
import { recordWatchRun } from "./watchStore";
import { secretsRowsForRun } from "./watchSecrets";

export async function runWatchJob(watch: WatchRecord) {
  const secretRows = secretsRowsForRun(watch.secretsEnc);
  const result = await executeRunAndSaveProof({
    sessionId: watch.sessionId,
    task: watch.task,
    url: watch.url,
    ...(secretRows.length > 0 ? { secrets: secretRows } : {}),
  });

  const ranAt = new Date().toISOString();
  const updated = await recordWatchRun(watch, {
    lastStatus: result.done ? "done" : "not_done",
    lastRunAt: ranAt,
    lastProofId: result.proofId,
  });

  await notifyWatchFailureIfNeeded(updated, result);

  return { watch: updated, result };
}