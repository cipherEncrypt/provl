"use client";

import { useId } from "react";

export type SecretRow = {
  id: string;
  key: string;
  value: string;
};

type RunSecretsEditorProps = {
  disabled?: boolean;
  rows: SecretRow[];
  onChange: (rows: SecretRow[]) => void;
};

function newRow(): SecretRow {
  return {
    id: crypto.randomUUID(),
    key: "",
    value: "",
  };
}

export function RunSecretsEditor({
  disabled,
  rows,
  onChange,
}: RunSecretsEditorProps) {
  const hintId = useId();

  function updateRow(id: string, patch: Partial<SecretRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-3 border-t border-steel-line/80 pt-5">
      <div>
        <p className="text-sm font-medium text-ink">Secrets</p>
        <p id={hintId} className="mt-1 text-xs leading-relaxed text-steel-soft">
          Reference these in your task as{" "}
          <code className="text-steel">{`{{key}}`}</code> (Kane syntax). Secrets
          are sent as run variables only and never saved to history or proof.
        </p>
      </div>

      {rows.map((row, index) => (
        <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium text-steel">Key</span>
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
        Add secret
      </button>
    </div>
  );
}