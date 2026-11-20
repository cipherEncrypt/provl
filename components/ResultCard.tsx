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
    <article
      className={`rounded-2xl border p-5 shadow-lg sm:p-6 ${
        result.done
          ? "border-emerald-800/60 bg-emerald-950/30"
          : "border-amber-900/50 bg-amber-950/20"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-bold tracking-wide ${
            result.done
              ? "bg-emerald-600/20 text-emerald-300"
              : "bg-amber-600/20 text-amber-200"
          }`}
        >
          {result.done ? "DONE" : "NOT DONE"}
        </span>
        {durationLabel && (
          <span className="text-sm text-slate-400">Duration {durationLabel}</span>
        )}
      </div>

      {result.oneLiner && (
        <p className="mt-4 text-lg font-medium leading-snug text-slate-100">
          {result.oneLiner}
        </p>
      )}

      {result.summary && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {result.summary}
        </p>
      )}

      {!result.done && result.honestStop && (
        <div className="mt-4 rounded-xl border border-amber-800/40 bg-slate-950/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/90">
            Where it stopped
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
            {result.honestStop.message}
          </p>
        </div>
      )}

      {stateEntries.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Proof fields
          </p>
          <dl className="mt-2 space-y-2">
            {stateEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-0.5 rounded-lg bg-slate-950/50 px-3 py-2 sm:flex-row sm:justify-between sm:gap-4"
              >
                <dt className="text-sm text-slate-400">{humanizeKey(key)}</dt>
                <dd className="text-sm font-medium text-slate-100 break-all">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <footer className="mt-6 flex flex-col gap-3 border-t border-slate-800/80 pt-4 text-sm">
        {result.creditsConsumed != null && (
          <p className="text-slate-500">
            Credits used: {result.creditsConsumed.toFixed(1)}
            {result.attempts > 1 ? ` · ${result.attempts} attempts` : null}
          </p>
        )}

        {result.replayUrl && (
          <a
            href={result.replayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 font-medium text-emerald-300 hover:border-emerald-700 hover:bg-slate-800"
          >
            Open browser replay
          </a>
        )}

        {showShareHint && proofUrl && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Share proof
            </p>
            <Link
              href={proofUrl}
              className="mt-2 inline-flex rounded-lg bg-slate-800 px-3 py-2 font-medium text-emerald-300 hover:bg-slate-700"
            >
              Open shareable proof page
            </Link>
          </div>
        )}
      </footer>
    </article>
  );
}