import Link from "next/link";
import { notFound } from "next/navigation";

import { ResultCard } from "@/components/ResultCard";
import { getProof } from "@/lib/proof/store";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProofPage({ params }: PageProps) {
  const { id } = await params;
  const proof = await getProof(id);
  if (!proof) notFound();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col gap-6 px-4 py-12 sm:px-6">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-sm uppercase tracking-wide text-emerald-500/90">
          Provl proof
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Shared result</h1>
        <p className="text-sm text-slate-400">
          Task run on{" "}
          {new Date(proof.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Task
        </p>
        <p className="mt-1 text-sm text-slate-200">{proof.task}</p>
        {proof.url && (
          <p className="mt-2 break-all text-xs text-slate-500">{proof.url}</p>
        )}
      </div>

      <ResultCard result={proof} showShareHint={false} />

      <p className="text-center text-sm">
        <Link href="/" className="text-emerald-400 underline-offset-2 hover:underline">
          Run another task
        </Link>
      </p>
    </main>
  );
}