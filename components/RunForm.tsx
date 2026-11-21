"use client";

import { useState } from "react";

import {
  RunSecretsEditor,
  type SecretRow,
} from "./RunSecretsEditor";

type RunFormProps = {
  disabled?: boolean;
  task: string;
  url: string;
  onTaskChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onSubmit: (
    task: string,
    url: string,
    secrets: { key: string; value: string }[],
  ) => void;
};

export function RunForm({
  disabled,
  task,
  url,
  onTaskChange,
  onUrlChange,
  onSubmit,
}: RunFormProps) {
  const [secretRows, setSecretRows] = useState<SecretRow[]>([]);
  const [showSecrets, setShowSecrets] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextTask = task.trim();
    const nextUrl = url.trim();
    if (!nextTask) return;
    const secrets = secretRows
      .map((r) => ({ key: r.key.trim(), value: r.value }))
      .filter((r) => r.key && r.value);
    onSubmit(nextTask, nextUrl, secrets);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-card scroll-mt-8 flex w-full flex-col gap-5"
      autoComplete="off"
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">What should Provl do?</span>
        <textarea
          name="task"
          required
          rows={4}
          disabled={disabled}
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          spellCheck={true}
          placeholder='Log in with {{username}} and {{password}}, then open settings…'
          className="field-input min-h-[8rem] resize-y"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">
          Site URL{" "}
          <span className="font-normal text-steel">(optional)</span>
        </span>
        <input
          name="url"
          type="url"
          inputMode="url"
          disabled={disabled}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="http://localhost:3000/demo/subscription"
          className="field-input"
        />
      </label>

      {!showSecrets ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowSecrets(true)}
          className="text-left text-sm font-medium text-steel underline decoration-steel-line underline-offset-2 hover:text-ink"
        >
          Add secrets (optional)
        </button>
      ) : (
        <RunSecretsEditor
          disabled={disabled}
          rows={secretRows}
          onChange={setSecretRows}
        />
      )}

      <button type="submit" disabled={disabled} className="btn-primary w-full text-base">
        {disabled ? "Running…" : "Run in real browser"}
      </button>
    </form>
  );
}