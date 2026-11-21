import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";
import { toPublicWatch } from "@/lib/watches/publicWatch";
import { validateWatchCreate } from "@/lib/watches/validateWatch";
import { encryptWatchSecrets } from "@/lib/watches/watchSecrets";
import { createWatch, listWatches } from "@/lib/watches/watchStore";

export async function GET() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  const watches = await listWatches({ sessionId, userId });
  return NextResponse.json({ watches: watches.map(toPublicWatch) });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateWatchCreate(body as Record<string, unknown>);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  let secretsEnc: string | null = null;
  try {
    secretsEnc = encryptWatchSecrets(parsed.data.secrets);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Could not store monitor secrets";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const watch = await createWatch({
    sessionId,
    userId,
    task: parsed.data.task,
    url: parsed.data.url,
    schedule: parsed.data.schedule,
    alertEmail: parsed.data.alertEmail,
    secretsEnc,
  });

  return NextResponse.json({ watch: toPublicWatch(watch) }, { status: 201 });
}