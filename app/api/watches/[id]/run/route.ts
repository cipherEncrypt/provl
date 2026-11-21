import { NextResponse } from "next/server";

import { getKaneAccount } from "@/lib/provl/kaneAccountStore";
import { ensureSessionId } from "@/lib/provl/session";
import { runWatchJob } from "@/lib/watches/runWatchJob";
import {
  getWatch,
  watchOwnedBySession,
} from "@/lib/watches/watchStore";

export const maxDuration = 600;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const sessionId = await ensureSessionId();
  const account = await getKaneAccount(sessionId);
  const userId = account?.username?.trim() ?? null;

  const watch = await getWatch(id);
  if (!watch || !watchOwnedBySession(watch, { sessionId, userId })) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const { watch: updated, result } = await runWatchJob(watch);

  return NextResponse.json(
    {
      watch: updated,
      run: {
        done: result.done,
        exitCode: result.exitCode,
        proofId: result.proofId,
        proofUrl: result.proofUrl,
        oneLiner: result.oneLiner,
        summary: result.summary,
        honestStop: result.honestStop,
      },
    },
    { status: result.done ? 200 : 422 },
  );
}