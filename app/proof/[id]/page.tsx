import Link from "next/link";
import { notFound } from "next/navigation";

import { EmailProofLink } from "@/components/EmailProofLink";
import { PillTag } from "@/components/PillTag";
import { ResultCard } from "@/components/ResultCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getProof } from "@/lib/proof/store";
import { proofPublicUrl } from "@/lib/proof/proofPublicUrl";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProofPage({ params }: PageProps) {
  const { id } = await params;
  const proof = await getProof(id);
  if (!proof) notFound();

  const when = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(proof.createdAt));

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-6 sm:py-12">
        <header className="space-y-3 text-center">
          <PillTag label="Verified by Kane CLI" />
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Shared result
          </h1>
          <p className="text-sm text-steel">Task run on {when}</p>
        </header>

        <div className="surface-card !p-5">
          <p className="text-xs font-semibold tracking-wide text-steel-soft">
            Task
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{proof.task}</p>
          {proof.url && (
            <p className="mt-2 break-all text-xs text-steel">{proof.url}</p>
          )}
        </div>

        <ResultCard result={proof} showShareHint={false} />

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <EmailProofLink
            task={proof.task}
            done={proof.done}
            proofUrl={proofPublicUrl(proof.id)}
            oneLiner={proof.oneLiner}
            className="btn-secondary w-full text-center text-sm sm:w-auto"
          />
        </div>

        <p className="text-center text-sm text-steel">
          <Link
            href="/dashboard"
            className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
          >
            Run another task
          </Link>
        </p>

        <p className="mt-auto pt-10 text-center text-xs text-steel-soft">
          Verified by Kane CLI
        </p>
      </main>
    </div>
  );
}