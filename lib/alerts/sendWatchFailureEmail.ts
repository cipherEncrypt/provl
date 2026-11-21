import { Resend } from "resend";

import type { WatchRecord } from "@/lib/watches/types";

function publicProofUrl(proofId: string): string {
  const base =
    process.env.PROVL_PUBLIC_URL?.trim().replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/proof/${proofId}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type WatchAlertSendResult =
  | { sent: true; id: string }
  | { sent: false; reason: "disabled" | "error"; detail?: string };

export async function sendWatchFailureEmail(
  watch: WatchRecord,
  proofId: string,
  oneLiner: string | null,
): Promise<WatchAlertSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info("[monitors] alert skipped (no RESEND_API_KEY)", {
      watchId: watch.id,
      proofId,
    });
    return { sent: false, reason: "disabled" };
  }

  const from =
    process.env.RESEND_FROM?.trim() ?? "Provl <onboarding@resend.dev>";
  const proofUrl = publicProofUrl(proofId);
  const summary = oneLiner?.trim() || "The scheduled verification did not pass.";
  const task = escapeHtml(watch.task);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [watch.alertEmail],
    subject: "Provl monitor: NOT DONE",
    html: `<p><strong>Verdict:</strong> NOT DONE</p>
<p><strong>Task:</strong> ${task}</p>
<p>${escapeHtml(summary)}</p>
<p><a href="${escapeHtml(proofUrl)}">View proof</a></p>`,
  });

  if (error) {
    console.warn("[monitors] Resend error", {
      watchId: watch.id,
      name: error.name,
    });
    return { sent: false, reason: "error", detail: error.message };
  }

  return { sent: true, id: data!.id };
}