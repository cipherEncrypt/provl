export function RunLoading() {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400"
        aria-hidden
      />
      <div className="space-y-2">
        <p className="text-lg font-medium text-slate-100">Running in a real browser…</p>
        <p className="max-w-sm text-sm text-slate-400">
          Kane is driving Chrome on your task. This usually takes 1–3 minutes.
          Stay on this page.
        </p>
      </div>
    </div>
  );
}