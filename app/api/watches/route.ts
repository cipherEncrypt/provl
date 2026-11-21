import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";
import { validateWatchCreate } from "@/lib/watches/validateWatch";
import { createWatch, listWatches } from "@/lib/watches/watchStore";

export async function GET() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  const watches = await listWatches({ sessionId, userId });
  return NextResponse.json({ watches });
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

  const watch = await createWatch({
    sessionId,
    userId,
    ...parsed.data,
  });

  return NextResponse.json({ watch }, { status: 201 });
}