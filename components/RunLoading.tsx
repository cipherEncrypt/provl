export function RunLoading() {
  return (
    <div
      className="surface-card flex flex-col items-center gap-4 px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-steel-line border-t-ink"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <p className="text-lg font-semibold tracking-tight text-ink">
          Running in a real browser…
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-steel">
          Kane is driving Chrome on your task. This usually takes 1-3 minutes.
          Stay on this page.
        </p>
      </div>
    </div>
  );
}