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

const GET_STARTED = [
  'Open the app and type a web task, like "cancel my subscription on this page," with the site URL.',
  "Hit Run. Provl drives a real browser through Kane. A run takes about 1–3 minutes.",
  "Read the proof card: DONE or NOT DONE, the proof fields, and a replay link you can share. If it can't finish, Provl tells you exactly where it stopped.",
];

const KANE_DOCS =
  "https://www.testmuai.com/support/docs/kane-cli-introduction/";

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
        {/* HERO */}
        <section className="hero-glow relative isolate overflow-hidden bg-paper pt-10 text-center sm:pt-16">
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 sm:px-6">
            <PillTag label="Verified by Kane CLI" />

            <h1 className="mt-5 text-balance text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-ink sm:mt-6 sm:text-5xl sm:leading-[1.08] lg:text-[3.5rem]">
              Get proof it was actually done.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-steel sm:mt-5 sm:text-lg">
              AI agents can do your web tasks now, but they just say &quot;done.&quot;
              Provl does the task in a real browser and hands you proof it
              actually happened — a verdict you can replay.
            </p>

            <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-md sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href="/dashboard"
                className="btn-primary w-full px-7 shadow-btn sm:w-auto sm:min-w-[9.5rem]"
              >
                Open app
              </Link>
              <a
                href="#demo"
                className="btn-secondary w-full px-7 sm:w-auto sm:min-w-[9.5rem]"
              >
                Watch the demo
              </a>
            </div>
          </div>

          <div className="hero-art-flow z-0 -mt-6 w-screen max-w-none left-1/2 -translate-x-1/2 sm:-mt-10 lg:-mt-14">
            <Image
              src="/hero.png"
              alt="Robot hand and human hand reaching toward each other"
              width={1024}
              height={480}
              priority
              unoptimized
              sizes="100vw"
              className="hero-art-img h-auto w-full -translate-y-[6%] select-none sm:-translate-y-[8%]"
            />
          </div>

          <div className="relative z-10 mx-auto -mt-4 px-4 pb-12 pt-0 sm:-mt-6 sm:px-6 sm:pb-16">
            <p className="text-[11px] font-medium leading-snug tracking-wide text-steel sm:text-xs">
              Powered by Kane CLI · Works with Claude Code, Cursor, Codex
            </p>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="text-center">
            <PillTag label="The problem" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ink sm:mt-5 sm:text-4xl">
              &quot;Done&quot; isn&apos;t proof.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-steel sm:text-base">
              You ask an AI agent to cancel a subscription, check an order, or
              fill a form. It replies &quot;done.&quot; But did it really happen? You
              click around to double-check, or you just trust it and hope. Every
              AI agent has the same gap: it tells you it worked, with nothing to
              back it up.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-12"
        >
          <div className="text-center">
            <PillTag label="How it works" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:mt-5 sm:text-4xl">
              From plain words to a verdict.
            </h2>
          </div>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {HOW_IT_WORKS.map((step) => (
              <article
                key={step.title}
                className="surface-card !p-4 text-left sm:!p-5"
              >
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* HOW TO USE / GET STARTED */}
        <section
          id="get-started"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-14"
        >
          <div className="text-center">
            <PillTag label="Get started" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:mt-5 sm:text-4xl">
              Try it in three steps.
            </h2>
          </div>
          <ol className="mt-8 space-y-4 sm:mt-10">
            {GET_STARTED.map((step, i) => (
              <li
                key={step}
                className="surface-card flex gap-4 !p-4 text-left sm:!p-5"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-steel sm:text-[15px]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
              Open app
            </Link>
          </div>
        </section>

        {/* DEMO */}
        <section
          id="demo"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-14"
        >
          <div className="surface-card text-center !p-5 sm:!p-8">
            <PillTag label="Demo" />
            <h2 className="mt-4 text-balance text-xl font-semibold tracking-tight sm:mt-5 sm:text-3xl">
              Two clicks that tell the whole story.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Open the app and try the presets: cancel a sandbox subscription
              (DONE), then the honest fail on a login page that has no Google
              button (NOT DONE). Each run takes about 1–3 minutes.
            </p>
            <Link href="/dashboard" className="btn-primary mt-6 w-full sm:w-auto">
              Open app
            </Link>
          </div>
        </section>

        {/* PROOF */}
        <section
          id="proof"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-14"
        >
          <div className="text-center">
            <PillTag label="Proof" />
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:mt-5 sm:text-3xl">
              A card you can send.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
              Every finished run gets a shareable /proof/… page with the
              verdict, proof fields, and Kane replay link — no re-run required.
            </p>
          </div>
        </section>

        <LandingFaq />

        {/* CLOSING CTA */}
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
            <Link href="/dashboard" className="btn-primary w-full shrink-0 sm:w-auto">
              Open app
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-steel-line/80 bg-paper/70 pb-[env(safe-area-inset-bottom)] sm:mt-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14">
          <div className="space-y-3">
            <p className="text-lg font-semibold tracking-tight" translate="no">
              Provl
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
                <a href="#get-started" className="hover:text-ink">
                  How to use
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-ink">
                  Demo
                </a>
              </li>
              <li>
                <a href="#proof" className="hover:text-ink">
                  Proof
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-ink">
                  Open app
                </Link>
              </li>
              <li>
                <a
                  href={KANE_DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Kane CLI docs
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 border-t border-steel-line px-4 py-5 text-xs text-steel-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Provl</p>
          <p>Verified by Kane CLI</p>
        </div>
      </footer>
    </div>
  );
}
