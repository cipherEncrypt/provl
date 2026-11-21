import { NextResponse } from "next/server";

import { listRunHistoryForSession } from "@/lib/proof/historyStore";
import { ensureSessionId } from "@/lib/provl/session";

export async function GET() {
  const sessionId = await ensureSessionId();
  const runs = await listRunHistoryForSession(sessionId);
  return NextResponse.json({ runs });
}