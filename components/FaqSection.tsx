"use client";

import { useState } from "react";

import { PillTag } from "./PillTag";

const FAQS = [
  {
    q: "What does Provl prove?",
    a: "A real browser run through Kane CLI, with a pass or fail verdict, readable proof fields, and a replay link - not an unverified “done.”",
  },
  {
    q: "How long does a run take?",
    a: "Usually 1-3 minutes. Kane opens Chrome, follows your objective, and stops only when the page matches what you asked to verify.",
  },
  {
    q: "What if the task cannot be finished?",
    a: "Provl returns NOT DONE and shows where it stopped. Honest assertion failures are not retried, so credits are not burned on impossible goals.",
  },
  {
    q: "Do I need a global Kane install?",
    a: "No. Provl calls Kane with npx. Sign in once with npx @testmuai/kane-cli login --oauth, then run npm run dev.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="mx-auto grid w-full max-w-5xl scroll-mt-8 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <PillTag label="Frequently asked questions" />
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Questions? We&apos;re here to assist.
        </h2>
        <p className="mt-4 max-w-md text-pretty text-steel">
          Provl is a thin product around Kane: you describe the chore, Kane runs
          Chrome, and you get a card you can share.
        </p>
        <a href="#run" className="btn-primary mt-6">
          Run a task
        </a>
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
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink"
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