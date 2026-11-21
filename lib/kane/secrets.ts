/** Kane CLI variable map: each key -> { value, secret }. */
export function buildKaneVariablesArg(
  secrets: Record<string, string>,
): string | null {
  const entries = Object.entries(secrets).filter(
    ([key, value]) => key.trim() && value.length > 0,
  );
  if (entries.length === 0) return null;

  const payload: Record<string, { value: string; secret: boolean }> = {};
  for (const [key, value] of entries) {
    payload[key.trim()] = { value, secret: true };
  }
  return JSON.stringify(payload);
}

export function normalizeSecretsInput(
  rows: { key: string; value: string }[] | undefined,
): Record<string, string> {
  if (!rows?.length) return {};
  const out: Record<string, string> = {};
  for (const row of rows) {
    const key = row.key.trim();
    const value = row.value;
    if (!key || !value) continue;
    out[key] = value;
  }
  return out;
}

/** Remove raw secret values from text before persisting or returning to clients. */
export function redactSecretsInText(
  text: string | null | undefined,
  secrets: Record<string, string>,
): string | null {
  if (text == null || text === "") return text ?? null;
  let out = text;
  for (const [key, value] of Object.entries(secrets)) {
    if (!value) continue;
    out = out.split(value).join(`{{${key}}}`);
    const single = `{${key}}`;
    if (out.includes(single) && !out.includes(`{{${key}}}`)) {
      out = out.split(single).join(`{{${key}}}`);
    }
  }
  return out;
}

export function redactSecretsInRecord(
  state: Record<string, string>,
  secrets: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(state)) {
    out[k] = redactSecretsInText(v, secrets) ?? v;
  }
  return out;
}