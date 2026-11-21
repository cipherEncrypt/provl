import Image from "next/image";
import Link from "next/link";

import { LandingFaq } from "./LandingFaq";
import { PillTag } from "./PillTag";

const HOW_IT_WORKS = [
  {
    title: "Describe the task",
    body: "Plain English plus an optional start URL. No selectors, no scripts.",
  },
  {
    title: "Kane runs it in a real browser",
    body: "Chrome follows your objective and checks the outcome on the live page.",
  },
  {
    title: "Get a verdict + replay",
    body: "DONE or NOT DONE, proof fields, duration, and a shareable replay link.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-btn focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-transparent bg-paper/70 backdrop-blur-md supports-[backdrop-filter]:bg-paper/55">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-btn text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            translate="no"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-ink text-white"
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M7 2v10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
            <span className="text-[17px] font-semibold tracking-tight">Provl</span>
          </Link>

          <nav
            className="hidden items-center gap-6 text-sm text-steel-mute md:flex"
            aria-label="Primary"
          >
            <a href="#how-it-works" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded">
              How it works
            </a>
            <a href="#demo" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded">
              Demo
            </a>
            <a href="#proof" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded">
              Proof
            </a>
            <a
              href="https://www.testmuai.com/support/docs/kane-cli-introduction/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
            >
              Docs
            </a>
          </nav>

          <Link href="/app" className="btn-primary !px-4 !py-2 text-xs sm:text-sm">
            Open app
          </Link>
        </div>
      </header>

      <main id="main">
        {/* Hero — matches reference: CTAs over concentric waves + hands */}
        <section className="hero-waves relative overflow-hidden px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-14 sm:pt-16">
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
            <PillTag label="Verified by Kane CLI" />

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.08] lg:text-[3.5rem]">
              Get proof it was actually done.
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-steel sm:text-lg">
              Tell Provl a web task in plain English. It runs in a real browser and
              returns a verdict you can replay — not an unverified “done.”
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link href="/app" className="btn-primary px-7 shadow-btn">
                Open app
              </Link>
              <a href="#demo" className="btn-secondary px-7">
                Watch the demo
              </a>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-6 w-full max-w-5xl sm:mt-2">
            <Image
              src="/hero.jpg"
              alt="Robot hand and human hand reaching toward each other on a soft topographic wave background"
              width={1024}
              height={374}
              priority
              className="mx-auto h-auto w-full max-w-5xl object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          <p className="relative z-10 mt-6 text-xs font-medium tracking-wide text-steel sm:mt-8">
            Powered by Kane CLI · Works with Claude Code, Cursor, Codex
          </p>
          <ul className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {["Kane CLI", "Claude Code", "Cursor", "Codex"].map((name) => (
              <li
                key={name}
                className="flex items-center gap-2 text-sm font-semibold text-ink/65"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-steel-line bg-paper text-[10px] font-bold"
                  aria-hidden="true"
                >
                  {name.charAt(0)}
                </span>
                {name}
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-5xl scroll-mt-24 px-4 py-10 sm:px-6"
        >
          <div className="text-center">
            <PillTag label="How it works" />
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              From plain words to a verdict
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <article key={step.title} className="surface-card !p-5 text-left">
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Demo */}
        <section
          id="demo"
          className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6"
        >
          <div className="surface-card text-center">
            <PillTag label="Demo" />
            <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Two clicks that tell the whole story
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Open the app and try the presets: cancel a sandbox subscription
              (DONE), then the honest fail on a login page that has no Google
              button (NOT DONE). Each run takes about 1–3 minutes.
            </p>
            <Link href="/app" className="btn-primary mt-6">
              Open app
            </Link>
          </div>
        </section>

        {/* Proof */}
        <section
          id="proof"
          className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 pb-8 sm:px-6"
        >
          <div className="text-center">
            <PillTag label="Proof" />
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight">
              A card you can send
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Every finished run gets a shareable{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 text-ink">/proof/…</code>{" "}
              page with the verdict, proof fields, and Kane replay link — no
              re-run required.
            </p>
          </div>
        </section>

        <LandingFaq />

        {/* CTA band */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">
          <div className="surface-card flex flex-col items-start gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
            <div>
              <PillTag label="Verified by Kane CLI" />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
                Let&apos;s prove the next chore.
              </h2>
              <p className="mt-2 max-w-md text-sm text-steel">
                Open the app, describe a task, and walk away with a verdict you
                can replay.
              </p>
            </div>
            <Link href="/app" className="btn-primary shrink-0">
              Open app
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-steel-line/80 bg-paper/70">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-lg font-semibold tracking-tight" translate="no">
              Provl.
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-steel">
              Proof for AI-done web tasks.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-steel">
              <li>
                <a href="#how-it-works" className="hover:text-ink">
                  How it works
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-ink">
                  Demo
                </a>
              </li>
              <li>
                <Link href="/app" className="hover:text-ink">
                  Open app
                </Link>
              </li>
              <li>
                <a
                  href="https://www.testmuai.com/support/docs/kane-cli-introduction/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Kane CLI docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Verify</p>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              Provl never claims success without Kane&apos;s pass verdict and
              exit code 0.
            </p>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 border-t border-steel-line px-4 py-5 text-xs text-steel-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Provl</p>
          <p>Verified by Kane CLI</p>
        </div>
      </footer>
    </div>
  );
}