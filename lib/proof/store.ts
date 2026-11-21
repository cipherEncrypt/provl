import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ProofRecord } from "./types";

const RUNS_DIR = join(process.cwd(), ".provl", "runs");

async function ensureDir() {
  await mkdir(RUNS_DIR, { recursive: true });
}

export async function saveProof(
  input: Omit<ProofRecord, "id" | "createdAt">,
): Promise<ProofRecord> {
  await ensureDir();
  const record: ProofRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await writeFile(
    join(RUNS_DIR, `${record.id}.json`),
    JSON.stringify(record, null, 2),
    "utf8",
  );
  return record;
}

export async function getProof(id: string): Promise<ProofRecord | null> {
  try {
    const raw = await readFile(join(RUNS_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as ProofRecord;
  } catch {
    return null;
  }
}

export type ProofHistoryItem = Pick<
  ProofRecord,
  "id" | "createdAt" | "task" | "done" | "creditsConsumed"
>;

/** File-backed session history (fallback when Mongo is off or unreachable). */
export async function listProofsForSession(
  sessionId: string,
): Promise<ProofHistoryItem[]> {
  await ensureDir();
  let names: string[];
  try {
    names = await readdir(RUNS_DIR);
  } catch {
    return [];
  }

  const items: ProofHistoryItem[] = [];
  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = await readFile(join(RUNS_DIR, name), "utf8");
      const record = JSON.parse(raw) as ProofRecord;
      if (record.sessionId && record.sessionId !== sessionId) continue;
      if (!record.sessionId) continue;
      items.push({
        id: record.id,
        createdAt: record.createdAt,
        task: record.task,
        done: record.done,
        creditsConsumed: record.creditsConsumed,
      });
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