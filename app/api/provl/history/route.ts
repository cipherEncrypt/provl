import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { listRunHistory } from "@/lib/proof/historyStore";
import { ensureSessionId } from "@/lib/provl/session";

export async function GET() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  const runs = await listRunHistory({ sessionId, userId });
  return NextResponse.json({ runs });
}