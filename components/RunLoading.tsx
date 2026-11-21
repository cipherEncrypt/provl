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
      <p className="max-w-sm text-lg font-semibold leading-snug tracking-tight text-ink">
        Running in a real browser… this takes about 1–3 minutes. Keep this tab
        open.
      </p>
    </div>
  );
}
