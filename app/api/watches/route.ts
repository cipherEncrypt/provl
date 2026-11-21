import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";
import { listWatches } from "@/lib/watches/watchStore";

export async function GET() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  const watches = await listWatches({ sessionId, userId });
  return NextResponse.json({ watches });
}