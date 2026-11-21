import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-steel-line/80 bg-paper/60">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 max-w-lg opacity-70"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 120" className="mx-auto h-full w-auto text-steel-line">
          <g fill="currentColor">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={40 + col * 28 + row * 4}
                  y={20 + row * 22}
                  width="22"
                  height="22"
                  rx="3"
                  opacity={0.25 + ((row + col) % 3) * 0.2}
                />
              )),
            )}
          </g>
        </svg>
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-1">
          <p className="text-lg font-semibold tracking-tight" translate="no">
            Provl.
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-steel">
            Plain-English web tasks with a pass or fail you can replay.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li>
              <a href="#run" className="hover:text-ink">
                Run a task
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-ink">
                FAQ
              </a>
            </li>
            <li>
              <Link href="/demo/subscription" className="hover:text-ink">
                Cancel sandbox
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Built with</p>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li>
              <a
                href="https://www.testmuai.com/support/docs/kane-cli-introduction/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                Kane CLI
              </a>
            </li>
            <li>
              <a
                href="https://www.testmuai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                TestMu AI
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Demo</p>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            Runs take 1–3 minutes. Keep the tab open while Kane drives Chrome.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 border-t border-steel-line px-4 py-5 text-xs text-steel-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Provl</p>
        <p>Verified by Kane CLI · Evidence you can see</p>
      </div>
    </footer>
  );
}