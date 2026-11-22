import { Resend } from "resend";

import { proofPublicUrl } from "@/lib/proof/proofPublicUrl";
import type { WatchRecord } from "@/lib/watches/types";

import {
  buildResendFrom,
  resolveAlertRecipient,
} from "./resendConfig";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type WatchAlertSendResult =
  | { sent: true; id: string; to: string }
  | { sent: false; reason: "disabled" | "skipped" | "error"; detail?: string };

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

  if (!watch.alertEmail?.trim()) {
    console.info("[monitors] alert skipped (no alert email on monitor)", {
      watchId: watch.id,
      proofId,
    });
    return { sent: false, reason: "skipped", detail: "No alert email on monitor." };
  }

  const { from, sandbox } = buildResendFrom();
  const { to, redirected } = resolveAlertRecipient(watch.alertEmail, sandbox);

  if (sandbox && redirected) {
    console.info(
      "[monitors] Resend sandbox: delivering to RESEND_ALERT_OVERRIDE (not the monitor address)",
      { watchId: watch.id },
    );
  }

  if (sandbox && !redirected) {
    console.info(
      "[monitors] Resend sandbox sender: use a verified domain in RESEND_FROM, or set RESEND_ALERT_OVERRIDE to your Resend account email for local testing.",
      { watchId: watch.id, toDomain: to.split("@")[1] ?? "" },
    );
  }

  const proofUrl = proofPublicUrl(proofId);
  const summary = oneLiner?.trim() || "The scheduled verification did not pass.";
  const task = escapeHtml(watch.task);
  const subject = "Provl monitor: verification failed";
  const text = `Verdict: NOT DONE

Task:
${watch.task}

${summary}

Proof: ${proofUrl}`;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
    html: `<p><strong>Verdict:</strong> NOT DONE</p>
<p><strong>Task:</strong> ${task}</p>
<p>${escapeHtml(summary)}</p>
<p><a href="${escapeHtml(proofUrl)}">View proof</a></p>`,
  });

  if (error) {
    const detail = error.message ?? error.name;
    console.warn("[monitors] Resend error", {
      watchId: watch.id,
      name: error.name,
      message: detail,
      sandbox,
    });
    if (error.name === "validation_error" && sandbox) {
      return {
        sent: false,
        reason: "skipped",
        detail:
          "Resend test mode: verify a domain and set RESEND_FROM, or set RESEND_ALERT_OVERRIDE in .env to the email on your Resend account.",
      };
    }
    return { sent: false, reason: "error", detail };
  }

  return { sent: true, id: data!.id, to };
}