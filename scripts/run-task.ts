#!/usr/bin/env npx tsx
/**
 * Phase A CLI: run a task through Kane (with retry loop) and print a JSON result card payload.
 *
 * Usage:
 *   npm run kane:run -- "verify login form" --url https://the-internet.herokuapp.com/login
 */
import { runKaneWithRetry } from "../lib/kane/runWithRetry";

function parseArgs(argv: string[]) {
  let task = "";
  let url: string | undefined;
  let noRetry = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--url" && argv[i + 1]) {
      url = argv[++i];
    } else if (arg === "--no-retry") {
      noRetry = true;
    } else if (!arg.startsWith("-") && !task) {
      task = arg;
    }
  }

  if (!task) {
    console.error(
      'Usage: npm run kane:run -- "<task objective>" [--url <start-url>] [--no-retry]',
    );
    process.exit(2);
  }

  return { task, url, noRetry };
}

async function main() {
  const { task, url, noRetry } = parseArgs(process.argv.slice(2));

  const { runKane } = await import("../lib/kane/runKane");
  const { buildProvlResult } = await import("../lib/kane/parseNdjson");

  let result;
  if (noRetry) {
    const r = await runKane({ task, url });
    result = buildProvlResult(r.exitCode, r.stdout, r.stderr, 1);
  } else {
    result = await runKaneWithRetry({ task, url });
  }

  const card = {
    done: result.done,
    exitCode: result.exitCode,
    replayUrl: result.replayUrl,
    oneLiner: result.oneLiner,
    summary: result.summary,
    finalState: result.finalState,
    duration: result.duration,
    creditsConsumed: result.creditsConsumed,
    sessionDir: result.sessionDir,
    evidencePackPath: result.evidencePackPath,
    honestStop: result.honestStop,
    attempts: result.attempts,
  };

  console.log(JSON.stringify(card, null, 2));
  process.exit(result.done ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});