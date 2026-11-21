/** Monochrome “built with” marks - geometric only */
export function TrustRow() {
  const items = [
    { name: "Kane CLI", mark: "K" },
    { name: "TestMu AI", mark: "T" },
    { name: "Chrome", mark: "C" },
    { name: "Next.js", mark: "N" },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-steel-soft">
        Runs on real Chrome · Verdict from Kane
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-2 text-sm font-semibold text-ink/70"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-steel-line bg-paper text-[11px] font-bold"
              aria-hidden="true"
            >
              {item.mark}
            </span>
            {item.name}
          </li>
        ))}
      </ul>
    </section>
  );
}