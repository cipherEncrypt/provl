import Image from "next/image";
import Link from "next/link";

import { LandingFaq } from "./LandingFaq";
import { LandingNav } from "./LandingNav";
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
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-btn focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <LandingNav />

      <main id="main">
        <section className="hero-waves relative isolate overflow-hidden pt-10 text-center sm:pt-16">
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 sm:px-6">
            <PillTag label="Verified by Kane CLI" />

            <h1 className="mt-5 text-balance text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-ink sm:mt-6 sm:text-5xl sm:leading-[1.08] lg:text-[3.5rem]">
              Get proof it was actually done.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-steel sm:mt-5 sm:text-lg">
              Tell Provl a web task in plain English. It runs in a real browser and
              returns a verdict you can replay — not an unverified “done.”
            </p>

            <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-md sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link href="/app" className="btn-primary w-full px-7 shadow-btn sm:w-auto sm:min-w-[9.5rem]">
                Open app
              </Link>
              <a href="#demo" className="btn-secondary w-full px-7 sm:w-auto sm:min-w-[9.5rem]">
                Watch the demo
              </a>
            </div>
          </div>

          <div className="hero-art-flow z-0 mt-4 w-screen max-w-none left-1/2 -translate-x-1/2 sm:mt-0">
            <Image
              src="/hero.png"
              alt="Robot hand and human hand reaching toward each other"
              width={1024}
              height={480}
              priority
              sizes="100vw"
              className="hero-art-img h-auto w-full select-none"
            />
          </div>

          <div className="relative z-10 mx-auto px-4 pb-12 pt-1 sm:px-6 sm:pb-16 sm:pt-2">
            <p className="text-[11px] font-medium leading-snug tracking-wide text-steel sm:text-xs">
              Powered by Kane CLI · Works with Claude Code, Cursor, Codex
            </p>
            <ul className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mt-5 sm:gap-10">
              {["Kane CLI", "Claude Code", "Cursor", "Codex"].map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 text-xs font-semibold text-ink/65 sm:text-sm"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-steel-line bg-paper text-[10px] font-bold sm:h-7 sm:w-7"
                    aria-hidden="true"
                  >
                    {name.charAt(0)}
                  </span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-12"
        >
          <div className="text-center">
            <PillTag label="How it works" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:mt-5 sm:text-4xl">
              From plain words to a verdict
            </h2>
          </div>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {HOW_IT_WORKS.map((step) => (
              <article key={step.title} className="surface-card !p-4 text-left sm:!p-5">
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="demo"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-12 sm:scroll-mt-24 sm:px-6 sm:py-16"
        >
          <div className="surface-card text-center !p-5 sm:!p-8">
            <PillTag label="Demo" />
            <h2 className="mt-4 text-balance text-xl font-semibold tracking-tight sm:mt-5 sm:text-3xl">
              Two clicks that tell the whole story
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Open the app and try the presets: cancel a sandbox subscription
              (DONE), then the honest fail on a login page that has no Google
              button (NOT DONE). Each run takes about 1–3 minutes.
            </p>
            <Link href="/app" className="btn-primary mt-6 w-full sm:w-auto">
              Open app
            </Link>
          </div>
        </section>

        <section
          id="proof"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 pb-6 sm:scroll-mt-24 sm:px-6 sm:pb-8"
        >
          <div className="text-center">
            <PillTag label="Proof" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:mt-5 sm:text-3xl">
              A card you can send
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Every finished run gets a shareable{" "}
              <code className="break-all rounded bg-mist px-1.5 py-0.5 text-ink">
                /proof/…
              </code>{" "}
              page with the verdict, proof fields, and Kane replay link — no
              re-run required.
            </p>
          </div>
        </section>

        <LandingFaq />

        <section className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-8">
          <div className="surface-card flex flex-col items-stretch gap-4 text-left !p-5 sm:flex-row sm:items-center sm:justify-between sm:!p-8">
            <div>
              <PillTag label="Verified by Kane CLI" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Let&apos;s prove the next chore.
              </h2>
              <p className="mt-2 max-w-md text-sm text-steel">
                Open the app, describe a task, and walk away with a verdict you
                can replay.
              </p>
            </div>
            <Link href="/app" className="btn-primary w-full shrink-0 sm:w-auto">
              Open app
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-steel-line/80 bg-paper/70 pb-[env(safe-area-inset-bottom)] sm:mt-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-3">
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