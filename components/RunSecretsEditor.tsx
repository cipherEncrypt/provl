"use client";

import { useEffect, useId } from "react";

export type SecretRow = {
  id: string;
  key: string;
  value: string;
};

type RunSecretsEditorProps = {
  disabled?: boolean;
  rows: SecretRow[];
  onChange: (rows: SecretRow[]) => void;
  /** Plain-language sign-in fields (username + password only). */
  variant?: "default" | "signIn";
  /** Extra line for scheduled monitors vs one-off runs. */
  context?: "run" | "monitor";
};

function newRow(key = ""): SecretRow {
  return {
    id: crypto.randomUUID(),
    key,
    value: "",
  };
}

const SIGN_IN_KEYS = ["username", "password"] as const;

function ensureSignInRows(rows: SecretRow[]): SecretRow[] {
  const byKey = new Map(rows.map((r) => [r.key, r]));
  return SIGN_IN_KEYS.map((key) => {
    const existing = byKey.get(key);
    return existing ?? newRow(key);
  });
}

export function RunSecretsEditor({
  disabled,
  rows,
  onChange,
  variant = "default",
  context = "run",
}: RunSecretsEditorProps) {
  const hintId = useId();
  const signIn = variant === "signIn";

  useEffect(() => {
    if (!signIn || rows.length > 0) return;
    onChange(ensureSignInRows([]));
  }, [signIn, rows.length, onChange]);

  function updateRow(id: string, patch: Partial<SecretRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  const signInHint =
    context === "monitor"
      ? "Stored encrypted for this monitor. Used when Provl runs on a schedule or when you tap Run now. Your password never appears in the proof."
      : "Used only for this run. Your password never appears in the task or proof.";

  if (signIn) {
    const displayRows = ensureSignInRows(rows);
    const usernameRow = displayRows.find((r) => r.key === "username")!;
    const passwordRow = displayRows.find((r) => r.key === "password")!;

    return (
      <div className="flex flex-col gap-3 border-t border-steel-line/80 pt-5">
        <div>
          <p className="text-sm font-medium text-ink">Sign-in details</p>
          <p id={hintId} className="mt-1 text-xs leading-relaxed text-steel-soft">
            {signInHint}
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-steel">Email or username</span>
          <input
            type="text"
            disabled={disabled}
            value={usernameRow.value}
            onChange={(e) => {
              const next = ensureSignInRows(rows).map((r) =>
                r.key === "username" ? { ...r, value: e.target.value } : r,
              );
              onChange(next);
            }}
            autoComplete="username"
            className="field-input"
            spellCheck={false}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-steel">Password</span>
          <input
            type="password"
            disabled={disabled}
            value={passwordRow.value}
            onChange={(e) => {
              const next = ensureSignInRows(rows).map((r) =>
                r.key === "password" ? { ...r, value: e.target.value } : r,
              );
              onChange(next);
            }}
            autoComplete="current-password"
            className="field-input"
            spellCheck={false}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-steel-line/80 pt-5">
      <div>
        <p className="text-sm font-medium text-ink">Extra sign-in fields</p>
        <p id={hintId} className="mt-1 text-xs leading-relaxed text-steel-soft">
          {signInHint}
        </p>
      </div>

      {rows.map((row, index) => (
        <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-steel">Label</span>
            <input
              type="text"
              disabled={disabled}
              value={row.key}
              onChange={(e) => updateRow(row.id, { key: e.target.value })}
              placeholder={index === 0 ? "username" : "password"}
              autoComplete="off"
              className="field-input"
              spellCheck={false}
            />
          </label>
          <label className="flex min-w-0 flex-[1.5] flex-col gap-1.5">
            <span className="text-xs font-medium text-steel">Value</span>
            <input
              type="password"
              disabled={disabled}
              value={row.value}
              onChange={(e) => updateRow(row.id, { value: e.target.value })}
              autoComplete="new-password"
              className="field-input"
              spellCheck={false}
            />
          </label>
          <button
            type="button"
            disabled={disabled}
            onClick={() => removeRow(row.id)}
            className="btn-secondary shrink-0 text-sm sm:mb-0.5"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange([...rows, newRow()])}
        className="btn-secondary w-full text-sm sm:w-auto"
      >
        Add field
      </button>
    </div>
  );
}