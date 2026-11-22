import type { Collection, Filter } from "mongodb";

import { getMongoDb } from "./mongoClient";
import { HISTORY_LIST_LIMIT } from "./historyLimits";
import type { RunHistoryInsert, RunHistoryItem, RunHistoryListScope } from "./historyTypes";

const COLLECTION = "runs";

type RunHistoryDoc = {
  sessionId: string;
  userId: string | null;
  done: boolean;
  task: string;
  url?: string | null;
  creditsConsumed: number | null;
  durationSec: number | null;
  proofId: string;
  createdAt: Date;
};

async function runsCollection(): Promise<Collection<RunHistoryDoc> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<RunHistoryDoc>(COLLECTION);
}

export async function insertRunHistoryMongo(
  entry: RunHistoryInsert,
): Promise<boolean> {
  const coll = await runsCollection();
  if (!coll) return false;

  try {
    await coll.insertOne({
      sessionId: entry.sessionId,
      userId: entry.userId,
      done: entry.done,
      task: entry.task,
      url: entry.url ?? null,
      creditsConsumed: entry.creditsConsumed,
      durationSec: entry.durationSec,
      proofId: entry.proofId,
      createdAt: new Date(entry.createdAt),
    });
    return true;
  } catch {
    console.warn("[provl] MongoDB history insert failed; file store still has the proof.");
    return false;
  }
}

function listFilter(scope: RunHistoryListScope): Filter<RunHistoryDoc> {
  const userId = scope.userId?.trim();
  if (userId) {
    return { userId };
  }
  const sessionId = scope.sessionId.trim();
  return {
    sessionId,
    $or: [{ userId: null }, { userId: { $exists: false } }],
  };
}

export async function listRunHistoryMongo(
  scope: RunHistoryListScope,
): Promise<RunHistoryItem[] | null> {
  const coll = await runsCollection();
  if (!coll) return null;

  const userId = scope.userId?.trim();
  if (userId) {
    // Connected Kane account: history is account-wide, never unscoped.
  } else if (!scope.sessionId.trim()) {
    return [];
  }

  try {
    const docs = await coll
      .find(listFilter(scope))
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIST_LIMIT)
      .toArray();

    return docs.map((doc) => ({
      id: doc.proofId,
      createdAt: doc.createdAt.toISOString(),
      task: doc.task,
      done: doc.done,
      creditsConsumed: doc.creditsConsumed,
    }));
  } catch {
    console.warn("[provl] MongoDB history read failed; falling back to files.");
    return null;
  }
}