function deployPublicBaseUrl(): string {
  const configured = process.env.PROVL_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const render = process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, "");
  if (render) return render;

  const vercel = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Absolute share URL for a proof page (emails, Resend, etc.). */
export function proofPublicUrl(proofId: string): string {
  return `${deployPublicBaseUrl()}/proof/${proofId}`;
}

/** Same as proofPublicUrl when running in the browser without PROVL_PUBLIC_URL. */
export function proofUrlFromOrigin(proofId: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/proof/${proofId}`;
}