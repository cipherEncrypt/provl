import { NextResponse } from "next/server";

export function unauthorizedCronResponse(): NextResponse | null {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }
  return null;
}

export function verifyCronRequest(req: Request): NextResponse | null {
  const missing = unauthorizedCronResponse();
  if (missing) return missing;

  const secret = process.env.CRON_SECRET!.trim();
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}