"use client";

import { useState } from "react";

type Phase = "active" | "confirm" | "canceled";

export default function SubscriptionDemoPage() {
  const [phase, setPhase] = useState<Phase>("active");

  return (
    <main
      className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-16"
      data-testid="subscription-demo"
    >
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Provl sandbox
        </p>
        <h1 className="text-2xl font-semibold">Pro Demo Subscription</h1>
      </header>

      {phase === "canceled" ? (
        <section
          className="rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-6"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-lg font-medium text-emerald-300">
            Subscription canceled
          </h2>
          <p className="mt-2 text-slate-300">
            Your Pro Demo plan will not renew. You can resubscribe anytime.
          </p>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-lg font-medium text-emerald-400">Active</p>
            </div>
            <p className="text-sm text-slate-400">$9 / month</p>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Renews on Dec 19, 2026. This is a fake billing page for Provl demos
            only.
          </p>
          <button
            type="button"
            className="mt-6 w-full rounded-lg border border-red-800/80 bg-red-950/50 px-4 py-2 font-medium text-red-200 hover:bg-red-900/60"
            onClick={() => setPhase("confirm")}
          >
            Cancel subscription
          </button>
        </section>
      )}

      {phase === "confirm" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
            <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
              <h2 id="cancel-dialog-title" className="text-lg font-semibold">
                Cancel subscription?
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                You will lose access at the end of this billing period.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
                  onClick={() => setPhase("active")}
                >
                  Keep subscription
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                  onClick={() => setPhase("canceled")}
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>
      )}
    </main>
  );
}
