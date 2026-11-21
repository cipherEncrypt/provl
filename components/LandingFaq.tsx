"use client";

import Link from "next/link";
import { useState } from "react";

import { PillTag } from "./PillTag";

const FAQS = [
  {
    q: "What is Provl?",
    a: "Provl is a consumer product around Kane CLI. You describe a web chore in plain English; Provl runs it in a real browser and returns a proof card — done or not done — with a replay link.",
  },
  {
    q: "How does it verify?",
    a: "Kane drives Chrome against your objective and ends with a run_end event. Provl treats the task as DONE only when status is passed and the process exit code is 0. The card shows summary, proof fields, and the Test Manager replay URL.",
  },
  {
    q: "Can it fail honestly?",
    a: "Yes. If the page cannot satisfy the objective, Provl returns NOT DONE and shows where it stopped. Honest assertion failures are not retried, so credits are not burned on impossible goals.",
  },
  {
    q: "What is Kane CLI?",
    a: "Kane CLI is TestMu AI’s agent that runs plain-English browser objectives and returns evidence-backed pass/fail. Provl shells out to it via npx — no global install required after OAuth login.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="mx-auto grid w-full max-w-5xl scroll-mt-24 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <PillTag label="Frequently asked questions" />
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Questions? We&apos;re here to assist.
        </h2>
        <p className="mt-4 max-w-md text-pretty text-steel">
          Landing pages never call Kane. Open the app when you want a real run.
        </p>
        <Link href="/app" className="btn-primary mt-6">
          Open app
        </Link>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`overflow-hidden rounded-card border transition-[background-color,border-color,color] duration-150 ${
                isOpen
                  ? "border-ink bg-ink text-white"
                  : "border-steel-line bg-paper text-ink"
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isOpen && (
                <p className="border-t border-white/15 px-5 pb-5 pt-3 text-sm leading-relaxed text-white/80">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}