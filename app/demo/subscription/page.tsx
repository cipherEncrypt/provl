"use client";

import { useState } from "react";

type Phase = "active" | "confirm" | "canceled";

export default function SubscriptionDemoPage() {
  const [phase, setPhase] = useState<Phase>("active");

  return (
    <main
      className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-6 py-16"
      data-testid="subscription-demo"
    >
      <header>
        <p className="text-sm text-steel">Provl sandbox</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
          Pro Demo Subscription
        </h1>
      </header>

      {phase === "canceled" ? (
        <section
          className="surface-card"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold text-ink">
            Subscription canceled
          </h2>
          <p className="mt-2 text-sm text-steel">
            Your Pro Demo plan will not renew. You can resubscribe anytime.
          </p>
        </section>
      ) : (
        <section className="surface-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-steel">Status</p>
              <p className="text-lg font-semibold text-ink">Active</p>
            </div>
            <p className="text-sm text-steel">$9 / month</p>
          </div>
          <p className="mt-4 text-sm text-steel">
            Renews on Dec 19, 2026. This is a fake billing page for Provl demos
            only.
          </p>
          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={() => setPhase("confirm")}
          >
            Cancel subscription
          </button>
        </section>
      )}

      {phase === "confirm" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="surface-card w-full max-w-sm !shadow-soft">
            <h2 id="cancel-dialog-title" className="text-lg font-semibold text-ink">
              Cancel subscription?
            </h2>
            <p className="mt-2 text-sm text-steel">
              You will lose access at the end of this billing period.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setPhase("active")}
              >
                Keep subscription
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
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