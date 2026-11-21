import Link from "next/link";

import type { RunApiResponse } from "@/lib/api-types";
import { formatDuration, humanizeKey } from "@/lib/format";
import type { ProofRecord } from "@/lib/proof/types";

type ResultCardProps = {
  result: RunApiResponse | ProofRecord;
  proofUrl?: string | null;
  showShareHint?: boolean;
};

export function ResultCard({
  result,
  proofUrl,
  showShareHint = true,
}: ResultCardProps) {
  const durationLabel = formatDuration(result.duration);
  const stateEntries = Object.entries(result.finalState ?? {});

  return (
    <article className="surface-card w-full !p-4 sm:!p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <p
          className={`text-3xl font-semibold tracking-tight sm:text-5xl ${
            result.done ? "text-ink" : "text-steel"
          }`}
          aria-label={result.done ? "Verdict: done" : "Verdict: not done"}
        >
          {result.done ? (
            "DONE"
          ) : (
            <span className="inline-block rounded-btn border-2 border-steel-soft px-2.5 py-1 text-2xl text-steel-mute sm:px-3 sm:text-4xl">
              NOT DONE
            </span>
          )}
        </p>
        {durationLabel && (
          <p className="tabular-nums text-sm text-steel">
            Duration {durationLabel}
          </p>
        )}
      </div>

      {result.oneLiner && (
        <p className="mt-5 text-lg font-medium leading-snug text-ink text-pretty">
          {result.oneLiner}
        </p>
      )}

      {result.summary && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-steel">
          {result.summary}
        </p>
      )}

      {!result.done && result.honestStop && (
        <div className="mt-5 rounded-card border border-steel-line bg-mist/80 px-4 py-4">
          <p className="text-xs font-semibold tracking-wide text-steel-mute">
            Where it stopped
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {result.honestStop.message}
          </p>
        </div>
      )}

      {stateEntries.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wide text-steel-soft">
            Proof fields
          </p>
          <dl className="mt-3 divide-y divide-steel-line overflow-hidden rounded-card border border-steel-line">
            {stateEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-1 bg-paper px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="shrink-0 text-sm text-steel">{humanizeKey(key)}</dt>
                <dd className="min-w-0 break-words text-sm font-medium text-ink tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <footer className="mt-6 flex flex-col gap-3 border-t border-steel-line pt-5">
        {result.creditsConsumed != null && (
          <p className="text-sm text-steel-soft">
            Credits used:{" "}
            <span className="tabular-nums">
              {result.creditsConsumed.toFixed(1)}
            </span>
            {result.attempts > 1 ? ` · ${result.attempts} attempts` : null}
          </p>
        )}

        {result.replayUrl && (
          <a
            href={result.replayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Open browser replay
          </a>
        )}

        {showShareHint && proofUrl && (
          <div className="rounded-card border border-steel-line bg-mist/60 px-4 py-4">
            <p className="text-xs font-semibold tracking-wide text-steel-soft">
              Share proof
            </p>
            <Link href={proofUrl} className="btn-secondary mt-3 w-full sm:w-auto">
              Open shareable proof page
            </Link>
          </div>
        )}
      </footer>
    </article>
  );
}