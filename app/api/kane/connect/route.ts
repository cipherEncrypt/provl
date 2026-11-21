import { NextResponse } from "next/server";

import { runKaneBalance } from "@/lib/kane/balance";
import { disableMachineDemo } from "@/lib/provl/demoSession";
import { hasEncryptionKey } from "@/lib/provl/crypto";
import {
  deleteKaneAccount,
  saveKaneAccount,
} from "@/lib/provl/kaneAccountStore";
import { ensureSessionId, getSessionId } from "@/lib/provl/session";

export async function POST(req: Request) {
  let body: { username?: string; accessKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = body.username?.trim();
  const accessKey = body.accessKey?.trim();

  if (!username || !accessKey) {
    return NextResponse.json(
      { error: "Username and access key are required." },
      { status: 400 },
    );
  }

  const balance = await runKaneBalance(username, accessKey);
  if (!balance.ok) {
    return NextResponse.json({ error: balance.error }, { status: 401 });
  }

  if (!hasEncryptionKey()) {
    return NextResponse.json(
      {
        error:
          "Server is missing PROVL_ENC_KEY — cannot store credentials safely.",
      },
      { status: 503 },
    );
  }

  const sessionId = await ensureSessionId();
  await disableMachineDemo();
  await saveKaneAccount(sessionId, username, accessKey, balance.availableCredits);

  return NextResponse.json({
    connected: true,
    username,
    availableCredits: balance.availableCredits,
  });
}

export async function DELETE() {
  const sessionId = await getSessionId();
  if (sessionId) {
    await deleteKaneAccount(sessionId);
  }
  return NextResponse.json({ connected: false });
}