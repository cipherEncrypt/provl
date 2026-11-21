"use client";

type RunFormProps = {
  disabled?: boolean;
  task: string;
  url: string;
  onTaskChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onSubmit: (task: string, url: string) => void;
};

export function RunForm({
  disabled,
  task,
  url,
  onTaskChange,
  onUrlChange,
  onSubmit,
}: RunFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nextTask = String(fd.get("task") ?? "").trim();
    const nextUrl = String(fd.get("url") ?? "").trim();
    if (!nextTask) return;
    onSubmit(nextTask, nextUrl);
  }

  return (
    <form
      id="run"
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
          placeholder='Click "Cancel subscription", confirm "Yes, cancel", then verify "Subscription canceled" is shown…'
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

      <button type="submit" disabled={disabled} className="btn-primary w-full text-base">
        {disabled ? "Running…" : "Run in real browser"}
      </button>
    </form>
  );
}