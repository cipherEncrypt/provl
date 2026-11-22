export type ProofMailtoInput = {
  task: string;
  done: boolean;
  proofUrl: string;
  oneLiner?: string | null;
  /** Optional pre-filled To: address (monitor alert email). */
  to?: string | null;
};

export function proofVerdictLabel(done: boolean): "DONE" | "NOT DONE" {
  return done ? "DONE" : "NOT DONE";
}

export function buildProofMailtoBody(input: ProofMailtoInput): string {
  const verdict = proofVerdictLabel(input.done);
  const lines = [
    `Verdict: ${verdict}`,
    "",
    "Task:",
    input.task.trim(),
    "",
  ];
  const summary = input.oneLiner?.trim();
  if (summary) {
    lines.push(summary, "");
  }
  lines.push(`Proof: ${input.proofUrl}`);
  return lines.join("\n");
}

export function buildProofMailto(input: ProofMailtoInput): string {
  const verdict = proofVerdictLabel(input.done);
  const subject = encodeURIComponent(`Provl verification: ${verdict}`);
  const body = encodeURIComponent(buildProofMailtoBody(input));
  const to = input.to?.trim();
  if (to) {
    return `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
  }
  return `mailto:?subject=${subject}&body=${body}`;
}