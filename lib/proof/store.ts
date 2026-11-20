import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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