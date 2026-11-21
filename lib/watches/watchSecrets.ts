import { decryptSecret, encryptSecret, hasEncryptionKey } from "@/lib/provl/crypto";
import { normalizeSecretsInput } from "@/lib/kane/secrets";
import { taskNeedsStoredSecrets } from "@/lib/run/loginHints";

export function encryptWatchSecrets(
  rows: { key: string; value: string }[] | undefined,
): string | null {
  const secrets = normalizeSecretsInput(rows);
  if (Object.keys(secrets).length === 0) return null;
  if (!hasEncryptionKey()) {
    throw new Error("PROVL_ENC_KEY is required to store monitor secrets");
  }
  return encryptSecret(JSON.stringify(secrets));
}

export function decryptWatchSecrets(
  secretsEnc: string | null | undefined,
): Record<string, string> {
  if (!secretsEnc?.trim()) return {};
  try {
    const raw = decryptSecret(secretsEnc);
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

export function secretsRowsForRun(
  secretsEnc: string | null | undefined,
): { key: string; value: string }[] {
  const map = decryptWatchSecrets(secretsEnc);
  return Object.entries(map).map(([key, value]) => ({ key, value }));
}

export function validateWatchSecretsForTask(
  task: string,
  rows: { key: string; value: string }[] | undefined,
): { ok: true } | { ok: false; error: string } {
  if (!taskNeedsStoredSecrets(task)) return { ok: true };
  const secrets = normalizeSecretsInput(rows);
  if (Object.keys(secrets).length === 0) {
    return {
      ok: false,
      error:
        "This task uses {{placeholders}}. Add matching secrets below so scheduled runs can sign in.",
    };
  }
  if (!hasEncryptionKey()) {
    return {
      ok: false,
      error: "Server is missing PROVL_ENC_KEY; cannot store monitor secrets.",
    };
  }
  return { ok: true };
}