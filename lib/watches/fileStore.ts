import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { WatchCreateInput, WatchListScope, WatchRecord } from "./types";

const WATCHES_DIR = join(process.cwd(), ".provl", "watches");

async function ensureDir() {
  await mkdir(WATCHES_DIR, { recursive: true });
}

function scopeFilter(scope: WatchListScope, record: WatchRecord): boolean {
  const userId = scope.userId?.trim();
  if (userId) return record.userId === userId;
  return (
    record.sessionId === scope.sessionId &&
    (record.userId == null || record.userId === "")
  );
}

export async function listWatchesFile(
  scope: WatchListScope,
): Promise<WatchRecord[]> {
  await ensureDir();
  let names: string[];
  try {
    names = await readdir(WATCHES_DIR);
  } catch {
    return [];
  }

  const items: WatchRecord[] = [];
  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = await readFile(join(WATCHES_DIR, name), "utf8");
      const record = JSON.parse(raw) as WatchRecord;
      if (!scopeFilter(scope, record)) continue;
      items.push(record);
    } catch {
      /* skip corrupt */
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return items;
}

export async function getWatchFile(id: string): Promise<WatchRecord | null> {
  try {
    const raw = await readFile(join(WATCHES_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as WatchRecord;
  } catch {
    return null;
  }
}

export async function saveWatchFile(record: WatchRecord): Promise<void> {
  await ensureDir();
  await writeFile(
    join(WATCHES_DIR, `${record.id}.json`),
    JSON.stringify(record, null, 2),
    "utf8",
  );
}

export async function createWatchFile(
  input: WatchCreateInput,
): Promise<WatchRecord> {
  const now = new Date().toISOString();
  const record: WatchRecord = {
    id: randomUUID(),
    sessionId: input.sessionId,
    userId: input.userId,
    task: input.task,
    url: input.url,
    schedule: input.schedule,
    alertEmail: input.alertEmail,
    active: true,
    lastStatus: "never",
    lastRunAt: null,
    lastProofId: null,
    createdAt: now,
    updatedAt: now,
  };
  await saveWatchFile(record);
  return record;
}

export async function deleteWatchFile(id: string): Promise<boolean> {
  try {
    await unlink(join(WATCHES_DIR, `${id}.json`));
    return true;
  } catch {
    return false;
  }
}

export async function listAllActiveWatchesFile(): Promise<WatchRecord[]> {
  await ensureDir();
  let names: string[];
  try {
    names = await readdir(WATCHES_DIR);
  } catch {
    return [];
  }
  const items: WatchRecord[] = [];
  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = await readFile(join(WATCHES_DIR, name), "utf8");
      const record = JSON.parse(raw) as WatchRecord;
      if (record.active) items.push(record);
    } catch {
      /* skip */
    }
  }
  return items;
}