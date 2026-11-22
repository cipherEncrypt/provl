/** Absolute share URL for a proof page (emails, Resend, etc.). */
export function proofPublicUrl(proofId: string): string {
  const base =
    process.env.PROVL_PUBLIC_URL?.trim().replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/proof/${proofId}`;
}

/** Same as proofPublicUrl when running in the browser without PROVL_PUBLIC_URL. */
export function proofUrlFromOrigin(proofId: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/proof/${proofId}`;
}