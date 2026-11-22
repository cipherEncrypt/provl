import type { ProofMailtoInput } from "@/lib/proof/proofMailto";
import { buildProofMailto } from "@/lib/proof/proofMailto";

type EmailProofLinkProps = ProofMailtoInput & {
  className?: string;
};

export function EmailProofLink({
  className,
  ...mailtoInput
}: EmailProofLinkProps) {
  const href = buildProofMailto(mailtoInput);
  return (
    <a
      href={href}
      className={
        className ??
        "btn-secondary w-full text-center text-sm sm:w-auto"
      }
    >
      Email this proof
    </a>
  );
}