import { NextResponse } from "next/server";

import { verifyCronRequest } from "@/lib/cron/authorizeCron";
import { isWatchDue } from "@/lib/watches/schedule";
import { listAllActiveWatches } from "@/lib/watches/watchStore";

import { runWatchJob } from "@/lib/watches/runWatchJob";

export const maxDuration = 600;

const MAX_PER_TICK = 5;

async function runDueWatches() {
  const watches = await listAllActiveWatches();
  const due = watches.filter((w) => isWatchDue(w));
  const batch = due.slice(0, MAX_PER_TICK);
  const skipped = Math.max(0, due.length - batch.length);

  const results: {
    watchId: string;
    done: boolean;
    proofId: string;
    error?: string;
  }[] = [];

  for (const watch of batch) {
    try {
      const { result } = await runWatchJob(watch);
      results.push({
        watchId: watch.id,
        done: result.done,
        proofId: result.proofId,
      });
    } catch {
      results.push({
        watchId: watch.id,
        done: false,
        proofId: "",
        error: "run_failed",
      });
    }
  }

  return NextResponse.json({
    due: due.length,
    ran: results.length,
    skipped,
    results,
  });
}

export async function GET(req: Request) {
  const denied = verifyCronRequest(req);
  if (denied) return denied;
  return runDueWatches();
}

export async function POST(req: Request) {
  const denied = verifyCronRequest(req);
  if (denied) return denied;
  return runDueWatches();
}