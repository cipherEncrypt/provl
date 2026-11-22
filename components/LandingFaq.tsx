"use client";

import { useState } from "react";

import { PillTag } from "./PillTag";

const FAQS = [
  {
    q: "What is Provl?",
    a: "Provl is a consumer product built around Kane CLI. You describe a web chore in plain English; Provl runs it in real Chrome and returns DONE or NOT DONE with a shareable proof page, optional scheduled Monitors, run History, account connect, secure sign-in variables, and an MCP server for other agents.",
  },
  {
    q: "How does it verify?",
    a: "Provl hands your task to Kane CLI, which drives a real Chrome browser to complete it, then checks the outcome on the live page. Provl only shows DONE when Kane returns a pass verdict and exit code 0. Everything on the result card (the summary, the proof fields, the replay link) comes straight from that real run.",
  },
  {
    q: "Can it fail honestly?",
    a: "Yes, and that's the point. If the task can't be completed, Provl shows NOT DONE and tells you exactly where it stopped, instead of pretending it worked. It doesn't waste retries on an impossible task, and it never claims a success it can't prove.",
  },
  {
    q: "What is Kane CLI?",
    a: "Kane CLI, by TestMu AI, is a browser agent that takes a plain-English goal, drives a real browser, and returns a pass or fail backed by evidence and a shareable replay. It's the engine underneath Provl, the part that proves the task actually happened.",
  },
  {
    q: "Can it run on a schedule?",
    a: "Yes. Monitors let you save a task and re-run it hourly or daily. Results show pass or fail in the dashboard; you can email a proof or add Resend for automatic failure email.",
  },
  {
    q: "Can other AI agents use Provl?",
    a: "Yes. The Provl MCP server exposes verify_web_task over stdio. Claude Desktop, Cursor, and similar clients can call it and get the same Kane-verified verdict and proof URL as the web app.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="mx-auto grid w-full max-w-5xl scroll-mt-20 gap-10 px-4 py-12 sm:scroll-mt-24 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <PillTag label="Frequently asked questions" />
        <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ink sm:mt-5 sm:text-4xl">
          Questions? We&apos;re here to assist.
        </h2>
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
