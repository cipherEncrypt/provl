import { notifyWatchFailureIfNeeded } from "@/lib/alerts/notifyWatchFailure";
import { executeRunAndSaveProof } from "@/lib/provl/executeRunAndSaveProof";

import type { WatchRecord } from "./types";
import { recordWatchRun } from "./watchStore";
import { decryptWatchSecrets, secretsRowsForRun } from "./watchSecrets";
import { taskForWatchRun } from "./watchTaskForRun";

export async function runWatchJob(watch: WatchRecord) {
  const secretRows = secretsRowsForRun(watch.secretsEnc);
  const secretsMap = decryptWatchSecrets(watch.secretsEnc);
  const task = taskForWatchRun(watch.task, secretsMap);
  const result = await executeRunAndSaveProof({
    sessionId: watch.sessionId,
    task,
    url: watch.url,
    ...(secretRows.length > 0 ? { secrets: secretRows } : {}),
  });

  const ranAt = new Date().toISOString();
  const updated = await recordWatchRun(watch, {
    lastStatus: result.done ? "done" : "not_done",
    lastRunAt: ranAt,
    lastProofId: result.proofId,
  });

  const alert = await notifyWatchFailureIfNeeded(updated, result);

  return { watch: updated, result, alert };
}