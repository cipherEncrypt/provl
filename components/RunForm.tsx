"use client";

type RunFormProps = {
  disabled?: boolean;
  onSubmit: (task: string, url: string) => void;
};

export function RunForm({ disabled, onSubmit }: RunFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const task = String(fd.get("task") ?? "").trim();
    const url = String(fd.get("url") ?? "").trim();
    if (!task) return;
    onSubmit(task, url);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg sm:p-6"
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">What should Provl do?</span>
        <textarea
          name="task"
          required
          rows={4}
          disabled={disabled}
          placeholder='e.g. Click "Cancel subscription", confirm "Yes, cancel", then verify "Subscription canceled" is shown.'
          className="min-h-[7rem] w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">
          Site URL <span className="font-normal text-slate-500">(optional)</span>
        </span>
        <input
          name="url"
          type="url"
          disabled={disabled}
          placeholder="http://localhost:3000/demo/subscription"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="mt-1 w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        Run in real browser
      </button>
    </form>
  );
}