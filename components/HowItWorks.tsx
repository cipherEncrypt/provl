import { PillTag } from "./PillTag";

const STEPS = [
  {
    title: "Describe the task",
    body: "Plain English plus an optional start URL. No selectors or scripts.",
  },
  {
    title: "Kane runs Chrome",
    body: "A real browser follows your objective and checks the outcome on screen.",
  },
  {
    title: "Get a proof card",
    body: "DONE or NOT DONE, proof fields, duration, and a replay you can share.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-16 sm:px-6"
    >
      <div className="text-center">
        <PillTag label="How Provl works" />
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          From plain words to a verdict
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <article key={step.title} className="surface-card !p-5">
            <h3 className="text-base font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-steel">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}