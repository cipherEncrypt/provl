import { isMongoConfigured } from "@/lib/proof/mongoClient";

import {
  createWatchFile,
  deleteWatchFile,
  getWatchFile,
  listAllActiveWatchesFile,
  listWatchesFile,
  saveWatchFile,
} from "./fileStore";
import {
  deleteWatchMongo,
  getWatchMongo,
  insertWatchMongo,
  listAllActiveWatchesMongo,
  listWatchesMongo,
  updateWatchMongo,
} from "./mongoWatches";
import type {
  WatchCreateInput,
  WatchListScope,
  WatchRecord,
  WatchUpdateAfterRun,
} from "./types";

export async function listWatches(scope: WatchListScope): Promise<WatchRecord[]> {
  if (isMongoConfigured()) {
    const fromMongo = await listWatchesMongo(scope);
    if (fromMongo !== null) return fromMongo;
  }
  return listWatchesFile(scope);
}

export async function getWatch(id: string): Promise<WatchRecord | null> {
  if (isMongoConfigured()) {
    const fromMongo = await getWatchMongo(id);
    if (fromMongo) return fromMongo;
  }
  return getWatchFile(id);
}

export async function createWatch(
  input: WatchCreateInput,
): Promise<WatchRecord> {
  const record = await createWatchFile(input);
  if (isMongoConfigured()) {
    await insertWatchMongo(record);
  }
  return record;
}

export async function saveWatch(record: WatchRecord): Promise<void> {
  record.updatedAt = new Date().toISOString();
  await saveWatchFile(record);
  if (isMongoConfigured()) {
    await updateWatchMongo(record);
  }
}

export async function deleteWatch(id: string): Promise<boolean> {
  const fileOk = await deleteWatchFile(id);
  if (isMongoConfigured()) {
    await deleteWatchMongo(id);
  }
  return fileOk;
}

export async function recordWatchRun(
  watch: WatchRecord,
  update: WatchUpdateAfterRun,
): Promise<WatchRecord> {
  const next: WatchRecord = {
    ...watch,
    lastStatus: update.lastStatus,
    lastRunAt: update.lastRunAt,
    lastProofId: update.lastProofId,
    updatedAt: new Date().toISOString(),
  };
  await saveWatch(next);
  return next;
}

export async function listAllActiveWatches(): Promise<WatchRecord[]> {
  if (isMongoConfigured()) {
    const fromMongo = await listAllActiveWatchesMongo();
    if (fromMongo !== null) return fromMongo;
  }
  return listAllActiveWatchesFile();
}

export function watchOwnedBySession(
  watch: WatchRecord,
  scope: WatchListScope,
): boolean {
  const userId = scope.userId?.trim();
  if (userId) return watch.userId === userId;
  return (
    watch.sessionId === scope.sessionId &&
    (watch.userId == null || watch.userId === "")
  );
}