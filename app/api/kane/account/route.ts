import { NextResponse } from "next/server";

import { runKaneBalance } from "@/lib/kane/balance";
import {
  getKaneAccount,
  refreshStoredBalance,
} from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";

export async function GET() {
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);

  if (!account) {
    return NextResponse.json({
      connected: false,
      username: null,
      availableCredits: null,
      creditsSpentSession: 0,
      billingMode: "machine",
    });
  }

  let availableCredits = account.availableCredits;
  try {
    const fresh = await runKaneBalance(account.username, account.accessKey);
    if (fresh.ok) {
      availableCredits = fresh.availableCredits;
      await refreshStoredBalance(sessionId, fresh.availableCredits);
    }
  } catch {
    /* use last known balance */
  }

  return NextResponse.json({
    connected: true,
    username: account.username,
    availableCredits,
    creditsSpentSession: account.creditsSpentSession,
    billingMode: "user",
  });
}