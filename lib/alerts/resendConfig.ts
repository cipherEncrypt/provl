/** Email inside `Name <addr@domain>` or bare address. */
export function extractResendEmail(from: string): string {
  const trimmed = from.trim();
  const match = trimmed.match(/<([^>]+)>/);
  return (match?.[1] ?? trimmed).trim().toLowerCase();
}

export function buildResendFrom(): { from: string; sandbox: boolean } {
  let raw = process.env.RESEND_FROM?.trim();
  if (!raw) {
    return { from: "onboarding@resend.dev", sandbox: true };
  }
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1);
  }
  const email = extractResendEmail(raw);
  const sandbox = email.endsWith("@resend.dev");
  if (!raw.includes("<") && /^[^\s@]+@[^\s@]+$/.test(raw)) {
    return { from: raw, sandbox };
  }
  return { from: raw, sandbox };
}

/**
 * Resend sandbox senders can only deliver to your Resend signup email unless
 * you verify a domain. In development, RESEND_ALERT_OVERRIDE redirects alerts.
 */
export function resolveAlertRecipient(
  alertEmail: string,
  sandbox: boolean,
): { to: string; redirected: boolean } {
  const requested = alertEmail.trim();
  const override = process.env.RESEND_ALERT_OVERRIDE?.trim();
  if (sandbox && override) {
    return { to: override, redirected: override.toLowerCase() !== requested.toLowerCase() };
  }
  return { to: requested, redirected: false };
}