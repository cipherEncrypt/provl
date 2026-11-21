import type { Collection } from "mongodb";

import { getMongoDb } from "./mongoClient";
import type { RunHistoryInsert, RunHistoryItem } from "./historyTypes";

const COLLECTION = "runs";

type RunHistoryDoc = {
  sessionId: string;
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

export async function listRunHistoryMongo(
  sessionId: string,
): Promise<RunHistoryItem[] | null> {
  const coll = await runsCollection();
  if (!coll) return null;

  try {
    const docs = await coll
      .find({ sessionId })
      .sort({ createdAt: -1 })
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