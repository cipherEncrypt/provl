import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { decryptSecret, encryptSecret } from "./crypto";

const ACCOUNTS_DIR = path.join(process.cwd(), ".provl", "accounts");

type StoredRecord = {
  username: string;
  accessKeyEnc: string;
  availableCredits: number | null;
  creditsSpentSession: number;
  updatedAt: string;
};

function accountPath(sessionId: string): string {
  const safe = sessionId.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(ACCOUNTS_DIR, `${safe}.json`);
}

async function ensureDir(): Promise<void> {
  await mkdir(ACCOUNTS_DIR, { recursive: true });
}

export type KaneAccountSecrets = {
  username: string;
  accessKey: string;
  availableCredits: number | null;
  creditsSpentSession: number;
};

export async function saveKaneAccount(
  sessionId: string,
  username: string,
  accessKey: string,
  availableCredits: number,
): Promise<void> {
  await ensureDir();
  const record: StoredRecord = {
    username,
    accessKeyEnc: encryptSecret(accessKey),
    availableCredits,
    creditsSpentSession: 0,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(accountPath(sessionId), JSON.stringify(record), { mode: 0o600 });
}

export async function getKaneAccount(
  sessionId: string,
): Promise<KaneAccountSecrets | null> {
  try {
    const raw = await readFile(accountPath(sessionId), "utf8");
    const record = JSON.parse(raw) as StoredRecord;
    return {
      username: record.username,
      accessKey: decryptSecret(record.accessKeyEnc),
      availableCredits: record.availableCredits,
      creditsSpentSession: record.creditsSpentSession ?? 0,
    };
  } catch {
    return null;
  }
}

export async function deleteKaneAccount(sessionId: string): Promise<void> {
  try {
    await rm(accountPath(sessionId), { force: true });
  } catch {
    /* noop */
  }
}

export async function addSessionCredits(
  sessionId: string,
  credits: number,
): Promise<void> {
  if (!Number.isFinite(credits) || credits <= 0) return;
  try {
    const raw = await readFile(accountPath(sessionId), "utf8");
    const record = JSON.parse(raw) as StoredRecord;
    record.creditsSpentSession = (record.creditsSpentSession ?? 0) + credits;
    if (record.availableCredits != null) {
      record.availableCredits = Math.max(0, record.availableCredits - credits);
    }
    record.updatedAt = new Date().toISOString();
    await writeFile(accountPath(sessionId), JSON.stringify(record), { mode: 0o600 });
  } catch {
    /* account may have been removed */
  }
}

export async function refreshStoredBalance(
  sessionId: string,
  availableCredits: number,
): Promise<void> {
  try {
    const raw = await readFile(accountPath(sessionId), "utf8");
    const record = JSON.parse(raw) as StoredRecord;
    record.availableCredits = availableCredits;
    record.updatedAt = new Date().toISOString();
    await writeFile(accountPath(sessionId), JSON.stringify(record), { mode: 0o600 });
  } catch {
    /* noop */
  }
}