import type { Collection, Filter } from "mongodb";

import { getMongoDb } from "@/lib/proof/mongoClient";

import type { WatchListScope, WatchRecord } from "./types";

const COLLECTION = "watches";

type WatchDoc = Omit<WatchRecord, "createdAt" | "updatedAt" | "lastRunAt"> & {
  createdAt: Date;
  updatedAt: Date;
  lastRunAt: Date | null;
};

async function watchesCollection(): Promise<Collection<WatchDoc> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<WatchDoc>(COLLECTION);
}

function listFilter(scope: WatchListScope): Filter<WatchDoc> {
  const userId = scope.userId?.trim();
  if (userId) return { userId };
  return {
    sessionId: scope.sessionId,
    $or: [{ userId: null }, { userId: { $exists: false } }, { userId: "" }],
  };
}

function docToRecord(doc: WatchDoc): WatchRecord {
  return {
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    lastRunAt: doc.lastRunAt?.toISOString() ?? null,
  };
}

export async function listWatchesMongo(
  scope: WatchListScope,
): Promise<WatchRecord[] | null> {
  const coll = await watchesCollection();
  if (!coll) return null;

  try {
    const docs = await coll
      .find(listFilter(scope))
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(docToRecord);
  } catch {
    return null;
  }
}

export async function getWatchMongo(id: string): Promise<WatchRecord | null> {
  const coll = await watchesCollection();
  if (!coll) return null;
  try {
    const doc = await coll.findOne({ id });
    return doc ? docToRecord(doc) : null;
  } catch {
    return null;
  }
}

export async function insertWatchMongo(
  record: WatchRecord,
): Promise<boolean> {
  const coll = await watchesCollection();
  if (!coll) return false;
  try {
    await coll.insertOne({
      ...record,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      lastRunAt: record.lastRunAt ? new Date(record.lastRunAt) : null,
    });
    return true;
  } catch {
    return false;
  }
}

export async function updateWatchMongo(
  record: WatchRecord,
): Promise<boolean> {
  const coll = await watchesCollection();
  if (!coll) return false;
  try {
    await coll.replaceOne(
      { id: record.id },
      {
        ...record,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
        lastRunAt: record.lastRunAt ? new Date(record.lastRunAt) : null,
      },
      { upsert: true },
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteWatchMongo(id: string): Promise<boolean> {
  const coll = await watchesCollection();
  if (!coll) return false;
  try {
    const result = await coll.deleteOne({ id });
    return result.deletedCount > 0;
  } catch {
    return false;
  }
}

export async function listAllActiveWatchesMongo(): Promise<
  WatchRecord[] | null
> {
  const coll = await watchesCollection();
  if (!coll) return null;
  try {
    const docs = await coll.find({ active: true }).toArray();
    return docs.map(docToRecord);
  } catch {
    return null;
  }
}
