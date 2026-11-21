import { listProofsForSession } from "./store";
import type {
  RunHistoryInsert,
  RunHistoryItem,
  RunHistoryListScope,
} from "./historyTypes";
import {
  insertRunHistoryMongo,
  listRunHistoryMongo,
} from "./mongoHistory";
import { isMongoConfigured } from "./mongoClient";

/**
 * Active history source for this request: Mongo when configured + reachable, else files.
 * Connected users: Mongo query by Kane username (userId). Demo: Mongo by sessionId.
 * File fallback always scopes by sessionId only.
 */
export async function listRunHistory(
  scope: RunHistoryListScope,
): Promise<RunHistoryItem[]> {
  if (isMongoConfigured()) {
    const fromMongo = await listRunHistoryMongo(scope);
    if (fromMongo !== null) return fromMongo;
  }
  return listProofsForSession(scope.sessionId);
}

/** Records history in Mongo when available (proof JSON always written separately). */
export async function appendRunHistory(entry: RunHistoryInsert): Promise<void> {
  if (!isMongoConfigured()) return;
  await insertRunHistoryMongo(entry);
}