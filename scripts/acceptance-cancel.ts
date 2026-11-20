#!/usr/bin/env npx tsx
/**
 * Phase A acceptance: cancel flow on the local demo app (dev server must be reachable).
 */
import { spawn, type ChildProcess } from "node:child_process";

import { runKaneWithRetry } from "../lib/kane/runWithRetry";

const base = process.env.PROVL_DEMO_BASE_URL ?? "http://localhost:3000";
const demoUrl = `${base.replace(/\/$/, "")}/demo/subscription`;

const TASK =
  'Click "Cancel subscription", confirm by clicking "Yes, cancel" in the dialog, then verify the page shows "Subscription canceled".';

async function waitForServer(url: string, ms = 60_000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Demo server not reachable at ${url}`);
}

function startDevServer(): ChildProcess {
  return spawn("npm", ["run", "dev"], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: "3000" },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function main() {
  let dev: ChildProcess | null = null;
  let startedByScript = false;

  try {
    await waitForServer(demoUrl);
    console.log("Demo already running at", demoUrl);
  } catch {
    console.log("Starting Next.js dev server for acceptance run…");
    dev = startDevServer();
    startedByScript = true;
    await waitForServer(demoUrl);
    console.log("Dev server ready.");
  }

  console.log("Running Kane acceptance:", demoUrl);
  const result = await runKaneWithRetry({
    task: TASK,
    url: demoUrl,
    timeoutSeconds: 240,
  });

  const outfile = {
    done: result.done,
    exitCode: result.exitCode,
    replayUrl: result.replayUrl,
    oneLiner: result.oneLiner,
    summary: result.summary,
    finalState: result.finalState,
    attempts: result.attempts,
    honestStop: result.honestStop,
  };

  console.log(JSON.stringify(outfile, null, 2));

  if (startedByScript && dev) {
    dev.kill("SIGTERM");
  }

  process.exit(result.done ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});