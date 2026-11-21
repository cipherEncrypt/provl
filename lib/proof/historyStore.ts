import { listProofsForSession } from "./store";
import type { RunHistoryInsert, RunHistoryItem } from "./historyTypes";
import {
  insertRunHistoryMongo,
  listRunHistoryMongo,
} from "./mongoHistory";
import { isMongoConfigured } from "./mongoClient";

/**
 * Active history source for this request: Mongo when configured + reachable, else files.
 */
export async function listRunHistoryForSession(
  sessionId: string,
): Promise<RunHistoryItem[]> {
  if (isMongoConfigured()) {
    const fromMongo = await listRunHistoryMongo(sessionId);
    if (fromMongo !== null) return fromMongo;
  }
  return listProofsForSession(sessionId);
}

/** Records history in Mongo when available (proof JSON always written separately). */
export async function appendRunHistory(entry: RunHistoryInsert): Promise<void> {
  if (!isMongoConfigured()) return;
  await insertRunHistoryMongo(entry);
}