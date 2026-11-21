import { NextResponse } from "next/server";

import { listProofsForSession } from "@/lib/proof/store";
import { ensureSessionId } from "@/lib/provl/session";

export async function GET() {
  const sessionId = await ensureSessionId();
  const runs = await listProofsForSession(sessionId);
  return NextResponse.json({ runs });
}